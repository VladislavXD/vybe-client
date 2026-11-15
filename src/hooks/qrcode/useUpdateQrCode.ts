'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { qrCodeService } from '@/src/services/qrcode/qrcode.service';
import type {
  QrCodeItem,
  QrServiceType,
  UpdateQrCodePayload,
} from '@/src/services/qrcode/qrcode.types';
import { qrKeys } from './queryKeys';

export interface UpdateQrCodeVariables {
  id: string;
  payload: UpdateQrCodePayload;
}

interface MutationContext {
  previousLists: Array<[readonly unknown[], QrCodeItem[] | undefined]>;
  previousDetail?: QrCodeItem;
  previousPreview?: QrCodeItem;
}

export interface UseUpdateQrCodeOptions {
  onSuccess?: (data: QrCodeItem, variables: UpdateQrCodeVariables) => void;
  onError?: (error: Error, variables: UpdateQrCodeVariables, context?: MutationContext) => void;
  onSettled?: () => void;
}

/**
 * Хук мутации для обновления QR-кода (название стола, тип MUSIC/FOOD/REVIEWS, активность, зона).
 * Реализует оптимистичное обновление кэша списков и деталей с мгновенным откликом UI
 * и автоматическим откатом (rollback) при сетевых или серверных ошибках.
 */
export function useUpdateQrCode(options: UseUpdateQrCodeOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation<QrCodeItem, Error, UpdateQrCodeVariables, MutationContext>({
    mutationFn: ({ id, payload }) => qrCodeService.update(id, payload),

    onMutate: async ({ id, payload }) => {
      // 1. Отменяем любые исходящие запросы, чтобы они не перезаписали наш оптимистичный стейт
      await queryClient.cancelQueries({ queryKey: qrKeys.lists() });
      await queryClient.cancelQueries({ queryKey: qrKeys.venueLists() });
      await queryClient.cancelQueries({ queryKey: qrKeys.detail(id) });
      await queryClient.cancelQueries({ queryKey: qrKeys.preview(id) });

      // 2. Делаем снапшоты текущих данных
      const previousLists = queryClient.getQueriesData<QrCodeItem[]>({
        queryKey: qrKeys.lists(),
      });
      const previousDetail = queryClient.getQueryData<QrCodeItem>(qrKeys.detail(id));
      const previousPreview = queryClient.getQueryData<QrCodeItem>(qrKeys.preview(id));

      const mapServiceType = (t?: string): QrServiceType => {
        if (t === 'FOOD') return 'food';
        if (t === 'REVIEWS') return 'review';
        return 'music';
      };

      // 3. Оптимистично обновляем все списки в кэше
      queryClient.setQueriesData<QrCodeItem[]>(
        { queryKey: qrKeys.lists() },
        (old) => {
          if (!old) return old;
          return old.map((item) => {
            if (item.id !== id) return item;
            return {
              ...item,
              ...(payload.tableLabel !== undefined && { tableLabel: payload.tableLabel.trim() }),
              ...(payload.type !== undefined && {
                type: payload.type,
                serviceType: mapServiceType(payload.type),
              }),
              ...(payload.zoneId !== undefined && { zoneId: payload.zoneId || null }),
              ...(payload.source !== undefined && { source: payload.source || null }),
              ...(payload.isActive !== undefined && { isActive: payload.isActive }),
              updatedAt: new Date().toISOString(),
            };
          });
        }
      );

      // 4. Оптимистично обновляем деталь и превью
      if (previousDetail) {
        queryClient.setQueryData<QrCodeItem>(qrKeys.detail(id), {
          ...previousDetail,
          ...(payload.tableLabel !== undefined && { tableLabel: payload.tableLabel.trim() }),
          ...(payload.type !== undefined && {
            type: payload.type,
            serviceType: mapServiceType(payload.type),
          }),
          ...(payload.zoneId !== undefined && { zoneId: payload.zoneId || null }),
          ...(payload.source !== undefined && { source: payload.source || null }),
          ...(payload.isActive !== undefined && { isActive: payload.isActive }),
          updatedAt: new Date().toISOString(),
        });
      }

      return { previousLists, previousDetail, previousPreview };
    },

    onError: (err, variables, context) => {
      // 5. В случае ошибки — моментально откатываем кэш назад к сохраненному снапшоту
      if (context?.previousLists) {
        for (const [queryKey, oldData] of context.previousLists) {
          queryClient.setQueryData(queryKey, oldData);
        }
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(qrKeys.detail(variables.id), context.previousDetail);
      }
      if (context?.previousPreview) {
        queryClient.setQueryData(qrKeys.preview(variables.id), context.previousPreview);
      }

      options.onError?.(err, variables, context);
    },

    onSuccess: (updatedItem, variables) => {
      // 6. При успехе синхронизируем реальные серверные данные
      queryClient.setQueryData(qrKeys.detail(updatedItem.id), updatedItem);
      options.onSuccess?.(updatedItem, variables);
    },

    onSettled: (_data, _error, variables) => {
      // 7. Инвалидируем запросы для 100% консистентности данных с БД
      queryClient.invalidateQueries({ queryKey: qrKeys.lists() });
      queryClient.invalidateQueries({ queryKey: qrKeys.venueLists() });
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: qrKeys.detail(variables.id) });
      }
      options.onSettled?.();
    },
  });
}
