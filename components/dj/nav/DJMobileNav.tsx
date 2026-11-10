'use client'

import React from 'react'
import { ListMusic, Disc3, Music2, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DJTab } from '../types'
import { DJ_COLORS } from '../constants'

interface DJMobileNavProps {
  activeTab: DJTab
  onSelectTab: (tab: DJTab) => void
  pendingOrdersCount?: number
  nowPlayingTitle?: string | null
}

const NAV_ITEMS: {
  id: DJTab
  label: string
  icon: React.ElementType
}[] = [
  { id: 'orders', label: 'Заказы', icon: ListMusic },
  { id: 'playing', label: 'Эфир', icon: Disc3 },
  { id: 'queue', label: 'Очередь', icon: Music2 },
  { id: 'settings', label: 'Настройки', icon: Settings },
]

/**
 * Нижняя навигация для мобильных устройств.
 * Отображается вместо левого сайдбара на экранах < lg.
 */
export function DJMobileNav({
  activeTab,
  onSelectTab,
  pendingOrdersCount = 0,
  nowPlayingTitle,
}: DJMobileNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-stretch border-t border-white/[0.06] bg-[#0E0E11] lg:hidden"
      aria-label="Нижняя навигация"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        const isActive = activeTab === item.id

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectTab(item.id)}
            aria-label={item.label}
            className={cn(
              'relative flex flex-1 flex-col items-center justify-center gap-1 transition-colors cursor-pointer',
              isActive ? 'text-[#FFCC00]' : 'text-muted-foreground/50 hover:text-muted-foreground'
            )}
          >
            {/* Active indicator line at top */}
            {isActive && (
              <span className="absolute top-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-[#FFCC00]" />
            )}

            <div className="relative">
              <Icon
                className={cn(
                  'transition-all',
                  isActive ? 'size-5.5 stroke-[2.2]' : 'size-5 stroke-[1.8]'
                )}
              />
              {/* Pending badge on orders tab */}
              {item.id === 'orders' && pendingOrdersCount > 0 && (
                <span className="absolute -top-1 -right-1.5 flex size-4 items-center justify-center rounded-full bg-[#FFCC00] text-[9px] font-extrabold text-black tabular-nums leading-none">
                  {pendingOrdersCount > 9 ? '9+' : pendingOrdersCount}
                </span>
              )}
              {/* Live dot on playing tab */}
              {item.id === 'playing' && nowPlayingTitle && (
                <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-[#FFCC00] animate-pulse" />
              )}
            </div>

            <span className={cn('text-[10px] font-semibold', isActive ? 'opacity-100' : 'opacity-60')}>
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
