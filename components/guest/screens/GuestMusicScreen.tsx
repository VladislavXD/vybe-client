'use client'

import React, { useState } from 'react'
import { ArrowLeft, Search, X, Music, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { GuestBackground } from '../background/GuestBackground'
import { EqualizerBars } from '../ui/EqualizerBars'
import { ManualTrackDrawer } from '../ui/ManualTrackDrawer'
import type { GuestMusicScreenProps, TrackItem, ManualTrackFormData } from '../types'

const GENRE_FILTERS = [
  'Все',
  'House',
  'Deep Tech',
  'Hip-Hop',
  'Indie Dance',
  'R&B',
  'Synthwave',
]

/**
 * Экран каталога музыки и поиска треков (Экран 1: Поиск трека).
 * Полностью адаптивен под любые экраны: от 320px до десктопа.
 */
export const GuestMusicScreen: React.FC<GuestMusicScreenProps> = ({
  venueName = 'Название заведения',
  tableNumber = 5,
  onBack,
  onProceedToPayment,
  onManualTrackSubmit,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('Все')
  const [isManualDrawerOpen, setIsManualDrawerOpen] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState<TrackItem | null>(null)

  const handleManualSubmit = (data: ManualTrackFormData) => {
    const trackItem: TrackItem = {
      title: data.title,
      artist: data.artist,
      duration: 'По сету',
      coverColor: '#5B4BA8',
    }
    setSelectedTrack(trackItem)
    if (onManualTrackSubmit) {
      onManualTrackSubmit(data)
    }
  }

  const handleProceed = () => {
    if (selectedTrack && onProceedToPayment) {
      onProceedToPayment(selectedTrack)
    }
  }

  return (
    <div
      className={cn(
        'relative w-full min-h-[100dvh] sm:min-h-0 sm:h-full flex flex-col justify-between overflow-y-auto overflow-x-hidden scrollbar-none',
        'bg-[#0D0C10] text-[#F2EFE9] font-["Manrope",sans-serif]',
        className
      )}
    >
      {/* 1. Атмосферный фон (парящие сферы + зернистый шум) на всю ширину экрана */}
      <GuestBackground />

      {/* 2. Адаптивный центрированный контент */}
      <div className="relative z-10 mx-auto flex w-full max-w-[480px] flex-1 flex-col justify-between p-4 min-[390px]:p-5 sm:p-6 md:p-7 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
        {/* Шапка: кнопка назад, статус стола и язык */}
        <header className="animate-fade-down flex items-center justify-between gap-2.5 pt-0.5 sm:pt-1 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Назад к экрану грамофона"
              className="flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-full bg-white/8 border border-white/10 text-[#F2EFE9] hover:bg-white/15 transition-colors cursor-pointer"
            >
              <ArrowLeft className="size-4" />
            </button>
          )}

          <div className="flex flex-col min-w-0">
            <span className="truncate font-['Bricolage_Grotesque',sans-serif] text-sm sm:text-base font-bold tracking-tight">
              {venueName}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-[#A9A5B1]">
              <span className="size-1.5 rounded-full bg-[#5FD39A] shrink-0" />
              <span className="truncate">Принимает заявки · Стол {tableNumber}</span>
            </div>
          </div>
        </div>

        {/* Языковой переключатель */}
        <Badge
          variant="outline"
          className="rounded-full bg-white/8 border-white/12 px-2.5 py-0.5 sm:py-1 text-xs font-semibold text-[#F2EFE9] shrink-0 cursor-pointer hover:bg-white/12 transition-colors"
        >
          RU
        </Badge>
      </header>

      {/* 3. Основная контентная область */}
      <main className="relative z-10 flex flex-1 flex-col gap-3 sm:gap-4 py-2 sm:py-3 min-h-0">
        {/* Строка поиска трека */}
        <div className="relative w-full shrink-0">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#A9A5B1]"
          />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Название трека или артист..."
            className="h-10 sm:h-11 w-full rounded-xl bg-[#141415] border-white/10 pl-10 pr-9 text-xs sm:text-sm text-[#F2EFE9] placeholder:text-[#A9A5B1]/50 focus-visible:border-[#EBC6A0] focus-visible:ring-1 focus-visible:ring-[#EBC6A0]/40 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              aria-label="Очистить поиск"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A9A5B1] hover:text-white p-1 cursor-pointer"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Горизонтальные чипы категорий/жанров */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1 shrink-0">
          {GENRE_FILTERS.map((genre) => {
            const isActive = selectedGenre === genre
            return (
              <button
                key={genre}
                type="button"
                onClick={() => setSelectedGenre(genre)}
                className={cn(
                  'shrink-0 rounded-full px-2.5 sm:px-3 py-1 text-xs font-medium transition-all cursor-pointer select-none',
                  isActive
                    ? 'bg-[#EBC6A0] text-[#121116] font-semibold shadow-sm'
                    : 'bg-white/6 text-[#A9A5B1] border border-white/8 hover:text-white hover:bg-white/10'
                )}
              >
                {genre}
              </button>
            )
          })}
        </div>

        {/* Выбранный трек (если указан вручную или выбран) */}
        {selectedTrack && (
          <div className="animate-fade-up rounded-xl bg-white/8 border border-[#EBC6A0]/40 p-2.5 sm:p-3 flex items-center justify-between gap-3 shadow-lg shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="size-9 sm:size-10 rounded-lg shrink-0 flex items-center justify-center text-white"
                style={{ background: selectedTrack.coverColor || '#5B4BA8' }}
              >
                <Music className="size-4 sm:size-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="truncate text-xs sm:text-sm font-semibold text-[#F2EFE9]">
                  {selectedTrack.title}
                </span>
                <span className="truncate text-[11px] sm:text-xs text-[#A9A5B1]">
                  {selectedTrack.artist} {selectedTrack.duration && `· ${selectedTrack.duration}`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Badge className="bg-[#EBC6A0] text-[#121116] font-bold text-[11px] sm:text-xs hover:bg-[#EBC6A0]">
                5 000 сум
              </Badge>
              <button
                type="button"
                onClick={() => setSelectedTrack(null)}
                aria-label="Удалить выбор"
                className="text-[#A9A5B1] hover:text-white p-1 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        )}

        {/* 
          Плейсхолдер каталога музыки.
          Поскольку музыки в списке пока нет, оформлен стильный макет ожидания и поиска.
        */}
        <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-white/8 bg-[#141415]/60 p-4 sm:p-6 text-center backdrop-blur-sm my-auto">
          <div className="relative mb-2.5 sm:mb-3 flex size-12 sm:size-14 items-center justify-center rounded-2xl bg-white/8 border border-white/10 text-[#EBC6A0]">
            <Music className="size-6 sm:size-7 stroke-[1.8]" />
            <div className="absolute -top-1 -right-1 size-2.5 sm:size-3 rounded-full bg-[#5FD39A] ring-2 ring-[#141415]" />
          </div>

          <h2 className="font-['Bricolage_Grotesque',sans-serif] text-base sm:text-lg font-bold text-[#F2EFE9] tracking-tight mb-1">
            Каталог треков
          </h2>
          <p className="text-xs sm:text-[13px] leading-relaxed text-[#A9A5B1] max-w-[280px]">
            Введите название трека в строке поиска выше или укажите трек вручную, если его нет в списке
          </p>

          <div className="mt-3 sm:mt-4 flex items-center gap-2">
            <EqualizerBars color="#EBC6A0" />
            <span className="text-xs text-[#EBC6A0] font-medium">Диджей готов принять заявку</span>
          </div>
        </div>

        {/* 
          Кнопка вызова Drawer ручного ввода трека:
          "Нет в списке? Указать название вручную"
        */}
        <div className="pt-0.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsManualDrawerOpen(true)}
            className="group inline-flex items-center gap-1.5 py-1 text-left text-xs min-[360px]:text-[13px] sm:text-sm font-semibold text-[#F2EFE9] underline underline-offset-4 decoration-white/30 hover:decoration-[#EBC6A0] hover:text-[#EBC6A0] transition-all cursor-pointer"
          >
            <span className="leading-snug">Нет в списке? Указать название вручную</span>
            <ArrowUpRight className="size-3.5 sm:size-4 shrink-0 text-[#EBC6A0] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </main>

      {/* 4. Нижняя панель действий (если трек выбран или ручной ввод) */}
      <footer className="pt-2 pb-1 sm:pb-3 shrink-0">
        {selectedTrack ? (
          <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#141415] border border-white/10 animate-fade-up">
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] text-[#A9A5B1]">Выбран трек:</span>
              <span className="truncate text-xs sm:text-sm font-semibold text-[#F2EFE9]">
                {selectedTrack.title}
              </span>
            </div>
            <Button
              type="button"
              onClick={handleProceed}
              className="h-10 sm:h-11 px-3.5 sm:px-4 rounded-xl bg-[#F2EFE9] text-[#0B0B0C] font-bold text-xs sm:text-sm hover:bg-white active:scale-[0.985] transition-all cursor-pointer border-0 shrink-0"
            >
              Далее · 5 000 сум
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            onClick={() => setIsManualDrawerOpen(true)}
            variant="outline"
            className="h-10 sm:h-12 w-full rounded-xl border border-white/15 bg-white/5 text-[#F2EFE9] font-semibold text-xs sm:text-sm hover:bg-white/10 active:scale-[0.985] transition-all cursor-pointer"
          >
            Указать трек вручную
          </Button>
        )}
      </footer>
      </div>

      {/* Выдвижной Drawer ручного ввода */}
      <ManualTrackDrawer
        open={isManualDrawerOpen}
        onOpenChange={setIsManualDrawerOpen}
        onSubmit={handleManualSubmit}
      />
    </div>
  )
}

export default GuestMusicScreen