'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RoleOption } from './types'

export interface RoleCardProps {
  option: RoleOption
  isSelected: boolean
  onSelect: () => void
  disabled?: boolean
}

/**
 * Интерактивная карточка выбора роли (Владелец заведения / DJ).
 * Поддерживает клавиатурную навигацию (Enter, Пробел), состояния фокуса и выделения.
 */
export function RoleCard({
  option,
  isSelected,
  onSelect,
  disabled = false,
}: RoleCardProps) {
  const Icon = option.icon

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect()
    }
  }

  return (
    <div
      role="radio"
      aria-checked={isSelected}
      tabIndex={disabled ? -1 : 0}
      onClick={() => !disabled && onSelect()}
      onKeyDown={handleKeyDown}
      className={cn(
        'group relative flex flex-col p-4 rounded-xl border text-left transition-all duration-200 select-none outline-none cursor-pointer',
        isSelected
          ? 'bg-white/[0.06] border-[#EBC6A0] shadow-[0_0_24px_rgba(235,198,160,0.12)]'
          : 'bg-white/[0.02] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.035]',
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
      )}
    >
      {/* Верхняя строка: Иконка + Бейдж + Радио-индикатор */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex size-11 items-center justify-center rounded-xl transition-all duration-200 shrink-0',
              isSelected
                ? 'bg-[#EBC6A0]/20 text-[#EBC6A0] border border-[#EBC6A0]/40'
                : 'bg-white/[0.05] text-white/50 border border-white/[0.07] group-hover:text-white/80 group-hover:bg-white/[0.08]'
            )}
          >
            <Icon className="size-5" strokeWidth={isSelected ? 2.2 : 1.8} />
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[15px] font-bold text-white tracking-tight leading-tight">
              {option.title}
            </span>
            <span className="text-[11px] text-white/40 font-medium">
              {option.badge}
            </span>
          </div>
        </div>

        {/* Индикатор выбора (Radio check) */}
        <div
          className={cn(
            'flex size-5 items-center justify-center rounded-full border transition-all duration-200 shrink-0 mt-0.5',
            isSelected
              ? 'bg-[#EBC6A0] border-[#EBC6A0] text-[#0C0B0F]'
              : 'border-white/20 bg-transparent group-hover:border-white/40'
          )}
        >
          {isSelected && <Check className="size-3 stroke-[3]" />}
        </div>
      </div>

      {/* Описание */}
      <p className="text-[12px] text-white/50 leading-relaxed mb-3">
        {option.description}
      </p>

      {/* Нижняя плашка: Процент выплаты */}
      <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.05]">
        <span className="text-[11px] text-white/35 font-medium">
          {option.shareLabel}
        </span>
        <span
          className={cn(
            'px-2 py-0.5 rounded-md text-[11px] font-bold tracking-tight',
            isSelected
              ? 'bg-[#EBC6A0]/15 text-[#EBC6A0] border border-[#EBC6A0]/30'
              : 'bg-white/[0.05] text-white/60 border border-white/[0.06]'
          )}
        >
          {option.sharePct}
        </span>
      </div>
    </div>
  )
}
