import { FetchClient } from '@/src/utils/fetch';
import type { RequestOptions } from '@/src/utils/fetch/fetch-types';

export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:5000';

/**
 * HTTP-клиент приложения на базе FetchClient.
 * Авторизация работает исключительно через HttpOnly Session Cookies:
 * Все запросы выполняются с credentials: 'include'.
 */
class AppFetchClient extends FetchClient {
  public constructor() {
    super({
      baseUrl: SERVER_URL,
      options: {
        credentials: 'include',
      },
    });
  }

  public override get<T>(endpoint: string, options: Omit<RequestOptions, 'body'> = {}) {
    return super.get<T>(endpoint, {
      ...options,
      credentials: 'include',
    });
  }

  public override post<T>(
    endpoint: string,
    body?: Record<string, any> | FormData,
    options: RequestOptions = {}
  ) {
    return super.post<T>(endpoint, body, {
      ...options,
      credentials: 'include',
    });
  }

  public override put<T>(
    endpoint: string,
    body?: Record<string, any> | FormData,
    options: RequestOptions = {}
  ) {
    return super.put<T>(endpoint, body, {
      ...options,
      credentials: 'include',
    });
  }

  public override patch<T>(
    endpoint: string,
    body?: Record<string, any> | FormData,
    options: RequestOptions = {}
  ) {
    return super.patch<T>(endpoint, body, {
      ...options,
      credentials: 'include',
    });
  }

  public override delete<T>(endpoint: string, options: Omit<RequestOptions, 'body'> = {}) {
    return super.delete<T>(endpoint, {
      ...options,
      credentials: 'include',
    });
  }
}

export const apiClient = new AppFetchClient();
