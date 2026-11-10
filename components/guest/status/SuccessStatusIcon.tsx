import React from 'react'
import { cn } from '@/lib/utils'
import { AnimatedCheckmark } from './AnimatedCheckmark'
import { RippleRings } from './RippleRings'
import { ConfettiBurst } from './ConfettiBurst'

interface SuccessStatusIconProps {
  color?: string
  className?: string
}

/**
 * Составная иконка успеха: круговые волны + рисующаяся галочка + взрыв конфетти
 */
export const SuccessStatusIcon: React.FC<SuccessStatusIconProps> = ({
  color = '#5FD39A',
  className,
}) => {
  return (
    <div
      role="status"
      aria-label="Заявка успешно принята"
      className={cn('relative size-[88px] shrink-0 select-none', className)}
    >
      {/* 1. Расходящиеся волны */}
      <RippleRings variant="ripple" color={color} />

      {/* 2. SVG круг и галочка */}
      <AnimatedCheckmark color={color} />

      {/* 3. Взрыв конфетти */}
      <ConfettiBurst />
    </div>
  )
}
