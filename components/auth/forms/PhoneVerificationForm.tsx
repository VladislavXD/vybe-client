'use client'

import React, { useState, useEffect } from 'react'
import { ArrowLeft, RefreshCw, Smartphone } from 'lucide-react'
import { VerificationCodeInput } from '../ui/VerificationCodeInput'
import { AuthButton } from '../ui/AuthButton'
import type { PhoneVerificationData } from '../types'

export interface PhoneVerificationFormProps {
  phone: string
  onSubmit: (data: PhoneVerificationData) => Promise<void> | void
  onResendCode?: (phone: string) => Promise<void> | void
  onBack: () => void
  isLoading?: boolean
  initialSeconds?: number
}

/**
 * Подтверждение номера телефона 6-значным SMS кодом.
 */
export function PhoneVerificationForm({
  phone,
  onSubmit,
  onResendCode,
  onBack,
  isLoading = false,
  initialSeconds = 60,
}: PhoneVerificationFormProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [resendCooldown, setResendCooldown] = useState(initialSeconds)
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setInterval(() => setResendCooldown((p) => Math.max(0, p - 1)), 1000)
    return () => clearInterval(t)
  }, [resendCooldown])

  const formatTimer = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (code.length < 6) {
      setError('Введите полный 6-значный код из SMS')
      return
    }
    setError(null)
    try {
      await onSubmit({ phone, code })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Неверный код.')
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return
    setIsResending(true)
    setError(null)
    setResendSuccess(false)
    try {
      await onResendCode?.(phone)
      setResendCooldown(60)
      setResendSuccess(true)
      setTimeout(() => setResendSuccess(false), 4000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Не удалось отправить SMS.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-7 w-full text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="relative flex size-14 items-center justify-center rounded-2xl border border-[#EBC6A0]/20 bg-[#EBC6A0]/8">
          <Smartphone className="size-6 text-[#EBC6A0]" strokeWidth={1.8} />
          <span className="absolute -top-1 -right-1 flex size-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#EBC6A0] opacity-50" />
            <span className="relative inline-flex size-3 rounded-full bg-[#EBC6A0]" />
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-[18px] font-bold tracking-tight text-white">
            Код подтверждения
          </h2>
          <p className="text-[12px] text-white/40 leading-relaxed max-w-[260px]">
            Мы отправили SMS с кодом на{' '}
            <span className="text-white/70 font-medium font-mono">{phone}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 w-full">
        <VerificationCodeInput
          value={code}
          onChange={(v) => {
            setCode(v)
            if (error) setError(null)
          }}
          onComplete={() => setTimeout(() => handleSubmit(), 80)}
          error={Boolean(error)}
          disabled={isLoading}
        />

        {error && (
          <p className="text-[11px] text-rose-400 font-medium animate-in fade-in-0 duration-150">
            {error}
          </p>
        )}
        {resendSuccess && (
          <p className="text-[11px] text-emerald-400 font-medium">
            Новый SMS код отправлен
          </p>
        )}
      </div>

      <div className="text-[12px]">
        {resendCooldown > 0 ? (
          <span className="text-white/30 tabular-nums">
            Повторный запрос через{' '}
            <span className="text-white/60 font-mono font-semibold">{formatTimer(resendCooldown)}</span>
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="flex items-center gap-1.5 mx-auto text-[#EBC6A0]/70 hover:text-[#EBC6A0] font-semibold transition-colors cursor-pointer disabled:opacity-40"
          >
            <RefreshCw className={`size-3.5 ${isResending ? 'animate-spin' : ''}`} />
            <span>Запросить код ещё раз</span>
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2 w-full">
        <AuthButton
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={code.length < 6}
        >
          Войти
        </AuthButton>

        <AuthButton
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={isLoading}
          leftIcon={<ArrowLeft className="size-4" />}
        >
          Изменить номер
        </AuthButton>
      </div>
    </form>
  )
}
