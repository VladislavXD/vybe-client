'use client'

import React from 'react'
import { Wifi, BatteryMedium, Signal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DJTopBarProps {
  title?: string
  venueName?: string
  isLive?: boolean
  className?: string
}

/**
 * Верхняя панель дашбоарда DJ.
 * На мобильных: компактная, без venue name.
 * На десктопе: полная с venue name и системными иконками.
 */
export function DJTopBar({
  title = 'Панель управления',
  venueName = 'Neon Harbor Club',
  isLive = true,
  className,
}: DJTopBarProps) {
  return (
    <header
      className={cn(
        'flex h-12 sm:h-14 lg:h-14 w-full shrink-0 items-center justify-between',
        'px-4 sm:px-5 lg:px-6 border-b border-white/[0.06] bg-[#0E0E11] text-foreground',
        className
      )}
    >
      {/* Left: title + venue */}
      <div className="flex items-center gap-2.5 min-w-0">
        <h1 className="text-sm sm:text-base font-bold tracking-tight text-foreground truncate">
          {title}
        </h1>
        {venueName && (
          <span className="hidden md:inline text-xs text-muted-foreground/50 border-l border-white/[0.08] pl-2.5 truncate">
            {venueName}
          </span>
        )}
      </div>

      {/* Right: status + system icons */}
      <div className="flex items-center gap-2.5 sm:gap-3 text-muted-foreground/60 shrink-0">
        {/* Live/Offline status dot */}
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'size-1.5 rounded-full',
              isLive ? 'bg-[#FFCC00] animate-pulse' : 'bg-muted-foreground/40'
            )}
          />
          <span className="hidden sm:inline text-[11px] font-medium text-muted-foreground/60">
            {isLive ? 'Онлайн' : 'Офлайн'}
          </span>
        </div>

        {/* System indicators — hidden on small mobile */}
        <Signal className="hidden xs:block size-3.5 stroke-[1.8]" />
        <Wifi className="size-3.5 stroke-[1.8]" />
        <BatteryMedium className="hidden xs:block size-4 stroke-[1.8]" />
      </div>
    </header>
  )
}
