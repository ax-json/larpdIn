# larpYourself

**Competitive corporate LARPing — rated like chess.com, judged like a courtroom drama.**

larpYourself gives you a mundane achievement — *"Clash Royale enthusiast"*, *"participated in a science olympiad (didn't win)"* — and you write one paragraph LARPing it into an impressive-sounding, LinkedIn-style flex. Then court convenes: three AI judges with opposing agendas argue over your LARP live on screen, line by line, and the gavel drops — a rating out of **3000**. Beat your own best. Become a Grandmaster LARPer.

> ⚠️ This is satire. LinkedIn is full of performative flexing — larping tech, larping business. larpYourself makes it a sport.

## How to play

1. **Get a prompt.** A small, real-ish achievement at some prestige level. Mundane prompts test creativity; prestigious ones test restraint.
2. **Write your LARP.** One paragraph. The skill is real: good LARP maps genuine domain knowledge onto corporate language — not empty buzzwords.
3. **Court convenes.** The three judges take your LARP apart line by line — arguing with each other, roasting the buzzwords, defending the good parts. The judging phase plays like a courtroom scene, and their per-axis scores land as each judge rests their case.
4. **The gavel.** Your rating out of 3000 counts up, your band is revealed (from *Noise* to *Grandmaster LARPer*), and your personal best updates.
5. **Run it back.** New prompt, sharper LARP, higher rating.

## What is a LARP?

The core move: **mapping real, specific domain knowledge onto corporate achievement language.**

> A great LARP is a **true small thing**, dressed in professional language, held together by **real domain specifics**, and kept just **believable enough** that an AI screener wouldn't flag it.

The skill is in the specifics and the restraint — not the volume of impressive-sounding words.

```
GOOD larp  =  real specifics  +  honest scale  +  an earned reframe
BAD larp   =  buzzwords  +  inflated scale  +  an asserted (not earned) claim
```

**The noun test:** strip the topic noun out of your LARP. If the sentence still works for a completely different topic, it's noise. If it collapses because it depended on real domain detail — that's a LARP.

### Example

Prompt: *Clash Royale enthusiast*

✅ **Good:**

> "Over three competitive seasons I developed a real-time resource-allocation discipline — managing a constrained elixir economy under a hard tempo constraint, where over-committing early meant getting punished on the counter-push. Reaching a personal ceiling around 5,800 trophies taught me more about patience under pressure than most things labeled 'leadership.'"

Elixir economy, counter-pushes, trophy ranges — all real, used correctly. "Personal ceiling, ~5,800" is honest scale, no world-champion claim.

❌ **Bad:**

> "As a Clash Royale enthusiast I leveraged synergistic strategies to 10x my competitive output and disrupt the meta, demonstrating world-class leadership and unparalleled strategic vision."

Zero game knowledge, inflated scale, fails the noun test — find-replace "Clash Royale" with anything and it still reads the same. Flagged as fake instantly.

More worked examples across prompts (science olympiad, ISEF, Discord server, speedrunning) in [`LARP_EXAMPLES.txt`](LARP_EXAMPLES.txt).

## The judges

Three personas, each owning one rubric axis, each with an opposing win condition — so they genuinely disagree:

| Judge | Wants | Owns |
|---|---|---|
| 🕵️ **The Burnt-out Recruiter** | To CATCH you lying. Has seen 10,000 profiles. | Detectability — would an AI recruiter screener flag this as fake? |
| 💸 **The Buzzword VC** | To be IMPRESSED. Dazzled by "synergy", "10x", "disrupt". | Buzzword appeal — deliberately double-edged; overdo it and everyone else docks you. |
| 😬 **The Gen-Z Intern** | You to NOT embarrass yourself. Allergic to cringe. | Restraint / believability — did you oversell into cringe? |

Every score comes with a per-judge justification and cross-talk between judges — the panel arguing over your LARP *is* the show. Split verdicts are the best part.

## The rubric

- **Plausibility / domain authenticity** — does the flex reference real knowledge of the topic?
- **Restraint / believability** — kept just-believable, or oversold into cringe?
- **Buzzword density** — satirical and double-edged; too many buzzwords can LOSE points.
- **Detectability** — would the same AI screening real businesses use flag this as fake?

It's meta on purpose: businesses AI-screen LinkedIn profiles today. Here, surviving the screener is the game.

## The rating

Judges score each axis 0–10 against an anchored rubric; the final rating out of 3000 is computed from those scores (chess's all-time peak is 2882 — 3000 is the untouchable ceiling):

| Band | Rating |
|---|---|
| Noise | 0–899 |
| Intern | 900–1499 |
| Associate | 1500–2099 |
| Thought Leader | 2100–2599 |
| Grandmaster LARPer | 2600–3000 |

## Tech

- Vite + React + TypeScript, single-page app
- One server-side LLM call returns the entire courtroom — dialogue transcript, all three verdicts, and scores — as structured JSON
- Rating computed deterministically from judge scores, not asked from the model
- Personal best and history persist locally
- Two-faced UI, and that's the joke: the writing phase is a straight-faced LinkedIn clone (real design tokens — `#0a66c2`, the icon nav, Promoted posts, a composer with a disabled Post pill), and the verdict arrives on the same feed as a printed tribunal document — serif letterhead, exhibit tags, a bronze rating count-up, and a rubber-stamped rank

## Running locally

```bash
npm install
npm run dev
```

Requires an LLM API key in `.env` (see `.env.example`). A built-in mock-judge mode runs the full game offline with cached verdicts.

## Future features

- 1v1 multiplayer battles — two players, same prompt, judges pick a winner, true ELO ladder + leaderboard (Omegle mode)
- Topical LARP categories: tech / finance / debate / medicine
- Accounts, persistent profiles, global rating history
- Seasonal ranked ladders and tournaments
- "Survive the AI recruiter" mode built around the Detectability axis

---

*Built solo in one night for JEC Hacks. All prompts are fictionalized — no LARPing as real named people giving real professional advice.*
