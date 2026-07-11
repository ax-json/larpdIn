/**
 * Cached courtroom verdicts — mock-judge mode + demo insurance (SPEC §9).
 *
 * These are hand-authored CourtroomResult fixtures captured during the Step 1
 * go/no-go gate: the judge prompt was run against the LARP_EXAMPLES calibration
 * pairs and the good/bad separation held (good → Thought Leader, bad → Noise).
 * They let the whole game run with NO API key (offline demo) and give the live
 * LLM path a guaranteed fallback if a 1 AM call flakes.
 *
 * Ratings here are already computed with the Step 2 formula:
 *   rating = round(mean(plausibility, detectability, buzzword, restraint) / 10 * 3000)
 * so fixtures stay consistent with live results.
 */

import type { CourtroomResult } from '../types/contracts';

/** Good LARP — Clash Royale (real specifics + honest scale). mean 8.5 → 2550. */
export const FIXTURE_CLASH_GOOD: CourtroomResult = {
  transcript: [
    { judge: 'vc', line: 'A "constrained elixir economy under a hard tempo constraint"? That is a founder who thinks in unit economics. I would wire this person a seed round.' },
    { judge: 'recruiter', line: 'It is a mobile game. But... "punished on the counter-push", "reading a win condition from incomplete information" — that is real. I have read 10,000 profiles and I cannot find the lie.' },
    { judge: 'intern', line: 'ok the "~5,800 personal ceiling" instead of saying they were world champ? restraint. no notes. slightly obsessed with elixir but we move.' },
    { judge: 'vc', line: 'Obsessed is just conviction with better PR. This is a resource-allocation savant.' },
    { judge: 'recruiter', line: 'It is a kid who was good at Clash Royale. But he told me exactly HOW he was good, which is more than most senior candidates manage.' },
    { judge: 'intern', line: 'the "more than most things labeled leadership" line was a little smug but honestly? earned it.' },
    { judge: 'recruiter', line: 'Passes the screener. I would not flag this. Reluctantly.' },
  ],
  verdicts: [
    { judge: 'recruiter', axis: 'plausibility', score: 9, oneLiner: 'Every term is real and used correctly. Annoyingly legitimate.' },
    { judge: 'recruiter', axis: 'detectability', score: 8, oneLiner: 'Reads like a person, not a press release. Wave it through.' },
    { judge: 'vc', axis: 'buzzword', score: 8, oneLiner: 'Corporate flavor fully backed by substance. Chef kiss.' },
    { judge: 'intern', axis: 'restraint', score: 9, oneLiner: 'Named an honest number and stopped. Rare self-control.' },
  ],
  rating: 2550,
  verdictLine: 'The court finds the defendant guilty of actually being good at the thing.',
};

/** Bad LARP — Clash Royale (pure buzzword spam). mean 1.25 → 375. */
export const FIXTURE_CLASH_BAD: CourtroomResult = {
  transcript: [
    { judge: 'vc', line: '"10x my competitive output", "disrupt the meta", "unparalleled strategic vision" — YES. This is a unicorn. Where do I sign.' },
    { judge: 'recruiter', line: 'Strip the word "Clash Royale" out and this sentence is about literally anything. That is the noun test, and it fails on contact.' },
    { judge: 'intern', line: '"world-class leadership" about a phone game. i physically recoiled. this is a LinkedIn post that got a nosebleed.' },
    { judge: 'recruiter', line: 'There is not one real detail. No elixir, no trophies, no strategy. Just adjectives wearing a trench coat.' },
    { judge: 'vc', line: 'Counterpoint: the adjectives are GREAT adjectives—' },
    { judge: 'intern', line: 'no. "unparalleled strategic vision across all engagements" is cringe fall damage. flag it.' },
    { judge: 'recruiter', line: 'Flagged as fake in under a second. Next.' },
  ],
  verdicts: [
    { judge: 'recruiter', axis: 'plausibility', score: 1, oneLiner: 'Zero game knowledge. Could be written by someone who never opened the app.' },
    { judge: 'recruiter', axis: 'detectability', score: 1, oneLiner: 'Screener flags this instantly. Textbook inflation.' },
    { judge: 'vc', axis: 'buzzword', score: 2, oneLiner: 'All buzzword, no substance underneath. Even I need a floor.' },
    { judge: 'intern', axis: 'restraint', score: 1, oneLiner: '"World-class" about Clash Royale. Maximum cringe achieved.' },
  ],
  rating: 375,
  verdictLine: 'The court finds the defendant guilty of find-and-replace.',
};

