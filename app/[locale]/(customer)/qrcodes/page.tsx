import React from 'react';
import { DJApp } from '@/components/dj';

export function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'en' }];
}

export default function QrCodesPage() {
  return <DJApp initialTab="qrcodes" />;
}
