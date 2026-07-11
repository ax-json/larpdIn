/**
 * The courtroom scene — the show (SPEC §2.3, never cut).
 *
 * Styled as an official tribunal document: letterhead, the player's LARP as
 * Exhibit A, judge testimony as a numbered transcript, then the finding —
 * gavel line types out, the rating counts up in foil gold, and the rank band
 * stamps in rotated like ink on paper. "Skip to verdict" jumps the queue.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import type { CourtroomResult, Prompt, Judge } from '../types/contracts';
import { JUDGE_NAMES } from '../types/contracts';
import { bandFor } from '../game/scoring';
import { IconGavel } from './Icons';

const LINE_STAGGER_MS = 520;
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

/** Deterministic 4-digit case number from the prompt id. */
function caseNumber(promptId: string): string {
  let h = 0;
  for (const ch of promptId) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return `LARP-2026-${(h % 9000) + 1000}`;
}

interface CourtroomProps {
  result: CourtroomResult;
  prompt: Prompt;
  larpText: string;
  usedMock: boolean;
  newBest: boolean;
  onRunItBack: () => void;
}

export default function Courtroom({ result, prompt, larpText, usedMock, newBest, onRunItBack }: CourtroomProps) {
  const { transcript, verdicts, rating, verdictLine } = result;
  const [revealed, setRevealed] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const timers = useRef<number[]>([]);

  const done = skipped || revealed >= transcript.length;

  // Drop transcript lines in on a timer; cleared on skip/unmount.
  useEffect(() => {
    if (skipped) return;
    const ids: number[] = [];
    for (let i = 1; i <= transcript.length; i++) {
      ids.push(window.setTimeout(() => setRevealed(i), i * LINE_STAGGER_MS));
    }
    timers.current = ids;
    return () => ids.forEach(window.clearTimeout);
  }, [transcript.length, skipped]);

  function skip() {
    timers.current.forEach(window.clearTimeout);
    setRevealed(transcript.length);
    setSkipped(true);
  }

  const shownLines = skipped ? transcript : transcript.slice(0, revealed);

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

      {done && (
        <Verdict verdicts={verdicts} rating={rating} verdictLine={verdictLine} newBest={newBest} onRunItBack={onRunItBack} />
      )}
    </section>
  );
}

const EXHIBIT_LETTERS = ['B', 'C', 'D', 'E'];

type Stage = 'gavel' | 'count' | 'stamp';

interface VerdictProps {
  verdicts: CourtroomResult['verdicts'];
  rating: number;
  verdictLine: string;
  newBest: boolean;
  onRunItBack: () => void;
}

function Verdict({ verdicts, rating, verdictLine, newBest, onRunItBack }: VerdictProps) {
  const [stage, setStage] = useState<Stage>('gavel');
  const typed = useTypewriter(verdictLine, GAVEL_CHAR_MS, GAVEL_MAX_MS, () => setStage('count'));
  const counting = stage !== 'gavel';
  const shown = useCountUp(counting ? rating : 0, COUNTUP_MS);
  const band = useMemo(() => bandFor(rating), [rating]);
  const stampInk = rating < RED_STAMP_BELOW ? 'stamp-red' : 'stamp-gold';

  // Stamp lands a beat after the count settles.
  useEffect(() => {
    if (stage !== 'count') return;
    const id = window.setTimeout(() => setStage('stamp'), COUNTUP_MS + STAMP_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [stage]);

  return (
    <div className="verdict">
      <div className="verdict-cards">
        {verdicts.map((v, i) => (
          <div key={i} className={`vcard ${JUDGE_KLASS[v.judge]}`}>
            <span className="vcard-exhibit">Exhibit {EXHIBIT_LETTERS[i] ?? '?'}</span>
            <span className="vcard-axis">{v.axis}</span>
            <span className="vcard-score">{v.score}<small>/10</small></span>
            <p className="vcard-line">{v.oneLiner}</p>
          </div>
        ))}
      </div>

      <div className="gavel">
        <span className="gavel-ico" aria-hidden="true"><IconGavel size={26} /></span>
        <p className="gavel-line">{typed}<span className="caret" aria-hidden="true" /></p>
        <div className={`rating-num ${stage === 'stamp' ? 'settled' : ''}`}>
          {shown}<small> / 3000</small>
        </div>
        <div className="stamp-row">
          {stage === 'stamp' && (
            <span className={`stamp ${stampInk}`}>{band}</span>
          )}
          {stage === 'stamp' && newBest && <span className="best-tag">★ new personal best</span>}
        </div>
      </div>

      {stage === 'stamp' && (
        <footer className="court-foot">
          <span className="seal" aria-hidden="true" />
          <span className="so-ordered">So ordered.</span>
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
