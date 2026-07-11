/**
 * LARPedIn — the whole game loop in one small state machine.
 *
 *   writing → judging → verdict → (run it back) → writing
 *
 * Writing: a LinkedIn-parody feed — profile rail, the assignment as a
 * Promoted post, an empty composer (the placeholder is the only nudge), and
 * the LARP News sidebar. Submit flips straight to the courtroom:
 * the judges deliberate on the bench WHILE the live call is in flight (the
 * animation is the loading state), then the verdict plays out and the rating
 * folds into the local player. Best rating persists across rounds — the
 * single-player replay hook.
 */

import { useEffect, useState } from 'react';
import type { Prompt, Larp, Player, CourtroomResult } from './types/contracts';
import { storage } from './storage/storage';
import { getRandomPrompt, getNextPrompt } from './game/prompts';
import { judgeLarp } from './game/judge';
import { applyRound, isNewBest } from './game/scoring';
import Courtroom from './ui/Courtroom';
import Nav from './ui/Nav';
import type { Page } from './ui/Nav';
import { ProfileRail, PromptPost, NewsRail } from './ui/Feed';
import SuggestTopic from './ui/SuggestTopic';
import { NetworkPage, JobsPage, MePage } from './ui/Pages';

type Phase = 'writing' | 'judging' | 'verdict';

const MIN_LARP_CHARS = 20;
const MAX_LARP_CHARS = 2000;

export default function App() {
  const [player, setPlayer] = useState<Player>(() => storage.getPlayer());
  const [prompt, setPrompt] = useState<Prompt>(() => getRandomPrompt());
  const [text, setText] = useState('');
  const [phase, setPhase] = useState<Phase>('writing');
  const [result, setResult] = useState<CourtroomResult | null>(null);
  const [usedMock, setUsedMock] = useState(false);
  const [newBest, setNewBest] = useState(false);
  // Satire pages are overlays on the game — leaving Home never resets a round.
  const [page, setPage] = useState<Page>('home');

  // Fresh page for every prompt — the LARP is entirely the player's.
  useEffect(() => {
    setText('');
  }, [prompt]);

  async function submit() {
    const trimmed = text.trim();
    if (trimmed.length < MIN_LARP_CHARS || phase === 'judging') return;
    setUsedMock(false);
    setNewBest(false);
    setPhase('judging');

    const larp: Larp = { id: `${prompt.id}-${Date.now()}`, promptId: prompt.id, text: trimmed };
    const outcome = await judgeLarp(prompt, larp);
    const beat = isNewBest(player, outcome.result.rating);
    const nextPlayer = applyRound(player, prompt.id, outcome.result.rating);

    storage.savePlayer(nextPlayer);
    setPlayer(nextPlayer);
    setResult(outcome.result);
    setUsedMock(outcome.usedMock);
    setNewBest(beat);
    setPhase('verdict');
  }

  function runItBack() {
    setResult(null);
    setPrompt(getNextPrompt(prompt.id));
    setPhase('writing');
  }

  const isJudging = phase === 'judging';
  const canPost = text.trim().length >= MIN_LARP_CHARS && !isJudging;

  return (
    <div className="app">
      <Nav page={page} onNavigate={setPage} />

      {page === 'network' && <NetworkPage />}
      {page === 'jobs' && <JobsPage />}
      {page === 'me' && <MePage player={player} />}

      {page === 'home' && phase === 'writing' && (
        <main className="shell">
          <ProfileRail player={player} />

          <section className="feed">
            <PromptPost prompt={prompt} />

            <div className="card composer">
              <div className="composer-head">
                <img className="composer-avatar" src="/mascot-founder.png" alt="" />
                <div className="composer-who">
                  <span className="composer-name">You</span>
                  <span className="composer-headline">CEO of Nothing</span>
                  <span className="composer-scope">Post to: The Court ▾</span>
                </div>
              </div>
              <textarea
                className="editor"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={7}
                maxLength={MAX_LARP_CHARS}
                disabled={isJudging}
                placeholder="What do you want to LARP about?"
                aria-label="Your LARP"
              />
              <div className="composer-foot">
                <button className="post-btn" onClick={submit} disabled={!canPost}>
                  {isJudging ? 'Convening the court…' : 'Post'}
                </button>
              </div>
            </div>

            <p className="feed-hint">Make it sound impressive. Keep it believable. The court is watching.</p>

            <SuggestTopic />
          </section>

          <NewsRail />
        </main>
      )}

      {page === 'home' && phase !== 'writing' && (
        <main className="court-shell">
          <Courtroom
            result={result}
            prompt={prompt}
            larpText={text.trim()}
            usedMock={usedMock}
            newBest={newBest}
            onRunItBack={runItBack}
          />
        </main>
      )}

      <footer className="foot">satire · every LARP is judged, none are real advice</footer>
    </div>
  );
}
