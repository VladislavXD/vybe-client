'use client';

import React, { useState } from 'react';
import { Music, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MusicTrack } from '@/src/services/music/music.types';
import { TrackPreviewPlayer } from './TrackPreviewPlayer';

interface TrackCardProps {
  track: MusicTrack;
  isSelected: boolean;
  isPlayingPreview: boolean;
  onSelect: (track: MusicTrack) => void;
  onTogglePreview: (track: MusicTrack) => void;
  className?: string;
}

/**
 * Карточка музыкального трека в каталоге гостя.
 * Спроектирована под дизайн TrackUp: темная эстетика, квадратная обложка,
 * предпросмотр трека и мгновенный отклик при тапе.
 */
export const TrackCard: React.FC<TrackCardProps> = React.memo(({
  track,
  isSelected,
  isPlayingPreview,
  onSelect,
  onTogglePreview,
  className,
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={() => onSelect(track)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(track);
        }
      }}
      className={cn(
        'group relative w-full flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-2xl transition-all cursor-pointer select-none text-left',
        'border backdrop-blur-md',
        isSelected
          ? 'bg-white/[0.08] border-[#EBC6A0]/60 ring-1 ring-[#EBC6A0]/40 shadow-lg shadow-[#EBC6A0]/5'
          : 'bg-[#141415]/70 hover:bg-white/[0.05] border-white/[0.07] hover:border-white/[0.14] active:scale-[0.99]',
        className
      )}
    >
      {/* Левая часть: Обложка + Название + Артист */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Квадратная обложка с fallback */}
        <div className="relative size-11 sm:size-12 rounded-xl overflow-hidden shrink-0 bg-white/5 border border-white/10 flex items-center justify-center">
          {track.coverUrl && !imgError ? (
            <img
              src={track.coverSmallUrl || track.coverUrl}
              alt={track.title}
              loading="lazy"
              onError={() => setImgError(true)}
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="size-full flex items-center justify-center bg-gradient-to-br from-purple-900/40 to-[#141415] text-[#EBC6A0]">
              <Music className="size-5 opacity-70" />
            </div>
          )}

          {/* Индикатор выбора на обложке */}
          {isSelected && (
            <div className="absolute inset-0 bg-[#EBC6A0]/20 flex items-center justify-center backdrop-blur-[1px]">
              <div className="size-5 rounded-full bg-[#EBC6A0] text-[#121116] flex items-center justify-center shadow-xs">
                <Check className="size-3 stroke-[3]" />
              </div>
            </div>
          )}
        </div>

        {/* Текстовые данные трека */}
        <div className="flex flex-col min-w-0 flex-1 pr-1">
          <span
            className={cn(
              'text-[13px] sm:text-[14px] font-bold tracking-tight truncate leading-snug transition-colors',
              isSelected ? 'text-[#EBC6A0]' : 'text-white group-hover:text-white/95'
            )}
          >
            {track.title}
          </span>
          <div className="flex items-center gap-1.5 text-[11px] sm:text-[12px] text-white/50 truncate mt-0.5">
            <span className="truncate text-white/70">{track.artist}</span>
            {track.durationFormatted && (
              <>
                <span className="text-white/20">·</span>
                <span className="font-mono text-white/40 shrink-0">{track.durationFormatted}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Правая часть: кнопка прослушивания превью и бейдж источника */}
      <div className="flex items-center gap-2 shrink-0">
        <TrackPreviewPlayer
          previewUrl={track.previewUrl}
          isPlaying={isPlayingPreview}
          onTogglePlay={() => onTogglePreview(track)}
        />
      </div>
    </div>
  );
});

TrackCard.displayName = 'TrackCard';
