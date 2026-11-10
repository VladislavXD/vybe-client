'use client'

import React, { useState } from 'react'
import { X, ChevronDown } from 'lucide-react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import type { DJOrder } from '../types'
import { REJECTION_REASONS } from '../mockData'
import { DJ_COLORS } from '../constants'
import { cn } from '@/lib/utils'

interface RejectDrawerProps {
  order: DJOrder | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (orderId: string, reason: string) => void
}

/**
 * Нижний drawer для отклонения заказа.
 * Нативный стиль: список причин как radio-group.
 */
export function RejectDrawer({
  order,
  open,
  onOpenChange,
  onConfirm,
}: RejectDrawerProps) {
  const [selectedReason, setSelectedReason] = useState<string>('')
  const [customReason, setCustomReason] = useState('')

  const handleConfirm = () => {
    if (!order) return
    const reason = selectedReason === '__custom__' ? customReason.trim() : selectedReason
    if (!reason) return
    onConfirm(order.id, reason)
    onOpenChange(false)
    // Reset
    setSelectedReason('')
    setCustomReason('')
  }

  const handleClose = () => {
    onOpenChange(false)
    setSelectedReason('')
    setCustomReason('')
  }

  const canConfirm =
    selectedReason !== '' &&
    (selectedReason !== '__custom__' || customReason.trim().length > 0)

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        style={{ backgroundColor: DJ_COLORS.surface, border: 'none' }}
        className="mx-auto max-w-lg"
      >
        {/* Handle */}
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-black/20 dark:bg-white/20" />

        <DrawerHeader className="px-5 pt-4 pb-2">
          <DrawerTitle
            className="text-base font-bold"
            style={{ color: DJ_COLORS.textPrimary }}
          >
            Отклонить заказ
          </DrawerTitle>
          {order && (
            <DrawerDescription
              className="text-[13px] mt-1"
              style={{ color: DJ_COLORS.textSecondary }}
            >
              {order.track.title} – {order.track.artist}
            </DrawerDescription>
          )}
        </DrawerHeader>

        {/* Reasons list */}
        <div className="flex flex-col px-5 gap-2 pb-2">
          <p
            className="text-[11px] font-bold uppercase tracking-[0.14em] mb-1"
            style={{ color: DJ_COLORS.textMuted }}
          >
            Причина отклонения
          </p>
          {REJECTION_REASONS.map((reason) => {
            const active = selectedReason === reason
            return (
              <button
                key={reason}
                type="button"
                onClick={() => setSelectedReason(reason)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors cursor-pointer w-full"
                style={{
                  backgroundColor: active
                    ? DJ_COLORS.dangerMuted
                    : DJ_COLORS.surfaceElevated,
                  color: active ? DJ_COLORS.danger : DJ_COLORS.textPrimary,
                }}
              >
                {/* Radio indicator */}
                <span
                  className="flex size-4 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors"
                  style={{
                    borderColor: active ? DJ_COLORS.danger : DJ_COLORS.textMuted,
                  }}
                >
                  {active && (
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: DJ_COLORS.danger }}
                    />
                  )}
                </span>
                <span className="text-[13px] font-medium">{reason}</span>
              </button>
            )
          })}

          {/* Custom reason */}
          <button
            type="button"
            onClick={() => setSelectedReason('__custom__')}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors cursor-pointer w-full"
            style={{
              backgroundColor:
                selectedReason === '__custom__'
                  ? DJ_COLORS.dangerMuted
                  : DJ_COLORS.surfaceElevated,
              color:
                selectedReason === '__custom__'
                  ? DJ_COLORS.danger
                  : DJ_COLORS.textSecondary,
            }}
          >
            <span
              className="flex size-4 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors"
              style={{
                borderColor:
                  selectedReason === '__custom__'
                    ? DJ_COLORS.danger
                    : DJ_COLORS.textMuted,
              }}
            >
              {selectedReason === '__custom__' && (
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: DJ_COLORS.danger }}
                />
              )}
            </span>
            <span className="text-[13px] font-medium">Другая причина...</span>
          </button>

          {selectedReason === '__custom__' && (
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Укажите причину..."
              rows={2}
              className="w-full rounded-xl px-4 py-3 text-[13px] outline-none resize-none"
              style={{
                backgroundColor: DJ_COLORS.surfaceElevated,
                color: DJ_COLORS.textPrimary,
                border: `1px solid ${DJ_COLORS.border}`,
              }}
            />
          )}
        </div>

        <DrawerFooter className="px-5 pt-3 pb-6 flex flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="flex-1 h-12 rounded-xl text-[14px] font-semibold bg-transparent border-black/10 dark:border-white/10 text-muted-foreground hover:text-foreground"
          >
            Отмена
          </Button>
          <Button
            type="button"
            variant="default"
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="flex-1 h-12 rounded-xl text-[14px] font-bold bg-white text-black hover:bg-white/90 active:scale-95 shadow-xs"
          >
            <X className="size-4 mr-1.5" strokeWidth={2.5} />
            Отклонить
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
