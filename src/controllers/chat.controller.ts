import { Request, Response } from 'express';
import { ChatService } from '../services/chat.service';
import { parse } from 'json2csv';

const chatService = new ChatService();

export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await chatService.getMessages();
    res.status(200).json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMessageById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const message = await chatService.getMessageById(Number(id));
    if (message) {
      res.status(200).json(message);
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (err) {
    console.error('Error fetching message:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createMessage = async (req: Request, res: Response) => {
  const { content } = req.body;
  const userId = req.user?.id;
  const username = req.user?.username;

  if (!userId || !username) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const message = await chatService.saveMessage(userId, username, content);
    res.status(201).json(message);
  } catch (err) {
    console.error('Error creating message:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateMessage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const message = await chatService.updateMessage(Number(id), userId, content);
    if (message) {
      res.status(200).json(message);
    } else {
      res.status(404).json({ message: 'Message not found or not authorized' });
    }
  } catch (err) {
    console.error('Error updating message:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    await chatService.deleteMessage(Number(id), userId);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting message:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const searchMessages = async (req: Request, res: Response) => {
  const { q } = req.query;
  try {
    const messages = await chatService.searchMessages(q as string);
    res.status(200).json(messages);
  } catch (err) {
    console.error('Error searching messages:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMessageCount = async (req: Request, res: Response) => {
  try {
    const count = await chatService.getMessageCount();
    res.status(200).json({ count });
  } catch (err) {
    console.error('Error counting messages:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserActivity = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const messages = await chatService.getUserActivity(userId);
    res.status(200).json(messages);
  } catch (err) {
    console.error('Error fetching user activity:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const exportMessages = async (req: Request, res: Response) => {
  try {
    const messages = await chatService.getMessages();
    const csv = parse(messages, { fields: ['id', 'user_id', 'username', 'content', 'timestamp'] });
    res.header('Content-Type', 'text/csv');
    res.attachment('chat_messages.csv');
    return res.send(csv);
  } catch (err) {
    console.error('Error exporting messages:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
