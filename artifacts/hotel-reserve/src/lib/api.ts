import { customFetch, ApiError, CustomFetchOptions } from '@workspace/api-client-react';
import { getAuth, setAuth } from './auth';

async function refreshAccessToken(): Promise<string | null> {
  const auth = getAuth();
  if (!auth) return null;
  try {
    const res = await customFetch<{ access: string }>('/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: auth.refreshToken }),
    });
    const next = { ...auth, accessToken: res.access };
    setAuth(next);
    return res.access;
  } catch {
    setAuth(null);
    return null;
  }
}

export async function apiFetch<T = unknown>(input: string, options: CustomFetchOptions = {}): Promise<T> {
  const auth = getAuth();
  const headers = new Headers(options.headers);
  if (auth && !headers.has('authorization')) {
    headers.set('authorization', `Bearer ${auth.accessToken}`);
  }

  try {
    return await customFetch<T>(input, { ...options, headers });
  } catch (err) {
    if (err instanceof ApiError && err.status === 401 && auth) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        const retryHeaders = new Headers(options.headers);
        retryHeaders.set('authorization', `Bearer ${newToken}`);
        return await customFetch<T>(input, { ...options, headers: retryHeaders });
      }
    }
    throw err;
  }
}

function firstString(value: unknown): string | undefined {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = firstString(item);
      if (found) return found;
    }
  }
  return undefined;
}

export function getErrorMessage(err: unknown, fallback = 'Bir hata oluştu. Lütfen tekrar deneyin.'): string {
  if (err instanceof ApiError) {
    const data = err.data as { detail?: string; errors?: unknown } | null;
    // `errors` is either a dict of field -> messages[] (serializer validation)
    // or a plain array of strings (a raised ValidationError with no field).
    const fromErrors = data?.errors
      ? firstString(Array.isArray(data.errors) ? data.errors : Object.values(data.errors as Record<string, unknown>))
      : undefined;
    if (fromErrors) return fromErrors;
    if (data?.detail) return data.detail;
    return err.message || fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}
