'use client'

import React from 'react'
import { Lock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { GuestBackground } from '../background/GuestBackground'
import { GramophonePlayer } from '../gramophone/GramophonePlayer'
import { EqualizerBars } from '../ui/EqualizerBars'
import { ShimmerButton } from '../ui/ShimmerButton'
import type { GuestInitialScreenProps } from '../types'

/**
 * Начальный экран заказа трека гостем (Экран 0: Вход по QR).
 * Полностью адаптивен под любые экраны: от 320px до десктопа.
 */
export const GuestInitialScreen: React.FC<GuestInitialScreenProps> = ({
  venueName = 'Название заведения',
  tableNumber = 5,
  onSelectTrack,
  className,
}) => {
  return (
    <div
      className={cn(
        'relative w-full min-h-[100dvh] sm:min-h-0 sm:h-full flex flex-col justify-between overflow-y-auto overflow-x-hidden scrollbar-none',
        'bg-[#0D0C10] text-[#F2EFE9] font-["Manrope",sans-serif]',
        className
      )}
    >
      {/* 1. Атмосферный фон с парящими сферами и зернистым шумом на всю ширину */}
      <GuestBackground />

      {/* 2. Адаптивный контентный контейнер с центрированием на планшетах/десктопах */}
      <div className="relative z-10 mx-auto flex w-full max-w-[480px] flex-1 flex-col justify-between p-4 min-[390px]:p-5 sm:p-6 md:p-7 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
        {/* Верхняя панель: Заведение, живой эквалайзер и номер стола */}
        <header className="animate-fade-down flex items-center justify-between gap-3 pt-0.5 sm:pt-1 shrink-0">
          <div className="flex flex-col gap-1 min-w-0">
            <span className="truncate font-['Bricolage_Grotesque',sans-serif] text-base sm:text-lg font-bold tracking-tight">
              {venueName}
            </span>

            <div className="flex items-center gap-2 text-xs sm:text-[13px] text-[#B4AFBB]">
              <EqualizerBars color="#EBC6A0" />
              <span className="truncate">Принимает заявки</span>
            </div>
          </div>

          {/* Бейдж столика на базе shadcn Badge */}
          <Badge
            variant="outline"
            className="rounded-full bg-white/8 border-white/12 px-2.5 sm:px-3 py-1 text-xs sm:text-[13px] font-bold text-[#F2EFE9] shrink-0"
          >
            <span className="font-normal text-[#B4AFBB] mr-1">Стол</span>
            {tableNumber}
          </Badge>
        </header>

        {/* Центральная часть: Анимированный виниловый грамофон */}
        <main className="flex flex-1 flex-col justify-center py-2 sm:py-3 min-h-0">
          <GramophonePlayer />

          {/* Заголовок с анимацией поочередного выезда строк (lineUp) */}
          <div className="flex flex-col gap-1.5 sm:gap-2 pt-1 sm:pt-3">
            <h1 className="m-0 select-none">
              <span className="block overflow-hidden pb-0.5">
                <span className="animate-line-up-1 block font-['Bricolage_Grotesque',sans-serif] text-[26px] min-[360px]:text-[32px] min-[390px]:text-[38px] sm:text-[42px] font-extrabold leading-[1.04] tracking-tight">
                  Скажи диджею,
                </span>
              </span>
              <span className="block overflow-hidden pb-1">
                <span className="animate-line-up-2 block font-['Bricolage_Grotesque',sans-serif] text-[26px] min-[360px]:text-[32px] min-[390px]:text-[38px] sm:text-[42px] font-extrabold leading-[1.04] tracking-tight text-[#EBC6A0]">
                  что играть
                </span>
              </span>
            </h1>

            <p className="animate-fade-up-2 m-0 text-xs min-[360px]:text-sm sm:text-[15px] leading-relaxed text-[#B4AFBB] max-w-[340px]">
              Выбери трек, отправь заявку и оплати. Диджей поставит его, когда он подойдёт по сету.
            </p>
          </div>
        </main>

        {/* Нижний блок: Кнопка действия со скользящим бликом и сноска */}
        <footer className="flex flex-col gap-2 sm:gap-2.5 pt-2 pb-1 sm:pb-3 shrink-0">
          <ShimmerButton onClick={onSelectTrack}>
            Выбрать трек
          </ShimmerButton>

          <div className="animate-fade-up-4 flex items-center justify-center gap-1.5 text-[11px] min-[360px]:text-xs sm:text-[12.5px] text-[#9A95A3]">
            <Lock aria-hidden="true" className="size-3.5 shrink-0 stroke-[2]" />
            <span>Без регистрации · оплата Payme и Click</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
