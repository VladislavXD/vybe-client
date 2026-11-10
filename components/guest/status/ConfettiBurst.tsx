import React from 'react'
import { GUEST_TOKENS } from '../tokens'

/**
 * 14 разноцветных частичек конфетти, разлетающихся во все стороны веером при подтверждении заказа
 */
export const ConfettiBurst: React.FC = () => {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {GUEST_TOKENS.confettiParticles.map((particle, idx) => (
        <span
          key={idx}
          className="absolute top-1/2 left-1/2 size-0"
          style={{
            transform: `rotate(${particle.angle}deg)`,
          }}
        >
          {particle.type === 'pill' ? (
            <span
              className="absolute -top-[5px] -left-[3px] h-[11px] w-[7px] rounded-[2px]"
              style={{
                background: particle.color,
                animation: particle.anim,
              }}
            />
          ) : (
            <span
              className="absolute -top-[4px] -left-[3px] size-[8px] rounded-full"
              style={{
                background: particle.color,
                animation: particle.anim,
              }}
            />
          )}
        </span>
      ))}
    </div>
  )
}
