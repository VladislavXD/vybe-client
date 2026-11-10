'use client'

import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
  containerClassName?: string
}

/**
 * Поле ввода для форм авторизации.
 * Тёмная тема: минимализм, тонкие границы, фокус с песчаным акцентом.
 */
export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  (
    {
      label,
      error,
      hint,
      leadingIcon,
      trailingIcon,
      containerClassName,
      className,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id ?? (label ? `field-${label.replace(/[^a-zA-Zа-яА-Я0-9]/g, '-')}` : undefined)

    return (
      <div className={cn('flex flex-col gap-1.5 w-full', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/40 select-none"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          {leadingIcon && (
            <div className="absolute left-3.5 flex items-center justify-center text-white/25 pointer-events-none z-10">
              {leadingIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            className={cn(
              'w-full h-[46px] rounded-xl px-3.5 text-[14px] font-medium transition-all outline-none',
              'bg-white/[0.05] border border-white/10 text-white placeholder:text-white/20',
              'focus:border-[#EBC6A0]/60 focus:bg-white/[0.07]',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              leadingIcon && 'pl-10',
              trailingIcon && 'pr-10',
              error && 'border-rose-500/60 focus:border-rose-500/60',
              className
            )}
            {...props}
          />

          {trailingIcon && (
            <div className="absolute right-3 flex items-center justify-center text-white/30 z-10">
              {trailingIcon}
            </div>
          )}
        </div>

        {error ? (
          <p className="text-[11px] text-rose-400 font-medium animate-in fade-in-0 duration-150 pl-0.5">
            {error}
          </p>
        ) : hint ? (
          <p className="text-[11px] text-white/30 pl-0.5">{hint}</p>
        ) : null}
      </div>
    )
  }
)

AuthInput.displayName = 'AuthInput'
