export type DJOrderStatus =
  | 'pending'
  | 'accepted'
  | 'playing'
  | 'completed'
  | 'rejected'

export type PaymentStatus = 'paid' | 'hold' | 'refunded'

export interface DJTrackInfo {
  title: string
  artist: string
  duration: string
  durationSeconds?: number
  genre?: string
  bpm?: number
  key?: string
  coverColor?: string
  coverUrl?: string
}

export interface DJOrder {
  id: string
  orderNumber: string
  track: DJTrackInfo
  table: string
  guestName?: string
  createdAt: string
  timestamp: number
  price: number
  tip?: number
  paymentStatus: PaymentStatus
  paymentProvider: 'Payme' | 'Click' | 'Card'
  message?: string
  status: DJOrderStatus
  priority?: 'standard' | 'vip' | 'tip'
  rejectionReason?: string
  acceptedAt?: string
  completedAt?: string
}

export interface NowPlayingTrack {
  id: string
  orderNumber?: string
  title: string
  artist: string
  durationSeconds: number
  currentSeconds: number
  coverColor: string
  genre?: string
  requestedBy?: {
    table: string
    guestName?: string
    orderNumber: string
    tip?: number
  }
  isPlaying: boolean
}

export interface QueueItem {
  id: string
  orderId: string
  orderNumber: string
  position: number
  track: DJTrackInfo
  table: string
  estimatedPlayTime: string
  price: number
  tip?: number
}

export interface DJShiftStats {
  totalOrders: number
  pendingCount: number
  queueCount: number
  completedCount: number
  totalRevenue: number
  sessionStartTime: string
}

/** Вкладки навигации (одинаковы для мобильного tab bar и десктопного sidebar) */
export type DJTab = 'orders' | 'playing' | 'queue' | 'settings'
