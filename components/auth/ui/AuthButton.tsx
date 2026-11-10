'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export type AuthButtonVariant = 'primary' | 'white' | 'ghost'

export interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AuthButtonVariant
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

/**
 * Кнопки авторизации.
 * primary — белая (#FFFFFF) с тёмным текстом
 * white   — прозрачная с белой обводкой
 * ghost   — без фона и обводки
 */
export function AuthButton({
  children,
  variant = 'primary',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}: AuthButtonProps) {
  const styles: Record<AuthButtonVariant, string> = {
    primary:
      'bg-white text-[#0C0B0F] hover:bg-white/90 active:scale-[0.98] font-bold shadow-sm',
    white:
      'bg-transparent border border-white/20 text-white/80 hover:border-white/40 hover:text-white active:scale-[0.98] font-semibold',
    ghost:
      'bg-transparent text-white/40 hover:text-white/70 font-medium',
  }

  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        'relative flex items-center justify-center gap-2 w-full h-12 px-5 rounded-xl text-[14px] leading-none',
        'transition-all duration-150 cursor-pointer select-none outline-none',
        'focus-visible:ring-2 focus-visible:ring-[#EBC6A0]/50',
        styles[variant],
        (disabled || isLoading) && 'opacity-40 cursor-not-allowed active:scale-100',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="size-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  )
}
