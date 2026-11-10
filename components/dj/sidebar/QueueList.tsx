'use client'

import React from 'react'
import { Play, Sparkles, Clock, ListMusic } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { QueueItem } from '../types'
import { formatCurrency } from '@/src/utils/formatCurrency'

interface QueueListProps {
  queue: QueueItem[]
  onPlayNext?: (item: QueueItem) => void
  className?: string
}

/**
 * Список «Далее в очереди».
 * Минималистичный вид: нумерованные строки без карточек/рамок.
 * Полный функционал сохранён: порядок, время, чаевые, «в эфир».
 */
export function QueueList({ queue, onPlayNext, className }: QueueListProps) {
  const totalMinutes = queue.length * 4

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Meta: total duration */}
      {queue.length > 0 && (
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/50">
          <Clock className="size-3" />
          <span>~{totalMinutes} мин в очереди</span>
        </div>
      )}

      {/* Empty state */}
      {queue.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-[#1A1A1F] px-4 py-8 text-center">
          <ListMusic className="size-6 stroke-[1.4] text-muted-foreground/30" />
          <p className="text-xs text-muted-foreground/50">Очередь пуста</p>
          <p className="text-[11px] text-muted-foreground/35 leading-relaxed">
            Принятые заказы<br />появятся здесь
          </p>
        </div>
      )}

      {/* Queue items */}
      {queue.map((item, index) => (
        <div
          key={item.id}
          className="group flex items-center gap-3 rounded-2xl bg-[#1A1A1F] px-3.5 py-3 transition-colors hover:bg-[#1F1F25]"
        >
          {/* Position number */}
          <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-[11px] font-bold tabular-nums text-muted-foreground/60">
            {index + 1}
          </span>

          {/* Track info */}
          <div className="flex flex-1 flex-col min-w-0 gap-0.5">
            <p className="truncate text-xs font-semibold text-foreground">
              {item.track.title}
              <span className="font-normal text-muted-foreground"> – {item.track.artist}</span>
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/50">
              <span>{item.table}</span>
              <span>·</span>
              <span className="tabular-nums">{item.estimatedPlayTime}</span>
              {item.tip && item.tip > 0 && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-0.5 text-amber-400/80 font-semibold">
                    <Sparkles className="size-2.5" />
                    +{formatCurrency(item.tip)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Play now button */}
          {onPlayNext && (
            <button
              type="button"
              onClick={() => onPlayNext(item)}
              title="Поставить в эфир сейчас"
              aria-label={`Включить ${item.track.title}`}
              className="flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground/40 opacity-0 group-hover:opacity-100 hover:bg-[#FFCC00]/10 hover:text-[#FFCC00] transition-all cursor-pointer"
            >
              <Play className="size-3.5 fill-current" />
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
