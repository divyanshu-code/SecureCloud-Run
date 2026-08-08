import { BaseExecutor } from './BaseExecutor.js';

/**
 * PythonExecutor
 * 
 * Extends the BaseExecutor to provide specific configurations for Python.
 */
export class PythonExecutor extends BaseExecutor {
  getLanguage() {
    return 'python';
  }

  getDockerImage() {
    return 'python:3.12-alpine';
  }

  getExecutionCommand(entrypoint) {
    return ['python', entrypoint];
  }
}
