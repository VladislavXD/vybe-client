'use client'

import React, { useState } from 'react'
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  ShieldCheck,
  Check,
  Music,
  UtensilsCrossed,
  Heart,
  Star,
  Clock,
  Sparkles,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/src/utils/formatCurrency'
import { GuestBackground } from '../background/GuestBackground'
import { ShimmerButton } from '../ui/ShimmerButton'
import type {
  GuestCheckoutScreenProps,
  PaymentMethodId,
  PaymentMethodOption,
} from '../types'

const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: 'payme',
    title: 'Payme',
    subtitle: 'Быстрая оплата · Без комиссии',
    badge: 'Популярно',
    isPopular: true,
  },
  {
    id: 'click',
    title: 'Click Up',
    subtitle: 'Оплата через Click · 0% комиссии',
    badge: '0%',
    isPopular: true,
  },
  {
    id: 'uzum',
    title: 'Uzum Bank',
    subtitle: 'Uzum Pay · Кэшбэк до 2%',
    badge: 'Кэшбэк',
  },
  {
    id: 'card',
    title: 'Банковская карта',
    subtitle: 'Uzcard, Humo, Visa, Mastercard',
  },
  {
    id: 'apple_pay',
    title: 'Apple Pay',
    subtitle: 'Моментально по Face ID',
  },
  {
    id: 'google_pay',
    title: 'Google Pay',
    subtitle: 'Быстрая оплата в 1 клик',
  },
  {
    id: 'cash_waiter',
    title: 'В счет столика / Официанту',
    subtitle: 'Оплата наличными или картой при закрытии счета',
  },
]

