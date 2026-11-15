'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { qrCodeService } from '@/src/services/qrcode/qrcode.service';
import type { CreateQrCodePayload, QrCodeItem } from '@/src/services/qrcode/qrcode.types';
import { qrKeys } from './queryKeys';

export interface UseCreateQrCodeOptions {
  onSuccess?: (data: QrCodeItem) => void;
  onError?: (error: Error) => void;
}

/**
 * Хук мутации для создания одиночного QR-кода стола.
 * При успехе автоматически наполняет кэш детальной записи и инвалидирует списки.
 */
export function useCreateQrCode(options: UseCreateQrCodeOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation<QrCodeItem, Error, CreateQrCodePayload>({
    mutationFn: (payload) => qrCodeService.create(payload),
    onSuccess: (newItem) => {
      // Сохраняем в кэш детализации сразу, экономя повторный запрос
      queryClient.setQueryData(qrKeys.detail(newItem.id), newItem);
      if (newItem.dataUrl) {
        queryClient.setQueryData(qrKeys.preview(newItem.id), newItem);
      }

      // Инвалидируем все списки QR-кодов для актуализации
      queryClient.invalidateQueries({
        queryKey: qrKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: qrKeys.venueLists(),
      });

      options.onSuccess?.(newItem);
    },
    onError: (err) => {
      options.onError?.(err);
    },
  });
}
