'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { REJECTION_REASONS } from '../mockData'
import type { DJOrder } from '../types'
import { cn } from '@/lib/utils'

interface RejectDialogProps {
  order: DJOrder | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirmReject: (orderId: string, reason: string) => void
}

/**
 * Диалог выбора причины отклонения трека для DJ.
 * Обеспечивает быстрый выбор из популярных причин или ввод своей.
 */
export function RejectDialog({
  order,
  open,
  onOpenChange,
  onConfirmReject,
}: RejectDialogProps) {
  const [selectedReason, setSelectedReason] = useState<string>(REJECTION_REASONS[0])

  if (!order) return null

  const handleConfirm = () => {
    onConfirmReject(order.id, selectedReason)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border bg-card text-card-foreground p-5 rounded-2xl">
        <DialogHeader className="gap-1.5 text-left">
          <DialogTitle className="text-base sm:text-lg font-bold">
            Отклонить заявку #{order.orderNumber}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {order.track.title} — {order.track.artist} ({order.table}).
            Деньги гостя будут немедленно разблокированы на карте.
          </DialogDescription>
        </DialogHeader>

        {/* Список быстрых причин */}
        <div className="flex flex-col gap-1.5 py-2">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Причина отклонения:
          </span>
          <div className="flex flex-col gap-1.5">
            {REJECTION_REASONS.map((reason) => {
              const isSelected = selectedReason === reason
              return (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setSelectedReason(reason)}
                  className={cn(
                    'flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-medium text-left transition-colors cursor-pointer',
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary font-semibold'
                      : 'border-border/60 hover:bg-muted/50 text-foreground'
                  )}
                >
                  <span>{reason}</span>
                  {isSelected && <span className="size-1.5 rounded-full bg-primary" />}
                </button>
              )
            })}
          </div>
        </div>

        <DialogFooter className="flex flex-row items-center justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs cursor-pointer"
          >
            Отмена
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleConfirm}
            className="text-xs font-semibold cursor-pointer"
          >
            Отклонить и вернуть деньги
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
