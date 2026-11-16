"use client";

import React, { useMemo, useState } from "react";
import { QrHeader } from "./header/QrHeader";
import { QrFilterBar } from "./filters/QrFilterBar";
import { QrTable } from "./table/QrTable";
import { QrDetailCard } from "./preview/QrDetailCard";
import { CreateQrModal } from "./modals/CreateQrModal";
import { BatchCreateQrModal } from "./modals/BatchCreateQrModal";
import { EditQrModal } from "./modals/EditQrModal";
import { DeleteConfirmDialog } from "./modals/DeleteConfirmDialog";
import type { QrCodeItem, QrTabCategory } from "./types";
import { cn } from "@/lib/utils";
import {
  useQrCodes,
  useCreateQrCode,
  useBatchCreateQrCodes,
  useUpdateQrCode,
  useDeleteQrCode,
} from "@/src/hooks/qrcode/useQrCodes";
import type {
  CreateQrCodePayload,
  BatchCreateQrCodePayload,
  UpdateQrCodePayload,
} from "@/src/services/qrcode/qrcode.types";

interface QrManagementViewProps {
  initialItems?: QrCodeItem[];
  className?: string;
}

const EMPTY_ITEMS: QrCodeItem[] = [];

export function QrManagementView({
  initialItems,
  className = "",
}: QrManagementViewProps) {
  // TanStack Query хуки
  const {
    data,
    isLoading: isQueryLoading,
    isError,
    error,
    refetch,
  } = useQrCodes();
  const createMutation = useCreateQrCode();
  const batchCreateMutation = useBatchCreateQrCodes();
  const updateMutation = useUpdateQrCode();
  const deleteMutation = useDeleteQrCode();


  // Элементы данных: если с сервера пришли данные и они не пусты, берем их, иначе локальные
  const allItems = data ?? EMPTY_ITEMS

  // Фильтры и поиск
  const [category, setCategory] = useState<QrTabCategory>("all");
  const [search, setSearch] = useState("");
  const [onlyActive, setOnlyActive] = useState(false);

  // Выбранный для предпросмотра стол
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Модальные окна
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isBatchOpen, setIsBatchOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<QrCodeItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<QrCodeItem | null>(null);

  // Подсчет счетчиков для фильтра
  const counts = useMemo(() => {
    const music = allItems.filter((i) => i.type === "MUSIC").length;
    const food = allItems.filter((i) => i.type === "FOOD").length;
    const reviews = allItems.filter((i) => i.type === "REVIEWS").length;
    return {
      all: allItems.length,
      music,
      food,
      reviews,
    };
  }, [allItems]);

  // Отфильтрованный список столов
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      // 1. Категория
      if (category === "music" && item.type !== "MUSIC") return false;
      if (category === "food" && item.type !== "FOOD") return false;
      if (category === "reviews" && item.type !== "REVIEWS") return false;

      // 2. Только активные
      if (onlyActive && !item.isActive) return false;

      // 3. Поиск по столу, коду, источнику
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const matchesLabel = item.tableLabel.toLowerCase().includes(q);
        const matchesCode = item.code.toLowerCase().includes(q);
        const matchesSource = (item.source || "").toLowerCase().includes(q);
        const matchesZone = (item.zoneId || "").toLowerCase().includes(q);
        if (!matchesLabel && !matchesCode && !matchesSource && !matchesZone) {
          return false;
        }
      }

      return true;
    });
  }, [allItems, category, onlyActive, search]);

  // Текущий выбранный элемент
  const selectedItem = useMemo(() => {
    if (selectedId) {
      const found = allItems.find((i) => i.id === selectedId);
      if (found) return found;
    }
    return filteredItems[0] || allItems[0] || null;
  }, [selectedId, allItems, filteredItems]);

  // ─── Обработчики CRUD ────────────────────────────────────────────────────────

  const handleCreate = async (payload: CreateQrCodePayload) => {
  const created = await createMutation.mutateAsync(payload);
  setSelectedId(created.id);
};


  const handleBatchCreate = async (payload: BatchCreateQrCodePayload) => {
  await batchCreateMutation.mutateAsync(payload);
};

const handleUpdate = async (id: string, payload: UpdateQrCodePayload) => {
  await updateMutation.mutateAsync({ id, payload });
};

const handleToggleActive = async (item: QrCodeItem, nextActive: boolean) => {
  await handleUpdate(item.id, { isActive: nextActive });
};
const handleDelete = async (item: QrCodeItem) => {
  await deleteMutation.mutateAsync(item.id);
  setDeletingItem(null);
};

  const activeCount = useMemo(() => {
    return allItems.filter((i) => i.isActive).length;
  }, [allItems]);

  return (
    <div className={cn("w-full flex flex-col", className)}>
      <div className="w-full mx-auto flex flex-col">
        {/* Верхняя шапка */}
        <QrHeader
          totalCount={allItems.length}
          activeCount={activeCount}
          onOpenCreate={() => setIsCreateOpen(true)}
          onOpenBatch={() => setIsBatchOpen(true)}
        />

        {/* Панель фильтров и поиска */}
        <QrFilterBar
          category={category}
          onSelectCategory={setCategory}
          search={search}
          onSearchChange={setSearch}
          onlyActive={onlyActive}
          onToggleOnlyActive={() => setOnlyActive((prev) => !prev)}
          counts={counts}
        />

        {/* Двухколоночный макет: таблица столов слева + предпросмотр справа */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start mt-2">
          {/* Левая колонка: Таблица */}
          <div className="xl:col-span-8 w-full min-w-0">
            <QrTable
              items={filteredItems}
              selectedId={selectedItem?.id || null}
              onSelectItem={(item) => setSelectedId(item.id)}
              isLoading={isQueryLoading}
            />
          </div>

          {/* Правая колонка: Карточка детального предпросмотра */}
          <div className="xl:col-span-4 w-full sticky top-6">
            <QrDetailCard
              item={selectedItem}
              onEdit={(item) => setEditingItem(item)}
              onDelete={(item) => setDeletingItem(item)}
              onToggleActive={handleToggleActive}
              isToggling={updateMutation.isPending}
              isLoading={isQueryLoading}
            />
          </div>
        </div>
      </div>

      {/* Модальное oho: Hban QR */}
      <CreateQrModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
      />

      {/* Модальное окно: Создать пакетом */}
      <BatchCreateQrModal
        open={isBatchOpen}
        onOpenChange={setIsBatchOpen}
        onSubmit={handleBatchCreate}
        isLoading={batchCreateMutation.isPending}
      />

      {/* Модальное окно: Изменить */}
      <EditQrModal
        item={editingItem}
        open={Boolean(editingItem)}
        onOpenChange={(open) => !open && setEditingItem(null)}
        onSubmit={handleUpdate}
        isLoading={updateMutation.isPending}
      />

      {/* Диалог подтверждения удаления */}
      <DeleteConfirmDialog
        item={deletingItem}
        open={Boolean(deletingItem)}
        onOpenChange={(open) => !open && setDeletingItem(null)}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
