'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowUpRight, Flame, Music, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { GuestBackground } from '../background/GuestBackground';
import { ManualTrackDrawer } from '../ui/ManualTrackDrawer';
import {
  TrackCard,
  TrackSkeleton,
  TrackSearchBar,
  TrackEmptyState,
} from '../music';
import {
  useDebounce,
  useMusicSearch,
  useMusicCharts,
} from '@/src/hooks/music';
import type {
  GuestMusicScreenProps,
  TrackItem,
  ManualTrackFormData,
} from '../types';
import type { MusicTrack } from '@/src/services/music/music.types';

const GENRE_FILTERS = [
  'Все',
  'House',
  'Deep Tech',
  'Hip-Hop',
  'Indie Dance',
  'R&B',
  'Afro House',
  'Pop',
] as const;

/**
 * Экран каталога музыки и живого поиска треков для гостя.
 * Интегрирован с Deezer API + fallback iTunes и кэшированием в Redis.
 */
export const GuestMusicScreen: React.FC<GuestMusicScreenProps> = ({
  venueName = 'Название заведения',
  tableNumber = 5,
  onBack,
  onProceedToPayment,
  onManualTrackSubmit,
  className,
}) => {
  // 1. Поисковый запрос и дебаунс (350мс)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('Все');
  const debouncedQuery = useDebounce(searchQuery, 350);

  // 2. Управление состоянием выбора и превью
  const [selectedTrack, setSelectedTrack] = useState<TrackItem | null>(null);
  const [isManualDrawerOpen, setIsManualDrawerOpen] = useState(false);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 3. Флаг активного поиска
  const isSearching = debouncedQuery.trim().length >= 2;

  // 4. Запросы TanStack Query
  const {
    data: searchData,
    isLoading: isSearchLoading,
    isFetching: isSearchFetching,
    isError: isSearchError,
    refetch: refetchSearch,
  } = useMusicSearch(debouncedQuery, { enabled: isSearching });

  const {
    data: chartTracks,
    isLoading: isChartsLoading,
    isError: isChartsError,
    refetch: refetchCharts,
  } = useMusicCharts({ enabled: !isSearching });

  // 5. Управление аудио-превью (30 секунд)
  const handleTogglePreview = useCallback((track: MusicTrack) => {
    if (!track.previewUrl) return;

    if (playingTrackId === track.id) {
      audioRef.current?.pause();
      setPlayingTrackId(null);
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.onended = () => setPlayingTrackId(null);
      audioRef.current.onerror = () => setPlayingTrackId(null);
    }

    audioRef.current.src = track.previewUrl;
    audioRef.current.play().catch(() => setPlayingTrackId(null));
    setPlayingTrackId(track.id);
  }, [playingTrackId]);

  // Очистка аудио при размонтировании экрана
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // 6. Выбор трека из списка
  const handleSelectTrack = useCallback((track: MusicTrack) => {
    const trackItem: TrackItem = {
      id: track.id,
      externalId: track.externalId,
      title: track.title,
      artist: track.artist,
      duration: track.durationFormatted,
      coverUrl: track.coverUrl,
      previewUrl: track.previewUrl,
      coverColor: '#5B4BA8',
    };
    setSelectedTrack(trackItem);
  }, []);

  // 7. Ручной ввод трека
  const handleManualSubmit = (data: ManualTrackFormData) => {
    const trackItem: TrackItem = {
      title: data.title,
      artist: data.artist,
      duration: 'По сету',
      coverColor: '#5B4BA8',
    };
    setSelectedTrack(trackItem);
    if (onManualTrackSubmit) {
      onManualTrackSubmit(data);
    }
  };

  // 8. Переход к оплате
  const handleProceed = () => {
    if (selectedTrack && onProceedToPayment) {
      // Останавливаем аудио перед переходом к чекауту
      audioRef.current?.pause();
      onProceedToPayment(selectedTrack);
    }
  };

  // 9. Фильтрация по жанрам
  const handleGenreClick = (genre: string) => {
    setSelectedGenre(genre);
    if (genre === 'Все') {
      setSearchQuery('');
    } else {
      setSearchQuery(genre);
    }
  };

  return (
    <div
      className={cn(
        'relative w-full min-h-[100dvh] sm:min-h-0 sm:h-full flex flex-col justify-between overflow-y-auto overflow-x-hidden scrollbar-none',
        'bg-[#0D0C10] text-[#F2EFE9] font-["Manrope",sans-serif]',
        className
      )}
    >
      {/* 1. Атмосферный фон */}
      <GuestBackground />

      {/* 2. Адаптивный центрированный контейнер */}
      <div className="relative z-10 mx-auto flex w-full max-w-[480px] flex-1 flex-col justify-between p-4 min-[390px]:p-5 sm:p-6 md:p-7 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]">
        {/* Шапка: кнопка назад, статус стола и язык */}
        <header className="flex items-center justify-between gap-2.5 pt-0.5 sm:pt-1 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                aria-label="Назад к экрану грамофона"
                className="flex size-8 sm:size-9 shrink-0 items-center justify-center rounded-full bg-white/8 border border-white/10 text-[#F2EFE9] hover:bg-white/15 transition-colors cursor-pointer"
              >
                <ArrowLeft className="size-4" />
              </button>
            )}

            <div className="flex flex-col min-w-0">
              <span className="truncate font-['Bricolage_Grotesque',sans-serif] text-sm sm:text-base font-bold tracking-tight">
                {venueName}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-[#A9A5B1]">
                <span className="size-1.5 rounded-full bg-[#5FD39A] shrink-0" />
                <span className="truncate">Принимает заявки · Стол {tableNumber}</span>
              </div>
            </div>
          </div>

          <Badge
            variant="outline"
            className="rounded-full bg-white/8 border-white/12 px-2.5 py-0.5 sm:py-1 text-xs font-semibold text-[#F2EFE9] shrink-0 cursor-pointer hover:bg-white/12 transition-colors"
          >
            RU
          </Badge>
        </header>

        {/* 3. Основная контентная область */}
        <main className="relative z-10 flex flex-1 flex-col gap-3 sm:gap-4 py-2 sm:py-3 min-h-0">
          {/* Строка поиска */}
          <TrackSearchBar
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              if (selectedGenre !== 'Все') setSelectedGenre('Все');
            }}
            onClear={() => {
              setSearchQuery('');
              setSelectedGenre('Все');
            }}
            isSearching={isSearchLoading || isSearchFetching}
          />

          {/* Быстрые жанровые фильтры */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1 shrink-0">
            {GENRE_FILTERS.map((genre) => {
              const isActive = selectedGenre === genre;
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => handleGenreClick(genre)}
                  className={cn(
                    'shrink-0 rounded-full px-2.5 sm:px-3 py-1 text-xs font-medium transition-all cursor-pointer select-none',
                    isActive
                      ? 'bg-[#EBC6A0] text-[#121116] font-semibold shadow-xs'
                      : 'bg-white/6 text-[#A9A5B1] border border-white/8 hover:text-white hover:bg-white/10'
                  )}
                >
                  {genre}
                </button>
              );
            })}
          </div>

          {/* Плашка текущего выбранного трека */}
          {selectedTrack && (
            <div className="animate-fade-up rounded-2xl bg-white/[0.08] border border-[#EBC6A0]/50 p-2.5 sm:p-3 flex items-center justify-between gap-3 shadow-lg shrink-0 backdrop-blur-md">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-10 rounded-xl overflow-hidden shrink-0 bg-white/5 border border-white/10 flex items-center justify-center">
                  {selectedTrack.coverUrl ? (
                    <img
                      src={selectedTrack.coverUrl}
                      alt={selectedTrack.title}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div
                      className="size-full flex items-center justify-center text-white"
                      style={{ background: selectedTrack.coverColor || '#5B4BA8' }}
                    >
                      <Music className="size-4" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="truncate text-xs sm:text-sm font-semibold text-[#F2EFE9]">
                    {selectedTrack.title}
                  </span>
                  <span className="truncate text-[11px] sm:text-xs text-[#A9A5B1]">
                    {selectedTrack.artist} {selectedTrack.duration && `· ${selectedTrack.duration}`}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Badge className="bg-[#EBC6A0] text-[#121116] font-bold text-[11px] sm:text-xs hover:bg-[#EBC6A0]">
                  Выбран
                </Badge>
                <button
                  type="button"
                  onClick={() => setSelectedTrack(null)}
                  aria-label="Снять выбор"
                  className="text-[#A9A5B1] hover:text-white p-1 rounded-md transition-colors cursor-pointer"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>
          )}

          {/* Список треков: результаты поиска или тренды */}
          <div className="flex-1 min-h-[240px] flex flex-col gap-2 overflow-y-auto scrollbar-none pr-0.5">
            {/* Режим 1: Результаты поиска */}
            {isSearching ? (
              isSearchLoading ? (
                <TrackSkeleton count={6} />
              ) : isSearchError ? (
                <TrackEmptyState
                  type="error"
                  onRetry={() => refetchSearch()}
                />
              ) : !searchData?.tracks || searchData.tracks.length === 0 ? (
                <TrackEmptyState
                  type="not-found"
                  query={debouncedQuery}
                  onManualTrack={() => setIsManualDrawerOpen(true)}
                />
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-white/40 px-1 pt-1">
                    <span>Найдено треков ({searchData.total})</span>
                    {searchData.source && (
                      <span className="text-[10px] text-white/30 lowercase">
                        {searchData.source === 'cache' ? '⚡ мгновенно' : searchData.source}
                      </span>
                    )}
                  </div>
                  {searchData.tracks.map((track) => (
                    <TrackCard
                      key={track.id}
                      track={track}
                      isSelected={selectedTrack?.id === track.id || (selectedTrack?.title === track.title && selectedTrack?.artist === track.artist)}
                      isPlayingPreview={playingTrackId === track.id}
                      onSelect={handleSelectTrack}
                      onTogglePreview={handleTogglePreview}
                    />
                  ))}
                </div>
              )
            ) : (
              /* Режим 2: Популярные тренды (пока поиск не активен) */
              isChartsLoading ? (
                <TrackSkeleton count={6} />
              ) : isChartsError ? (
                <TrackEmptyState
                  type="error"
                  onRetry={() => refetchCharts()}
                />
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#EBC6A0]/80 px-1 pt-1">
                    <Flame className="size-3.5 text-[#EBC6A0]" />
                    <span>Популярно сейчас в клубах</span>
                  </div>

                  {chartTracks && chartTracks.length > 0 ? (
                    chartTracks.map((track) => (
                      <TrackCard
                        key={track.id}
                        track={track}
                        isSelected={selectedTrack?.id === track.id || (selectedTrack?.title === track.title && selectedTrack?.artist === track.artist)}
                        isPlayingPreview={playingTrackId === track.id}
                        onSelect={handleSelectTrack}
                        onTogglePreview={handleTogglePreview}
                      />
                    ))
                  ) : (
                    <TrackEmptyState
                      type="not-found"
                      onManualTrack={() => setIsManualDrawerOpen(true)}
                    />
                  )}
                </div>
              )
            )}
          </div>

          {/* Ссылка ручного ввода: "Нет в списке? Указать название вручную" */}
          <div className="pt-1 shrink-0">
            <button
              type="button"
              onClick={() => setIsManualDrawerOpen(true)}
              className="group inline-flex items-center gap-1.5 py-1 text-left text-xs min-[360px]:text-[13px] sm:text-sm font-semibold text-[#F2EFE9] underline underline-offset-4 decoration-white/30 hover:decoration-[#EBC6A0] hover:text-[#EBC6A0] transition-all cursor-pointer"
            >
              <span className="leading-snug">Нет в списке? Указать название вручную</span>
              <ArrowUpRight className="size-3.5 sm:size-4 shrink-0 text-[#EBC6A0] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </main>

        {/* 4. Нижняя панель действий */}
        <footer className="pt-2 pb-1 sm:pb-3 shrink-0">
          {selectedTrack ? (
            <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#141415] border border-white/10 animate-fade-up">
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] text-[#A9A5B1]">Заказать трек:</span>
                <span className="truncate text-xs sm:text-sm font-semibold text-[#F2EFE9]">
                  {selectedTrack.title}
                </span>
              </div>
              <Button
                type="button"
                onClick={handleProceed}
                className="h-10 sm:h-11 px-4 rounded-xl bg-[#EBC6A0] text-[#121116] font-bold text-xs sm:text-sm hover:bg-[#F2D1AD] active:scale-[0.985] shadow-lg shadow-[#EBC6A0]/15 transition-all cursor-pointer border-0 shrink-0"
              >
                Далее · Заказать
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              onClick={() => setIsManualDrawerOpen(true)}
              variant="outline"
              className="h-10 sm:h-12 w-full rounded-xl border border-white/15 bg-white/5 text-[#F2EFE9] font-semibold text-xs sm:text-sm hover:bg-white/10 active:scale-[0.985] transition-all cursor-pointer"
            >
              Указать трек вручную
            </Button>
          )}
        </footer>
      </div>

      {/* Выдвижной Drawer ручного ввода */}
      <ManualTrackDrawer
        open={isManualDrawerOpen}
        onOpenChange={setIsManualDrawerOpen}
        onSubmit={handleManualSubmit}
      />
    </div>
  );
};

export default GuestMusicScreen;