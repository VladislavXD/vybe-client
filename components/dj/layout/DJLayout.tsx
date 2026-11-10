'use client'

import React, { useState } from 'react'
import { DJNavBar } from './DJNavBar'
import { DJTabBar } from './DJTabBar'
import { DJTopBar } from './DJTopBar'
import { DJ_COLORS } from '../constants'
import type { DJTab } from '../types'
import { cn } from '@/lib/utils'

interface DJLayoutProps {
  activeTab: DJTab
  onSelectTab: (tab: DJTab) => void
  pendingCount?: number
  isPlaying?: boolean
  isLive?: boolean
  venueName?: string
  children: React.ReactNode
}

/**
 * Responsive layout shell.
 *
 * Mobile  (< lg) : TopBar + single-column content + bottom TabBar
 * Desktop (≥ lg) : Collapsible NavBar sidebar + TopBar + content
 *
 * Анимация переключения вкладок: fade-in + slide-in-from-bottom-2
 */
export function DJLayout({
  activeTab,
  onSelectTab,
  pendingCount = 0,
  isPlaying = false,
  isLive = true,
  venueName,
  children,
}: DJLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div
      className="flex h-screen w-full overflow-hidden transition-colors duration-200"
      style={{ backgroundColor: DJ_COLORS.bg, color: DJ_COLORS.textPrimary }}
    >
      {/* Desktop collapsible sidebar */}
      <div
        className={cn(
          'hidden lg:flex transition-[width,opacity] duration-250 ease-in-out overflow-hidden shrink-0',
          isSidebarOpen ? 'w-[220px] opacity-100' : 'w-0 opacity-0 pointer-events-none'
        )}
      >
        <DJNavBar
          activeTab={activeTab}
          onSelect={onSelectTab}
          pendingCount={pendingCount}
          isPlaying={isPlaying}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <DJTopBar
          title="DJ Panel"
          subtitle={venueName}
          isLive={isLive}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((v) => !v)}
        />

        {/* Scrollable content — bottom padding for mobile tab bar */}
        <main
          className="flex-1 overflow-y-auto overscroll-contain scroll-smooth"
          style={{ scrollbarWidth: 'none' }}
        >
          {/* Tab transition wrapper */}
          <div
            key={activeTab}
            className="animate-in fade-in-0 slide-in-from-bottom-2 duration-200 min-h-full"
          >
            {/* Bottom padding to avoid tabbar overlap on mobile */}
            <div className="px-3 sm:px-4 lg:px-5 pt-4 pb-24 lg:pb-6 min-h-full">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <DJTabBar
        activeTab={activeTab}
        onSelect={onSelectTab}
        pendingCount={pendingCount}
        isPlaying={isPlaying}
      />
    </div>
  )
}
