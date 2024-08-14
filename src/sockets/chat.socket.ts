import { Server, Socket } from 'socket.io';
import { ChatService } from '../services/chat.service';
import { UserService } from '../services/user.service';

export const chatSocket = (io: Server) => {
  const chatService = new ChatService();
  const userService = new UserService();

  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    // Send existing messages to the new user
    chatService.getMessages().then(messages => {
      socket.emit('chat history', messages);
    });

    // Handle incoming messages
    socket.on('chat message', async ({ userId, content }) => {
      const user = await userService.getUserById(userId);
      if (user) {
        const message = await chatService.saveMessage(userId, user.username, content);
        io.emit('chat message', message);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
