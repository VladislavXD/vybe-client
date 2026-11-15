'use client'

import React from 'react'
import { Sparkles } from 'lucide-react'

export interface RoleStepHeaderProps {
  currentStep?: number
  totalSteps?: number
  title?: string
  subtitle?: string
}

/**
 * Заголовок третьего этапа регистрации с прогресс-баром и бейджем шага.
 */
export function RoleStepHeader({
  currentStep = 3,
  totalSteps = 3,
  title = 'Выберите вашу роль',
  subtitle = 'Определите, как вы планируете работать в TrackUp. Роль откроет нужный рабочий стол и функции.',
}: RoleStepHeaderProps) {
  const progressPct = Math.round((currentStep / totalSteps) * 100)

  return (
    <div className="flex flex-col gap-3 text-center">
      {/* Прогресс регистрации */}
      <div className="flex items-center justify-between gap-3 px-1">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EBC6A0]/10 border border-[#EBC6A0]/20 text-[#EBC6A0] text-[11px] font-semibold tracking-wide">
          <Sparkles className="size-3 shrink-0" />
          <span>Шаг {currentStep} из {totalSteps}</span>
        </div>
        <span className="text-[11px] font-medium text-white/30">
          Завершение настройки
        </span>
      </div>

      {/* Линия прогресса */}
      <div className="h-1 w-full bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#EBC6A0]/70 to-[#EBC6A0] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Тексты */}
      <div className="flex flex-col gap-1 pt-1">
        <h2 className="text-[20px] sm:text-[22px] font-bold tracking-tight text-white leading-tight">
          {title}
        </h2>
        <p className="text-[12.5px] text-white/40 leading-relaxed max-w-[340px] mx-auto">
          {subtitle}
        </p>
      </div>
    </div>
  )
}
