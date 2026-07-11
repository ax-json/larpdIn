/**
 * The courtroom scene — the show (SPEC §2.3, never cut).
 *
 * An animated proceeding on tribunal paper. The bench mounts the INSTANT the
 * player posts — three pixel-art judges bobbing in idle while the live call
 * is in flight, so the deliberation IS the loading state. When the verdict
 * lands, the judges argue one by one (the speaker leans in over a colored
 * halo, the others dim), then the gavel SLAMS — "SO ORDERED" — before the
 * four axis exhibits flip up, the rating counts up in foil gold, and the
 * rank band stamps in. The score is withheld until after the gavel on
 * purpose: it's a verdict, not a report. Skippable. prefers-reduced-motion
 * keeps the reading pace but strips the decorative animation (CSS media query).
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import type { CourtroomResult, Prompt, Judge } from '../types/contracts';
import { JUDGE_NAMES } from '../types/contracts';
import { bandFor } from '../game/scoring';
import { IconGavel } from './Icons';

/** First line lands fast; every next one waits long enough to actually read. */
const FIRST_LINE_DELAY_MS = 500;
const LINE_STAGGER_MS = 5000;
const SLAM_MS = 950;
const CARDS_MS = 1000;
const CARD_STAGGER_MS = 130;
const COUNTUP_MS = 1200;
const STAMP_DELAY_MS = 250;
const GAVEL_CHAR_MS = 24;
const GAVEL_MAX_MS = 1600;
const RED_STAMP_BELOW = 1500;

const JUDGE_KLASS: Record<Judge, string> = {
  recruiter: 'j-recruiter',
  vc: 'j-vc',
  intern: 'j-intern',
};

const BENCH_ORDER: Judge[] = ['recruiter', 'vc', 'intern'];

const SPRITES: Record<Judge, string> = {
  recruiter: '/judges/judge-recruiter.png',
  vc: '/judges/judge-vc.png',
  intern: '/judges/judge-intern.png',
};

/** Deterministic 4-digit case number from the prompt id. */
function caseNumber(promptId: string): string {
  let h = 0;
  for (const ch of promptId) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return `LARP-2026-${(h % 9000) + 1000}`;
}

/** The three judges. `active` argues over a glowing halo; the rest dim. */
function Bench({ active }: { active: Judge | null }) {
  return (
    <div className="bench">
      {BENCH_ORDER.map((j) => {
        const speaking = active === j;
        const dimmed = active !== null && !speaking;
        return (
          <div key={j} className="bench-judge">
            <div className="bench-stage">
              <span className={`halo ${JUDGE_KLASS[j]}${speaking ? ' on' : ''}`} aria-hidden="true" />
              <img
                className={`sprite ${speaking ? 'arguing' : 'idle'}${dimmed ? ' dimmed' : ''}`}
                src={SPRITES[j]}
                alt={JUDGE_NAMES[j]}
              />
            </div>
            <span className={`bench-name ${JUDGE_KLASS[j]}`}>{JUDGE_NAMES[j]}</span>
          </div>
        );
      })}
    </div>
  );
}

interface CourtroomProps {
  /** null while the live judges are still deliberating (call in flight). */
  result: CourtroomResult | null;
  prompt: Prompt;
  larpText: string;
  usedMock: boolean;
  newBest: boolean;
  onRunItBack: () => void;
}

