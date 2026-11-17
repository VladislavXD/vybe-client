import type { LucideIcon } from 'lucide-react'

export type GuestScreenState =
  | 'initial'
  | 'music'
  | 'checkout'
  | 'success'
  | 'failure'
  | 'food-initial'
  | 'menu'
  | 'review-initial'
  | 'review'
  | 'disabled'

export type GuestOrderType = 'music' | 'food' | 'review'

export type PaymentMethodId =
  | 'payme'
  | 'click'
  | 'uzum'
  | 'card'
  | 'apple_pay'
  | 'google_pay'
  | 'cash_waiter'

export interface PaymentMethodOption {
  id: PaymentMethodId
  title: string
  subtitle: string
  badge?: string
  isPopular?: boolean
}

export type QrServiceType = 'music' | 'dj' | 'food' | 'menu' | 'review' | 'feedback'

export type VenueServiceId = 'music' | 'menu' | 'reviews' | 'waiter'

export interface VenueServiceItem {
  id: VenueServiceId
  title: string
  subtitle: string
  badge: string
  badgeVariant: 'amber' | 'emerald' | 'purple' | 'cyan'
  description: string
  icon: LucideIcon
  actionText: string
  isAvailable: boolean
}

export interface TrackItem {
  id?: string
  title: string
  artist: string
  duration: string
  coverColor?: string
  coverGradient?: string
}

export interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  description: string
  imageUrl?: string
  badge?: string
  available: boolean
}

export interface CartItem {
  item: MenuItem
  quantity: number
}

export interface ReviewFormData {
  rating: number
  tags: string[]
  comment: string
  tableNumber: string | number
  tipAmount?: number
}

export interface OrderInfo {
  orderNumber: string
  responseTime: string
  amount: string
  type?: 'music' | 'food' | 'review'
  tableNumber: string | number
  venueName: string
  reason?: string
}

export interface GuestInitialScreenProps {
  venueName?: string
  tableNumber?: string | number
  onSelectTrack?: () => void
  onSelectService?: (service: VenueServiceId) => void
  className?: string
}

export interface GuestFoodInitialScreenProps {
  venueName?: string
  tableNumber?: string | number
  onOpenMenu: () => void
  className?: string
}

export interface GuestReviewInitialScreenProps {
  venueName?: string
  tableNumber?: string | number
  onOpenReview: () => void
  className?: string
}

export interface GuestMenuScreenProps {
  venueName?: string
  tableNumber?: string | number
  onBack: () => void
  onProceedOrder: (items: CartItem[], totalAmount: number) => void
  className?: string
}

export interface GuestReviewScreenProps {
  venueName?: string
  tableNumber?: string | number
  onBack: () => void
  onSubmitReview: (review: ReviewFormData) => void
  className?: string
}

export interface GuestOrderSummary {
  orderType: GuestOrderType
  orderNumber: string
  amount: number
  tableNumber: string | number
  venueName?: string
  paymentMethod?: PaymentMethodId

  // Music details
  track?: TrackItem
  holdDurationSeconds?: number

  // Food details
  cartItems?: CartItem[]
  estimatedPrepMinutes?: number

  // Review details
  reviewRating?: number
  reviewTags?: string[]
  reviewComment?: string
  tipAmount?: number

  // Response / failure status
  responseTime?: string
  rejectionReason?: string
}

export interface GuestCheckoutScreenProps {
  venueName?: string
  tableNumber?: string | number
  order: GuestOrderSummary
  onBack: () => void
  onConfirmPayment: (paymentMethod: PaymentMethodId) => void
  className?: string
}

export interface GuestSuccessScreenProps {
  venueName?: string
  tableNumber?: string | number
  order?: GuestOrderSummary
  orderType?: GuestOrderType
  track?: TrackItem
  foodItems?: CartItem[]
  orderNumber?: string
  responseTime?: string
  amountPaid?: number
  reviewRating?: number
  onOrderAgain?: () => void
  onShowReceipt?: () => void
  className?: string
}

export interface GuestFailureScreenProps {
  venueName?: string
  tableNumber?: string | number
  order?: GuestOrderSummary
  orderType?: GuestOrderType
  track?: TrackItem
  foodItems?: CartItem[]
  orderNumber?: string
  rejectionReason?: string
  amountRefunded?: number
  onRetry?: () => void
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
