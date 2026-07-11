# larpYourself — Build Journal

How the idea developed: what was considered, what was taken, what was omitted, and why.
Newest entries at the bottom. Companion docs: `PLAN.txt` (original plan), `SPEC.md` (build source of truth).

---

## 2026-07-11 — Brainstorm: finding the idea

Three batches of ideas were generated and discarded before landing:

- **"Cool over useful":** Latent Space Cartographer, Reverse Turing Room, Constraint Composer, Infinite Zoom, Semantic Synth, Museum of Impossible Objects.
- **"Cool AND useful":** Rubber Duck That Talks Back, Semantic Diff for Prose, Handoff-Doc Generator, Regex/Cron/SQL Reverse-Engineer, Meeting→Decision Log, Tab Archaeologist, Time-Machine README.
- **"More innovative/cooler":** Proof-of-Understanding, Argument Gym, Language Drift Engine, Consensus Reality Detector, Negative Space Search, Emotional Compiler, "Why Did It Say That?", Time-Debt Tracker.

**Landed on: the LinkedIn LARP battle game.** Strongest one-sentence hook ("Omegle for LinkedIn flexing"), self-justifying satire, demos solo, and there's a real underlying skill being ranked. Scored it ~8/10 as a hackathon concept.

**Why this one:** LinkedIn is notoriously full of performative flexing. The game satirizes that culture by making it a sport. It's meta — businesses AI-screen LinkedIn profiles, so an AI judging the LARP is on-theme. And good LARPing is a real skill: mapping genuine domain knowledge onto corporate language, not rambling buzzwords. It accidentally teaches self-presentation.

## 2026-07-11 — Judging evolves: single judge → panel of 3

Biggest weakness of v1 concept: "an AI scores it 1–10" reads as a ChatGPT wrapper. Fix: turn the judging itself into content.

Five judge-trio options considered:
- **A. Hiring Panel** (Burnt-out Recruiter / Buzzword VC / Gen-Z Intern) ← **chosen**
- B. Personality Extremes
- C. LinkedIn Archetypes (Thought Leader / HR Voice / Grindset Bro)
- D. Skill Axis
- E. Chaotic Wildcard

Chose **Trio A** — cleanest mapping onto the rubric axes and safest to build; can be re-skinned in Trio C flavor later without changing logic. Key insight: judges must be **structurally opposed** (different win conditions — catch fakes / be dazzled / avoid cringe), not just tonally different, or the LLM collapses them into one bland voice. This pushed the concept from ~8 to ~9.

## 2026-07-11 — Design decisions locked

- **User WRITES own LARP** over "AI generates, user picks": it IS the game that was pitched, it's funnier, ELO actually means something. The AI-generates version is faster to build but has no soul.
- **Async battles** over live Omegle-style multiplayer: WebSockets + matchmaking + "nobody online at 1 AM to demo against" would eat the whole night. Submit → matched against stored/seeded opponent → still structurally PvP, demos solo. Live mode → future slide.
- **One structured LLM call** returning all 3 verdicts as JSON, not 3 calls: same cost/latency as a single judge.
- **Omitted from MVP:** live multiplayer, topical categories, prestige tier system, accounts, persistent profiles. Rule of thumb: if a feature needs a second live human to demo, it's v2.

## 2026-07-11 ~21:00 IST — Council review (4 voices)

Ran the full plan through a design council: in-context Architect + three independent subagents (Skeptic, Pragmatist, Critic), each blind to the others.

**Consensus: GO.** Concept strong, plan unusually well de-risked. Changes are sequencing, not scope.

Adopted amendments (all folded into `SPEC.md`, marked `[COUNCIL]`):
1. **Judge prompt first** (was step 2) — it's the only genuinely risky component; if the panel isn't funny and distinct, the product is dead. Validate hour 1 as a bare script; go/no-go gate.
2. **Deploy the skeleton early** (~H4.5, was step 8) — a 1 AM Vercel/env-var fight is the most likely way the project dies.
3. **Pre-filled editable example LARP** in the textarea + cached replay — the blank page is the worst demo ask; two voices proposed this independently.
4. **Seed content is comedy writing** — at judging time the 20–30 seeded LARPs ARE the product; LLM-draft then hand-curate, with a real time budget.
5. **The demo video is the product** for Devpost judges reviewing later — hard 90-minute submission block, script it around a split verdict (2 judges love it, 1 flags it).
6. **Determinism guard** — low temperature, absolute anchored rubric, score each LARP independently, never re-judge stored opponents. Otherwise retry = coin flip and ELO feels random.
7. **Satire skin protected** — without it the site reads as "textarea + JSON viewer"; for a satire project the skin is the product.
8. **ELO simplified** — K=32 hardcoded, fixed seed ratings, 20-minute cap.
9. **Runtime mock-judge toggle** as demo insurance, not just a dev flag.
10. **Pre-decided cut ladder** — leaderboard UI degrades to win-streak first; reveal theatre and skin never get cut. No 1 AM decisions.

