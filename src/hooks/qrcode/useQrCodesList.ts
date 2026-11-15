'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { qrCodeService } from '@/src/services/qrcode/qrcode.service';
import type { QrCodeItem, QrFilterParams } from '@/src/services/qrcode/qrcode.types';
import { qrKeys } from './queryKeys';

export interface UseQrCodesListOptions {
  filters?: QrFilterParams;
  enabled?: boolean;
  refetchInterval?: number | false;
}

/**
 * Хук для получения списка QR-кодов заведения с поддержкой фильтрации и поиска.
 * Использует `keepPreviousData` для предотвращения мерцания UI при фильтрации.
 */
export function useQrCodesList({
  filters,
  enabled = true,
  refetchInterval = false,
}: UseQrCodesListOptions = {}) {
  const isVenueSpecific = Boolean(filters?.venueId);

  return useQuery<QrCodeItem[]>({
    queryKey: isVenueSpecific && filters?.venueId
      ? qrKeys.venueList(filters.venueId, filters)
      : qrKeys.list(filters),
    queryFn: async () => {
      if (isVenueSpecific && filters?.venueId) {
        return qrCodeService.getByVenueId(filters.venueId, filters);
      }
      return qrCodeService.getMyQrCodes(filters);
    },
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 15_000, // 15 секунд свежести
    gcTime: 5 * 60 * 1000, // 5 минут хранения в памяти
    refetchOnWindowFocus: true,
    refetchInterval,
    retry: (failureCount, error: unknown) => {
      // Не повторять запрос при 401 Unauthorized, 403 Forbidden или 404
      const status = typeof error === 'object' && error !== null && 'status' in error
        ? (error as { status?: unknown }).status
        : undefined;

      if (status === 401 || status === 403 || status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  });
}
