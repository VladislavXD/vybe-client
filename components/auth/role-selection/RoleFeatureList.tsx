'use client'

import React from 'react'
import type { RoleBenefit } from './types'

export interface RoleFeatureListProps {
  benefits: RoleBenefit[]
  roleTitle: string
}

/**
 * Список ключевых возможностей выбранной роли.
 */
export function RoleFeatureList({ benefits, roleTitle }: RoleFeatureListProps) {
  return (
    <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
      <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
        Что даёт роль ({roleTitle}):
      </span>

      <ul className="flex flex-col gap-2 mt-1">
        {benefits.map((benefit, idx) => {
          const Icon = benefit.icon
          return (
            <li key={idx} className="flex items-start gap-2.5 text-left">
              <div className="size-4 rounded-full bg-[#EBC6A0]/10 flex items-center justify-center shrink-0 mt-0.5 text-[#EBC6A0]">
                <Icon className="size-2.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-medium text-white/80 leading-snug">
                  {benefit.title}
                </span>
                <span className="text-[11px] text-white/40 leading-tight">
                  {benefit.description}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
