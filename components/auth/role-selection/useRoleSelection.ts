'use client'

import { useState, useCallback } from 'react'
import type { UserRoleType, RoleSelectionData } from './types'

export interface UseRoleSelectionOptions {
  initialRole?: UserRoleType
  onSubmit: (data: RoleSelectionData) => Promise<void> | void
}

export function useRoleSelection({
  initialRole = 'dj',
  onSubmit,
}: UseRoleSelectionOptions) {
  const [selectedRole, setSelectedRole] = useState<UserRoleType>(initialRole)
  const [inviteCode, setInviteCode] = useState<string>('')
  const [venueName, setVenueName] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleSelectRole = useCallback((role: UserRoleType) => {
    setSelectedRole(role)
    setError(null)
  }, [])

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true)
    setError(null)

    try {
      // Сохраняем локально и в куки для middleware и быстрого восстановления на клиенте
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem('trackup_selected_role', selectedRole)
          if (inviteCode.trim()) {
            window.localStorage.setItem('trackup_invite_code', inviteCode.trim())
          }
          // Устанавливаем куку для Next.js middleware
          document.cookie = `trackup_role=${selectedRole}; path=/; max-age=31536000; SameSite=Lax`
        } catch {
          // ignore storage security errors in sandbox/incognito
        }
      }

      await onSubmit({
        role: selectedRole,
        inviteCode: inviteCode.trim() || undefined,
        venueName: venueName.trim() || undefined,
      })
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Произошла ошибка при сохранении роли.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }, [selectedRole, inviteCode, venueName, onSubmit])

  return {
    selectedRole,
    setSelectedRole: handleSelectRole,
    inviteCode,
    setInviteCode,
    venueName,
    setVenueName,
    isSubmitting,
    error,
    handleSubmit,
  }
}
