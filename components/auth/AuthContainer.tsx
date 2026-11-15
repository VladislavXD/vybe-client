'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { AuthSegmentedControl } from './forms/AuthSegmentedControl'
import { AuthMethodSwitcher } from './forms/AuthMethodSwitcher'
import { LoginForm } from './forms/LoginForm'
import { RegisterForm } from './forms/RegisterForm'
import { PhoneForm } from './forms/PhoneForm'
import { VerificationForm } from './forms/VerificationForm'
import { PhoneVerificationForm } from './forms/PhoneVerificationForm'
import { ForgotPasswordForm } from './forms/ForgotPasswordForm'
import { RoleSelectionForm } from './role-selection'
import { EmailLinkNoticeView } from './verification'
import { SocialAuthButtons } from './ui/SocialAuthButtons'
import { AuthDivider } from './ui/AuthDivider'
import { AuthButton } from './ui/AuthButton'
import {
  useLogin,
  useRegister,
  useRequestPhoneOtp,
  useVerifyPhoneOtp,
  useConfirmEmail,
} from '@/src/hooks/auth/useAuth'
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
  UserRoleType,
  RoleSelectionData,
} from './types'

export interface AuthContainerProps {
  initialMode?: AuthMode
  initialStage?: AuthStage
  initialRole?: UserRoleType
  onSuccess?: () => void
}

/**
 * Главный контейнер авторизации со всеми этапами:
 * - Вход / Регистрация через HttpOnly Session Cookie
 * - Переключение: Email / Телефон (SMS OTP через Eskiz.uz)
 * - Отправка ссылки подтверждения на Email и верификация SMS OTP
 * - Этап 3: Выбор роли (Владелец заведения или DJ)
 * - Интеграция с TanStack Query и Next.js Middleware
 */
