/**
 * DJ Dashboard — Design Tokens
 * Единый источник правды для всех цветов, радиусов и анимаций.
 * Цвета привязаны к CSS-переменным и автоматически переключаются
 * между светлой и тёмной темами.
 */

export const DJ_COLORS = {
  /** Главный фон приложения */
  bg: 'var(--dj-bg)',
  /** Поверхность карточки / секции */
  surface: 'var(--dj-surface)',
  /** Приподнятая поверхность (вложенные элементы) */
  surfaceElevated: 'var(--dj-surface-elevated)',
  /** Hover-поверхность */
  surfaceHover: 'var(--dj-surface-hover)',
  /** Разделители и границы */
  border: 'var(--dj-border)',
  /** Акцентный жёлтый */
  accent: 'var(--dj-accent)',
  /** Акцент с прозрачностью (фон кнопок) */
  accentMuted: 'var(--dj-accent-muted)',
  /** Основной текст */
  textPrimary: 'var(--dj-text-primary)',
  /** Вторичный текст */
  textSecondary: 'var(--dj-text-secondary)',
  /** Приглушённый текст */
  textMuted: 'var(--dj-text-muted)',
  /** Красный для отклонения */
  danger: 'var(--dj-danger)',
  /** Мутированный красный */
  dangerMuted: 'var(--dj-danger-muted)',
  /** Зелёный для успешных состояний */
  success: 'var(--dj-success)',
  /** Мутированный зелёный */
  successMuted: 'var(--dj-success-muted)',
  /** Янтарный для чаевых */
  amber: 'var(--dj-amber)',
  /** Мутированный янтарный */
  amberMuted: 'var(--dj-amber-muted)',
} as const

export const DJ_ANIMATION = {
  /** Стандартный transition */
  base: 'transition-all duration-200 ease-out',
  /** Плавный fade + slide снизу для вкладок */
  tabContent: 'animate-in fade-in-0 slide-in-from-bottom-2 duration-200',
} as const
