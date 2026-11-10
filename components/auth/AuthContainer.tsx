'use client'

import React, { useState } from 'react'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { AuthSegmentedControl } from './forms/AuthSegmentedControl'
import { AuthMethodSwitcher } from './forms/AuthMethodSwitcher'
import { LoginForm } from './forms/LoginForm'
import { RegisterForm } from './forms/RegisterForm'
import { PhoneForm } from './forms/PhoneForm'
import { VerificationForm } from './forms/VerificationForm'
import { PhoneVerificationForm } from './forms/PhoneVerificationForm'
import { ForgotPasswordForm } from './forms/ForgotPasswordForm'
import { SocialAuthButtons } from './ui/SocialAuthButtons'
import { AuthDivider } from './ui/AuthDivider'
import { AuthButton } from './ui/AuthButton'
import type {
  AuthMode,
  AuthMethod,
  AuthStage,
  SocialProvider,
  LoginFormData,
  RegisterFormData,
  PhoneFormData,
  VerificationFormData,
  PhoneVerificationData,
} from './types'

export interface AuthContainerProps {
  initialMode?: AuthMode
  onSuccess?: () => void
}

/**
 * Главный контейнер авторизации со всеми этапами:
 * - Вход / Регистрация
 * - Переключение: Email / Телефон
 * - Соцсети: Google, Яндекс, Telegram
 * - Ссылка "Забыли пароль?"
 * - Подтверждение почты и телефона (OTP)
 */
