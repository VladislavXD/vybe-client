'use client'

import React from 'react'
import { ThemeToggle } from '../../ui/ThemeToggle'
import type { DJShiftStats } from '../types'
import { DJ_COLORS } from '../constants'
import { formatCurrency } from '@/src/utils/formatCurrency'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

interface SettingsScreenProps {
  stats: DJShiftStats
  isAcceptingOrders: boolean
  onToggleAccepting: () => void
  venueName?: string
}

interface SettingsRowProps {
  label: string
  description?: string
  children: React.ReactNode
  isFirst?: boolean
  isLast?: boolean
}

function SettingsRow({ label, description, children, isLast }: SettingsRowProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 px-4 py-3.5',
        !isLast && 'border-b'
      )}
      style={{
        borderColor: DJ_COLORS.border,
      }}
    >
      <div className="flex flex-col min-w-0">
        <span className="text-[14px] font-medium" style={{ color: DJ_COLORS.textPrimary }}>
          {label}
        </span>
        {description && (
          <span className="text-[11px] mt-0.5" style={{ color: DJ_COLORS.textMuted }}>
            {description}
          </span>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

interface SettingsSectionProps {
  title: string
  children: React.ReactNode
}

function SettingsSection({ title, children }: SettingsSectionProps) {
  return (
    <div>
      <p
        className="mb-2 px-1 text-[11px] font-bold uppercase tracking-[0.14em]"
        style={{ color: DJ_COLORS.textMuted }}
      >
        {title}
      </p>
      <div
        className="flex flex-col rounded-2xl overflow-hidden"
        style={{ backgroundColor: DJ_COLORS.surface }}
      >
        {children}
      </div>
    </div>
  )
}

/**
 * Экран настроек — нативный grouped settings list с использованием shadcn/ui Switch.
 */
export function SettingsScreen({
  stats,
  isAcceptingOrders,
  onToggleAccepting,
  venueName,
}: SettingsScreenProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Shift stats */}
      <SettingsSection title="Смена">
        <SettingsRow label="Начало смены" isFirst>
          <span className="text-[14px] font-semibold tabular-nums" style={{ color: DJ_COLORS.textSecondary }}>
            {stats.sessionStartTime}
          </span>
        </SettingsRow>
        <SettingsRow label="Выручка">
          <span
            suppressHydrationWarning
            className="text-[14px] font-bold tabular-nums"
            style={{ color: DJ_COLORS.accent }}
          >
            {formatCurrency(stats.totalRevenue)}
          </span>
        </SettingsRow>
        <SettingsRow label="Выполнено заказов">
          <span className="text-[14px] font-semibold tabular-nums" style={{ color: DJ_COLORS.textSecondary }}>
            {stats.completedCount} из {stats.totalOrders}
          </span>
        </SettingsRow>
        <SettingsRow label="В очереди" isLast>
          <span className="text-[14px] font-semibold tabular-nums" style={{ color: DJ_COLORS.textSecondary }}>
            {stats.queueCount}
          </span>
        </SettingsRow>
      </SettingsSection>

      {/* Controls — shadcn Switch */}
      <SettingsSection title="Управление">
        <SettingsRow
          label="Принимать заказы"
          description={isAcceptingOrders ? 'Гости могут отправлять треки' : 'Приём приостановлен'}
          isFirst
          isLast
        >
          <Switch
            checked={isAcceptingOrders}
            onCheckedChange={() => onToggleAccepting()}
            aria-label="Принимать заказы"
            className="data-checked:bg-[#EBC6A0]"
          />
        </SettingsRow>
      </SettingsSection>

      {/* Appearance */}
      <SettingsSection title="Оформление">
        <SettingsRow label="Тема" isFirst isLast>
          <ThemeToggle variant="segmented" />
        </SettingsRow>
      </SettingsSection>

      {/* Venue info */}
      {venueName && (
        <SettingsSection title="Заведение">
          <SettingsRow label="Название" isFirst isLast>
            <span className="text-[14px]" style={{ color: DJ_COLORS.textSecondary }}>
              {venueName}
            </span>
          </SettingsRow>
        </SettingsSection>
      )}
    </div>
  )
}
