import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/src/utils/formatCurrency'

interface OrderReceiptCardProps {
  trackTitle: string
  trackArtist: string
  trackDuration: string
  orderNumber: string
  statusVariant: 'success' | 'failure'
  responseTime?: string
  amount: number 
  typeLabel?: string
  reasonLabel?: string
  coverColor?: string
  className?: string
}

/**
 * Информационная карточка чека заявки на базе shadcn Card и Separator
 */
export const OrderReceiptCard: React.FC<OrderReceiptCardProps> = ({
  trackTitle,
  trackArtist,
  trackDuration,
  orderNumber,
  statusVariant,
  responseTime,
  amount,
  typeLabel = 'Обычная',
  reasonLabel,
  coverColor = '#3B3F58',
  className,
}) => {
  const isSuccess = statusVariant === 'success'

  return (
    <Card
      className={cn(
        'animate-fade-up-3 w-full border-0 bg-[#141415] text-[#F2EFE9] rounded-xl p-3 sm:p-3.5 shadow-md ring-0',
        className
      )}
    >
      <CardContent className="p-0 flex flex-col gap-3">
        {/* Шапка трека с обложкой */}
        <div className="flex items-center gap-3">
          <div
            className="size-11 sm:size-12 shrink-0 rounded-lg shadow-sm"
            style={{ background: coverColor }}
          />
          <div className="flex flex-col min-w-0">
            <span className="truncate text-sm sm:text-[15px] font-semibold text-[#F2EFE9]">
              {trackTitle}
            </span>
            <span className="truncate text-xs sm:text-[13px] text-[#A9A5B1]">
              {trackArtist} · {trackDuration}
            </span>
          </div>
        </div>

        <Separator className="bg-[#262629] my-0" />

        {/* Детали заявки */}
        {isSuccess ? (
          <>
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-[#A9A5B1]">Тип заявки</span>
              <span className="font-semibold text-[#F2EFE9]">{typeLabel}</span>
            </div>
            {responseTime && (
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#A9A5B1]">Время ответа</span>
                <span className="font-semibold tabular-nums text-[#F2EFE9]">{responseTime}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-[#A9A5B1]">Номер заявки</span>
              <span className="font-semibold tabular-nums text-[#F2EFE9]">{orderNumber}</span>
            </div>
          </>
        ) : (
          <>
            {reasonLabel && (
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#A9A5B1]">Причина</span>
                <span className="font-semibold text-[#F2EFE9]">{reasonLabel}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-[#A9A5B1]">Номер заявки</span>
              <span className="font-semibold tabular-nums text-[#F2EFE9]">{orderNumber}</span>
            </div>
          </>
        )}

        <Separator className="bg-[#262629] my-0" />

        {/* Итоговая сумма */}
        <div className="flex items-baseline justify-between pt-0.5 gap-2">
          <span className="text-xs sm:text-sm text-[#A9A5B1] shrink-0">
            {isSuccess ? 'Списано' : 'Сумма на карте'}
          </span>
          <span className="text-sm min-[360px]:text-base sm:text-lg font-extrabold tabular-nums text-[#F2EFE9] text-right">
            {isSuccess ? `${formatCurrency(amount)} UZS` : `Доступно ${formatCurrency(amount)} UZS`}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
