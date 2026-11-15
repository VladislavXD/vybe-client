'use client'

import React, { useState } from 'react'
import { Ticket, ChevronDown, ChevronUp } from 'lucide-react'
import { AuthInput } from '../ui/AuthInput'

export interface RoleInviteInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

/**
 * Опциональный блок ввода инвайт-кода от заведения для роли DJ.
 * Декомпозирован для изолированного использования и масштабируемости.
 */
export function RoleInviteInput({
  value,
  onChange,
  disabled = false,
}: RoleInviteInputProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-white/[0.02] border border-white/[0.05] p-3 transition-colors">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center justify-between text-left w-full text-[12px] font-medium text-[#EBC6A0]/80 hover:text-[#EBC6A0] transition-colors cursor-pointer select-none"
      >
        <span className="flex items-center gap-1.5">
          <Ticket className="size-3.5 shrink-0" />
          <span>Есть код приглашения от клуба? (необязательно)</span>
        </span>
        {isOpen ? (
          <ChevronUp className="size-3.5 text-white/40" />
        ) : (
          <ChevronDown className="size-3.5 text-white/40" />
        )}
      </button>

      {isOpen && (
        <div className="pt-2 animate-in fade-in-0 slide-in-from-top-1 duration-150">
          <AuthInput
            label="Код приглашения"
            placeholder="Например: VENUE-DJ-784"
            value={value}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            disabled={disabled}
            autoCapitalize="characters"
          />
          <p className="text-[11px] text-white/30 pt-1 leading-normal">
            Если клуб прислал вам 6-8 значный код, введите его для автоматической привязки к сменам заведения.
          </p>
        </div>
      )}
    </div>
  )
}
