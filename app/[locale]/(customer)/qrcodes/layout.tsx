import React from 'react';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/src/providers/ThemeProvider';

export const metadata: Metadata = {
  title: 'QR-коды и столы · Trackup',
  description: 'Управление QR-кодами столов, генерация пакетом и печать для гостей заведения',
};

export default function QrLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="trackup-dj-theme">
      {children}
    </ThemeProvider>
  );
}
