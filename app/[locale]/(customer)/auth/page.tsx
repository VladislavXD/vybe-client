import React from 'react'
import { AuthContainer } from '@/components/auth'

export function generateStaticParams() {
  return [{ locale: 'ru' }, { locale: 'en' }]
}

/**
 * Единая страница авторизации и регистрации.
 * Содержит многоэтапный флоу:
 * 1. Выбор Вход / Регистрация и заполнение полей
 * 2. Подтверждение почты через 6-значный код (OTP)
 * 3. Экран успешного завершения
 */
export default function AuthPage() {
  return <AuthContainer initialMode="login" />
}