export function AuthContainer({
  initialMode = 'login',
  initialStage = 'credentials',
  initialRole = 'dj',
  onSuccess,
}: AuthContainerProps) {
  const router = useRouter()

  const [stage, setStage] = useState<AuthStage>(initialStage)
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [method, setMethod] = useState<AuthMethod>('email')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneName, setPhoneName] = useState<string | undefined>(undefined)
  const [selectedRole, setSelectedRole] = useState<UserRoleType>(initialRole)
  const [socialNotice, setSocialNotice] = useState<string | null>(null)

  // TanStack Query мутации (авторизация через HTTP-Only сессионные куки)
  const loginMutation = useLogin()
  const registerMutation = useRegister()
  const requestOtpMutation = useRequestPhoneOtp()
  const verifyOtpMutation = useVerifyPhoneOtp()
  const confirmEmailMutation = useConfirmEmail()

  const isLoading =
    loginMutation.isPending ||
    registerMutation.isPending ||
    requestOtpMutation.isPending ||
    verifyOtpMutation.isPending ||
    confirmEmailMutation.isPending

  const handleCompleteSuccess = (targetRole?: UserRoleType) => {
    setStage('success')
    const role = targetRole || selectedRole
    const destination = role === 'venue_owner' ? '/dj' : '/dj'

    if (onSuccess) {
      setTimeout(onSuccess, 800)
    } else {
      setTimeout(() => {
        router.push(destination)
      }, 800)
    }
  }

  // 1. Вход по Email + паролю
  const handleLogin = async (data: LoginFormData) => {
    setEmail(data.email)
    await loginMutation.mutateAsync({
      email: data.email,
      password: data.password,
    })
    handleCompleteSuccess()
  }

  // 2. Регистрация по Email -> переход на подтверждение почты
  const handleRegister = async (data: RegisterFormData) => {
    setEmail(data.email)
    await registerMutation.mutateAsync({
      name: data.name,
      email: data.email,
      password: data.password,
      passwordRepeat: data.confirmPassword,
      venueName: data.venueName?.trim() || undefined,
    })
    setStage('email-verification')
  }

  // 3. Запрос SMS OTP на номер телефона
  const handlePhoneSubmit = async (data: PhoneFormData) => {
    setPhone(data.phone)
    setPhoneName(data.name)
    await requestOtpMutation.mutateAsync({
      phone: data.phone,
    })
    setStage('phone-otp')
  }

  // 4. Подтверждение Email OTP
  const handleVerifyEmail = async (data: VerificationFormData) => {
    await confirmEmailMutation.mutateAsync({
      token: data.code,
    })
    handleCompleteSuccess('venue_owner')
  }

  // 5. Подтверждение Phone OTP (вход / регистрация по телефону)
  const handleVerifyPhone = async (data: PhoneVerificationData) => {
    await verifyOtpMutation.mutateAsync({
      phone: data.phone,
      code: data.code,
      name: phoneName,
    })
    handleCompleteSuccess('venue_owner')
  }

  // 6. Подтверждение выбранной роли (Этап 3)
  const handleRoleSelected = async (data: RoleSelectionData) => {
    setSelectedRole(data.role)
    if (typeof window !== 'undefined') {
      try {
        document.cookie = `trackup_role=${data.role}; path=/; max-age=31536000; SameSite=Lax`
        window.localStorage.setItem('trackup_selected_role', data.role)
      } catch {
        // ignore storage errors
      }
    }
    handleCompleteSuccess(data.role)
  }

  // Повторная отправка SMS кода
  const handleResendPhoneOtp = async (targetPhone: string) => {
    await requestOtpMutation.mutateAsync({
      phone: targetPhone,
    })
  }

  // 6. Вход через соцсети (зарезервировано)
  const handleSocialAuth = (provider: SocialProvider) => {
    const providerNames: Record<SocialProvider, string> = {
      google: 'Google',
      yandex: 'Яндекс',
      telegram: 'Telegram',
    }
    setSocialNotice(`Вход через ${providerNames[provider]} скоро будет доступен.`)
    setTimeout(() => setSocialNotice(null), 3500)
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

            {/* Сообщение при клике на соцсети */}
            {socialNotice && (
              <div className="px-3.5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[12px] font-medium text-center animate-in fade-in-0 duration-150">
                {socialNotice}
              </div>
            )}

            {/* Кнопки соцсетей: Google, Яндекс, Telegram */}
            <SocialAuthButtons
              onSocial={handleSocialAuth}
              disabled={isLoading}
            />
          </div>
        </div>
      )}

      {/* ЭТАП 2A: ССЫЛКА ПОДТВЕРЖДЕНИЯ НА EMAIL */}
      {stage === 'email-verification' && (
        <div className="px-6 py-8 sm:px-7 sm:py-9 animate-in fade-in-0 duration-200">
          <EmailLinkNoticeView
            email={email}
            onResend={async (targetEmail) => {
              if (targetEmail) {
                // Повторная отправка ссылки подтверждения через auth register
                await registerMutation.mutateAsync({
                  name: phoneName || 'TrackUp User',
                  email: targetEmail,
                  password: '',
                  passwordRepeat: '',
                }).catch(() => {})
              }
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
            onResendCode={handleResendPhoneOtp}
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

      {/* ЭТАП 3: ВЫБОР РОЛИ (ПОСЛЕ РЕГИСТРАЦИИ) */}
      {stage === 'role-selection' && (
        <div className="px-5 py-6 sm:px-6 sm:py-7 animate-in fade-in-0 duration-200">
          <RoleSelectionForm
            initialRole={selectedRole}
            onSelectRole={handleRoleSelected}
            onBack={() => setStage('credentials')}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* ЭТАП ЗАВЕРШЕНИЯ: УСПЕШНЫЙ ВХОД / ОНБОРДИНГ */}
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
              {mode === 'register'
                ? selectedRole === 'venue_owner'
                  ? 'Заведение готово к старту'
                  : 'Аккаунт DJ активирован'
                : 'Вы успешно вошли'}
            </h2>
            <p className="text-[12px] text-white/40 max-w-[270px] leading-relaxed mx-auto">
              {selectedRole === 'venue_owner'
                ? 'Перенаправляем в панель управления заведением для генерации QR-кодов столов'
                : 'Перенаправляем в панель диджея для управления сменой и заказами'}
            </p>
          </div>

          <div className="w-full">
            <AuthButton
              type="button"
              variant="white"
              onClick={() => (onSuccess ? onSuccess() : router.push('/dj'))}
              rightIcon={<ArrowRight className="size-4" strokeWidth={2} />}
            >
              {selectedRole === 'venue_owner' ? 'Перейти в кабинет' : 'Открыть эфир DJ'}
            </AuthButton>
          </div>
        </div>
      )}
    </div>
  )
}