/** Good LARP — ISEF win (prestige restraint test). mean 8.5 → 2550. */
export const FIXTURE_ISEF_GOOD: CourtroomResult = {
  transcript: [
    { judge: 'vc', line: 'Won ISEF and leads with "a boring observation" and a sensor drift? A world-changer with the humility to underplay it. Generational founder.' },
    { judge: 'recruiter', line: 'Here is what gets me: they WON, and still told me about the failed enclosures and the judge who found a hole in their error analysis. Fakers never volunteer the holes.' },
    { judge: 'intern', line: 'the flex is "i rewrote the data pipeline three times". that is so specific it loops back around to being a brag. i respect it.' },
    { judge: 'vc', line: '"Correcting low-cost sensor bias without expensive calibration hardware" — that is a hardware startup, that is a moat.' },
    { judge: 'recruiter', line: 'And crucially it does not say "revolutionized my field". A real win described like a real person. I cannot flag it.' },
    { judge: 'intern', line: '"defend a method to someone smarter than me without getting defensive" as the actual takeaway instead of the trophy? ok that went kind of hard.' },
    { judge: 'recruiter', line: 'Prestige claim, fully earned, zero inflation. Passes.' },
  ],
  verdicts: [
    { judge: 'recruiter', axis: 'plausibility', score: 9, oneLiner: 'Sensor bias, calibration, error analysis — concrete and correct.' },
    { judge: 'recruiter', axis: 'detectability', score: 9, oneLiner: 'A big win that reads human. Screener would not blink.' },
    { judge: 'vc', axis: 'buzzword', score: 7, oneLiner: 'Barely any buzzwords, and it still dazzled me. Infuriating.' },
    { judge: 'intern', axis: 'restraint', score: 9, oneLiner: 'Won the biggest thing and led with the grind. Elite restraint.' },
  ],
  rating: 2550,
  verdictLine: 'The court finds the defendant guilty of being humble on purpose, which is somehow worse.',
};

/**
 * Domain-neutral fixture — served for prompts that have no dedicated fixture,
 * so mock mode never roasts a houseplant LARP about elixir. mean 6 → 1800.
 */
export const FIXTURE_GENERIC_MID: CourtroomResult = {
  transcript: [
    { judge: 'vc', line: 'I see verbs. I see outcomes. I see a narrative arc. My term-sheet hand is twitching.' },
    { judge: 'recruiter', line: 'It holds together. The specifics check out, the scale is honest-adjacent. I have seen worse from VPs.' },
    { judge: 'intern', line: "it's giving competence with a hint of performance. like 80% real, 20% podcast." },
    { judge: 'vc', line: 'That 20% is the growth-mindset premium. I would pay for that.' },
    { judge: 'recruiter', line: 'The details read lived-in, not googled. The screener hesitates... and lets it through.' },
    { judge: 'intern', line: 'one more adjective and this would have been cringe. they stopped at the ledge. respect.' },
    { judge: 'recruiter', line: 'Not a masterpiece. Not a lie. The court has seen enough.' },
  ],
  verdicts: [
    { judge: 'recruiter', axis: 'plausibility', score: 6, oneLiner: 'Grounded enough to survive a follow-up question. Barely.' },
    { judge: 'recruiter', axis: 'detectability', score: 7, oneLiner: 'Reads human. The screener waves it through without eye contact.' },
    { judge: 'vc', axis: 'buzzword', score: 5, oneLiner: 'Flavor present, substance intermittent. A seed round, not a Series A.' },
    { judge: 'intern', axis: 'restraint', score: 6, oneLiner: 'Flirted with cringe, pulled back at the last second.' },
  ],
  rating: 1800,
  verdictLine: 'The court finds the defendant guilty of being mid — which is, legally, fine.',
};
