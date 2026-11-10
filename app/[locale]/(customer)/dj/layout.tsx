import React from 'react'
import type { Metadata } from 'next'
import { ThemeProvider } from '@/src/providers/ThemeProvider'

export const metadata: Metadata = {
  title: 'TrackUp DJ Studio · Управление заказами',
  description: 'Дашбоард заказов треков у диджея для клубов и заведений',
}

export default function DJLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="trackup-dj-theme">
      {children}
    </ThemeProvider>
  )
}
