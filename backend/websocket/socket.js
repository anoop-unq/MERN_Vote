// websocket/socket.js
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.js';
let io;

export const initWebSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-production-domain.com'] 
        : ['http://localhost:5173'],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Authentication middleware for WebSocket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }
      
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const user = await userModel.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('Authentication error'));
      }
      
      socket.userId = user._id;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.userId);
    
    // Join a poll room
    socket.on('joinPoll', (pollId) => {
      socket.join(pollId);
      console.log(`User ${socket.userId} joined poll room ${pollId}`);
    });
    
    // Leave a poll room
    socket.on('leavePoll', (pollId) => {
      socket.leave(pollId);
      console.log(`User ${socket.userId} left poll room ${pollId}`);
    });
    
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.userId);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};