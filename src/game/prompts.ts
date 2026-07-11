/**
 * The prompt bank — the mundane achievements players LARP.
 *
 * Three tiers (SPEC §2): `mundane` tests creativity, `mid` sits in between,
 * `prestige` tests restraint (the achievement is already big; don't oversell).
 * No pre-filled examples — every round starts from an empty composer with the
 * placeholder as the only nudge; the LARP is entirely the player's.
 */

import type { Prompt } from '../types/contracts';
import { getApprovedUserPrompts } from './userPrompts';

export const PROMPTS: Prompt[] = [
  {
    id: 'clash-royale',
    text: 'Clash Royale enthusiast',
    domain: 'gaming',
    tier: 'mundane',
  },
  {
    id: 'discord-server',
    text: 'Ran a small local Discord server',
    domain: 'community',
    tier: 'mundane',
  },
  {
    id: 'speedrun',
    text: 'Speedran a video game',
    domain: 'gaming',
    tier: 'mundane',
  },
  {
    id: 'houseplant',
    text: 'Kept a houseplant alive for a year',
    domain: 'home',
    tier: 'mundane',
  },
  {
    id: 'parallel-parking',
    text: 'Got good at parallel parking',
    domain: 'everyday',
    tier: 'mundane',
  },
  {
    id: 'science-olympiad',
    text: 'Participated in a science olympiad (did not win)',
    domain: 'academia',
    tier: 'mid',
  },
  {
    id: 'part-time-barista',
    text: 'Worked a part-time job as a barista',
    domain: 'work',
    tier: 'mid',
  },
  {
    id: 'couch-to-5k',
    text: 'Finished a couch-to-5K program',
    domain: 'fitness',
    tier: 'mid',
  },
  {
    id: 'isef-win',
    text: 'You won ISEF (International Science and Engineering Fair)',
    domain: 'academia',
    tier: 'prestige',
  },
  {
    id: 'ta-award',
    text: 'Won a teaching-assistant award in university',
    domain: 'academia',
    tier: 'prestige',
  },

  // --- LARP_PROMPTS_100 bank (no prefilled examples — the placeholder covers) ---

  // gaming / online
  { id: 'gold-rank-shooter', text: 'Reached Gold rank in an online shooter (once)', domain: 'gaming', tier: 'mid' },
  { id: 'dark-souls-boss', text: 'Beat a Dark Souls boss without crying', domain: 'gaming', tier: 'mundane' },
  { id: 'duolingo-streak', text: 'Maintained a 300-day Duolingo streak (learned nothing)', domain: 'gaming', tier: 'mundane' },
  { id: 'idle-cat-game', text: 'Top 4% in a mobile idle game about merging cats', domain: 'gaming', tier: 'mundane' },
  { id: 'minecraft-build', text: 'Won a Minecraft build competition in middle school', domain: 'gaming', tier: 'mid' },
  { id: 'raid-leader', text: 'Was a raid leader in a guild that no longer exists', domain: 'gaming', tier: 'mundane' },
  { id: 'wordle-leaderboard', text: 'Got verified on a Wordle leaderboard among 3 friends', domain: 'gaming', tier: 'mundane' },

  // domestic / household
  { id: 'ikea-assembly', text: 'Assembled IKEA furniture without leftover screws', domain: 'home', tier: 'mundane' },
  { id: 'meal-prep-week', text: 'Meal-prepped for one entire week', domain: 'home', tier: 'mundane' },
  { id: 'store-return', text: 'Successfully returned something to a store', domain: 'home', tier: 'mundane' },
  { id: 'family-group-chat', text: 'Organized the family group chat', domain: 'home', tier: 'mundane' },
  { id: 'router-restart', text: 'Fixed the Wi-Fi by turning the router off and on', domain: 'home', tier: 'mundane' },
  { id: 'sourdough-starter', text: 'Kept a sourdough starter alive for two weeks', domain: 'home', tier: 'mundane' },
  { id: 'fitted-sheet', text: 'Folded a fitted sheet', domain: 'home', tier: 'mundane' },
  { id: 'sink-unclog', text: 'Unclogged a sink using a YouTube tutorial', domain: 'home', tier: 'mundane' },
  { id: 'descale-coffee', text: 'Descaled the coffee machine (finally)', domain: 'home', tier: 'mundane' },

  // commuting / driving / travel
  { id: 'flight-connection', text: 'Made a flight connection with 12 minutes to spare', domain: 'travel', tier: 'mundane' },
  { id: 'tight-driveway', text: 'Reversed out of a very tight driveway', domain: 'travel', tier: 'mundane' },
  { id: 'foreign-metro', text: 'Navigated a foreign metro without Google Maps', domain: 'travel', tier: 'mundane' },
  { id: 'carry-on-packing', text: "Packed a week's trip in a carry-on", domain: 'travel', tier: 'mundane' },
  { id: 'street-parking', text: 'Found street parking in a big city on the first try', domain: 'travel', tier: 'mundane' },
  { id: 'road-trip-playlist', text: 'Assembled a functioning road-trip playlist', domain: 'travel', tier: 'mundane' },
  { id: 'long-layover', text: 'Survived a 14-hour layover', domain: 'travel', tier: 'mundane' },
  { id: 'highway-merge', text: 'Merged onto a highway during rush hour', domain: 'travel', tier: 'mundane' },
  { id: 'rental-return', text: 'Returned a rental car without a scratch', domain: 'travel', tier: 'mundane' },

  // food / drink
  { id: 'scrambled-eggs', text: "Made scrambled eggs that weren't rubbery", domain: 'food', tier: 'mundane' },
  { id: 'coffee-local-language', text: 'Ordered coffee in the local language', domain: 'food', tier: 'mundane' },
  { id: 'pancake-flip', text: 'Successfully flipped a pancake', domain: 'food', tier: 'mundane' },
  { id: 'dinner-party', text: 'Hosted a dinner party for four', domain: 'food', tier: 'mundane' },
  { id: 'dry-wine-guess', text: 'Correctly guessed a wine was "dry"', domain: 'food', tier: 'mundane' },
  { id: 'spicy-noodles', text: 'Finished a spicy noodle challenge', domain: 'food', tier: 'mundane' },
  { id: 'reservation-six', text: 'Kept a restaurant reservation for six people together', domain: 'food', tier: 'mundane' },
  { id: 'three-ingredient-cocktail', text: 'Made a cocktail with three ingredients', domain: 'food', tier: 'mundane' },
  { id: 'bill-split', text: 'Split the bill accurately without an app', domain: 'food', tier: 'mundane' },
  { id: 'edible-tomato', text: 'Grew a single edible tomato', domain: 'food', tier: 'mundane' },

  // academic / student
  { id: 'read-syllabus', text: 'Read the entire syllabus once', domain: 'academia', tier: 'mundane' },
  { id: 'deadline-submission', text: 'Submitted an assignment with 4 minutes to spare', domain: 'academia', tier: 'mundane' },
  { id: 'correct-citation', text: 'Cited a source in the correct format', domain: 'academia', tier: 'mundane' },
  { id: 'morning-lectures', text: 'Attended every 8 a.m. lecture for one week', domain: 'academia', tier: 'mundane' },
  { id: 'hall-monitor', text: 'Was hall monitor in the 6th grade', domain: 'academia', tier: 'mundane' },
  { id: 'spelling-bee', text: 'Got second place at a regional spelling bee', domain: 'academia', tier: 'mid' },
  { id: 'solo-group-project', text: 'Finished a group project by doing it alone', domain: 'academia', tier: 'mundane' },
  { id: 'library-book', text: 'Returned a library book on time', domain: 'academia', tier: 'mundane' },

  // fitness / health / wellness
  { id: 'gym-three-times', text: 'Went to the gym three times in one month', domain: 'fitness', tier: 'mundane' },
  { id: 'plank-60', text: 'Held a plank for 60 seconds', domain: 'fitness', tier: 'mundane' },
  { id: 'touch-toes', text: 'Touched my toes after years of trying', domain: 'fitness', tier: 'mundane' },
  { id: 'eight-glasses', text: 'Drank eight glasses of water in a day', domain: 'fitness', tier: 'mundane' },
  { id: 'beginner-yoga', text: 'Completed a beginner yoga video', domain: 'fitness', tier: 'mundane' },
  { id: 'took-stairs', text: 'Took the stairs instead of the elevator', domain: 'fitness', tier: 'mundane' },
  { id: 'one-pull-up', text: 'Did a single unassisted pull-up', domain: 'fitness', tier: 'mundane' },
  { id: 'eight-hours-sleep', text: 'Slept eight hours on purpose', domain: 'fitness', tier: 'mundane' },
  { id: 'no-doomscroll', text: 'Quit doom-scrolling for one evening', domain: 'fitness', tier: 'mundane' },

  // workplace / corporate
  { id: 'meeting-email', text: 'Scheduled a meeting that could have been an email', domain: 'work', tier: 'mundane' },
  { id: 'reply-all', text: 'Replied-all without regret', domain: 'work', tier: 'mundane' },
  { id: 'office-printer', text: 'Fixed the office printer', domain: 'work', tier: 'mundane' },
  { id: 'mute-complaint', text: 'Muted myself before complaining on a call', domain: 'work', tier: 'mundane' },
  { id: 'slack-channel', text: 'Named a Slack channel that people actually used', domain: 'work', tier: 'mundane' },
  { id: 'inbox-zero', text: 'Achieved Inbox Zero (for eleven minutes)', domain: 'work', tier: 'mundane' },
  { id: 'unsolicited-notes', text: 'Took notes no one asked for', domain: 'work', tier: 'mundane' },
  { id: 'conference-room', text: 'Booked the good conference room', domain: 'work', tier: 'mundane' },
  { id: 'typo-free-slide', text: 'Presented a slide deck with no typos on slide 1', domain: 'work', tier: 'mundane' },
  { id: 'survived-reorg', text: 'Survived a re-org with my title intact', domain: 'work', tier: 'mundane' },

  // hobbies / creative
  { id: 'three-chords', text: 'Learned three chords on the guitar', domain: 'hobbies', tier: 'mundane' },
  { id: 'jigsaw-1000', text: 'Finished a 1,000-piece jigsaw puzzle', domain: 'hobbies', tier: 'mundane' },
  { id: 'knitted-scarf', text: 'Knitted a scarf that is technically wearable', domain: 'hobbies', tier: 'mundane' },
  { id: 'unread-poem', text: 'Wrote a poem no one has read', domain: 'hobbies', tier: 'mundane' },
  { id: 'two-day-journal', text: 'Kept a journal for two consecutive days', domain: 'hobbies', tier: 'mundane' },
  { id: 'bob-ross-landscape', text: 'Painted a landscape "in the style of" Bob Ross', domain: 'hobbies', tier: 'mundane' },
  { id: 'bread-rose', text: 'Baked bread that rose', domain: 'hobbies', tier: 'mundane' },
  { id: 'photo-40-likes', text: 'Took a photo that got 40 likes', domain: 'hobbies', tier: 'mundane' },
  { id: 'one-episode-podcast', text: 'Started a podcast (one episode)', domain: 'hobbies', tier: 'mundane' },
  { id: 'drew-a-hand', text: 'Drew a hand that looks like a hand', domain: 'hobbies', tier: 'mundane' },

  // pets / animals / nature
  { id: 'dog-sit', text: 'Taught a dog to sit (results vary)', domain: 'nature', tier: 'mundane' },
  { id: 'goldfish-week', text: 'Kept a goldfish alive past the first week', domain: 'nature', tier: 'mundane' },
  { id: 'bird-app', text: 'Identified a bird using an app', domain: 'nature', tier: 'mundane' },
  { id: 'cat-nails', text: "Trimmed a cat's nails and survived", domain: 'nature', tier: 'mundane' },
  { id: 'windowsill-basil', text: 'Grew basil on a windowsill', domain: 'nature', tier: 'mundane' },
  { id: 'pulling-dog-walk', text: 'Walked a dog that pulls, without falling', domain: 'nature', tier: 'mundane' },
  { id: 'spider-removal', text: 'Removed a spider without screaming', domain: 'nature', tier: 'mundane' },
  { id: 'phone-free-hike', text: 'Went a whole hike without checking my phone', domain: 'nature', tier: 'mundane' },
  { id: 'bonsai-alive', text: 'Kept a bonsai un-murdered for a month', domain: 'nature', tier: 'mundane' },
  { id: 'rain-prediction', text: 'Correctly predicted rain by "feeling it"', domain: 'nature', tier: 'mundane' },

  // digital life / misc modern
  { id: 'bottom-of-internet', text: 'Reached the bottom of the internet (twice)', domain: 'digital', tier: 'mundane' },
  { id: 'one-unsubscribe', text: 'Unsubscribed from one email list', domain: 'digital', tier: 'mundane' },
  { id: 'zero-notifications', text: 'Achieved a 0-notification lock screen', domain: 'digital', tier: 'mundane' },
  { id: 'dating-app-bio', text: 'Wrote a bio for a dating app', domain: 'digital', tier: 'mundane' },
  { id: 'comments-argument', text: 'Won an argument in a comments section (nobody won)', domain: 'digital', tier: 'mundane' },
  { id: 'two-factor-setup', text: 'Set up two-factor authentication', domain: 'digital', tier: 'mundane' },
  { id: 'trial-cancel', text: 'Cancelled a subscription before the trial ended', domain: 'digital', tier: 'mundane' },
  { id: 'jan-4-resolution', text: "Kept a New Year's resolution until January 4th", domain: 'digital', tier: 'mundane' },
  { id: 'phone-backup', text: 'Backed up my phone before it broke', domain: 'digital', tier: 'mundane' },
  { id: 'terms-conditions', text: 'Read the terms and conditions (skimmed)', domain: 'digital', tier: 'mundane' },
];

/** Seeded bank + approved user suggestions — the pool every round draws from. */
function getPromptPool(): Prompt[] {
  return [...PROMPTS, ...getApprovedUserPrompts()];
}

/** A random prompt to open a round. */
export function getRandomPrompt(): Prompt {
  const pool = getPromptPool();
  return pool[Math.floor(Math.random() * pool.length)];
}

/** A random prompt that is not `excludeId`, for the "run it back" loop. */
export function getNextPrompt(excludeId: string): Prompt {
  const pool = getPromptPool().filter((p) => p.id !== excludeId);
  const source = pool.length > 0 ? pool : getPromptPool();
  return source[Math.floor(Math.random() * source.length)];
}
