import { io } from 'socket.io-client';

/**
 * Socket.IO Configuration
 * 
 * Centralized WebSocket connection. Never hardcodes URLs.
 * Uses environment variables to dynamically connect to the correct backend environment.
 */

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

let socketInstance = null;

export const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      autoConnect: true,
      withCredentials: true,
      // Reconnection strategies can be added here
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    
    socketInstance.on('connect', () => {
      console.log(`Connected to Socket.IO Server: ${SOCKET_URL}`);
    });
    
    socketInstance.on('disconnect', (reason) => {
      console.warn('Disconnected from Socket.IO Server:', reason);
    });
  }
  
  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};
