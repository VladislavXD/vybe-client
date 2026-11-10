export type GuestScreenState = 'initial' | 'music' | 'success' | 'failure'

export interface TrackItem {
  id?: string
  title: string
  artist: string
  duration: string
  coverColor?: string
  coverGradient?: string
}

export interface OrderInfo {
  orderNumber: string
  responseTime: string
  amount: string
  type?: string
  tableNumber: string | number
  venueName: string
  reason?: string
}

export interface GuestInitialScreenProps {
  venueName?: string
  tableNumber?: string | number
  onSelectTrack?: () => void
  className?: string
}

export interface GuestSuccessScreenProps {
  venueName?: string
  tableNumber?: string | number
  track?: TrackItem
  orderNumber?: string
  responseTime?: string
  amountPaid?: number
  onOrderAgain?: () => void
  onShowReceipt?: () => void
  className?: string
}

export interface GuestFailureScreenProps {
  venueName?: string
  tableNumber?: string | number
  track?: TrackItem
  orderNumber?: string
  rejectionReason?: string
  amountRefunded?: number
  onChooseAnotherTrack?: () => void
  className?: string
}


export interface FloatingBadgeConfig {
  title: string
  coverColor: string
  position: 'top-left' | 'bottom-right'
  animationDelay?: string
}

export interface ManualTrackFormData {
  title: string
  artist: string
  comment?: string
}

export interface GuestMusicScreenProps {
  venueName?: string
  tableNumber?: string | number
  onBack?: () => void
  onProceedToPayment?: (track: TrackItem) => void
  onManualTrackSubmit?: (data: ManualTrackFormData) => void
  className?: string
}

