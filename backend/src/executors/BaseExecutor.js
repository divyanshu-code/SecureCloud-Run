import { fileManager } from '../sandbox/file.manager.js';
import { containerManager } from '../sandbox/container.manager.js';
import { outputHandler } from '../sandbox/output.handler.js';
import { logger } from '../utils/logger.js';
import { performance } from 'perf_hooks';

/**
 * BaseExecutor (Abstract Class)
 * 
 * This foundational class encapsulates the universal boilerplate required to 
 * execute user code in a Docker container. Specific language executors simply 
 * extend this class and override the abstract getters.
 */
export class BaseExecutor {
  constructor() {
    if (new.target === BaseExecutor) {
      throw new TypeError("Cannot construct Abstract instances directly");
    }
  }

  /**
   * [Abstract] Returns the programming language identifier (e.g. 'javascript')
   */
  getLanguage() {
    throw new Error("Method 'getLanguage()' must be implemented.");
  }

  /**
   * [Abstract] Returns the exact Docker Image tag (e.g. 'node:22-alpine')
   */
  getDockerImage() {
    throw new Error("Method 'getDockerImage()' must be implemented.");
  }

  /**
   * [Abstract] Returns the command array to execute in the container
   * @param {string} entrypoint - The main file name
   */
  getExecutionCommand(entrypoint) {
    throw new Error("Method 'getExecutionCommand()' must be implemented.");
  }

  /**
   * [Overrideable] Returns volume mount permissions. 
   * Defaults to Read-Only ('ro'). Compiled languages like Java can override this to 'rw'.
   */
  getMountPermissions() {
    return 'ro';
  }

  /**
   * Universal Execution Lifecycle
   * 
   * @param {string} sourceCode - The raw user code
   * @returns {Promise<Object>} The standardized output result
   */
  async execute(sourceCode) {
    let workspace;
    let container;
    
    const startTime = performance.now();
    const language = this.getLanguage();
    
    try {
      // 1. Setup Workspace (File Manager)
      workspace = await fileManager.setupWorkspace(sourceCode, language);
      
      const hostMountPath = workspace.workspacePath;
      const containerMountPath = '/app';
      
      // 2. Prepare Docker Configuration
      const containerOptions = {
        Image: this.getDockerImage(),
        WorkingDir: containerMountPath,
        HostConfig: {
          Binds: [
            `${hostMountPath}:${containerMountPath}:${this.getMountPermissions()}`
          ],
          AutoRemove: false, 
          NetworkMode: 'none',
          Memory: 536870912, // 512MB
          NanoCPUs: 1000000000, // 1 CPU core
          PidsLimit: 250,
          CapDrop: ['ALL'],
          SecurityOpt: ['no-new-privileges']
        }
      };
      
      // 3. Start Container (Container Manager)
      const executionCommand = this.getExecutionCommand(workspace.entrypoint);
      container = await containerManager.acquireContainer(containerOptions, executionCommand);
      
      // 4. Capture Output & Enforce Timeout
      const { stdout, stderr, exitCode, memoryUsageMb } = await containerManager.captureLogs(container);
      
      const executionTimeMs = Math.round(performance.now() - startTime);
      
      return outputHandler.formatResult({
        stdout,
        stderr,
        exitCode,
        executionTimeMs,
        memoryUsageMb,
        systemError: null
      });
      
    } catch (error) {
      logger.error({ err: error, language }, `Execution failed (Infrastructure Error)`);
      
      const executionTimeMs = Math.round(performance.now() - startTime);
      
      return outputHandler.formatResult({
        executionTimeMs,
        systemError: error
      });
    } finally {
      // 5. Cleanup
      if (container) {
        await containerManager.releaseContainer(container);
      }
      
      if (workspace && workspace.workspacePath) {
        await fileManager.cleanupWorkspace(workspace.workspacePath);
      }
    }
  }
}
