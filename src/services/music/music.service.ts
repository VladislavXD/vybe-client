import { apiClient } from '@/src/services/api/api-client';
import type { MusicSearchResponse, MusicTrack } from './music.types';

export class MusicService {
  /**
   * Поиск треков по поисковому запросу
   */
  async search(query: string, limit = 20): Promise<MusicSearchResponse> {
    const cleanQuery = query.trim();
    if (!cleanQuery) {
      return { tracks: [], total: 0, source: 'cache', query: '' };
    }

    return apiClient.get<MusicSearchResponse>('music/search', {
      params: {
        q: cleanQuery,
        limit,
      },
    });
  }

  /**
   * Получение топ-чартов (трендовых треков) для начального экрана
   */
  async getCharts(limit = 20): Promise<MusicTrack[]> {
    return apiClient.get<MusicTrack[]>('music/charts', {
      params: {
        limit,
      },
    });
  }

  /**
   * Получение детальной информации о треке
   */
  async getTrackById(id: string): Promise<MusicTrack> {
    return apiClient.get<MusicTrack>(`music/${encodeURIComponent(id)}`);
  }
}

export const musicService = new MusicService();
