import type { QrCodeItem, QrCodeType, QrServiceType } from '@/src/services/qrcode/qrcode.types';

export type { QrCodeItem, QrCodeType, QrServiceType };

export type QrTabCategory = 'all' | 'music' | 'food' | 'reviews';

export interface QrFilterState {
  category: QrTabCategory;
  search: string;
  onlyActive: boolean;
}
