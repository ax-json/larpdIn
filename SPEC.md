# larpYourself — Complete Project Spec (v2 — single-player courtroom)

> The LinkedIn LARP Game — "Competitive corporate LARPing, rated like chess.com, judged like a courtroom drama."
>
> Hackathon: JEC Hacks (open-ended innovation) · Solo build · compressed ~5h window · Deadline ~1–2 AM IST
> Submission: GitHub repo via Devpost · Scope: website only
>
> **v2 (21:23 IST):** pivoted from async 1v1 battles to SINGLE-PLAYER. No opponent, no win/lose
> statement. The player's LARP goes before the judge panel; the judging phase plays out like a
> courtroom scene — judges argue about the LARP live on screen — and the verdict is a rating
> out of 3000. Multiplayer battles → future slide. Changes marked **[PIVOT]**.
> v1 history + council review preserved in §11 and `JOURNAL.md`. Original artifact: `PLAN.txt`.

---

## 1. Concept

A single-player game. The player gets a prompt — a small or mundane achievement ("Clash Royale
enthusiast", "participated in a science olympiad, didn't win") — and writes one paragraph
"LARPing" it into an impressive-sounding, LinkedIn-style flex. Then the courtroom convenes:
three structurally-opposed AI judge personas argue over the LARP, line by line, on screen —
and hand down a rating out of **3000** (chess-style scale; 2882 is the highest real chess
rating ever, so 3000 is the untouchable ceiling).

**[PIVOT]** Why single-player beats async-PvP for tonight:
- The courtroom argument IS the product — three characters fighting over your paragraph is
  funnier and more memorable than a score comparison. v1 buried it under battle mechanics.
- No opponent needed → no seeded-opponent content burden (council flagged seeds as a hidden
  2-hour comedy-writing task), no fake-PvP framing to defend.
- Demos perfectly solo, replay loop is "beat your own rating," and multiplayer stays credible
  as the roadmap slide it always was.

### What is a LARP (from LARP_EXAMPLES.txt — judge-prompt source material)
A great LARP is a TRUE SMALL THING, dressed in professional language, held together by REAL
DOMAIN SPECIFICS, kept just BELIEVABLE ENOUGH that an AI screener wouldn't flag it.
- GOOD = real specifics + honest scale + earned reframe
- BAD = buzzwords + inflated scale + asserted (not earned) claims
- **The noun test:** strip the topic noun; if the sentence survives on any topic it's noise,
  if it collapses it's a LARP.

## 2. Game Mechanics

### 2.1 The prompt
One prompt per round, at a prestige level:
- Low/mundane: "Clash Royale enthusiast" — tests creativity
- Mid: "Participated in a science olympiad (didn't win)"
- High/prestige: "You won ISEF" — tests RESTRAINT (flex without cringe)

### 2.2 The LARP
Player writes ONE paragraph. Textarea ships pre-filled with an editable example (council: blank
page is the worst demo ask). Good LARP = authentic domain references, not empty buzzwords.

### 2.3 The courtroom **[PIVOT — replaces battles]**
On submit, the judging phase plays as a scene:
1. Judges' dialogue appears on screen line by line — opening takes, rebuttals, judges
   referencing and arguing with each other. Courtroom drama pacing; LLM latency becomes
   the show.
2. Per-judge axis scores land as each judge rests their case.
3. Gavel: final rating out of 3000, with a one-line verdict.

No "you win." The stakes are the rating and your personal best.

### 2.4 Rating out of 3000 **[PIVOT — replaces ELO updates]**
Deterministic mapping, not LLM vibes: judges score axes 0–10 against the anchored rubric;
aggregate average × 300 → 0–3000. Rating bands give it flavor:

| Band | Rating | Read |
|---|---|---|
| Noise | 0–899 | Failed the noun test. Buzzword spam. |
| Intern | 900–1499 | Some real detail, oversold or undersold. |
| Associate | 1500–2099 | Solid LARP. Real specifics, mostly believable. |
| Thought Leader | 2100–2599 | Earned reframe, honest scale, survives screening. |
| Grandmaster LARPer | 2600–3000 | The Recruiter couldn't catch it. Frame-perfect. |

Personal best persists locally; beating it is the replay loop.

## 3. The Judging Panel (the core artifact)

Three AI personas, each OWNING one rubric axis with an opposing win condition — opposed
incentives force real disagreement (tone alone collapses into one bland voice):

| Judge | Owns axis | Character | Win condition |
|---|---|---|---|
| The Burnt-out Recruiter | D — Detectability (+ A folded in) | Seen 10,000 profiles, sniffs fakes | Wants to CATCH you lying |
| The Buzzword VC | C — Buzzword appeal | Dazzled by "synergy", "10x", "disrupt" | Wants to be IMPRESSED |
| The Gen-Z Intern | B — Restraint / Believability | Allergic to cringe | Wants you to NOT embarrass yourself |

### 3.1 Rubric axes
- **A. Plausibility / Domain Authenticity** — references REAL knowledge? (noun test)
- **B. Restraint / Believability** — oversold into cringe, or kept just-believable?
- **C. Buzzword Density** — double-edged: too many buzzwords LOSES points with everyone but the VC.
- **D. Detectability** — "would an AI recruiter screener flag this as fake?"

### 3.2 Implementation rules
- **ONE structured LLM call.** Returns the full courtroom: transcript turns + 3 verdicts +
  rating, as JSON. Same cost/latency as a single judge.
- **[PIVOT] Transcript is first-class:** 6–9 dialogue turns (each judge 2–3 lines), judges must
  reference each other's points ("The Intern's right, it's cringe — but I'd still fund it").
  Cap turns hard; a 20-line scene kills pacing.
- **Courtroom reveal:** lines appear sequentially (type-on), scores land per judge, gavel +
  count-up to final rating. Split panels (2 impressed, 1 unconvinced) are the best moments.
- **Determinism guard (council):** temperature ≤ 0.3; absolute anchored rubric in the prompt
  (what a 3 / 7 / 9 looks like per axis, using LARP_EXAMPLES.txt good/bad pairs); rating
  computed from axis scores in code, NOT asked from the LLM.
- Calibration set: the 5 good/bad pairs in LARP_EXAMPLES.txt — good ones must land 2100+,
  bad ones under 900, voices distinct.

### 3.3 Content safety
Prompts fictionalized/generic. Visible "this is satire" banner. No LARPing as named real
people giving real professional advice.

## 4. Design Decisions (locked)

1. **User WRITES own LARP** — it IS the game; rating means something.
2. **[PIVOT] Single-player courtroom, not async PvP.** v1's async battles existed to fake
   multiplayer without WebSockets; the pivot removes the pretense and promotes the panel
   argument to centerpiece. Live multiplayer stays on the future slide.
3. **Panel of 3, not 1 judge.** Single judge reads as a wrapper; the panel argument is content.
4. **Hiring Panel trio** (Recruiter/VC/Intern) — cleanest rubric mapping, re-skinnable later.
5. **Rating out of 3000, computed in code** from judge axis scores — playful chess.com nod,
   deterministic, retry-proof.

## 5. Stack

- Vite + React + TypeScript, single page. Types ARE the contracts.
- LLM behind ONE server-side function (Vercel/Netlify). Key in env, never client-side.
- Storage module (localStorage): personal best, past verdicts. Swappable interface.
- **Runtime mock-judge toggle** (council): cached courtroom fixtures play the full scene
  offline if the live API dies mid-demo.

## 6. Data Contracts (define first, verbatim) **[PIVOT — Battle removed]**

```ts
Prompt          { id, text, domain, tier: 'mundane' | 'mid' | 'prestige' }
Larp            { id, promptId, text }
TranscriptTurn  { judge, line }                        // one courtroom dialogue line
Verdict         { judge, axis, score: 0-10, oneLiner } // per-judge scoring
CourtroomResult { transcript: TranscriptTurn[],        // 6-9 turns, hard-capped
                  verdicts: Verdict[3],
                  rating: 0-3000,                      // computed in code, not by LLM
                  verdictLine }                        // the gavel line
Player          { name, bestRating, history: { promptId, rating }[] }
```

## 7. Build Order (compressed ~5h, single-player) **[PIVOT — rewritten]**

Judge-first and deploy-early (council) unchanged. Battle logic and opponent seeding deleted;
freed time goes to the courtroom scene.

### H0–0.5 — STEP 0: Scaffold + contracts
Vite + React + TS scaffold; contracts file (§6 verbatim); storage interface (localStorage).
EXIT: builds, runs, contracts compile.

### H0.5–1.5 — STEP 1: The courtroom prompt, bare script ** GO/NO-GO GATE **
Standalone script: LARP in → real LLM call → CourtroomResult JSON out.
Prompt contains: 3 personas + win conditions, anchored rubric with LARP_EXAMPLES good/bad
anchors, transcript format (6–9 turns, cross-referencing argument), structured JSON, low temp,
satire framing. Tune against the 5 calibration pairs: good → 2100+, bad → <900, voices
distinct, argument actually funny. Defensive parse + retry; capture 2–3 fixtures (mock +
demo insurance). If the argument is bland after an hour: fewer axes, sharper personas, NOW.
EXIT: real call returns a distinct, calibrated, funny courtroom as valid JSON.

### H1.5–2 — STEP 2: Scoring math (20 min, boring on purpose)
Aggregate verdict scores → average × 300 → rating 0–3000; band lookup; personal-best update.
Pure functions + quick asserts. No battle compare, no ELO update math.
EXIT: fixture JSON in → correct rating + band out, in the terminal.

### H2–2.5 — STEP 3: Deploy the skeleton early
Serverless fn wrapping the Step 1 prompt; env key; deploy to Vercel/Netlify NOW (fight
CORS/env at 11 PM, not 1 AM). Wire real `judgeLarp()` behind same interface as mock.
EXIT: live URL judges a LARP end-to-end from a fresh browser.

### H2.5–3.10 — STEP 4: Prompt bank + fixtures (~40 min — trimmed) **[PIVOT]**
~10 prompts as JSON across 3 tiers. Pre-fill example LARPs per tier (LARP_EXAMPLES-quality).
Cached courtroom fixtures for offline mode. NO opponent seeds — none needed.
EXIT: storage returns prompts + prefills; mock mode plays a full round.

### H3.10–4.10 — STEP 5: Game UI
Prompt screen → pre-filled editable textarea → submit → courtroom route. Loading state =
"court is convening…" theatre.
EXIT: full round in the browser on the real judge.

### H4.10–5.10 — STEP 6: THE COURTROOM SCENE + satire skin ** NEVER CUT **
Sequential type-on dialogue, judge avatars/nameplates, per-judge scores landing as each rests,
gavel moment, rating count-up, band reveal, personal-best banner. LinkedIn-parody identity
(corporate blue, "endorsements" styling). This is the wow; the argument is the demo.
EXIT: a full round plays start-to-finish and the scene lands.

### Final ~45 min — STEP 7: Submission block ** HARD STOP **
Demo video FIRST — script around a split panel (2 impressed, 1 calls it fake) + gavel + rating
reveal. README/JOURNAL final pass. Fresh-browser deploy check. Push. Devpost writeup +
screenshots/GIF.

## 8. Cut Ladder (pre-decided) **[PIVOT — updated]**

Already cut upfront: leaderboard (gone with multiplayer), mobile polish, judge mood quirks,
opponent seeding (obsolete).
Cut in order if behind:
1. Rating-band flair (bands stay as text, lose styling)
2. History list (keep personal best only)
3. Third prompt tier (ship 2)
4. Type-on animation → lines appear whole (scene structure stays)

**NEVER cut:** courtroom scene · satire skin · pre-filled demo path · final 45-min block.

## 9. Risk Register **[PIVOT — updated]**

| # | Risk | Mitigation |
|---|---|---|
| 1 | "AI-judged" reads as wrapper | Visible per-axis verdicts + computed rating + argued transcript |
| 2 | LLM latency wrecks pacing | Courtroom reveal IS the latency cover; "court convening" state |
| 3 | Judge voices collapse into one | Structurally opposed win conditions; calibration pairs |
| 4 | Scores feel arbitrary on retry | Low temp, anchored rubric, rating computed in code |
| 5 | Courtroom prompt bland — found too late | Step 1 bare-script gate, hour 1 |
| 6 | 1 AM deploy fight | Deploy skeleton by H2.5; runtime mock toggle |
| 7 | Blank-textarea demo stall | Pre-filled editable LARP; cached fixture replay |
| 8 | Transcript too long → scene drags **[PIVOT new]** | Hard cap 6–9 turns in prompt + truncate in parser |
| 9 | Single-player lacks stakes **[PIVOT new]** | Rating bands + personal best + "beat 2600" taunt; multiplayer on roadmap slide |
| 10 | Content safety | Satire banner, fictionalized prompts only |

## 10. Deliverables

- [ ] Deployed site — live URL verified in fresh browser
- [ ] Demo video around one split-panel courtroom scene
- [ ] README.md — product overview only
- [ ] JOURNAL.md — idea evolution (kept live all night)
- [ ] 60-second demo path, works solo, offline-capable via fixtures

## 11. Decision History

**Council review (2026-07-11 ~21:00, pre-pivot):** 4-voice council said GO on the v1 async-PvP
plan; amendments adopted: judge-prompt-first gate, deploy early, pre-filled textarea, demo
video as first-class deliverable, determinism guard, protected skin, runtime mock toggle,
pre-decided cuts. Skeptic proposed dropping battles for single-player "Judge My Flex" — REJECTED
at the time to protect the game framing. Full log in `JOURNAL.md`.

**[PIVOT] 21:23 — single-player courtroom.** User call. Skeptic's direction, but sharper than
his version: judging isn't a scorecard, it's a STAGED ARGUMENT with a chess-style rating —
game framing survives via rating/3000 + bands + personal best, without any PvP machinery.
Battle contracts, ELO update math, and opponent seeding deleted; courtroom transcript promoted
to first-class output; freed time reallocated to the scene.

---

*Source of truth: this file. Concept material: `LARP_EXAMPLES.txt` (judge-prompt anchors).
History: `PLAN.txt` (v1 plan), `JOURNAL.md` (evolution log).*
