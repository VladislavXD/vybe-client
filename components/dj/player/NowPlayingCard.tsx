'use client'

import React, { useEffect, useState } from 'react'
import { Disc3, Volume2, VolumeX, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NowPlayingTrack } from '../types'
import { DJ_COLORS } from '../constants'
import { formatCurrency } from '@/src/utils/formatCurrency'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface NowPlayingCardProps {
  track: NowPlayingTrack | null
  className?: string
}

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec < 10 ? '0' : ''}${sec}`
}

/**
 * Карточка «Сейчас играет».
 * Без перемотки, без переключения — только чтение.
 * Живой прогресс, жёлтый accent.
 */
export function NowPlayingCard({ track, className }: NowPlayingCardProps) {
  const [currentSecs, setCurrentSecs] = useState(track?.currentSeconds ?? 0)
  const [muted, setMuted] = useState(false)

  // Reset when track changes
  useEffect(() => {
    setCurrentSecs(track?.currentSeconds ?? 0)
  }, [track?.id])

  // Playback simulation
  useEffect(() => {
    if (!track?.isPlaying) return
    const id = setInterval(() => {
      setCurrentSecs((prev) =>
        prev >= (track?.durationSeconds ?? 0) ? 0 : prev + 1
      )
    }, 1000)
    return () => clearInterval(id)
  }, [track?.isPlaying, track?.durationSeconds])

  // Empty state
  if (!track) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-3 rounded-2xl py-10',
          className
        )}
        style={{ backgroundColor: DJ_COLORS.surface }}
      >
        <Disc3
          className="size-8"
          strokeWidth={1.4}
          style={{ color: DJ_COLORS.textMuted }}
        />
        <p className="text-[13px] font-medium" style={{ color: DJ_COLORS.textMuted }}>
          Нет активного трека
        </p>
      </div>
    )
  }

  const pct = Math.min(100, Math.max(0, (currentSecs / track.durationSeconds) * 100))

  return (
    <div
      className={cn('relative flex flex-col gap-4 rounded-2xl overflow-hidden p-4', className)}
      style={{ backgroundColor: DJ_COLORS.surface }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(ellipse at 10% 0%, ${track.coverColor}, transparent 65%)`,
        }}
      />

      {/* Header: "В эфире" + genre + mute */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="size-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: DJ_COLORS.success }}
          />
          <span
            className="text-[10px] font-bold uppercase tracking-[0.16em]"
            style={{ color: DJ_COLORS.success }}
          >
            В эфире
          </span>
        </div>

        <div className="flex items-center gap-2">
          {track.genre && (
            <Badge
              variant="secondary"
              className="rounded-lg px-2 py-0.5 text-[10px] font-medium border-0"
              style={{
                backgroundColor: DJ_COLORS.surfaceElevated,
                color: DJ_COLORS.textSecondary,
              }}
            >
              {track.genre}
            </Badge>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => setMuted(!muted)}
            aria-label={muted ? 'Включить монитор' : 'Выключить монитор'}
            className="size-6 rounded-lg transition-colors cursor-pointer"
            style={{ color: DJ_COLORS.textMuted }}
          >
            {muted ? (
              <VolumeX className="size-3.5" strokeWidth={2} />
            ) : (
              <Volume2 className="size-3.5" strokeWidth={2} />
            )}
          </Button>
        </div>
      </div>

      {/* Cover + title/artist */}
      <div className="relative flex items-center gap-3">
        <div
          className="relative flex size-14 shrink-0 items-center justify-center rounded-xl overflow-hidden shadow-lg"
          style={{ backgroundColor: track.coverColor }}
        >
          <div className="animate-spin-slow flex size-full items-center justify-center">
            <Disc3 className="size-7 text-white/80" strokeWidth={1.4} />
          </div>
          {/* EQ bars */}
          <div className="absolute bottom-1.5 right-1.5 flex items-end gap-px">
            {[2, 3.5, 1.5, 4, 2.5].map((h, i) => (
              <span
                key={i}
                className="w-[2px] rounded-full animate-pulse"
                style={{
                  height: `${h * 2}px`,
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  animationDelay: `${i * 80}ms`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <h3
            className="text-base font-bold leading-tight truncate"
            style={{ color: DJ_COLORS.textPrimary }}
          >
            {track.title}
          </h3>
          <p
            className="text-[13px] mt-0.5 truncate"
            style={{ color: DJ_COLORS.textSecondary }}
          >
            {track.artist}
          </p>
        </div>
      </div>

      {/* Progress bar — shadcn Progress */}
      <div
        className="relative flex flex-col gap-1.5 select-none"
        role="progressbar"
        aria-valuenow={currentSecs}
        aria-valuemin={0}
        aria-valuemax={track.durationSeconds}
      >
        <div className="h-1 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
          <div
            className="h-full rounded-full transition-[width] duration-1000 ease-linear"
            style={{ width: `${pct}%`, backgroundColor: DJ_COLORS.accent }}
          />
        </div>
        <div
          className="flex justify-between text-[10px] font-medium tabular-nums"
          style={{ color: DJ_COLORS.textMuted }}
        >
          <span>{formatTime(currentSecs)}</span>
          <span>-{formatTime(Math.max(0, track.durationSeconds - currentSecs))}</span>
        </div>
      </div>

      {/* Requester info */}
      {track.requestedBy && (
        <div
          className="flex items-center justify-between rounded-xl px-3 py-2"
          style={{ backgroundColor: DJ_COLORS.surfaceElevated }}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className="text-[12px] font-semibold shrink-0"
              style={{ color: DJ_COLORS.textPrimary }}
            >
              {track.requestedBy.table}
            </span>
            {track.requestedBy.guestName && (
              <span
                className="text-[12px] truncate"
                style={{ color: DJ_COLORS.textSecondary }}
              >
                · {track.requestedBy.guestName}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {(track.requestedBy.tip ?? 0) > 0 && (
              <Badge
                variant="outline"
                suppressHydrationWarning
                className="flex items-center gap-0.5 rounded-lg px-1.5 py-0.5 text-[10px] font-bold border-0"
                style={{
                  color: DJ_COLORS.amber,
                  backgroundColor: DJ_COLORS.amberMuted,
                }}
              >
                <Sparkles className="size-2.5" />
                +{formatCurrency(track.requestedBy.tip!)}
              </Badge>
            )}
            <span
              className="text-[10px] font-mono"
              style={{ color: DJ_COLORS.textMuted }}
            >
              #{track.requestedBy.orderNumber}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
