import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Music, UtensilsCrossed, Star, Heart, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/src/utils/formatCurrency'
import type { CartItem, GuestOrderType } from '../types'

export interface OrderReceiptCardProps {
  orderType?: GuestOrderType
  statusVariant: 'success' | 'failure'
  amount: number
  orderNumber: string

  // Music props
  trackTitle?: string
  trackArtist?: string
  trackDuration?: string
  coverColor?: string
  responseTime?: string
  typeLabel?: string

  // Food props
  cartItems?: CartItem[]
  estimatedPrepMinutes?: number

  // Review props
  reviewRating?: number
  reviewTags?: string[]
  reviewComment?: string

  // General props
  reasonLabel?: string
  paymentMethodTitle?: string
  tableNumber?: string | number
  className?: string
}

/**
 * Единая динамическая информационная карточка чека заявки/заказа.
 * Адаптируется под любой тип заказа (музыка, еда, отзывы) без троекратного дублирования кода.
 */
export const OrderReceiptCard: React.FC<OrderReceiptCardProps> = ({
  orderType = 'music',
  statusVariant,
  amount,
  orderNumber,
  trackTitle = 'Late Signal',
  trackArtist = 'Neon Harbor',
  trackDuration = '3:42',
  coverColor = '#3B3F58',
  responseTime = '21:16',
  typeLabel = 'Обычная',
  cartItems,
  estimatedPrepMinutes = 15,
  reviewRating = 5,
  reviewTags,
  reviewComment,
  reasonLabel,
  paymentMethodTitle,
  tableNumber,
  className,
}) => {
  const isSuccess = statusVariant === 'success'
  const isMusic = orderType === 'music'
  const isFood = orderType === 'food'
  const isReview = orderType === 'review'

  return (
    <Card
      className={cn(
        'animate-fade-up-3 w-full border-0 bg-[#141415]/95 text-[#F2EFE9] rounded-2xl p-3.5 sm:p-4 shadow-xl backdrop-blur-md ring-1 ring-white/10',
        className
      )}
    >
      <CardContent className="p-0 flex flex-col gap-3">
        {/* 1. ШАПКА КАРТОЧКИ ПО ТИПУ ЗАКАЗА */}

        {/* МУЗЫКА */}
        {isMusic && (
          <div className="flex items-center gap-3">
            <div
              className="size-11 sm:size-12 shrink-0 rounded-xl shadow-md flex items-center justify-center border border-white/10"
              style={{ background: coverColor }}
            >
              <Music className="size-5 text-white/90" />
            </div>
            <div className="flex flex-col min-w-0 flex-1 text-left">
              <span className="truncate text-sm sm:text-[15px] font-bold text-[#F2EFE9]">
                {trackTitle}
              </span>
              <span className="truncate text-xs sm:text-[13px] text-[#A9A5B1]">
                {trackArtist} · {trackDuration}
              </span>
            </div>
          </div>
        )}

        {/* ЕДА И НАПИТКИ */}
        {isFood && (
          <div className="flex items-center gap-3">
            <div className="size-11 sm:size-12 shrink-0 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-[#EBC6A0]">
              <UtensilsCrossed className="size-5" />
            </div>
            <div className="flex flex-col min-w-0 flex-1 text-left">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm sm:text-[15px] font-bold text-[#F2EFE9]">
                  Заказ на кухню и бар
                </span>
                {tableNumber && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.08] text-white/70 font-mono">
                    Стол {tableNumber}
                  </span>
                )}
              </div>
              <span className="truncate text-xs sm:text-[13px] text-[#A9A5B1]">
                {cartItems ? `${cartItems.length} поз.` : 'Блюда из онлайн-меню'}
              </span>
            </div>
          </div>
        )}

        {/* ОТЗЫВЫ И ЧАЕВЫЕ */}
        {isReview && (
          <div className="flex items-center gap-3">
            <div className="size-11 sm:size-12 shrink-0 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-[#EBC6A0]">
              <Star className="size-5 fill-[#EBC6A0]" />
            </div>
            <div className="flex flex-col min-w-0 flex-1 text-left">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-sm sm:text-[15px] font-bold text-[#F2EFE9]">
                  Отзыв о заведении
                </span>
                <span className="text-xs font-bold text-[#EBC6A0] flex items-center">
                  {reviewRating.toFixed(1)} ★
                </span>
              </div>
              <span className="truncate text-xs sm:text-[13px] text-[#A9A5B1]">
                Оценка сервиса и чаевые
              </span>
            </div>
          </div>
        )}

        {/* СПИСОК БЛЮД (ТОЛЬКО ДЛЯ ЕДЫ) */}
        {isFood && cartItems && cartItems.length > 0 && (
          <>
            <Separator className="bg-white/[0.08] my-0" />
            <div className="flex flex-col gap-1.5 text-left text-xs sm:text-[13px] max-h-36 overflow-y-auto pr-1 scrollbar-none">
              {cartItems.map((cartItem) => (
                <div
                  key={cartItem.item.id}
                  className="flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[11px] font-mono text-white/50">
                      {cartItem.quantity}x
                    </span>
                    <span className="truncate text-white/90">
                      {cartItem.item.name}
                    </span>
                  </div>
                  <span className="font-mono text-white/70 shrink-0 text-[11px] sm:text-xs">
                    {formatCurrency(cartItem.item.price * cartItem.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ТЕГИ И КОММЕНТАРИЙ (ТОЛЬКО ДЛЯ ОТЗЫВОВ) */}
        {isReview && ((reviewTags && reviewTags.length > 0) || reviewComment) && (
          <>
            <Separator className="bg-white/[0.08] my-0" />
            <div className="flex flex-col gap-1.5 text-left text-xs">
              {reviewTags && reviewTags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {reviewTags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-white/70 border border-white/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {reviewComment && (
                <p className="text-[11px] sm:text-xs text-white/60 italic line-clamp-2">
                  «{reviewComment}»
                </p>
              )}
            </div>
          </>
        )}

        <Separator className="bg-white/[0.08] my-0" />

        {/* 2. ДЕТАЛИ ЗАЯВКИ / СТАТУСА */}
        <div className="flex flex-col gap-2 text-left">
          {/* Для музыки */}
          {isMusic && isSuccess && (
            <>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#A9A5B1]">Тип заявки</span>
                <span className="font-semibold text-[#F2EFE9]">{typeLabel}</span>
              </div>
              {responseTime && (
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-[#A9A5B1]">Время ответа</span>
                  <span className="font-semibold tabular-nums text-[#F2EFE9]">
                    {responseTime}
                  </span>
                </div>
              )}
            </>
          )}

          {/* Для еды */}
          {isFood && isSuccess && (
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-[#A9A5B1]">Готовность</span>
              <span className="font-semibold text-emerald-400">
                ~{estimatedPrepMinutes} мин
              </span>
            </div>
          )}

          {/* Для отзывов */}
          {isReview && isSuccess && (
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-[#A9A5B1]">Назначение</span>
              <span className="font-semibold text-[#F2EFE9]">
                Официанту и бару
              </span>
            </div>
          )}

          {/* Причина отказа (при failure) */}
          {!isSuccess && reasonLabel && (
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-[#A9A5B1]">Причина</span>
              <span className="font-semibold text-[#F08A7E] text-right">
                {reasonLabel}
              </span>
            </div>
          )}

          {/* Способ оплаты (если передан) */}
          {paymentMethodTitle && (
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-[#A9A5B1]">Оплата</span>
              <span className="font-semibold text-[#F2EFE9]">
                {paymentMethodTitle}
              </span>
            </div>
          )}

          {/* Номер заказа */}
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-[#A9A5B1]">Номер чека</span>
            <span className="font-semibold font-mono tabular-nums text-[#F2EFE9]">
              #{orderNumber}
            </span>
          </div>
        </div>

        <Separator className="bg-white/[0.08] my-0" />

        {/* 3. ИТОГОВАЯ СУММА */}
        <div className="flex items-baseline justify-between pt-0.5 gap-2">
          <span className="text-xs sm:text-sm text-[#A9A5B1] shrink-0">
            {isSuccess
              ? isReview && amount === 0
                ? 'Статус'
                : 'Списано'
              : 'Сумма на карте'}
          </span>
          <span className="text-sm min-[360px]:text-base sm:text-lg font-extrabold font-mono tabular-nums text-[#F2EFE9] text-right">
            {isSuccess
              ? isReview && amount === 0
                ? 'Без чаевых'
                : `${formatCurrency(amount)} UZS`
              : `Доступно ${formatCurrency(amount)} UZS`}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
