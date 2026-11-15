'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  GuestFoodInitialScreen,
  GuestMenuScreen,
  GuestCheckoutScreen,
  GuestSuccessScreen,
  GuestFailureScreen,
  GuestTabBar,
  type GuestOrderSummary,
  type CartItem,
  type PaymentMethodId,
} from '@/components/guest'

export interface TableMenuClientProps {
  tableId: string
}

type MenuPageScreen = 'initial' | 'menu' | 'checkout' | 'success' | 'failure'

export function TableMenuClient({ tableId }: TableMenuClientProps) {
  const router = useRouter()
  const [screen, setScreen] = useState<MenuPageScreen>('initial')
  const [currentOrder, setCurrentOrder] = useState<GuestOrderSummary>({
    orderType: 'food',
    orderNumber: 'F491',
    amount: 0,
    tableNumber: tableId,
    venueName: 'Neon Harbor Club & Bar',
    cartItems: [],
    estimatedPrepMinutes: 15,
  })

  const handleProceedOrder = (items: CartItem[], totalAmount: number) => {
    setCurrentOrder((prev) => ({
      ...prev,
      orderType: 'food',
      orderNumber: 'F491',
      amount: totalAmount,
      cartItems: items,
      estimatedPrepMinutes: 15,
    }))
    setScreen('checkout')
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
            <GuestFoodInitialScreen
              venueName="Neon Harbor Club & Bar"
              tableNumber={tableId}
              onOpenMenu={() => setScreen('menu')}
            />
          )}

          {screen === 'menu' && (
            <GuestMenuScreen
              venueName="Neon Harbor Club & Bar"
              tableNumber={tableId}
              onBack={() => setScreen('initial')}
              onProceedOrder={handleProceedOrder}
            />
          )}

          {screen === 'checkout' && (
            <GuestCheckoutScreen
              venueName="Neon Harbor Club & Bar"
              tableNumber={tableId}
              order={currentOrder}
              onBack={() => setScreen('menu')}
              onConfirmPayment={handleConfirmPayment}
            />
          )}

          {screen === 'success' && (
            <GuestSuccessScreen
              venueName="Neon Harbor Club & Bar"
              tableNumber={tableId}
              order={currentOrder}
              onOrderAgain={() => setScreen('menu')}
              onShowReceipt={() => setScreen('failure')}
            />
          )}

          {screen === 'failure' && (
            <GuestFailureScreen
              venueName="Neon Harbor Club & Bar"
              tableNumber={tableId}
              order={currentOrder}
              onRetry={() => setScreen('checkout')}
              onChooseAnotherTrack={() => setScreen('menu')}
            />
          )}
        </div>

        {/* Таб-бар гостя внизу */}
        <div className="shrink-0 p-2.5 sm:p-3 pt-1 bg-[#0C0B0F]/95 backdrop-blur-md border-t border-white/[0.06] z-30">
          <GuestTabBar
            activeTab="menu"
            onTabChange={(tab) => {
              if (tab === 'music') {
                router.push(`/g/${tableId}`)
              } else if (tab === 'review') {
                router.push(`/g/${tableId}/review`)
              } else if (tab === 'menu') {
                setScreen('initial')
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
