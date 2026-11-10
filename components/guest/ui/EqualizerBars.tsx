import React from 'react'
import { cn } from '@/lib/utils'

interface EqualizerBarsProps {
  color?: string
  className?: string
}

/**
 * 3 анимированных столбика эквалайзера с поочередной фазой пульсации
 */
export const EqualizerBars: React.FC<EqualizerBarsProps> = ({
  color = '#EBC6A0',
  className,
}) => {
  return (
    <span
      aria-hidden="true"
      className={cn('inline-flex items-end gap-[2px] h-3 shrink-0', className)}
    >
      <span
        className="animate-eq-1 w-[3px] h-3 rounded-[2px] origin-bottom"
        style={{ background: color }}
      />
      <span
        className="animate-eq-2 w-[3px] h-3 rounded-[2px] origin-bottom"
        style={{ background: color }}
      />
      <span
        className="animate-eq-3 w-[3px] h-3 rounded-[2px] origin-bottom"
        style={{ background: color }}
      />
    </span>
  )
}
