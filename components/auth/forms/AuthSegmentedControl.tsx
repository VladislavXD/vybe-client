'use client'

import React from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { AuthMode } from '../types'
import { cn } from '@/lib/utils'

interface AuthSegmentedControlProps {
  mode: AuthMode
  onChange: (mode: AuthMode) => void
  disabled?: boolean
  className?: string
}

/**
 * Переключатель Вход / Регистрация.
 * Цвет акцента — #EBC6A0 (тёплый песок).
 */
export function AuthSegmentedControl({
  mode,
  onChange,
  disabled = false,
  className,
}: AuthSegmentedControlProps) {
  return (
    <div
      role="tablist"
      aria-label="Режим авторизации"
      className={cn('flex w-full gap-1 p-1 rounded-xl bg-white/[0.05] border border-white/8', className)}
    >
      {(['login', 'register'] as AuthMode[]).map((tab) => {
        const isActive = mode === tab
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={disabled}
            onClick={() => onChange(tab)}
            className={cn(
              'flex-1 h-9 rounded-lg text-[13px] font-semibold transition-all duration-200 cursor-pointer select-none',
              isActive
                ? 'text-[#0C0B0F] shadow-sm'
                : 'text-white/40 hover:text-white/70'
            )}
            style={
              isActive
                ? { backgroundColor: '#EBC6A0' }
                : {}
            }
          >
            {tab === 'login' ? 'Вход' : 'Регистрация'}
          </button>
        )
      })}
    </div>
  )
}
