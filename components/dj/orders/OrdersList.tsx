'use client'

import React, { useMemo, useState } from 'react'
import { Search, Sparkles, Inbox } from 'lucide-react'
import { OrderCard } from './OrderCard'
import type { DJOrder } from '../types'
import { DJ_COLORS } from '../constants'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface OrdersListProps {
  orders: DJOrder[]
  onAcceptOrder: (order: DJOrder) => void
  onRejectOrder: (order: DJOrder) => void
  onPlayNow: (order: DJOrder) => void
}

type Filter = 'all' | 'pending' | 'accepted' | 'history'

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'pending', label: 'Новые' },
  { id: 'accepted', label: 'В очереди' },
  { id: 'history', label: 'История' },
]

/**
 * Список заказов с фильтрами, поиском и фильтром по чаевым.
 */
export function OrdersList({
  orders,
  onAcceptOrder,
  onRejectOrder,
  onPlayNow,
}: OrdersListProps) {
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [tipsOnly, setTipsOnly] = useState(false)

  const counts = useMemo(
    () => ({
      all: orders.length,
      pending: orders.filter((o) => o.status === 'pending').length,
      accepted: orders.filter((o) => o.status === 'accepted').length,
      history: orders.filter(
        (o) => o.status === 'completed' || o.status === 'rejected'
      ).length,
    }),
    [orders]
  )

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      if (filter === 'pending' && order.status !== 'pending') return false
      if (filter === 'accepted' && order.status !== 'accepted') return false
      if (
        filter === 'history' &&
        order.status !== 'completed' &&
        order.status !== 'rejected'
      )
        return false
      if (tipsOnly && (!order.tip || order.tip <= 0)) return false
      if (search.trim()) {
        const q = search.toLowerCase().trim()
        return (
          order.track.title.toLowerCase().includes(q) ||
          order.track.artist.toLowerCase().includes(q) ||
          order.table.toLowerCase().includes(q) ||
          order.orderNumber.toLowerCase().includes(q) ||
          (order.guestName?.toLowerCase().includes(q) ?? false)
        )
      }
      return true
    })
  }, [orders, filter, tipsOnly, search])

  return (
    <div className="flex flex-col gap-4">
      {/* Search + tips filter — shadcn Input & Button */}
      <div className="flex items-center gap-2">
        <div className="relative flex flex-1 items-center">
          <Search
            className="absolute left-3 size-4 shrink-0 pointer-events-none text-muted-foreground z-10"
            strokeWidth={1.8}
          />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Трек, артист, стол..."
            className="h-10 pl-9 pr-3 rounded-xl bg-card border-border/40 text-[13px]"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setTipsOnly(!tipsOnly)}
          title="Только с чаевыми"
          className={cn(
            'size-10 rounded-xl transition-all cursor-pointer',
            tipsOnly
              ? 'bg-[#EBC6A0]/15 border-[#EBC6A0]/40 text-[#EBC6A0]'
              : 'bg-card border-border/40 text-muted-foreground'
          )}
        >
          <Sparkles className="size-4" strokeWidth={1.8} />
        </Button>
      </div>

      {/* Filter tabs — shadcn Tabs */}
      <Tabs
        value={filter}
        onValueChange={(val) => setFilter(val as Filter)}
        className="w-full"
      >
        <TabsList className="flex w-full h-auto gap-1 p-1 rounded-xl bg-card border border-border/40 overflow-x-auto">
          {FILTERS.map(({ id, label }) => {
            const count = counts[id]
            return (
              <TabsTrigger
                key={id}
                value={id}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-[12px] font-semibold data-active:bg-muted data-active:text-foreground text-muted-foreground cursor-pointer"
              >
                <span>{label}</span>
                {id === 'pending' && count > 0 ? (
                  <Badge className="flex min-w-[16px] h-4 items-center justify-center rounded-md px-1 text-[9px] font-extrabold text-black bg-[#EBC6A0] hover:bg-[#EBC6A0] border-0">
                    {count}
                  </Badge>
                ) : count > 0 ? (
                  <span className="text-[10px] font-bold tabular-nums opacity-70">
                    {count}
                  </span>
                ) : null}
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>

      {/* Order cards */}
      <div className="flex flex-col gap-2.5">
        {filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center gap-2 rounded-2xl py-12 text-center"
            style={{ backgroundColor: DJ_COLORS.surface }}
          >
            <Inbox
              className="size-8"
              strokeWidth={1.4}
              style={{ color: DJ_COLORS.textMuted }}
            />
            <p
              className="text-[13px] font-semibold opacity-70"
              style={{ color: DJ_COLORS.textPrimary }}
            >
              Заказов не найдено
            </p>
            <p
              className="text-[11px] max-w-[200px] leading-relaxed"
              style={{ color: DJ_COLORS.textMuted }}
            >
              {search
                ? `По запросу «${search}» ничего нет`
                : filter === 'pending'
                ? 'Все заявки обработаны'
                : 'Здесь пока пусто'}
            </p>
          </div>
        ) : (
          filtered.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onAccept={onAcceptOrder}
              onReject={onRejectOrder}
              onPlayNow={onPlayNow}
            />
          ))
        )}
      </div>
    </div>
  )
}
