import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import subscriptionRoutes from './routes/subscription.route';
import chatRoutes from './routes/chat.route';
import otpRoutes from './routes/otp.routes';
import { chatSocket } from './sockets/chat.socket';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

// Use existing routes
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/otp', otpRoutes);

// Initialize the chat socket
chatSocket(io);

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
