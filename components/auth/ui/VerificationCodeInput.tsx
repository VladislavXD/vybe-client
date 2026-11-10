'use client'

import React from 'react'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { cn } from '@/lib/utils'

export interface VerificationCodeInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  onComplete?: (code: string) => void
  disabled?: boolean
  error?: boolean
  autoFocus?: boolean
  className?: string
}

/**
 * OTP-поле 6 цифр. Слоты — тёмные квадраты с белыми границами.
 * Активный слот подсвечивается акцентом #EBC6A0.
 */
export function VerificationCodeInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  error = false,
  autoFocus = true,
  className,
}: VerificationCodeInputProps) {
  return (
    <div className={cn('flex justify-center w-full py-1', className)}>
      <InputOTP
        maxLength={length}
        value={value}
        onChange={onChange}
        onComplete={onComplete}
        disabled={disabled}
        autoFocus={autoFocus}
        containerClassName="gap-2 sm:gap-2.5 justify-center"
      >
        <InputOTPGroup className="gap-2 sm:gap-2.5">
          {Array.from({ length }).map((_, index) => (
            <InputOTPSlot
              key={index}
              index={index}
              className={cn(
                // Reset shadcn defaults — override borders for dark theme
                'first:rounded-xl last:rounded-xl first:border last:border',
                'size-11 sm:size-12 rounded-xl text-base sm:text-lg font-bold font-mono',
                'bg-white/[0.04] border border-white/12 text-white',
                'transition-all duration-150',
                'data-[active=true]:border-[#EBC6A0]/70 data-[active=true]:bg-white/[0.07] data-[active=true]:ring-0',
                error && 'border-rose-500/50 text-rose-400'
              )}
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
    </div>
  )
}
