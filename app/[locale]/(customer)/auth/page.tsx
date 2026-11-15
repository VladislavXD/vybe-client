import React, { Suspense } from 'react'
import { AuthContainer } from '@/components/auth'

export function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'en' }]
}

async function AuthContent({
  searchParams,
}: {
  searchParams?: Promise<{ stage?: string; mode?: string }>
}) {
  const params = searchParams ? await searchParams : undefined
  const initialStage =
    params?.stage === 'role-selection'
      ? 'role-selection'
      : params?.stage === 'email-verification'
      ? 'email-verification'
      : 'credentials'

  const initialMode = params?.mode === 'register' ? 'register' : 'login'

  return (
    <AuthContainer
      initialMode={initialMode}
      initialStage={initialStage}
    />
  ) 
}

/**
 * Единая страница авторизации и онбординга.
 * Обернута в Suspense для совместимости с PPR и чтением searchParams.
 */
export default function AuthPage({
  searchParams,
}: {
  searchParams?: Promise<{ stage?: string; mode?: string }>
}) {
  return (
    <Suspense fallback={null}>
      <AuthContent searchParams={searchParams} />
    </Suspense>
  )
}