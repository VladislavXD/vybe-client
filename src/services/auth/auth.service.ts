import { apiClient } from '@/src/services/api/api-client';
import type {
  AuthResponse,
  LoginRequest,
  MessageResponse,
  RegisterRequest,
  RequestPhoneOtpRequest,
  RequestPhoneOtpResponse,
  ResetPasswordRequest,
  User,
  VerifyPhoneOtpRequest,
  EmailConfirmationRequest,
} from './auth.types';

export const authService = {
  /**
   * Вход по email и паролю (сессия сохраняется в HttpOnly cookie).
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('auth/login', data);
  },

  /**
   * Регистрация нового пользователя по email.
   */
  async register(data: RegisterRequest): Promise<MessageResponse> {
    return apiClient.post<MessageResponse>('auth/register', data);
  },

  /**
   * Запрос SMS OTP кода на номер телефона.
   */
  async requestPhoneOtp(data: RequestPhoneOtpRequest): Promise<RequestPhoneOtpResponse> {
    return apiClient.post<RequestPhoneOtpResponse>('auth/phone/send-otp', data);
  },

  /**
   * Проверка OTP кода и вход/регистрация (сессия сохраняется в HttpOnly cookie).
   */
  async verifyPhoneOtp(data: VerifyPhoneOtpRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('auth/phone/verify-otp', data);
  },

  /**
   * Получение профиля текущего авторизованного пользователя по активной сессии.
   */
  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('users/profile');
  },

  /**
   * Подтверждение адреса электронной почты по токену.
   */
  async confirmEmail(data: EmailConfirmationRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('auth/email-confirmation', data);
  },

  /**
   * Запрос на восстановление пароля по email.
   */
  async resetPassword(data: ResetPasswordRequest): Promise<boolean> {
    return apiClient.post<boolean>('auth/password-recovery/reset', data);
  },

  /**
   * Выход из системы (уничтожение сессии на сервере и очистка cookie).
   */
  async logout(): Promise<void> {
    return apiClient.post<void>('auth/logout');
  },
};
