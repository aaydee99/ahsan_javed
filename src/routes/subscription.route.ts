import { Router } from 'express';
import {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
  filterSubscriptionsByPlan,
  getTotalRevenue,
  getUserSubscriptionSummary,
  exportSubscriptions
} from '../controllers/subscription.controller';
import { authenticateJWT } from '../middleware/authenticate';

const router = Router();

router.post('/', authenticateJWT, createSubscription);
router.get('/', authenticateJWT, getAllSubscriptions);
router.get('/:id', authenticateJWT, getSubscriptionById);
router.put('/:id', authenticateJWT, updateSubscription);
router.delete('/:id', authenticateJWT, deleteSubscription);

router.get('/filter', authenticateJWT, filterSubscriptionsByPlan);
router.get('/revenue', authenticateJWT, getTotalRevenue);
router.get('/user/summary', authenticateJWT, getUserSubscriptionSummary);
router.get('/export', authenticateJWT, exportSubscriptions);

export default router;
