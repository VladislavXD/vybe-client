export type AuthMode = 'login' | 'register'

export type AuthMethod = 'email' | 'phone'

export type SocialProvider = 'google' | 'yandex' | 'telegram'

export type AuthStage = 'credentials' | 'phone-otp' | 'email-verification' | 'forgot-password' | 'success'

export interface LoginFormData {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export interface PhoneFormData {
  phone: string
  name?: string
  acceptTerms?: boolean
}

export interface VerificationFormData {
  email: string
  code: string
}

export interface PhoneVerificationData {
  phone: string
  code: string
}

export type FormErrors<T> = Partial<Record<keyof T | 'form', string>>

export interface AuthState {
  stage: AuthStage
  mode: AuthMode
  method: AuthMethod
  email: string
  phone: string
  isLoading: boolean
  error?: string
}
