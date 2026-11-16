import type { QrCodeType } from './types';

export const QR_TYPE_CONFIG: Record<
  QrCodeType,
  {
    label: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder?: string;
  }
> = {
  MUSIC: {
    label: 'Музыка',
    badgeBg: 'bg-white/[0.08]',
    badgeText: 'text-white/80',
    badgeBorder: 'border-white/10',
  },
  FOOD: {
    label: 'Еда',
    badgeBg: 'bg-[#373554]',
    badgeText: 'text-[#B8B4FF]',
    badgeBorder: 'border-[#5B558F]/40',
  },
  REVIEWS: {
    label: 'Отзывы',
    badgeBg: 'bg-[#183932]',
    badgeText: 'text-[#6EE7B7]',
    badgeBorder: 'border-[#265E52]/40',
  },
};

export const QR_SOURCES = [
  { id: 'table_tent', label: 'table_tent (тейбл-тент)' },
  { id: 'sticker', label: 'sticker (наклейка)' },
  { id: 'nfc', label: 'nfc (NFC-метка)' },
  { id: 'menu_card', label: 'menu_card (меню-карта)' },
] as const;

export const DEFAULT_ZONES = [
  'Основной зал',
  'VIP Lounge',
  'Барная зона',
  'Веранда',
  'Терраса',
] as const;
