'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { QrCodeItem } from '../types';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmDialogProps {
  item: QrCodeItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (item: QrCodeItem) => Promise<void> | void;
  isLoading?: boolean;
}

export function DeleteConfirmDialog({
  item,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: DeleteConfirmDialogProps) {
  if (!item) return null;

  const ordersCount = item._count?.orders ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm bg-[var(--dj-surface)] border border-[var(--dj-border)] text-[var(--dj-text-primary)] p-6 rounded-2xl shadow-2xl">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-[17px] font-bold text-[var(--dj-text-primary)] tracking-tight flex items-center gap-2.5">
            <span className="size-8 rounded-xl bg-[var(--dj-danger-muted)] text-[var(--dj-danger)] flex items-center justify-center shrink-0">
              <AlertTriangle className="size-4" strokeWidth={2.5} />
            </span>
            Удалить {item.tableLabel}?
          </DialogTitle>
        </DialogHeader>

        <div className="py-2 text-[13px] text-[var(--dj-text-secondary)] leading-relaxed flex flex-col gap-2">
          {ordersCount > 0 ? (
            <p>
              По этому столу уже зафиксировано{' '}
              <span className="text-[var(--dj-text-primary)] font-semibold">{ordersCount} заказов</span>. QR-код будет{' '}
              <span className="text-[var(--dj-amber)] font-medium">отключён</span>, чтобы сохранить историю и
              финансовые отчёты заведения.
            </p>
          ) : (
            <p>
              QR-код <span className="font-mono text-[var(--dj-text-primary)]">{item.code}</span> будет удалён безвозвратно.
            </p>
          )}
          <p className="text-[11px] text-[var(--dj-text-muted)]">
            Ссылка <span className="font-mono text-[var(--dj-text-primary)]/70">app.trackup.uz/q/{item.code}</span> перестанет
            принимать новые сканирования.
          </p>
        </div>

        <DialogFooter className="mt-3 pt-3 border-t border-[var(--dj-border)] flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-9 px-4 rounded-xl text-[12px] font-medium bg-[var(--dj-surface-elevated)] border-[var(--dj-border)] text-[var(--dj-text-secondary)] hover:text-[var(--dj-text-primary)] hover:bg-[var(--dj-surface-hover)]"
          >
            Отмена
          </Button>
          <Button
            type="button"
            disabled={isLoading}
            onClick={() => onConfirm(item)}
            className="h-9 px-4 rounded-xl text-[12px] font-semibold bg-[var(--dj-danger)] text-white hover:opacity-90 transition-all cursor-pointer shadow-xs"
          >
            {isLoading ? 'Удаление...' : 'Да, удалить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
