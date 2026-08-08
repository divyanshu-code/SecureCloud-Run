import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger.js';

/**
 * File Manager
 * 
 * Responsibilities:
 * - Generate Temporary Directory
 * - Generate Unique File Names
 * - Write User Code
 * - Clean Temporary Files
 */
export const fileManager = {
  /**
   * Helper to determine file extension based on language.
   * @param {string} language - The programming language
   * @returns {string} The file extension
   */
  getFileExtension(language) {
    const extMap = {
      'javascript': 'js',
      'node': 'js',
      'python': 'py',
      'python3': 'py',
      'java': 'java',
      'cpp': 'cpp',
      'c++': 'cpp',
      'rust': 'rs',
      'rs': 'rs',
      'go': 'go',
      'golang': 'go',
    };
    return extMap[language.toLowerCase()] || 'txt';
  },

  /**
   * Generates a temporary directory, creates a unique file for the language,
   * and writes the user's code to it.
   * 
   * @param {string} code - The user's code
   * @param {string} language - The programming language
   * @returns {Promise<{ workspacePath: string, filePath: string, entrypoint: string }>}
   */
  async setupWorkspace(code, language) {
    const jobId = uuidv4();
    
    // Generate Temporary Directory in the OS temp folder
    const baseTempDir = os.tmpdir();
    const workspacePath = path.join(baseTempDir, `securecloud-run-${jobId}`);
    
    try {
      await fs.mkdir(workspacePath, { recursive: true });
      
      // Generate Unique File Name
      // For Java, the class name often must match the file name, 
      // but 'Main.java' is a safe standard if we force the user to use class Main
      const entrypoint = language.toLowerCase() === 'java' 
        ? 'Main.java' 
        : `main.${this.getFileExtension(language)}`;
        
      const filePath = path.join(workspacePath, entrypoint);
      
      // Write User Code
      await fs.writeFile(filePath, code, 'utf-8');
      
      logger.debug({ workspacePath, language }, 'Temporary workspace created and code written');
      
      return {
        workspacePath,
        filePath,
        entrypoint
      };
    } catch (error) {
      logger.error({ err: error, workspacePath }, 'Failed to setup file manager workspace');
      throw new Error(`File Manager Setup Failed: ${error.message}`);
    }
  },

  /**
   * Clean Temporary Files
   * Recursively deletes the directory and all its contents to free up disk space.
   * 
   * @param {string} workspacePath - The path to the directory to delete
   */
  async cleanupWorkspace(workspacePath) {
    if (!workspacePath) return;
    
    try {
      await fs.rm(workspacePath, { recursive: true, force: true });
      logger.debug({ workspacePath }, 'Temporary workspace cleaned up successfully');
    } catch (error) {
      logger.error({ err: error, workspacePath }, 'Failed to cleanup temporary workspace');
      // We don't throw here to avoid masking the original job result/error
    }
  }
};
