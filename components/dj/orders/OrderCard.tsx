'use client'

import React from 'react'
import { Check, X, Play, Sparkles, MessageSquare, Music2, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DJOrder } from '../types'
import { DJ_COLORS } from '../constants'
import { formatCurrency } from '@/src/utils/formatCurrency'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface OrderCardProps {
  order: DJOrder
  onAccept?: (order: DJOrder) => void
  onReject?: (order: DJOrder) => void
  onPlayNow?: (order: DJOrder) => void
}

function useRelativeTime(timestamp: number) {
  const [label, setLabel] = React.useState('Только что')

  React.useEffect(() => {
    const calc = () => {
      const diff = Math.floor((Date.now() - timestamp) / 60_000)
      if (diff < 1) setLabel('Только что')
      else if (diff < 60) setLabel(`${diff} мин.`)
      else setLabel(`${Math.floor(diff / 60)} ч.`)
    }
    calc()
    const id = setInterval(calc, 60_000)
    return () => clearInterval(id)
  }, [timestamp])

  return label
}

/**
 * Карточка заказа — нативный стиль.
 *
 * Структура строки:
 * [цвет-маркер] [info: название–артист + мета] [цена] [действия]
 *
 * Состояния: pending (действия), accepted (в очереди), playing (в эфире),
 * rejected (полупрозрачно), completed (приглушено).
 */
export function OrderCard({ order, onAccept, onReject, onPlayNow }: OrderCardProps) {
  const relativeTime = useRelativeTime(order.timestamp)
  const { track } = order

  const isPending = order.status === 'pending'
  const isAccepted = order.status === 'accepted'
  const isPlaying = order.status === 'playing'
  const isRejected = order.status === 'rejected'
  const isCompleted = order.status === 'completed'

  const total = order.price + (order.tip ?? 0)

  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl overflow-hidden transition-opacity duration-200',
        (isRejected || isCompleted) && 'opacity-45'
      )}
      style={{ backgroundColor: DJ_COLORS.surface }}
    >
      {/* Main row */}
      <div className="flex items-start gap-3 px-4 py-3.5">
        {/* Cover color dot / genre marker */}
        <div
          className="relative mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl"
          style={{
            backgroundColor: track.coverColor
              ? `${track.coverColor}44`
              : DJ_COLORS.surfaceElevated,
          }}
        >
          <Music2
            className={cn('size-4.5', isPlaying && 'animate-pulse')}
            strokeWidth={1.8}
            style={{
              color: isPlaying ? DJ_COLORS.accent : DJ_COLORS.textSecondary,
            }}
          />
          {/* Playing pulse ring */}
          {isPlaying && (
            <span
              className="absolute inset-0 rounded-xl animate-ping opacity-30"
              style={{ backgroundColor: DJ_COLORS.accent }}
            />
          )}
        </div>

        {/* Text block */}
        <div className="flex flex-1 flex-col min-w-0 gap-1">
          {/* Track + artist */}
          <p
            className="text-sm font-semibold leading-snug truncate"
            style={{ color: DJ_COLORS.textPrimary }}
          >
            {track.title}
            <span
              className="font-normal"
              style={{ color: DJ_COLORS.textSecondary }}
            >
              {' '}– {track.artist}
            </span>
          </p>

          {/* Meta row */}
          <div
            className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px]"
            style={{ color: DJ_COLORS.textMuted }}
          >
            <span suppressHydrationWarning>{relativeTime}</span>
            {order.table && (
              <>
                <span>·</span>
                <span>{order.table}</span>
              </>
            )}
            {track.genre && (
              <>
                <span>·</span>
                <span>{track.genre}</span>
              </>
            )}
            {track.bpm && (
              <>
                <span>·</span>
                <span className="font-mono">{track.bpm} BPM</span>
              </>
            )}
            {order.priority === 'vip' && (
              <span
                className="rounded-md px-1.5 py-px text-[9px] font-extrabold"
                style={{
                  backgroundColor: DJ_COLORS.amberMuted,
                  color: DJ_COLORS.amber,
                }}
              >
                VIP
              </span>
            )}
          </div>

          {/* State-specific rows */}
          {isAccepted && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <ShieldCheck
                className="size-3 shrink-0"
                style={{ color: DJ_COLORS.success }}
              />
              <span className="text-[11px]" style={{ color: DJ_COLORS.success }}>
                В очереди
              </span>
              {onPlayNow && (
                <button
                  type="button"
                  onClick={() => onPlayNow(order)}
                  className="ml-1 flex items-center gap-1 rounded-lg px-2 py-0.5 text-[11px] font-semibold transition-colors cursor-pointer"
                  style={{
                    color: DJ_COLORS.accent,
                    backgroundColor: DJ_COLORS.accentMuted,
                  }}
                >
                  <Play className="size-2.5 fill-current" />
                  В эфир
                </button>
              )}
            </div>
          )}

          {isPlaying && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className="size-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: DJ_COLORS.success }}
              />
              <span
                className="text-[11px] font-semibold"
                style={{ color: DJ_COLORS.success }}
              >
                Звучит в зале
              </span>
            </div>
          )}

          {isRejected && order.rejectionReason && (
            <p className="text-[11px] mt-0.5 truncate" style={{ color: DJ_COLORS.danger }}>
              ✕ {order.rejectionReason}
            </p>
          )}
        </div>

        {/* Right: price + actions */}
        <div className="flex shrink-0 flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            {/* Tip */}
            {(order.tip ?? 0) > 0 && (
              <Badge
                variant="outline"
                suppressHydrationWarning
                className="flex items-center gap-0.5 rounded-lg px-1.5 py-0.5 text-[10px] font-bold border-0"
                style={{
                  color: DJ_COLORS.amber,
                  backgroundColor: DJ_COLORS.amberMuted,
                }}
              >
                <Sparkles className="size-2.5" />+{formatCurrency(order.tip!)}
              </Badge>
            )}

            {/* Price */}
            <span
              suppressHydrationWarning
              className="text-sm font-bold tabular-nums"
              style={{
                color:
                  isPending || isAccepted ? DJ_COLORS.accent : DJ_COLORS.textMuted,
              }}
            >
              {formatCurrency(total)}
            </span>
          </div>

          {/* Pending action buttons: shadcn Button */}
          {isPending && (
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => onReject?.(order)}
                aria-label="Отклонить"
                className="size-9 rounded-xl bg-transparent border-black/10 dark:border-white/10 text-muted-foreground hover:text-foreground active:scale-95"
              >
                <X className="size-4" strokeWidth={2.2} />
              </Button>
              <Button
                type="button"
                variant="default"
                size="icon"
                onClick={() => onAccept?.(order)}
                aria-label="Принять"
                className="size-9 rounded-xl bg-white text-black hover:bg-white/90 active:scale-95 shadow-xs"
              >
                <Check className="size-4" strokeWidth={2.5} />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Guest message — full width bottom strip */}
      {order.message && (
        <div
          className="flex items-start gap-2 px-4 py-2.5 text-[12px]"
          style={{
            borderTop: `1px solid ${DJ_COLORS.border}`,
            color: DJ_COLORS.textSecondary,
          }}
        >
          <MessageSquare className="size-3.5 shrink-0 mt-px" strokeWidth={1.8} />
          <span className="italic leading-relaxed">«{order.message}»</span>
        </div>
      )}
    </div>
  )
}
