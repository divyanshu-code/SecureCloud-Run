/**
 * Output Handler
 * 
 * Standardizes the execution result payload across all programming languages.
 * Ensures that the API always returns a consistent structure containing logs,
 * timings, and exit codes.
 */
export const outputHandler = {
  /**
   * Format the final execution result
   * 
   * @param {Object} params
   * @param {string} params.stdout - Standard output from the execution
   * @param {string} params.stderr - Standard error (e.g. compilation or runtime errors)
   * @param {number} params.exitCode - The OS-level exit code from the process
   * @param {number} params.executionTimeMs - Total time taken in milliseconds
   * @param {number|null} params.memoryUsageMb - Peak memory used in MB
   * @param {Error|null} params.systemError - Any internal infrastructure errors
   * @returns {Object} Standardized execution result
   */
  formatResult({ stdout = '', stderr = '', exitCode = 0, executionTimeMs = 0, memoryUsageMb = null, systemError = null }) {
    let finalStderr = stderr.trim();
    let finalSystemError = systemError ? systemError.message : null;

    // Catch OOM (137) or Thread Limits (Resource temporarily unavailable)
    if (exitCode === 137 || finalStderr.includes('Resource temporarily unavailable')) {
      finalStderr = "Program terminated: Exceeded 512MB RAM or 250 thread limit. Upgrade to Premium for higher limits.";
      finalSystemError = null;
    } else if (finalSystemError && finalSystemError.includes('Execution Timeout')) {
      finalStderr = "Program terminated: Exceeded maximum CPU execution time. Upgrade to Premium for higher limits.";
      finalSystemError = null;
    }

    const combinedOutput = stdout.trim() || finalStderr;

    return {
      output: combinedOutput,
      stdout: stdout.trim(),
      stderr: finalStderr,
      exitCode,
      executionTimeMs,
      memoryUsageMb, 
      isError: exitCode !== 0 || !!finalSystemError || finalStderr.length > 0,
      systemError: finalSystemError,
    };
  }
};
