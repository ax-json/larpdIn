/**
 * The global nav — a straight-faced LinkedIn parody bar.
 *
 * 52px white bar: brand logo + wordmark, the search easter egg, then the
 * icon rail and the mascot as "Me". The tabs are real now — each routes to
 * its satirical dead-end page — and the search pill answers back. Icons
 * from the asset bundle.
 */

import type { ReactElement } from 'react';
import { Logo, IconHome, IconNetwork, IconJobs } from './Icons';
import NavSearch from './NavSearch';

/** Client-side "routes". Home is the game; the rest are the satire pages. */
export type Page = 'home' | 'network' | 'jobs' | 'me';

const NAV_ITEMS: { label: string; page: Page; icon: ReactElement }[] = [
  { label: 'Home', page: 'home', icon: <IconHome /> },
  { label: 'My Network', page: 'network', icon: <IconNetwork /> },
  { label: 'Jobs', page: 'jobs', icon: <IconJobs /> },
];

interface NavProps {
  page: Page;
  onNavigate: (page: Page) => void;
}

export default function Nav({ page, onNavigate }: NavProps) {
  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="nav-left">
          <button type="button" className="brand-btn" onClick={() => onNavigate('home')}>
            <Logo size={34} aria-hidden="true" />
            <span className="brand-word">
              LARPed<span className="brand-y">In</span>
            </span>
          </button>
          <NavSearch />
        </div>

        <nav className="nav-items" aria-label="Site navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`nav-item ${page === item.page ? 'nav-active' : ''}`}
              onClick={() => onNavigate(item.page)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
          <button
            type="button"
            className={`nav-item nav-me ${page === 'me' ? 'nav-active' : ''}`}
            onClick={() => onNavigate('me')}
          >
            <img className="nav-avatar" src="/mascot-founder.png" alt="" />
            <span className="nav-label">Me ▾</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
