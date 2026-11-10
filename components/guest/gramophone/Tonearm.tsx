import React from 'react'
import { cn } from '@/lib/utils'

interface TonearmProps {
  className?: string
}

/**
 * Металлический тонарм с иглой и поворотным шарниром.
 * Опускается на пластинку благодаря анимации armDrop.
 * Масштабируется адаптивно под любые экраны.
 */
export const Tonearm: React.FC<TonearmProps> = ({ className }) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'animate-arm-drop pointer-events-none absolute',
        '-top-[15px] -right-[24px] w-[105px] h-[149px]',
        'min-[360px]:-top-[18px] min-[360px]:-right-[28px] min-[360px]:w-[116px] min-[360px]:h-[165px]',
        'min-[390px]:-top-[20px] min-[390px]:-right-[34px] min-[390px]:w-[126px] min-[390px]:h-[180px]',
        'sm:-top-[22px] sm:-right-[40px] sm:w-[136px] sm:h-[193px]',
        'md:-top-[24px] md:-right-[44px] md:w-[145px] md:h-[206px]',
        className
      )}
      style={{
        // Процентная точка вращения шарнира (109px / 136px и 23px / 193px)
        transformOrigin: '80.15% 11.92%',
      }}
    >
      <svg
        className="block size-full overflow-visible"
        viewBox="0 0 120 170"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Базовый поворотный шарнир тонарма */}
        <circle
          cx="96"
          cy="20"
          r="14"
          fill="#2A2831"
          stroke="#4A4752"
          strokeWidth="2"
        />
        <circle cx="96" cy="20" r="5" fill="#CFC8BE" />

        {/* Металлическая изогнутая трубка */}
        <path
          d="M96 20 L96 92 L64 146"
          fill="none"
          stroke="#CFC8BE"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Головка звукоснимателя (картридж) */}
        <rect
          x="55"
          y="142"
          width="17"
          height="26"
          rx="3"
          transform="rotate(32 63 146)"
          fill="#CFC8BE"
        />
      </svg>
    </div>
  )
}
