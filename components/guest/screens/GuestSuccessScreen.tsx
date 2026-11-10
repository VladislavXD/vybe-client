'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { GuestBackground } from '../background/GuestBackground'
import { SuccessStatusIcon } from '../status/SuccessStatusIcon'
import { OrderReceiptCard } from '../ui/OrderReceiptCard'
import type { GuestSuccessScreenProps } from '../types'

/**
 * Экран успешной заявки (Экран 4а: Диджей принял заявку).
 * Полностью адаптивен под любые экраны: от 320px до десктопа.
 */
export const GuestSuccessScreen: React.FC<GuestSuccessScreenProps> = ({
  venueName = 'Название заведения',
  tableNumber = 5,
  track = {
    title: 'Late Signal',
    artist: 'Neon Harbor',
    duration: '3:42',
    coverColor: '#3B3F58',
  },
  orderNumber = 'A7K2',
  responseTime = '21:16',
  amountPaid = 45000,
  onOrderAgain,
  onShowReceipt,
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
      {/* 1. Фон с изумрудным свечением успеха на всю ширину экрана */}
      <GuestBackground glowColor="#2F7F79" />

      {/* 2. Адаптивный центрированный контент */}
      <div className="relative z-10 mx-auto flex w-full max-w-[480px] flex-1 flex-col justify-between p-4 min-[390px]:p-5 sm:p-6 md:p-7 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
        {/* Шапка: Название заведения и статус */}
        <header className="flex flex-col gap-1 min-w-0 pt-0.5 sm:pt-1 shrink-0">
          <span className="truncate font-['Bricolage_Grotesque',sans-serif] text-sm sm:text-base font-bold tracking-tight">
            {venueName}
          </span>
          <div className="flex items-center gap-1.5 text-xs sm:text-[13px] text-[#A9A5B1]">
            <span className="size-2 rounded-full bg-[#5FD39A] shrink-0" />
            <span className="truncate">Заявка принята · Стол {tableNumber}</span>
          </div>
        </header>

        {/* Центральный блок: Анимация успеха + заголовок + чек */}
        <main className="flex flex-1 flex-col items-center justify-center gap-3.5 sm:gap-4 py-2 sm:py-3 text-center my-auto min-h-0">
          {/* Анимированная галочка, импульсы и конфетти */}
          <SuccessStatusIcon />

          <div className="flex flex-col items-center gap-1 sm:gap-1.5 max-w-[320px]">
            <h1 className="animate-fade-up-1 m-0 font-['Bricolage_Grotesque',sans-serif] text-2xl min-[360px]:text-[26px] sm:text-[28px] font-extrabold leading-tight tracking-tight">
              Заявка принята
            </h1>
            <p className="animate-fade-up-2 m-0 text-xs sm:text-[14px] leading-relaxed text-[#A9A5B1]">
              Трек прозвучит, когда подойдёт по сету. Оплата списана.
            </p>
          </div>

          {/* Информационный чек заказа */}
          <OrderReceiptCard
            trackTitle={track.title}
            trackArtist={track.artist}
            trackDuration={track.duration}
            orderNumber={orderNumber}
            responseTime={responseTime}
            amount={amountPaid}
            statusVariant="success"
            coverColor={track.coverColor}
          />
        </main>

        {/* Кнопки действий на базе shadcn Button */}
        <footer className="animate-fade-up-4 flex flex-col gap-2 pt-2 pb-1 sm:pb-3 shrink-0">
          <Button
            onClick={onOrderAgain}
            className="h-11 sm:h-12 w-full rounded-xl bg-[#F2EFE9] text-[#0B0B0C] font-bold text-xs sm:text-[15px] hover:bg-white active:scale-[0.985] transition-all cursor-pointer border-0 shadow-sm"
          >
            Заказать ещё трек
          </Button>

          <Button
            variant="outline"
            onClick={onShowReceipt}
            className="h-11 sm:h-12 w-full rounded-xl border border-[#6B6B73] bg-transparent text-[#F2EFE9] font-semibold text-xs sm:text-[15px] hover:bg-white/5 active:scale-[0.985] transition-all cursor-pointer"
          >
            Показать чек
          </Button>
        </footer>
      </div>
    </div>
  )
}
