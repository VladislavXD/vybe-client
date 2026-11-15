'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { qrCodeService } from '@/src/services/qrcode/qrcode.service';
import type {
  DeleteQrCodeResponse,
  QrCodeItem,
} from '@/src/services/qrcode/qrcode.types';
import { qrKeys } from './queryKeys';

interface DeleteMutationContext {
  previousLists: Array<[readonly unknown[], QrCodeItem[] | undefined]>;
  deletedId: string;
}

export interface UseDeleteQrCodeOptions {
  onSuccess?: (data: DeleteQrCodeResponse, id: string) => void;
  onError?: (error: Error, id: string, context?: DeleteMutationContext) => void;
  onSettled?: () => void;
}

/**
 * Хук мутации для удаления или безопасной деактивации QR-кода стола.
 * Оптимистично удаляет запись из UI и откатывает кэш при сетевых сбоях.
 */
export function useDeleteQrCode(options: UseDeleteQrCodeOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation<DeleteQrCodeResponse, Error, string, DeleteMutationContext>({
    mutationFn: (id: string) => qrCodeService.delete(id),

    onMutate: async (id: string) => {
      // 1. Отменяем активные списочные запросы
      await queryClient.cancelQueries({ queryKey: qrKeys.lists() });
      await queryClient.cancelQueries({ queryKey: qrKeys.venueLists() });

      // 2. Снапшот списков
      const previousLists = queryClient.getQueriesData<QrCodeItem[]>({
        queryKey: qrKeys.lists(),
      });

      // 3. Оптимистично убираем запись из списков
      queryClient.setQueriesData<QrCodeItem[]>(
        { queryKey: qrKeys.lists() },
        (old) => {
          if (!old) return old;
          return old.filter((item) => item.id !== id);
        }
      );

      return { previousLists, deletedId: id };
    },

    onError: (err, id, context) => {
      // 4. Откатываем назад при ошибке
      if (context?.previousLists) {
        for (const [queryKey, oldData] of context.previousLists) {
          queryClient.setQueryData(queryKey, oldData);
        }
      }

      options.onError?.(err, id, context);
    },

    onSuccess: (data, id) => {
      // Если сервер вернул деактивацию вместо полного удаления (были заказы)
      if (data.deactivated && data.item) {
        queryClient.setQueryData(qrKeys.detail(id), data.item);
      } else {
        queryClient.removeQueries({ queryKey: qrKeys.detail(id) });
        queryClient.removeQueries({ queryKey: qrKeys.preview(id) });
      }

      options.onSuccess?.(data, id);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: qrKeys.lists() });
      queryClient.invalidateQueries({ queryKey: qrKeys.venueLists() });
      options.onSettled?.();
    },
  });
}
