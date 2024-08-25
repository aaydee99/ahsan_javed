import { Router } from 'express';
import { loginUserByPhone, registerUser } from '../controllers/user.controller';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUserByPhone); // Now using phone number and password

export default router;
