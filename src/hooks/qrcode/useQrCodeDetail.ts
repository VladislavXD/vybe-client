'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { qrCodeService } from '@/src/services/qrcode/qrcode.service';
import type { QrCodeItem } from '@/src/services/qrcode/qrcode.types';
import { qrKeys } from './queryKeys';

export interface UseQrCodeDetailOptions {
  id?: string | null;
  withPreview?: boolean;
  enabled?: boolean;
}

/**
 * Хук для получения детальной информации и Data URL предпросмотра конкретного QR-кода.
 * Автоматически использует закэшированные данные из списка для мгновенного отображения.
 */
export function useQrCodeDetail({
  id,
  withPreview = false,
  enabled = true,
}: UseQrCodeDetailOptions) {
  const queryClient = useQueryClient();

  return useQuery<QrCodeItem>({
    queryKey: withPreview && id ? qrKeys.preview(id) : id ? qrKeys.detail(id) : ['qrcode', 'empty'],
    queryFn: async () => {
      if (!id) throw new Error('ID QR-кода обязателен для получения деталей');
      return withPreview ? qrCodeService.getPreview(id) : qrCodeService.getById(id);
    },
    enabled: Boolean(id) && enabled,
    staleTime: 30_000,
    gcTime: 10 * 60 * 1000,
    // Подставляем данные из кэша списков, если они там уже есть
    initialData: () => {
      if (!id) return undefined;

      // Ищем в списке myQrCodes
      const listCache = queryClient.getQueriesData<QrCodeItem[]>({
        queryKey: qrKeys.lists(),
      });

      for (const [, list] of listCache) {
        if (Array.isArray(list)) {
          const found = list.find((item) => item.id === id);
          if (found) return found;
        }
      }

      return undefined;
    },
  });
}
