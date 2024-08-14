import { Router } from 'express';
import {
  getMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage,
  searchMessages,
  getMessageCount,
  getUserActivity,
  exportMessages
} from '../controllers/chat.controller';
import { authenticateJWT } from '../middleware/authenticate';

const router = Router();

router.get('/messages', authenticateJWT, getMessages);
router.get('/messages/:id', authenticateJWT, getMessageById);
router.post('/messages', authenticateJWT, createMessage);
router.put('/messages/:id', authenticateJWT, updateMessage);
router.delete('/messages/:id', authenticateJWT, deleteMessage);

router.get('/messages/search', authenticateJWT, searchMessages);
router.get('/messages/count', authenticateJWT, getMessageCount);
router.get('/user/activity', authenticateJWT, getUserActivity);
router.get('/messages/export', authenticateJWT, exportMessages);

export default router;
