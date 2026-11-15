'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QrSvgRendererProps {
  value: string;
  size?: number;
  className?: string;
  margin?: number;
}

/**
 * Векторный рендерер QR-кода на клиенте (SVG).
 * Генерирует четкий черно-белый QR-код с высоким уровнем коррекции ошибок (H).
 */
export function QrSvgRenderer({
  value,
  size = 200,
  className = '',
  margin = 1,
}: QrSvgRendererProps) {
  const [svgString, setSvgString] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    QRCode.toString(value, {
      type: 'svg',
      errorCorrectionLevel: 'H',
      margin,
      width: size,
      color: {
        dark: '#0A0A0C',
        light: '#FFFFFF',
      },
    })
      .then((svg) => {
        if (isMounted) setSvgString(svg);
      })
      .catch((err) => {
        console.error('Failed to generate client QR code SVG:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [value, size, margin]);

  if (!svgString) {
    return (
      <div
        className={`flex items-center justify-center bg-white rounded-xl ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="size-6 border-2 border-neutral-300 border-t-neutral-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-xl bg-white p-2.5 shadow-md flex items-center justify-center ${className}`}
      dangerouslySetInnerHTML={{ __html: svgString }}
    />
  );
}
