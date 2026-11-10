import React from 'react'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/src/providers/ThemeProvider'
import { AuthLayoutWrapper } from '@/components/auth'

export const metadata: Metadata = {
  title: 'TrackUp · Вход',
  description: 'Авторизация и регистрация диджеев сервиса TrackUp',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    /**
     * ThemeProvider нужен для совместимости с @wrksz/themes,
     * но принудительно держим dark — страница авторизации всегда тёмная.
     */
    <ThemeProvider defaultTheme="dark" storageKey="trackup-auth-theme">
      <AuthLayoutWrapper>
        {children}
      </AuthLayoutWrapper>
    </ThemeProvider>
  )
}