import React from 'react'
import { cn } from '@/lib/utils'

interface VinylPulseRingProps {
  className?: string
}

/**
 * Пульсирующая внешняя световая волна вокруг винилового диска
 */
export const VinylPulseRing: React.FC<VinylPulseRingProps> = ({ className }) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-pulse-ring pointer-events-none absolute inset-0 rounded-full border border-[rgba(235,198,160,0.4)]',
        className
      )}
    />
  )
}
