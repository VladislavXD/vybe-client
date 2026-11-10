'use client'

import React from 'react'
import { ThemeProvider as WrkszThemeProvider } from '@wrksz/themes'

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: 'light' | 'dark' | 'system'
  storageKey?: string
}

/**
 * Оболочка провайдера тем на базе @wrksz/themes
 */
export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  storageKey = 'trackup-dj-theme',
}: ThemeProviderProps) {
  return (
    <WrkszThemeProvider
      attribute="class"
      defaultTheme={defaultTheme}
      enableSystem
      storageKey={storageKey}
      disableTransitionOnChange={false}
    >
      {children}
    </WrkszThemeProvider>
  )
}
