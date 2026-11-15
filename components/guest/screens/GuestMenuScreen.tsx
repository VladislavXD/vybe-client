'use client'

import React, { useState } from 'react'
import {
  ArrowLeft,
  UtensilsCrossed,
  Plus,
  Minus,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/src/utils/formatCurrency'
import type { GuestMenuScreenProps, MenuItem, CartItem } from '../types'

const MOCK_MENU: MenuItem[] = [
  {
    id: 'dish-1',
    name: 'Бургер Black Angus с трюфельным соусом',
    category: 'Кухня',
    price: 85000,
    description: 'Мраморная говядина medium rare, карамелизированный лук, сыр чеддер и хрустящая булочка бриошь.',
    badge: 'Шеф',
    available: true,
  },
  {
    id: 'dish-2',
    name: 'Тигровые креветки темпура с васаби',
    category: 'Закуски',
    price: 95000,
    description: 'Хрустящая панировка темпура, сливочно-острый соус васаби и долька свежего лайма.',
    badge: 'Хит',
    available: true,
  },
  {
    id: 'dish-3',
    name: 'Тартар из дикого лосося с авокадо',
    category: 'Закуски',
    price: 78000,
    description: 'Свежее филе лосося, крем из спелого авокадо и чипсы из водорослей нори.',
    available: true,
  },
  {
    id: 'dish-4',
    name: 'Авторский коктейль Neon Harbor',
    category: 'Бар',
    price: 65000,
    description: 'Сухой джин, кордиал из маракуйи, грейпфрутовый фреш и игристое вино.',
    badge: 'Signature',
    available: true,
  },
  {
    id: 'dish-5',
    name: 'Smoky Mezcal Paloma',
    category: 'Бар',
    price: 70000,
    description: 'Дымный мескаль, розовый грейпфрут, лаймовый фреш и розовая гималайская соль.',
    available: true,
  },
  {
    id: 'dish-6',
    name: 'Баскский чизкейк Сан-Себастьян',
    category: 'Десерты',
    price: 55000,
    description: 'Нежный опаленный чизкейк с кремом из натуральной сицилийской фисташки.',
    available: true,
  },
]

const CATEGORIES = ['Все', 'Кухня', 'Бар', 'Закуски', 'Десерты']

/**
 * Отдельная страница онлайн-меню кухни и бара заведения.
 * Строго соответствует дизайну системы TrackUp:
 * - Тёмный фон (#0C0B0F), мягкое свечение #EBC6A0
 * - Кнопки только двух типов: белая (#FFFFFF) или прозрачная с белой обводкой
 */
export function GuestMenuScreen({
  venueName = 'Neon Harbor Club & Bar',
  tableNumber = 5,
  onBack,
  onProceedOrder,
  className,
}: GuestMenuScreenProps) {
  const [activeCategory, setActiveCategory] = useState('Все')
  const [cart, setCart] = useState<Record<string, number>>({})
  const [isOrdered, setIsOrdered] = useState(false)
  const [orderedItems, setOrderedItems] = useState<CartItem[]>([])
  const [finalTotal, setFinalTotal] = useState<number>(0)

  const filteredItems =
    activeCategory === 'Все'
      ? MOCK_MENU
      : MOCK_MENU.filter((item) => item.category === activeCategory)

  const handleAdd = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
  }

  const handleRemove = (id: string) => {
    setCart((prev) => {
      const count = prev[id] || 0
      if (count <= 1) {
        const copy = { ...prev }
        delete copy[id]
        return copy
      }
      return { ...prev, [id]: count - 1 }
    })
  }

  const totalItemsCount = Object.values(cart).reduce((acc, c) => acc + c, 0)
  const totalAmount = Object.entries(cart).reduce((sum, [id, count]) => {
    const item = MOCK_MENU.find((m) => m.id === id)
    return sum + (item ? item.price * count : 0)
  }, 0)

  const handleOrder = () => {
    const items: CartItem[] = Object.entries(cart).map(([id, quantity]) => ({
      item: MOCK_MENU.find((m) => m.id === id)!,
      quantity,
    }))
    setOrderedItems(items)
    setFinalTotal(totalAmount)
    setIsOrdered(true)
    if (onProceedOrder) {
      onProceedOrder(items, totalAmount)
    }
  }

  return (
    <div
      className={`relative w-full min-h-[100dvh] sm:min-h-0 sm:h-full flex flex-col justify-between overflow-hidden bg-[#0C0B0F] text-[#F2EFE9] font-["Manrope",sans-serif] ${
        className || ''
      }`}
    >
      {/* Тонкий зернистый оверлей */}
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

      {/* Шапка: Кнопка назад (прозрачная), Заведение, Номер столика */}
      <header className="relative z-10 p-4 sm:p-5 pb-3 border-b border-white/[0.06] bg-[#0C0B0F]/95 backdrop-blur-md flex items-center justify-between shrink-0">
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
              Онлайн-меню
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

      {/* Состояние УСПЕХА заказа */}
      {isOrdered ? (
        <main className="relative z-10 flex flex-1 flex-col items-center justify-center gap-5 text-center p-6 my-auto animate-in fade-in-0 duration-200">
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
              Заказ отправлен на кухню!
            </h1>
            <p className="text-[13px] text-white/40 leading-relaxed">
              Повара и бар уже получили чек для стола {tableNumber}.
            </p>
          </div>

          {/* Состав заказа */}
          <div className="w-full max-w-[360px] p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] text-left text-[12px] flex flex-col gap-2">
            <div className="flex items-center justify-between text-white/40 text-[11px] pb-1 border-b border-white/[0.05]">
              <span className="flex items-center gap-1.5">
                <Clock className="size-3" />
                <span>Время приготовления ~15 мин</span>
              </span>
              <span>Стол {tableNumber}</span>
            </div>

            {orderedItems.map((c, i) => (
              <div key={i} className="flex justify-between items-center text-white/80 py-0.5">
                <span>{c.item.name} × {c.quantity}</span>
                <span className="font-mono text-[#EBC6A0]">
                  {formatCurrency(c.item.price * c.quantity)}
                </span>
              </div>
            ))}

            <div className="pt-2 border-t border-white/[0.06] flex justify-between font-bold text-white text-[13px]">
              <span>Итого:</span>
              <span className="font-mono text-white">
                {formatCurrency(finalTotal)}
              </span>
            </div>
          </div>

          {/* Белая кнопка возврата */}
          <div className="w-full max-w-[360px] pt-2">
            <button
              type="button"
              onClick={() => {
                setCart({})
                setIsOrdered(false)
              }}
              className="h-12 w-full rounded-xl bg-white text-[#0C0B0F] hover:bg-white/90 active:scale-[0.98] font-bold text-[14px] shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              Вернуться в меню
            </button>
          </div>
        </main>
      ) : (
        <>
          {/* Фильтр категорий */}
          <div className="relative z-10 flex items-center gap-1.5 px-4 py-2.5 overflow-x-auto scrollbar-none border-b border-white/[0.04] shrink-0 bg-[#0C0B0F]/80">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#0C0B0F]'
                      : 'bg-transparent border border-white/10 text-white/50 hover:text-white hover:border-white/20'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* Список блюд */}
          <main className="relative z-10 flex-1 overflow-y-auto px-4 py-3 space-y-2.5 scrollbar-none pb-28">
            {filteredItems.map((item) => {
              const qty = cart[item.id] || 0
              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-between gap-3 hover:border-white/15 transition-all"
                >
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[13.5px] text-white leading-snug">
                        {item.name}
                      </span>
                      {item.badge && (
                        <span className="px-1.5 py-0.2 rounded-md bg-[#EBC6A0]/15 text-[#EBC6A0] text-[10px] font-bold shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11.5px] text-white/40 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                    <span className="text-[13px] font-bold text-[#EBC6A0] mt-1 font-mono">
                      {formatCurrency(item.price)}
                    </span>
                  </div>

                  {/* Кнопка добавления / счетчик */}
                  <div className="flex items-center gap-1 shrink-0 bg-transparent border border-white/15 rounded-xl p-0.5">
                    {qty > 0 ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          className="size-7 rounded-lg bg-transparent hover:bg-white/10 flex items-center justify-center text-white cursor-pointer active:scale-95"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold font-mono text-white">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAdd(item.id)}
                          className="size-7 rounded-lg bg-white text-[#0C0B0F] hover:bg-white/90 flex items-center justify-center cursor-pointer active:scale-95"
                        >
                          <Plus className="size-3.5 stroke-[2.5]" />
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAdd(item.id)}
                        className="h-7 px-3 rounded-lg bg-transparent hover:bg-white/10 text-white/80 hover:text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Plus className="size-3 stroke-[2]" />
                        <span>Добавить</span>
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </main>

          {/* Нижняя плавающая панель корзины с БЕЛОЙ кнопкой */}
          {totalItemsCount > 0 && (
            <footer className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0C0B0F] via-[#0C0B0F]/95 to-transparent pt-6 border-t border-white/[0.06] backdrop-blur-md z-30 animate-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-center justify-between gap-3 mb-2 px-1 max-w-[440px] mx-auto">
                <span className="text-[12px] text-white/50">
                  В заказе: <span className="text-white font-semibold">{totalItemsCount} поз.</span>
                </span>
                <span className="text-[14px] font-bold text-[#EBC6A0] font-mono">
                  {formatCurrency(totalAmount)}
                </span>
              </div>

              {/* Белая кнопка оформления заказа */}
              <div className="max-w-[440px] mx-auto">
                <button
                  type="button"
                  onClick={handleOrder}
                  className="h-12 w-full rounded-xl bg-white text-[#0C0B0F] hover:bg-white/90 active:scale-[0.98] font-bold text-[14px] shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <UtensilsCrossed className="size-4" />
                  <span>Заказать к столу {tableNumber}</span>
                </button>
              </div>
            </footer>
          )}
        </>
      )}
    </div>
  )
}
