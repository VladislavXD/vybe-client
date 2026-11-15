'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { qrCodeService } from '@/src/services/qrcode/qrcode.service';
import type {
  BatchCreateQrCodePayload,
  BatchCreateQrCodeResponse,
} from '@/src/services/qrcode/qrcode.types';
import { qrKeys } from './queryKeys';

export interface UseBatchCreateQrCodesOptions {
  onSuccess?: (data: BatchCreateQrCodeResponse) => void;
  onError?: (error: Error) => void;
}

/**
 * Хук мутации для пакетного создания диапазона QR-кодов столов (например 1..25).
 * Валидирует диапазон на клиенте и инвалидирует кэш списков после генерации.
 */
export function useBatchCreateQrCodes(options: UseBatchCreateQrCodesOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation<BatchCreateQrCodeResponse, Error, BatchCreateQrCodePayload>({
    mutationFn: async (payload) => {
      if (payload.startTable > payload.endTable) {
        throw new Error('Начальный номер стола не может быть больше конечного.');
      }
      const count = payload.endTable - payload.startTable + 1;
      if (count > 150) {
        throw new Error('За один запрос можно сгенерировать не более 150 QR-кодов.');
      }

      return qrCodeService.batchCreate(payload);
    },
    onSuccess: (data) => {
      // Инвалидируем списки
      queryClient.invalidateQueries({
        queryKey: qrKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: qrKeys.venueLists(),
      });

      options.onSuccess?.(data);
    },
    onError: (err) => {
      options.onError?.(err);
    },
  });
}
