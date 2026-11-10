'use client'

import React from 'react'
import { Wifi, BatteryMedium, Signal, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { ThemeToggle } from '../../ui/ThemeToggle'
import { DJ_COLORS } from '../constants'
import { Button } from '@/components/ui/button'

interface DJTopBarProps {
  title?: string
  subtitle?: string
  isLive?: boolean
  rightSlot?: React.ReactNode
  isSidebarOpen?: boolean
  onToggleSidebar?: () => void
}

/**
 * Верхняя полоса приложения.
 * Компактная, нативный стиль:
 * - Кнопка сворачивания/разворачивания боковой панели слева (не мешает, аккуратно рядом с заголовком)
 * - Заголовок и статус заведения
 * - Переключатель темы (всегда доступен сверху)
 * - Индикатор эфира и системные иконки
 */
export function DJTopBar({
  title = 'DJ Panel',
  subtitle,
  isLive = true,
  rightSlot,
  isSidebarOpen = true,
  onToggleSidebar,
}: DJTopBarProps) {
  return (
    <header
      className="flex h-12 shrink-0 items-center justify-between px-3 sm:px-4 lg:px-5 transition-colors duration-200"
      style={{
        backgroundColor: DJ_COLORS.bg,
        borderBottom: `1px solid ${DJ_COLORS.border}`,
      }}
    >
      {/* Левая часть: кнопка sidebar + заголовок */}
      <div className="flex items-center gap-2.5 min-w-0">
        {onToggleSidebar && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onToggleSidebar}
            title={isSidebarOpen ? 'Скрыть боковую панель' : 'Показать боковую панель'}
            aria-label={isSidebarOpen ? 'Скрыть боковую панель' : 'Показать боковую панель'}
            className="hidden lg:flex size-8 shrink-0 rounded-lg text-muted-foreground hover:text-foreground"
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="size-4" strokeWidth={1.8} />
            ) : (
              <PanelLeftOpen className="size-4" strokeWidth={1.8} />
            )}
          </Button>
        )}

        <div className="flex flex-col justify-center min-w-0">
          <span
            className="text-[15px] font-bold leading-tight tracking-tight truncate"
            style={{ color: DJ_COLORS.textPrimary }}
          >
            {title}
          </span>
          {subtitle && (
            <span
              className="text-[11px] leading-none mt-0.5 truncate"
              style={{ color: DJ_COLORS.textSecondary }}
            >
              {subtitle}
            </span>
          )}
        </div>
      </div>

      {/* Правая часть: переключатель темы + статус + системные иконки */}
      <div
        className="flex items-center gap-3 shrink-0"
        style={{ color: DJ_COLORS.textMuted }}
      >
        {/* Быстрый переключатель темы сверху */}
        <ThemeToggle />

        {/* Live indicator — зеленый статус онлайн */}
        <div className="flex items-center gap-1.5">
          <span
            className="size-1.5 rounded-full"
            style={{
              backgroundColor: isLive ? DJ_COLORS.success : DJ_COLORS.textMuted,
              ...(isLive && { animation: 'pulse 2s infinite' }),
            }}
          />
          <span
            className="hidden sm:inline text-[11px] font-medium"
            style={{ color: isLive ? DJ_COLORS.success : DJ_COLORS.textMuted }}
          >
            {isLive ? 'Онлайн' : 'Офлайн'}
          </span>
        </div>

        {rightSlot}

        {/* System icons — only on wider screens */}
        <div className="hidden sm:flex items-center gap-2">
          <Signal className="size-3.5" strokeWidth={1.8} />
          <Wifi className="size-3.5" strokeWidth={1.8} />
          <BatteryMedium className="size-4" strokeWidth={1.8} />
        </div>
      </div>
    </header>
  )
}
