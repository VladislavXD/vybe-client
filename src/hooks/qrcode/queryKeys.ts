import type { QrFilterParams } from '@/src/services/qrcode/qrcode.types';

/**
 * Фабрика ключей кэша TanStack Query для QR-кодов.
 * Обеспечивает строгую иерархию для точечной инвалидации и оптимистичных обновлений.
 */
export const qrKeys = {
  all: ['qrcodes'] as const,

  // Списки QR-кодов
  lists: () => [...qrKeys.all, 'list'] as const,
  list: (filters?: QrFilterParams) =>
    [...qrKeys.lists(), filters ? sanitizeFilters(filters) : {}] as const,

  // Списки для конкретного заведения
  venueLists: () => [...qrKeys.all, 'venue'] as const,
  venueList: (venueId: string, filters?: QrFilterParams) =>
    [...qrKeys.venueLists(), venueId, filters ? sanitizeFilters(filters) : {}] as const,

  // Детализация одного QR-кода
  details: () => [...qrKeys.all, 'detail'] as const,
  detail: (id: string) => [...qrKeys.details(), id] as const,

  // Превью одного QR-кода
  previews: () => [...qrKeys.all, 'preview'] as const,
  preview: (id: string) => [...qrKeys.previews(), id] as const,
};

/**
 * Очистка и нормализация фильтров для детерминированного ключа кэша
 */
function sanitizeFilters(filters: QrFilterParams): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  if (filters.type) clean.type = filters.type;
  if (typeof filters.isActive === 'boolean') clean.isActive = filters.isActive;
  if (filters.search && filters.search.trim()) clean.search = filters.search.trim().toLowerCase();
  if (filters.venueId) clean.venueId = filters.venueId;
  return clean;
}
