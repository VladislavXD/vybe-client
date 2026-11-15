'use client';

/**
 * Реэкспорт для обратной совместимости.
 * Все хуки декомпозированы в отдельные модули в данной директории.
 */
export { qrKeys, qrKeys as QR_CODES_QUERY_KEY } from './queryKeys';
export { useQrCodesList as useQrCodes, useQrCodesList } from './useQrCodesList';
export { useQrCodeDetail } from './useQrCodeDetail';
export { useCreateQrCode } from './useCreateQrCode';
export { useBatchCreateQrCodes } from './useBatchCreateQrCodes';
export { useUpdateQrCode } from './useUpdateQrCode';
export { useDeleteQrCode } from './useDeleteQrCode';
export { useQrCodeDownload } from './useQrCodeDownload';
