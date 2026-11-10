import React from 'react'
import { cn } from '@/lib/utils'

interface AnimatedCrossProps {
  color?: string
  className?: string
}

/**
 * Анимированный SVG-крестик с прорисовкой диагоналей и характерным покачиванием (shake)
 */
export const AnimatedCross: React.FC<AnimatedCrossProps> = ({
  color = '#F08A7E',
  className,
}) => {
  return (
    <svg
      className={cn('animate-shake-icon relative block size-full', className)}
      viewBox="0 0 88 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Внешний круг */}
      <circle
        cx="44"
        cy="44"
        r="41"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="258"
        strokeDashoffset="0"
        transform="rotate(-90 44 44)"
        className="animate-draw-circle-c"
      />

      {/* Первая диагональная линия крестика */}
      <path
        d="M32 32L56 56"
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="36"
        strokeDashoffset="0"
        className="animate-draw-cross-1"
      />

      {/* Вторая диагональная линия крестика */}
      <path
        d="M56 32L32 56"
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="36"
        strokeDashoffset="0"
        className="animate-draw-cross-2"
      />
    </svg>
  )
}
