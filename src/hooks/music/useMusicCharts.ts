'use client';

import { useQuery } from '@tanstack/react-query';
import { musicService } from '@/src/services/music/music.service';
import type { MusicTrack } from '@/src/services/music/music.types';
import { MUSIC_QUERY_KEYS } from './queryKeys';

interface UseMusicChartsOptions {
  limit?: number;
  enabled?: boolean;
}

/**
 * TanStack Query хук для получения популярных/трендовых треков.
 * Показывается по умолчанию, пока пользователь не начал поиск.
 */
export function useMusicCharts(options: UseMusicChartsOptions = {}) {
  const { limit = 20, enabled = true } = options;

  return useQuery<MusicTrack[]>({
    queryKey: MUSIC_QUERY_KEYS.charts(limit),
    queryFn: () => musicService.getCharts(limit),
    enabled,
    staleTime: 10 * 60 * 1000, // 10 минут
  });
}
