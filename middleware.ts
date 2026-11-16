import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from '@/src/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Извлекаем языковой сегмент пути
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  const isLocalePrefix = routing.locales.includes(
    firstSegment as (typeof routing.locales)[number]
  );
  const currentLocale = isLocalePrefix ? firstSegment : routing.defaultLocale;

  // Путь без языкового префикса (например: "/ru/dj" -> "/dj", "/ru/g/123" -> "/g/123", "/auth" -> "/auth")
  const subPath = isLocalePrefix
    ? `/${segments.slice(1).join('/')}`
    : pathname;

  // 2. Проверяем наличие сессионной куки
  // В кросс-доменном проде (Vercel + Render) cookie 'session' имеет Domain=onrender.com
  // и по соображениям безопасности браузера не передается на домен vybe-lime.vercel.app.
  // Поэтому признаком авторизованной сессии на клиенте является 'trackup_session' или 'trackup_role'
  const sessionCookie =
    request.cookies.get('session')?.value ||
    request.cookies.get('connect.sid')?.value ||
    request.cookies.get('trackup_session')?.value ||
    request.cookies.get('trackup_role')?.value;
  const isAuthenticated = Boolean(sessionCookie && sessionCookie.trim() !== '');

  // 3. Проверяем выбранную роль пользователя
  const roleCookie = request.cookies.get('trackup_role')?.value;
  const hasSelectedRole = Boolean(roleCookie && roleCookie.trim() !== '');

  // 4. Классификация маршрутов
  const isGuestRoute = subPath === '/g' || subPath.startsWith('/g/');
  const isNewVerificationRoute =
    subPath === '/auth/new-verification' ||
    subPath.startsWith('/auth/new-verification');
  const isRoleSelectionStage =
    subPath === '/auth' && searchParams.get('stage') === 'role-selection';
  const isAuthRoute = subPath === '/auth' || subPath.startsWith('/auth/');

  // 5. ИЗОЛЯЦИЯ СТРАНИЦЫ АВТОРИЗАЦИИ ДЛЯ АВТОРИЗОВАННЫХ ПОЛЬЗОВАТЕЛЕЙ
  if (isAuthenticated) {
    // Разрешаем обработку токена из ссылки подтверждения email
    if (isNewVerificationRoute) {
      return intlMiddleware(request);
    }

    // Если пользователь еще не выбрал роль -> перенаправляем на этап выбора роли
    if (!hasSelectedRole) {
      if (!isRoleSelectionStage) {
        const roleSelectionUrl = new URL(
          `/${currentLocale}/auth`,
          request.url
        );
        roleSelectionUrl.searchParams.set('stage', 'role-selection');
        return NextResponse.redirect(roleSelectionUrl);
      }
      return intlMiddleware(request);
    }

    // Если роль выбрана и пользователь пытается зайти на /auth или на корень ("/" или "/ru") ->
    // изолируем страницу auth и перенаправляем в рабочее пространство
    if (isAuthRoute || subPath === '/' || subPath === '') {
      const destination = roleCookie === 'venue_owner' ? '/dashboard' : '/dashboard';
      return NextResponse.redirect(
        new URL(`/${currentLocale}${destination}`, request.url)
      );
    }
  }

  // 6. ЕСЛИ ПОЛЬЗОВАТЕЛЬ НЕ АВТОРИЗОВАН:
  // Доступ разрешен только к страницам гостей (/g/...) и странице авторизации (/auth, /auth/new-verification)
  if (!isAuthenticated && !isGuestRoute && !isAuthRoute) {
    const loginUrl = new URL(`/${currentLocale}/auth`, request.url);
    if (subPath !== '/' && subPath !== '') {
      loginUrl.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // 7. Передаем управление next-intl для обработки локализации (добавление префикса языка /ru/...)
  return intlMiddleware(request);
}

export const config = {
  // Применяем middleware ко всем путям, кроме системных файлов Next.js и статики
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
