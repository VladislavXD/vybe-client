'use client'

import React, { useEffect, useState } from 'react'
import { Sun, Moon, Laptop } from 'lucide-react'
import { useTheme } from '@wrksz/themes/client'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  variant?: 'button' | 'segmented'
  className?: string
}

/**
 * Отдельный компонент переключения темы на базе @wrksz/themes.
 * Поддерживает режимы: Светлая, Тёмная, Системная.
 * Предотвращает гидратационные мерцания (hydration mismatch).
 */
export function ThemeToggle({
  variant = 'button',
  className,
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Каркас во время SSR для предотвращения скачка разметки
    return (
      <div
        className={cn(
          'size-8 rounded-lg border border-black/8 dark:border-white/8 bg-black/5 dark:bg-white/5 opacity-60',
          className
        )}
        aria-hidden="true"
      />
    )
  }

  if (variant === 'segmented') {
    return (
      <div
        role="group"
        aria-label="Выбор темы оформления"
        className={cn(
          'inline-flex items-center rounded-xl p-1 transition-colors border',
          'border-black/8 dark:border-white/8 bg-black/5 dark:bg-white/5 text-muted-foreground',
          className
        )}
      >
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={cn(
            'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer',
            theme === 'light'
              ? 'bg-white text-black shadow-xs dark:bg-white/15 dark:text-white'
              : 'hover:text-foreground text-muted-foreground'
          )}
          aria-pressed={theme === 'light'}
        >
          <Sun className="size-3.5 text-amber-500" />
          <span>Светлая</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={cn(
            'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer',
            theme === 'dark'
              ? 'bg-white text-black shadow-xs dark:bg-white/15 dark:text-white'
              : 'hover:text-foreground text-muted-foreground'
          )}
          aria-pressed={theme === 'dark'}
        >
          <Moon className="size-3.5 text-indigo-400" />
          <span>Тёмная</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('system')}
          className={cn(
            'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer',
            theme === 'system'
              ? 'bg-white text-black shadow-xs dark:bg-white/15 dark:text-white'
              : 'hover:text-foreground text-muted-foreground'
          )}
          aria-pressed={theme === 'system'}
        >
          <Laptop className="size-3.5" />
          <span>Авто</span>
        </button>
      </div>
    )
  }

  // По умолчанию: компактная минималистичная кнопка-переключатель
  const isDark = resolvedTheme === 'dark'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Переключить на ${isDark ? 'светлую' : 'тёмную'} тему`}
      title={`Текущая тема: ${theme === 'system' ? 'Системная (' + resolvedTheme + ')' : isDark ? 'Тёмная' : 'Светлая'}. Нажмите для переключения.`}
      className={cn(
        'relative flex size-8 shrink-0 items-center justify-center rounded-lg border transition-all cursor-pointer select-none',
        'border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-foreground',
        className
      )}
    >
      <Sun
        className={cn(
          'size-4 transition-all duration-300',
          isDark
            ? '-rotate-90 scale-0 opacity-0 absolute'
            : 'rotate-0 scale-100 opacity-100 text-amber-500'
        )}
      />
      <Moon
        className={cn(
          'size-4 transition-all duration-300',
          isDark
            ? 'rotate-0 scale-100 opacity-100 text-indigo-400'
            : 'rotate-90 scale-0 opacity-0 absolute'
        )}
      />
      <span className="sr-only">Сменить тему</span>
    </button>
  )
}
