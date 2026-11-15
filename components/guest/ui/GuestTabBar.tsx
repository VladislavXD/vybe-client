'use client'

import React from 'react'
import { Disc3, UtensilsCrossed, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export type GuestTabKey = 'music' | 'menu' | 'review'

export interface GuestTabBarProps {
  activeTab: GuestTabKey
  onTabChange: (tab: GuestTabKey) => void
  className?: string
}

interface TabOption {
  key: GuestTabKey
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const TAB_OPTIONS: TabOption[] = [
  {
    key: 'music',
    label: 'DJ Музыка',
    icon: Disc3,
    badge: 'Live',
  },
  {
    key: 'menu',
    label: 'Меню',
    icon: UtensilsCrossed,
  },
  {
    key: 'review',
    label: 'Отзывы',
    icon: Star,
  },
]

/**
 * Переиспользуемый таб-бар для гостя.
 * Позволяет переключаться между сервисами заведения: Заказ музыки у DJ, Онлайн-меню еды и бар, Отзывы и чаевые.
 * Дизайн: темный фрейм, кнопки строго белые (активная) или прозрачные (неактивные).
 */
export const GuestTabBar: React.FC<GuestTabBarProps> = ({
  activeTab,
  onTabChange,
  className,
}) => {
  return (
    <nav
      aria-label="Вкладки сервисов столика"
      className={cn(
        'w-full max-w-[440px] mx-auto p-1.5 rounded-2xl bg-[#121118]/90 backdrop-blur-xl border border-white/10 shadow-2xl flex items-center justify-between gap-1 z-30',
        className
      )}
    >
      {TAB_OPTIONS.map((tab) => {
        const isActive = activeTab === tab.key
        const Icon = tab.icon

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 h-10 sm:h-11 px-2.5 rounded-xl text-xs sm:text-[13px] transition-all cursor-pointer select-none',
              isActive
                ? 'bg-white text-[#0C0B0F] font-bold shadow-md'
                : 'bg-transparent text-white/60 hover:text-white hover:bg-white/5 font-medium'
            )}
          >
            <Icon
              className={cn(
                'size-4 shrink-0 transition-transform',
                isActive ? 'text-[#0C0B0F] scale-105' : 'text-white/60'
              )}
            />
            <span className="truncate">{tab.label}</span>

            {tab.badge && (
              <span
                className={cn(
                  'ml-0.5 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full',
                  isActive
                    ? 'bg-[#0C0B0F]/10 text-[#0C0B0F]'
                    : 'bg-emerald-500/20 text-emerald-300'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
