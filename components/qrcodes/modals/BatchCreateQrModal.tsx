'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DEFAULT_ZONES, QR_SOURCES } from '../constants';
import type { QrCodeType } from '../types';
import type { BatchCreateQrCodePayload } from '@/src/services/qrcode/qrcode.types';
import { Layers, Music2, UtensilsCrossed, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BatchCreateQrModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: BatchCreateQrCodePayload) => Promise<void> | void;
  isLoading?: boolean;
}

export function BatchCreateQrModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: BatchCreateQrModalProps) {
  const [startTable, setStartTable] = useState(1);
  const [endTable, setEndTable] = useState(10);
  const [tablePrefix, setTablePrefix] = useState('Стол ');
  const [type, setType] = useState<QrCodeType>('MUSIC');
  const [zoneId, setZoneId] = useState<string>('Основной зал');
  const [source, setSource] = useState<string>('table_tent');
  const [error, setError] = useState<string | null>(null);

  const totalCount = Math.max(0, endTable - startTable + 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (endTable < startTable) {
      setError('Конечный номер не может быть меньше начального');
      return;
    }
    if (totalCount > 100) {
      setError('За один раз можно создать максимум 100 столов');
      return;
    }
    setError(null);

    try {
      await onSubmit({
        startTable,
        endTable,
        tablePrefix: tablePrefix.trim() || undefined,
        type,
        zoneId: zoneId.trim() || undefined,
        source: source.trim() || undefined,
      });
      onOpenChange(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка пакетного создания столов';
      setError(msg);
    }
  };

  const typeOptions: { id: QrCodeType; label: string; icon: React.ElementType }[] = [
    { id: 'MUSIC', label: 'Музыка', icon: Music2 },
    { id: 'FOOD', label: 'Еда', icon: UtensilsCrossed },
    { id: 'REVIEWS', label: 'Отзывы', icon: Star },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[var(--dj-surface)] border border-[var(--dj-border)] text-[var(--dj-text-primary)] p-6 rounded-2xl shadow-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-[18px] font-bold text-[var(--dj-text-primary)] tracking-tight flex items-center gap-2">
            <span className="size-7 rounded-lg bg-[var(--dj-accent-muted)] text-[var(--dj-accent)] flex items-center justify-center">
              <Layers className="size-4" strokeWidth={2.5} />
            </span>
            Пакетное создание столов
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          {error && (
            <div className="px-3.5 py-2.5 rounded-xl bg-[var(--dj-danger-muted)] border border-[var(--dj-danger)]/30 text-[var(--dj-danger)] text-[12px] font-medium leading-relaxed">
              {error}
            </div>
          )}

          {/* Диапазон столов */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-[var(--dj-text-secondary)]">
                Начальный номер <span className="text-[var(--dj-accent)]">*</span>
              </label>
              <input
                type="number"
                min={1}
                max={999}
                required
                value={startTable}
                onChange={(e) => setStartTable(parseInt(e.target.value, 10) || 1)}
                className="h-10 px-3.5 rounded-xl bg-[var(--dj-surface-elevated)] border border-[var(--dj-border)] text-[13px] text-[var(--dj-text-primary)] focus:outline-none focus:border-[var(--dj-accent)] transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-[var(--dj-text-secondary)]">
                Конечный номер <span className="text-[var(--dj-accent)]">*</span>
              </label>
              <input
                type="number"
                min={1}
                max={999}
                required
                value={endTable}
                onChange={(e) => setEndTable(parseInt(e.target.value, 10) || 1)}
                className="h-10 px-3.5 rounded-xl bg-[var(--dj-surface-elevated)] border border-[var(--dj-border)] text-[13px] text-[var(--dj-text-primary)] focus:outline-none focus:border-[var(--dj-accent)] transition-colors"
              />
            </div>
          </div>

          {/* Префикс */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[var(--dj-text-secondary)]">
              Префикс названия
            </label>
            <input
              type="text"
              placeholder="Стол  (или Table , VIP-)"
              value={tablePrefix}
              onChange={(e) => setTablePrefix(e.target.value)}
              className="h-10 px-3.5 rounded-xl bg-[var(--dj-surface-elevated)] border border-[var(--dj-border)] text-[13px] text-[var(--dj-text-primary)] placeholder:text-[var(--dj-text-muted)] focus:outline-none focus:border-[var(--dj-accent)] transition-colors"
            />
          </div>

          {/* Назначение */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[var(--dj-text-secondary)]">
              Назначение всей партии
            </label>
            <div className="grid grid-cols-3 gap-2">
              {typeOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = type === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setType(opt.id)}
                    className={cn(
                      'flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer select-none',
                      isSelected
                        ? 'bg-[var(--dj-accent-muted)] border-[var(--dj-accent)] text-[var(--dj-accent)] font-semibold'
                        : 'bg-[var(--dj-surface-elevated)] border-[var(--dj-border)] text-[var(--dj-text-secondary)] hover:text-[var(--dj-text-primary)] hover:bg-[var(--dj-surface-hover)]'
                    )}
                  >
                    <Icon className="size-3.5" />
                    <span className="text-[12px]">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Зона */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[var(--dj-text-secondary)]">
              Зона заведения
            </label>
            <select
              value={zoneId}
              onChange={(e) => setZoneId(e.target.value)}
              className="h-10 px-3 rounded-xl bg-[var(--dj-surface-elevated)] border border-[var(--dj-border)] text-[13px] text-[var(--dj-text-primary)] focus:outline-none focus:border-[var(--dj-accent)] transition-colors cursor-pointer"
            >
              {DEFAULT_ZONES.map((z) => (
                <option key={z} value={z} className="bg-[var(--dj-surface)] text-[var(--dj-text-primary)]">
                  {z}
                </option>
              ))}
            </select>
          </div>

          {/* Источник */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[var(--dj-text-secondary)]">
              Носитель (источник)
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="h-10 px-3 rounded-xl bg-[var(--dj-surface-elevated)] border border-[var(--dj-border)] text-[13px] text-[var(--dj-text-primary)] focus:outline-none focus:border-[var(--dj-accent)] transition-colors cursor-pointer"
            >
              {QR_SOURCES.map((s) => (
                <option key={s.id} value={s.id} className="bg-[var(--dj-surface)] text-[var(--dj-text-primary)]">
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Инфо-блок */}
          <div className="p-3 rounded-xl bg-[var(--dj-surface-elevated)] border border-[var(--dj-border)] text-[12px] text-[var(--dj-text-secondary)] flex items-center justify-between">
            <span>Будет создано столов:</span>
            <span className="font-bold text-[var(--dj-text-primary)] font-mono">{totalCount} шт.</span>
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
              type="submit"
              disabled={isLoading || totalCount <= 0}
              className="h-9 px-5 rounded-xl text-[12px] font-semibold bg-[var(--dj-accent)] text-black hover:opacity-90 transition-all cursor-pointer shadow-xs"
            >
              {isLoading ? 'Генерация...' : `Создать ${totalCount} столов`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
