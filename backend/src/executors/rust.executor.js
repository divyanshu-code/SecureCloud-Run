import { BaseExecutor } from './BaseExecutor.js';

/**
 * RustExecutor
 * 
 * Extends the BaseExecutor for Rust execution using rustc.
 */
export class RustExecutor extends BaseExecutor {
  getLanguage() {
    return 'rust';
  }

  getDockerImage() {
    return 'rust:1.77-slim';
  }

  getExecutionCommand(entrypoint) {
    // Compile to an executable named 'main', then run it.
    return ['sh', '-c', `rustc ${entrypoint} && ./main`];
  }

  getMountPermissions() {
    // Rust requires Read-Write access to output the compiled binary
    return 'rw';
  }
}
