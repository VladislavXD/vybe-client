'use client';

import React from 'react';
import { Search } from 'lucide-react';
import type { QrTabCategory } from '../types';
import { cn } from '@/lib/utils';

interface QrFilterBarProps {
  category: QrTabCategory;
  onSelectCategory: (cat: QrTabCategory) => void;
  search: string;
  onSearchChange: (search: string) => void;
  onlyActive: boolean;
  onToggleOnlyActive: () => void;
  counts: {
    all: number;
    music: number;
    food: number;
    reviews: number;
  };
  className?: string;
}

export function QrFilterBar({
  category,
  onSelectCategory,
  search,
  onSearchChange,
  onlyActive,
  onToggleOnlyActive,
  counts,
  className = '',
}: QrFilterBarProps) {
  const tabs: { id: QrTabCategory; label: string; count: number }[] = [
    { id: 'all', label: 'Все', count: counts.all },
    { id: 'music', label: 'Музыка', count: counts.music },
    { id: 'food', label: 'Еда', count: counts.food },
    { id: 'reviews', label: 'Отзывы', count: counts.reviews },
  ];

  return (
    <div
      className={cn(
        'flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pb-4',
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        {/* Категории (табы) */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--dj-surface-elevated)] border border-[var(--dj-border)]">
          {tabs.map((tab) => {
            const isActive = category === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectCategory(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all cursor-pointer select-none',
                  isActive
                    ? 'bg-[var(--dj-surface)] text-[var(--dj-text-primary)] shadow-xs font-semibold'
                    : 'text-[var(--dj-text-secondary)] hover:text-[var(--dj-text-primary)] hover:bg-[var(--dj-surface-hover)]'
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    'text-[12px]',
                    isActive ? 'text-[var(--dj-accent)] font-bold' : 'text-[var(--dj-text-muted)]'
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Инпут поиска */}
        <div className="relative min-w-[240px] flex-1 sm:flex-initial">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[var(--dj-text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Поиск: стол, код, источник"
            className="w-full h-9 pl-9 pr-3 rounded-xl bg-[var(--dj-surface-elevated)] border border-[var(--dj-border)] text-[13px] text-[var(--dj-text-primary)] placeholder:text-[var(--dj-text-muted)] focus:outline-none focus:border-[var(--dj-accent)] transition-colors"
          />
        </div>
      </div>

      {/* Переключатель: Только активные */}
      <button
        type="button"
        onClick={onToggleOnlyActive}
        className={cn(
          'flex items-center justify-center gap-2 px-3.5 h-9 rounded-xl text-[13px] font-medium border transition-all cursor-pointer self-start lg:self-auto select-none',
          onlyActive
            ? 'bg-[var(--dj-accent-muted)] border-[var(--dj-accent)]/50 text-[var(--dj-accent)]'
            : 'bg-[var(--dj-surface-elevated)] border-[var(--dj-border)] text-[var(--dj-text-secondary)] hover:text-[var(--dj-text-primary)] hover:bg-[var(--dj-surface-hover)]'
        )}
      >
        <span
          className={cn(
            'size-2 rounded-full transition-colors',
            onlyActive ? 'bg-[var(--dj-success)]' : 'bg-[var(--dj-text-muted)]'
          )}
        />
        <span>Только активные</span>
      </button>
    </div>
  );
}
