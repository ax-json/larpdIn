/**
 * Feed set dressing — the three LinkedIn-parody panels around the composer.
 *
 * ProfileRail: the player's fake profile card (cover strip, avatar, stats —
 * best rating lives here now). PromptPost: the assignment styled as a
 * Promoted feed post from "The Assignment Desk", complete with reaction pile
 * and dead action row. NewsRail: "LARP News", the comedy sidebar.
 */

import type { Player, Prompt } from '../types/contracts';
import { bandFor } from '../game/scoring';
import { IconClipboard, IconLike, IconComment, IconRepost, IconSend, IconTrophy } from './Icons';

const TIER_LABEL: Record<Prompt['tier'], string> = {
  mundane: 'MUNDANE · tests creativity',
  mid: 'MID · in between',
  prestige: 'PRESTIGE · tests restraint',
};

export function ProfileRail({ player }: { player: Player }) {
  const rounds = player.history.length;
  return (
    <aside className="rail rail-left">
      <div className="card profile-card">
        <div className="profile-cover" aria-hidden="true" />
        <img className="profile-avatar" src="/mascot-founder.png" alt="Your profile" />
        <div className="profile-body">
          <span className="profile-name">You</span>
          <span className="profile-headline">Aspiring Thought Leader · Open to Delusion</span>
        </div>
        <div className="profile-stats">
          <div className="stat-row">
            <span className="stat-label"><IconTrophy size={14} /> Best rating</span>
            <strong>{player.bestRating}</strong>
          </div>
          <div className="stat-row">
            <span>Current rank</span>
            <strong>{bandFor(player.bestRating)}</strong>
          </div>
          <div className="stat-row">
            <span>Rounds argued</span>
            <strong>{rounds}</strong>
          </div>
          <div className="stat-row stat-gag">
            <span>Profile viewers</span>
            <strong>47</strong>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function PromptPost({ prompt, onReroll }: { prompt: Prompt; onReroll: () => void }) {
  return (
    <article className="card post">
      <div className="post-context">
        <span>The Algorithm and 3 judges follow The Assignment Desk</span>
        <button
          type="button"
          className="reroll-btn"
          onClick={onReroll}
          title="Serve a different assignment"
        >
          <IconRepost size={14} /> New assignment
        </button>
      </div>
      <div className="post-author">
        <span className="post-avatar" aria-hidden="true"><IconClipboard size={26} /></span>
        <div className="post-author-lines">
          <span className="post-name">
            The Assignment Desk <span className="post-degree">· 1st</span>
          </span>
          <span className="post-headline">Distributing mundane achievements since 2026</span>
          <span className="post-meta">Promoted · 🌐</span>
        </div>
        <span className="post-follow">+ Follow</span>
      </div>

      <div className="post-body">
        <span className={`tier tier-${prompt.tier}`}>{TIER_LABEL[prompt.tier]}</span>
        <p className="post-text">Your achievement to LARP: <strong>{prompt.text}</strong></p>
        <p className="post-tags">#{prompt.domain} #blessed #agree</p>
      </div>

      <div className="post-proof">
        <span className="reactions" aria-hidden="true">
          <i className="rx rx-like">👍</i>
          <i className="rx rx-love">❤️</i>
          <i className="rx rx-clap">👏</i>
        </span>
        <span className="proof-names">Priya Sharma and 1,847 others</span>
        <span className="proof-counts">437 comments · 89 reposts</span>
      </div>

      <div className="post-divider" aria-hidden="true" />
      <div className="post-actions" aria-hidden="true">
        <span className="post-action"><IconLike size={18} /> Like</span>
        <span className="post-action"><IconComment size={18} /> Comment</span>
        <span className="post-action"><IconRepost size={18} /> Repost</span>
        <span className="post-action"><IconSend size={18} /> Send</span>
      </div>
    </article>
  );
}

const NEWS_ITEMS: { headline: string; meta: string }[] = [
  { headline: 'Man announces he woke up early', meta: '1d ago · 12,847 readers' },
  { headline: "Local intern 'humbled' by task completion", meta: '2d ago · 8,204 readers' },
  { headline: 'Study: 98% of posts are LARP', meta: '3d ago · 47,001 readers' },
  { headline: 'CEO thanks himself in heartfelt post', meta: '4d ago · 6,532 readers' },
  { headline: "'Agree?' economy hits all-time high", meta: '5d ago · 3,318 readers' },
];

export function NewsRail() {
  return (
    <aside className="rail rail-right">
      <div className="card news-card">
        <div className="news-head">
          LARP News <span className="news-info" aria-hidden="true">ⓘ</span>
        </div>
        <ul className="news-list">
          {NEWS_ITEMS.map((item) => (
            <li key={item.headline}>
              <span className="news-headline">{item.headline}</span>
              <span className="news-meta">{item.meta}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
