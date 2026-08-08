import { BaseExecutor } from './BaseExecutor.js';

/**
 * GoExecutor
 * 
 * Extends the BaseExecutor for Go execution.
 */
export class GoExecutor extends BaseExecutor {
  getLanguage() {
    return 'go';
  }

  getDockerImage() {
    return 'golang:1.22-alpine';
  }

  getExecutionCommand(entrypoint) {
    // Compile and run the go file. 
    return ['go', 'run', entrypoint];
  }

  getMountPermissions() {
    // Go might need rw for caching modules or temporary builds, but `go run` inside a container is okay.
    return 'rw';
  }
}
