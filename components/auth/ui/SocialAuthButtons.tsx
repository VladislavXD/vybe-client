'use client'

import React from 'react'
import { cn } from '@/lib/utils'

/** Иконки провайдеров — вынесены для переиспользования */
export const GoogleIcon = ({ className }: { className?: string }) => (
  <svg className={cn('size-4', className)} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
)

export const YandexIcon = ({ className }: { className?: string }) => (
  <svg className={cn('size-4', className)} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="12" fill="#FC3F1D" />
    <path
      d="M13.725 6H12.09c-1.808 0-2.88.9-2.88 2.37 0 1.29.63 2.01 1.98 2.94L12.51 12l-3.33 4.95H6.9l3.06-4.59C8.46 11.25 7.62 10.2 7.62 8.28 7.62 5.82 9.3 4.5 12.21 4.5h2.565V18H13.5l.225-12z"
      fill="#fff"
    />
  </svg>
)

export const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={cn('size-4', className)} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="12" fill="#2AABEE" />
    <path
      d="M5.58 11.7l11.13-4.29c.52-.19.97.13.8.93l-1.9 8.95c-.14.63-.52.78-1.05.49l-2.9-2.14-1.4 1.35c-.16.16-.29.29-.58.29l.21-2.96 5.4-4.88c.23-.21-.05-.32-.36-.12L7.2 14.45 4.33 13.57c-.63-.2-.64-.63.31-1.05l.94-.82z"
      fill="#fff"
    />
  </svg>
)

interface SocialAuthButtonsProps {
  onSocial: (provider: 'google' | 'yandex' | 'telegram') => void
  disabled?: boolean
  className?: string
}

/**
 * Три компактные кнопки авторизации через провайдеров.
 * Минималистичный стиль: прозрачные с тонкой белой обводкой.
 */
export function SocialAuthButtons({
  onSocial,
  disabled = false,
  className,
}: SocialAuthButtonsProps) {
  const providers = [
    { key: 'google' as const, Icon: GoogleIcon, label: 'Google' },
    { key: 'yandex' as const, Icon: YandexIcon, label: 'Яндекс' },
    { key: 'telegram' as const, Icon: TelegramIcon, label: 'Telegram' },
  ]

  return (
    <div className={cn('grid grid-cols-3 gap-2', className)}>
      {providers.map(({ key, Icon, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onSocial(key)}
          disabled={disabled}
          aria-label={`Войти через ${label}`}
          className={cn(
            'flex items-center justify-center gap-2 h-11 rounded-xl',
            'bg-white/[0.04] border border-white/10 text-white/60',
            'hover:bg-white/[0.07] hover:border-white/20 hover:text-white/90',
            'active:scale-[0.97] transition-all duration-150 cursor-pointer select-none',
            'disabled:opacity-40 disabled:cursor-not-allowed text-[12px] font-medium'
          )}
        >
          <Icon />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  )
}