export default function Courtroom({ result, prompt, larpText, usedMock, newBest, onRunItBack }: CourtroomProps) {
  const [revealed, setRevealed] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const timers = useRef<number[]>([]);

  const transcript = result?.transcript ?? [];
  // Pacing is reading time, not decoration — only an explicit skip fast-forwards
  // it. prefers-reduced-motion users keep the pace; the CSS media query strips
  // the decorative animation (bob, argue, shake, slides) for them instead.
  const instant = skipped;
  const done = result !== null && (instant || revealed >= transcript.length);

  // Drop transcript lines in on a timer once the verdict lands; cleared on skip/unmount.
  useEffect(() => {
    if (result === null || instant) return;
    const ids: number[] = [];
    for (let i = 1; i <= transcript.length; i++) {
      ids.push(
        window.setTimeout(() => setRevealed(i), FIRST_LINE_DELAY_MS + (i - 1) * LINE_STAGGER_MS)
      );
    }
    timers.current = ids;
    return () => ids.forEach(window.clearTimeout);
  }, [result, transcript.length, instant]);

  function skip() {
    timers.current.forEach(window.clearTimeout);
    setRevealed(transcript.length);
    setSkipped(true);
  }

  const shownLines = instant ? transcript : transcript.slice(0, revealed);
  // Whoever spoke last is mid-argument; everyone settles to idle when done.
  const active: Judge | null =
    !done && shownLines.length > 0 ? shownLines[shownLines.length - 1].judge : null;

  return (
    <section className="courtroom">
      <header className="letterhead">
        <span className="letter-rule" aria-hidden="true" />
        <span className="court-name">The Superior Court of Professional Authenticity</span>
        <span className="case-no">Case No. {caseNumber(prompt.id)} · In re: “{prompt.text}”</span>
        <span className="letter-rule" aria-hidden="true" />
        {usedMock && <span className="mock-badge">mock proceedings — no live counsel</span>}
      </header>

      <figure className="exhibit">
        <figcaption className="exhibit-tag">Exhibit A — the post</figcaption>
        <blockquote className="exhibit-text">{larpText}</blockquote>
      </figure>

      <Bench active={active} />

      {result === null && (
        <p className="deliberating" role="status">
          The court is deliberating<span className="dots" aria-hidden="true" />
        </p>
      )}

      {result !== null && (
        <div className="transcript">
          {shownLines.map((turn, i) => (
            <div key={i} className={`turn ${JUDGE_KLASS[turn.judge]}`}>
              <span className="turn-judge">{JUDGE_NAMES[turn.judge]}:</span>
              <p className="turn-line">{turn.line}</p>
            </div>
          ))}
          {!done && (
            <button className="skip-btn" onClick={skip}>
              skip to verdict →
            </button>
          )}
        </div>
      )}

      {done && result !== null && (
        <Verdict
          verdicts={result.verdicts}
          rating={result.rating}
          verdictLine={result.verdictLine}
          newBest={newBest}
          instant={instant}
          onRunItBack={onRunItBack}
        />
      )}
    </section>
  );
}

const EXHIBIT_LETTERS = ['B', 'C', 'D', 'E'];

type Stage = 'slam' | 'cards' | 'finding';

interface VerdictProps {
  verdicts: CourtroomResult['verdicts'];
  rating: number;
  verdictLine: string;
  newBest: boolean;
  /** Skip all staging — everything lands at once (skip / reduced motion). */
  instant: boolean;
  onRunItBack: () => void;
}

/** Gavel slam → exhibits flip up → the finding. Score stays hidden until the end. */
function Verdict({ verdicts, rating, verdictLine, newBest, instant, onRunItBack }: VerdictProps) {
  const [stage, setStage] = useState<Stage>(instant ? 'finding' : 'slam');

  useEffect(() => {
    if (instant) return;
    if (stage === 'slam') {
      const id = window.setTimeout(() => setStage('cards'), SLAM_MS);
      return () => window.clearTimeout(id);
    }
    if (stage === 'cards') {
      const id = window.setTimeout(() => setStage('finding'), CARDS_MS);
      return () => window.clearTimeout(id);
    }
  }, [stage, instant]);

  return (
    <div className={`verdict${stage === 'slam' && !instant ? ' court-shake' : ''}`}>
      <div className="slam">
        <span className={`slam-gavel${instant ? '' : ' slamming'}`} aria-hidden="true">
          <IconGavel size={34} />
        </span>
        <span className={`so-ordered-big${instant ? '' : ' so-in'}`}>— SO ORDERED —</span>
      </div>

      {stage !== 'slam' && (
        <div className="verdict-cards">
          {verdicts.map((v, i) => (
            <div
              key={i}
              className={`vcard ${JUDGE_KLASS[v.judge]}${instant ? '' : ' vcard-in'}`}
              style={instant ? undefined : { animationDelay: `${i * CARD_STAGGER_MS}ms` }}
            >
              <span className="vcard-exhibit">Exhibit {EXHIBIT_LETTERS[i] ?? '?'}</span>
              <span className="vcard-axis">{v.axis}</span>
              <span className="vcard-score">{v.score}<small>/10</small></span>
              <p className="vcard-line">{v.oneLiner}</p>
            </div>
          ))}
        </div>
      )}

      {stage === 'finding' && (
        <Finding
          rating={rating}
          verdictLine={verdictLine}
          newBest={newBest}
          instant={instant}
          onRunItBack={onRunItBack}
        />
      )}
    </div>
  );
}

