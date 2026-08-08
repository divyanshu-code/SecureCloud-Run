import { BaseExecutor } from './BaseExecutor.js';

/**
 * CppExecutor
 * 
 * Extends the BaseExecutor for C++ execution using GCC.
 */
export class CppExecutor extends BaseExecutor {
  getLanguage() {
    return 'cpp';
  }

  getDockerImage() {
    return 'gcc:13-bookworm';
  }

  getExecutionCommand(entrypoint) {
    // Compile to an executable named 'main', then run it.
    return ['sh', '-c', `g++ ${entrypoint} -o main && ./main`];
  }

  getMountPermissions() {
    // C++ requires Read-Write access to output the compiled binary
    return 'rw';
  }
}
