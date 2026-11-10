'use client'

import React, { useState } from 'react'
import { Disc3, Sparkles } from 'lucide-react'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ManualTrackFormData } from '../types'

interface ManualTrackDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ManualTrackFormData) => void
  className?: string
}

/**
 * Выдвижной Drawer снизу для ручного указания названия трека и исполнителя.
 * Полностью адаптивен под любые экраны: от 320px до десктопа.
 */
export const ManualTrackDrawer: React.FC<ManualTrackDrawerProps> = ({
  open,
  onOpenChange,
  onSubmit,
  className,
}) => {
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [comment, setComment] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError('Пожалуйста, введите название трека')
      return
    }
    if (!artist.trim()) {
      setError('Пожалуйста, укажите исполнителя')
      return
    }

    setError(null)
    onSubmit({
      title: title.trim(),
      artist: artist.trim(),
      comment: comment.trim() || undefined,
    })

    // Сброс и закрытие
    setTitle('')
    setArtist('')
    setComment('')
    onOpenChange(false)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} showSwipeHandle>
      <DrawerContent
        className={cn(
          'w-full max-w-[480px] mx-auto rounded-t-[28px] border-t border-white/12',
          'bg-[#141415] text-[#F2EFE9] p-0 font-["Manrope",sans-serif]',
          'shadow-[0_-12px_40px_rgba(0,0,0,0.8)] outline-none',
          'max-h-[90dvh] overflow-y-auto scrollbar-none',
          className
        )}
      >
        {/* Индикатор смахивания (Swipe Handle) */}
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-white/20" />

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 sm:gap-4 p-4 min-[390px]:p-5 sm:p-6 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <DrawerHeader className="p-0 text-left gap-1.5">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 sm:size-9 items-center justify-center rounded-xl bg-white/8 border border-white/10 text-[#EBC6A0]">
                <Disc3 className="size-4 sm:size-5 animate-spin-slow" />
              </div>
              <DrawerTitle className="font-['Bricolage_Grotesque',sans-serif] text-lg sm:text-xl font-bold tracking-tight text-[#F2EFE9]">
                Указать трек вручную
              </DrawerTitle>
            </div>
            <DrawerDescription className="text-xs sm:text-[13px] leading-relaxed text-[#A9A5B1]">
              Если нужного трека нет в поиске, напишите название и артиста. Диджей найдёт его или поставит из своей фонотеки.
            </DrawerDescription>
          </DrawerHeader>

          {/* Поля ввода */}
          <div className="flex flex-col gap-3 sm:gap-3.5 pt-0.5 sm:pt-1">
            {/* Название трека */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="manual-track-title"
                className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#B4AFBB]"
              >
                Название трека <span className="text-[#EBC6A0]">*</span>
              </label>
              <Input
                id="manual-track-title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  if (error) setError(null)
                }}
                placeholder="Например, Late Signal"
                className={cn(
                  'h-10 sm:h-11 rounded-xl bg-[#1A1920] border-white/10 px-3.5 text-xs sm:text-sm text-[#F2EFE9]',
                  'placeholder:text-[#A9A5B1]/50 focus-visible:border-[#EBC6A0] focus-visible:ring-1 focus-visible:ring-[#EBC6A0]/40',
                  error && !title.trim() && 'border-[#F08A7E]'
                )}
                autoFocus
              />
            </div>

            {/* Исполнитель */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="manual-track-artist"
                className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#B4AFBB]"
              >
                Исполнитель <span className="text-[#EBC6A0]">*</span>
              </label>
              <Input
                id="manual-track-artist"
                value={artist}
                onChange={(e) => {
                  setArtist(e.target.value)
                  if (error) setError(null)
                }}
                placeholder="Например, Neon Harbor"
                className={cn(
                  'h-10 sm:h-11 rounded-xl bg-[#1A1920] border-white/10 px-3.5 text-xs sm:text-sm text-[#F2EFE9]',
                  'placeholder:text-[#A9A5B1]/50 focus-visible:border-[#EBC6A0] focus-visible:ring-1 focus-visible:ring-[#EBC6A0]/40',
                  error && !artist.trim() && 'border-[#F08A7E]'
                )}
              />
            </div>

            {/* Пожелание или ссылка */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="manual-track-comment"
                className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#B4AFBB]"
              >
                Ссылка или пожелание <span className="text-[#A9A5B1] font-normal normal-case">(опционально)</span>
              </label>
              <Input
                id="manual-track-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ссылка на YouTube / Spotify или версия (Remix)"
                className="h-10 sm:h-11 rounded-xl bg-[#1A1920] border-white/10 px-3.5 text-xs sm:text-sm text-[#F2EFE9] placeholder:text-[#A9A5B1]/50 focus-visible:border-[#EBC6A0] focus-visible:ring-1 focus-visible:ring-[#EBC6A0]/40"
              />
            </div>

            {/* Ошибка валидации */}
            {error && (
              <p className="text-xs font-medium text-[#F08A7E] animate-fade-down">
                {error}
              </p>
            )}

            {/* Подсказка по тарификации */}
            <div className="flex items-start gap-2 rounded-xl bg-white/4 border border-white/6 p-2.5 text-[11px] sm:text-xs text-[#A9A5B1]">
              <Sparkles className="size-4 shrink-0 text-[#EBC6A0] mt-0.5" />
              <span>
                Стандартная стоимость заявки — <strong className="text-[#F2EFE9]">5 000 сум</strong>. Оплата спишется только после подтверждения диджеем.
              </span>
            </div>
          </div>

          <DrawerFooter className="p-0 pt-2 flex flex-col gap-2">
            <Button
              type="submit"
              className="h-11 sm:h-12 w-full rounded-xl bg-[#F2EFE9] text-[#0B0B0C] font-bold text-xs sm:text-[15px] hover:bg-white active:scale-[0.985] transition-all cursor-pointer border-0 shadow-md"
            >
              Выбрать этот трек
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="h-9 sm:h-10 text-xs sm:text-sm font-semibold text-[#A9A5B1] hover:text-white hover:bg-white/5 cursor-pointer"
            >
              Отмена
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}
