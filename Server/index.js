import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http'
import { Server } from 'socket.io'
dotenv.config();

import connectDB from './src/db/database.js';
import authRouter from './src/routes/auth.js';
import pollRouter from './src/routes/poll.js';
import responseRoutes from './src/routes/response.js'
import analyticsRoutes from './src/routes/analytics.js'
import { initSocket } from './src/socket/event.js'

const app = express();
const PORT= process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/polls', pollRouter);
app.use('/api/responses', responseRoutes)
app.use('/api/analytics', analyticsRoutes)

app.use('/api/auth', authRouter);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] }
})

initSocket(io)

// Export io so routes can use it
import { setIO } from './src/socket/socketInstance.js'

// after creating io
setIO(io)

// remove export { io }

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

