/**
 * The satirical dead-end pages — My Network, Jobs, and Me.
 *
 * Pure set dressing behind the nav tabs: hardcoded copy, zero API calls,
 * zero game logic. Each page is "LinkedIn, but honest about what it actually
 * is" — real LinkedIn layouts that have given up. The Me page is the one
 * place real state shows: best rating / rank / rounds argued sit right next
 * to the fake bio, which is where the joke lands hardest.
 */

import type { Player } from '../types/contracts';
import { bandFor } from '../game/scoring';

const FAKE_JOBS: { title: string; where: string; blurb: string }[] = [
  {
    title: 'Chief Vision Officer',
    where: 'Stealth Startup · Remote',
    blurb: 'Must be able to LARP 5+ years of experience. Equity only. Equity is also LARP.',
  },
  {
    title: 'Head of Synergy',
    where: 'Series A · Hybrid',
    blurb: "We're not hiring. We just like posting.",
  },
  {
    title: 'Founder',
    where: 'Your Apartment · On-site',
    blurb: 'You already have this job. You have had it for three years. There is no salary.',
  },
];

const SKILLS = ['Reframing', 'Restraint (occasionally)', 'Buzzwords (fluent)', 'Being perceived'];

export function NetworkPage() {
  return (
    <main className="page-shell">
      <section className="card empty-card">
        <h1 className="page-heading">You have 0 connections.</h1>
        <p className="page-body">
          This is not a bug. Nobody here is real. The three judges are not your friends — they are
          a panel, and panels do not accept connection requests.
        </p>
        <p className="page-body">
          You have, however, been viewed by 47 people. We will not tell you who. We will not tell
          you when. We will simply display the number, occasionally, so that it lives rent-free in
          your head the way we intended.
        </p>
        <button className="ghost-btn" disabled>
          Connect
        </button>
        <p className="page-foot">
          People you may know: nobody. People who may know you: unclear. People pretending to know
          you: 1,847 (see: likes).
        </p>
      </section>
    </main>
  );
}

export function JobsPage() {
  return (
    <main className="page-shell">
      <section className="card empty-card">
        <h1 className="page-heading">0 jobs match your profile.</h1>
        <p className="page-body">
          Your skills — as assessed by the court — include resource allocation (elixir),
          stakeholder management (a Discord server), and operational excellence (one printer).
          These are, technically, skills.
        </p>
        <p className="page-body">
          Recruiters are not currently hiring for these. Recruiters are, in fact, not currently
          hiring. The Burnt-Out Recruiter has reviewed 10,000 profiles this week and has gone home.
          He is not thinking about you.
        </p>
      </section>

      {FAKE_JOBS.map((job) => (
        <article key={job.title} className="card job-card">
          <div className="job-lines">
            <span className="job-title">{job.title}</span>
            <span className="job-where">{job.where}</span>
            <p className="job-blurb">{job.blurb}</p>
          </div>
          <button className="ghost-btn" disabled>
            Easy Apply
          </button>
        </article>
      ))}

      <p className="page-foot">Easy Apply is disabled. Nothing about this is easy.</p>
    </main>
  );
}

export function MePage({ player }: { player: Player }) {
  return (
    <main className="page-shell">
      <section className="card me-card">
        <div className="profile-cover" aria-hidden="true" />
        <img className="profile-avatar" src="/mascot-founder.png" alt="Your profile" />
        <div className="me-head">
          <h1 className="me-name">You</h1>
          <span className="me-headline">Aspiring Thought Leader · Open to Delusion</span>
          <div className="me-stats">
            <span>
              Best rating <strong>{player.bestRating}</strong>
            </span>
            <span>
              Rank <strong>{bandFor(player.bestRating)}</strong>
            </span>
            <span>
              Rounds argued <strong>{player.history.length}</strong>
            </span>
          </div>
        </div>
      </section>

      <section className="card me-section">
        <h2 className="me-section-title">About</h2>
        <p className="page-body">
          A passionate, results-driven storyteller with a proven track record of describing things
          that happened. Specializes in taking a Tuesday and turning it into a narrative arc.
          Fluent in English, corporate, and the specific dialect of English spoken only in the
          first paragraph of a LinkedIn post.
        </p>
      </section>

      <section className="card me-section">
        <h2 className="me-section-title">Experience</h2>
        <span className="job-title">CEO of Nothing — Present</span>
        <p className="page-body">
          Founded and currently lead an organization with no employees, no revenue, and no product.
          Wear many hats. All of the hats. There is nobody else to wear the hats.
        </p>
      </section>

      <section className="card me-section">
        <h2 className="me-section-title">Skills</h2>
        <div className="skill-pills">
          {SKILLS.map((skill) => (
            <span key={skill} className="pill">
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="card me-section">
        <h2 className="me-section-title">Endorsements</h2>
        <p className="page-body">0. The judges do not endorse. The judges only rule.</p>
      </section>

      <p className="page-foot">
        This profile has been viewed 47 times, which you will now think about for the rest of the
        day.
      </p>
    </main>
  );
}
