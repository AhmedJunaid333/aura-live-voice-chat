import express from 'express';
import http from 'http';
import helmet from 'helmet';
import { ENV } from './config/env.js';
import { corsMiddleware } from './config/cors.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { initSocketServer } from './websocket/socketServer.js';

// Import Routes
import { authRouter } from './routes/auth.routes.js';
import { usersRouter } from './routes/users.routes.js';
import { liveRouter } from './routes/live.routes.js';
import { resellerRouter } from './routes/reseller.routes.js';
import { adminRouter } from './routes/admin.routes.js';
import { walletRouter } from './routes/wallet.routes.js';
import { chatRouter } from './routes/chat.routes.js';
import { withdrawalRouter } from './routes/withdrawal.routes.js';
import { followRouter } from './routes/follow.routes.js';
import { visitorRouter } from './routes/visitor.routes.js';
import { notificationRouter } from './routes/notification.routes.js';
import { storeRouter } from './routes/store.routes.js';
import { familyRouter } from './routes/family.routes.js';
import { momentRouter } from './routes/moment.routes.js';
import { frameRouter } from './routes/frame.routes.js';

const app = express();
const httpServer = http.createServer(app);

// Initialize Socket.IO Realtime Gateway
const io = initSocketServer(httpServer);

// Security & Parsing Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(corsMiddleware);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static('uploads'));
app.use('/api', apiLimiter);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    server: 'Aura Live Enterprise Backend',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    agoraConfigured: Boolean(ENV.AGORA_APP_ID),
  });
});

// Mount Production API Routes
app.use('/api/auth', authRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/live', liveRouter);
app.use('/api/v1/live', liveRouter);
app.use('/api/rooms', liveRouter);
app.use('/api/v1/rooms', liveRouter);
app.use('/api/reseller', resellerRouter);
app.use('/api/v1/reseller', resellerRouter);
app.use('/api/admin', adminRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/wallet', walletRouter);
app.use('/api/v1/wallet', walletRouter);
app.use('/api/withdrawal', withdrawalRouter);
app.use('/api/v1/withdrawal', withdrawalRouter);
app.use('/api/chat', chatRouter);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/users', followRouter);
app.use('/api/v1/users', visitorRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/api/v1/store', storeRouter);
app.use('/api/families', familyRouter);
app.use('/api/v1/families', familyRouter);
app.use('/api/moments', momentRouter);
app.use('/api/v1/moments', momentRouter);
app.use('/api/frames', frameRouter);
app.use('/api/v1/frames', frameRouter);


// Global Error Handler
app.use(errorHandler);

// Start Server
const PORT = ENV.PORT;
httpServer.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 AURA LIVE PRODUCTION BACKEND RUNNING ON PORT ${PORT}`);
  console.log(`📡 WebSocket Realtime Gateway (Socket.IO) Active`);
  console.log(`🎙️ Agora RTC Engine Configured (App ID: ${ENV.AGORA_APP_ID})`);
  console.log(`🌐 Health Check: http://localhost:${PORT}/health`);
  console.log(`====================================================`);
});
