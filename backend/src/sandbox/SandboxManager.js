import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { logger } from '../utils/logger.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * SandboxManager
 * 
 * Manages the lifecycle of the temporary workspace on the host machine.
 * This ensures that user code is securely isolated and properly cleaned up
 * to prevent disk exhaustion.
 */
export class SandboxManager {
  constructor(language, code) {
    this.language = language;
    this.code = code;
    this.jobId = uuidv4();
    
    // Create a base path in the OS's temp directory
    this.baseTempDir = os.tmpdir();
    
    // Unique workspace path for this specific job
    this.workspacePath = path.join(this.baseTempDir, `securecloud-run-${this.jobId}`);
  }

  /**
   * Helper to determine file extension based on language.
   * Future implementation: use an ExecutorConfig or Constants map.
   */
  getFileExtension() {
    const extMap = {
      'javascript': 'js',
      'python': 'py',
      'cpp': 'cpp',
      'java': 'java'
    };
    return extMap[this.language] || 'txt';
  }

  /**
   * 1. Create Workspace
   * Generates the isolated directory and writes the user code into it.
   * @returns {string} The absolute path to the workspace
   */
  async setup() {
    try {
      // Create the unique directory
      await fs.mkdir(this.workspacePath, { recursive: true });
      
      // Determine file name
      const fileName = `main.${this.getFileExtension()}`;
      this.filePath = path.join(this.workspacePath, fileName);
      
      // Write the payload to disk
      await fs.writeFile(this.filePath, this.code, 'utf-8');
      
      logger.debug({ workspacePath: this.workspacePath }, 'Sandbox workspace created');
      
      return this.workspacePath;
    } catch (error) {
      logger.error({ err: error, workspacePath: this.workspacePath }, 'Failed to setup sandbox workspace');
      throw new Error(`Sandbox Setup Failed: ${error.message}`);
    }
  }

  /**
   * 2. Cleanup Workspace
   * Recursively deletes the directory and all its contents to free up disk space.
   */
  async cleanup() {
    try {
      if (this.workspacePath) {
        // Forcefully and recursively delete the workspace
        await fs.rm(this.workspacePath, { recursive: true, force: true });
        logger.debug({ workspacePath: this.workspacePath }, 'Sandbox workspace cleaned up');
      }
    } catch (error) {
      logger.error({ err: error, workspacePath: this.workspacePath }, 'Failed to cleanup sandbox workspace');
      // We don't throw here to avoid masking the original job result/error
    }
  }

  /**
   * Get the entrypoint file name
   */
  getEntrypoint() {
    return `main.${this.getFileExtension()}`;
  }
}
