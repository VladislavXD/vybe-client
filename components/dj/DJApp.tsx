'use client'

import React, { useState } from 'react'
import { DJLayout } from './layout/DJLayout'
import { LogoutConfirmDialog } from './layout/LogoutConfirmDialog'
import { OrdersList } from './orders/OrdersList'
import { RejectDrawer } from './orders/RejectDrawer'
import { NowPlayingScreen } from './screens/NowPlayingScreen'
import { SettingsScreen } from './screens/SettingsScreen'
import { TrackQueue } from './player/TrackQueue'
import { QrManagementView } from '@/components/qrcodes'
import {
  INITIAL_ORDERS,
  INITIAL_NOW_PLAYING,
  INITIAL_QUEUE,
  INITIAL_STATS,
} from './mockData'
import type {
  DJOrder,
  NowPlayingTrack,
  QueueItem,
  DJShiftStats,
  DJTab,
} from './types'

interface DJAppProps {
  venueName?: string
  initialTab?: DJTab
}

/**
 * Единый дашборд TrackUp.
 * Владеет всем состоянием; рендерит нужный экран внутри единого адаптивного DJLayout.
 *
 * Mobile  (< lg): вкладки — Заказы / Эфир / Очередь / QR-коды / Настройки
 * Desktop (≥ lg): боковой nav + адаптивный контент под активную вкладку
 *
 * @see DJLayout — responsive shell
 */
