'use client'

import React, { useState } from 'react'
import { Smartphone, Tablet, Monitor } from 'lucide-react'
import {
  GuestInitialScreen,
  GuestMusicScreen,
  GuestSuccessScreen,
  GuestFailureScreen,
  type GuestScreenState,
  type TrackItem,
} from '@/components/guest'
import { Button } from '@/components/ui/button'

type ViewportMode = 'mobile' | 'tablet' | 'fluid'

export default function GuestOrderPage() {
  const [activeScreen, setActiveScreen] = useState<GuestScreenState>('initial')
  const [viewportMode, setViewportMode] = useState<ViewportMode>('mobile')
  const [selectedTrack, setSelectedTrack] = useState<TrackItem>({
    title: 'Late Signal',
    artist: 'Neon Harbor',
    duration: '3:42',
    coverColor: '#3B3F58',
  })

  // Динамические размеры фрейма для проверки адаптивности на десктопе
  const getContainerWidthClass = () => {
    switch (viewportMode) {
      case 'tablet':
        return 'sm:max-w-[640px]'
      case 'fluid':
        return 'sm:max-w-[1000px]'
      case 'mobile':
      default:
        return 'sm:max-w-[420px]'
    }
  }

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center bg-[#070709] px-0 py-0 sm:p-4 md:p-6 font-['Manrope',sans-serif]">
      {/* 
        Интерактивный переключатель состояний и размеров для разработки и демонстрации.
        Адаптивен от 320px (flex-wrap, компактные отступы).
      */}
      <aside
        aria-label="Панель переключения экранов и режима адаптивности"
        className="my-2 sm:mb-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 bg-[#17161D]/90 backdrop-blur-md p-1.5 sm:px-3 sm:py-2 rounded-2xl sm:rounded-full border border-white/10 shadow-xl z-50 max-w-[96vw]"
      >
        {/* Переключатели экранов */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setActiveScreen('initial')}
            className={`h-7 sm:h-8 px-2 sm:px-3 text-[11px] sm:text-xs font-semibold rounded-full transition-all cursor-pointer ${
              activeScreen === 'initial'
                ? 'bg-[#EBC6A0] text-[#121116] hover:bg-[#EBC6A0]/90 shadow-sm'
                : 'text-[#B4AFBB] hover:text-white hover:bg-white/5'
            }`}
          >
            1. Грамофон
          </Button>

          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setActiveScreen('music')}
            className={`h-7 sm:h-8 px-2 sm:px-3 text-[11px] sm:text-xs font-semibold rounded-full transition-all cursor-pointer ${
              activeScreen === 'music'
                ? 'bg-[#EBC6A0] text-[#121116] hover:bg-[#EBC6A0]/90 shadow-sm'
                : 'text-[#B4AFBB] hover:text-white hover:bg-white/5'
            }`}
          >
            2. Музыка
          </Button>

          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setActiveScreen('success')}
            className={`h-7 sm:h-8 px-2 sm:px-3 text-[11px] sm:text-xs font-semibold rounded-full transition-all cursor-pointer ${
              activeScreen === 'success'
                ? 'bg-[#5FD39A] text-[#0B0B0C] hover:bg-[#5FD39A]/90 shadow-sm'
                : 'text-[#B4AFBB] hover:text-white hover:bg-white/5'
            }`}
          >
            3. Успех
          </Button>

          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setActiveScreen('failure')}
            className={`h-7 sm:h-8 px-2 sm:px-3 text-[11px] sm:text-xs font-semibold rounded-full transition-all cursor-pointer ${
              activeScreen === 'failure'
                ? 'bg-[#F08A7E] text-[#0B0B0C] hover:bg-[#F08A7E]/90 shadow-sm'
                : 'text-[#B4AFBB] hover:text-white hover:bg-white/5'
            }`}
          >
            4. Отказ
          </Button>
        </div>

        {/* Разделитель на экранах sm+ */}
        <div className="hidden sm:block h-4 w-px bg-white/15 mx-1" />

        {/* Переключатель тестовой ширины (мобильный / планшет / широкий) */}
        <div className="hidden sm:flex items-center gap-1">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setViewportMode('mobile')}
            title="Мобильный вид (до 420px)"
            className={`size-7 sm:size-8 p-0 rounded-full transition-all cursor-pointer ${
              viewportMode === 'mobile'
                ? 'bg-white/20 text-white'
                : 'text-[#B4AFBB] hover:text-white hover:bg-white/5'
            }`}
          >
            <Smartphone className="size-3.5 sm:size-4" />
          </Button>

          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setViewportMode('tablet')}
            title="Планшет (до 640px)"
            className={`size-7 sm:size-8 p-0 rounded-full transition-all cursor-pointer ${
              viewportMode === 'tablet'
                ? 'bg-white/20 text-white'
                : 'text-[#B4AFBB] hover:text-white hover:bg-white/5'
            }`}
          >
            <Tablet className="size-3.5 sm:size-4" />
          </Button>

          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setViewportMode('fluid')}
            title="Широкий вид (Fluid)"
            className={`size-7 sm:size-8 p-0 rounded-full transition-all cursor-pointer ${
              viewportMode === 'fluid'
                ? 'bg-white/20 text-white'
                : 'text-[#B4AFBB] hover:text-white hover:bg-white/5'
            }`}
          >
            <Monitor className="size-3.5 sm:size-4" />
          </Button>
        </div>
      </aside>

      {/* 
        Мобильный адаптивный фрейм:
        На смартфонах (от 320px) занимает 100% ширины и высоты экрана.
        На планшетах и десктопах адаптируется плавно под высоту экрана без обрезания контента.
      */}
      <div
        className={`relative w-full ${getContainerWidthClass()} min-h-[100dvh] sm:min-h-[580px] sm:h-[min(880px,calc(100dvh-5.5rem))] overflow-hidden sm:rounded-[36px] sm:shadow-2xl sm:border sm:border-white/10 flex flex-col transition-all duration-300`}
      >
        {activeScreen === 'initial' && (
          <GuestInitialScreen
            venueName="Neon Harbor Club"
            tableNumber={5}
            onSelectTrack={() => setActiveScreen('music')}
          />
        )}

        {activeScreen === 'music' && (
          <GuestMusicScreen
            venueName="Neon Harbor Club"
            tableNumber={5}
            onBack={() => setActiveScreen('initial')}
            onProceedToPayment={(track) => {
              setSelectedTrack(track)
              setActiveScreen('success')
            }}
            onManualTrackSubmit={(data) => {
              setSelectedTrack({
                title: data.title,
                artist: data.artist,
                duration: 'По сету',
                coverColor: '#5B4BA8',
              })
            }}
          />
        )}

        {activeScreen === 'success' && (
          <GuestSuccessScreen
            venueName="Neon Harbor Club"
            tableNumber={5}
            track={selectedTrack}
            orderNumber="A7K2"
            responseTime="21:16"
            amountPaid={45000}
            onOrderAgain={() => setActiveScreen('music')}
            onShowReceipt={() => setActiveScreen('failure')}
          />
        )}

        {activeScreen === 'failure' && (
          <GuestFailureScreen
            venueName="Neon Harbor Club"
            tableNumber={5}
            track={selectedTrack}
            orderNumber="A7K2"
            rejectionReason="Не подходит по сету"
            amountRefunded={45000}
            onChooseAnotherTrack={() => setActiveScreen('music')}
          />
        )}
      </div>
    </div>
  )
}