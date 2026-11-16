import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'en' }]
}

async function HomeRedirect({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const cookieStore = await cookies()

  const session =
    cookieStore.get('session')?.value ||
    cookieStore.get('connect.sid')?.value ||
    cookieStore.get('trackup_session')?.value ||
    cookieStore.get('trackup_role')?.value
  const role = cookieStore.get('trackup_role')?.value

  if (!session) {
    redirect(`/${locale}/auth`)
  }

  if (!role) {
    redirect(`/${locale}/auth?stage=role-selection`)
  }

  const destination = role === 'venue_owner' ? '/dashboard' : '/dashboard'
  redirect(`/${locale}${destination}`)
  return null
}

/**
 * Корневая страница локали (/[locale]).
 * Выполняет серверную проверку сессии и роли пользователя в Suspense boundary.
 */
export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  return (
    <Suspense fallback={null}>
      <HomeRedirect params={params} />
    </Suspense>
  )
}
