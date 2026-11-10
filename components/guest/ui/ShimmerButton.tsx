import React from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ShimmerButtonProps extends React.ComponentProps<typeof Button> {
  children?: React.ReactNode
  showArrow?: boolean
}

/**
 * Кнопка действия на базе shadcn/ui Button со скользящим световым бликом (sweep) и покачивающейся стрелкой
 */
export const ShimmerButton: React.FC<ShimmerButtonProps> = ({
  children = 'Выбрать трек',
  showArrow = true,
  className,
  ...props
}) => {
  return (
    <Button
      className={cn(
        'relative overflow-hidden w-full select-none cursor-pointer',
        'h-12 min-[375px]:h-14 sm:h-[58px]',
        'rounded-[16px] sm:rounded-[18px]',
        'bg-[#F2EFE9] text-[#16151B] font-bold text-base sm:text-[17px]',
        'shadow-[0_10px_30px_rgba(235,198,160,0.22)] hover:bg-white hover:shadow-[0_12px_35px_rgba(235,198,160,0.3)]',
        'active:scale-[0.985] transition-all duration-200 border-0',
        'animate-fade-up-4',
        className
      )}
      {...props}
    >
      {/* Скользящий световой блик под углом */}
      <span
        aria-hidden="true"
        className="animate-shimmer-sweep pointer-events-none absolute inset-y-0 -left-[60%] w-[40%] bg-gradient-to-r from-transparent via-white/80 to-transparent -skew-x-[18deg]"
      />

      <span className="relative z-10">{children}</span>

      {showArrow && (
        <ArrowRight
          aria-hidden="true"
          className="animate-arrow-nudge relative z-10 size-4 sm:size-5 stroke-[2.4]"
        />
      )}
    </Button>
  )
}
