import { BaseExecutor } from './BaseExecutor.js';

/**
 * JavaExecutor
 * 
 * Extends the BaseExecutor for Java-specific multi-step compilation.
 */
export class JavaExecutor extends BaseExecutor {
  getLanguage() {
    return 'java';
  }

  getDockerImage() {
    return 'eclipse-temurin:21-jdk';
  }

  getExecutionCommand(entrypoint) {
    // Java requires compilation first, then execution
    return ['sh', '-c', `javac ${entrypoint} && java Main`];
  }

  getMountPermissions() {
    // Java compiler needs Read-Write access to output the .class file
    return 'rw';
  }
}