export function DJApp({
  venueName = 'Neon Harbor Club',
  initialTab = 'orders',
}: DJAppProps) {
  const [activeTab, setActiveTab] = useState<DJTab>(initialTab)

  const [orders, setOrders] = useState<DJOrder[]>(INITIAL_ORDERS)
  const [nowPlaying, setNowPlaying] = useState<NowPlayingTrack | null>(INITIAL_NOW_PLAYING)
  const [queue, setQueue] = useState<QueueItem[]>(INITIAL_QUEUE)
  const [stats, setStats] = useState<DJShiftStats>(INITIAL_STATS)
  const [isAcceptingOrders, setIsAcceptingOrders] = useState(true)
  const [rejectingOrder, setRejectingOrder] = useState<DJOrder | null>(null)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)

  // ─── Order handlers ──────────────────────────────────────────────────────────

  const handleAcceptOrder = (order: DJOrder) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === order.id
          ? {
              ...o,
              status: 'accepted' as const,
              paymentStatus: 'paid' as const,
              acceptedAt: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
            }
          : o
      )
    )

    setQueue((prev) => [
      ...prev,
      {
        id: `q-${order.id}`,
        orderId: order.id,
        orderNumber: order.orderNumber,
        position: prev.length + 1,
        track: order.track,
        table: order.table,
        estimatedPlayTime: `~${(prev.length + 1) * 4} мин`,
        price: order.price,
        tip: order.tip,
      },
    ])

    setStats((prev) => ({
      ...prev,
      pendingCount: Math.max(0, prev.pendingCount - 1),
      queueCount: prev.queueCount + 1,
      totalRevenue: prev.totalRevenue + order.price + (order.tip ?? 0),
    }))
  }

  const handleConfirmReject = (orderId: string, reason: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'rejected' as const,
              paymentStatus: 'refunded' as const,
              rejectionReason: reason,
            }
          : o
      )
    )
    setStats((prev) => ({
      ...prev,
      pendingCount: Math.max(0, prev.pendingCount - 1),
    }))
  }

  const handlePlayNow = (order: DJOrder) => {
    if (nowPlaying?.orderNumber) {
      setOrders((prev) =>
        prev.map((o) =>
          o.orderNumber === nowPlaying.orderNumber
            ? { ...o, status: 'completed' as const }
            : o
        )
      )
    }

    setNowPlaying({
      id: `np-${order.id}`,
      orderNumber: order.orderNumber,
      title: order.track.title,
      artist: order.track.artist,
      durationSeconds: order.track.durationSeconds ?? 210,
      currentSeconds: 0,
      coverColor: order.track.coverColor ?? '#3B3F58',
      genre: order.track.genre,
      requestedBy: {
        table: order.table,
        guestName: order.guestName,
        orderNumber: order.orderNumber,
        tip: order.tip,
      },
      isPlaying: true,
    })

    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: 'playing' as const } : o))
    )
    setQueue((prev) => prev.filter((q) => q.orderId !== order.id))

    setStats((prev) => ({
      ...prev,
      queueCount: Math.max(0, prev.queueCount - 1),
      completedCount: prev.completedCount + 1,
    }))
  }

  const handlePlayQueueItem = (item: QueueItem) => {
    const order = orders.find((o) => o.id === item.orderId)
    if (order) handlePlayNow(order)
  }

  const pendingCount = orders.filter((o) => o.status === 'pending').length

  // ─── Screens ────────────────────────────────────────────────────────────────

  const ordersScreen = (
    <OrdersList
      orders={orders}
      onAcceptOrder={handleAcceptOrder}
      onRejectOrder={setRejectingOrder}
      onPlayNow={handlePlayNow}
    />
  )

  const nowPlayingScreen = (
    <NowPlayingScreen
      nowPlaying={nowPlaying}
      queue={queue}
      onPlayNext={handlePlayQueueItem}
    />
  )

  const queueScreen = (
    <TrackQueue queue={queue} onPlayNext={handlePlayQueueItem} />
  )

  const settingsScreen = (
    <SettingsScreen
      stats={stats}
      isAcceptingOrders={isAcceptingOrders}
      onToggleAccepting={() => setIsAcceptingOrders((v) => !v)}
      venueName={venueName}
      onLogout={() => setIsLogoutDialogOpen(true)}
    />
  )

  const qrcodesScreen = <QrManagementView />

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <DJLayout
      activeTab={activeTab}
      onSelectTab={setActiveTab}
      pendingCount={pendingCount}
      isPlaying={Boolean(nowPlaying)}
      isLive={isAcceptingOrders}
      venueName={venueName}
      onLogout={() => setIsLogoutDialogOpen(true)}
    >
      {/*
       * MOBILE (< lg): одна вкладка за раз, анимация fade+slide в DJLayout
       * DESKTOP (≥ lg): переключение вкладок, на orders — двухколоночный пульт
       */}

      {/* ── Mobile: single-tab content ──────────────────────────────────── */}
      <div className="lg:hidden">
        {activeTab === 'orders' && ordersScreen}
        {activeTab === 'playing' && nowPlayingScreen}
        {activeTab === 'queue' && queueScreen}
        {activeTab === 'qrcodes' && qrcodesScreen}
        {activeTab === 'settings' && settingsScreen}
      </div>

      {/* ── Desktop: dynamic layout based on active tab ─────────────────── */}
      <div className="hidden lg:flex gap-5 items-start min-h-full w-full">
        {activeTab === 'qrcodes' ? (
          <div className="w-full min-h-full">
            {qrcodesScreen}
          </div>
        ) : activeTab === 'playing' ? (
          <div className="w-full max-w-2xl mx-auto">
            {nowPlayingScreen}
          </div>
        ) : activeTab === 'queue' ? (
          <div className="w-full max-w-3xl mx-auto">
            {queueScreen}
          </div>
        ) : activeTab === 'settings' ? (
          <div className="w-full max-w-2xl mx-auto">
            {settingsScreen}
          </div>
        ) : (
          <>
            {/* Left: orders (workstation) */}
            <div className="flex-1 min-w-0">
              {ordersScreen}
            </div>

            {/* Right: now playing + settings */}
            <div className="w-[300px] xl:w-[320px] shrink-0 flex flex-col gap-4">
              {nowPlayingScreen}
              {settingsScreen}
            </div>
          </>
        )}
      </div>

      {/* Reject drawer */}
      <RejectDrawer
        order={rejectingOrder}
        open={Boolean(rejectingOrder)}
        onOpenChange={(open) => !open && setRejectingOrder(null)}
        onConfirm={handleConfirmReject}
      />

      {/* Logout confirmation dialog */}
      <LogoutConfirmDialog
        open={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
      />
    </DJLayout>
  )
}
