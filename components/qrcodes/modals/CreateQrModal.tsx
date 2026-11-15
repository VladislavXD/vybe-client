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
import type { CreateQrCodePayload } from '@/src/services/qrcode/qrcode.types';
import { Plus, Music2, UtensilsCrossed, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CreateQrModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: CreateQrCodePayload) => Promise<void> | void;
  isLoading?: boolean;
}

export function CreateQrModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: CreateQrModalProps) {
  const [tableLabel, setTableLabel] = useState('');
  const [type, setType] = useState<QrCodeType>('MUSIC');
  const [zoneId, setZoneId] = useState<string>('Основной зал');
  const [source, setSource] = useState<string>('table_tent');
  const [customCode, setCustomCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setTableLabel('');
    setType('MUSIC');
    setZoneId('Основной зал');
    setSource('table_tent');
    setCustomCode('');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableLabel.trim()) {
      setError('Укажите номер или название стола');
      return;
    }
    setError(null);

    try {
      await onSubmit({
        tableLabel: tableLabel.trim(),
        type,
        zoneId: zoneId.trim() || undefined,
        source: source.trim() || undefined,
        customCode: customCode.trim() || undefined,
      });
      resetForm();
      onOpenChange(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Не удалось создать QR-код';
      setError(msg);
    }
  };

  const typeOptions: { id: QrCodeType; label: string; desc: string; icon: React.ElementType }[] = [
    {
      id: 'MUSIC',
      label: 'Музыка',
      desc: 'Заказ треков у DJ заведения',
      icon: Music2,
    },
    {
      id: 'FOOD',
      label: 'Еда',
      desc: 'Электронное меню и заказ блюд',
      icon: UtensilsCrossed,
    },
    {
      id: 'REVIEWS',
      label: 'Отзывы',
      desc: 'Оценка заведения и чаевые',
      icon: Star,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[var(--dj-surface)] border border-[var(--dj-border)] text-[var(--dj-text-primary)] p-6 rounded-2xl shadow-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-[18px] font-bold text-[var(--dj-text-primary)] tracking-tight flex items-center gap-2">
            <span className="size-7 rounded-lg bg-[var(--dj-accent-muted)] text-[var(--dj-accent)] flex items-center justify-center">
              <Plus className="size-4" strokeWidth={2.5} />
            </span>
            Новый QR-код стола
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          {error && (
            <div className="px-3.5 py-2.5 rounded-xl bg-[var(--dj-danger-muted)] border border-[var(--dj-danger)]/30 text-[var(--dj-danger)] text-[12px] font-medium leading-relaxed">
              {error}
            </div>
          )}

          {/* Название / номер стола */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[var(--dj-text-secondary)]">
              Название или номер стола <span className="text-[var(--dj-accent)]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Например: Стол 14 или VIP 2"
              value={tableLabel}
              onChange={(e) => setTableLabel(e.target.value)}
              className="h-10 px-3.5 rounded-xl bg-[var(--dj-surface-elevated)] border border-[var(--dj-border)] text-[13px] text-[var(--dj-text-primary)] placeholder:text-[var(--dj-text-muted)] focus:outline-none focus:border-[var(--dj-accent)] transition-colors"
            />
          </div>

          {/* Назначение QR-кода */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[var(--dj-text-secondary)]">
              Назначение QR-кода
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
                      'flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer select-none',
                      isSelected
                        ? 'bg-[var(--dj-accent-muted)] border-[var(--dj-accent)] text-[var(--dj-accent)] font-semibold'
                        : 'bg-[var(--dj-surface-elevated)] border-[var(--dj-border)] text-[var(--dj-text-secondary)] hover:text-[var(--dj-text-primary)] hover:bg-[var(--dj-surface-hover)]'
                    )}
                  >
                    <Icon
                      className={cn(
                        'size-4 mb-1.5',
                        isSelected ? 'text-[var(--dj-accent)]' : 'text-[var(--dj-text-secondary)]'
                      )}
                    />
                    <span className="text-[12px] leading-tight">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Зона заведения */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[var(--dj-text-secondary)]">
              Зона заведения
            </label>
            <div className="flex flex-wrap gap-1.5 mb-1">
              {DEFAULT_ZONES.map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => setZoneId(z)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer border select-none',
                    zoneId === z
                      ? 'bg-[var(--dj-accent-muted)] border-[var(--dj-accent)]/50 text-[var(--dj-accent)]'
                      : 'bg-[var(--dj-surface-elevated)] border-[var(--dj-border)] text-[var(--dj-text-secondary)] hover:text-[var(--dj-text-primary)] hover:bg-[var(--dj-surface-hover)]'
                  )}
                >
                  {z}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Или укажите свою зону"
              value={zoneId}
              onChange={(e) => setZoneId(e.target.value)}
              className="h-9 px-3 rounded-xl bg-[var(--dj-surface-elevated)] border border-[var(--dj-border)] text-[13px] text-[var(--dj-text-primary)] placeholder:text-[var(--dj-text-muted)] focus:outline-none focus:border-[var(--dj-accent)] transition-colors"
            />
          </div>

          {/* Источник размещения */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-[var(--dj-text-secondary)]">
              Тип носителя (источник)
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

          <DialogFooter className="mt-4 pt-3 border-t border-[var(--dj-border)] flex items-center justify-end gap-2.5">
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
              disabled={isLoading}
              className="h-9 px-5 rounded-xl text-[12px] font-semibold bg-[var(--dj-accent)] text-black hover:opacity-90 transition-all cursor-pointer shadow-xs"
            >
              {isLoading ? 'Создание...' : 'Создать QR'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
