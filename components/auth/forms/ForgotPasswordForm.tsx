'use client'

import React, { useState } from 'react'
import { Mail, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { AuthInput } from '../ui/AuthInput'
import { AuthButton } from '../ui/AuthButton'

export interface ForgotPasswordFormProps {
  onBack: () => void
  initialEmail?: string
}

/**
 * Минималистичная форма восстановления пароля ("Забыли пароль?").
 */
export function ForgotPasswordForm({
  onBack,
  initialEmail = '',
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState(initialEmail)
  const [error, setError] = useState<string | null>(null)
  const [isSent, setIsSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Введите корректный email')
      return
    }

    setError(null)
    setIsLoading(true)

    try {
      // Имитация отправки ссылки для сброса пароля
      await new Promise((r) => setTimeout(r, 800))
      setIsSent(true)
    } catch {
      setError('Не удалось отправить ссылку для сброса')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSent) {
    return (
      <div className="flex flex-col items-center gap-6 text-center py-2 animate-in fade-in-0 duration-200">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-[#EBC6A0]/10 border border-[#EBC6A0]/20 text-[#EBC6A0]">
          <CheckCircle2 className="size-7 stroke-[1.8]" />
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-[18px] font-bold tracking-tight text-white">
            Письмо отправлено
          </h2>
          <p className="text-[12px] text-white/40 leading-relaxed max-w-[280px]">
            Мы выслали ссылку для сброса пароля на{' '}
            <span className="text-white/70 font-medium break-all">{email}</span>
          </p>
        </div>

        <div className="w-full pt-1">
          <AuthButton
            type="button"
            variant="white"
            onClick={onBack}
            leftIcon={<ArrowLeft className="size-4" />}
          >
            Вернуться ко входу
          </AuthButton>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 text-center pb-1">
        <h2 className="text-[18px] font-bold tracking-tight text-white">
          Восстановление пароля
        </h2>
        <p className="text-[12px] text-white/40 leading-relaxed">
          Укажите email вашего аккаунта, и мы отправим ссылку для сброса пароля
        </p>
      </div>

      <AuthInput
        label="Электронная почта"
        type="email"
        autoComplete="email"
        placeholder="name@example.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value)
          if (error) setError(null)
        }}
        error={error || undefined}
        leadingIcon={<Mail className="size-4" />}
        disabled={isLoading}
      />

      <div className="flex flex-col gap-2 pt-2">
        <AuthButton
          type="submit"
          variant="primary"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="size-4" strokeWidth={2.5} />}
        >
          Сбросить пароль
        </AuthButton>

        <AuthButton
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={isLoading}
          leftIcon={<ArrowLeft className="size-4" />}
        >
          Вернуться назад
        </AuthButton>
      </div>
    </form>
  )
}
