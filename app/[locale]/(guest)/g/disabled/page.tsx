'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { GuestDisabledScreen } from '@/components/guest';

function DisabledContent() {
  const searchParams = useSearchParams();
  const venue = searchParams?.get('venue') || 'Заведение';
  const table = searchParams?.get('table') || 'Ваш столик';
  const code = searchParams?.get('code') || undefined;

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-[#070709] px-0 py-0 sm:p-4 md:p-6 font-['Manrope',sans-serif]">
      <div className="relative w-full sm:max-w-[440px] min-h-[100dvh] sm:min-h-[580px] sm:h-[min(900px,calc(100dvh-5.5rem))] overflow-hidden sm:rounded-[36px] sm:shadow-2xl sm:border sm:border-white/10 flex flex-col transition-all duration-300 bg-[#0C0B0F]">
        <GuestDisabledScreen
          venueName={venue}
          tableLabel={table}
          code={code}
          onRefresh={() => {
            if (typeof window !== 'undefined') {
              window.location.reload();
            }
          }}
        />
      </div>
    </div>
  );
}

/**
 * Выделенная страница для деактивированного QR-кода (/g/disabled?venue=...&table=...).
 */
export default function DisabledQrPage() {
  return (
    <Suspense fallback={null}>
      <DisabledContent />
    </Suspense>
  );
}
