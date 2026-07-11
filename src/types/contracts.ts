/**
 * Core data contracts for LARPedIn.
 *
 * These shapes are the source of truth for the whole app: the LLM courtroom
 * call, the scoring math, the storage layer, and the UI all agree on them.
 * Defined up front (SPEC §6) so nothing downstream gets rewritten when a field
 * changes. Types only — no logic lives here.
 */

// ---------------------------------------------------------------------------
// Judges & rubric axes
// ---------------------------------------------------------------------------

/** The three courtroom judges. Each owns one rubric axis with an opposing win condition. */
export type Judge = 'recruiter' | 'vc' | 'intern';

/** The four scoring axes. Judges score each 0–10 against an anchored rubric. */
export type Axis = 'plausibility' | 'restraint' | 'buzzword' | 'detectability';

export const JUDGE_NAMES: Record<Judge, string> = {
  recruiter: 'The Burnt-out Recruiter',
  vc: 'The Buzzword VC',
  intern: 'The Gen-Z Intern',
} as const;

// ---------------------------------------------------------------------------
// Prompts & LARPs
// ---------------------------------------------------------------------------

/** Difficulty/prestige tier of a prompt. Mundane tests creativity; prestige tests restraint. */
export type PromptTier = 'mundane' | 'mid' | 'prestige';

/** A challenge served to the player. */
export interface Prompt {
  id: string;
  text: string;
  /** Short domain label, e.g. "gaming", "academia". Used for flavor + judge context. */
  domain: string;
  tier: PromptTier;
}

/** One paragraph of LARP written by the player for a given prompt. */
export interface Larp {
  id: string;
  promptId: string;
  text: string;
}

// ---------------------------------------------------------------------------
// User-submitted prompts (community topics behind an AI safety gate)
// ---------------------------------------------------------------------------

/**
 * Every domain a prompt can carry. Doubles as the category dropdown in the
 * submission UI and the allowlist the validation gate classifies against.
 */
export const PROMPT_CATEGORIES = [
  'gaming',
  'community',
  'home',
  'everyday',
  'academia',
  'work',
  'fitness',
  'travel',
  'food',
  'hobbies',
  'nature',
  'digital',
] as const;

export type PromptCategory = (typeof PROMPT_CATEGORIES)[number];

/** Moderation outcome of a submitted topic. Only 'approved' ever reaches the pool. */
export type UserPromptStatus = 'approved' | 'rejected' | 'pending';

/**
 * A player-suggested LARP topic. Approved ones convert 1:1 into the `Prompt`
 * shape above (id/text/domain/tier), so the round loop needs no changes.
 */
export interface UserPrompt {
  id: string;
  text: string;
  category: PromptCategory;
  /** Epoch ms when the player submitted it. */
  submittedAt: number;
  status: UserPromptStatus;
}

// ---------------------------------------------------------------------------
// The courtroom result (single LLM call returns all of this)
// ---------------------------------------------------------------------------

/** One line of courtroom dialogue from one judge. Transcript is hard-capped at 6–9 turns. */
export interface TranscriptTurn {
  judge: Judge;
  line: string;
}

/** One judge's score on one axis, with a one-line justification. */
export interface Verdict {
  judge: Judge;
  axis: Axis;
  /** 0–10, integer, against the anchored rubric. */
  score: number;
  oneLiner: string;
}

/**
 * The full output of the judging phase. The LLM returns transcript + verdicts;
 * `rating` is computed in code from the verdict scores (retry-proof), NOT asked
 * from the model. `verdictLine` is the gavel one-liner.
 */
export interface CourtroomResult {
  transcript: TranscriptTurn[];
  verdicts: Verdict[];
  /** 0–3000, computed from verdict scores in Step 2. */
  rating: number;
  verdictLine: string;
}

// ---------------------------------------------------------------------------
// Rating bands (0–3000, chess-style ceiling)
// ---------------------------------------------------------------------------

export type Band =
  | 'Noise'
  | 'Intern'
  | 'Associate'
  | 'Thought Leader'
  | 'Grandmaster LARPer';

// ---------------------------------------------------------------------------
// Player (persisted locally)
// ---------------------------------------------------------------------------

/** A single completed round in the player's history. */
export interface HistoryEntry {
  promptId: string;
  rating: number;
}

/** The local player profile. Personal best is the replay loop. */
export interface Player {
  bestRating: number;
  history: HistoryEntry[];
}
