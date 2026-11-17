'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { musicService } from '@/src/services/music/music.service';
import type { MusicSearchResponse } from '@/src/services/music/music.types';
import { MUSIC_QUERY_KEYS } from './queryKeys';

interface UseMusicSearchOptions {
  limit?: number;
  enabled?: boolean;
}

/**
 * TanStack Query хук для поиска треков с сохранением предыдущих данных (keepPreviousData)
 * для плавного обновления выдачи без дергания интерфейса.
 */
export function useMusicSearch(query: string, options: UseMusicSearchOptions = {}) {
  const { limit = 20, enabled = true } = options;
  const cleanQuery = query.trim();
  const isSearchActive = cleanQuery.length >= 2;

  return useQuery<MusicSearchResponse>({
    queryKey: MUSIC_QUERY_KEYS.search(cleanQuery, limit),
    queryFn: () => musicService.search(cleanQuery, limit),
    enabled: enabled && isSearchActive,
    staleTime: 5 * 60 * 1000, // 5 минут
    placeholderData: keepPreviousData,
  });
}
