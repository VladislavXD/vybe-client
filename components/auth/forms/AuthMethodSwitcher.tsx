'use client'

import React from 'react'
import { Mail, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AuthMethod } from '../types'

interface AuthMethodSwitcherProps {
  method: AuthMethod
  onChange: (method: AuthMethod) => void
  disabled?: boolean
  className?: string
}

/**
 * Переключатель между авторизацией по Email и по Номеру телефона.
 */
export function AuthMethodSwitcher({
  method,
  onChange,
  disabled = false,
  className,
}: AuthMethodSwitcherProps) {
  return (
    <div className={cn('flex items-center justify-center gap-1.5 p-0.5 rounded-lg bg-white/[0.03] border border-white/6 w-fit mx-auto', className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange('email')}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all cursor-pointer',
          method === 'email'
            ? 'bg-white/10 text-white shadow-xs'
            : 'text-white/40 hover:text-white/70'
        )}
      >
        <Mail className="size-3.5" />
        <span>Почта</span>
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange('phone')}
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all cursor-pointer',
          method === 'phone'
            ? 'bg-white/10 text-white shadow-xs'
            : 'text-white/40 hover:text-white/70'
        )}
      >
        <Phone className="size-3.5" />
        <span>Телефон</span>
      </button>
    </div>
  )
}
