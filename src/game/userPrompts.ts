/**
 * User-suggested LARP topics — the ONLY path into the shared prompt pool.
 *
 * validatePrompt() is the gate: every submission crosses /api/validate-prompt
 * (one server-side LLM classification; the key never ships to the browser) and
 * FAILS CLOSED on any transport error, timeout, or malformed response. Only an
 * explicit { ok: true } from the gate lets a topic be stored as approved.
 *
 * Approved topics convert 1:1 into the same `Prompt` shape the round loop
 * already draws (src/game/prompts.ts merges them into its pool), so nothing
 * downstream — judge, scoring, courtroom — changes. The gate's interface is
 * stable: tighten the server rubric freely without touching callers.
 */

import type { Prompt, PromptCategory, UserPrompt } from '../types/contracts';
import { PROMPT_CATEGORIES } from '../types/contracts';

/** Result of the validation gate. `reason` is set only when `ok` is false. */
export interface PromptValidation {
  ok: boolean;
  category?: PromptCategory;
  reason?: string;
}

/** A LARP topic is a short noun phrase — same bounds the server re-checks. */
export const MIN_TOPIC_CHARS = 3;
export const MAX_TOPIC_CHARS = 80;

/**
 * The reason attached when the gate itself was unreachable (network, timeout,
 * 5xx). Distinct from a rejection so the UI can show an "error" state — but
 * still fail-closed: nothing gets stored either way.
 */
export const GATE_ERROR_REASON = 'The court is in recess. Try again in a moment.';

const VALIDATE_URL = '/api/validate-prompt';
const VALIDATE_TIMEOUT_MS = 30_000;
const GENERIC_REJECTION = 'The court declined this topic.';

const STORE_KEY = 'larpedin:userPrompts';
const MAX_STORED_PROMPTS = 50;

const CATEGORY_SET = new Set<string>(PROMPT_CATEGORIES);
const FALLBACK_CATEGORY: PromptCategory = 'everyday';

/**
 * The gate. All submissions flow through here; there is no other path to an
 * approved topic. Returns { ok: true, category } only when the server's AI
 * check explicitly approved — every failure mode maps to { ok: false }.
 */
export async function validatePrompt(
  text: string,
  category?: PromptCategory
): Promise<PromptValidation> {
  try {
    const res = await fetch(VALIDATE_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text, category }),
      signal: AbortSignal.timeout(VALIDATE_TIMEOUT_MS),
    });
    if (!res.ok) {
      return { ok: false, reason: GATE_ERROR_REASON };
    }

    const data: unknown = await res.json();
    if (typeof data !== 'object' || data === null) {
      return { ok: false, reason: GATE_ERROR_REASON };
    }
    const verdict = data as { ok?: unknown; category?: unknown; reason?: unknown };

    if (verdict.ok === true) {
      const approvedCategory = CATEGORY_SET.has(verdict.category as string)
        ? (verdict.category as PromptCategory)
        : (category ?? FALLBACK_CATEGORY);
      return { ok: true, category: approvedCategory };
    }
    return {
      ok: false,
      reason: typeof verdict.reason === 'string' ? verdict.reason : GENERIC_REJECTION,
    };
  } catch {
    // Fail closed: unreachable gate = no approval, ever.
    return { ok: false, reason: GATE_ERROR_REASON };
  }
}

/** Build the record for a topic the gate just approved. */
export function buildApprovedPrompt(text: string, category: PromptCategory): UserPrompt {
  return {
    id: `user-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    text: text.trim(),
    category,
    submittedAt: Date.now(),
    status: 'approved',
  };
}

/** Shape check for one stored record — localStorage is a trust boundary. */
function isStoredUserPrompt(value: unknown): value is UserPrompt {
  if (typeof value !== 'object' || value === null) return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p.id === 'string' &&
    p.id.length > 0 &&
    typeof p.text === 'string' &&
    p.text.trim().length >= MIN_TOPIC_CHARS &&
    p.text.length <= MAX_TOPIC_CHARS &&
    CATEGORY_SET.has(p.category as string) &&
    typeof p.submittedAt === 'number' &&
    Number.isFinite(p.submittedAt) &&
    p.status === 'approved'
  );
}

/** Read the approved store, dropping anything malformed or tampered-with. */
function readStore(): UserPrompt[] {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isStoredUserPrompt);
  } catch {
    return [];
  }
}

/** Persist an approved topic. Keeps the newest MAX_STORED_PROMPTS. */
export function saveApprovedPrompt(prompt: UserPrompt): void {
  try {
    const next = [...readStore(), prompt].slice(-MAX_STORED_PROMPTS);
    localStorage.setItem(STORE_KEY, JSON.stringify(next));
  } catch {
    // Storage full/unavailable — the round still works off the seeded bank.
  }
}

/**
 * Approved topics as regular `Prompt`s — same shape as the seeded bank, so
 * the round loop draws them with zero downstream changes. No pre-filled
 * example; the composer placeholder covers user topics.
 */
export function getApprovedUserPrompts(): Prompt[] {
  return readStore().map((p) => ({
    id: p.id,
    text: p.text,
    domain: p.category,
    tier: 'mundane' as const,
  }));
}
