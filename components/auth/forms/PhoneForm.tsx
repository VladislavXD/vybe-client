'use client'

import React, { useState } from 'react'
import { Phone, User, ArrowRight } from 'lucide-react'
import { AuthInput } from '../ui/AuthInput'
import { AuthButton } from '../ui/AuthButton'
import type { PhoneFormData, FormErrors, AuthMode } from '../types'

export interface PhoneFormProps {
  mode: AuthMode
  onSubmit: (data: PhoneFormData) => Promise<void> | void
  isLoading?: boolean
  initialPhone?: string
}

/**
 * Форма входа / регистрации по номеру телефона.
 */
export function PhoneForm({
  mode,
  onSubmit,
  isLoading = false,
  initialPhone = '',
}: PhoneFormProps) {
  const [formData, setFormData] = useState<PhoneFormData>({
    phone: initialPhone,
    name: '',
    acceptTerms: true,
  })
  const [errors, setErrors] = useState<FormErrors<PhoneFormData>>({})

  // Форматирование телефона на лету (+998 или +7)
  const formatPhone = (val: string) => {
    // оставляем только цифры и плюс в начале
    const cleaned = val.replace(/[^\d+]/g, '')
    return cleaned
  }

  const validate = (): boolean => {
    const e: FormErrors<PhoneFormData> = {}
    const digitsOnly = formData.phone.replace(/\D/g, '')

    if (!formData.phone.trim()) {
      e.phone = 'Введите номер телефона'
    } else if (digitsOnly.length < 9) {
      e.phone = 'Некорректный номер телефона'
    }

    if (mode === 'register') {
      if (!formData.name?.trim() || formData.name.trim().length < 2) {
        e.name = 'Введите имя (минимум 2 символа)'
      }
      if (!formData.acceptTerms) {
        e.acceptTerms = 'Необходимо принять условия'
      }
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
        phone: formData.phone.trim(),
        name: formData.name?.trim(),
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка отправки кода.'
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

      {mode === 'register' && (
        <AuthInput
          label="Имя / Псевдоним"
          type="text"
          autoComplete="name"
          placeholder="DJ Pulse"
          value={formData.name || ''}
          onChange={(e) => {
            setFormData((p) => ({ ...p, name: e.target.value }))
            if (errors.name) setErrors((p) => ({ ...p, name: undefined }))
          }}
          error={errors.name}
          leadingIcon={<User className="size-4" />}
          disabled={isLoading}
        />
      )}

      <AuthInput
        label="Номер телефона"
        type="tel"
        autoComplete="tel"
        placeholder="+998 90 123 45 67"
        value={formData.phone}
        onChange={(e) => {
          const formatted = formatPhone(e.target.value)
          setFormData((p) => ({ ...p, phone: formatted }))
          if (errors.phone) setErrors((p) => ({ ...p, phone: undefined }))
        }}
        error={errors.phone}
        leadingIcon={<Phone className="size-4" />}
        disabled={isLoading}
      />

      {mode === 'register' && (
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
              </span>
            </span>
          </label>
          {errors.acceptTerms && (
            <p className="text-[11px] text-rose-400 font-medium pl-6.5">{errors.acceptTerms}</p>
          )}
        </div>
      )}

      <div className="pt-2">
        <AuthButton
          type="submit"
          variant="primary"
          isLoading={isLoading}
          rightIcon={<ArrowRight className="size-4" strokeWidth={2.5} />}
        >
          Получить код в SMS
        </AuthButton>
      </div>
    </form>
  )
}
