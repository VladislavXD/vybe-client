export type VerificationFlowType = 'email-link' | 'sms-otp' | 'token-processing'

export interface EmailLinkNoticeProps {
  email: string
  onResend?: (email: string) => Promise<void> | void
  onBack?: () => void
  initialCooldown?: number
  isLoading?: boolean
}

export interface OtpCodeViewProps {
  destination: string
  destinationType?: 'phone' | 'email'
  value: string
  onChange: (value: string) => void
  onComplete?: (value: string) => void
  onSubmit: () => Promise<void> | void
  onResend?: () => Promise<void> | void
  onBack?: () => void
  isLoading?: boolean
  error?: string | null
  initialCooldown?: number
}

export interface TokenVerificationViewProps {
  token: string | null
  onSuccess: (data: unknown) => void
  onBackToAuth: () => void
  onError?: (error: Error) => void
}

