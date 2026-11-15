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
import { Switch } from '@/components/ui/switch';
import { DEFAULT_ZONES, QR_SOURCES } from '../constants';
import type { QrCodeItem, QrCodeType } from '../types';
import type { UpdateQrCodePayload } from '@/src/services/qrcode/qrcode.types';
import { Edit3, Music2, UtensilsCrossed, Star, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditQrModalProps {
  item: QrCodeItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (id: string, payload: UpdateQrCodePayload) => Promise<void> | void;
  isLoading?: boolean;
}

const TYPE_OPTIONS: { id: QrCodeType; label: string; desc: string; icon: React.ElementType }[] = [
  { id: 'MUSIC', label: 'Музыка', desc: 'Заказ треков DJ', icon: Music2 },
  { id: 'FOOD', label: 'Еда', desc: 'Меню и еда', icon: UtensilsCrossed },
  { id: 'REVIEWS', label: 'Отзывы', desc: 'Отзывы и чай', icon: Star },
];

interface EditQrFormProps {
  item: QrCodeItem;
  onCancel: () => void;
  onSubmit: (id: string, payload: UpdateQrCodePayload) => Promise<void> | void;
  isLoading?: boolean;
}

function EditQrForm({ item, onCancel, onSubmit, isLoading = false }: EditQrFormProps) {
  const [tableLabel, setTableLabel] = useState(item.tableLabel);
  const [type, setType] = useState<QrCodeType>(item.type);
  const [zoneId, setZoneId] = useState<string>(item.zoneId || 'Основной зал');
  const [source, setSource] = useState<string>(item.source || 'table_tent');
  const [isActive, setIsActive] = useState<boolean>(item.isActive);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tableLabel.trim()) {
      setError('Укажите номер или название стола');
      return;
    }
    setError(null);

    try {
      await onSubmit(item.id, {
        tableLabel: tableLabel.trim(),
        type,
        zoneId: zoneId.trim() || undefined,
        source: source.trim() || undefined,
        isActive,
      });
      onCancel();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка обновления стола';
      setError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
      {error && (
        <div className="px-3.5 py-2.5 rounded-xl bg-[var(--dj-danger-muted)] border border-[var(--dj-danger)]/30 text-[var(--dj-danger)] text-[12px] font-medium leading-relaxed">
          {error}
        </div>
      )}

      {/* Название / номер стола */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-medium text-[var(--dj-text-secondary)]">
          Название или номер стола
        </label>
        <input
          type="text"
          required
          value={tableLabel}
          onChange={(e) => setTableLabel(e.target.value)}
          className="h-10 px-3.5 rounded-xl bg-[var(--dj-surface-elevated)] border border-[var(--dj-border)] text-[13px] text-[var(--dj-text-primary)] focus:outline-none focus:border-[var(--dj-accent)] transition-colors"
        />
      </div>

      {/* Мгновенная смена назначения */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[12px] font-medium text-[var(--dj-text-secondary)]">
            Назначение QR-кода
          </label>
          <span className="text-[10px] text-[var(--dj-accent)] flex items-center gap-1 font-medium">
            <Sparkles className="size-3 text-[var(--dj-accent)]" /> Без перепечатки
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {TYPE_OPTIONS.map((opt) => {
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

      {/* Носитель */}
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

      {/* Принимает сканы */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--dj-surface-elevated)] border border-[var(--dj-border)]">
        <div className="flex flex-col">
          <span className="text-[13px] font-medium text-[var(--dj-text-primary)]">Принимает сканы</span>
          <span className="text-[11px] text-[var(--dj-text-muted)]">
            При отключении гость увидит сообщение о деактивации стола
          </span>
        </div>
        <Switch
          checked={isActive}
          onCheckedChange={setIsActive}
          className="data-[state=checked]:bg-[var(--dj-success)]"
        />
      </div>

      <DialogFooter className="mt-3 pt-3 border-t border-[var(--dj-border)] flex items-center justify-end gap-2.5">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="h-9 px-4 rounded-xl text-[12px] font-medium bg-[var(--dj-surface-elevated)] border-[var(--dj-border)] text-[var(--dj-text-secondary)] hover:text-[var(--dj-text-primary)] hover:bg-[var(--dj-surface-hover)]"
        >
          Отмена
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="h-9 px-5 rounded-xl text-[12px] font-semibold bg-[var(--dj-accent)] text-black hover:opacity-90 transition-all cursor-pointer shadow-xs"
        >
          {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function EditQrModal({
  item,
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: EditQrModalProps) {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-[var(--dj-surface)] border border-[var(--dj-border)] text-[var(--dj-text-primary)] p-6 rounded-2xl shadow-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-[18px] font-bold text-[var(--dj-text-primary)] tracking-tight flex items-center gap-2">
            <span className="size-7 rounded-lg bg-[var(--dj-accent-muted)] text-[var(--dj-accent)] flex items-center justify-center">
              <Edit3 className="size-4" strokeWidth={2.5} />
            </span>
            Параметры стола {item.tableLabel}
          </DialogTitle>
        </DialogHeader>

        <EditQrForm
          key={item.id}
          item={item}
          onCancel={() => onOpenChange(false)}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
