'use client';

import React from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TrackSearchBarProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
  isSearching?: boolean;
  placeholder?: string;
  className?: string;
}

/**
 * Оптимизированная и безопасная строка поиска треков.
 * Поддерживает индикацию фонового поиска, быструю очистку и доступность.
 */
export const TrackSearchBar: React.FC<TrackSearchBarProps> = React.memo(({
  value,
  onChange,
  onClear,
  isSearching = false,
  placeholder = 'Название трека или исполнитель...',
  className,
}) => {
  return (
    <div className={cn('relative w-full shrink-0', className)}>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/40"
      />

      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck="false"
        className="h-10 sm:h-11 w-full rounded-xl bg-[#141415] border-white/10 pl-10 pr-10 text-xs sm:text-sm text-[#F2EFE9] placeholder:text-[#A9A5B1]/50 focus-visible:border-[#EBC6A0] focus-visible:ring-1 focus-visible:ring-[#EBC6A0]/40 transition-all shadow-inner"
      />

      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {isSearching && (
          <Loader2 className="size-4 text-[#EBC6A0] animate-spin shrink-0" />
        )}

        {value && !isSearching && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Очистить поиск"
            className="text-white/40 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
});

TrackSearchBar.displayName = 'TrackSearchBar';
