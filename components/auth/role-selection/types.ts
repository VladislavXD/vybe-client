import type { LucideIcon } from 'lucide-react'

export type UserRoleType = 'venue_owner' | 'dj'

export interface RoleBenefit {
  icon: LucideIcon
  title: string
  description: string
}

export interface RoleOption {
  id: UserRoleType
  title: string
  shortTitle: string
  badge: string
  description: string
  shareLabel: string
  sharePct: string
  icon: LucideIcon
  benefits: RoleBenefit[]
  defaultRedirectPath: string
  ctaText: string
}

export interface RoleSelectionData {
  role: UserRoleType
  inviteCode?: string
  venueName?: string
}

export interface RoleSelectionFormProps {
  initialRole?: UserRoleType
  onSelectRole: (data: RoleSelectionData) => Promise<void> | void
  onBack?: () => void
  isLoading?: boolean
}
