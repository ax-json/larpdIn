/**
 * The prompt bank — the mundane achievements players LARP.
 *
 * Three tiers (SPEC §2): `mundane` tests creativity, `mid` sits in between,
 * `prestige` tests restraint (the achievement is already big; don't oversell).
 * Every prompt ships a pre-filled editable `example` LARP so the player never
 * faces a blank textarea (council amendment #3). The examples are deliberately
 * decent-but-beatable — a starting point to edit, not a ceiling.
 */

import type { Prompt } from '../types/contracts';

export const PROMPTS: Prompt[] = [
  {
    id: 'clash-royale',
    text: 'Clash Royale enthusiast',
    domain: 'gaming',
    tier: 'mundane',
    example:
      'Over a few competitive seasons I built a real-time resource-allocation habit — managing a constrained elixir economy under tempo pressure, where over-committing early meant getting punished on the counter-push. I hit a personal ceiling around 5,800 trophies and learned more about patience under pressure than most things labeled "leadership."',
  },
  {
    id: 'discord-server',
    text: 'Ran a small local Discord server',
    domain: 'community',
    tier: 'mundane',
    example:
      'I ran a ~200-member community server and learned moderation is mostly systems design, not authority — slow-mode during pile-ons, a clear escalation ladder before bans, onboarding that set norms in the first five minutes. The hardest call was mediating two long-time members without the group picking sides. Nobody paid me and it was small, but it was the first time I saw the invisible structure that holds a group together.',
  },
  {
    id: 'speedrun',
    text: 'Speedran a video game',
    domain: 'gaming',
    tier: 'mundane',
    example:
      'Optimizing a single run taught me more about marginal gains than any productivity book — routing to cut backtracking, frame-perfect inputs where a 1/60th-second window separated a personal best from a reset, and grinding one segment a hundred times to shave half a second. I learned to tell a strategy that is fast in theory from one I can execute under pressure. Clearest lesson in diminishing returns I have ever lived.',
  },
  {
    id: 'houseplant',
    text: 'Kept a houseplant alive for a year',
    domain: 'home',
    tier: 'mundane',
    example:
      'Keeping one pothos alive for a year was a lesson in reading feedback loops — yellowing lower leaves meant overwatering, not underwatering, and the fix was a schedule tied to soil moisture instead of the calendar. I stopped intervening constantly and let the plant tell me what it needed. Low stakes, but it rewired how I think about not-fixing things that are already working.',
  },
  {
    id: 'parallel-parking',
    text: 'Got good at parallel parking',
    domain: 'everyday',
    tier: 'mundane',
    example:
      'I turned parallel parking from a panic into a repeatable procedure — a fixed reference point on the mirror, a single steering input at the right moment, and committing instead of inching. The unlock was realizing hesitation caused most failed attempts, not spatial reasoning. It is a small, dumb skill that quietly taught me to trust a rehearsed process over nerves.',
  },
  {
    id: 'science-olympiad',
    text: 'Participated in a science olympiad (did not win)',
    domain: 'academia',
    tier: 'mid',
    example:
      'Preparing for the regional physics olympiad, I drilled past papers where one problem could hinge on choosing the right frame of reference. I did not place — I got stuck on a rotational-dynamics question I later realized I had set up from the wrong pivot — but that failure taught me to check my assumptions before committing to twenty minutes of algebra. That habit outlasted anything I memorized for the exam.',
  },
  {
    id: 'part-time-barista',
    text: 'Worked a part-time job as a barista',
    domain: 'work',
    tier: 'mid',
    example:
      'Pulling shots taught me throughput under constraint — a morning rush is a queueing problem, and the bottleneck was almost never the machine, it was sequencing drinks so milk steaming and extraction overlapped. I learned to read a line and pre-stage, and to keep tone steady with a customer while three tickets stacked up. Minimum wage, but the clearest operations lesson I have had.',
  },
  {
    id: 'couch-to-5k',
    text: 'Finished a couch-to-5K program',
    domain: 'fitness',
    tier: 'mid',
    example:
      'Going from zero to a 5K was mostly about pacing discipline — going out too fast was the failure mode every single time, and the fix was running slower than my ego wanted so I could actually finish. Tracking a small weekly progression instead of chasing one big run kept me consistent. Nothing athletic about it; it was a lesson in sustainable pace over heroics.',
  },
  {
    id: 'isef-win',
    text: 'You won ISEF (International Science and Engineering Fair)',
    domain: 'academia',
    tier: 'prestige',
    example:
      'My ISEF project came out of a boring observation: my home sensor logs had a drift I could not explain, and chasing it became a method for correcting low-cost sensor bias without expensive calibration hardware. Most of two years was unglamorous — failed enclosures, a data pipeline I rewrote three times, a finals judge who found a hole in my error analysis I spent a month closing. Winning was real, but the part I would put on a pedestal is learning to defend a method to someone smarter than me without getting defensive.',
  },
  {
    id: 'ta-award',
    text: 'Won a teaching-assistant award in university',
    domain: 'academia',
    tier: 'prestige',
    example:
      'The TA award came from one small change: I stopped re-explaining the lecture and started office hours by asking students to show me where their reasoning broke. Most of the work was unglamorous — rewriting the same problem set solutions three ways until the common misconception was obvious. It was recognized, but the real takeaway was that teaching is mostly diagnosis, not explanation.',
  },
];

/** A random prompt to open a round. */
export function getRandomPrompt(): Prompt {
  return PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
}

/** A random prompt that is not `excludeId`, for the "run it back" loop. */
export function getNextPrompt(excludeId: string): Prompt {
  const pool = PROMPTS.filter((p) => p.id !== excludeId);
  const source = pool.length > 0 ? pool : PROMPTS;
  return source[Math.floor(Math.random() * source.length)];
}
