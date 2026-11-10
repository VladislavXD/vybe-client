'use client'

import React from 'react'
import { Play, Sparkles, ListMusic, Clock } from 'lucide-react'
import type { QueueItem } from '../types'
import { DJ_COLORS } from '../constants'
import { formatCurrency } from '@/src/utils/formatCurrency'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface TrackQueueProps {
  queue: QueueItem[]
  onPlayNext?: (item: QueueItem) => void
}

/**
 * Список треков в очереди.
 * Нативный стиль: нумерованные строки без лишних рамок.
 */
export function TrackQueue({ queue, onPlayNext }: TrackQueueProps) {
  if (queue.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-2 rounded-2xl py-10 text-center"
        style={{ backgroundColor: DJ_COLORS.surface }}
      >
        <ListMusic
          className="size-7"
          strokeWidth={1.4}
          style={{ color: DJ_COLORS.textMuted }}
        />
        <p className="text-[13px] font-medium" style={{ color: DJ_COLORS.textMuted }}>
          Очередь пуста
        </p>
        <p className="text-[11px] max-w-[180px] leading-relaxed opacity-70" style={{ color: DJ_COLORS.textMuted }}>
          Принятые заказы появятся здесь
        </p>
      </div>
    )
  }

  const totalMins = queue.length * 4

  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{ backgroundColor: DJ_COLORS.surface }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: `1px solid ${DJ_COLORS.border}` }}
      >
        <span
          className="text-[11px] font-bold uppercase tracking-[0.14em]"
          style={{ color: DJ_COLORS.textMuted }}
        >
          В очереди · {queue.length}
        </span>
        <div className="flex items-center gap-1" style={{ color: DJ_COLORS.textMuted }}>
          <Clock className="size-3" strokeWidth={1.8} />
          <span className="text-[11px]">~{totalMins} мин</span>
        </div>
      </div>

      {/* Items */}
      {queue.map((item, index) => (
        <div
          key={item.id}
          className="group flex items-center gap-3 px-4 py-3"
          style={{
            borderBottom:
              index < queue.length - 1 ? `1px solid ${DJ_COLORS.border}` : 'none',
          }}
        >
          {/* Position number */}
          <span
            className="flex size-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold tabular-nums"
            style={{
              backgroundColor: DJ_COLORS.surfaceElevated,
              color: DJ_COLORS.textMuted,
            }}
          >
            {index + 1}
          </span>

          {/* Info */}
          <div className="flex flex-1 flex-col min-w-0 gap-0.5">
            <p
              className="text-[13px] font-semibold truncate"
              style={{ color: DJ_COLORS.textPrimary }}
            >
              {item.track.title}
              <span style={{ color: DJ_COLORS.textSecondary, fontWeight: 400 }}>
                {' '}– {item.track.artist}
              </span>
            </p>
            <div
              className="flex items-center gap-2 text-[11px]"
              style={{ color: DJ_COLORS.textMuted }}
            >
              <span>{item.table}</span>
              <span>·</span>
              <span className="tabular-nums">{item.estimatedPlayTime}</span>
              {(item.tip ?? 0) > 0 && (
                <>
                  <span>·</span>
                  <Badge
                    variant="outline"
                    suppressHydrationWarning
                    className="flex items-center gap-0.5 font-semibold text-[10px] border-0"
                    style={{ color: DJ_COLORS.amber, backgroundColor: DJ_COLORS.amberMuted }}
                  >
                    <Sparkles className="size-2.5" />+{formatCurrency(item.tip!)}
                  </Badge>
                </>
              )}
            </div>
          </div>

          {/* Play now: shadcn Button */}
          {onPlayNext && (
            <Button
              type="button"
              variant="default"
              size="icon"
              onClick={() => onPlayNext(item)}
              title="Поставить в эфир"
              aria-label={`Включить ${item.track.title}`}
              className="size-8 rounded-xl opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all bg-white text-black hover:bg-white/90 active:scale-95 shadow-xs"
            >
              <Play className="size-3.5 fill-current" />
            </Button>
          )}
        </div>
      ))}
    </div>
  )
}
