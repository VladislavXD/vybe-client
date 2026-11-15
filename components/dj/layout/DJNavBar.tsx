'use client'

import React, { useEffect, useState } from 'react'
import { ListMusic, Disc3, AlignJustify, Settings, LogOut, PanelLeftClose, QrCode } from 'lucide-react'
import { ThemeToggle } from '../../ui/ThemeToggle'
import { cn } from '@/lib/utils'
import type { DJTab } from '../types'
import { DJ_COLORS } from '../constants'

interface DJNavBarProps {
  activeTab: DJTab
  onSelect: (tab: DJTab) => void
  pendingCount?: number
  isPlaying?: boolean
  onClose?: () => void
  onLogout?: () => void
}

const NAV_GROUPS: {
  title?: string
  items: { id: DJTab; label: string; Icon: React.ElementType }[]
}[] = [
  {
    title: 'Музыка',
    items: [
      { id: 'orders', label: 'Заказы', Icon: ListMusic },
      { id: 'playing', label: 'Сейчас играет', Icon: Disc3 },
      { id: 'queue', label: 'Очередь', Icon: AlignJustify },
    ],
  },
  {
    title: 'Заведение',
    items: [
      { id: 'qrcodes', label: 'QR-коды и столы', Icon: QrCode },
      { id: 'settings', label: 'Настройки', Icon: Settings },
    ],
  },
]

/**
 * Левый sidebar для десктопного layout (≥ lg).
 * Иконки + метки, жёлтый accent, часы и кнопка скрытия вверху.
 */
export function DJNavBar({
  activeTab,
  onSelect,
  pendingCount = 0,
  isPlaying = false,
  onClose,
  onLogout,
}: DJNavBarProps) {
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
        })
      )
    }
    tick()
    const id = setInterval(tick, 10_000)
    return () => clearInterval(id)
  }, [])

  return (
    <aside
      className="hidden lg:flex flex-col justify-between h-full py-6 px-3 transition-colors duration-200 select-none"
      style={{
        width: 220,
        backgroundColor: DJ_COLORS.surface,
        borderRight: `1px solid ${DJ_COLORS.border}`,
      }}
    >
      {/* Top: logo / time / collapse button */}
      <div className="flex flex-col gap-8">
        <div className="px-3 flex items-center justify-between">
          <div>
            <div
              className="text-xs font-mono font-bold tabular-nums tracking-tight"
              style={{ color: DJ_COLORS.textSecondary }}
            >
              {time}
            </div>
            <div
              className="text-[17px] font-bold tracking-tight mt-0.5 flex items-center gap-2"
              style={{ color: DJ_COLORS.textPrimary }}
            >
              <div className="size-6 rounded-md bg-[#E27625] flex items-center justify-center font-bold text-white text-[12px] shadow-xs">
                T
              </div>
              TrackUp
            </div>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              title="Скрыть панель"
              aria-label="Скрыть панель"
              className="flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors cursor-pointer hover:bg-black/5 dark:hover:bg-white/10"
              style={{ color: DJ_COLORS.textMuted }}
            >
              <PanelLeftClose className="size-4" strokeWidth={1.8} />
            </button>
          )}
        </div>

        {/* Nav groups */}
        <nav className="flex flex-col gap-4">
          {NAV_GROUPS.map((group, groupIdx) => (
            <div key={groupIdx} className="flex flex-col gap-1">
              {group.title && (
                <span
                  className="px-3 text-[10px] font-bold uppercase tracking-wider mb-0.5"
                  style={{ color: DJ_COLORS.textMuted }}
                >
                  {group.title}
                </span>
              )}
              {group.items.map(({ id, label, Icon }) => {
                const active = activeTab === id
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onSelect(id)}
                    className={cn(
                      'group relative flex items-center gap-3 w-full px-3 py-2 rounded-xl text-left',
                      'transition-colors duration-150 cursor-pointer',
                      !active && 'hover:bg-black/5 dark:hover:bg-white/5'
                    )}
                    style={{
                      backgroundColor: active ? DJ_COLORS.accentMuted : 'transparent',
                      color: active ? DJ_COLORS.accent : DJ_COLORS.textSecondary,
                    }}
                  >
                    {/* Left accent bar */}
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r-full transition-all duration-150"
                      style={{
                        backgroundColor: active ? DJ_COLORS.accent : 'transparent',
                      }}
                    />

                    <div className="relative shrink-0">
                      <Icon className="size-[18px]" strokeWidth={active ? 2.2 : 1.8} />

                      {/* Badges */}
                      {id === 'orders' && pendingCount > 0 && (
                        <span
                          className="absolute -top-1.5 -right-2 flex min-w-[16px] h-4 items-center justify-center rounded-full px-1 text-[9px] font-extrabold leading-none text-black"
                          style={{ backgroundColor: DJ_COLORS.accent }}
                        >
                          {pendingCount > 9 ? '9+' : pendingCount}
                        </span>
                      )}
                      {id === 'playing' && isPlaying && (
                        <span
                          className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full animate-pulse"
                          style={{ backgroundColor: DJ_COLORS.success }}
                        />
                      )}
                    </div>

                    <span
                      className="text-sm font-semibold truncate"
                      style={{ color: active ? DJ_COLORS.accent : DJ_COLORS.textSecondary }}
                    >
                      {label}
                    </span>

                    {id === 'orders' && pendingCount > 0 && (
                      <span
                        className="ml-auto text-xs font-bold"
                        style={{ color: DJ_COLORS.accent }}
                      >
                        {pendingCount}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom: theme + logout */}
      <div className="flex flex-col gap-3 px-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium" style={{ color: DJ_COLORS.textMuted }}>
            Тема
          </span>
          <ThemeToggle />
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 transition-colors cursor-pointer w-full hover:bg-black/5 dark:hover:bg-white/5 hover:text-rose-400 group"
          style={{ color: DJ_COLORS.textMuted }}
        >
          <LogOut className="size-4 group-hover:text-rose-400 transition-colors" strokeWidth={1.8} />
          <span className="text-sm font-medium group-hover:text-rose-400 transition-colors">Выйти</span>
        </button>
      </div>
    </aside>
  )
}
