'use client';

import React from 'react';
import { Download, FileCode, Edit3, Trash2 } from 'lucide-react';
import type { QrCodeItem } from '../types';
import { QR_TYPE_CONFIG } from '../constants';
import { QrSvgRenderer } from './QrSvgRenderer';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { qrCodeService } from '@/src/services/qrcode/qrcode.service';
import { cn } from '@/lib/utils';

interface QrDetailCardProps {
  item: QrCodeItem | null;
  onEdit: (item: QrCodeItem) => void;
  onDelete: (item: QrCodeItem) => void;
  onToggleActive: (item: QrCodeItem, nextActive: boolean) => void;
  isToggling?: boolean;
  className?: string;
}

export function QrDetailCard({
  item,
  onEdit,
  onDelete,
  onToggleActive,
  isToggling = false,
  className = '',
}: QrDetailCardProps) {
  if (!item) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center p-8 rounded-2xl bg-[var(--dj-surface)] border border-[var(--dj-border)] text-center min-h-[480px]',
          className
        )}
      >
        <p className="text-[14px] font-medium text-[var(--dj-text-primary)]">Выберите стол</p>
        <p className="text-[12px] text-[var(--dj-text-muted)] mt-1">
          Нажмите на строку таблицы для просмотра детальной информации и скачивания QR.
        </p>
      </div>
    );
  }

  const typeConfig = QR_TYPE_CONFIG[item.type] || QR_TYPE_CONFIG.MUSIC;
  const scanUrl = item.scanUrl || `https://app.trackup.uz/q/${item.code}`;
  const displayUrl = scanUrl.replace(/^https?:\/\//, '');

  const formatLastScan = (isoDate?: string | null) => {
    if (!isoDate) return 'нет сканов';
    try {
      const d = new Date(isoDate);
      const hours = d.getHours().toString().padStart(2, '0');
      const minutes = d.getMinutes().toString().padStart(2, '0');
      return `сегодня, ${hours}:${minutes}`;
    } catch {
      return 'недавно';
    }
  };

  const handleDownload = async (format: 'png' | 'svg') => {
    try {
      if (item.id && !item.id.startsWith('qr-')) {
        await qrCodeService.downloadImage(
          item.id,
          format,
          `qrcode-${item.code}-${item.tableLabel.replace(/\s+/g, '_')}.${format}`
        );
        return;
      }

      if (format === 'svg') {
        const QRCode = await import('qrcode');
        const svg = await QRCode.toString(scanUrl, { type: 'svg', margin: 2 });
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `qrcode-${item.code}-${item.tableLabel}.svg`;
        a.click();
        URL.revokeObjectURL(blobUrl);
      } else {
        const QRCode = await import('qrcode');
        const dataUrl = await QRCode.toDataURL(scanUrl, { margin: 2, width: 800 });
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `qrcode-${item.code}-${item.tableLabel}.png`;
        a.click();
      }
    } catch (err) {
      console.error('Ошибка скачивания QR-кода:', err);
    }
  };

  return (
    <div
      className={cn(
        'rounded-2xl bg-[var(--dj-surface)] border border-[var(--dj-border)] p-5 flex flex-col justify-between shadow-xl select-none transition-colors',
        className
      )}
    >
      <div>
        {/* Шапка: ПРЕДПРОСМОТР и бейдж назначения */}
        <div className="flex items-center justify-between pb-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--dj-text-muted)]">
            Предпросмотр
          </span>
          <span
            className={cn(
              'inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-medium border border-transparent shadow-xs',
              typeConfig.badgeBg,
              typeConfig.badgeText,
              typeConfig.badgeBorder
            )}
          >
            {typeConfig.label}
          </span>
        </div>

        {/* Крупный QR-код */}
        <div className="flex flex-col items-center justify-center py-2">
          <QrSvgRenderer
            value={scanUrl}
            size={184}
            className="shadow-lg border border-black/10"
          />

          <div className="text-center mt-3.5">
            <h3 className="text-[18px] font-bold text-[var(--dj-text-primary)] tracking-tight leading-tight">
              {item.tableLabel}
            </h3>
            <p className="text-[12px] font-mono text-[var(--dj-text-secondary)] mt-0.5">
              {displayUrl}
            </p>
          </div>
        </div>

        {/* Кнопки скачивания */}
        <div className="grid grid-cols-2 gap-2.5 mt-4">
          <Button
            type="button"
            onClick={() => handleDownload('png')}
            className="h-9 px-3 rounded-xl bg-[var(--dj-accent)] text-black text-[12px] font-semibold hover:opacity-90 transition-all cursor-pointer shadow-xs"
          >
            <Download className="size-3.5 mr-1.5" />
            Скачать PNG
          </Button>

          <Button
            type="button"
            onClick={() => handleDownload('svg')}
            variant="outline"
            className="h-9 px-3 rounded-xl bg-[var(--dj-surface-elevated)] border-[var(--dj-border)] text-[var(--dj-text-primary)] text-[12px] font-medium hover:bg-[var(--dj-surface-hover)] transition-all cursor-pointer"
          >
            <FileCode className="size-3.5 mr-1.5 text-[var(--dj-text-muted)]" />
            SVG для печати
          </Button>
        </div>

        {/* Подпись макета */}
        <p className="text-[10px] text-center text-[var(--dj-text-muted)] mt-2.5 leading-relaxed">
          Макет. В продукте картинку отдаёт сервер (/qrcode/:id/image).
        </p>

        {/* Характеристики стола */}
        <div className="mt-5 pt-4 border-t border-[var(--dj-border)] flex flex-col gap-2.5 text-[13px]">
          <div className="flex items-center justify-between">
            <span className="text-[var(--dj-text-secondary)]">Зона</span>
            <span className="font-medium text-[var(--dj-text-primary)]">{item.zoneId || 'Основной зал'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[var(--dj-text-secondary)]">Источник</span>
            <span className="font-mono text-[12px] text-[var(--dj-text-primary)]">{item.source || 'table_tent'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[var(--dj-text-secondary)]">Сканов</span>
            <span className="font-medium text-[var(--dj-text-primary)]">{item.scanCount.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[var(--dj-text-secondary)]">Последний скан</span>
            <span className="font-medium text-[var(--dj-text-primary)]">{formatLastScan(item.lastScannedAt)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[var(--dj-text-secondary)]">Заказов</span>
            <span className="font-medium text-[var(--dj-text-primary)]">
              {(item._count?.orders ?? 0).toLocaleString()}
            </span>
          </div>

          {/* Принимает сканы (Switch) */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[var(--dj-text-secondary)]">Принимает сканы</span>
            <Switch
              checked={item.isActive}
              disabled={isToggling}
              onCheckedChange={(checked) => onToggleActive(item, checked)}
              className="data-[state=checked]:bg-[var(--dj-success)]"
            />
          </div>
        </div>
      </div>

      {/* Кнопки действий: Изменить / Удалить */}
      <div className="mt-6 pt-4 border-t border-[var(--dj-border)]">
        <div className="grid grid-cols-2 gap-2.5">
          <Button
            type="button"
            onClick={() => onEdit(item)}
            variant="outline"
            className="h-9 rounded-xl bg-[var(--dj-surface-elevated)] border-[var(--dj-border)] text-[var(--dj-text-primary)] text-[12px] font-medium hover:bg-[var(--dj-surface-hover)] transition-all cursor-pointer"
          >
            <Edit3 className="size-3.5 mr-1.5 text-[var(--dj-text-muted)]" />
            Изменить
          </Button>

          <Button
            type="button"
            onClick={() => onDelete(item)}
            variant="outline"
            className="h-9 rounded-xl bg-[var(--dj-surface-elevated)] border-[var(--dj-danger-muted)] text-[var(--dj-danger)] text-[12px] font-medium hover:bg-[var(--dj-danger-muted)] transition-all cursor-pointer"
          >
            <Trash2 className="size-3.5 mr-1.5 text-[var(--dj-danger)]" />
            Удалить
          </Button>
        </div>

        <p className="text-[10px] text-center text-[var(--dj-text-muted)] mt-2.5 leading-relaxed">
          Если по коду уже были заказы, он не удаляется, а отключается, чтобы история осталась.
        </p>
      </div>
    </div>
  );
}
