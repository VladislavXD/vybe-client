import React from 'react'
import { cn } from '@/lib/utils'

interface GrainOverlayProps {
  className?: string
  opacity?: number
}

/**
 * SVG-фильтр зернистости для создания кинематографичной фактуры
 */
export const GrainOverlay: React.FC<GrainOverlayProps> = ({
  className,
  opacity = 0.09,
}) => {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 size-full mix-blend-soft-light',
        className
      )}
      style={{ opacity }}
    >
      <filter id="guest-grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves={2}
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#guest-grain)" />
    </svg>
  )
}
