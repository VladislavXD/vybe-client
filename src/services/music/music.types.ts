/**
 * Модель музыкального трека для клиентской части
 */
export interface MusicTrack {
  id: string; // Уникальный ID с префиксом ("dz-12345" или "it-12345")
  externalId: string; // ID в Deezer / iTunes
  source: 'deezer' | 'itunes' | 'manual';
  title: string;
  artist: string;
  album?: string;
  durationSeconds: number;
  durationMs: number;
  durationFormatted: string; // "3:42"
  coverUrl: string; // 500x500+
  coverSmallUrl?: string; // 100x100
  previewUrl?: string; // mp3 preview URL
  explicitLyrics?: boolean;
  isrc?: string;
}

/**
 * Ответ поиска музыки с сервера
 */
export interface MusicSearchResponse {
  tracks: MusicTrack[];
  total: number;
  source: 'deezer' | 'itunes' | 'cache';
  query: string;
}
