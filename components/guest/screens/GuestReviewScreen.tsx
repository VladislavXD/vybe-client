'use client'

import React, { useState } from 'react'
import {
  ArrowLeft,
  Star,
  CheckCircle2,
  Heart,
  MessageSquare,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/src/utils/formatCurrency'
import type { GuestReviewScreenProps } from '../types'

const REVIEW_TAGS = [
  'Музыка & DJ 🎧',
  'Кухня & Еда 🍽️',
  'Бар & Коктейли 🍸',
  'Скорость подачи ⚡',
  'Атмосфера вечера ✨',
  'Сервис и персонал 🤝',
]

const TIP_OPTIONS = [0, 10000, 20000, 50000]

/**
 * Отдельная страница отзывов и впечатлений гостей заведения (NFC / QR на столе).
 * Строго соответствует дизайну системы TrackUp:
 * - Тёмный фон (#0C0B0F), мягкое свечение #EBC6A0, зернистый шум
 * - Кнопки только двух типов: белая (#FFFFFF) или прозрачная с белой обводкой
 * - Единые размеры (h-12, rounded-xl, 14px шрифты)
 */
export function GuestReviewScreen({
  venueName = 'Neon Harbor Club & Bar',
  tableNumber = 5,
  onBack,
  onSubmitReview,
  className,
}: GuestReviewScreenProps) {
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Музыка & DJ 🎧',
    'Атмосфера вечера ✨',
  ])
  const [comment, setComment] = useState('')
  const [selectedTip, setSelectedTip] = useState<number>(10000)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmitReview({
      rating,
      tags: selectedTags,
      comment: comment.trim(),
      tableNumber,
      tipAmount: selectedTip > 0 ? selectedTip : undefined,
    })
    setIsSubmitted(true)
  }

  const activeStarCount = hoverRating ?? rating

  return (
    <div
      className={`relative w-full min-h-[100dvh] sm:min-h-0 sm:h-full flex flex-col justify-between overflow-y-auto overflow-x-hidden scrollbar-none bg-[#0C0B0F] text-[#F2EFE9] font-["Manrope",sans-serif] ${
        className || ''
      }`}
    >
      {/* Тонкий зернистый оверлей для текстуры */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Мягкое радиальное свечение */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[380px] w-[500px] rounded-full opacity-[0.07] blur-[90px]"
        style={{ background: '#EBC6A0' }}
      />

      {/* Карточка страницы */}
      <div className="relative z-10 mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-between p-4 sm:p-6 md:p-7 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        {/* Шапка: Кнопка назад (прозрачная), Заведение, Номер столика */}
        <header className="flex items-center justify-between gap-3 pb-3 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="flex size-10 items-center justify-center rounded-xl bg-transparent border border-white/20 text-white/80 hover:border-white/40 hover:text-white active:scale-[0.98] transition-colors cursor-pointer shrink-0"
              >
                <ArrowLeft className="size-4" />
              </button>
            )}
            <div className="flex flex-col min-w-0">
              <span className="font-['Bricolage_Grotesque',sans-serif] text-[16px] sm:text-[18px] font-bold text-white tracking-tight truncate leading-tight">
                Оставить отзыв
              </span>
              <span className="text-[12px] text-white/40 truncate">
                {venueName}
              </span>
            </div>
          </div>

          <Badge
            variant="outline"
            className="rounded-full bg-white/[0.06] border-white/12 px-3 py-1 text-xs font-bold text-[#F2EFE9] shrink-0"
          >
            <span className="font-normal text-white/40 mr-1">Стол</span>
            {tableNumber}
          </Badge>
        </header>

        {/* Состояние УСПЕХА */}
        {isSubmitted ? (
          <main className="flex flex-1 flex-col items-center justify-center gap-5 text-center my-auto py-8 animate-in fade-in-0 duration-200">
            <div
              className="flex size-16 items-center justify-center rounded-2xl"
              style={{
                background: 'rgba(235, 198, 160, 0.1)',
                border: '1px solid rgba(235, 198, 160, 0.25)',
              }}
            >
              <CheckCircle2 className="size-8 text-[#EBC6A0]" strokeWidth={1.8} />
            </div>

            <div className="flex flex-col gap-1.5 max-w-[280px]">
              <h1 className="font-['Bricolage_Grotesque',sans-serif] text-[22px] font-extrabold text-white leading-tight">
                Спасибо за ваш отзыв!
              </h1>
              <p className="text-[13px] text-white/40 leading-relaxed">
                Ваша оценка и пожелания переданы управляющему и команде заведения.
              </p>
            </div>

            {/* Белая кнопка */}
            <div className="w-full pt-4">
              <button
                type="button"
                onClick={() => {
                  if (onBack) onBack()
                  else setIsSubmitted(false)
                }}
                className="h-12 w-full rounded-xl bg-white text-[#0C0B0F] hover:bg-white/90 active:scale-[0.98] font-bold text-[14px] shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                Вернуться к заведению
              </button>
            </div>
          </main>
        ) : (
          /* Форма отзыва */
          <form
            onSubmit={handleSubmit}
            className="flex-1 flex flex-col justify-between py-4 gap-5"
          >
            {/* Блок звёзд рейтинга */}
            <div className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] text-center">
              <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                Оцените атмосферу вечера
              </span>

              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => setRating(star)}
                    className="p-1 rounded-xl transition-transform hover:scale-115 active:scale-95 cursor-pointer outline-none"
                  >
                    <Star
                      className={`size-8 transition-colors ${
                        star <= activeStarCount
                          ? 'fill-[#EBC6A0] text-[#EBC6A0] filter drop-shadow-[0_0_10px_rgba(235,198,160,0.4)]'
                          : 'text-white/20'
                      }`}
                      strokeWidth={1.5}
                    />
                  </button>
                ))}
              </div>

              <span className="text-[13px] font-bold text-[#EBC6A0] tracking-tight">
                {activeStarCount === 5
                  ? 'Великолепно! 🔥'
                  : activeStarCount === 4
                  ? 'Очень хорошо 👍'
                  : activeStarCount === 3
                  ? 'Нормально'
                  : 'Есть замечания'}
              </span>
            </div>

            {/* Теги впечатлений */}
            <div className="flex flex-col gap-2">
              <span className="text-[12px] font-semibold text-white/50">
                Что вам понравилось больше всего?
              </span>
              <div className="flex flex-wrap gap-1.5">
                {REVIEW_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag)
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-xl text-[12px] font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#EBC6A0]/15 text-[#EBC6A0] border border-[#EBC6A0]/40 shadow-sm'
                          : 'bg-white/[0.03] text-white/60 border border-white/[0.08] hover:text-white hover:border-white/20'
                      }`}
                    >
                      {tag}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Комментарий */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-white/50 flex items-center gap-1.5">
                  <MessageSquare className="size-3.5 text-white/40" />
                  <span>Ваш комментарий</span>
                </span>
                <span className="text-[11px] text-white/30">необязательно</span>
              </div>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Поделитесь впечатлениями о кухне, музыке или сервисе..."
                className="w-full p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-[13px] placeholder:text-white/25 focus:border-[#EBC6A0]/60 focus:outline-none resize-none transition-colors"
              />
            </div>

            {/* Чаевые (кнопки: выбранная - белая, невыбранная - прозрачная) */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-white/50 flex items-center gap-1.5">
                  <Heart className="size-3.5 text-rose-400" />
                  <span>Чаевые официанту и бару</span>
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {TIP_OPTIONS.map((tip) => {
                  const isSelected = selectedTip === tip
                  return (
                    <button
                      key={tip}
                      type="button"
                      onClick={() => setSelectedTip(tip)}
                      className={`h-10 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white text-[#0C0B0F] font-bold shadow-sm'
                          : 'bg-transparent border border-white/20 text-white/70 hover:border-white/40 hover:text-white'
                      }`}
                    >
                      {tip === 0 ? 'Без чаевых' : formatCurrency(tip)}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Кнопки действий: белая и прозрачная */}
            <footer className="flex flex-col gap-2.5 pt-2">
              {/* Белая основная кнопка */}
              <button
                type="submit"
                className="h-12 w-full rounded-xl bg-white text-[#0C0B0F] hover:bg-white/90 active:scale-[0.98] font-bold text-[14px] shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Отправить отзыв</span>
              </button>

              {/* Прозрачная второстепенная кнопка */}
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="h-12 w-full rounded-xl bg-transparent border border-white/20 text-white/80 hover:border-white/40 hover:text-white active:scale-[0.98] font-semibold text-[14px] flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Отмена</span>
                </button>
              )}
            </footer>
          </form>
        )}
      </div>
    </div>
  )
}
