import { Request, Response } from 'express';
import { OTPService } from '../services/otp.service';

const otpService = new OTPService();

export const generateOTP = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const otp = await otpService.generateOTP(userId);
    res.status(201).json({ message: 'OTP sent to your email', otpId: otp.id });
  } catch (err) {
    console.error('Error generating OTP:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { otp } = req.body;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const isValid = await otpService.verifyOTP(userId, otp);
    if (isValid) {
      res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid or expired OTP' });
    }
  } catch (err) {
    console.error('Error verifying OTP:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
