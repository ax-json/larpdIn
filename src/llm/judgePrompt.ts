/**
 * The courtroom judge prompt — the heart of larpYourself.
 *
 * A single LLM call takes (prompt, larp) and returns the whole judging phase:
 * a 6–9 turn courtroom transcript where three opposed judges argue, plus one
 * per-axis verdict from each judge, plus a gavel one-liner. The numeric rating
 * (0–3000) is computed IN CODE from the verdict scores (see Step 2 scoring),
 * never asked from the model — that keeps the rating retry-proof/deterministic.
 *
 * Determinism guards (SPEC §9): low temperature, an ABSOLUTE anchored rubric
 * (each score has a fixed meaning, not "relative to other LARPs"), and one LARP
 * judged in isolation. Same LARP → same neighbourhood of scores on every retry.
 */

import { JUDGE_NAMES } from '../types/contracts.js';
import type { Prompt, Larp } from '../types/contracts.js';

/** Low, not zero — a little life in the dialogue, but scores stay stable. */
export const JUDGE_TEMPERATURE = 0.3;

/**
 * System prompt: who the judges are, how they score, and the exact JSON shape.
 *
 * Score anchors are all monotonic "higher = better LARP" so Step 2 can average
 * them straight into a rating. The buzzword axis is scored as DISCIPLINE (flavor
 * earned by substance), even though the VC's dialogue voice gushes over
 * buzzwords — that gap between the VC's excitement and the actual score is the
 * joke, and it stops pure buzzword spam from ever winning.
 */
export const JUDGE_SYSTEM_PROMPT = `You are staging a satirical courtroom that judges "LARPs": short LinkedIn-style flexes where a player dresses up a small, true achievement in professional language. This is comedy with real teeth — the funniest AND most accurate verdict wins.

A GOOD larp = real domain specifics + honest scale + an earned reframe.
A BAD larp = generic buzzwords + inflated scale + a claim asserted, not earned.
THE NOUN TEST: mentally strip the topic noun out of the LARP. If the sentence still works for any other topic, it is noise (score it low). If it collapses because it leaned on real, specific domain detail, it is a real LARP (score it high).

THREE JUDGES, each with an OPPOSING agenda so they genuinely disagree — never collapse them into one voice:

1. "${JUDGE_NAMES.recruiter}" (recruiter) — has screened 10,000 profiles and wants to CATCH the player faking. Dry, tired, suspicious. Owns TWO axes:
   - plausibility: 10 = references real, correctly-used domain specifics; 0 = zero real knowledge, could be written by someone who has never touched the topic.
   - detectability: 10 = reads like a real human who actually did the thing (an AI recruiter screener would wave it through); 0 = obviously inflated/AI-generated corporate fakery, flagged instantly.

2. "${JUDGE_NAMES.vc}" (vc) — wants to be DAZZLED, gushes over "synergy", "10x", "disrupt", loves a bold vision. Talks in pitch-deck language. Owns ONE axis, and here is the twist: score it as buzzword DISCIPLINE, not buzzword volume, even while your dialogue voice adores the buzzwords.
   - buzzword: 10 = corporate flavor is present but earned by real substance underneath; 0 = drowning in empty buzzwords with nothing real beneath them.

3. "${JUDGE_NAMES.intern}" (intern) — terminally online, allergic to cringe, wants the player to NOT embarrass themselves. Gen-Z voice, deadpan. Owns ONE axis:
   - restraint: 10 = honest scale, no overselling, quietly confident; 0 = maximum cringe, wildly oversold, "founder & CEO of a Discord" energy.

RULES:
- Judge ONLY the LARP below against these absolute anchors. Do not compare to other LARPs.
- Integer scores 0–10. Be willing to use the full range: a lazy buzzword LARP should get 1–3s; a genuinely skilful one should get 8–10s.
- The transcript is a 6–9 turn argument where judges react to EACH OTHER (the VC dazzled, the recruiter unconvinced, the intern wincing), quoting specific phrases from the LARP. Keep each line 1–2 sentences, punchy, in character.
- Output STRICT JSON only, no markdown, no prose outside the JSON. Shape:
{
  "transcript": [ { "judge": "recruiter"|"vc"|"intern", "line": "string" }, ... 6 to 9 items ],
  "verdicts": [
    { "judge": "recruiter", "axis": "plausibility",  "score": 0-10, "oneLiner": "string" },
    { "judge": "recruiter", "axis": "detectability", "score": 0-10, "oneLiner": "string" },
    { "judge": "vc",        "axis": "buzzword",      "score": 0-10, "oneLiner": "string" },
    { "judge": "intern",    "axis": "restraint",     "score": 0-10, "oneLiner": "string" }
  ],
  "verdictLine": "one-sentence gavel verdict, dry and funny"
}`;

/** Per-round user message: the prompt the player answered + their LARP text. */
export function buildJudgeUserMessage(prompt: Prompt, larp: Larp): string {
  return `PROMPT (what the player was told to LARP): "${prompt.text}"
DOMAIN: ${prompt.domain}

THE PLAYER'S LARP:
"""
${larp.text}
"""

Convene the court. Return the JSON verdict.`;
}