**Rejected:** Skeptic's proposal to drop the battle/ELO layer entirely for a single-player "Judge My Flex" toy. The game framing (ranked battles, ELO) is exactly what separates this from the crowded "AI roasts your LinkedIn" gimmick — even the Skeptic's own risk note conceded this. Kept, but thin.

Output: `SPEC.md` written as the build source of truth, superseding `PLAN.txt`.

## 2026-07-11 21:05 IST — Docs before build

README.md (product overview only) and this journal created. Noted at this point: ~21:00 with a 1–2 AM deadline means the realistic build window is ~4–5 hours, not the 12 the original plan assumed — the cut ladder and protected blocks in SPEC §8 just became a lot more load-bearing.

**Next: Step 0 — scaffold + contracts.**

## 2026-07-11 21:07 IST — Timeline compressed before first line of code

Effort/model settings switched (high effort, Sonnet 5) — unrelated to scope, noted for completeness.

Real clock check: 21:07 IST, deadline ~1–2 AM = ~4–5h window, not the 12h `PLAN.txt`/`SPEC.md` timeline assumed. Compressing the H0–H12 schedule into a ~5h version before starting, rather than discovering the gap mid-build:

- H0–0.5 scaffold+contracts
- H0.5–1.5 judge prompt bare script (go/no-go gate stays)
- H1.5–2 mock logic + ELO
- H2–2.5 deploy skeleton
- H2.5–3.5 prompts + seeds — trimmed to ~12–15 seed LARPs, not 20–30
- H3.5–4.5 UI + battle flow
- H4.5–5.5 reveal + satire skin (still protected, never cut)
- final ~45 min: submission block (video, README/journal final pass, push) — hard cut, non-negotiable

Cut ladder brought forward, not held in reserve: leaderboard UI, mobile polish, and the mood/bias judge quirk are cut from the plan at start rather than fallback options. `SPEC.md` §7/§8 stay as the full-scope reference; this entry is the compressed live plan actually being followed tonight.

## 2026-07-11 21:10 IST — OUTLINE.txt added

Plain-language step-by-step outline of the whole build written to `OUTLINE.txt` (jargon-free mirror of the compressed plan above). No plan change — README unaffected.

## 2026-07-11 21:15 IST — LARP concept formalized (LARP_EXAMPLES.txt)

New source doc added by hand: `LARP_EXAMPLES.txt` — the definition of a LARP plus 5 worked good/bad example pairs (Clash Royale, science olympiad non-win, ISEF prestige, Discord server, speedrunning).

Key formalizations it adds beyond the original plan:
- **One-line mental model:** a great LARP is a TRUE SMALL THING, dressed in professional language, held together by REAL DOMAIN SPECIFICS, kept just BELIEVABLE ENOUGH that an AI screener wouldn't flag it.
- **The pattern:** good = real specifics + honest scale + earned reframe; bad = buzzwords + inflated scale + asserted claim.
- **The noun test:** strip the topic noun — if the sentence survives on any topic, it's noise; if it collapses, it's a LARP. (This is now the cleanest bad-larp detector we have.)
- Prestige prompts (ISEF) confirmed as restraint tests: lead with the unglamorous grind, let humility carry the big claim.

Downstream impact: these five good/bad pairs are exactly the calibration set Step 1 (judge prompt tuning) needed — good ones must score high, bad ones low. The noun test and the mental model go verbatim into the judge prompt's rubric anchors. README updated with a proper "What is a LARP?" section (mental model, good/bad formula, noun test, upgraded example pair).

## 2026-07-11 21:23 IST — THE PIVOT: single-player courtroom

Biggest design change of the night, user's call. Multiplayer (even the async fake-PvP version) is out for tonight — future roadmap only. The game is now single-player:

- Player writes the LARP as before.
- No opponent, no "you win" statement. On submit, the judging phase plays out like a **courtroom scene**: the three judges' lines appear on screen one by one, arguing with each other about the LARP.
- The verdict is a **rating out of 3000** (chess-style scale — bands from "Noise" to "Grandmaster LARPer" at 2600+). Rating computed in code from the judges' axis scores, not asked from the LLM. Personal best is the replay loop.

Why this is better than v1, honestly:
- The council's Skeptic argued the panel roast IS the product and battles were scaffolding around it. Rejected at the time to protect the "game" framing. This pivot lands in the same place but sharper: the judging isn't a scorecard, it's a staged ARGUMENT — and the chess-style rating keeps the game framing without any PvP machinery.
- Kills the two heaviest remaining work items: battle/ELO-update logic and the 12–15 seeded opponent LARPs the council warned was a hidden comedy-writing chore. Freed time reallocated to the courtroom scene, which is what the demo video shows anyway.
- New contract: `CourtroomResult` (transcript turns + 3 verdicts + computed rating) replaces `Battle`/`PanelResult`. Transcript hard-capped at 6–9 turns so the scene doesn't drag.
- New risk accepted: single-player needs stakes → rating bands + personal best carry it; multiplayer stays on the roadmap slide as the answer to "where does this go."

