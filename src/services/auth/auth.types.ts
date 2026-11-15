export type UserRole = 'ADMIN' | 'VENUE_OWNER';

export type AuthMethod = 'CREDENTIALS' | 'GOOGLE' | 'GITHUB' | 'YANDEX' | 'TELEGRAM' | 'PHONE';

export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  name: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  isTwoFactorEnabled: boolean;
  bio: string | null;
  status: string | null;
  username: string | null;
  role: UserRole;
  isActive: boolean;
  method: AuthMethod;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  message?: string;
}

export interface MessageResponse {
  message: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  passwordRepeat: string;
  venueName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  code?: string;
}

export interface RequestPhoneOtpRequest {
  phone: string;
}

export interface RequestPhoneOtpResponse {
  message: string;
  phone: string;
  expiresIn: number;
  devCode?: string;
}

export interface VerifyPhoneOtpRequest {
  phone: string;
  code: string;
  name?: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface EmailConfirmationRequest {
  token: string;
}
