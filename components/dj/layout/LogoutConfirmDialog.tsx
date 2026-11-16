'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useLogout } from '@/src/hooks/auth/useAuth'

export interface LogoutConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Окно подтверждения выхода из аккаунта / студии.
 * Оформлено в строгом стиле DJ Panel с акцентными цветами и анимацией.
 */
export function LogoutConfirmDialog({ open, onOpenChange }: LogoutConfirmDialogProps) {
  const router = useRouter()
  const logoutMutation = useLogout()

  const handleConfirmLogout = async () => {
    try {
      await logoutMutation.mutateAsync()
      if (typeof window !== 'undefined') {
        document.cookie = 'trackup_session=; path=/; max-age=0; SameSite=Lax'
        document.cookie = 'trackup_role=; path=/; max-age=0; SameSite=Lax'
        window.localStorage.removeItem('trackup_selected_role')
      }
      onOpenChange(false)
      // Полная перезагрузка гарантирует сброс кук, кэша запросов и очистку памяти
      window.location.href = '/ru/auth'
    } catch (error) {
      console.error('Ошибка при выходе из аккаунта:', error)
      if (typeof window !== 'undefined') {
        document.cookie = 'trackup_session=; path=/; max-age=0; SameSite=Lax'
        document.cookie = 'trackup_role=; path=/; max-age=0; SameSite=Lax'
        window.localStorage.removeItem('trackup_selected_role')
      }
      // В любом случае очищаем и редиректим на логин
      window.location.href = '/ru/auth'
    }
  }

  return (
    <Dialog open={open} onOpenChange={logoutMutation.isPending ? () => {} : onOpenChange}>
      <DialogContent
        showCloseButton={!logoutMutation.isPending}
        className="max-w-[360px] sm:max-w-[380px] p-6 rounded-2xl border border-white/10 bg-[#121316]/95 backdrop-blur-xl text-white shadow-2xl"
      >
        <DialogHeader className="flex flex-col items-center text-center gap-3.5">
          {/* Иконка в мягком бейдже */}
          <div className="relative flex size-14 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <LogOut className="size-6 stroke-[2]" />
          </div>

          <div className="flex flex-col gap-1.5">
            <DialogTitle className="text-[18px] font-bold tracking-tight text-white">
              Выйти из студии?
            </DialogTitle>
            <DialogDescription className="text-[13px] text-white/45 leading-relaxed max-w-[280px]">
              Текущая сессия будет завершена. Вы сможете войти снова в любое время по номеру телефона или почте.
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Кнопки действий */}
        <div className="flex flex-col-reverse sm:flex-row items-center gap-2.5 mt-2 w-full">
          <button
            type="button"
            disabled={logoutMutation.isPending}
            onClick={() => onOpenChange(false)}
            className="w-full sm:flex-1 h-11 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] active:scale-[0.98] text-[13px] font-medium text-white/70 hover:text-white transition-all cursor-pointer disabled:opacity-40 select-none"
          >
            Отмена
          </button>

          <button
            type="button"
            disabled={logoutMutation.isPending}
            onClick={handleConfirmLogout}
            className="w-full sm:flex-1 h-11 rounded-xl bg-rose-500 hover:bg-rose-600 active:scale-[0.98] text-[13px] font-semibold text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-500/20 disabled:opacity-50 select-none"
          >
            {logoutMutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Выход...</span>
              </>
            ) : (
              <span>Выйти</span>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
