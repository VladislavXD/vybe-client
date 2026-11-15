'use client';

import React from 'react';
import { Plus, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QrHeaderProps {
  totalCount: number;
  activeCount: number;
  onOpenCreate: () => void;
  onOpenBatch: () => void;
  className?: string;
}

export function QrHeader({
  totalCount,
  activeCount,
  onOpenCreate,
  onOpenBatch,
  className = '',
}: QrHeaderProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 ${className}`}
    >
      <div>
        <h1 className="text-[22px] sm:text-[26px] font-bold text-[var(--dj-text-primary)] tracking-tight leading-tight">
          QR-коды и столы
        </h1>
        <p className="text-[13px] text-[var(--dj-text-secondary)] mt-1 font-normal">
          {totalCount} кодов · {activeCount} активны · ссылка вида{' '}
          <span className="font-mono text-[var(--dj-text-muted)]">app.trackup.uz/q/код</span>
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="button"
          onClick={onOpenBatch}
          variant="outline"
          className="h-10 px-4 rounded-xl text-[13px] font-medium bg-[var(--dj-surface-elevated)] border-[var(--dj-border)] text-[var(--dj-text-primary)] hover:bg-[var(--dj-surface-hover)] transition-all cursor-pointer shadow-xs"
        >
          <Layers className="size-4 mr-2 text-[var(--dj-text-muted)]" />
          Создать пакетом
        </Button>

        <Button
          type="button"
          onClick={onOpenCreate}
          className="h-10 px-4.5 rounded-xl text-[13px] font-semibold bg-[var(--dj-accent)] text-black hover:opacity-90 transition-all cursor-pointer shadow-xs"
        >
          <Plus className="size-4 mr-1 text-black" strokeWidth={2.5} />
          Новый QR
        </Button>
      </div>
    </div>
  );
}
