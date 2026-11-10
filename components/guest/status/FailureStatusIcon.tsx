import React from 'react'
import { cn } from '@/lib/utils'
import { AnimatedCross } from './AnimatedCross'
import { RippleRings } from './RippleRings'
import { PuffBurst } from './PuffBurst'

interface FailureStatusIconProps {
  color?: string
  className?: string
}

/**
 * Составная иконка отклонения: схлопывающиеся кольца + покачивающийся крестик + частицы дымка
 */
export const FailureStatusIcon: React.FC<FailureStatusIconProps> = ({
  color = '#F08A7E',
  className,
}) => {
  return (
    <div
      role="status"
      aria-label="Заявка отклонена диджеем"
      className={cn('relative size-[88px] shrink-0 select-none', className)}
    >
      {/* 1. Схлопывающиеся кольца */}
      <RippleRings variant="sink" color={color} />

      {/* 2. SVG круг, крестик и дрожание */}
      <AnimatedCross color={color} />

      {/* 3. Разлёт дымных частиц */}
      <PuffBurst />
    </div>
  )
}
