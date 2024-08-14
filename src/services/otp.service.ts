import { query } from '../db';
import { OTP } from '../models/otp.model';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export class OTPService {
  async generateOTP(userId: number): Promise<OTP> {
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    const result = await query(
      'INSERT INTO otps (user_id, otp, created_at, expires_at, verified) VALUES ($1, $2, NOW(), $3, $4) RETURNING *',
      [userId, otp, expiresAt, false]
    );

    const generatedOtp = result.rows[0];
    await this.sendOTP(userId, otp);

    return generatedOtp;
  }

  async sendOTP(userId: number, otp: string): Promise<void> {
    const result = await query('SELECT email FROM users WHERE id = $1', [userId]);
    const email = result.rows[0]?.email;

    if (!email) {
      throw new Error('User email not found');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
  }

  async verifyOTP(userId: number, otp: string): Promise<boolean> {
    const result = await query(
      'SELECT * FROM otps WHERE user_id = $1 AND otp = $2 AND expires_at > NOW() AND verified = false',
      [userId, otp]
    );

    if (result.rows.length > 0) {
      await query('UPDATE otps SET verified = true WHERE id = $1', [result.rows[0].id]);
      return true;
    } else {
      return false;
    }
  }

  async invalidateExpiredOTPs(): Promise<void> {
    await query('DELETE FROM otps WHERE expires_at < NOW()');
  }
}