type FindingStage = 'gavel' | 'count' | 'stamp';

interface FindingProps {
  rating: number;
  verdictLine: string;
  newBest: boolean;
  instant: boolean;
  onRunItBack: () => void;
}

/** The finding: verdict line types out, the rating counts up, the band stamps in. */
function Finding({ rating, verdictLine, newBest, instant, onRunItBack }: FindingProps) {
  const [stage, setStage] = useState<FindingStage>(instant ? 'stamp' : 'gavel');
  const typed = useTypewriter(verdictLine, GAVEL_CHAR_MS, GAVEL_MAX_MS, () => {
    if (!instant) setStage('count');
  });
  const counting = stage !== 'gavel';
  const counted = useCountUp(counting && !instant ? rating : 0, COUNTUP_MS);
  const shown = instant ? rating : counted;
  const band = useMemo(() => bandFor(rating), [rating]);
  const stampInk = rating < RED_STAMP_BELOW ? 'stamp-red' : 'stamp-gold';

  // Stamp lands a beat after the count settles.
  useEffect(() => {
    if (instant || stage !== 'count') return;
    const id = window.setTimeout(() => setStage('stamp'), COUNTUP_MS + STAMP_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [stage, instant]);

  return (
    <div className="gavel">
      <p className="gavel-line">
        {instant ? verdictLine : typed}
        <span className="caret" aria-hidden="true" />
      </p>
      <div className={`rating-num ${stage === 'stamp' ? 'settled' : ''}`}>
        {shown}<small> / 3000</small>
      </div>
      <div className="stamp-row">
        {stage === 'stamp' && <span className={`stamp ${stampInk}`}>{band}</span>}
        {stage === 'stamp' && newBest && <span className="best-tag">★ new personal best</span>}
      </div>

      {stage === 'stamp' && (
        <footer className="court-foot">
          <span className="seal" aria-hidden="true" />
          <button className="run-back" onClick={onRunItBack}>
            Run it back →
          </button>
        </footer>
      )}
    </div>
  );
}

/** Types `text` out char by char, capped at `maxMs` total; fires `onDone` once. */
function useTypewriter(text: string, charMs: number, maxMs: number, onDone: () => void): string {
  const [count, setCount] = useState(0);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const step = Math.max(1, Math.ceil((text.length * charMs) / maxMs));
    const tick = Math.min(charMs * step, charMs * 4);
    const id = window.setInterval(() => {
      setCount((c) => {
        const next = Math.min(text.length, c + step);
        if (next >= text.length) window.clearInterval(id);
        return next;
      });
    }, tick);
    return () => window.clearInterval(id);
  }, [text, charMs, maxMs]);

  useEffect(() => {
    if (count >= text.length && !doneRef.current) {
      doneRef.current = true;
      onDoneRef.current();
    }
  }, [count, text.length]);

  return text.slice(0, count);
}

/** Ease-out-expo count from 0 to `target` over `ms`. */
function useCountUp(target: number, ms: number): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (start === 0) start = t;
      const p = Math.min(1, (t - start) / ms);
      const eased = p >= 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setValue(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return value;
}
