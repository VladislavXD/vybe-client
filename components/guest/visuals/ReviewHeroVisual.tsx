'use client'

import React from 'react'
import { Star, Heart, Sparkles, MessageSquareHeart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ReviewHeroVisualProps {
  className?: string
}

/**
 * Анимированный визуальный элемент для главной страницы отзывов и чаевых.
 * Стилизован в единой концепции с GramophonePlayer: концентрические кольца,
 * сияющая золотая звезда рейтинга и парящие чипы впечатлений.
 */
export const ReviewHeroVisual: React.FC<ReviewHeroVisualProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'relative my-auto flex w-full items-center justify-center py-2 sm:py-4 md:py-6 select-none',
        className
      )}
    >
      {/* 
        Центральный контейнер: плавно масштабируется от 190px на 320px до 290px на десктопе
      */}
      <div className="relative size-[190px] min-[360px]:size-[225px] min-[390px]:size-[250px] sm:size-[272px] md:size-[290px]">
        {/* Пульсирующие фоновые кольца (золото и шампань) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-14%] rounded-full opacity-40 blur-[28px] animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(235,198,160,0.5) 0%, rgba(225,112,85,0.18) 45%, transparent 70%)',
          }}
        />

        {/* Внешнее концентрическое кольцо */}
        <div className="absolute inset-0 rounded-full border border-[#EBC6A0]/15 shadow-[0_0_50px_rgba(235,198,160,0.12)] flex items-center justify-center">
          {/* Среднее кольцо */}
          <div className="size-[84%] rounded-full border border-white/10 bg-gradient-to-b from-[#1C1A24]/90 to-[#0F0E14]/90 p-4 shadow-2xl flex items-center justify-center relative overflow-hidden">
            {/* Текстура круговых канавок */}
            <div
              className="absolute inset-0 rounded-full opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle, transparent 30%, rgba(255,255,255,0.08) 31%, transparent 32%, transparent 45%, rgba(255,255,255,0.08) 46%, transparent 47%, transparent 60%, rgba(255,255,255,0.08) 61%, transparent 62%)',
              }}
            />

            {/* Внутренний медальон со звездой */}
            <div className="relative size-[76%] rounded-full bg-gradient-to-br from-[#2A2433] via-[#1A1624] to-[#121019] border border-[#EBC6A0]/30 shadow-[inset_0_2px_12px_rgba(255,255,255,0.1)] flex flex-col items-center justify-center">
              {/* Сияющие искорки вокруг звезды */}
              <div className="absolute top-2 right-4 text-[#EBC6A0] opacity-80 animate-pulse">
                <Sparkles className="size-3.5" />
              </div>

              {/* Звездный блок */}
              <div className="size-14 sm:size-16 rounded-2xl bg-white/[0.05] border border-white/15 flex items-center justify-center shadow-lg relative group">
                <Star
                  className="size-7 sm:size-8 fill-[#EBC6A0] text-[#EBC6A0] transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_12px_rgba(235,198,160,0.5)]"
                />
                <div className="absolute -bottom-1 -right-1 size-5 rounded-full bg-rose-500/20 border border-rose-400/40 flex items-center justify-center">
                  <Heart className="size-2.5 text-rose-400 fill-rose-400" />
                </div>
              </div>

              <span className="mt-2 text-[10px] sm:text-[11px] font-bold text-[#EBC6A0] tracking-wider uppercase font-['Bricolage_Grotesque',sans-serif]">
                Feedback & Tips
              </span>
            </div>
          </div>
        </div>

        {/* Парящий бейдж 1: Рейтинг (сверху справа) */}
        <div
          className="absolute -top-1.5 -right-2 sm:-right-4 z-20 flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-[#181622]/95 border border-white/15 shadow-xl backdrop-blur-md animate-fade-down"
        >
          <Star className="size-3.5 text-[#EBC6A0] fill-[#EBC6A0]" />
          <span className="text-[10px] sm:text-[11px] font-semibold text-white/90">
            Рейтинг 4.9 ★
          </span>
        </div>

        {/* Парящий бейдж 2: Чаевые (снизу слева) */}
        <div
          className="absolute -bottom-1.5 -left-2 sm:-left-4 z-20 flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-[#181622]/95 border border-white/15 shadow-xl backdrop-blur-md animate-fade-up-2"
        >
          <MessageSquareHeart className="size-3.5 text-rose-400" />
          <span className="text-[10px] sm:text-[11px] font-semibold text-white/90">
            Чаевые в 1 клик
          </span>
        </div>
      </div>
    </div>
  )
}
