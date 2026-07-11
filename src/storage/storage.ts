/**
 * Storage layer for larpYourself.
 *
 * A minimal interface (`Storage`) with a localStorage-backed implementation.
 * Callers depend on the interface, never on localStorage directly, so a real
 * DB can be swapped in later without touching game logic or UI (SPEC §5).
 *
 * Persists exactly what the game uses: the local player profile (best rating
 * + round history). localStorage is external data — everything read back is
 * shape-validated before the game trusts it.
 */

import type { Player, HistoryEntry } from '../types/contracts';
import { MAX_RATING } from '../game/scoring';

const PLAYER_KEY = 'larpyourself:player';

const DEFAULT_PLAYER: Player = {
  bestRating: 0,
  history: [],
};

export interface Storage {
  getPlayer(): Player;
  savePlayer(player: Player): void;
}

/** True if the value is a finite rating inside the game's range. */
function isValidRating(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= MAX_RATING;
}

function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (typeof value !== 'object' || value === null) return false;
  const entry = value as Record<string, unknown>;
  return typeof entry.promptId === 'string' && isValidRating(entry.rating);
}

/**
 * Validate a parsed player blob. Anything malformed (tampered devtools edits,
 * a stale schema from an old build) falls back to the default player rather
 * than crashing the UI mid-demo.
 */
function sanitizePlayer(value: unknown): Player {
  if (typeof value !== 'object' || value === null) return DEFAULT_PLAYER;
  const raw = value as Record<string, unknown>;
  if (!isValidRating(raw.bestRating) || !Array.isArray(raw.history)) return DEFAULT_PLAYER;
  return {
    bestRating: raw.bestRating,
    history: raw.history.filter(isHistoryEntry),
  };
}

export function createLocalStorage(): Storage {
  return {
    getPlayer() {
      try {
        const raw = localStorage.getItem(PLAYER_KEY);
        if (raw === null) return DEFAULT_PLAYER;
        return sanitizePlayer(JSON.parse(raw));
      } catch {
        return DEFAULT_PLAYER;
      }
    },

    savePlayer(player: Player) {
      try {
        localStorage.setItem(PLAYER_KEY, JSON.stringify(player));
      } catch (err) {
        // Quota or serialization failure — surface it, don't swallow silently.
        console.error('[storage] failed to save player:', err);
      }
    },
  };
}

/** Shared app-wide storage instance. */
export const storage = createLocalStorage();
