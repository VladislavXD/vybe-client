'use client'

import React from 'react'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { AuthButton } from '../ui/AuthButton'
import { RoleStepHeader } from './RoleStepHeader'
import { RoleCard } from './RoleCard'
import { RoleFeatureList } from './RoleFeatureList'
import { RoleInviteInput } from './RoleInviteInput'
import { ROLE_OPTIONS } from './constants'
import { useRoleSelection } from './useRoleSelection'
import type { RoleSelectionFormProps } from './types'

/**
 * Этап 3 регистрации: Выбор роли пользователя (Владелец заведения / DJ).
 * Оптимизирован, декомпозирован и готов к продакшену.
 */
export function RoleSelectionForm({
  initialRole = 'dj',
  onSelectRole,
  onBack,
  isLoading = false,
}: RoleSelectionFormProps) {
  const {
    selectedRole,
    setSelectedRole,
    inviteCode,
    setInviteCode,
    isSubmitting,
    error,
    handleSubmit,
  } = useRoleSelection({
    initialRole,
    onSubmit: onSelectRole,
  })

  const currentOption = ROLE_OPTIONS[selectedRole]
  const busy = isLoading || isSubmitting

  return (
    <div className="flex flex-col gap-5 animate-in fade-in-0 duration-200">
      {/* Шапка шага */}
      <RoleStepHeader
        currentStep={3}
        totalSteps={3}
        title="Выберите вашу роль"
        subtitle="Настройте аккаунт под ваши задачи. Роль определит рабочее пространство и доступные модули."
      />

      {/* Вывод ошибки */}
      {error && (
        <div className="px-3.5 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[12px] font-medium leading-relaxed">
          {error}
        </div>
      )}

      {/* Список карточек ролей (Radio Group) */}
      <div
        role="radiogroup"
        aria-label="Выбор роли пользователя"
        className="flex flex-col gap-3"
      >
        <RoleCard
          option={ROLE_OPTIONS.venue_owner}
          isSelected={selectedRole === 'venue_owner'}
          onSelect={() => setSelectedRole('venue_owner')}
          disabled={busy}
        />

        <RoleCard
          option={ROLE_OPTIONS.dj}
          isSelected={selectedRole === 'dj'}
          onSelect={() => setSelectedRole('dj')}
          disabled={busy}
        />
      </div>

      {/* Список преимуществ выбранной роли */}
      <RoleFeatureList
        benefits={currentOption.benefits}
        roleTitle={currentOption.shortTitle}
      />

      {/* Для DJ: возможность сразу ввести инвайт от клуба */}
      {selectedRole === 'dj' && (
        <RoleInviteInput
          value={inviteCode}
          onChange={setInviteCode}
          disabled={busy}
        />
      )}

      {/* Кнопки действий */}
      <div className="flex flex-col gap-2.5 pt-1">
        <AuthButton
          type="button"
          variant="primary"
          onClick={handleSubmit}
          isLoading={busy}
          rightIcon={<ArrowRight className="size-4" strokeWidth={2.5} />}
        >
          {currentOption.ctaText}
        </AuthButton>

        {onBack && (
          <AuthButton
            type="button"
            variant="ghost"
            onClick={onBack}
            disabled={busy}
            leftIcon={<ArrowLeft className="size-3.5" />}
          >
            Вернуться назад
          </AuthButton>
        )}
      </div>

      {/* Сноска о гибкости ролевой модели */}
      <p className="text-center text-[11px] text-white/30 leading-relaxed px-4">
        В соответствии со спецификацией TrackUp, вы сможете привязать несколько заведений или переключаться между ролями в настройках профиля.
      </p>
    </div>
  )
}
