'use client'

import React, { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { TokenVerificationView } from '@/components/auth/verification/TokenVerificationView'
import { RoleSelectionForm } from '@/components/auth/role-selection/RoleSelectionForm'
import type { RoleSelectionData, UserRoleType } from '@/components/auth/types'

function NewVerificationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [step, setStep] = useState<'verifying' | 'role-selection'>('verifying')
  const [selectedRole, setSelectedRole] = useState<UserRoleType>('dj')
  const [isSubmittingRole, setIsSubmittingRole] = useState(false)

  const handleVerificationSuccess = () => {
    // После успешной верификации токена переходим к этапу 3: выбор роли
    setStep('role-selection')
  }

  const handleRoleSelected = async (data: RoleSelectionData) => {
    setIsSubmittingRole(true)
    setSelectedRole(data.role)

    if (typeof window !== 'undefined') {
      try {
        document.cookie = `trackup_role=${data.role}; path=/; max-age=31536000; SameSite=Lax`
        window.localStorage.setItem('trackup_selected_role', data.role)
      } catch {
        // ignore storage errors
      }
    }

    const destination = data.role === 'venue_owner' ? '/dj' : '/dj'
    setTimeout(() => {
      router.push(destination)
    }, 600)
  }

  return (
    <>
      {step === 'verifying' && (
        <TokenVerificationView
          token={token}
          onSuccess={handleVerificationSuccess}
          onBackToAuth={() => router.push('/auth')}
        />
      )}

      {step === 'role-selection' && (
        <RoleSelectionForm
          initialRole={selectedRole}
          onSelectRole={handleRoleSelected}
          isLoading={isSubmittingRole}
        />
      )}
    </>
  )
}

/**
 * Страница обработки ссылки подтверждения Email (/auth/new-verification?token=...).
 * Обернута в Suspense для безопасного чтения useSearchParams() в Next.js.
 */
export default function NewVerificationPage() {
  return (
    <div
      className="w-full rounded-2xl overflow-hidden p-6 sm:p-7"
      style={{
        background:
          'linear-gradient(160deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow:
          '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      <Suspense
        fallback={
          <div className="flex flex-col items-center justify-center p-8 gap-3 text-white/50">
            <Loader2 className="size-6 text-[#EBC6A0] animate-spin" />
            <span className="text-[13px]">Загрузка параметров безопасности...</span>
          </div>
        }
      >
        <NewVerificationContent />
      </Suspense>
    </div>
  )
}
