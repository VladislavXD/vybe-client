'use client'

import React from 'react'
import { Radio, Music2, Bell, BellOff, Volume2, Shield } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '../../ui/ThemeToggle'
import { cn } from '@/lib/utils'

interface DJHeaderProps {
  venueName?: string
  djName?: string
  isAcceptingOrders: boolean
  onToggleAccepting: () => void
  soundEnabled: boolean
  onToggleSound: () => void
  pendingCount: number
  className?: string
}

/**
 * Верхняя навигационная шапка DJ Дашбоарда.
 * Содержит статус заведения, тумблер приёма заявок, звуковые уведомления
 * и отдельный переключатель темы (на базе @wrksz/themes).
 */
export function DJHeader({
  venueName = 'Neon Harbor Club',
  djName = 'DJ Pulse',
  isAcceptingOrders,
  onToggleAccepting,
  soundEnabled,
  onToggleSound,
  pendingCount,
  className,
}: DJHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-4 sm:px-6 backdrop-blur-md transition-colors',
        className
      )}
    >
      {/* ЛЕВАЯ ЧАСТЬ: Логотип TrackUp DJ и статус заведения */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs shrink-0">
          <Music2 className="size-5 stroke-[2.2]" />
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-heading text-sm sm:text-base font-bold tracking-tight text-foreground truncate">
              {venueName}
            </span>
            <Badge
              variant="outline"
              className="hidden sm:inline-flex h-5 px-1.5 text-[10px] font-semibold border-border text-muted-foreground"
            >
              DJ Studio
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className={cn(
                'size-1.5 rounded-full shrink-0',
                isAcceptingOrders ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground/60'
              )}
            />
            <span className="truncate">
              {isAcceptingOrders ? 'Приём заявок включен' : 'Приём на паузе'} · {djName}
            </span>
          </div>
        </div>
      </div>

      {/* ПРАВАЯ ЧАСТЬ: Тумблер приёма, звук, тема оформления, профиль */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Кнопка переключения приёма заявок */}
        <Button
          type="button"
          variant={isAcceptingOrders ? 'outline' : 'secondary'}
          size="sm"
          onClick={onToggleAccepting}
          className={cn(
            'h-9 px-2.5 sm:px-3 text-xs font-semibold gap-1.5 transition-colors cursor-pointer',
            isAcceptingOrders
              ? 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10'
              : 'text-muted-foreground hover:text-foreground'
          )}
          title={isAcceptingOrders ? 'Поставить приём на паузу' : 'Возобновить приём заявок'}
        >
          <Radio
            className={cn(
              'size-3.5',
              isAcceptingOrders ? 'text-emerald-500' : 'text-muted-foreground'
            )}
          />
          <span className="hidden sm:inline">
            {isAcceptingOrders ? 'Приём открыт' : 'На паузе'}
          </span>
        </Button>

        {/* Тумблер звукового оповещения о новых заказах */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onToggleSound}
          className="size-9 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
          title={soundEnabled ? 'Звук новых заявок включен' : 'Звук новых заявок выключен'}
          aria-label="Переключить звук"
        >
          {soundEnabled ? (
            <Bell className="size-4 text-primary" />
          ) : (
            <BellOff className="size-4 text-muted-foreground/60" />
          )}
        </Button>

        {/* ОТДЕЛЬНЫЙ КОМПОНЕНТ ПЕРЕКЛЮЧЕНИЯ ТЕМЫ НА БАЗЕ @wrksz/themes */}
        <ThemeToggle />

        {/* Аватар диджея */}
        <div className="hidden sm:flex size-9 items-center justify-center rounded-lg border border-border bg-muted/60 text-xs font-bold text-foreground">
          DJ
        </div>
      </div>
    </header>
  )
}
