/**
 * Детерминированное форматирование чисел и сумм (UZS / валюта).
 * Гарантирует абсолютное совпадение строк между SSR (сервером) и клиентом,
 * предотвращая ошибки hydration mismatch из-за различий в Intl/ICU окружениях.
 */
export function formatCurrency(
  value: number,
  _currency = 'UZS',
  _locale = 'uz-UZ',
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0'
  }

  // Округляем до целого и разделяем тысячи неразрывным или стандартным пробелом
  const rounded = Math.round(value)
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return formatted
}