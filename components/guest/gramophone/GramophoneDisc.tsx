import React from 'react'
import { cn } from '@/lib/utils'

interface GramophoneDiscProps {
  isPlaying?: boolean
  className?: string
}

const GROOVE_RADII = [106, 98, 90, 82, 74, 66, 58]

/**
 * Виниловая пластинка с концентрическими канавками звука, градиентным яблоком и бликами
 */
export const GramophoneDisc: React.FC<GramophoneDiscProps> = ({
  isPlaying = true,
  className,
}) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative size-full rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.6)] sm:shadow-[0_30px_60px_rgba(0,0,0,0.5)]',
        isPlaying && 'animate-spin-slow',
        className
      )}
    >
      <svg
        className="block size-full"
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="disc-label-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#EBC6A0" />
            <stop offset="100%" stopColor="#B5646F" />
          </linearGradient>
        </defs>

        {/* Тело пластинки */}
        <circle
          cx="120"
          cy="120"
          r="118"
          fill="#121116"
          stroke="#2E2C35"
          strokeWidth="2"
        />

        {/* Звуковые дорожки */}
        {GROOVE_RADII.map((radius, index) => (
          <circle
            key={radius}
            cx="120"
            cy="120"
            r={radius}
            fill="none"
            stroke={index % 2 === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.07)'}
            strokeWidth="1"
          />
        ))}

        {/* Центральное градиентное "яблоко" */}
        <circle
          cx="120"
          cy="120"
          r="44"
          fill="url(#disc-label-grad)"
          stroke="rgba(0,0,0,0.25)"
          strokeWidth="1.5"
        />

        {/* Декоративная отметка */}
        <circle cx="120" cy="92" r="4.5" fill="rgba(13,12,16,0.45)" />

        {/* Шпиндель */}
        <circle cx="120" cy="120" r="5" fill="#0D0C10" />
      </svg>

      {/* Акустический световой блик "бабочка" (шелковистый отблеск) */}
      <svg
        className="pointer-events-none absolute inset-0 size-full"
        viewBox="0 0 240 240"
        fill="none"
      >
        <path
          d="M120 120 L80.3 11 A116 116 0 0 1 159.7 11 Z"
          fill="rgba(255,255,255,0.05)"
        />
        <path
          d="M120 120 L159.7 229 A116 116 0 0 1 80.3 229 Z"
          fill="rgba(255,255,255,0.05)"
        />
      </svg>
    </div>
  )
}
