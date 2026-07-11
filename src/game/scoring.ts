/**
 * Scoring math for LARPedIn — pure functions, no I/O, no LLM.
 *
 * The LLM returns transcript + verdicts; everything numeric is computed here in
 * code so a retry can never change the rating (determinism guard, SPEC §9).
 *
 * Rating: mean of the four axis scores (0–10), scaled to the 0–3000 chess-style
 * ceiling. All four axes are anchored "higher = better LARP", so a straight
 * average is the whole formula — no per-axis weighting, no sign flips.
 */

import type { Verdict, CourtroomResult, Band, Player, HistoryEntry } from '../types/contracts';

export const MAX_RATING = 3000;
const MAX_AXIS_SCORE = 10;
/** Most recent rounds kept in history — enough for stats, bounded for localStorage. */
const HISTORY_LIMIT = 100;

/** Rating bands, ordered low → high. `min` is inclusive; the last band tops out at MAX_RATING. */
const BANDS: ReadonlyArray<{ band: Band; min: number }> = [
  { band: 'Noise', min: 0 },
  { band: 'Intern', min: 900 },
  { band: 'Associate', min: 1500 },
  { band: 'Thought Leader', min: 2100 },
  { band: 'Grandmaster LARPer', min: 2600 },
] as const;

/** Clamp to a closed integer range. Guards against a model returning 11 or -1. */
function clampScore(score: number): number {
  if (Number.isNaN(score)) return 0;
  return Math.max(0, Math.min(MAX_AXIS_SCORE, Math.round(score)));
}

/**
 * Compute the 0–3000 rating from the judges' verdicts.
 * mean(axis scores) / 10 * 3000, rounded, clamped. Empty verdicts → 0.
 */
export function computeRating(verdicts: Verdict[]): number {
  if (verdicts.length === 0) return 0;
  const total = verdicts.reduce((sum, v) => sum + clampScore(v.score), 0);
  const mean = total / verdicts.length; // 0–10
  const rating = Math.round((mean / MAX_AXIS_SCORE) * MAX_RATING);
  return Math.max(0, Math.min(MAX_RATING, rating));
}

/** Map a rating to its band. Scans high → low and returns the first band cleared. */
export function bandFor(rating: number): Band {
  for (let i = BANDS.length - 1; i >= 0; i--) {
    if (rating >= BANDS[i].min) return BANDS[i].band;
  }
  return 'Noise';
}

/**
 * Attach the computed rating to a raw LLM result (transcript + verdicts +
 * verdictLine). The single place a CourtroomResult gets its number, so live and
 * mock paths agree. Verdict scores are clamped to the 0–10 integer contract
 * before anything renders them; `rating` on the input is ignored and recomputed.
 */
export function finalizeCourtroom(
  raw: Omit<CourtroomResult, 'rating'> & { rating?: number },
): CourtroomResult {
  const verdicts = raw.verdicts.map((v) => ({ ...v, score: clampScore(v.score) }));
  return {
    transcript: raw.transcript,
    verdicts,
    verdictLine: raw.verdictLine,
    rating: computeRating(verdicts),
  };
}

/**
 * Return a NEW player with this round folded in (immutable — never mutate the
 * passed player). Appends to history (bounded to the most recent HISTORY_LIMIT
 * rounds) and raises bestRating only if beaten.
 */
export function applyRound(player: Player, promptId: string, rating: number): Player {
  const entry: HistoryEntry = { promptId, rating };
  return {
    ...player,
    bestRating: Math.max(player.bestRating, rating),
    history: [...player.history, entry].slice(-HISTORY_LIMIT),
  };
}

/** True if this rating sets a new personal best (strictly beats the old one). */
export function isNewBest(player: Player, rating: number): boolean {
  return rating > player.bestRating;
}
