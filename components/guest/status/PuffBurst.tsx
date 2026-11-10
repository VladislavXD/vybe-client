import React from 'react'
import { GUEST_TOKENS } from '../tokens'

/**
 * 10 дымных частичек, вырывающихся из крестика при покачивании и отказе
 */
export const PuffBurst: React.FC = () => {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {GUEST_TOKENS.puffParticles.map((particle, idx) => (
        <span
          key={idx}
          className="absolute top-1/2 left-1/2 size-0"
          style={{
            transform: `rotate(${particle.angle}deg)`,
          }}
        >
          <span
            className="absolute -top-[3px] -left-[3px] size-[6px] rounded-full"
            style={{
              background: particle.color,
              animation: particle.anim,
            }}
          />
        </span>
      ))}
    </div>
  )
}
