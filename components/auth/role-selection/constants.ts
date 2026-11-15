import {
  Building2,
  Disc3,
  QrCode,
  Users2,
  Percent,
  Radio,
  Timer,
  Wallet,
} from 'lucide-react'
import type { RoleOption, UserRoleType } from './types'

export const ROLE_OPTIONS: Record<UserRoleType, RoleOption> = {
  venue_owner: {
    id: 'venue_owner',
    title: 'Владелец заведения',
    shortTitle: 'Заведение',
    badge: 'Клубы, бары, караоке',
    description:
      'Управляйте столами с QR и NFC, запускайте онлайн-меню для кухни и бара, подключайте диджеев и собирайте отзывы гостей.',
    shareLabel: 'Доля заведения',
    sharePct: '43%',
    icon: Building2,
    defaultRedirectPath: '/dashboard', // или /venue когда будет развернут интерфейс заведения
    ctaText: 'Продолжить как владелец',
    benefits: [
      {
        icon: QrCode,
        title: 'QR и NFC сервисы для столов',
        description: 'Гость открывает меню блюд, заказ музыки или отзывы без установки приложений',
      },
      {
        icon: Users2,
        title: 'Управление кухней, баром и DJ',
        description: 'Заказы блюд поступают на кухню, а музыкальные треки — в пульт диджея',
      },
      {
        icon: Percent,
        title: 'Прозрачные выплаты (43%) и отзывы',
        description: 'Финансовая аналитика, честные оценки гостей и разделение выручки',
      },
    ],
  },
  dj: {
    id: 'dj',
    title: 'Диджей (DJ)',
    shortTitle: 'Диджей',
    badge: 'Резиденты и артисты',
    description:
      'Принимайте заявки от гостей в реальном времени, ставьте треки в своём софте и зарабатывайте 42% с каждого принятого трека.',
    shareLabel: 'Доля диджея',
    sharePct: '42%',
    icon: Disc3,
    defaultRedirectPath: '/dashboard',
    ctaText: 'Продолжить как диджей',
    benefits: [
      {
        icon: Radio,
        title: 'Интерактивная лента эфира',
        description: 'Заказы привязаны к столам и поступают в живую очередь во время смены',
      },
      {
        icon: Timer,
        title: '180 секунд на решение (холд)',
        description: 'Деньги холдируются на карте гостя и списываются при ACCEPTED',
      },
      {
        icon: Wallet,
        title: 'Прямой доход (42%)',
        description: 'Сервис выступает посредником, трек воспроизводится в вашем DJ-софте',
      },
    ],
  },
}
