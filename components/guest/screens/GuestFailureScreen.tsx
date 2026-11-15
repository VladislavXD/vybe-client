'use client'

import React from 'react'
import { Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GuestBackground } from '../background/GuestBackground'
import { FailureStatusIcon } from '../status/FailureStatusIcon'
import { OrderReceiptCard } from '../ui/OrderReceiptCard'
import type { GuestFailureScreenProps } from '../types'

/**
 * Единый динамический экран отклонённой заявки или ошибки оплаты для всех типов заказа:
 * Музыка (трек отклонен диджеем/таймаут), Еда (ошибка списания/недоступно), Отзывы (ошибка перевода чаевых).
 */
export const GuestFailureScreen: React.FC<GuestFailureScreenProps> = ({
  venueName = 'Название заведения',
  tableNumber = 5,
  order,
  orderType: explicitOrderType,
  track,
  foodItems,
  orderNumber: explicitOrderNumber,
  rejectionReason: explicitRejectionReason,
  amountRefunded: explicitAmountRefunded,
  onRetry,
  onChooseAnotherTrack,
  className,
}) => {
  // Определяем тип заказа (из order или явных пропсов)
  const currentType = order?.orderType || explicitOrderType || 'music'
  const isMusic = currentType === 'music'
  const isFood = currentType === 'food'
  const isReview = currentType === 'review'

  const currentTable = order?.tableNumber || tableNumber
  const currentOrderNumber = order?.orderNumber || explicitOrderNumber || (isFood ? 'F491' : isReview ? 'R812' : 'A7K2')
  const currentAmount = order?.amount ?? explicitAmountRefunded ?? (isFood ? 150000 : isReview ? 15000 : 45000)
  const currentTrack = order?.track || track || {
    title: 'Late Signal',
    artist: 'Neon Harbor',
    duration: '3:42',
    coverColor: '#3B3F58',
  }
  const currentCartItems = order?.cartItems || foodItems
  const currentRating = order?.reviewRating ?? 5
  const currentReason = order?.rejectionReason || explicitRejectionReason || (
    isFood
      ? 'Ошибка авторизации платежа банком'
      : isReview
      ? 'Недостаточно средств для чаевых'
      : 'Не подходит по сету'
  )

  // Динамические заголовки
  const getHeaderStatus = () => {
    if (isFood) return `Ошибка оплаты · Стол ${currentTable}`
    if (isReview) return `Оплата не прошла · Стол ${currentTable}`
    return `Заявка отклонена · Стол ${currentTable}`
  }

  const getTitle = () => {
    if (isFood) return 'Оплата не прошла'
    if (isReview) return 'Не удалось списать чаевые'
    return 'Заявка отклонена'
  }

  const getDescription = () => {
    if (isFood) {
      return 'Деньги не списаны. Блюда остались в корзине, вы можете попробовать другой способ оплаты.'
    }
    if (isReview) {
      return 'Сумма чаевых не списана. Вы можете повторить попытку или оставить отзыв без чаевых.'
    }
    return 'Деньги не списаны. Блокировка на карте снята.'
  }

  const getFootnote = () => {
    if (isFood) {
      return 'Вы также можете выбрать оплату официанту при закрытии счета.'
    }
    if (isReview) {
      return 'Ваш отзыв сохранен и будет передан администрации.'
    }
    return 'В приложении банка блокировка может исчезнуть не сразу.'
  }

  const getPrimaryButtonLabel = () => {
    if (isFood) return 'Попробовать снова'
    if (isReview) return 'Повторить оплату'
    return 'Выбрать другой трек'
  }

  const getSecondaryButtonLabel = () => {
    if (isFood) return 'Вернуться в меню'
    if (isReview) return 'Оставить без чаевых'
    return 'Сменить способ оплаты'
  }

  const handlePrimaryAction = () => {
    if (onRetry) {
      onRetry()
    } else if (onChooseAnotherTrack) {
      onChooseAnotherTrack()
    }
  }

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
        <header className="flex flex-col gap-1 min-w-0 pt-0.5 sm:pt-1 shrink-0 text-left">
          <span className="truncate font-['Bricolage_Grotesque',sans-serif] text-sm sm:text-base font-bold tracking-tight">
            {order?.venueName || venueName}
          </span>
          <div className="flex items-center gap-1.5 text-xs sm:text-[13px] text-[#A9A5B1]">
            <span className="size-2 rounded-full bg-[#F08A7E] shrink-0" />
            <span className="truncate">{getHeaderStatus()}</span>
          </div>
        </header>

        {/* Центральный блок: Анимация крестика + заголовок + динамическая карточка + сноска */}
        <main className="flex flex-1 flex-col items-center justify-center gap-3.5 sm:gap-4 py-2 sm:py-3 text-center my-auto min-h-0">
          {/* Анимированный покачивающийся крестик, схлопывание и дымок */}
          <FailureStatusIcon />

          <div className="flex flex-col items-center gap-1 sm:gap-1.5 max-w-[340px]">
            <h1 className="animate-fade-up-1 m-0 font-['Bricolage_Grotesque',sans-serif] text-2xl min-[360px]:text-[26px] sm:text-[28px] font-extrabold leading-tight tracking-tight">
              {getTitle()}
            </h1>
            <p className="animate-fade-up-2 m-0 text-xs sm:text-[14px] leading-relaxed text-[#A9A5B1]">
              {getDescription()}
            </p>
          </div>

          {/* Единая динамическая информационная карточка */}
          <OrderReceiptCard
            orderType={currentType}
            statusVariant="failure"
            orderNumber={currentOrderNumber}
            amount={currentAmount}
            tableNumber={currentTable}
            trackTitle={currentTrack.title}
            trackArtist={currentTrack.artist}
            trackDuration={currentTrack.duration}
            coverColor={currentTrack.coverColor}
            cartItems={currentCartItems}
            reviewRating={currentRating}
            reviewTags={order?.reviewTags}
            reviewComment={order?.reviewComment}
            reasonLabel={currentReason}
            paymentMethodTitle={
              order?.paymentMethod
                ? order.paymentMethod.toUpperCase()
                : undefined
            }
          />

          {/* Пояснение по банковской холдировке или статусу */}
          <div className="animate-fade-up-4 flex items-start gap-2 text-left text-xs sm:text-[13px] leading-snug text-[#A9A5B1] px-1">
            <Info aria-hidden="true" className="size-4 shrink-0 mt-0.5 text-[#A9A5B1]" />
            <span>{getFootnote()}</span>
          </div>
        </main>

        {/* Кнопки действий строго БЕЛАЯ и ПРОЗРАЧНАЯ */}
        <footer className="animate-fade-up-4 flex flex-col gap-2 pt-2 pb-1 sm:pb-3 shrink-0">
          {/* Белая основная кнопка */}
          <button
            type="button"
            onClick={handlePrimaryAction}
            className="h-11 sm:h-12 w-full rounded-xl bg-white text-[#0B0B0C] font-bold text-xs sm:text-[15px] hover:bg-white/90 active:scale-[0.985] transition-all cursor-pointer border-0 shadow-sm flex items-center justify-center"
          >
            {getPrimaryButtonLabel()}
          </button>

          {/* Прозрачная второстепенная кнопка */}
          <button
            type="button"
            onClick={onChooseAnotherTrack}
            className="h-11 sm:h-12 w-full rounded-xl border border-white/20 bg-transparent text-[#F2EFE9] font-semibold text-xs sm:text-[15px] hover:bg-white/5 active:scale-[0.985] transition-all cursor-pointer flex items-center justify-center"
          >
            {getSecondaryButtonLabel()}
          </button>
        </footer>
      </div>
    </div>
  )
}
