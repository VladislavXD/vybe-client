'use client'

import React, { useState } from 'react'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { AuthInput } from '../ui/AuthInput'
import { AuthButton } from '../ui/AuthButton'
import type { LoginFormData, FormErrors } from '../types'

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void> | void
  onForgotPassword?: (email: string) => void
  isLoading?: boolean
  initialEmail?: string
}

export function LoginForm({
  onSubmit,
  onForgotPassword,
  isLoading = false,
  initialEmail = '',
}: LoginFormProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: initialEmail,
    password: '',
    rememberMe: true,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<FormErrors<LoginFormData>>({})

  const validate = (): boolean => {
    const e: FormErrors<LoginFormData> = {}
    if (!formData.email.trim()) {
      e.email = 'Введите адрес электронной почты'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      e.email = 'Некорректный формат почты'
    }
    if (!formData.password) {
      e.password = 'Введите пароль'
    } else if (formData.password.length < 6) {
      e.password = 'Минимум 6 символов'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    try {
      await onSubmit({ ...formData, email: formData.email.trim().toLowerCase() })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка авторизации.'
      setErrors((prev) => ({ ...prev, form: msg }))
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3.5">
      {errors.form && (
        <div className="px-3.5 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[12px] font-medium leading-relaxed">
          {errors.form}
        </div>
      )}

      <AuthInput
        label="Электронная почта"
        type="email"
        autoComplete="email"
        placeholder="name@example.com"
        value={formData.email}
        onChange={(e) => {
          setFormData((p) => ({ ...p, email: e.target.value }))
          if (errors.email) setErrors((p) => ({ ...p, email: undefined }))
        }}
        error={errors.email}
        leadingIcon={<Mail className="size-4" />}
        disabled={isLoading}
      />

      <div className="flex flex-col gap-1">
        <AuthInput
          label="Пароль"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => {
            setFormData((p) => ({ ...p, password: e.target.value }))
            if (errors.password) setErrors((p) => ({ ...p, password: undefined }))
          }}
          error={errors.password}
          leadingIcon={<Lock className="size-4" />}
          trailingIcon={
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="flex items-center p-1 rounded-lg text-white/30 hover:text-white/60 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          }
          disabled={isLoading}
        />
        {onForgotPassword && (
          <button
            type="button"
            onClick={() => onForgotPassword(formData.email)}
            className="self-end text-[11px] font-medium text-white/30 hover:text-[#EBC6A0] transition-colors cursor-pointer mt-0.5"
          >
            Забыли пароль?
          </button>
        )}
      </div>

      <div className="flex items-center gap-2.5 pt-0.5">
        <input
          id="remember"
          type="checkbox"
          checked={formData.rememberMe}
          onChange={(e) => setFormData((p) => ({ ...p, rememberMe: e.target.checked }))}
          className="size-4 rounded border-white/20 bg-white/5 accent-[#EBC6A0] cursor-pointer"
        />
        <label htmlFor="remember" className="text-[12px] text-white/35 cursor-pointer select-none">
          Запомнить меня
        </label>
      </div>

      <div className="pt-2.5">
        <AuthButton
          type="submit"
          variant="primary"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="size-4" strokeWidth={2.5} />}
        >
          Войти в аккаунт
        </AuthButton>
      </div>
    </form>
  )
}
