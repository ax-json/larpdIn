/**
 * "Suggest a LARP topic" — the community submission box.
 *
 * One input + optional category, gated by validatePrompt() (the AI court
 * clerk). Approved topics join the pool the next round draws from; rejected
 * ones get a deliberately vague no. Styled as a plain LinkedIn feed card.
 */

import { useState } from 'react';
import type { PromptCategory } from '../types/contracts';
import { PROMPT_CATEGORIES } from '../types/contracts';
import {
  GATE_ERROR_REASON,
  MAX_TOPIC_CHARS,
  MIN_TOPIC_CHARS,
  buildApprovedPrompt,
  saveApprovedPrompt,
  validatePrompt,
} from '../game/userPrompts';

type GateState = 'idle' | 'checking' | 'approved' | 'rejected' | 'error';

export default function SuggestTopic() {
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState<'' | PromptCategory>('');
  const [state, setState] = useState<GateState>('idle');

  const trimmed = topic.trim();
  const canSubmit =
    trimmed.length >= MIN_TOPIC_CHARS && trimmed.length <= MAX_TOPIC_CHARS && state !== 'checking';

  async function submitTopic() {
    if (!canSubmit) return;
    setState('checking');

    const verdict = await validatePrompt(trimmed, category === '' ? undefined : category);
    if (verdict.ok && verdict.category) {
      saveApprovedPrompt(buildApprovedPrompt(trimmed, verdict.category));
      setTopic('');
      setState('approved');
      return;
    }
    setState(verdict.reason === GATE_ERROR_REASON ? 'error' : 'rejected');
  }

  return (
    <div className="card suggest">
      <h3 className="suggest-title">Suggest a LARP topic</h3>
      <p className="suggest-sub">
        Pitch a mundane achievement for the pool. The court clerk reviews every submission.
      </p>
      <input
        className="suggest-input"
        type="text"
        value={topic}
        maxLength={MAX_TOPIC_CHARS}
        disabled={state === 'checking'}
        onChange={(e) => {
          setTopic(e.target.value);
          setState('idle');
        }}
        placeholder={'e.g. "Folded a fitted sheet"'}
        aria-label="Suggested LARP topic"
      />
      <div className="suggest-row">
        <select
          className="suggest-select"
          value={category}
          disabled={state === 'checking'}
          onChange={(e) => setCategory(e.target.value as '' | PromptCategory)}
          aria-label="Topic category"
        >
          <option value="">Category: clerk decides</option>
          {PROMPT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button className="post-btn" onClick={submitTopic} disabled={!canSubmit}>
          {state === 'checking' ? 'Under review…' : 'Suggest'}
        </button>
      </div>
      {state === 'approved' && (
        <p className="suggest-note suggest-ok">Added to the pool. It can come up next round.</p>
      )}
      {state === 'rejected' && (
        <p className="suggest-note suggest-no">
          The court declined this topic. Try a different mundane achievement.
        </p>
      )}
      {state === 'error' && (
        <p className="suggest-note suggest-no">The court is in recess. Try again in a moment.</p>
      )}
    </div>
  );
}
