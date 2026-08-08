/**
 * ExecutorFactory
 * 
 * This module is responsible for decoupling language-specific execution 
 * commands from the core Docker orchestration logic.
 * 
 * By using this Factory pattern, we can easily add support for 50+ languages
 * later without ever touching the main Docker Engine code.
 */

export class ExecutorFactory {
  /**
   * Generates the shell command required to execute a specific language inside the container.
   * 
   * @param {string} language - The programming language (e.g. 'python', 'javascript')
   * @param {string} entrypoint - The main file to run (e.g. 'main.py')
   * @returns {string[]} An array of strings representing the command to pass to Docker
   */
  static getExecutionCommand(language, entrypoint) {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'node':
        // For JavaScript, we simply invoke node
        return ['node', entrypoint];
        
      case 'python':
      case 'python3':
        // For Python, we invoke the python interpreter
        return ['python3', entrypoint];
        
      case 'cpp':
      case 'c++':
        // For C++, we must compile it first, then execute the binary
        // Note: Using sh -c allows us to chain commands with &&
        return ['sh', '-c', `g++ ${entrypoint} -o main && ./main`];
        
      case 'java':
        // Java requires compiling the .java file to a .class file, then running the class
        const className = entrypoint.split('.')[0];
        return ['sh', '-c', `javac ${entrypoint} && java ${className}`];
        
      default:
        throw new Error(`Unsupported programming language: ${language}`);
    }
  }

  /**
   * Generates the specific Docker Image required for this language.
   * Currently, we default to node:20-alpine for JavaScript. 
   * In the future, this factory will return different images (e.g. python:3.11-alpine).
   * 
   * @param {string} language - The programming language
   * @returns {string} The docker image tag
   */
  static getDockerImage(language) {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'node':
        return 'node:20-alpine';
      case 'python':
      case 'python3':
        return 'python:3.11-alpine';
      case 'cpp':
      case 'c++':
        return 'gcc:13-alpine';
      case 'java':
        return 'openjdk:21-alpine';
      default:
        // Fallback or generic polyglot image if we decide to build one
        return 'node:20-alpine'; 
    }
  }
}
