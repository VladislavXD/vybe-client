'use client'

import React from 'react'
import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { GuestBackground } from '../background/GuestBackground'
import { FailureStatusIcon } from '../status/FailureStatusIcon'
import { OrderReceiptCard } from '../ui/OrderReceiptCard'
import type { GuestFailureScreenProps } from '../types'

/**
 * Экран отклонённой заявки (Экран 4б: Диджей не смог поставить трек).
 * Полностью адаптивен под любые экраны: от 320px до десктопа.
 */
export const GuestFailureScreen: React.FC<GuestFailureScreenProps> = ({
  venueName = 'Название заведения',
  tableNumber = 5,
  track = {
    title: 'Late Signal',
    artist: 'Neon Harbor',
    duration: '3:42',
    coverColor: '#3B3F58',
  },
  orderNumber = 'A7K2',
  rejectionReason = 'Не подходит по сету',
  amountRefunded = 45000,
  onChooseAnotherTrack,
  className,
}) => {
  return (
    <div
      className={cn(
        'relative w-full min-h-[100dvh] sm:min-h-0 sm:h-full flex flex-col justify-between overflow-y-auto overflow-x-hidden scrollbar-none',
        'bg-[#0B0B0C] text-[#F2EFE9] font-["Manrope",sans-serif]',
        className
      )}
    >
      {/* 1. Фон с кораллово-розовым свечением на всю ширину экрана */}
      <GuestBackground glowColor="#B5646F" />

      {/* 2. Адаптивный центрированный контент */}
      <div className="relative z-10 mx-auto flex w-full max-w-[480px] flex-1 flex-col justify-between p-4 min-[390px]:p-5 sm:p-6 md:p-7 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
        {/* Шапка: Название заведения и статус с коралловой точкой */}
        <header className="flex flex-col gap-1 min-w-0 pt-0.5 sm:pt-1 shrink-0">
          <span className="truncate font-['Bricolage_Grotesque',sans-serif] text-sm sm:text-base font-bold tracking-tight">
            {venueName}
          </span>
          <div className="flex items-center gap-1.5 text-xs sm:text-[13px] text-[#A9A5B1]">
            <span className="size-2 rounded-full bg-[#F08A7E] shrink-0" />
            <span className="truncate">Заявка отклонена · Стол {tableNumber}</span>
          </div>
        </header>

        {/* Центральный блок: Анимация крестика + заголовок + карточка + сноска */}
        <main className="flex flex-1 flex-col items-center justify-center gap-3.5 sm:gap-4 py-2 sm:py-3 text-center my-auto min-h-0">
          {/* Анимированный покачивающийся крестик, схлопывание и дымок */}
          <FailureStatusIcon />

          <div className="flex flex-col items-center gap-1 sm:gap-1.5 max-w-[320px]">
            <h1 className="animate-fade-up-1 m-0 font-['Bricolage_Grotesque',sans-serif] text-2xl min-[360px]:text-[26px] sm:text-[28px] font-extrabold leading-tight tracking-tight">
              Заявка отклонена
            </h1>
            <p className="animate-fade-up-2 m-0 text-xs sm:text-[14px] leading-relaxed text-[#A9A5B1]">
              Деньги не списаны. Блокировка на карте снята.
            </p>
          </div>

          {/* Информационная карточка */}
          <OrderReceiptCard
            trackTitle={track.title}
            trackArtist={track.artist}
            trackDuration={track.duration}
            orderNumber={orderNumber}
            reasonLabel={rejectionReason}
            amount={amountRefunded}
            statusVariant="failure"
            coverColor={track.coverColor}
          />

          {/* Пояснение по банковской холдировке */}
          <div className="animate-fade-up-4 flex items-start gap-2 text-left text-xs sm:text-[13px] leading-snug text-[#A9A5B1] px-1">
            <Info aria-hidden="true" className="size-4 shrink-0 mt-0.5 text-[#A9A5B1]" />
            <span>В приложении банка блокировка может исчезнуть не сразу.</span>
          </div>
        </main>

        {/* Кнопка действия на базе shadcn Button */}
        <footer className="animate-fade-up-4 flex flex-col gap-2 pt-2 pb-1 sm:pb-3 shrink-0">
          <Button
            onClick={onChooseAnotherTrack}
            className="h-11 sm:h-12 w-full rounded-xl bg-[#F2EFE9] text-[#0B0B0C] font-bold text-xs sm:text-[15px] hover:bg-white active:scale-[0.985] transition-all cursor-pointer border-0 shadow-sm"
          >
            Выбрать другой трек
          </Button>
        </footer>
      </div>
    </div>
  )
}
