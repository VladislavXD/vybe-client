'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/src/services/auth/auth.service';
import type {
  LoginRequest,
  RegisterRequest,
  RequestPhoneOtpRequest,
  VerifyPhoneOtpRequest,
  EmailConfirmationRequest,
  ResetPasswordRequest,
  User,
  AuthResponse,
  MessageResponse,
  RequestPhoneOtpResponse,
} from '@/src/services/auth/auth.types';
import { FetchError } from '@/src/utils/fetch';

export const AUTH_QUERY_KEY = ['currentUser'] as const;

/**
 * Хук для получения профиля текущего пользователя по активной сессии (Session Cookie).
 */
export function useCurrentUser() {
  return useQuery<User, FetchError>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: () => authService.getCurrentUser(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 минут
  });
}

/**
 * Хук для входа по email и паролю.
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, FetchError, LoginRequest>({
    mutationFn: (data) => authService.login(data),
    onSuccess: (response) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, response.user);
    },
  });
}

/**
 * Хук для регистрации нового пользователя по email.
 */
export function useRegister() {
  return useMutation<MessageResponse, FetchError, RegisterRequest>({
    mutationFn: (data) => authService.register(data),
  });
}

/**
 * Хук для запроса SMS OTP кода на номер телефона.
 */
export function useRequestPhoneOtp() {
  return useMutation<RequestPhoneOtpResponse, FetchError, RequestPhoneOtpRequest>({
    mutationFn: (data) => authService.requestPhoneOtp(data),
  });
}

/**
 * Хук для верификации SMS OTP кода и входа/регистрации по номеру телефона.
 */
export function useVerifyPhoneOtp() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, FetchError, VerifyPhoneOtpRequest>({
    mutationFn: (data) => authService.verifyPhoneOtp(data),
    onSuccess: (response) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, response.user);
    },
  });
}

/**
 * Хук для подтверждения почты по токену.
 */
export function useConfirmEmail() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, FetchError, EmailConfirmationRequest>({
    mutationFn: (data) => authService.confirmEmail(data),
    onSuccess: (response) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, response.user);
    },
  });
}

/**
 * Хук для запроса сброса пароля.
 */
export function useResetPassword() {
  return useMutation<boolean, FetchError, ResetPasswordRequest>({
    mutationFn: (data) => authService.resetPassword(data),
  });
}

/**
 * Хук для выхода из системы (удаление сессии).
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation<void, FetchError, void>({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });
}
