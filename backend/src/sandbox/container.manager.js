import Docker from 'dockerode';
import { logger } from '../utils/logger.js';
import stream from 'stream';

/**
 * Initialize Docker daemon connection.
 * By default, this uses the local Docker socket (/var/run/docker.sock on Linux/Mac).
 * Future architecture: This can be easily swapped to connect to a remote Docker Swarm
 * or gVisor runtime by passing `{ socketPath: '/run/runsc/docker.sock' }` or similar.
 */
const docker = new Docker();

// In-Memory cache of verified Docker images to avoid unnecessary daemon checks
const verifiedImages = new Set();

/**
 * Container Manager
 * 
 * Responsibilities:
 * - Start Container
 * - Stop Container
 * - Remove Container
 * - Copy Files
 * - Capture Logs
 */
export const containerManager = {
  /**
   * Ensure Docker Image Exists (with caching)
   * 
   * Verifies if an image exists locally. If not, pulls it from Docker Hub.
   * Uses an in-memory Set to guarantee we only ever query the daemon once per image.
   * 
   * @param {string} imageName - e.g., 'node:22-alpine'
   */
  async ensureImageExists(imageName) {
    if (verifiedImages.has(imageName)) {
      return; // Cache hit: Zero overhead
    }

    try {
      // Check if the daemon has it
      await docker.getImage(imageName).inspect();
      verifiedImages.add(imageName); // Cache it
    } catch (error) {
      if (error.statusCode === 404) {
        logger.info({ imageName }, 'Image not found locally. Pulling from Docker Hub...');
        
        // Pull the image stream
        const stream = await docker.pull(imageName);
        
        // Wait for the pull stream to finish
        await new Promise((resolve, reject) => {
          docker.modem.followProgress(stream, (err, res) => {
            if (err) return reject(err);
            resolve(res);
          });
        });
        
        logger.info({ imageName }, 'Successfully pulled Docker image');
        verifiedImages.add(imageName); // Cache it
      } else {
        throw new Error(`Failed to inspect image: ${error.message}`);
      }
    }
  },

  /**
   * Acquire Container (Warm Pool Abstraction Phase 1)
   * 
   * Currently: Ensures image exists, then does a cold start.
   * Future: Will pull a running container from an array of pre-warmed instances.
   */
  async acquireContainer(containerOptions, executionCommand) {
    await this.ensureImageExists(containerOptions.Image);
    return await this.startContainer(containerOptions, executionCommand);
  },

  /**
   * Release Container (Warm Pool Abstraction Phase 1)
   * 
   * Currently: Does a cold teardown (stop + remove).
   * Future: Will scrub the container and return it to the warm pool array.
   */
  async releaseContainer(container) {
    if (!container) return;
    await this.stopContainer(container);
    await this.removeContainer(container);
  },

  /**
   * Start Container (Cold Start)
   * 
   * Docker Command Equivalent:
   * $ docker run -d --memory="256m" --cpus="0.5" --network="none" -v /host/path:/app:ro node:20-alpine sh -c "node main.js"
   * 
   * This method asks the Docker daemon to create and start a secure, isolated container.
   * 
   * @param {Object} containerOptions - Base security and mount options (from docker.config.js)
   * @param {string[]} executionCommand - The language-specific command (from ExecutorFactory)
   * @returns {Promise<Object>} The started container instance
   */
  async startContainer(containerOptions, executionCommand) {
    try {
      // 1. Create the container (Docker equivalent: docker create)
      const container = await docker.createContainer({
        ...containerOptions,
        Cmd: executionCommand,
      });

      // 2. Start the container (Docker equivalent: docker start <id>)
      await container.start();
      
      logger.debug({ containerId: container.id }, 'Docker container started successfully');
      return container;
    } catch (error) {
      logger.error({ err: error }, 'Failed to start Docker container');
      throw new Error(`Container Start Failed: ${error.message}`);
    }
  },

  /**
   * Stop Container
   * 
   * Docker Command Equivalent:
   * $ docker stop <container_id>
   * 
   * Gracefully shuts down a container (sends SIGTERM, then SIGKILL if it times out).
   * 
   * @param {Object} container - The dockerode container instance
   */
  async stopContainer(container) {
    if (!container) return;
    try {
      await container.stop();
      logger.debug({ containerId: container.id }, 'Docker container stopped');
    } catch (error) {
      // 304 means the container is already stopped, which is fine
      if (error.statusCode !== 304) {
        logger.error({ err: error, containerId: container.id }, 'Failed to stop container');
      }
    }
  },

  /**
   * Remove Container
   * 
   * Docker Command Equivalent:
   * $ docker rm -f <container_id>
   * 
   * Forcefully removes the container from the host system, freeing up daemon resources.
   * Note: If AutoRemove: true is set in containerOptions, the daemon does this automatically.
   * 
   * @param {Object} container - The dockerode container instance
   */
  async removeContainer(container) {
    if (!container) return;
    try {
      await container.remove({ force: true });
      logger.debug({ containerId: container.id }, 'Docker container removed');
    } catch (error) {
      // 404 means the container is already removed (likely via AutoRemove)
      if (error.statusCode !== 404) {
        logger.error({ err: error, containerId: container.id }, 'Failed to remove container');
      }
    }
  },

  /**
   * Copy Files (Into Container)
   * 
   * Docker Command Equivalent:
   * $ docker cp /local/path <container_id>:/container/path
   * 
   * Note: In our current architecture, we use Read-Only Volume Mounts (-v) instead of `docker cp`. 
   * Volume mounts are significantly faster and use zero extra disk space because they share 
   * the host directory directly. However, this method is provided if we need to inject 
   * config files directly into a running container without mounting.
   * 
   * @param {Object} container - The dockerode container instance
   * @param {string} tarStream - A tarball stream of the file(s) to copy
   * @param {string} destinationPath - Where inside the container to put it
   */
  async copyFiles(container, tarStream, destinationPath) {
    try {
      await container.putArchive(tarStream, { path: destinationPath });
      logger.debug({ containerId: container.id, destinationPath }, 'Files copied to container');
    } catch (error) {
      logger.error({ err: error, containerId: container.id }, 'Failed to copy files to container');
      throw error;
    }
  },

  /**
   * Capture Logs & Enforce Timeout
   * 
   * Docker Command Equivalent:
   * $ docker wait <container_id> && docker logs <container_id>
   * 
   * @param {Object} container - The dockerode container instance
   * @param {number} timeoutMs - Maximum execution time before killing (default: 10000ms)
   * @returns {Promise<{ stdout: string, stderr: string, exitCode: number }>}
   */
  async captureLogs(container, timeoutMs = 10000) {
    try {
      // Create a timeout promise to enforce execution limits (e.g. infinite loops)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Execution Timeout: Code exceeded maximum allowed runtime.')), timeoutMs);
      });

      // Capture live memory stats
      let maxMemoryBytes = 0;
      let statsStream;
      try {
        statsStream = await container.stats();
        statsStream.on('data', (chunk) => {
          try {
            const stats = JSON.parse(chunk.toString('utf8'));
            if (stats.memory_stats && stats.memory_stats.usage) {
              maxMemoryBytes = Math.max(maxMemoryBytes, stats.memory_stats.usage);
            }
          } catch (e) {} // ignore partial JSON chunks
        });
      } catch (e) {
        logger.warn('Could not attach stats stream');
      }

      // Race container wait against the timeout
      const status = await Promise.race([
        container.wait(),
        timeoutPromise
      ]);
      
      // Stop the stats stream
      if (statsStream) {
        statsStream.destroy();
      }
      
      // Fetch the logs
      const logStream = await container.logs({
        stdout: true,
        stderr: true,
        follow: true,
      });

      return new Promise((resolve, reject) => {
        let stdoutData = '';
        let stderrData = '';
        
        const stdoutStream = new stream.PassThrough();
        const stderrStream = new stream.PassThrough();
        
        stdoutStream.on('data', (chunk) => stdoutData += chunk.toString('utf8'));
        stderrStream.on('data', (chunk) => stderrData += chunk.toString('utf8'));
        
        container.modem.demuxStream(logStream, stdoutStream, stderrStream);
        
        logStream.on('end', () => {
          // We NO LONGER THROW on non-zero exit codes. A non-zero exit code means 
          // the user wrote bad code, not that the infrastructure failed.
          resolve({
            stdout: stdoutData.trim(),
            stderr: stderrData.trim(),
            exitCode: status.StatusCode,
            memoryUsageMb: maxMemoryBytes > 0 ? Number((maxMemoryBytes / (1024 * 1024)).toFixed(2)) : null
          });
        });
        
        logStream.on('error', (err) => reject(err));
      });
    } catch (error) {
      // If it timed out, we must forcefully stop it before returning the error.
      if (error.message.includes('Execution Timeout')) {
        await this.stopContainer(container); // The executor will handle removeContainer in its finally block
      }
      logger.error({ err: error, containerId: container.id }, 'Failed to capture container logs or timed out');
      throw error;
    }
  }
};
