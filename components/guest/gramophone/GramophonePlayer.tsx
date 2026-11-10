import React from 'react'
import { cn } from '@/lib/utils'
import { GramophoneDisc } from './GramophoneDisc'
import { Tonearm } from './Tonearm'
import { VinylPulseRing } from './VinylPulseRing'
import { FloatingBadge } from './FloatingBadge'

interface GramophonePlayerProps {
  isPlaying?: boolean
  showBadges?: boolean
  showTonearm?: boolean
  showPulseRing?: boolean
  badge1Title?: string
  badge1Color?: string
  badge2Title?: string
  badge2Color?: string
  className?: string
}

/**
 * Главный составной компонент винилового грамофона.
 * Полностью адаптивен от 320px до десктопа (плавно масштабируется от 200px до 290px).
 */
export const GramophonePlayer: React.FC<GramophonePlayerProps> = ({
  isPlaying = true,
  showBadges = true,
  showTonearm = true,
  showPulseRing = true,
  badge1Title = 'Late Signal',
  badge1Color = '#5A3B46',
  badge2Title = 'Late Night Static',
  badge2Color = '#2F4A45',
  className,
}) => {
  return (
    <div
      className={cn(
        'relative my-auto flex w-full items-center justify-center py-2 sm:py-4 md:py-6 select-none',
        className
      )}
    >
      {/* 
        Центральный адаптивный контейнер под проигрыватель:
        320px: 190px x 190px
        360px: 225px x 225px
        390px: 250px x 250px
        sm (640px+): 272px x 272px
        md (768px+): 290px x 290px
      */}
      <div className="relative size-[190px] min-[360px]:size-[225px] min-[390px]:size-[250px] sm:size-[272px] md:size-[290px]">
        {/* Анимация появления пластинки */}
        <div className="animate-vinyl-in relative size-full">
          {/* Пульсирующая световая волна */}
          {showPulseRing && <VinylPulseRing />}

          {/* Вращающаяся пластинка с канавками и бликами */}
          <GramophoneDisc isPlaying={isPlaying} />

          {/* Опускающийся тонарм грамофона */}
          {showTonearm && <Tonearm />}
        </div>

        {/* Парящие бейджи треков */}
        {showBadges && (
          <>
            <FloatingBadge
              title={badge1Title}
              coverColor={badge1Color}
              position="top-left"
            />
            <FloatingBadge
              title={badge2Title}
              coverColor={badge2Color}
              position="bottom-right"
            />
          </>
        )}
      </div>
    </div>
  )
}