Docs updated: SPEC.md rewritten as v2 (changes marked [PIVOT]), OUTLINE.txt rewritten, README rewritten around the courtroom + rating (bands table added). PLAN.txt untouched as the v1 artifact.

## 2026-07-11 21:30 IST — Name locked: larpYourself

Working title "LARP Arena" retired. Locked name: **larpYourself** (exact casing — lowercase `larp`, capital `Y`).

Why it fits: inverts LinkedIn motivational cringe ("be yourself" / "believe in yourself") into "larp yourself" — the joke lands on the culture being satirized. It's also a verb/command, which is literally the instruction the game gives the player. Domain-shaped (`larpyourself.com`), one token, memorable. The "less courtroom than a name like Flex Court" gap is covered by the tagline ("judged like a courtroom drama").

Threaded through README, SPEC, OUTLINE, JOURNAL, LARP_EXAMPLES headers. PLAN.txt left frozen (still reads "LARP ARENA (working title)" — correct as history).

## 2026-07-11 21:45 IST — STEP 0 done: scaffold + contracts

Vite + React + TS scaffolded (Node 22, npm 10.9) into the repo root alongside the docs. Two Step-0 deliverables:
- `src/types/contracts.ts` — every core shape from SPEC §6 as TypeScript: `Judge`/`Axis` unions, `JUDGE_AXIS`/`JUDGE_NAMES` maps, `Prompt` (+ tier + optional prefilled `example`), `Larp`, `TranscriptTurn`, `Verdict`, `CourtroomResult` (transcript + verdicts + computed rating + gavel line), `Band`, `Player`/`HistoryEntry`. Types only, no logic.
- `src/storage/storage.ts` — `Storage` interface + localStorage impl behind it (callers never touch localStorage directly, so a real DB swaps in later). Defensive JSON read (untrusted external data → fallback on parse error), idempotent `seed()` hook, `clear()` for reset. Keys namespaced `larpyourself:*`.
- `src/App.tsx` — replaced Vite boilerplate with a minimal skeleton that reads the player from storage (proves contracts + storage compile and wire).

Snag: the Vite template's own README.md clobbered ours during the file move — rebuilt it from context, no loss. EXIT met: `tsc --noEmit` clean, `npm run build` green (60.5 kB gzip). No features yet, as intended.

**Next: Step 1 — the courtroom judge prompt as a bare script. The go/no-go gate.**

## 2026-07-11 22:05 IST — STEP 1 done: judge prompt + GO/NO-GO GATE PASSED

