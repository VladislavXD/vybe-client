'use client'

import React, { useEffect, useState } from 'react'
import { CheckCircle2, AlertTriangle, Loader2, ArrowRight, ArrowLeft } from 'lucide-react'
import { AuthButton } from '../ui/AuthButton'
import { VerificationStatusCard } from './VerificationStatusCard'
import { useConfirmEmail } from '@/src/hooks/auth/useAuth'
import type { TokenVerificationViewProps } from './types'

/**
 * Компонент верификации токена из ссылки подтверждения (страница /auth/new-verification).
 */
export function TokenVerificationView({
  token,
  onSuccess,
  onBackToAuth,
}: TokenVerificationViewProps) {
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const confirmEmailMutation = useConfirmEmail()

  useEffect(() => {
    if (!token || token.trim() === '') {
      setStatus('error')
      setErrorMessage('Токен подтверждения отсутствует в ссылке.')
      return
    }

    let isMounted = true

    const verify = async () => {
      try {
        const result = await confirmEmailMutation.mutateAsync({ token: token.trim() })
        if (isMounted) {
          setStatus('success')
          setTimeout(() => {
            onSuccess(result)
          }, 1200)
        }
      } catch (err: unknown) {
        if (isMounted) {
          setStatus('error')
          const msg =
            err instanceof Error
              ? err.message
              : 'Ссылка подтверждения недействительна или срок её действия истёк.'
          setErrorMessage(msg)
        }
      }
    }

    verify()

    return () => {
      isMounted = false
    }
  }, [token]) // eslint-disable-line react-hooks/exhaustive-deps

  if (status === 'pending') {
    return (
      <VerificationStatusCard
        icon={<Loader2 className="size-6 text-[#EBC6A0] animate-spin" />}
        title="Подтверждение аккаунта..."
        subtitle="Проверяем ваш токен безопасности и активируем профиль в TrackUp."
      >
        <p className="text-[12px] text-white/30 pt-2">
          Пожалуйста, подождите несколько секунд...
        </p>
      </VerificationStatusCard>
    )
  }

  if (status === 'success') {
    return (
      <VerificationStatusCard
        icon={<CheckCircle2 className="size-6 text-emerald-400" />}
        title="Email подтверждён!"
        subtitle="Ваш адрес электронной почты успешно верифицирован. Переходим к выбору роли..."
      >
        <div className="w-full pt-2">
          <AuthButton
            type="button"
            variant="primary"
            onClick={() => onSuccess(null)}
            rightIcon={<ArrowRight className="size-4" />}
          >
            Продолжить
          </AuthButton>
        </div>
      </VerificationStatusCard>
    )
  }

  return (
    <VerificationStatusCard
      icon={<AlertTriangle className="size-6 text-rose-400" />}
      title="Ошибка подтверждения"
      subtitle={errorMessage || 'Не удалось подтвердить адрес электронной почты.'}
    >
      <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[12px] text-left leading-relaxed w-full">
        Возможные причины:
        <ul className="list-disc list-inside mt-1 text-[11px] text-rose-300/70 space-y-0.5">
          <li>Срок действия ссылки (1 час) истёк</li>
          <li>Ссылка уже была использована ранее</li>
          <li>Ссылка была скопирована не полностью</li>
        </ul>
      </div>

      <div className="flex flex-col gap-2 w-full pt-2">
        <AuthButton
          type="button"
          variant="primary"
          onClick={onBackToAuth}
          leftIcon={<ArrowLeft className="size-4" />}
        >
          Вернуться на страницу входа
        </AuthButton>
      </div>
    </VerificationStatusCard>
  )
}
