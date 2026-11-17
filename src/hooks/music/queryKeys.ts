export const MUSIC_QUERY_KEYS = {
  all: ['music'] as const,
  charts: (limit = 20) => ['music', 'charts', limit] as const,
  search: (query: string, limit = 20) => ['music', 'search', query.trim().toLowerCase(), limit] as const,
  detail: (id: string) => ['music', 'detail', id] as const,
};
