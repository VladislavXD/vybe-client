import React from 'react'
import { cn } from '@/lib/utils'

interface FloatingBadgeProps {
  title: string
  coverColor: string
  position: 'top-left' | 'bottom-right'
  className?: string
}

/**
 * Парящий интерактивный бейдж трека вокруг винила с анимацией floaty
 */
export const FloatingBadge: React.FC<FloatingBadgeProps> = ({
  title,
  coverColor,
  position,
  className,
}) => {
  const isTopLeft = position === 'top-left'

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute z-10 animate-fade-up',
        isTopLeft
          ? '-top-2 left-0 min-[375px]:-left-2 sm:-left-3 [animation-delay:0.9s]'
          : '-bottom-1 right-0 min-[375px]:-right-2 sm:-right-2.5 [animation-delay:1.1s]',
        className
      )}
    >
      <div
        className={cn(
          'flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/12 bg-white/8 py-1 pr-2.5 pl-1 sm:py-1.5 sm:pr-3.5 sm:pl-1.5 text-xs sm:text-[13px] font-semibold text-[#F2EFE9] backdrop-blur-md shadow-lg',
          isTopLeft ? 'animate-floaty' : 'animate-floaty-delayed'
        )}
      >
        <span
          className="size-5 sm:size-6 rounded-md shrink-0 shadow-sm"
          style={{ background: coverColor }}
        />
        <span className="truncate max-w-[120px] sm:max-w-none">{title}</span>
      </div>
    </div>
  )
}
