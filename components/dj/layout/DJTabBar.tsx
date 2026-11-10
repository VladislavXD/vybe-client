'use client'

import React from 'react'
import { ListMusic, Disc3, AlignJustify, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DJTab } from '../types'
import { DJ_COLORS } from '../constants'

interface DJTabBarProps {
  activeTab: DJTab
  onSelect: (tab: DJTab) => void
  pendingCount?: number
  isPlaying?: boolean
}

const TABS: { id: DJTab; label: string; Icon: React.ElementType }[] = [
  { id: 'orders', label: 'Заказы', Icon: ListMusic },
  { id: 'playing', label: 'Эфир', Icon: Disc3 },
  { id: 'queue', label: 'Очередь', Icon: AlignJustify },
  { id: 'settings', label: 'Ещё', Icon: Settings },
]

/**
 * Нижний Tab Bar в стиле нативного мобильного приложения.
 * Виден только на экранах < lg.
 */
export function DJTabBar({
  activeTab,
  onSelect,
  pendingCount = 0,
  isPlaying = false,
}: DJTabBarProps) {
  return (
    <nav
      aria-label="Навигация"
      className="fixed bottom-0 inset-x-0 z-50 flex h-[60px] items-stretch border-t lg:hidden transition-colors duration-200"
      style={{
        backgroundColor: DJ_COLORS.bg,
        borderTopColor: DJ_COLORS.border,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {TABS.map(({ id, label, Icon }) => {
        const active = activeTab === id

        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            aria-label={label}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'relative flex flex-1 flex-col items-center justify-center gap-[3px]',
              'transition-colors duration-150 cursor-pointer select-none',
              '-webkit-tap-highlight-color-transparent'
            )}
          >
            {/* Accent line at top of active tab */}
            <span
              className={cn(
                'absolute top-0 left-1/2 -translate-x-1/2 h-[2px] rounded-b-full transition-all duration-200',
                active ? 'w-8 opacity-100' : 'w-0 opacity-0'
              )}
              style={{ backgroundColor: DJ_COLORS.accent }}
            />

            {/* Icon with badge */}
            <div className="relative">
              <Icon
                className="transition-all duration-150"
                style={{
                  width: active ? 22 : 20,
                  height: active ? 22 : 20,
                  color: active ? DJ_COLORS.accent : DJ_COLORS.textMuted,
                  strokeWidth: active ? 2.2 : 1.8,
                }}
              />

              {/* Pending badge (orders tab) */}
              {id === 'orders' && pendingCount > 0 && (
                <span
                  className="absolute -top-1 -right-2 flex min-w-[16px] h-4 items-center justify-center rounded-full px-1 text-[9px] font-extrabold leading-none text-black"
                  style={{ backgroundColor: DJ_COLORS.accent }}
                >
                  {pendingCount > 9 ? '9+' : pendingCount}
                </span>
              )}

              {/* Live dot (playing tab) */}
              {id === 'playing' && isPlaying && (
                <span
                  className="absolute -top-0.5 -right-0.5 size-2 rounded-full animate-pulse"
                  style={{ backgroundColor: DJ_COLORS.success }}
                />
              )}
            </div>

            {/* Label */}
            <span
              className="text-[10px] font-semibold transition-colors duration-150 leading-none"
              style={{
                color: active ? DJ_COLORS.accent : DJ_COLORS.textMuted,
              }}
            >
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
