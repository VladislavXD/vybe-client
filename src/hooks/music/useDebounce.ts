'use client';

import { useEffect, useState } from 'react';

/**
 * Хук для безопасного дебаунса ввода пользователя в строке поиска.
 * Предотвращает спам запросов к API при быстром наборе текста.
 */
export function useDebounce<T>(value: T, delayMs = 350): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
