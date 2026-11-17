'use client';

import React, { useState } from 'react';
import { QrCode, RefreshCw, AlertCircle, Coffee, Disc3, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GuestBackground } from '../background/GuestBackground';
import { Button } from '@/components/ui/button';

export interface GuestDisabledScreenProps {
  venueName?: string;
  tableLabel?: string;
  tableNumber?: number | string;
  code?: string;
  onRefresh?: () => void;
  className?: string;
}

/**
 * Премиальный экран для временно деактивированного QR-кода столика.
 * Оформлен в фирменном тёмном стиле TrackUp с неоновыми акцентами,
 * ambient-подсветкой и понятным объяснением для гостя.
 */
export const GuestDisabledScreen: React.FC<GuestDisabledScreenProps> = ({
  venueName = 'Заведение',
  tableLabel = 'Стол',
  tableNumber,
  code,
  onRefresh,
  className,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const displayTable = tableLabel || (tableNumber ? `Стол ${tableNumber}` : 'Ваш столик');

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (onRefresh) {
      onRefresh();
    } else if (typeof window !== 'undefined') {
      window.location.reload();
    }
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div
      className={cn(
        'relative w-full h-full min-h-[560px] flex flex-col justify-between p-6 sm:p-8 select-none text-white overflow-hidden',
        className
      )}
    >
      {/* Атмосферный фон с частицами и свечением */}
      <GuestBackground glowColor="rgba(244, 63, 94, 0.12)" />

      {/* Верхняя шапка: Заведение и Столик */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-white/40">
            {venueName}
          </span>
          <span className="text-[15px] font-bold text-white tracking-tight mt-0.5">
            {displayTable}
          </span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[11px] font-medium shadow-xs">
          <span className="size-1.5 rounded-full bg-rose-400 animate-pulse" />
          <span>Пауза</span>
        </div>
      </div>

      {/* Центральный визуальный блок */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center px-2 py-4">
        {/* Анимированная иконка неактивного QR-кода со свечением */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Пульсирующие фоновые кольца */}
          <div className="absolute size-32 rounded-full bg-rose-500/10 blur-2xl pointer-events-none" />
          <div className="absolute size-24 rounded-full border border-rose-500/20 animate-ping opacity-25 pointer-events-none" />

          {/* Карточка иконки */}
          <div className="relative size-20 rounded-2xl bg-[#141417]/90 border border-white/10 shadow-2xl flex items-center justify-center backdrop-blur-xl">
            <QrCode className="size-9 text-rose-300/80" />
            <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-[#18171C] border border-rose-500/40 flex items-center justify-center shadow-md">
              <AlertCircle className="size-3.5 text-rose-400" />
            </div>
          </div>
        </div>

        {/* Заголовки */}
        <h1 className="text-[22px] sm:text-[24px] font-extrabold tracking-tight text-white leading-tight">
          QR-код временно выключен
        </h1>
        <p className="text-[13px] sm:text-[14px] text-white/60 leading-relaxed max-w-[340px] mt-2">
          Заведение временно приостановило приём онлайн-заказов по этому столику.
        </p>

        {/* Информационная карточка */}
        <div className="w-full max-w-[360px] mt-6 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md flex flex-col gap-3 text-left">
          <div className="flex items-start gap-3">
            <div className="size-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <Disc3 className="size-3.5 text-purple-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-semibold text-white/90">DJ и музыка</span>
              <span className="text-[11px] text-white/50 leading-snug">
                Приём платных заказов на треки сейчас на паузе или DJ готовит новый сет.
              </span>
            </div>
          </div>

          <div className="h-px w-full bg-white/[0.06]" />

          <div className="flex items-start gap-3">
            <div className="size-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <Coffee className="size-3.5 text-amber-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-semibold text-white/90">Меню и напитки</span>
              <span className="text-[11px] text-white/50 leading-snug">
                Сделать заказ блюд и напитков можно напрямую через официанта.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Нижняя часть: Действия и примечание */}
      <div className="relative z-10 flex flex-col items-center gap-3 w-full">
        <Button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-[#EBC6A0] to-[#E2B789] hover:from-[#F2D1AD] hover:to-[#E8BE92] text-[#121116] font-bold text-[14px] shadow-lg shadow-[#EBC6A0]/15 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw className={cn('size-4 transition-transform', isRefreshing && 'animate-spin')} />
          <span>{isRefreshing ? 'Проверка статуса...' : 'Обновить страницу'}</span>
        </Button>

        <p className="text-[11px] text-center text-white/40 flex items-center justify-center gap-1.5">
          <Bell className="size-3 text-white/30" />
          <span>Если возникли вопросы, обратитесь к персоналу заведения</span>
        </p>

        {code && (
          <span className="text-[10px] font-mono text-white/20 tracking-wider">
            ID: {code}
          </span>
        )}
      </div>
    </div>
  );
};
