'use client'

import React from 'react'

export interface AuthLayoutWrapperProps {
  children: React.ReactNode
}

/**
 * Изолированный layout страниц авторизации.
 * Тёмный, премиальный, без навигации и лишних элементов.
 * Фокус — только на форме.
 */
export function AuthLayoutWrapper({ children }: AuthLayoutWrapperProps) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0C0B0F] px-4 py-10 sm:px-6">
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
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[480px] w-[640px] rounded-full opacity-[0.07] blur-[100px]"
        style={{ background: '#EBC6A0' }}
      />

      {/* Карточка формы */}
      <div className="relative z-10 w-full max-w-[400px]">
        {children}
      </div>
    </div>
  )
}
