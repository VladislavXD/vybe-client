'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Smartphone, Tablet, Monitor, QrCode, CreditCard, Sparkles } from 'lucide-react'
import {
  GuestInitialScreen,
  GuestMusicScreen,
  GuestFoodInitialScreen,
  GuestMenuScreen,
  GuestReviewInitialScreen,
  GuestReviewScreen,
  GuestCheckoutScreen,
  GuestSuccessScreen,
  GuestFailureScreen,
  GuestTabBar,
  type GuestTabKey,
  type GuestScreenState,
  type GuestOrderType,
  type GuestOrderSummary,
  type TrackItem,
  type CartItem,
  type PaymentMethodId,
} from '@/components/guest'
import { Button } from '@/components/ui/button'

type ViewportMode = 'mobile' | 'tablet' | 'fluid'

function GuestOrderContent() {
  const searchParams = useSearchParams()
  const qrType = searchParams?.get('type')?.toLowerCase()

  // Определение начального экрана по QR / NFC типу
  const getInitialScreenFromQr = (): GuestScreenState => {
    if (qrType === 'food' || qrType === 'menu') {
      return 'food-initial'
    }
    if (qrType === 'review' || qrType === 'feedback') {
      return 'review-initial'
    }
    return 'initial'
  }

  const [activeScreen, setActiveScreen] = useState<GuestScreenState>(getInitialScreenFromQr)
  const [viewportMode, setViewportMode] = useState<ViewportMode>('mobile')

  // Единое состояние заказа (полиморфно под музыку, еду и отзывы)
  const [currentOrder, setCurrentOrder] = useState<GuestOrderSummary>({
    orderType: 'music',
    orderNumber: 'A7K2',
    amount: 45000,
    tableNumber: 5,
    venueName: 'Neon Harbor Club & Bar',
    paymentMethod: 'payme',
    track: {
      title: 'Late Signal',
      artist: 'Neon Harbor',
      duration: '3:42',
      coverColor: '#3B3F58',
    },
    holdDurationSeconds: 180,
    responseTime: '21:16',
    cartItems: [
      {
        item: {
          id: 'dish-1',
          name: 'Бургер Black Angus с трюфельным соусом',
          category: 'Кухня',
          price: 85000,
          description: '',
          available: true,
        },
        quantity: 1,
      },
      {
        item: {
          id: 'dish-4',
          name: 'Авторский коктейль Neon Harbor',
          category: 'Бар',
          price: 65000,
          description: '',
          available: true,
        },
        quantity: 1,
      },
    ],
    estimatedPrepMinutes: 15,
    reviewRating: 5,
    reviewTags: ['Музыка & DJ 🎧', 'Атмосфера вечера ✨'],
    reviewComment: 'Отличный сет и коктейли, вечер удался на 10/10!',
    tipAmount: 15000,
  })

  // Реакция на изменение query-параметра ?type=
  useEffect(() => {
    if (qrType === 'food' || qrType === 'menu') {
      setActiveScreen('food-initial')
    } else if (qrType === 'review' || qrType === 'feedback') {
      setActiveScreen('review-initial')
    } else if (qrType === 'music' || qrType === 'dj') {
      setActiveScreen('initial')
    }
  }, [qrType])

  // Динамические размеры фрейма для проверки адаптивности на десктопе
  const getContainerWidthClass = () => {
    switch (viewportMode) {
      case 'tablet':
        return 'sm:max-w-[640px]'
      case 'fluid':
        return 'sm:max-w-[1000px]'
      case 'mobile':
      default:
        return 'sm:max-w-[440px]'
    }
  }

  // Определение активного таба в нижней панели гостя
  const getActiveTabKey = (): GuestTabKey => {
    if (activeScreen === 'food-initial' || activeScreen === 'menu') return 'menu'
    if (activeScreen === 'review-initial' || activeScreen === 'review') return 'review'
    if (activeScreen === 'checkout' || activeScreen === 'success' || activeScreen === 'failure') {
      if (currentOrder.orderType === 'food') return 'menu'
      if (currentOrder.orderType === 'review') return 'review'
      return 'music'
    }
    return 'music'
  }

  // Переключение табов в нижней панели гостя
  const handleTabChange = (tab: GuestTabKey) => {
    if (tab === 'music') {
      setActiveScreen('initial')
    } else if (tab === 'menu') {
      setActiveScreen('food-initial')
    } else if (tab === 'review') {
      setActiveScreen('review-initial')
    }
  }

  // Переход к оформлению заказа из каталога музыки
  const handleMusicProceed = (track: TrackItem) => {
    setCurrentOrder((prev) => ({
      ...prev,
      orderType: 'music',
      orderNumber: 'A7K2',
      amount: 45000,
      track,
      responseTime: '21:16',
    }))
    setActiveScreen('checkout')
  }

  // Переход к оформлению заказа из меню еды
  const handleFoodProceed = (items: CartItem[], totalAmount: number) => {
    setCurrentOrder((prev) => ({
      ...prev,
      orderType: 'food',
      orderNumber: 'F491',
      amount: totalAmount,
      cartItems: items,
      estimatedPrepMinutes: 15,
    }))
    setActiveScreen('checkout')
  }

  // Переход из формы отзыва: с чаевыми на оплату, без чаевых сразу успех
  const handleReviewProceed = (data: {
    rating: number
    tags: string[]
    comment: string
    tipAmount?: number
  }) => {
    const tip = data.tipAmount || 0
    setCurrentOrder((prev) => ({
      ...prev,
      orderType: 'review',
      orderNumber: 'R812',
      amount: tip,
      reviewRating: data.rating,
      reviewTags: data.tags,
      reviewComment: data.comment,
      tipAmount: tip,
    }))

    if (tip > 0) {
      setActiveScreen('checkout')
    } else {
      setActiveScreen('success')
    }
  }

  // Подтверждение оплаты в чекауте
  const handleConfirmPayment = (method: PaymentMethodId) => {
    setCurrentOrder((prev) => ({
      ...prev,
      paymentMethod: method,
    }))
    setActiveScreen('success')
  }

  // Смена типа заказа в симуляторе для быстрой проверки
  const setOrderTypeForDemo = (type: GuestOrderType) => {
    setCurrentOrder((prev) => {
      if (type === 'music') {
        return {
          ...prev,
          orderType: 'music',
          orderNumber: 'A7K2',
          amount: 45000,
        }
      }
      if (type === 'food') {
        return {
          ...prev,
          orderType: 'food',
          orderNumber: 'F491',
          amount: 150000,
        }
      } 
      return {
        ...prev,
        orderType: 'review',
        orderNumber: 'R812',
        amount: 15000,
      }
    })
  }

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-[#070709] px-0 py-0 sm:p-4 md:p-6 font-['Manrope',sans-serif]">
      {/* 
        Интерактивный переключатель всех страниц гостя в табах, симуляция QR-типов,
        выбор типа заказа (музыка / еда / отзыв) и режима адаптивности.
      */}


      {/* 
        Мобильный адаптивный фрейм:
        На смартфонах (от 320px) занимает 100% ширины и высоты экрана.
        На планшетах и десктопах адаптируется плавно под высоту экрана без обрезания контента.
      */}
      <div
        className={`relative w-full ${getContainerWidthClass()} min-h-[100dvh] sm:min-h-[580px] sm:h-[min(900px,calc(100dvh-5.5rem))] overflow-hidden sm:rounded-[36px] sm:shadow-2xl sm:border sm:border-white/10 flex flex-col transition-all duration-300 bg-[#0C0B0F]`}
      >
        {/* Рабочая область экрана */}
        <div className="flex-1 min-h-0 relative flex flex-col overflow-hidden">
          {/* 1. Главная страница музыки (Грамофон) */}
          {activeScreen === 'initial' && (
            <GuestInitialScreen
              venueName="Neon Harbor Club"
              tableNumber={5}
              onSelectTrack={() => setActiveScreen('music')}
            />
          )}

          {/* 2. Каталог музыки */}
          {activeScreen === 'music' && (
            <GuestMusicScreen
              venueName="Neon Harbor Club"
              tableNumber={5}
              onBack={() => setActiveScreen('initial')}
              onProceedToPayment={handleMusicProceed}
              onManualTrackSubmit={(data) => {
                const manualTrack = {
                  title: data.title,
                  artist: data.artist,
                  duration: 'По сету',
                  coverColor: '#5B4BA8',
                }
                handleMusicProceed(manualTrack)
              }}
            />
          )}

          {/* 3. Главная страница заказа еды (для QR food) */}
          {activeScreen === 'food-initial' && (
            <GuestFoodInitialScreen
              venueName="Neon Harbor Club & Bar"
              tableNumber={5}
              onOpenMenu={() => setActiveScreen('menu')}
            />
          )}

          {/* 4. Онлайн-меню блюд и бара */}
          {activeScreen === 'menu' && (
            <GuestMenuScreen
              venueName="Neon Harbor Club & Bar"
              tableNumber={5}
              onBack={() => setActiveScreen('food-initial')}
              onProceedOrder={handleFoodProceed}
            />
          )}

          {/* 5. Главная страница отзывов и чаевых (для QR review) */}
          {activeScreen === 'review-initial' && (
            <GuestReviewInitialScreen
              venueName="Neon Harbor Club & Bar"
              tableNumber={5}
              onOpenReview={() => setActiveScreen('review')}
            />
          )}

          {/* 6. Форма отзыва и чаевых */}
          {activeScreen === 'review' && (
            <GuestReviewScreen
              venueName="Neon Harbor Club & Bar"
              tableNumber={5}
              onBack={() => setActiveScreen('review-initial')}
              onSubmitReview={handleReviewProceed}
            />
          )}

          {/* 7. Оформление заказа и выбор способа оплаты (большой выбор) */}
          {activeScreen === 'checkout' && (
            <GuestCheckoutScreen
              venueName="Neon Harbor Club & Bar"
              tableNumber={5}
              order={currentOrder}
              onBack={() => {
                if (currentOrder.orderType === 'food') setActiveScreen('menu')
                else if (currentOrder.orderType === 'review') setActiveScreen('review')
                else setActiveScreen('music')
              }}
              onConfirmPayment={handleConfirmPayment}
            />
          )}

          {/* 8. Динамический экран успешной оплаты / заказа */}
          {activeScreen === 'success' && (
            <GuestSuccessScreen
              venueName="Neon Harbor Club & Bar"
              tableNumber={5}
              order={currentOrder}
              onOrderAgain={() => {
                if (currentOrder.orderType === 'food') setActiveScreen('menu')
                else if (currentOrder.orderType === 'review') setActiveScreen('review-initial')
                else setActiveScreen('music')
              }}
              onShowReceipt={() => setActiveScreen('failure')}
            />
          )}

          {/* 9. Динамический экран отказа оплаты / отмены заказа */}
          {activeScreen === 'failure' && (
            <GuestFailureScreen
              venueName="Neon Harbor Club & Bar"
              tableNumber={5}
              order={currentOrder}
              onRetry={() => setActiveScreen('checkout')}
              onChooseAnotherTrack={() => {
                if (currentOrder.orderType === 'food') setActiveScreen('menu')
                else if (currentOrder.orderType === 'review') setActiveScreen('review')
                else setActiveScreen('music')
              }}
            />
          )}
        </div>

        {/* Навигационный таб-бар гостя внизу фрейма: DJ Музыка, Меню, Отзывы */}
        <div className="shrink-0 p-2.5 sm:p-3 pt-1 bg-[#0C0B0F]/95 backdrop-blur-md border-t border-white/[0.06] z-30">
          <GuestTabBar
            activeTab={getActiveTabKey()}
            onTabChange={handleTabChange}
          />
        </div>
      </div>
    </div>
  )
}

/**
 * Гостевая страница столика с поддержкой определения типа QR/NFC (?type=food, ?type=review, ?type=music)
 * Обернута в Suspense для поддержки Next.js PPR и безопасного чтения searchParams.
 */
export default function GuestOrderPage() {
  return (
    <Suspense fallback={null}>
      <GuestOrderContent />
    </Suspense>
  )
}