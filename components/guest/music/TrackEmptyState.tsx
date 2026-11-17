import React from 'react';
import { SearchX, ArrowUpRight, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TrackEmptyStateProps {
  type: 'not-found' | 'error';
  query?: string;
  onManualTrack?: () => void;
  onRetry?: () => void;
}

/**
 * Состояние отсутствия результатов или ошибки поиска.
 */
export const TrackEmptyState: React.FC<TrackEmptyStateProps> = ({
  type,
  query,
  onManualTrack,
  onRetry,
}) => {
  if (type === 'error') {
    return (
      <div className="flex flex-col items-center justify-center p-6 sm:p-8 text-center rounded-2xl bg-white/[0.02] border border-white/[0.06] my-auto">
        <div className="size-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
          <AlertCircle className="size-6" />
        </div>
        <h3 className="text-[15px] font-bold text-white mb-1">Не удалось загрузить треки</h3>
        <p className="text-[12px] text-white/50 max-w-[260px] leading-relaxed mb-4">
          Проверьте подключение к интернету или попробуйте снова через несколько секунд
        </p>
        {onRetry && (
          <Button
            type="button"
            onClick={onRetry}
            variant="outline"
            className="h-9 px-4 rounded-xl border-white/15 bg-white/5 text-white text-xs hover:bg-white/10 cursor-pointer flex items-center gap-2"
          >
            <RefreshCw className="size-3.5" />
            <span>Повторить попытку</span>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 text-center rounded-2xl bg-white/[0.02] border border-white/[0.06] my-auto">
      <div className="size-12 rounded-2xl bg-white/5 border border-white/10 text-[#EBC6A0] flex items-center justify-center mb-3">
        <SearchX className="size-6 stroke-[1.8]" />
      </div>
      <h3 className="text-[15px] font-bold text-white mb-1">Ничего не найдено</h3>
      <p className="text-[12px] text-white/50 max-w-[280px] leading-relaxed mb-4">
        {query ? (
          <>
            По запросу <span className="text-[#EBC6A0] font-medium">«{query}»</span> треков не найдено. Вы можете указать трек вручную.
          </>
        ) : (
          'Попробуйте изменить формулировку или ввести имя исполнителя'
        )}
      </p>

      {onManualTrack && (
        <Button
          type="button"
          onClick={onManualTrack}
          className="h-9 px-4 rounded-xl bg-[#EBC6A0] text-[#121116] font-bold text-xs hover:bg-[#F2D1AD] shadow-md shadow-[#EBC6A0]/15 cursor-pointer flex items-center gap-1.5"
        >
          <span>Указать трек вручную</span>
          <ArrowUpRight className="size-3.5" />
        </Button>
      )}
    </div>
  );
};
