import React from 'react'
import { cn } from '@/lib/utils'
import { AmbientOrbs } from './AmbientOrbs'
import { GrainOverlay } from './GrainOverlay'

interface GuestBackgroundProps {
  glowColor?: string
  hideDriftingOrbs?: boolean
  className?: string
  children?: React.ReactNode
}

/**
 * Оболочка фона гостевого интерфейса с эффектами свечения и зернистости
 */
export const GuestBackground: React.FC<GuestBackgroundProps> = ({
  glowColor,
  hideDriftingOrbs = false,
  className,
  children,
}) => {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      <AmbientOrbs glowColor={glowColor} hideDriftingOrbs={hideDriftingOrbs} />
      <GrainOverlay />
      {children}
    </div>
  )
}
