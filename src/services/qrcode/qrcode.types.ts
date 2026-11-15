export type QrCodeType = 'MUSIC' | 'FOOD' | 'REVIEWS';
export type QrServiceType = 'music' | 'food' | 'review';

export interface QrCodeItem {
  id: string;
  code: string;
  tableLabel: string;
  tableNumber: number | null;
  type: QrCodeType;
  serviceType: QrServiceType;
  zoneId: string | null;
  source: string | null;
  venueId: string;
  isActive: boolean;
  scanCount: number;
  lastScannedAt: string | null;
  createdAt: string;
  updatedAt: string;
  scanUrl: string;
  dataUrl?: string;
  _count?: {
    orders: number;
  };
  venue?: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string | null;
  };
}

export interface CreateQrCodePayload {
  tableLabel: string;
  type?: QrCodeType;
  zoneId?: string;
  source?: string;
  customCode?: string;
  venueId?: string;
}

export interface BatchCreateQrCodePayload {
  startTable: number;
  endTable: number;
  tablePrefix?: string;
  type?: QrCodeType;
  zoneId?: string;
  source?: string;
  venueId?: string;
}

export interface BatchCreateQrCodeResponse {
  message: string;
  count: number;
  items: Array<{
    id: string;
    code: string;
    tableLabel: string;
    tableNumber: number;
    type: string;
    serviceType: string;
    scanUrl: string;
  }>;
}

export interface UpdateQrCodePayload {
  tableLabel?: string;
  type?: QrCodeType;
  zoneId?: string;
  source?: string;
  isActive?: boolean;
}

export interface DeleteQrCodeResponse {
  message: string;
  deleted?: boolean;
  deactivated?: boolean;
  id?: string;
  item?: QrCodeItem;
}

export interface QrFilterParams {
  type?: string;
  isActive?: boolean;
  search?: string;
  venueId?: string;
}

export interface QrCodeResolveResponse {
  redirectUrl: string;
  serviceType: QrServiceType;
  qrCode: {
    id: string;
    code: string;
    tableLabel: string;
    tableNumber: number | null;
    type: QrCodeType;
    serviceType: QrServiceType;
    zoneId: string | null;
    source: string | null;
    scanCount: number;
    lastScannedAt: string | null;
  };
  venue: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string | null;
    address?: string | null;
    city?: string | null;
  };
}
