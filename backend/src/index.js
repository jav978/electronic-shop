import 'dotenv/config';
import http from 'node:http';
import app from './app.js';
import { initSocket } from './socket.js';
import './redis.js'; // Ensure Redis connection initializes

const PORT = process.env.PORT || 3030;

const server = http.createServer(app);

// Initialize Socket.io WebSockets
initSocket(server);

server.listen(PORT, () => {
  console.log(`⚡ FeathersJS & Prisma Backend server listening on http://localhost:${PORT}`);
  console.log(`🔌 Real-Time WebSockets Engine ACTIVE on ws://localhost:${PORT}`);
});

process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
});
