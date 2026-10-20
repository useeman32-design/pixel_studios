/**
 * Pixel Studios API client (PHP + MySQL backend — see /backend).
 *
 * ▸ AFTER DEPLOYING THE BACKEND, put its URL here (no trailing slash):
 *     export const API_BASE = 'https://yourdomain.com/api';
 *   Local XAMPP:  http://10.0.2.2/pixel-api  (Android emulator)
 *                 http://localhost/pixel-api (web / iOS simulator)
 */
export const API_BASE = '';

export type ApiUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  about: string;
  instagram: string;
  x: string;
  facebook: string;
  linkedin: string;
  website: string;
  createdAt?: string | null;
};

export function apiConfigured(): boolean {
  return API_BASE.trim().length > 0;
}

type ApiOptions = {
  method?: 'GET' | 'POST';
  body?: Record<string, unknown>;
  token?: string | null;
};

/**
 * Calls the backend and unwraps the JSON envelope.
 * Throws an Error with a human-readable message on any failure.
 */
export async function api<T = any>(path: string, opts: ApiOptions = {}): Promise<T> {
  if (!apiConfigured()) {
    throw new Error(
      'The studio account server is not connected yet. Set API_BASE in src/lib/api.ts after deploying backend/ to your PHP host.',
    );
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;

  let res: Response;
  try {
    res = await fetch(`${API_BASE.replace(/\/$/, '')}/${path.replace(/^\//, '')}`, {
      method: opts.method ?? 'GET',
      headers,
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });
  } catch {
    throw new Error('Cannot reach the studio server. Check your internet connection and try again.');
  }

  let json: any = null;
  try {
    json = await res.json();
  } catch {
    /* non-JSON response — handled below */
  }

  if (!res.ok || !json?.ok) {
    const message =
      (json && typeof json.error === 'string' && json.error) ||
      (res.status === 404
        ? 'Account endpoint not found — is backend/ uploaded to the server?'
        : `Request failed (${res.status}). Please try again.`);
    throw new Error(message);
  }

  return json as T;
}
