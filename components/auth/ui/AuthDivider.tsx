'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface AuthDividerProps {
  label?: string
  className?: string
}

/**
 * Минималистичный разделитель «или» между методами входа.
 */
export function AuthDivider({ label = 'или', className }: AuthDividerProps) {
  return (
    <div className={cn('relative flex items-center gap-3 w-full', className)}>
      <div className="flex-1 h-px bg-white/[0.07]" />
      <span className="text-[11px] font-medium text-white/25 tracking-wider uppercase flex-shrink-0">
        {label}
      </span>
      <div className="flex-1 h-px bg-white/[0.07]" />
    </div>
  )
}
