import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: config.clientUrl,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Authentication Middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, config.jwtSecret);
      socket.user = decoded; // Attach user payload to socket
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user.userId;
    logger.info({ userId }, `User connected to socket`);

    // Join a unique room for this user to receive private updates
    socket.join(`user_${userId}`);

    socket.on('disconnect', () => {
      logger.info({ userId }, `User disconnected from socket`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized!');
  }
  return io;
};

// Helper for broadcasting events to a specific user
export const emitToUser = (userId, eventName, payload) => {
  if (io) {
    io.to(`user_${userId}`).emit(eventName, payload);
  }
};
