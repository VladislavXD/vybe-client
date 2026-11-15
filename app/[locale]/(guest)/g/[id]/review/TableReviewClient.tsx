'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  GuestReviewInitialScreen,
  GuestReviewScreen,
  GuestCheckoutScreen,
  GuestSuccessScreen,
  GuestFailureScreen,
  GuestTabBar,
  type GuestOrderSummary,
  type ReviewFormData,
  type PaymentMethodId,
} from '@/components/guest'

export interface TableReviewClientProps {
  tableId: string
}

type ReviewPageScreen = 'initial' | 'review' | 'checkout' | 'success' | 'failure'

export function TableReviewClient({ tableId }: TableReviewClientProps) {
  const router = useRouter()
  const [screen, setScreen] = useState<ReviewPageScreen>('initial')
  const [currentOrder, setCurrentOrder] = useState<GuestOrderSummary>({
    orderType: 'review',
    orderNumber: 'R812',
    amount: 15000,
    tableNumber: tableId,
    venueName: 'Neon Harbor Club & Bar',
    reviewRating: 5,
    reviewTags: ['Музыка & DJ 🎧', 'Атмосфера вечера ✨'],
    tipAmount: 15000,
  })

  const handleSubmitReview = (data: ReviewFormData) => {
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
      setScreen('checkout')
    } else {
      setScreen('success')
    }
  }

  const handleConfirmPayment = (method: PaymentMethodId) => {
    setCurrentOrder((prev) => ({
      ...prev,
      paymentMethod: method,
    }))
    setScreen('success')
  }

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-[#070709] px-0 py-0 sm:p-4 md:p-6 font-['Manrope',sans-serif]">
      <div className="relative w-full sm:max-w-[440px] min-h-[100dvh] sm:min-h-[640px] sm:h-[min(900px,calc(100dvh-4rem))] overflow-hidden sm:rounded-[32px] sm:shadow-2xl sm:border sm:border-white/10 flex flex-col transition-all duration-300 bg-[#0C0B0F]">
        <div className="flex-1 min-h-0 relative flex flex-col overflow-hidden">
          {screen === 'initial' && (
            <GuestReviewInitialScreen
              venueName="Neon Harbor Club & Bar"
              tableNumber={tableId}
              onOpenReview={() => setScreen('review')}
            />
          )}

          {screen === 'review' && (
            <GuestReviewScreen
              venueName="Neon Harbor Club & Bar"
              tableNumber={tableId}
              onBack={() => setScreen('initial')}
              onSubmitReview={handleSubmitReview}
            />
          )}

          {screen === 'checkout' && (
            <GuestCheckoutScreen
              venueName="Neon Harbor Club & Bar"
              tableNumber={tableId}
              order={currentOrder}
              onBack={() => setScreen('review')}
              onConfirmPayment={handleConfirmPayment}
            />
          )}

          {screen === 'success' && (
            <GuestSuccessScreen
              venueName="Neon Harbor Club & Bar"
              tableNumber={tableId}
              order={currentOrder}
              onOrderAgain={() => setScreen('initial')}
              onShowReceipt={() => setScreen('failure')}
            />
          )}

          {screen === 'failure' && (
            <GuestFailureScreen
              venueName="Neon Harbor Club & Bar"
              tableNumber={tableId}
              order={currentOrder}
              onRetry={() => setScreen('checkout')}
              onChooseAnotherTrack={() => setScreen('review')}
            />
          )}
        </div>

        {/* Таб-бар гостя внизу */}
        <div className="shrink-0 p-2.5 sm:p-3 pt-1 bg-[#0C0B0F]/95 backdrop-blur-md border-t border-white/[0.06] z-30">
          <GuestTabBar
            activeTab="review"
            onTabChange={(tab) => {
              if (tab === 'music') {
                router.push(`/g/${tableId}`)
              } else if (tab === 'menu') {
                router.push(`/g/${tableId}/menu`)
              } else if (tab === 'review') {
                setScreen('initial')
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
