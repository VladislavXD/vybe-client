'use client';

import React from 'react';
import { Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrackPreviewPlayerProps {
  previewUrl?: string;
  isPlaying: boolean;
  onTogglePlay: (e: React.MouseEvent) => void;
  className?: string;
}

/**
 * Компактная кнопка прослушивания 30-секундного превью трека.
 */
export const TrackPreviewPlayer: React.FC<TrackPreviewPlayerProps> = React.memo(({
  previewUrl,
  isPlaying,
  onTogglePlay,
  className,
}) => {
  if (!previewUrl) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onTogglePlay(e);
      }}
      aria-label={isPlaying ? 'Остановить прослушивание' : 'Прослушать отрывок'}
      className={cn(
        'size-8 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0',
        isPlaying
          ? 'bg-[#EBC6A0] text-[#121116] shadow-md shadow-[#EBC6A0]/25 scale-105'
          : 'bg-white/8 hover:bg-white/16 text-white/80 hover:text-white border border-white/10 active:scale-95',
        className
      )}
    >
      {isPlaying ? (
        <Pause className="size-3.5 fill-current" />
      ) : (
        <Play className="size-3.5 fill-current ml-0.5" />
      )}
    </button>
  );
});

TrackPreviewPlayer.displayName = 'TrackPreviewPlayer';
