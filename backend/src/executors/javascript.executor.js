import { BaseExecutor } from './BaseExecutor.js';

/**
 * JavascriptExecutor
 * 
 * Extends the BaseExecutor to provide specific configurations for JavaScript.
 */
export class JavascriptExecutor extends BaseExecutor {
  getLanguage() {
    return 'javascript';
  }

  getDockerImage() {
    return 'node:22-alpine';
  }

  getExecutionCommand(entrypoint) {
    return ['node', entrypoint];
  }
}
