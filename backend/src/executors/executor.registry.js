import { JavascriptExecutor } from './javascript.executor.js';
import { PythonExecutor } from './python.executor.js';
import { JavaExecutor } from './java.executor.js';
import { CppExecutor } from './cpp.executor.js';
import { RustExecutor } from './rust.executor.js';
import { GoExecutor } from './go.executor.js';

/**
 * Language Registry (OOP)
 * 
 * Maps programming languages directly to their respective Executor Class.
 * Adding a new language is as simple as adding an import and one line below.
 */
export const LanguageRegistry = {
  // JavaScript
  'javascript': JavascriptExecutor,
  'node': JavascriptExecutor,
  'js': JavascriptExecutor,

  // Python
  'python': PythonExecutor,
  'python3': PythonExecutor,
  'py': PythonExecutor,

  // Java
  'java': JavaExecutor,
  
  // C++
  'cpp': CppExecutor,
  'c++': CppExecutor,
  
  // Rust
  'rust': RustExecutor,
  'rs': RustExecutor,
  
  // Go
  'go': GoExecutor,
  'golang': GoExecutor,
};

/**
 * Helper to fetch the correct Executor Class.
 * @param {string} language - The programming language
 * @returns {Class|null} The Executor Class, or null if unsupported
 */
export const getExecutorClass = (language) => {
  if (!language) return null;
  return LanguageRegistry[language.toLowerCase()] || null;
};
