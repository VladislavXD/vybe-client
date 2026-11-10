'use client'

import React, { useState } from 'react'
import { User, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react'
import { AuthInput } from '../ui/AuthInput'
import { AuthButton } from '../ui/AuthButton'
import type { RegisterFormData, FormErrors } from '../types'

export interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void> | void
  isLoading?: boolean
  initialEmail?: string
}

export function RegisterForm({
  onSubmit,
  isLoading = false,
  initialEmail = '',
}: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: initialEmail,
    password: '',
    confirmPassword: '',
    acceptTerms: true,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState<FormErrors<RegisterFormData>>({})

  const validate = (): boolean => {
    const e: FormErrors<RegisterFormData> = {}
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      e.name = 'Введите имя (минимум 2 символа)'
    }
    if (!formData.email.trim()) {
      e.email = 'Введите адрес электронной почты'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      e.email = 'Некорректный формат почты'
    }
    if (!formData.password || formData.password.length < 6) {
      e.password = 'Минимум 6 символов'
    }
    if (formData.password !== formData.confirmPassword) {
      e.confirmPassword = 'Пароли не совпадают'
    }
    if (!formData.acceptTerms) {
      e.acceptTerms = 'Необходимо принять условия'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    try {
      await onSubmit({
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка регистрации.'
      setErrors((prev) => ({ ...prev, form: msg }))
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
      {errors.form && (
        <div className="px-3.5 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[12px] font-medium leading-relaxed">
          {errors.form}
        </div>
      )}

      <AuthInput
        label="Имя / Псевдоним"
        type="text"
        autoComplete="name"
        placeholder="DJ Pulse"
        value={formData.name}
        onChange={(e) => {
          setFormData((p) => ({ ...p, name: e.target.value }))
          if (errors.name) setErrors((p) => ({ ...p, name: undefined }))
        }}
        error={errors.name}
        leadingIcon={<User className="size-4" />}
        disabled={isLoading}
      />

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

      <AuthInput
        label="Пароль"
        type={showPassword ? 'text' : 'password'}
        autoComplete="new-password"
        placeholder="Минимум 6 символов"
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

      <AuthInput
        label="Подтверждение пароля"
        type={showConfirm ? 'text' : 'password'}
        autoComplete="new-password"
        placeholder="Повторите пароль"
        value={formData.confirmPassword}
        onChange={(e) => {
          setFormData((p) => ({ ...p, confirmPassword: e.target.value }))
          if (errors.confirmPassword) setErrors((p) => ({ ...p, confirmPassword: undefined }))
        }}
        error={errors.confirmPassword}
        leadingIcon={<ShieldCheck className="size-4" />}
        trailingIcon={
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowConfirm(!showConfirm)}
            className="flex items-center p-1 rounded-lg text-white/30 hover:text-white/60 transition-colors cursor-pointer"
          >
            {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        }
        disabled={isLoading}
      />

      {/* Terms */}
      <div className="flex flex-col gap-1 pt-0.5">
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={formData.acceptTerms}
            onChange={(e) => {
              setFormData((p) => ({ ...p, acceptTerms: e.target.checked }))
              if (errors.acceptTerms) setErrors((p) => ({ ...p, acceptTerms: undefined }))
            }}
            className="mt-[2px] size-4 shrink-0 rounded border-white/20 bg-white/5 accent-[#EBC6A0] cursor-pointer"
          />
          <span className="text-[12px] text-white/35 leading-tight">
            Я принимаю{' '}
            <span className="text-[#EBC6A0]/70 hover:text-[#EBC6A0] transition-colors underline underline-offset-2 cursor-pointer">
              правила сервиса
            </span>{' '}
            и соглашаюсь на обработку персональных данных
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="text-[11px] text-rose-400 font-medium pl-6.5">{errors.acceptTerms}</p>
        )}
      </div>

      <div className="pt-2">
        <AuthButton
          type="submit"
          variant="primary"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="size-4" strokeWidth={2.5} />}
        >
          Продолжить
        </AuthButton>
      </div>
    </form>
  )
}
