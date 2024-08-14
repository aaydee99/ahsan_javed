import { Router } from 'express';
import { generateOTP, verifyOTP } from '../controllers/otp.controller';
import { authenticateJWT } from '../middleware/authenticate';

const router = Router();

router.post('/generate', authenticateJWT, generateOTP);
router.post('/verify', authenticateJWT, verifyOTP);

export default router;
