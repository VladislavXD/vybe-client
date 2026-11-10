'use client'

import React from 'react'
import { NowPlayingCard } from '../player/NowPlayingCard'
import { TrackQueue } from '../player/TrackQueue'
import type { NowPlayingTrack, QueueItem } from '../types'

interface NowPlayingScreenProps {
  nowPlaying: NowPlayingTrack | null
  queue: QueueItem[]
  onPlayNext: (item: QueueItem) => void
}

/**
 * Экран «Эфир»: плеер + список очереди.
 * На десктопе — в правой колонке.
 * На мобильном — полноэкранная вкладка.
 */
export function NowPlayingScreen({ nowPlaying, queue, onPlayNext }: NowPlayingScreenProps) {
  return (
    <div className="flex flex-col gap-4">
      <NowPlayingCard track={nowPlaying} />
      <TrackQueue queue={queue} onPlayNext={onPlayNext} />
    </div>
  )
}
