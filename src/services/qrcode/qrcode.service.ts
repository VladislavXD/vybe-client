import { apiClient, SERVER_URL } from '@/src/services/api/api-client';
import type {
  QrCodeItem,
  CreateQrCodePayload,
  BatchCreateQrCodePayload,
  BatchCreateQrCodeResponse,
  UpdateQrCodePayload,
  DeleteQrCodeResponse,
  QrFilterParams,
  QrCodeResolveResponse,
} from './qrcode.types';

export const qrCodeService = {
  /**
   * Получить все QR-коды текущего заведения владельца с фильтрацией.
   */
  async getMyQrCodes(params?: QrFilterParams): Promise<QrCodeItem[]> {
    const query = new URLSearchParams();
    if (params?.type) query.set('type', params.type);
    if (typeof params?.isActive === 'boolean') query.set('isActive', String(params.isActive));
    if (params?.search && params.search.trim()) query.set('search', params.search.trim());

    const qs = query.toString();
    const endpoint = `qrcode/my${qs ? `?${qs}` : ''}`;
    return apiClient.get<QrCodeItem[]>(endpoint);
  },

  /**
   * Получить QR-коды конкретного заведения по ID.
   */
  async getByVenueId(venueId: string, params?: QrFilterParams): Promise<QrCodeItem[]> {
    const query = new URLSearchParams();
    if (params?.type) query.set('type', params.type);
    if (typeof params?.isActive === 'boolean') query.set('isActive', String(params.isActive));
    if (params?.search && params.search.trim()) query.set('search', params.search.trim());

    const qs = query.toString();
    const endpoint = `qrcode/venue/${encodeURIComponent(venueId)}${qs ? `?${qs}` : ''}`;
    return apiClient.get<QrCodeItem[]>(endpoint);
  },

  /**
   * Получить один QR-код по ID с предпросмотром Data URL.
   */
  async getById(id: string): Promise<QrCodeItem> {
    return apiClient.get<QrCodeItem>(`qrcode/${encodeURIComponent(id)}`);
  },

  /**
   * Получить превью QR-кода с base64 dataUrl.
   */
  async getPreview(id: string): Promise<QrCodeItem> {
    return apiClient.get<QrCodeItem>(`qrcode/${encodeURIComponent(id)}/preview`);
  },

  /**
   * Резолвить QR-код для гостя (публичный путь).
   */
  async resolveByCode(code: string): Promise<QrCodeResolveResponse> {
    return apiClient.get<QrCodeResolveResponse>(`qrcode/resolve/${encodeURIComponent(code)}`);
  },

  /**
   * Создать одиночный QR-код стола.
   */
  async create(payload: CreateQrCodePayload): Promise<QrCodeItem> {
    return apiClient.post<QrCodeItem>('qrcode', payload);
  },

  /**
   * Пакетное создание диапазона QR-кодов.
   */
  async batchCreate(payload: BatchCreateQrCodePayload): Promise<BatchCreateQrCodeResponse> {
    return apiClient.post<BatchCreateQrCodeResponse>('qrcode/batch', payload);
  },

  /**
   * Обновить параметры QR-кода (название стола, тип, активность).
   */
  async update(id: string, payload: UpdateQrCodePayload): Promise<QrCodeItem> {
    return apiClient.patch<QrCodeItem>(`qrcode/${encodeURIComponent(id)}`, payload);
  },

  /**
   * Удалить или мягко деактивировать QR-код.
   */
  async delete(id: string): Promise<DeleteQrCodeResponse> {
    return apiClient.delete<DeleteQrCodeResponse>(`qrcode/${encodeURIComponent(id)}`);
  },

  /**
   * Сформировать прямой URL для скачивания PNG / SVG файла с сервера.
   */
  getImageUrl(
    id: string,
    format: 'png' | 'svg' = 'png',
    download = false,
    size = 600
  ): string {
    const base = SERVER_URL.replace(/\/$/, '');
    const query = new URLSearchParams({
      format,
      size: String(size),
      ...(download ? { download: 'true' } : {}),
    });
    return `${base}/qrcode/${encodeURIComponent(id)}/image?${query.toString()}`;
  },

  /**
   * Безопасная загрузка изображения QR-кода с авторизацией через Fetch Blob
   * и автотриггером скачивания в браузере.
   */
  async downloadImage(
    id: string,
    format: 'png' | 'svg' = 'png',
    filename?: string,
    size = 600
  ): Promise<void> {
    const url = this.getImageUrl(id, format, true, size);
    const response = await fetch(url, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Ошибка скачивания QR-кода: ${response.statusText}`);
    }

    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    const downloadName =
      filename || `qrcode-${id}.${format === 'svg' ? 'svg' : 'png'}`;

    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Освобождаем память браузера
    window.URL.revokeObjectURL(objectUrl);
  },
};
