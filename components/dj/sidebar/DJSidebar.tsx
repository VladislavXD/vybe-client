'use client'

import React, { useEffect, useState } from 'react'
import {
  ListMusic,
  BarChart2,
  Settings,
  LogOut,
  Radio,
  Sliders,
} from 'lucide-react'
import { ThemeToggle } from '../../ui/ThemeToggle'
import { cn } from '@/lib/utils'

export type DJSidebarTab = 'orders' | 'analytics' | 'settings'

interface DJSidebarProps {
  activeTab: DJSidebarTab
  onSelectTab: (tab: DJSidebarTab) => void
  pendingOrdersCount?: number
  className?: string
}

/**
 * Полноценный левый сайдбар для DJ Dashboard.
 * Минималистичный стиль (как на референсе):
 * - Индикатор текущего времени вверху
 * - Иконки разделов с желтым акцентом активного состояния
 * - Переключатель темы (@wrksz/themes) и кнопка выхода внизу
 */
export function DJSidebar({
  activeTab,
  onSelectTab,
  pendingOrdersCount = 0,
  className,
}: DJSidebarProps) {
  const [currentTime, setCurrentTime] = useState<string>('23:42')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 10000)
    return () => clearInterval(timer)
  }, [])

  const navItems: { id: DJSidebarTab; label: string; icon: React.ElementType }[] = [
    { id: 'orders', label: 'Входящие заказы', icon: ListMusic },
    { id: 'analytics', label: 'Статистика смены', icon: BarChart2 },
    { id: 'settings', label: 'Настройки диджея', icon: Settings },
  ]

  return (
    <aside
      className={cn(
        'flex flex-col items-center justify-between',
        'w-16 sm:w-20 shrink-0 select-none py-5',
        'border-r border-border/40 bg-[#0E0E11] dark:bg-[#0E0E11] text-foreground',
        'transition-colors',
        className
      )}
    >
      {/* 1. Верхний блок: Время (как на референсе) */}
      <div className="flex flex-col items-center gap-6">
        <div className="text-sm font-bold text-foreground/90 tabular-nums tracking-tight font-mono">
          {currentTime}
        </div>

        {/* 2. Основная навигация */}
        <nav className="flex flex-col items-center gap-3 w-full">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                title={item.label}
                aria-label={item.label}
                className={cn(
                  'relative group flex size-11 sm:size-12 items-center justify-center rounded-2xl transition-all cursor-pointer',
                  isActive
                    ? 'text-[#FFCC00] bg-white/[0.06]'
                    : 'text-muted-foreground/70 hover:text-foreground hover:bg-white/[0.04]'
                )}
              >
                {/* Активная полоска-индикатор слева */}
                {isActive && (
                  <span className="absolute left-0 h-6 w-1 rounded-r-full bg-[#FFCC00]" />
                )}

                <Icon className="size-5 sm:size-5.5 stroke-[2.2]" />

                {/* Бейдж для новых заказов */}
                {item.id === 'orders' && pendingOrdersCount > 0 && (
                  <span className="absolute top-2 right-2 flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FFCC00] opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-[#FFCC00]" />
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* 3. Нижний блок: Переключатель темы и кнопка выхода */}
      <div className="flex flex-col items-center gap-3">
        {/* Компонент смены темы */}
        <ThemeToggle />

        {/* Кнопка выхода */}
        <button
          type="button"
          title="Выйти из студии"
          aria-label="Выйти"
          className="flex size-11 sm:size-12 items-center justify-center rounded-2xl text-muted-foreground/70 hover:text-foreground hover:bg-white/[0.04] transition-colors cursor-pointer"
        >
          <LogOut className="size-5 stroke-[2]" />
        </button>
      </div>
    </aside>
  )
}
