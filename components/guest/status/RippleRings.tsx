import React from 'react'
import { cn } from '@/lib/utils'

interface RippleRingsProps {
  variant: 'ripple' | 'sink'
  color: string
  className?: string
}

/**
 * Импульсные кольца: расширяющиеся расходящиеся волны (ripple) для успеха
 * или схлопывающиеся угасающие кольца (sink) для отказа.
 */
export const RippleRings: React.FC<RippleRingsProps> = ({
  variant,
  color,
  className,
}) => {
  const isRipple = variant === 'ripple'

  return (
    <>
      {/* Первое кольцо */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 box-border rounded-full border-2 opacity-0',
          isRipple ? 'animate-ripple-1' : 'animate-sink-1',
          className
        )}
        style={{ borderColor: color }}
      />

      {/* Второе кольцо */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 box-border rounded-full border-2 opacity-0',
          isRipple ? 'animate-ripple-2' : 'animate-sink-2',
          className
        )}
        style={{ borderColor: color }}
      />
    </>
  )
}
