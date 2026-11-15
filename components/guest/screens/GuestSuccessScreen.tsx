'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { GuestBackground } from '../background/GuestBackground'
import { SuccessStatusIcon } from '../status/SuccessStatusIcon'
import { OrderReceiptCard } from '../ui/OrderReceiptCard'
import type { GuestSuccessScreenProps } from '../types'

/**
 * Единый динамический экран успешной заявки/оплаты для всех типов заказа:
 * Музыка (холд подтвержден DJ), Еда (заказ передан на кухню), Отзывы (оценка и чаевые отправлены).
 */
export const GuestSuccessScreen: React.FC<GuestSuccessScreenProps> = ({
  venueName = 'Название заведения',
  tableNumber = 5,
  order,
  orderType: explicitOrderType,
  track,
  foodItems,
  orderNumber: explicitOrderNumber,
  responseTime: explicitResponseTime,
  amountPaid: explicitAmountPaid,
  reviewRating: explicitReviewRating,
  onOrderAgain,
  onShowReceipt,
  className,
}) => {
  // Определяем тип заказа (из order или явных пропсов)
  const currentType = order?.orderType || explicitOrderType || 'music'
  const isMusic = currentType === 'music'
  const isFood = currentType === 'food'
  const isReview = currentType === 'review'

  const currentTable = order?.tableNumber || tableNumber
  const currentOrderNumber = order?.orderNumber || explicitOrderNumber || (isFood ? 'F491' : isReview ? 'R812' : 'A7K2')
  const currentAmount = order?.amount ?? explicitAmountPaid ?? (isFood ? 150000 : isReview ? 15000 : 45000)
  const currentTrack = order?.track || track || {
    title: 'Late Signal',
    artist: 'Neon Harbor',
    duration: '3:42',
    coverColor: '#3B3F58',
  }
  const currentCartItems = order?.cartItems || foodItems
  const currentRating = order?.reviewRating ?? explicitReviewRating ?? 5
  const currentResponseTime = order?.responseTime || explicitResponseTime || '21:16'

  // Динамические заголовки
  const getHeaderStatus = () => {
    if (isFood) return `Заказ готовится · Стол ${currentTable}`
    if (isReview) return `Отзыв отправлен · Стол ${currentTable}`
    return `Заявка принята · Стол ${currentTable}`
  }

  const getTitle = () => {
    if (isFood) return 'Заказ передан на кухню'
    if (isReview) return 'Спасибо за отзыв!'
    return 'Заявка принята'
  }

  const getDescription = () => {
    if (isFood) {
      return 'Повара уже начали готовить. Блюда принесут к вашему столику через ~15-20 мин.'
    }
    if (isReview) {
      return currentAmount > 0
        ? 'Ваша оценка и чаевые успешно переданы персоналу заведения.'
        : 'Ваша оценка успешно передана команде заведения.'
    }
    return 'Трек прозвучит, когда подойдёт по сету. Оплата списана.'
  }

  const getPrimaryButtonLabel = () => {
    if (isFood) return 'Дозаказать из меню'
    if (isReview) return 'Вернуться на главную'
    return 'Заказать ещё трек'
  }

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
        {/* Шапка: Название заведения и динамический статус */}
        <header className="flex flex-col gap-1 min-w-0 pt-0.5 sm:pt-1 shrink-0 text-left">
          <span className="truncate font-['Bricolage_Grotesque',sans-serif] text-sm sm:text-base font-bold tracking-tight">
            {order?.venueName || venueName}
          </span>
          <div className="flex items-center gap-1.5 text-xs sm:text-[13px] text-[#A9A5B1]">
            <span className="size-2 rounded-full bg-[#5FD39A] shrink-0 animate-pulse" />
            <span className="truncate">{getHeaderStatus()}</span>
          </div>
        </header>

        {/* Центральный блок: Анимация успеха + заголовок + динамический чек */}
        <main className="flex flex-1 flex-col items-center justify-center gap-3.5 sm:gap-4 py-2 sm:py-3 text-center my-auto min-h-0">
          {/* Анимированная галочка, импульсы и конфетти */}
          <SuccessStatusIcon />

          <div className="flex flex-col items-center gap-1 sm:gap-1.5 max-w-[340px]">
            <h1 className="animate-fade-up-1 m-0 font-['Bricolage_Grotesque',sans-serif] text-2xl min-[360px]:text-[26px] sm:text-[28px] font-extrabold leading-tight tracking-tight">
              {getTitle()}
            </h1>
            <p className="animate-fade-up-2 m-0 text-xs sm:text-[14px] leading-relaxed text-[#A9A5B1]">
              {getDescription()}
            </p>
          </div>

          {/* Единая динамическая информационная карточка чека */}
          <OrderReceiptCard
            orderType={currentType}
            statusVariant="success"
            orderNumber={currentOrderNumber}
            amount={currentAmount}
            tableNumber={currentTable}
            trackTitle={currentTrack.title}
            trackArtist={currentTrack.artist}
            trackDuration={currentTrack.duration}
            coverColor={currentTrack.coverColor}
            responseTime={currentResponseTime}
            cartItems={currentCartItems}
            estimatedPrepMinutes={order?.estimatedPrepMinutes || 15}
            reviewRating={currentRating}
            reviewTags={order?.reviewTags}
            reviewComment={order?.reviewComment}
            paymentMethodTitle={
              order?.paymentMethod
                ? order.paymentMethod.toUpperCase()
                : undefined
            }
          />
        </main>

        {/* Кнопки действий строго БЕЛАЯ и ПРОЗРАЧНАЯ */}
        <footer className="animate-fade-up-4 flex flex-col gap-2 pt-2 pb-1 sm:pb-3 shrink-0">
          {/* Белая основная кнопка */}
          <button
            type="button"
            onClick={onOrderAgain}
            className="h-11 sm:h-12 w-full rounded-xl bg-white text-[#0B0B0C] font-bold text-xs sm:text-[15px] hover:bg-white/90 active:scale-[0.985] transition-all cursor-pointer border-0 shadow-sm flex items-center justify-center"
          >
            {getPrimaryButtonLabel()}
          </button>

          {/* Прозрачная второстепенная кнопка */}
          <button
            type="button"
            onClick={onShowReceipt}
            className="h-11 sm:h-12 w-full rounded-xl border border-white/20 bg-transparent text-[#F2EFE9] font-semibold text-xs sm:text-[15px] hover:bg-white/5 active:scale-[0.985] transition-all cursor-pointer flex items-center justify-center"
          >
            Показать чек
          </button>
        </footer>
      </div>
    </div>
  )
}
