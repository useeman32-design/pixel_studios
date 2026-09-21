import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Groq integration — the AI endpoint for Pixel AI.
 *
 * Until the owner dashboard exists, the API key is pasted once in
 * "AI Connection" (Profile → AI Connection) and stored locally on device.
 * All requests go straight to the Groq chat-completions endpoint.
 */

const KEY_STORAGE = 'ps_groq_key';
const MODEL_STORAGE = 'ps_groq_model';
export const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

export const GROQ_MODELS = [
  { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B · recommended' },
  { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B · fastest' },
  { id: 'openai/gpt-oss-120b', label: 'GPT-OSS 120B' },
  { id: 'gemma2-9b-it', label: 'Gemma 2 9B' },
];

export const DEFAULT_MODEL = GROQ_MODELS[0].id;

export async function getGroqKey(): Promise<string> {
  try {
    return (await AsyncStorage.getItem(KEY_STORAGE)) || '';
  } catch {
    return '';
  }
}

export async function saveGroqKey(key: string) {
  try {
    await AsyncStorage.setItem(KEY_STORAGE, key.trim());
  } catch {
    /* ignore */
  }
}

export async function getGroqModel(): Promise<string> {
  try {
    return (await AsyncStorage.getItem(MODEL_STORAGE)) || DEFAULT_MODEL;
  } catch {
    return DEFAULT_MODEL;
  }
}

export async function saveGroqModel(model: string) {
  try {
    await AsyncStorage.setItem(MODEL_STORAGE, model);
  } catch {
    /* ignore */
  }
}

export type ChatMsg = { role: 'system' | 'user' | 'assistant'; content: string };

const SYSTEM_PROMPT = `You are Pixel AI, the assistant for Pixel Studios — a creative technology and printing company in Gusau, Nigeria.
You help customers choose and order: business cards and NFC smart cards (from ₦15,000), digital menus for restaurants (from ₦25,000), brand identity & logo design, flyers, banners, packaging, and mobile/web apps.
Be warm, brief (under 120 words unless asked), practical, and quote prices in Naira (₦).
When a customer is ready to order, guide them to the matching screen in the app and mention that orders can also be placed over WhatsApp at +234 903 152 8732.`;

/** Send a conversation to Groq and return the assistant text. Throws on failure. */
export async function askGroq(history: ChatMsg[]): Promise<string> {
  const key = await getGroqKey();
  if (!key) throw new Error('no-key');
  const model = await getGroqModel();

  const res = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`groq-${res.status}: ${body.slice(0, 140)}`);
  }
  const json = await res.json();
  const text = json?.choices?.[0]?.message?.content;
  if (!text) throw new Error('empty-reply');
  return text.trim();
}

/** Light connectivity check used by the settings screen. */
export async function testGroq(): Promise<{ ok: boolean; message: string }> {
  try {
    const reply = await askGroq([{ role: 'user', content: 'Reply with exactly: connected' }]);
    return { ok: true, message: reply.slice(0, 60) };
  } catch (e: any) {
    const msg = String(e?.message || e);
    if (msg.includes('401')) return { ok: false, message: 'Invalid API key — check and paste it again.' };
    if (msg === 'no-key') return { ok: false, message: 'No API key saved yet.' };
    return { ok: false, message: `Could not reach Groq (${msg.slice(0, 80)})` };
  }
}
