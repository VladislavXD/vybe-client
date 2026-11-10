import React from 'react'
import { cn } from '@/lib/utils'

interface AnimatedCheckmarkProps {
  color?: string
  className?: string
}

/**
 * Анимированная SVG-галочка с прорисовкой внешнего контура круга
 */
export const AnimatedCheckmark: React.FC<AnimatedCheckmarkProps> = ({
  color = '#5FD39A',
  className,
}) => {
  return (
    <svg
      className={cn('relative block size-full', className)}
      viewBox="0 0 88 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Рисующийся по часовой стрелке внешний круг */}
      <circle
        cx="44"
        cy="44"
        r="41"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="258"
        strokeDashoffset="258"
        transform="rotate(-90 44 44)"
        className="animate-draw-circle"
      />

      {/* Рисующаяся галочка успеха */}
      <path
        d="M28 45l11 11 21-23"
        fill="none"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="52"
        strokeDashoffset="52"
        className="animate-draw-check"
      />
    </svg>
  )
}
