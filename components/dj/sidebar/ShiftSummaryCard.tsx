'use client'

import React from 'react'
import { TrendingUp, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { DJShiftStats } from '../types'
import { formatCurrency } from '@/src/utils/formatCurrency'

interface ShiftSummaryCardProps {
  stats: DJShiftStats
  className?: string
}

/**
 * Минималистичный виджет статистики текущей смены DJ.
 */
export function ShiftSummaryCard({ stats, className }: ShiftSummaryCardProps) {
  return (
    <Card className={cn('border-border bg-card/60 text-card-foreground shadow-xs', className)}>
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 font-medium">
            <Clock className="size-3.5 text-muted-foreground" />
            <span>Смена с {stats.sessionStartTime}</span>
          </span>
          <span className="flex items-center gap-1 text-emerald-500 font-medium">
            <TrendingUp className="size-3" />
            <span>Активна</span>
          </span>
        </div>

        {/* Выручка смены */}
        <div className="flex flex-col">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
            Выручка за смену
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-foreground tabular-nums">
              {formatCurrency(stats.totalRevenue)}
            </span>
            <span className="text-xs font-semibold text-muted-foreground">
              UZS
            </span>
          </div>
        </div>

        {/* Счётчики выполненных и отклонённых */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/60">
          <div className="flex items-center gap-2 rounded-md bg-muted/30 p-2">
            <CheckCircle2 className="size-3.5 text-emerald-500 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-muted-foreground">Принято</span>
              <span className="text-xs font-bold text-foreground tabular-nums">
                {stats.completedCount + stats.queueCount} треков
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-md bg-muted/30 p-2">
            <XCircle className="size-3.5 text-rose-400 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-muted-foreground">Отклонено</span>
              <span className="text-xs font-bold text-foreground tabular-nums">
                1 заявка
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