The only genuinely risky component (council amendment #1). Built the courtroom prompt as a real artifact and ran the gate.

- `src/llm/judgePrompt.ts` — the courtroom prompt builder. `JUDGE_SYSTEM_PROMPT` (three opposed judges, absolute anchored rubric, the noun test, strict-JSON output shape) + `buildJudgeUserMessage(prompt, larp)` + `JUDGE_TEMPERATURE = 0.3`. Key design calls:
  - **4 verdicts across 3 judges:** the Recruiter owns TWO axes (plausibility + detectability), VC owns buzzword, Intern owns restraint. Reconciles the 4-axis rubric with the 3-judge panel cleanly.
  - **All axes scored monotonic "higher = better LARP"** so Step 2 just averages them — no sign-juggling. Detectability is framed as screener-*survival* (10 = reads human), not "how flaggable".
  - **The buzzword twist:** VC's *dialogue* gushes over buzzwords, but the buzzword *score* rewards DISCIPLINE (flavor earned by substance). That gap is the joke and it stops pure buzzword spam from ever winning.
  - Rating is NOT asked from the model — computed in code from the 4 scores (retry-proof, per determinism guard §9).
- **The gate:** ran the prompt (self-judged, no key needed yet) against the LARP_EXAMPLES calibration pairs. Formula `rating = round(mean(4 scores)/10 × 3000)`.

  | LARP | plaus | detect | buzz | restraint | rating | band | target |
  |---|---|---|---|---|---|---|---|
  | Clash Royale (good) | 9 | 8 | 8 | 9 | 2550 | Thought Leader | ≥2100 ✅ |
  | Clash Royale (bad) | 1 | 1 | 2 | 1 | 375 | Noise | <900 ✅ |
  | ISEF (good, prestige) | 9 | 9 | 7 | 9 | 2550 | Thought Leader | ≥2100 ✅ |

  Good/bad separation holds, prestige restraint reads correctly, judges stay distinct and argue with each other. **GATE = GO.** Concept survives — no simplification needed.
- `src/llm/mockCourtroom.ts` — the three gate runs captured as hand-authored `CourtroomResult` fixtures. Doubles as mock-judge mode (whole game runs with NO API key) and the live path's 1 AM fallback. Ratings pre-computed with the Step 2 formula so mock and live stay consistent.

Snag / open item: **no `ANTHROPIC_API_KEY` anywhere in env and no `.env`.** Not a blocker for the gate (self-judged) or for building the UI (mock mode). It IS a hard requirement for the live LLM path at deploy — flagged for Step 3.

EXIT met: `tsc --noEmit` clean. Voices funny + distinct, calibration correct.

**Next: Step 2 — scoring math (mean × 300 → rating, band lookup, personal-best update) as pure functions. ~20 min.**

## 2026-07-11 22:15 IST — STEP 2 done: scoring math (pure functions)

`src/game/scoring.ts` — all numeric logic, no I/O, no LLM. The rating is derived here so a retry can never move it.

- `computeRating(verdicts)` — `mean(4 axis scores)/10 × 3000`, rounded + clamped 0–3000. Per-axis `clampScore` guards a model returning 11 or NaN.
- `bandFor(rating)` — Noise / Intern / Associate / Thought Leader / Grandmaster LARPer, scanned high→low against the SPEC band table.
- `finalizeCourtroom(raw)` — the single choke point where a raw LLM result (transcript + verdicts + verdictLine) gets its rating; live and mock both go through it, so they can't drift.
- `applyRound(player, promptId, rating)` + `isNewBest(...)` — immutable player update (new object, never mutate), raises bestRating only if beaten, appends history.

Verified against the Step 1 fixtures: `9,8,8,9`→2550, `1,1,2,1`→375, `9,9,7,9`→2550; bands Thought Leader / Noise / Thought Leader. Matches the hardcoded fixture ratings exactly, so mock === live math.

Testing note: skipped standing up Vitest for now (token/time budget under pressure). The pure functions are small and cross-checked against fixtures; a proper unit suite is a fast-follow if time survives the build. `tsc --noEmit` clean.

**Next: Step 3 — deploy skeleton early: serverless LLM function (`/api/judge`) reading the key from env, with mock-mode fallback. Council amendment #2 (avoid the 1 AM Vercel fight).**

## 2026-07-11 22:45 IST — STEPS 3–6 done: full game built (push-through pass)

User called "push straight through" — built Steps 3→6 back to back, one build at the end. Game is now playable end to end (mock mode works with no key).

**Step 3 — the live judge + client service.**
- `api/judge.ts` — Vercel serverless function. Takes `{prompt, larp}`, calls Claude with `JUDGE_SYSTEM_PROMPT`, extracts + validates the strict JSON, runs `finalizeCourtroom` (rating computed server-side), returns a `CourtroomResult`. The API key lives ONLY here (server), never the browser. Tolerant JSON extraction (slices the first `{`…`}`) + shape validation so a chatty model can't crash it.
- `src/game/judge.ts` — the UI's single door to a verdict. `judgeLarp(prompt, larp, useMock)` → live POST `/api/judge`, or a deterministic mock fixture. **Silently falls back to a fixture on ANY live failure** (no key, offline, 404 in local dev, flaky network) — the game always reaches a courtroom. Returns `{result, usedMock}` so the UI can badge a mock verdict honestly.

**Step 4 — prompt bank.** `src/game/prompts.ts` — 10 prompts across the 3 tiers (5 mundane, 3 mid, 2 prestige), each with a **pre-filled editable example LARP** (council #3: never a blank page). The 3 that have fixtures reuse the calibration examples so mock and live line up. `getRandomPrompt` / `getNextPrompt(excludeId)` drive the loop.

**Steps 5 + 6 — the UI + the show (the protected block).**
- `src/App.tsx` — the whole loop as one small state machine: `writing → judging → verdict → (run it back) → writing`. Prompt card (tier badge + domain), prefilled editor, mock toggle, submit → judge → `applyRound` → persist → courtroom. Best rating + band + round count live in the top bar and persist across rounds (the single-player replay hook).
- `src/ui/Courtroom.tsx` — the courtroom scene. Transcript lines drop in one at a time (staggered timers, ~950ms) like a live argument, with a "skip to verdict" for fast demos; then the 4 verdict cards; then the rating **counts up** (ease-out rAF) and the band lands, with a ★ NEW PERSONAL BEST tag when beaten.
- `src/index.css` — the satire skin (SPEC §7, never cut): calm off-white **LinkedIn feed** look for writing, then the feed gives way to a **dark courtroom panel** for judging — the tonal switch itself sells the joke. Judge identity (recruiter=slate, VC=green, intern=purple) carried by colored name + avatar dot, consistent everywhere.
  - Design hook (impeccable) flagged the first pass's per-judge side-border / top-border accents as an AI-UI tell. Reworked: dropped the border accents, kept judge identity via the colored dot + name. Passes clean, identity preserved.

**Security fix caught mid-build:** the scaffold `.gitignore` did NOT ignore `.env` — the API key would have committed. Added `.env` / `.env.*` (keeping `.env.example`) + `.vercel`. Also wrote `.env.example`.

**Build:** `tsc --noEmit` clean; `npm run build` green — **207 kB / 66.66 kB gzip**. The serverless `api/judge.ts` (outside the app tsconfig) typechecked separately, also clean.

Also created `YOUR_TASKS.md` — the human-only checklist (get Anthropic key + `.env`, Vercel deploy + env var, demo video, Devpost submit). Nothing there blocks the build; mock mode runs the whole game offline.

**Where it stands:** the build is essentially DONE and demoable in mock mode right now. Remaining is Step 7 (the human submission block): the live key, deploy, demo video, Devpost — all in `YOUR_TASKS.md`. Optional fast-follows if time survives: a Vitest suite for the scoring math, a couple more fixtures.

**Next: hand off — run it locally (`npm run dev`, toggle mock judges on), then work `YOUR_TASKS.md`.**

---

## 2026-07-11 22:23 — Swap: Anthropic → OpenAI in the live judge

`api/judge.ts` now calls OpenAI's `/v1/chat/completions` (`gpt-4o`) instead of Anthropic's `/v1/messages`. Reason: user wants to run the live courtroom on an OpenAI key instead of an Anthropic one.

Changes:
- Endpoint: `ANTHROPIC_URL` → `OPENAI_URL` (`https://api.openai.com/v1/chat/completions`).
- Auth: `x-api-key` + `anthropic-version` header → `authorization: Bearer <key>`.
- Env var: `ANTHROPIC_API_KEY` → `OPENAI_API_KEY` (updated in `.env.example` too).
- Request shape: Anthropic's separate `system` field folded into a `messages: [{role:'system',...}]` entry; added `response_format: { type: 'json_object' }` to keep the strict-JSON contract reliable without Anthropic's native JSON discipline.
- Response parse: `data.content[0].text` → `data.choices[0].message.content`.
- `JUDGE_SYSTEM_PROMPT` / `buildJudgeUserMessage` (`src/llm/judgePrompt.ts`) untouched — provider-agnostic strings, no change needed.
- Mock-judge fallback (`src/game/judge.ts`) untouched — it only cares about the `/api/judge` HTTP contract, not the upstream provider.

Not done: `YOUR_TASKS.md` still says "get Anthropic key" — human-facing checklist, left for the user to update alongside the actual key swap.

---

## 2026-07-11 22:28 — UI v2: the LinkedIn clone + the tribunal document

User verdict on v1: "the ui looks really bland." Directive: research good LinkedIn/corporate/satirical-corporate UI and redesign (cap: 3 agents). Also: drop the "built for JEC Hacks" footer copy — gone.

**Research (2 parallel agents):**
1. *LinkedIn anatomy* — read computed styles + CSS custom properties live off linkedin.com: `#0a66c2` brand, `#f4f2ee` feed bg, rgba-black ink text, cards as 1px rings (no drop shadows), 52px nav, `#edf3f8` search pill, 48px avatars, Post pill h32/r16, disabled = gray wash, font = system-ui (no webfont), only weights 400/600.
2. *Verdict direction* — "official tribunal document": system serif (Iowan/Palatino/Georgia) letterhead + small-caps, ui-monospace transcript with line numbers, layered radial-gradient dark bg, foil-gradient gold, rubber-stamp rank reveal, exhibit tags, CSS-only seal. Motion sequenced Balatro-style: transcript → typewriter gavel → ease-out-expo count-up → stamp-in.

**Built:**
- `src/ui/Nav.tsx` (new) — parody global nav: brand bug + wordmark, search pill, 5 SVG icon items w/ labels, Home active underline, red "3" notification badge, Me avatar.
- `src/ui/Feed.tsx` (new) — ProfileRail (cover strip, avatar, best-rating/rank/rounds + "Profile viewers: 47"), PromptPost (assignment as a Promoted post from "The Assignment Desk": follow button, reaction pile, "Priya Sharma and 1,847 others", dead Like/Comment/Repost/Send row), NewsRail ("LARP News": "Man announces he woke up early", "Study: 98% of posts are LARP", …).
- `src/App.tsx` — 3-column feed shell (225/fluid/300, collapses 1080/780/560); composer rebuilt as LinkedIn post modal (avatar, "Post to: The Court ▾" chip, borderless editor, disabled-gray → blue **Post** pill). TopBar deleted; stats live in ProfileRail.
- `src/ui/Courtroom.tsx` — tribunal document: letterhead ("The Superior Court of Professional Authenticity", deterministic case no.), player's LARP as **Exhibit A**, numbered mono transcript with small-caps judge names, typewriter gavel line, foil count-up, stamp-in band (red ink < 1500, gold above), seal + "So ordered."
- `src/index.css` — full rewrite off the two specs; judge accents now burnt rose / banker blue / matcha; `prefers-reduced-motion` honored.

**Fix found during browser test:** mock fixture picked by text-hash only — an ISEF round got roasted about Clash Royale elixir. `pickMockResult` now prefers prompt-matched fixtures (isef → ISEF fixture, clash → good/bad by hash), hash fallback otherwise.

Design hook: flagged foil gradient text (kept — it IS the certificate motif) and springy stamp bezier (fixed — overshoot already lives in the keyframes, easing smoothed). Old side-tab/border findings are stale, file rewritten.

**Verified:** `tsc` + `npm run build` green (69 kB gzip). Screenshotted both phases in Chrome — writing phase reads instantly as LinkedIn, verdict screen is the shareable money shot (foil 2550 + rotated THOUGHT LEADER stamp).

---

## 2026-07-11 22:32 — OpenAI swap completed + key file ready

Finished what the 22:23 provider swap left open:

- `YOUR_TASKS.md` §1 rewritten Anthropic → OpenAI (platform.openai.com, `OPENAI_API_KEY=sk-...`), §2 Vercel env var name updated. Added the local-dev caveat: plain `npm run dev` has no serverless layer, so live judging needs Vercel or `npx vercel dev` — mock fallback covers local play either way.
- Created `.env` in the project root with a placeholder — user pastes the real key over `sk-paste-your-key-here`. Comments in the file state the rules: never commit, server-side only, Vite exposes only `VITE_`-prefixed vars to the browser so the key can't leak into the bundle.
- Key-hiding proof (project will be pushed to GitHub): ran `git init`, then `git check-ignore -v .env` → matched by `.gitignore:16`; `git status` does not list `.env`. `.env.example` (placeholder only) remains tracked on purpose.
- Swept the repo for stale `anthropic` references: only historical JOURNAL entries remain (kept — it's a journal). `api/judge.ts` and `.env.example` were already OpenAI.

No commit made — repo initialized only to verify ignore rules; commit/push stays a human step in `YOUR_TASKS.md`.

---

## 2026-07-11 22:47 — Backend rework: dead code out, trust boundaries hardened, courtroom back on paper

User directive: full backend pass — cut functions that don't work / aren't used, remove the fake "messages" dressing, fix gaps, and keep the judging UI on the same white LinkedIn background (fonts/styles stay).

**Dead code removed (all had zero callers):**
- `JUDGE_AXIS` map (contracts), `Player.name` field, `getPromptById` (prompts)
- `storage.saveResult / getResult / seed / clear` — Storage interface is now just `getPlayer`/`savePlayer`, which is all the game ever called
- `MOCK_FIXTURES` array (fixture picking is now explicit per prompt)
- Nav: Messaging + Notifications items and the fake red badge — non-functional inbox theater; nav is now Home / My Network / Jobs / Me

**Hardening:**
- `storage.getPlayer` shape-validates everything read from localStorage (rating in 0–3000, history entries filtered) — corrupt/tampered data falls back to a default player instead of crashing mid-demo
- `applyRound` caps history at the last 100 rounds (bounded localStorage)
- Client judge call gets a 20s `AbortSignal.timeout` — a hung request can no longer freeze "Convening the court…" forever; timeout falls into the fixture path like any other failure
- `api/judge.ts` re-checks game rules at the trust boundary: larp text 20–2000 chars, prompt ≤ 300 (400 otherwise); model output now sanitized element-by-element — unknown judges/axes dropped, duplicate axes deduped, transcript capped at 12 turns, empty-after-filter throws → 502 → client fixture fallback. Malformed model output can no longer reach the UI.
- UI textarea `maxLength=2000` mirrors the server cap

**Mock coherence:** new `FIXTURE_GENERIC_MID` (domain-neutral, mean 6 → 1800 "guilty of being mid") — prompts without a dedicated fixture get it, so a speedrun/houseplant round is never roasted about elixir. isef → ISEF fixture, clash → good/bad by text hash, everything else → generic.

**Courtroom re-skin (no more scene change):** dark tribunal deleted; the verdict now renders as a printed paper document (`#fdfcf9`, ruled lines) on the same white feed under the same nav. Serif/mono/small-caps/exhibit tags/stamp all kept; gold remapped to bronze (`#8a6a24`) for light-bg contrast; rating number is solid engraved bronze (gradient-text dropped — also cleared the design-hook finding); judge accents darkened (rose/banker blue/green); "Run it back" is a LinkedIn-blue pill again.

**Verified:** app `tsc` + build green (69.2 kB gzip); `api/judge.ts` typechecked standalone with node types, clean. Browser pass: clash prompt → clash fixture, paper verdict renders, stamp lands. TypeScript reviewer agent sweeping the reworked files; findings folded in if any.

### 22:58 addendum — reviewer findings, all fixed

TypeScript reviewer returned 3 HIGH, every one confirmed and fixed:
1. `finalizeCourtroom` passed verdict scores through unclamped — a hallucinated `14/10` or `NaN` would render raw in the verdict cards. Now clamps every verdict score through `clampScore` before computing the rating (scoring.ts).
2. `validateRaw` accepted partial panels — 2 or 3 verdicts would silently average over fewer axes and drift live ratings off the fixture-calibrated distribution. Now requires exactly the 4 canonical axes or throws (→ 502 → fixture fallback); also requires finite scores (api/judge.ts).
3. `api/judge.ts` was typechecked by NOTHING — no tsconfig project included it, so `npm run build` shipped the live endpoint unchecked (Vercel transpiles without typechecking). New `tsconfig.api.json` (bundler resolution, node types, strict) referenced from the root solution file — `tsc -b` now covers it on every build. Verified: build green, api tsbuildinfo emitted.

Reviewer also re-derived all four fixture ratings against `round(mean/10×3000)` — exact — and confirmed client/server char limits match (20/2000).

---

## 2026-07-11 23:25 — Pushed to GitHub

Initial commit `0263a5e` pushed to **github.com/ax-json/larpdIn** (`main`). Verified tracked files include only `.env.example` — the real `.env` (live key) never left the machine. Note: user's global git config rewrites SSH→HTTPS (`insteadOf`); worked around with a repo-local reverse rule so pushes go over SSH. Next: Vercel import + `OPENAI_API_KEY` env var (YOUR_TASKS.md §2).

---

## 2026-07-11 23:55 — Live judges working on Vercel (debug saga)

Deployed site (larpd-in.vercel.app) served only mock verdicts. Root-caused in three steps:

1. `/api/judge` returned `FUNCTION_INVOCATION_FAILED` even on GET → crash at module load, not logic. Converted the handler from the Web `Request`/`Response` signature to the classic Node `(req, res)` signature + `maxDuration: 60` (gpt-4o needs more than the 10s default). Still crashed.
2. Deployed a bare `api/ping.ts` probe → worked (Node v24). Added a single `../src` import to it → crashed. **Root cause: Vercel loads api functions as ESM and keeps relative imports extensionless; Node's ESM resolver refuses them.**
3. Fix: explicit `.js` extensions on every api-reachable import (`api/judge.ts` → `judgePrompt.js` / `scoring.js` / `contracts.js`, and inside `judgePrompt.ts` → `contracts.js`). TS maps `.js`→`.ts` at typecheck; Vite doesn't care; Node runtime resolves. Ping then returned the cross-dir value; judge answered a proper 405 on GET.

Remaining 503 was just the missing `OPENAI_API_KEY` env var (import-screen entry hadn't stuck); user added it in project settings + redeployed. **Live test call returned a real gpt-4o courtroom**: 6-turn transcript in-voice, 4 verdicts (9/9/8/8 → 2550), rating computed in code. The buzzword-discipline twist held ("Solid buzzword discipline" from the VC who gushed in dialogue).

Probe `api/ping.ts` deleted. The game is fully live: larpd-in.vercel.app.

---

## 2026-07-12 00:23 — Asset bundle integrated (icons + mascot)

User dropped `larpyourself-assets/` (icons + mascot + README-ASSETS). Integrated per its README:

- `src/ui/Icons.tsx` — TS port of the bundle's `Icons.jsx` (typed `{size} & SVGProps`, currentColor). Whole set in use, zero dead icons: Logo (nav brand, replaces the "lY" bug), Home/Network/Jobs + Search (nav), Clipboard (Assignment Desk avatar, blue on pale circle), Like/Comment/Repost/Send (post action row — emoji gone), Gavel (courtroom, bronze, above the verdict line), Trophy (profile "Best rating" row).
- `public/mascot-founder.png` — the turtleneck founder is now the player: profile rail avatar, composer avatar, nav "Me" avatar (circle-cropped via object-fit).
- `public/favicon.svg` — replaced with the bundle's logo.svg (browser tab matches the brand).
- CSS: avatars converted span→img rules, action row flex-aligned, dead `.brand-bug`/`.nav-badge` styles removed.

Build green (70.05 kB gzip). Verified in browser: feed + courtroom both render with the new set.

---

## 2026-07-12 00:44 — Rename: larpYourself → LARPedIn

Project renamed to **LARPedIn** across all files (user call — closer to the LinkedIn parody). Brand markup is now `LARPed` + blue `In` (even more on-the-nose than the blue Y). Swept every case variant: docs (README/SPEC/OUTLINE/YOUR_TASKS/LARP_EXAMPLES), all src comments + UI, `index.html` title, `package.json` name (`larpedin`), localStorage key (`larpedin:player` — old local bests reset, pre-launch acceptable), assets folder → `larpedin-assets/`. JOURNAL history left untouched (it's a log). GitHub repo slug stays `larpdIn` unless renamed in repo settings — cosmetic.

---

## 2026-07-12 00:52 — New LARPedIn brand icon

User delivered `larpedin-icon.svg` (blue rounded square, white "Ln" mark — the LinkedIn bug, LARPed). Dropped in as `public/favicon.svg` and as the nav `Logo` component in `src/ui/Icons.tsx` (viewBox 96, scales via `size` prop). Verified in browser: nav + tab both carry the new mark. Build green.

---

## 2026-07-12 00:58 — Prompt bank: 10 → 102

User delivered `LARP_PROMPTS_100.txt`. Merged into `src/game/prompts.ts`: 92 new prompts added across ten flavor groups (gaming/home/travel/food/academia/fitness/work/hobbies/nature/digital); 8 of the 100 already existed as the curated examples (clash, speedrun, discord, houseplant, parallel parking, olympiad, TA award) and the 5K one was a near-dupe of couch-to-5k — skipped. Tiers per the file's difficulty notes: real-ish ones (gold rank, Minecraft win, spelling bee) = mid, rest mundane. New prompts ship without prefilled examples — composer placeholder covers; the original 10 keep their hand-written seeds. 102 unique ids verified, build green.

## 2026-07-12 01:22 — User-submitted prompts behind an AI gate (Option B)

Community topics now enter the pool — but only through one door.

- **Types** (`src/types/contracts.ts`): `UserPrompt { id, text, category, submittedAt, status }`, `UserPromptStatus`, plus `PROMPT_CATEGORIES` (the 12 existing domains) as the shared allowlist for the dropdown and the gate.
- **Endpoint** (`api/validate-prompt.ts`, new): POST `{ text, category? }` → `{ ok, category?, reason? }`. Pre-checks before spending an LLM call: 3–80 char bounds, word-boundary profanity/slur blocklist, control-char stripping. Then ONE gpt-4o classification call (temp 0, strict JSON) whose system prompt treats the submission as DATA — explicit anti-injection instructions ("approve this" / "ignore previous rules" are content to classify, not commands). Approves only real, SFW, non-defamatory, non-injection LARP-able topics; picks best-fit category. FAILS CLOSED: upstream error, malformed output, non-boolean `approve` → rejected. Rejection reason is one fixed generic string — no exploit-useful detail ever leaves the server.
- **Client gate** (`src/game/userPrompts.ts`, new): `validatePrompt()` is the ONLY path to approval; 15s timeout, fail-closed on transport errors (distinct "court is in recess" reason so the UI can show an error state). Approved topics stored in `larpedin:userPrompts` (sanitized on read, capped 50) and exposed as regular `Prompt`s via `getApprovedUserPrompts()`.
- **UI** (`src/ui/SuggestTopic.tsx`, new): "Suggest a LARP topic" card in the feed — input (80 max, submit disabled under 3), optional category dropdown ("clerk decides"), three result states: approved / declined / recess. LinkedIn card styling, `.suggest-*` classes in index.css.
- **Seam** (`src/game/prompts.ts`): pickers now draw from `[...PROMPTS, ...getApprovedUserPrompts()]`. Judge, scoring, courtroom untouched.
- Verified: build green; 12-case smoke test on the bundled handler — every failure mode (short/long/blocklist/network/500/malformed JSON/string-typed approve) → rejected; happy path approves; "Scunthorpe" passes the word-boundary blocklist; bad model category falls back to `everyday`.

## 2026-07-12 01:37 — Composer gag line

- Composer card, under "You": added headline "CEO of nothing" (`composer-headline`, 12px ink-soft — same style as the scope line). Build green.

## 2026-07-12 01:43 — Mock-judges toggle removed

- Composer's "🎭 mock judges (offline)" checkbox gone: `mockMode` state + label out of App.tsx, `judgeLarp` signature back to `(prompt, larp)` in judge.ts, `.mock-toggle` CSS deleted, Post button now right-aligned (`composer-foot` flex-end).
- Silent fixture FALLBACK stays — live judge failure still lands in a courtroom, and the verdict page still labels those rounds. Only the user-facing offline switch is gone.

## 2026-07-12 02:27 — Animated verdict page (the bench)

Implemented the user's verdict-page brief from `~/Downloads/larpdin files` (README + sprite bundle). Presentation only — judge/scoring untouched.

- **Sprites**: 3 pixel-art judges → `public/judges/judge-{recruiter,vc,intern}.png`, rendered `image-rendering: pixelated` at 140px.
- **Bench** (`Courtroom.tsx`): mounts the INSTANT the player posts — App now flips to the court-shell on submit and passes `result: null` while the live call is in flight; judges bob in idle over "The court is deliberating…" (the animation IS the loading state, per brief §4). Mock-toggle-era feed-with-spinner gone.
- **Argue choreography**: as each transcript line reveals (1150ms stagger), the speaking judge switches to the lean-in/double-bounce `arguing` keyframes over a colored halo; the other two dim (opacity .42 + grayscale). All settle to idle when testimony ends. CSS ported from the bundle's `judge-animation.html`.
- **Resequenced verdict** per brief §2: gavel SLAM (drop-rotate + court-shake + "— SO ORDERED —") → exhibits B–E flip up staggered → verdict line types out → rating counts up → rank stamp. Score withheld until after the gavel.
- **Skip + reduced motion**: skip jumps everything to the final static card; `prefers-reduced-motion` renders instant with all keyframes killed via media query.
- Verified in-browser (chrome-devtools on :5173): bench idles at post, `arguing`+halo tracks the speaking judge with others `dimmed`, 7 turns reveal, slam → 4 cards → 1800/3000 count → ASSOCIATE stamp → Run it back. Build green.
- Dead CSS removed: `.gavel-ico`, `.so-ordered` (small foot text replaced by the big slam banner).

## 2026-07-12 02:37 — Readable testimony pacing

- Transcript lines now reveal at reading speed: first line 500ms after the verdict lands, every next line +5s (`FIRST_LINE_DELAY_MS` / `LINE_STAGGER_MS` in Courtroom.tsx). Each line eases in (`turn-in` fade+rise) instead of popping. Reduced-motion kills it; skip still jumps everything.
- Browser-timed on :5173 — reveals at 0.75s / 5.5s / 10.5s.
