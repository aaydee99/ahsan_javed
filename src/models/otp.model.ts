export interface OTP {
    id: number;
    user_id: number;
    otp: string;
    created_at: Date;
    expires_at: Date;
    verified: boolean;
  }
  