export const GuestCheckoutScreen: React.FC<GuestCheckoutScreenProps> = ({
  venueName = 'Neon Harbor Club & Bar',
  tableNumber = 5,
  order,
  onBack,
  onConfirmPayment,
  className,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId>(
    order.paymentMethod || 'payme'
  )

  // Фильтруем методы оплаты: наличные/официант только для еды
  const availableMethods = PAYMENT_METHODS.filter((m) => {
    if (m.id === 'cash_waiter' && order.orderType !== 'food') {
      return false
    }
    return true
  })

  const isMusic = order.orderType === 'music'
  const isFood = order.orderType === 'food'
  const isReview = order.orderType === 'review'

  const handlePay = () => {
    onConfirmPayment(selectedMethod)
  }

  return (
    <div
      className={`relative w-full min-h-[100dvh] sm:min-h-0 sm:h-full flex flex-col justify-between overflow-y-auto overflow-x-hidden scrollbar-none bg-[#0C0B0F] text-[#F2EFE9] font-["Manrope",sans-serif] ${
        className || ''
      }`}
    >
      {/* 1. Атмосферный фон */}
      <GuestBackground glowColor="#EBC6A0" />

      {/* 2. Контентный контейнер */}
      <div className="relative z-10 mx-auto flex w-full max-w-[480px] flex-1 flex-col justify-between p-4 min-[390px]:p-5 sm:p-6 md:p-7 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        {/* Шапка: Кнопка назад (прозрачная), Заголовок, Номер столика */}
        <header className="flex items-center justify-between gap-3 pb-3 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={onBack}
              aria-label="Назад"
              className="flex size-10 items-center justify-center rounded-xl bg-transparent border border-white/20 text-white/80 hover:border-white/40 hover:text-white active:scale-[0.98] transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="size-4" />
            </button>
            <div className="flex flex-col min-w-0">
              <span className="font-['Bricolage_Grotesque',sans-serif] text-[16px] sm:text-[18px] font-bold text-white tracking-tight truncate leading-tight">
                Оформление заказа
              </span>
              <span className="text-[12px] text-white/40 truncate">
                {venueName}
              </span>
            </div>
          </div>

          <Badge
            variant="outline"
            className="rounded-full bg-white/[0.06] border-white/12 px-3 py-1 text-xs font-bold text-[#F2EFE9] shrink-0"
          >
            <span className="font-normal text-white/40 mr-1">Стол</span>
            {tableNumber}
          </Badge>
        </header>

        {/* Основной контент */}
        <main className="flex flex-1 flex-col gap-4 py-4 min-h-0">
          {/* Блок 1: Состав заказа (динамический под тип заказа) */}
          <section className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-3.5 sm:p-4 flex flex-col gap-3 shadow-md backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isMusic && <Music className="size-4 text-[#EBC6A0]" />}
                {isFood && <UtensilsCrossed className="size-4 text-[#EBC6A0]" />}
                {isReview && <Sparkles className="size-4 text-[#EBC6A0]" />}
                <span className="text-xs font-bold uppercase tracking-wider text-white/60">
                  {isMusic && 'Трек для диджея'}
                  {isFood && 'Блюда к столу'}
                  {isReview && 'Отзыв и благодарность'}
                </span>
              </div>
              <span className="text-[11px] font-mono font-semibold text-white/40">
                #{order.orderNumber}
              </span>
            </div>

            {/* Музыкальный трек */}
            {isMusic && order.track && (
              <div className="flex items-center gap-3 pt-1">
                <div
                  className="size-12 rounded-xl shadow-md shrink-0 flex items-center justify-center border border-white/10"
                  style={{ background: order.track.coverColor || '#3B3F58' }}
                >
                  <Music className="size-5 text-white/90" />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[14px] sm:text-[15px] font-bold text-white truncate">
                    {order.track.title}
                  </span>
                  <span className="text-[12px] text-white/50 truncate">
                    {order.track.artist} · {order.track.duration}
                  </span>
                </div>
                <span className="text-[14px] font-bold text-[#EBC6A0] font-mono shrink-0">
                  {formatCurrency(order.amount)} UZS
                </span>
              </div>
            )}

            {/* Список блюд кухни */}
            {isFood && order.cartItems && (
              <div className="flex flex-col gap-2 pt-1 divide-y divide-white/[0.04]">
                {order.cartItems.map((cartItem) => (
                  <div
                    key={cartItem.item.id}
                    className="flex items-center justify-between gap-2 pt-1.5 first:pt-0"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="size-5 rounded-md bg-white/[0.08] text-white/90 text-[11px] font-bold font-mono flex items-center justify-center shrink-0">
                        {cartItem.quantity}x
                      </span>
                      <span className="text-[13px] text-white/90 truncate">
                        {cartItem.item.name}
                      </span>
                    </div>
                    <span className="text-[12px] font-mono font-semibold text-white/70 shrink-0">
                      {formatCurrency(cartItem.item.price * cartItem.quantity)} UZS
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Отзыв и чаевые */}
            {isReview && (
              <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#EBC6A0]">
                    {Array.from({ length: order.reviewRating || 5 }).map((_, i) => (
                      <Star key={i} className="size-4 fill-[#EBC6A0] text-[#EBC6A0]" />
                    ))}
                    <span className="ml-1 text-xs font-bold text-white">
                      {(order.reviewRating || 5).toFixed(1)}
                    </span>
                  </div>
                  <span className="text-[13px] font-mono font-bold text-[#EBC6A0]">
                    Чаевые: {formatCurrency(order.amount)} UZS
                  </span>
                </div>

                {order.reviewTags && order.reviewTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {order.reviewTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-white/70 border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {order.reviewComment && (
                  <p className="text-[12px] text-white/50 italic line-clamp-2 pt-0.5">
                    «{order.reviewComment}»
                  </p>
                )}
              </div>
            )}

            {/* Специальное пояснение для двухстадийной оплаты музыки */}
            {isMusic && (
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[#EBC6A0]/[0.08] border border-[#EBC6A0]/20 text-[11px] text-white/80 leading-relaxed mt-1">
                <Clock className="size-3.5 text-[#EBC6A0] shrink-0 mt-0.5" />
                <span>
                  <strong>Холдирование 180с:</strong> средства заморозятся на вашей карте и спишутся только если диджей примет трек. При отказе или истечении времени блокировка сразу снимается.
                </span>
              </div>
            )}
          </section>

          {/* Блок 2: Выбор способа оплаты (большой выбор) */}
          <section className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white/60 px-1">
              Способ оплаты
            </span>

            <div className="grid grid-cols-1 gap-2">
              {availableMethods.map((method) => {
                const isSelected = selectedMethod === method.id
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedMethod(method.id)}
                    className={`flex items-center justify-between p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-white/[0.08] border-white/40 shadow-sm ring-1 ring-white/20'
                        : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Иконка метода */}
                      <div
                        className={`size-9 rounded-lg flex items-center justify-center shrink-0 border ${
                          isSelected
                            ? 'bg-white text-[#0C0B0F] border-white font-bold'
                            : 'bg-white/[0.05] border-white/10 text-white/70'
                        }`}
                      >
                        {method.id === 'card' && <CreditCard className="size-4.5" />}
                        {method.id === 'payme' && <span className="font-bold text-[11px]">P</span>}
                        {method.id === 'click' && <span className="font-bold text-[11px]">C</span>}
                        {method.id === 'uzum' && <span className="font-bold text-[11px]">U</span>}
                        {method.id === 'apple_pay' && <Smartphone className="size-4.5" />}
                        {method.id === 'google_pay' && <span className="font-bold text-[11px]">G</span>}
                        {method.id === 'cash_waiter' && <UtensilsCrossed className="size-4.5" />}
                      </div>

                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] sm:text-[14px] font-semibold text-white truncate">
                            {method.title}
                          </span>
                          {method.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#EBC6A0]/20 text-[#EBC6A0]">
                              {method.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-white/40 truncate">
                          {method.subtitle}
                        </span>
                      </div>
                    </div>

                    {/* Радио-маркер */}
                    <div
                      className={`size-5 rounded-full border flex items-center justify-center shrink-0 ml-2 transition-colors ${
                        isSelected
                          ? 'bg-white border-white'
                          : 'border-white/30 bg-transparent'
                      }`}
                    >
                      {isSelected && <Check className="size-3 text-[#0C0B0F] stroke-[3]" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          {/* Блок 3: Итог и безопасность */}
          <section className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-3.5 flex flex-col gap-2 mt-auto">
            <div className="flex items-center justify-between text-xs text-white/50">
              <span>Сумма заказа</span>
              <span className="font-mono text-white/80">
                {formatCurrency(order.amount)} UZS
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-white/50">
              <span>Комиссия сервиса</span>
              <span className="font-mono text-emerald-400">0 UZS</span>
            </div>
            <div className="h-px bg-white/[0.06] my-1" />
            <div className="flex items-center justify-between text-sm sm:text-base font-bold">
              <span className="text-white">К оплате</span>
              <span className="text-[#EBC6A0] font-mono text-[16px] sm:text-[18px]">
                {formatCurrency(order.amount)} UZS
              </span>
            </div>

            <div className="flex items-center gap-1.5 pt-1 text-[11px] text-white/40">
              <ShieldCheck className="size-3.5 text-emerald-400 shrink-0" />
              <span>Безопасный платежный шлюз с защитой данных</span>
            </div>
          </section>
        </main>

        {/* Футер: Кнопки действий строго белая и прозрачная */}
        <footer className="flex flex-col gap-2.5 pt-3 shrink-0">
          {/* Главная БЕЛАЯ кнопка со световым бликом */}
          <ShimmerButton onClick={handlePay}>
            {isMusic
              ? `Заблокировать ${formatCurrency(order.amount)} UZS`
              : `Оплатить ${formatCurrency(order.amount)} UZS`}
          </ShimmerButton>

          {/* Второстепенная ПРОЗРАЧНАЯ кнопка отмены */}
          <button
            type="button"
            onClick={onBack}
            className="h-11 sm:h-12 w-full rounded-xl bg-transparent border border-white/20 text-white/80 hover:border-white/40 hover:text-white active:scale-[0.98] font-semibold text-[13px] sm:text-[14px] flex items-center justify-center transition-all cursor-pointer"
          >
            <span>Вернуться назад</span>
          </button>
        </footer>
      </div>
    </div>
  )
}
