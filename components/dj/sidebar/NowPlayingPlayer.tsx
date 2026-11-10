'use client'

import React, { useEffect, useState } from 'react'
import { Disc3, Volume2, VolumeX, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { NowPlayingTrack } from '../types'
import { formatCurrency } from '@/src/utils/formatCurrency'

interface NowPlayingPlayerProps {
  track: NowPlayingTrack | null
  className?: string
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s < 10 ? '0' : ''}${s}`
}

/**
 * Минималистичный плеер «Сейчас играет».
 * Без возможности перемотки и переключения треков.
 * Живой прогресс, жёлтый акцент, тёмный фон.
 */
export function NowPlayingPlayer({ track, className }: NowPlayingPlayerProps) {
  const [currentSeconds, setCurrentSeconds] = useState(track?.currentSeconds ?? 0)
  const [isAudioMuted, setIsAudioMuted] = useState(false)

  useEffect(() => {
    setCurrentSeconds(track?.currentSeconds ?? 0)
  }, [track?.id])

  // Simulate playback progress
  useEffect(() => {
    if (!track?.isPlaying) return
    const interval = setInterval(() => {
      setCurrentSeconds((prev) => {
        if (prev >= track.durationSeconds) return 0
        return prev + 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [track?.isPlaying, track?.durationSeconds])

  // ── Empty state ────────────────────────────────────────────────────────────
  if (!track) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center gap-2 rounded-2xl bg-[#1A1A1F] px-4 py-8 text-center',
          className
        )}
      >
        <Disc3 className="size-7 stroke-[1.4] text-muted-foreground/40" />
        <p className="text-xs text-muted-foreground/50">Нет активного трека</p>
      </div>
    )
  }

  const progressPercent = Math.min(100, Math.max(0, (currentSeconds / track.durationSeconds) * 100))

  return (
    <div
      className={cn(
        'relative flex flex-col gap-4 overflow-hidden rounded-2xl bg-[#1A1A1F] p-4',
        className
      )}
    >
      {/* Subtle glow from cover color */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          background: `radial-gradient(circle at 15% 0%, ${track.coverColor}, transparent 60%)`,
        }}
      />

      {/* ── Header row: status + genre + mute ──────────────────────────────── */}
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FFCC00] opacity-60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-[#FFCC00]" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFCC00]/80">
            В эфире
          </span>
        </div>

        <div className="flex items-center gap-2">
          {track.genre && (
            <Badge
              variant="outline"
              className="h-5 border-white/10 px-1.5 text-[10px] text-muted-foreground/70"
            >
              {track.genre}
            </Badge>
          )}
          <button
            type="button"
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            aria-label={isAudioMuted ? 'Включить монитор' : 'Отключить монитор'}
            className="flex size-6 items-center justify-center rounded-lg text-muted-foreground/60 hover:text-muted-foreground transition-colors cursor-pointer"
          >
            {isAudioMuted ? (
              <VolumeX className="size-3.5 stroke-[2]" />
            ) : (
              <Volume2 className="size-3.5 stroke-[2]" />
            )}
          </button>
        </div>
      </div>

      {/* ── Cover + track info ─────────────────────────────────────────────── */}
      <div className="relative flex items-center gap-3">
        {/* Cover */}
        <div
          className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-lg"
          style={{ backgroundColor: track.coverColor }}
        >
          <div className="animate-spin-slow flex size-full items-center justify-center text-white/80">
            <Disc3 className="size-6" />
          </div>
          {/* Live equalizer bars */}
          <div className="absolute bottom-1 right-1 flex items-end gap-px">
            <span className="h-1.5 w-0.5 rounded-full bg-white/70 animate-pulse" />
            <span className="h-2.5 w-0.5 rounded-full bg-white/70 animate-pulse [animation-delay:120ms]" />
            <span className="h-1 w-0.5 rounded-full bg-white/70 animate-pulse [animation-delay:240ms]" />
          </div>
        </div>

        {/* Title / artist */}
        <div className="flex flex-col min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-foreground leading-snug">
            {track.title}
          </h3>
          <p className="truncate text-xs text-muted-foreground mt-0.5">{track.artist}</p>
        </div>
      </div>

      {/* ── Progress bar (read-only) ────────────────────────────────────────── */}
      <div
        className="relative flex flex-col gap-1.5 select-none"
        aria-label="Прогресс трека"
        role="progressbar"
        aria-valuenow={currentSeconds}
        aria-valuemin={0}
        aria-valuemax={track.durationSeconds}
      >
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.08]">
          <div
            className="h-full rounded-full bg-[#FFCC00] transition-[width] duration-300 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] font-medium tabular-nums text-muted-foreground/60">
          <span>{formatTime(currentSeconds)}</span>
          <span>-{formatTime(Math.max(0, track.durationSeconds - currentSeconds))}</span>
        </div>
      </div>

      {/* ── Requester info ─────────────────────────────────────────────────── */}
      {track.requestedBy && (
        <div className="relative flex items-center justify-between rounded-xl bg-white/[0.04] px-3 py-2 text-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="font-semibold text-foreground/80 shrink-0">
              {track.requestedBy.table}
            </span>
            {track.requestedBy.guestName && (
              <span className="text-muted-foreground/60 truncate">
                · {track.requestedBy.guestName}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {track.requestedBy.tip && track.requestedBy.tip > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] font-semibold text-amber-400/90">
                <Sparkles className="size-2.5" />
                +{formatCurrency(track.requestedBy.tip)}
              </span>
            )}
            <span className="text-[10px] font-mono text-muted-foreground/40">
              #{track.requestedBy.orderNumber}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
