/**
 * Client-side judge service — the UI's single door to a verdict.
 *
 * Two paths, one return type:
 *   - live: POST /api/judge (the serverless function calls Claude).
 *   - mock: a cached fixture, for the mock-judge toggle and for any live failure
 *     (no key, offline, 404 in local dev, a flaky 1 AM network). The demo never
 *     hard-fails — worst case it shows a canned courtroom (SPEC §9 insurance).
 */

import type { Prompt, Larp, CourtroomResult } from '../types/contracts';
import { FIXTURE_CLASH_GOOD, FIXTURE_CLASH_BAD, FIXTURE_ISEF_GOOD, FIXTURE_GENERIC_MID } from '../llm/mockCourtroom';

/**
 * Deterministic fixture pick. Prompts with a dedicated fixture get it (an ISEF
 * round is never roasted about elixir); everything else gets the domain-neutral
 * one, so mock dialogue never contradicts the prompt on screen.
 */
export function pickMockResult(larpText: string, promptId = ''): CourtroomResult {
  let hash = 0;
  for (let i = 0; i < larpText.length; i++) {
    hash = (hash * 31 + larpText.charCodeAt(i)) | 0;
  }
  if (promptId.includes('isef')) return FIXTURE_ISEF_GOOD;
  if (promptId.includes('clash')) return Math.abs(hash) % 2 === 0 ? FIXTURE_CLASH_GOOD : FIXTURE_CLASH_BAD;
  return FIXTURE_GENERIC_MID;
}

/** Hard ceiling on a live verdict — past this the show must go on with a fixture. */
// Featherless-hosted Qwen measures ~35-40s end to end for a full courtroom —
// stay just under the server's 60s maxDuration so slow rounds still land live.
const LIVE_TIMEOUT_MS = 55_000;

/** Hit the live serverless judge. Throws on any non-200 or timeout so the caller can fall back. */
async function judgeLarpLive(prompt: Prompt, larp: Larp): Promise<CourtroomResult> {
  const res = await fetch('/api/judge', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ prompt, larp }),
    signal: AbortSignal.timeout(LIVE_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`judge api ${res.status}`);
  return (await res.json()) as CourtroomResult;
}

export interface JudgeOutcome {
  result: CourtroomResult;
  /** True if the verdict came from a fixture rather than the live model. */
  usedMock: boolean;
}

/**
 * Judge a LARP. Tries the live model and silently falls back to a fixture on
 * any error — the game must always reach a courtroom.
 */
export async function judgeLarp(prompt: Prompt, larp: Larp): Promise<JudgeOutcome> {
  try {
    const result = await judgeLarpLive(prompt, larp);
    return { result, usedMock: false };
  } catch (err) {
    console.warn('[judge] live call failed, using mock fixture:', err);
    return { result: pickMockResult(larp.text, prompt.id), usedMock: true };
  }
}
