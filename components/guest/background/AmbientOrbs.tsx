import React from 'react'
import { cn } from '@/lib/utils'

interface AmbientOrbsProps {
  glowColor?: string
  hideDriftingOrbs?: boolean
  className?: string
}

/**
 * Парящие фоновые световые сферы с органической медленной анимацией drift1, drift2, drift3
 */
export const AmbientOrbs: React.FC<AmbientOrbsProps> = ({
  glowColor,
  hideDriftingOrbs = false,
  className,
}) => {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      {!hideDriftingOrbs && (
        <>
          {/* Верхняя фиолетовая сфера */}
          <div
            className="absolute -top-[20px] -left-[80px] size-[240px] rounded-full sm:-top-[-40px] sm:-left-[110px] sm:size-[320px] blur-[60px] sm:blur-[80px] will-change-transform"
            style={{
              background: '#5B4BA8',
              opacity: 0.38,
              animation: 'drift1 18s ease-in-out infinite',
            }}
          />

          {/* Средняя розовая сфера */}
          <div
            className="absolute top-[260px] -right-[90px] size-[220px] rounded-full sm:top-[330px] sm:-right-[130px] sm:size-[300px] blur-[60px] sm:blur-[80px] will-change-transform"
            style={{
              background: '#B5646F',
              opacity: 0.26,
              animation: 'drift2 22s ease-in-out infinite',
            }}
          />

          {/* Нижняя бирюзовая сфера */}
          <div
            className="absolute -bottom-[80px] left-[10px] size-[200px] rounded-full sm:-bottom-[120px] sm:left-[20px] sm:size-[280px] blur-[60px] sm:blur-[80px] will-change-transform"
            style={{
              background: '#2F7F79',
              opacity: 0.26,
              animation: 'drift3 20s ease-in-out infinite',
            }}
          />
        </>
      )}

      {/* Опциональное центральное свечение (для экранов статуса) */}
      {glowColor && (
        <div
          className="animate-glow-in absolute top-[60px] left-1/2 size-[180px] -translate-x-1/2 rounded-full sm:top-[70px] sm:size-[200px] blur-[60px] sm:blur-[70px]"
          style={{
            background: glowColor,
          }}
        />
      )}
    </div>
  )
}
