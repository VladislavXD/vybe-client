'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QrMiniPreviewProps {
  value: string;
  size?: number;
  className?: string;
}

/**
 * Компактный предпросмотр QR-кода для строк таблицы.
 */
export function QrMiniPreview({ value, size = 38, className = '' }: QrMiniPreviewProps) {
  const [dataUrl, setDataUrl] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(value, {
      margin: 1,
      width: size * 2, // 2x для Retina
      color: {
        dark: '#0A0A0C',
        light: '#FFFFFF',
      },
    })
      .then((url) => {
        if (isMounted) setDataUrl(url);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [value, size]);

  if (!dataUrl) {
    return (
      <div
        className={`size-[38px] shrink-0 rounded-lg bg-white/10 animate-pulse ${className}`}
      />
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={dataUrl}
      alt="QR Mini Preview"
      width={size}
      height={size}
      className={`size-[38px] shrink-0 rounded-lg bg-white object-contain p-0.5 shadow-sm select-none ${className}`}
    />
  );
}
