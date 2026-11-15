'use client';

import { useState, useCallback } from 'react';
import { qrCodeService } from '@/src/services/qrcode/qrcode.service';

export interface DownloadQrCodeParams {
  id: string;
  format?: 'png' | 'svg';
  filename?: string;
  size?: number;
}

/**
 * Хук для безопасной загрузки изображения QR-кода (PNG/SVG) через HttpOnly авторизованный Blob.
 */
export function useQrCodeDownload() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const download = useCallback(
    async ({ id, format = 'png', filename, size = 600 }: DownloadQrCodeParams) => {
      try {
        setIsDownloading(true);
        setError(null);
        await qrCodeService.downloadImage(id, format, filename, size);
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error('Не удалось скачать QR-код');
        setError(errorObj);
        throw errorObj;
      } finally {
        setIsDownloading(false);
      }
    },
    []
  );

  return {
    download,
    isDownloading,
    error,
  };
}
