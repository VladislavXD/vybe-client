'use client';

import React from 'react';
import type { QrCodeItem } from '../types';
import { QR_TYPE_CONFIG } from '../constants';
import { QrMiniPreview } from './QrMiniPreview';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface QrTableProps {
  items: QrCodeItem[];
  selectedId: string | null;
  onSelectItem: (item: QrCodeItem) => void;
  isLoading?: boolean;
  className?: string;
}

const SKELETON_ROWS = 6;

export function QrTable({
  items,
  selectedId,
  onSelectItem,
  isLoading = false,
  className = '',
}: QrTableProps) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl bg-[var(--dj-surface)] border border-[var(--dj-border)] transition-colors',
        className
      )}
    >
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse select-none">
          <thead>
            <tr className="border-b border-[var(--dj-border)] text-[11px] font-bold uppercase tracking-wider text-[var(--dj-text-muted)]">
              <th className="py-3 pl-4 pr-3 min-w-[200px]">Стол / код</th>
              <th className="py-3 px-3 text-center min-w-[110px]">Назначение</th>
              <th className="py-3 px-3 text-right min-w-[70px]">Сканы</th>
              <th className="py-3 px-3 text-right min-w-[70px]">Заказы</th>
              <th className="py-3 pr-4 pl-3 text-right min-w-[90px]">Статус</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--dj-border)]">
            {isLoading
              ? Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-3 pl-4 pr-3">
                      <div className="flex items-center gap-3">
                        <Skeleton className="size-9 rounded-lg flex-shrink-0" />
                        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                          <Skeleton className="h-3.5 w-24 rounded" />
                          <Skeleton className="h-2.5 w-32 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Skeleton className="h-6 w-16 rounded-lg mx-auto" />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Skeleton className="h-3.5 w-8 rounded ml-auto" />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Skeleton className="h-3.5 w-8 rounded ml-auto" />
                    </td>
                    <td className="py-3 pr-4 pl-3 text-right">
                      <Skeleton className="h-3.5 w-14 rounded ml-auto" />
                    </td>
                  </tr>
                ))
              : items.map((item) => {
                  const isSelected = selectedId === item.id;
                  const typeConfig = QR_TYPE_CONFIG[item.type] || QR_TYPE_CONFIG.MUSIC;
                  const ordersCount = item._count?.orders ?? 0;

                  return (
                    <tr
                      key={item.id}
                      onClick={() => onSelectItem(item)}
                      className={cn(
                        'transition-all cursor-pointer group',
                        isSelected
                          ? 'bg-[var(--dj-accent-muted)] border-y border-[var(--dj-accent)]/30'
                          : 'hover:bg-[var(--dj-surface-hover)]'
                      )}
                    >
                      {/* СТОЛ / КОД */}
                      <td className="py-3 pl-4 pr-3">
                        <div className="flex items-center gap-3">
                          <QrMiniPreview value={item.scanUrl || `https://app.trackup.uz/q/${item.code}`} />
                          <div className="flex flex-col min-w-0">
                            <span
                              className={cn(
                                'text-[14px] font-semibold tracking-tight transition-colors truncate',
                                isSelected ? 'text-[var(--dj-accent)]' : 'text-[var(--dj-text-primary)]'
                              )}
                            >
                              {item.tableLabel}
                            </span>
                            <span className="text-[11px] font-mono text-[var(--dj-text-muted)] truncate mt-0.5">
                              {item.code} · {item.source || 'table_tent'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* НАЗНАЧЕНИЕ */}
                      <td className="py-3 px-3 text-center">
                        <span
                          className={cn(
                            'inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-[11px] font-medium border border-transparent shadow-xs',
                            typeConfig.badgeBg,
                            typeConfig.badgeText,
                            typeConfig.badgeBorder
                          )}
                        >
                          {typeConfig.label}
                        </span>
                      </td>

                      {/* СКАНЫ */}
                      <td className="py-3 px-3 text-right font-medium text-[13px] text-[var(--dj-text-primary)]">
                        {item.scanCount.toLocaleString()}
                      </td>

                      {/* ЗАКАЗЫ */}
                      <td className="py-3 px-3 text-right font-medium text-[13px] text-[var(--dj-text-primary)]">
                        {ordersCount.toLocaleString()}
                      </td>

                      {/* СТАТУС */}
                      <td className="py-3 pr-4 pl-3 text-right text-[12px] font-medium">
                        {item.isActive ? (
                          <span className="text-[var(--dj-success)]">Активен</span>
                        ) : (
                          <span className="text-[var(--dj-text-muted)]">Отключён</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>

        {/* Пустое состояние — только когда загрузка завершена и данных нет */}
        {!isLoading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <p className="text-[14px] font-medium text-[var(--dj-text-primary)]">QR-коды не найдены</p>
            <p className="text-[12px] text-[var(--dj-text-secondary)] mt-1">
              Попробуйте изменить параметры поиска или создайте новый стол.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
