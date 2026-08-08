import { io } from 'socket.io-client';
import useAuthStore from '@/src/store/useAuthStore';
import { useExecutionStore } from '@/src/store/execution.store';
import { executionService } from '@/src/services/execution.service';

let socket = null;

export const initSocket = () => {
  if (socket) return socket;

  const token = useAuthStore.getState().token;

  if (!token) {
    console.warn('Socket connection failed: No JWT token found in auth store.');
    return null;
  }

  socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
    auth: {
      token,
    },
    transports: ['websocket'],
    reconnection: true, // Auto reconnect
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  // Store connection instance in Zustand
  useExecutionStore.getState().setSocketConnection(socket);

  // --- Core Lifecycle Events ---
  socket.on('connect', () => {
    console.log('Socket connected successfully');
  });

  socket.on('disconnect', (reason) => {
    console.warn(`Socket disconnected: ${reason}`);
  });

  socket.on('connect_error', (err) => {
    console.error('Socket Connection Error:', err.message);
    if (err.message.includes('Authentication error')) {
      // Disconnect and wipe token if auth fails (e.g. expired)
      socket.disconnect();
      useAuthStore.getState().logout();
    }
  });

  // --- Execution Queue Events ---

  socket.on('job:started', (data) => {
    const { executionStatus } = useExecutionStore.getState();
    if (executionStatus !== 'failed' && executionStatus !== 'completed') {
      useExecutionStore.getState().setExecutionStatus('queued');
    }
  });

  socket.on('job:running', (data) => {
    useExecutionStore.getState().setExecutionStatus('running');
  });

  socket.on('job:completed', async (data) => {
    // data.result should be the output string or object
    const outputString = typeof data.result === 'object' ? JSON.stringify(data.result, null, 2) : String(data.result || '');
    useExecutionStore.getState().setExecutionOutput(outputString);

    // Fetch full metrics
    try {
      const fullJob = await executionService.getJob(data.jobId);
      useExecutionStore.getState().setExecutionMetrics(fullJob);
    } catch (err) {
      console.error('Failed to fetch detailed job metrics', err);
    }

    useExecutionStore.getState().setExecutionStatus('completed');
  });

  socket.on('job:failed', async (data) => {
    const errorString = typeof data.error === 'object' ? JSON.stringify(data.error, null, 2) : String(data.error || 'Unknown error');
    useExecutionStore.getState().setExecutionError(errorString);

    // Fetch full metrics
    try {
      const fullJob = await executionService.getJob(data.jobId);
      useExecutionStore.getState().setExecutionMetrics(fullJob);
    } catch (err) {
      console.error('Failed to fetch detailed job metrics', err);
    }

    useExecutionStore.getState().setExecutionStatus('failed');
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    useExecutionStore.getState().setSocketConnection(null);
  }
};
