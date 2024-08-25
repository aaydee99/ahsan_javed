import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

const userService = new UserService();

export const registerUser = async (req: Request, res: Response) => {
  const { fullname, phoneno, city, password, email, country } = req.body;

  try {
    const user = await userService.registerUser(fullname, phoneno, city, password, email, country);
    res.status(201).json(user);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const loginUserByPhone = async (req: Request, res: Response) => {
  const { phoneno, password } = req.body;

  try {
    const user = await userService.authenticateUserByPhone(phoneno, password);

    if (!user) {
      return res.status(400).json({ error: 'Invalid phone number or password' });
    }

    res.status(200).json({ id: user.id, fullname: user.fullname, phoneno: user.phoneno, city: user.city, email: user.email, country: user.country });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
