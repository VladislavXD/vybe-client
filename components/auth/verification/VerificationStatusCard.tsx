'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface VerificationStatusCardProps {
  icon: React.ReactNode
  badgeIcon?: React.ReactNode
  title: string
  subtitle: React.ReactNode
  destination?: string
  destinationLabel?: string
  children: React.ReactNode
  className?: string
}

/**
 * Переиспользуемая карточка статуса верификации (отправка ссылки на почту, ввод SMS OTP, проверка токена).
 */
export function VerificationStatusCard({
  icon,
  badgeIcon,
  title,
  subtitle,
  destination,
  destinationLabel,
  children,
  className,
}: VerificationStatusCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-6 w-full text-center animate-in fade-in-0 duration-200',
        className
      )}
    >
      {/* Иконка с мерцающим индикатором */}
      <div className="relative flex size-14 items-center justify-center rounded-2xl border border-[#EBC6A0]/20 bg-[#EBC6A0]/8 shadow-[0_0_24px_rgba(235,198,160,0.1)]">
        {icon}
        {badgeIcon && (
          <span className="absolute -top-1 -right-1 flex size-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#EBC6A0] opacity-50" />
            <span className="relative inline-flex size-3 rounded-full bg-[#EBC6A0]" />
          </span>
        )}
      </div>

      {/* Заголовки */}
      <div className="flex flex-col gap-1.5 max-w-[320px]">
        <h2 className="text-[19px] sm:text-[20px] font-bold tracking-tight text-white leading-tight">
          {title}
        </h2>
        <div className="text-[12.5px] text-white/40 leading-relaxed">
          {subtitle}
        </div>

        {destination && (
          <div className="mt-1.5 inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[12px] font-medium text-white/80 mx-auto max-w-full">
            {destinationLabel && (
              <span className="text-white/30 text-[11px]">{destinationLabel}:</span>
            )}
            <span className="truncate text-[#EBC6A0] font-mono">{destination}</span>
          </div>
        )}
      </div>

      {/* Контентная часть (кнопки, таймеры, инпуты) */}
      <div className="w-full flex flex-col items-center gap-4">
        {children}
      </div>
    </div>
  )
}
