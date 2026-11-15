'use client'

import React, { useState, useEffect } from 'react'
import {
  Mail,
  ExternalLink,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react'
import { AuthButton } from '../ui/AuthButton'
import { VerificationStatusCard } from './VerificationStatusCard'
import type { EmailLinkNoticeProps } from './types'

/**
 * Определение веб-клиента почты для быстрого перехода одним кликом.
 */
function getWebmailUrl(email: string): { url: string; label: string } {
  const domain = email.split('@')[1]?.toLowerCase() || ''
  if (domain.includes('gmail.com')) {
    return { url: 'https://mail.google.com', label: 'Открыть Gmail' }
  }
  if (domain.includes('yandex.') || domain.includes('ya.ru')) {
    return { url: 'https://mail.yandex.ru', label: 'Открыть Яндекс Почту' }
  }
  if (domain.includes('mail.ru') || domain.includes('bk.ru') || domain.includes('inbox.ru')) {
    return { url: 'https://e.mail.ru', label: 'Открыть Mail.ru' }
  }
  if (domain.includes('outlook.') || domain.includes('hotmail.')) {
    return { url: 'https://outlook.live.com', label: 'Открыть Outlook' }
  }
  return { url: `mailto:${email}`, label: 'Перейти в почту' }
}

/**
 * Переиспользуемая форма уведомления об отправленной ссылке подтверждения на Email.
 */
export function EmailLinkNoticeView({
  email,
  onResend,
  onBack,
  initialCooldown = 60,
  isLoading = false,
}: EmailLinkNoticeProps) {
  const [cooldown, setCooldown] = useState(initialCooldown)
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return
    setIsResending(true)
    setError(null)
    setResendSuccess(false)

    try {
      if (onResend) {
        await onResend(email)
      }
      setCooldown(60)
      setResendSuccess(true)
      setTimeout(() => setResendSuccess(false), 4500)
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Не удалось отправить повторную ссылку.'
      )
    } finally {
      setIsResending(false)
    }
  }

  const webmail = getWebmailUrl(email)

  return (
    <VerificationStatusCard
      icon={<Mail className="size-6 text-[#EBC6A0]" />}
      badgeIcon={true}
      title="Проверьте ваш email"
      subtitle="Мы отправили письмо с защищённой ссылкой для завершения регистрации."
      destination={email}
      destinationLabel="Отправлено на"
    >
      {/* Сообщения об успехе или ошибке повторной отправки */}
      {resendSuccess && (
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[12px] font-medium w-full text-center justify-center animate-in fade-in-0 duration-150">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>Новая ссылка успешно отправлена на почту</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[12px] font-medium w-full text-center justify-center animate-in fade-in-0 duration-150">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Быстрый переход в веб-клиент почты */}
      <a
        href={webmail.url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full"
      >
        <AuthButton
          type="button"
          variant="primary"
          rightIcon={<ExternalLink className="size-4" />}
        >
          {webmail.label}
        </AuthButton>
      </a>

      {/* Таймер повторной отправки */}
      <div className="text-[12px] pt-1">
        {cooldown > 0 ? (
          <span className="flex items-center gap-1.5 text-white/35 tabular-nums">
            <Clock className="size-3.5 text-white/20" />
            <span>Повторная отправка через </span>
            <span className="text-[#EBC6A0] font-mono font-medium">
              {formatTimer(cooldown)}
            </span>
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending || isLoading}
            className="flex items-center gap-1.5 text-[#EBC6A0]/80 hover:text-[#EBC6A0] font-semibold transition-colors cursor-pointer disabled:opacity-40"
          >
            <RefreshCw
              className={`size-3.5 ${isResending ? 'animate-spin' : ''}`}
            />
            <span>Отправить ссылку повторно</span>
          </button>
        )}
      </div>

      {/* Блок полезных подсказок */}
      <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-[11px] text-white/40 leading-relaxed text-left w-full flex flex-col gap-1.5">
        <span className="font-semibold text-white/50">Не получили письмо?</span>
        <ul className="list-disc list-inside space-y-0.5 text-white/30">
          <li>Проверьте папку «Спам» или «Промоакции»</li>
          <li>Ссылка действительна в течение 1 часа</li>
          <li>Убедитесь, что адрес указан правильно</li>
        </ul>
      </div>

      {/* Кнопка "Назад" / изменить почту */}
      {onBack && (
        <AuthButton
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={isLoading}
          leftIcon={<ArrowLeft className="size-4" />}
        >
          Изменить адрес почты
        </AuthButton>
      )}
    </VerificationStatusCard>
  )
}
