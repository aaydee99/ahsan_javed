import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import subscriptionRoutes from './routes/subscription.route';
import chatRoutes from './routes/chat.route';
import otpRoutes from './routes/otp.routes';
import { chatSocket } from './sockets/chat.socket';
import userRoutes from './routes/user.route';	
import propertyRoutes from './routes/property.route';
import dotenv from 'dotenv';
import multer from 'multer'

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.use(express.json());

// Use existing routes
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/users', userRoutes);
app.use('/api/property', propertyRoutes)


// In your Express server file


// Initialize the chat socket
chatSocket(io);

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
