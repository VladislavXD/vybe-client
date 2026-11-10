/**
 * Design Tokens for Guest Track Ordering Experience
 * Extracted from production design "Страница гостя заказ трека (2).html"
 */

export const GUEST_TOKENS = {
  // Цветовая палитра
  colors: {
    bg: {
      primary: '#0D0C10',        // Угольно-чёрный фон начального экрана
      result: '#0B0B0C',         // Фон экранов успешной и отклонённой заявки
      surface: '#141415',        // Карточка деталей заказа и чека
      surfaceAlt: '#121116',     // Диск винила
      surfaceElevated: '#16151B',
      cardHighlight: 'rgba(255, 255, 255, 0.08)',
      cardBorder: 'rgba(255, 255, 255, 0.12)',
      divider: '#262629',
    },
    text: {
      primary: '#F2EFE9',        // Молочно-белый
      secondary: '#B4AFBB',      // Сиренево-серый
      muted: '#A9A5B1',          // Приглушённый нейтральный серый
      subtle: '#6B6B73',         // Бордюры и вторичные лейблы
      caption: '#9A95A3',        // Мелкие сноски
      inverse: '#16151B',        // Тёмный текст для светлых кнопок
    },
    accent: {
      sandGold: '#EBC6A0',       // Теплый песочно-золотистый
      dustyRose: '#B5646F',      // Пыльная роза
      purple: '#5B4BA8',         // Фоновая сфера
      teal: '#2F7F79',           // Фоновое свечение успеха
      trackBerry: '#5A3B46',     // Бейдж Late Signal
      trackTeal: '#2F4A45',      // Бейдж Late Night Static
      defaultCover: '#3B3F58',   // Обложка трека в чеке
      glowShadow: 'rgba(235, 198, 160, 0.18)',
    },
    status: {
      success: '#5FD39A',        // Изумрудно-зеленый
      successGlow: '#2F7F79',
      failure: '#F08A7E',        // Кораллово-красный
      failureGlow: '#B5646F',
    },
    vinyl: {
      body: '#121116',
      border: '#2E2C35',
      grooveLight: 'rgba(255, 255, 255, 0.07)',
      grooveDark: 'rgba(255, 255, 255, 0.05)',
      labelStart: '#EBC6A0',
      labelEnd: '#B5646F',
      labelBorder: 'rgba(0, 0, 0, 0.25)',
      spindleHole: '#0D0C10',
      spindleShadow: 'rgba(13, 12, 16, 0.45)',
      sheen: 'rgba(255, 255, 255, 0.05)',
      pulseRing: 'rgba(235, 198, 160, 0.4)',
      tonearmBase: '#2A2831',
      tonearmBaseStroke: '#4A4752',
      tonearmArm: '#CFC8BE',
    },
  },

  // Конфетти для экрана успеха (14 частиц с углами поворота)
  confettiParticles: [
    { angle: 0, type: 'pill' as const, color: '#EBC6A0', anim: 'burstNear 1.5s cubic-bezier(.1,.7,.2,1) .6s both' },
    { angle: 26, type: 'dot' as const, color: '#B5646F', anim: 'burstFar 1.5s cubic-bezier(.1,.7,.2,1) .6s both' },
    { angle: 51, type: 'pill' as const, color: '#8E86D9', anim: 'burstNear 1.5s cubic-bezier(.1,.7,.2,1) .64s both' },
    { angle: 77, type: 'dot' as const, color: '#F2EFE9', anim: 'burstFar 1.5s cubic-bezier(.1,.7,.2,1) .6s both' },
    { angle: 103, type: 'pill' as const, color: '#EBC6A0', anim: 'burstNear 1.5s cubic-bezier(.1,.7,.2,1) .66s both' },
    { angle: 129, type: 'dot' as const, color: '#5FD39A', anim: 'burstFar 1.5s cubic-bezier(.1,.7,.2,1) .6s both' },
    { angle: 154, type: 'pill' as const, color: '#B5646F', anim: 'burstNear 1.5s cubic-bezier(.1,.7,.2,1) .62s both' },
    { angle: 180, type: 'dot' as const, color: '#8E86D9', anim: 'burstFar 1.5s cubic-bezier(.1,.7,.2,1) .6s both' },
    { angle: 206, type: 'pill' as const, color: '#F2EFE9', anim: 'burstNear 1.5s cubic-bezier(.1,.7,.2,1) .68s both' },
    { angle: 231, type: 'dot' as const, color: '#EBC6A0', anim: 'burstFar 1.5s cubic-bezier(.1,.7,.2,1) .6s both' },
    { angle: 257, type: 'pill' as const, color: '#5FD39A', anim: 'burstNear 1.5s cubic-bezier(.1,.7,.2,1) .64s both' },
    { angle: 283, type: 'dot' as const, color: '#B5646F', anim: 'burstFar 1.5s cubic-bezier(.1,.7,.2,1) .6s both' },
    { angle: 309, type: 'pill' as const, color: '#8E86D9', anim: 'burstNear 1.5s cubic-bezier(.1,.7,.2,1) .66s both' },
    { angle: 334, type: 'dot' as const, color: '#F2EFE9', anim: 'burstFar 1.5s cubic-bezier(.1,.7,.2,1) .62s both' },
  ],

  // Дымные частицы для экрана отклонения (10 частиц)
  puffParticles: [
    { angle: 0, color: '#F08A7E', anim: 'puffNear 1.3s cubic-bezier(.1,.7,.2,1) 1.2s both' },
    { angle: 36, color: '#B5646F', anim: 'puffFar 1.3s cubic-bezier(.1,.7,.2,1) 1.2s both' },
    { angle: 72, color: '#A9A5B1', anim: 'puffNear 1.3s cubic-bezier(.1,.7,.2,1) 1.24s both' },
    { angle: 108, color: '#F08A7E', anim: 'puffFar 1.3s cubic-bezier(.1,.7,.2,1) 1.2s both' },
    { angle: 144, color: '#B5646F', anim: 'puffNear 1.3s cubic-bezier(.1,.7,.2,1) 1.26s both' },
    { angle: 180, color: '#A9A5B1', anim: 'puffFar 1.3s cubic-bezier(.1,.7,.2,1) 1.2s both' },
    { angle: 216, color: '#F08A7E', anim: 'puffNear 1.3s cubic-bezier(.1,.7,.2,1) 1.22s both' },
    { angle: 252, color: '#B5646F', anim: 'puffFar 1.3s cubic-bezier(.1,.7,.2,1) 1.2s both' },
    { angle: 288, color: '#A9A5B1', anim: 'puffNear 1.3s cubic-bezier(.1,.7,.2,1) 1.28s both' },
    { angle: 324, color: '#F08A7E', anim: 'puffFar 1.3s cubic-bezier(.1,.7,.2,1) 1.2s both' },
  ],

  // Адаптивные контрольные точки и размеры
  layout: {
    minWidth: 320,
    maxWidth: 420,
  },
} as const
