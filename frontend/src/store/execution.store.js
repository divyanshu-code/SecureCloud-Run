import { create } from 'zustand';

/**
 * Execution Store
 * 
 * Manages the live execution context for the code sandbox and real-time socket connections.
 * 
 * State Properties:
 * - currentJob (Object | null): The metadata for the job currently being executed (job ID, language, code).
 * - executionStatus (String): The real-time state of the current run ('idle' | 'queued' | 'running' | 'completed' | 'failed').
 * - executionOutput (String): The real-time stdout/stderr stream from the running code.
 * - executionError (String | null): Hard system or compilation errors that prevented execution.
 * - socketConnection (Object | null): A reference to the active Socket.io client instance for real-time bidirectional telemetry.
 */
export const useExecutionStore = create((set, get) => ({
  currentJob: null,
  executionStatus: 'idle', // 'idle' | 'queued' | 'running' | 'completed' | 'failed'
  executionOutput: '',
  executionError: '',
  executionMetrics: null, // Holds structured JSON metrics (stdout, stderr, exitCode, etc)
  socketConnection: null,

  setCurrentJob: (job) => set({ currentJob: job }),
  setExecutionStatus: (status) => set({ executionStatus: status }),
  setExecutionOutput: (output) => set({ executionOutput: output }),
  setExecutionError: (error) => set({ executionError: error }),
  setExecutionMetrics: (metrics) => set({ executionMetrics: metrics }),
  setSocketConnection: (socket) => set({ socketConnection: socket }),

  appendOutput: (chunk) => set((state) => ({
    executionOutput: state.executionOutput + chunk
  })),

  resetExecution: () => set({
    currentJob: null,
    executionStatus: 'idle',
    executionOutput: '',
    executionError: null,
  })
}));
