'use client'

import React, { useState, useEffect } from 'react'
import { Smartphone, RefreshCw, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react'
import { VerificationCodeInput } from '../ui/VerificationCodeInput'
import { AuthButton } from '../ui/AuthButton'
import { VerificationStatusCard } from './VerificationStatusCard'
import type { OtpCodeViewProps } from './types'

/**
 * Переиспользуемая форма ввода и проверки 6-значного OTP-кода (SMS или Email).
 */
export function OtpCodeView({
  destination,
  destinationType = 'phone',
  value,
  onChange,
  onComplete,
  onSubmit,
  onResend,
  onBack,
  isLoading = false,
  error: externalError,
  initialCooldown = 60,
}: OtpCodeViewProps) {
  const [cooldown, setCooldown] = useState(initialCooldown)
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [internalError, setInternalError] = useState<string | null>(null)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60)
    const s = sec % 60
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const error = externalError || internalError

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (value.length < 6) {
      setInternalError('Введите полный 6-значный код')
      return
    }
    setInternalError(null)
    try {
      await onSubmit()
    } catch (err: unknown) {
      setInternalError(err instanceof Error ? err.message : 'Неверный код подтверждения.')
    }
  }

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return
    setIsResending(true)
    setInternalError(null)
    setResendSuccess(false)

    try {
      if (onResend) {
        await onResend()
      }
      setCooldown(60)
      setResendSuccess(true)
      setTimeout(() => setResendSuccess(false), 4000)
    } catch (err: unknown) {
      setInternalError(
        err instanceof Error ? err.message : 'Не удалось отправить код повторно.'
      )
    } finally {
      setIsResending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <VerificationStatusCard
        icon={<Smartphone className="size-6 text-[#EBC6A0]" />}
        badgeIcon={true}
        title="Введите код из SMS"
        subtitle="Мы отправили 6-значный одноразовый код подтверждения."
        destination={destination}
        destinationLabel={destinationType === 'phone' ? 'Номер' : 'Почта'}
      >
        {/* Поле ввода 6-значного OTP */}
        <div className="flex flex-col items-center gap-2 w-full">
          <VerificationCodeInput
            value={value}
            onChange={(v) => {
              onChange(v)
              if (internalError) setInternalError(null)
            }}
            onComplete={(v) => {
              onComplete?.(v)
              setTimeout(() => handleSubmit(), 80)
            }}
            error={Boolean(error)}
            disabled={isLoading}
          />

          {error && (
            <p className="flex items-center gap-1.5 text-[11px] text-rose-400 font-medium animate-in fade-in-0 duration-150">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{error}</span>
            </p>
          )}

          {resendSuccess && (
            <p className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium animate-in fade-in-0 duration-150">
              <CheckCircle2 className="size-3.5 shrink-0" />
              <span>Новый SMS-код отправлен</span>
            </p>
          )}
        </div>

        {/* Таймер повторной отправки */}
        <div className="text-[12px]">
          {cooldown > 0 ? (
            <span className="text-white/30 tabular-nums">
              Повторная отправка через{' '}
              <span className="text-[#EBC6A0] font-mono font-medium">
                {formatTimer(cooldown)}
              </span>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending || isLoading}
              className="flex items-center gap-1.5 mx-auto text-[#EBC6A0]/80 hover:text-[#EBC6A0] font-semibold transition-colors cursor-pointer disabled:opacity-40"
            >
              <RefreshCw className={`size-3.5 ${isResending ? 'animate-spin' : ''}`} />
              <span>Отправить код повторно</span>
            </button>
          )}
        </div>

        {/* Действия */}
        <div className="flex flex-col gap-2 w-full pt-2">
          <AuthButton
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={value.length < 6}
          >
            Подтвердить
          </AuthButton>

          {onBack && (
            <AuthButton
              type="button"
              variant="ghost"
              onClick={onBack}
              disabled={isLoading}
              leftIcon={<ArrowLeft className="size-4" />}
            >
              Назад
            </AuthButton>
          )}
        </div>
      </VerificationStatusCard>
    </form>
  )
}