export function AuthContainer({
  initialMode = 'login',
  onSuccess,
}: AuthContainerProps) {
  const [stage, setStage] = useState<AuthStage>('credentials')
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [method, setMethod] = useState<AuthMethod>('email')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 1. Email вход
  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true)
    setEmail(data.email)
    try {
      await new Promise((r) => setTimeout(r, 800))
      setStage('success')
      if (onSuccess) setTimeout(onSuccess, 1000)
    } finally {
      setIsLoading(false)
    }
  }

  // 2. Email регистрация -> переход на подтверждение почты
  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true)
    setEmail(data.email)
    try {
      await new Promise((r) => setTimeout(r, 900))
      setStage('email-verification')
    } finally {
      setIsLoading(false)
    }
  }

  // 3. Phone вход / регистрация -> переход на SMS OTP
  const handlePhoneSubmit = async (data: PhoneFormData) => {
    setIsLoading(true)
    setPhone(data.phone)
    try {
      await new Promise((r) => setTimeout(r, 800))
      setStage('phone-otp')
    } finally {
      setIsLoading(false)
    }
  }

  // 4. Подтверждение Email OTP
  const handleVerifyEmail = async (_data: VerificationFormData) => {
    setIsLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 900))
      setStage('success')
      if (onSuccess) setTimeout(onSuccess, 1000)
    } finally {
      setIsLoading(false)
    }
  }

  // 5. Подтверждение Phone OTP
  const handleVerifyPhone = async (_data: PhoneVerificationData) => {
    setIsLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 900))
      setStage('success')
      if (onSuccess) setTimeout(onSuccess, 1000)
    } finally {
      setIsLoading(false)
    }
  }

  // 6. Вход через соцсети (Google, Яндекс, Telegram)
  const handleSocialAuth = async (provider: SocialProvider) => {
    setIsLoading(true)
    try {
      // Имитация авторизации через OAuth
      await new Promise((r) => setTimeout(r, 900))
      setStage('success')
      if (onSuccess) setTimeout(onSuccess, 1000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="w-full rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      {/* ЭТАП 1: ОСНОВНОЙ ЭКРАН (CREDENTIALS) */}
      {stage === 'credentials' && (
        <div className="animate-in fade-in-0 duration-200">
          {/* Шапка */}
          <div className="px-6 pt-7 pb-5 sm:px-7 sm:pt-8 flex flex-col gap-4 border-b border-white/[0.05]">
            <div className="flex flex-col gap-1 text-center">
              <h1 className="text-[22px] sm:text-[24px] font-bold tracking-tight text-white leading-tight">
                {mode === 'login' ? 'Добро пожаловать' : 'Создать аккаунт'}
              </h1>
              <p className="text-[13px] text-white/35 leading-relaxed">
                {mode === 'login'
                  ? 'Войдите, чтобы управлять эфиром и заказами'
                  : 'Зарегистрируйтесь для приёма треков от гостей'}
              </p>
            </div>

            {/* Вход / Регистрация */}
            <AuthSegmentedControl
              mode={mode}
              onChange={setMode}
              disabled={isLoading}
            />

            {/* Переключатель: Почта / Телефон */}
            <AuthMethodSwitcher
              method={method}
              onChange={setMethod}
              disabled={isLoading}
            />
          </div>

          {/* Тело формы */}
          <div className="px-6 py-6 sm:px-7 sm:py-7 flex flex-col gap-5">
            {/* Форма в зависимости от метода */}
            {method === 'email' ? (
              mode === 'login' ? (
                <LoginForm
                  onSubmit={handleLogin}
                  onForgotPassword={(val) => {
                    setEmail(val)
                    setStage('forgot-password')
                  }}
                  isLoading={isLoading}
                  initialEmail={email}
                />
              ) : (
                <RegisterForm
                  onSubmit={handleRegister}
                  isLoading={isLoading}
                  initialEmail={email}
                />
              )
            ) : (
              <PhoneForm
                mode={mode}
                onSubmit={handlePhoneSubmit}
                isLoading={isLoading}
                initialPhone={phone}
              />
            )}

            {/* Разделитель */}
            <AuthDivider label="или войдите через" />

            {/* Кнопки соцсетей: Google, Яндекс, Telegram */}
            <SocialAuthButtons
              onSocial={handleSocialAuth}
              disabled={isLoading}
            />
          </div>
        </div>
      )}

      {/* ЭТАП 2A: ВЕРИФИКАЦИЯ EMAIL */}
      {stage === 'email-verification' && (
        <div className="px-6 py-8 sm:px-7 sm:py-9 animate-in fade-in-0 duration-200">
          <VerificationForm
            email={email}
            onSubmit={handleVerifyEmail}
            onResendCode={async () => {
              await new Promise((r) => setTimeout(r, 600))
            }}
            onBack={() => setStage('credentials')}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* ЭТАП 2B: ВЕРИФИКАЦИЯ НОМЕРА ТЕЛЕФОНА (SMS OTP) */}
      {stage === 'phone-otp' && (
        <div className="px-6 py-8 sm:px-7 sm:py-9 animate-in fade-in-0 duration-200">
          <PhoneVerificationForm
            phone={phone}
            onSubmit={handleVerifyPhone}
            onResendCode={async () => {
              await new Promise((r) => setTimeout(r, 600))
            }}
            onBack={() => setStage('credentials')}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* ЭТАП 2C: ЗАБЫЛИ ПАРОЛЬ? */}
      {stage === 'forgot-password' && (
        <div className="px-6 py-8 sm:px-7 sm:py-9 animate-in fade-in-0 duration-200">
          <ForgotPasswordForm
            initialEmail={email}
            onBack={() => setStage('credentials')}
          />
        </div>
      )}

      {/* ЭТАП 3: УСПЕШНАЯ АВТОРИЗАЦИЯ */}
      {stage === 'success' && (
        <div className="flex flex-col items-center gap-6 text-center px-6 py-10 sm:px-7 sm:py-12 animate-in fade-in-0 duration-200">
          <div
            className="flex size-16 items-center justify-center rounded-2xl"
            style={{
              background: 'rgba(235, 198, 160, 0.1)',
              border: '1px solid rgba(235, 198, 160, 0.2)',
            }}
          >
            <CheckCircle2 className="size-8 text-[#EBC6A0]" strokeWidth={1.8} />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-[20px] font-bold tracking-tight text-white">
              Вы успешно вошли
            </h2>
            <p className="text-[12px] text-white/35 max-w-[240px] leading-relaxed mx-auto">
              Перенаправляем вас в панель управления диджея
            </p>
          </div>

          <div className="w-full">
            <AuthButton
              type="button"
              variant="white"
              onClick={() => (onSuccess ? onSuccess() : (window.location.href = '/ru/dj'))}
              rightIcon={<ArrowRight className="size-4" strokeWidth={2} />}
            >
              Перейти в панель
            </AuthButton>
          </div>
        </div>
      )}
    </div>
  )
}
