import { config } from '../config/env.js';

/**
 * Docker Configuration & Security Boundaries
 * 
 * This file defines the global constraints applied to every Docker container
 * we spin up. These limits prevent users from writing malicious code that 
 * could crash the host system (e.g. fork bombs, infinite memory allocation).
 */
export const dockerConfig = {
  // Global defaults
  defaultImage: 'node:20-alpine', // Base lightweight image
  
  // Security Limits
  limits: {
    // Memory limit in megabytes (e.g., 256MB)
    memory: config.execution.maxMemoryMb * 1024 * 1024,
    
    // CPU limitation (e.g., 0.5 means half of a single CPU core)
    cpus: config.execution.maxCpuCores,
    
    // Maximum bytes the container can write to disk (prevents disk exhaustion attacks)
    diskQuota: '50M',
    
    // Hard execution timeout (ms)
    timeoutMs: config.execution.timeoutMs,
  },

  // Security Flags
  securityOpts: [
    'no-new-privileges', // Prevent processes from gaining more privileges than their parent
  ],
  
  // Network constraint - we completely disable internet access inside the container
  // so malicious code cannot make outbound HTTP requests or participate in DDoS.
  networkMode: 'none',
};

/**
 * Helper to generate container creation options
 * @param {string} hostVolumePath - The temporary path on the host to mount
 * @param {string} containerMountPath - Where it mounts inside the container
 */
export const getContainerOptions = (hostVolumePath, containerMountPath = '/app') => {
  return {
    Image: dockerConfig.defaultImage,
    NetworkDisabled: true, // Double enforce no network
    HostConfig: {
      Memory: dockerConfig.limits.memory,
      NanoCPUs: dockerConfig.limits.cpus * 1000000000,
      SecurityOpt: dockerConfig.securityOpts,
      Binds: [
        // Mount the host directory to the container directory as Read-Only (ro)
        `${hostVolumePath}:${containerMountPath}:ro`
      ],
      AutoRemove: true, // Tell Docker daemon to automatically delete container when it stops
    }
  };
};
