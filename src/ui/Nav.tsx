/**
 * The global nav — a straight-faced LinkedIn parody bar.
 *
 * 52px white bar: brand bug + wordmark, pale-blue search pill, then the
 * six-icon rail (Home active with the black underline, red notification
 * badge, "Me" avatar with caret). Pure set dressing; only the brand is real.
 */

import type { ReactElement } from 'react';

const NAV_ITEMS: { label: string; icon: ReactElement; active?: boolean }[] = [
  { label: 'Home', icon: <HomeIcon />, active: true },
  { label: 'My Network', icon: <NetworkIcon /> },
  { label: 'Jobs', icon: <JobsIcon /> },
];

export default function Nav() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="nav-left">
          <span className="brand-bug" aria-hidden="true">lY</span>
          <span className="brand-word">
            larp<span className="brand-y">Y</span>ourself
          </span>
          <label className="nav-search">
            <SearchIcon />
            <input type="text" placeholder="Search" readOnly aria-label="Search (decorative)" />
          </label>
        </div>

        <nav className="nav-items" aria-label="Fake navigation">
          {NAV_ITEMS.map((item) => (
            <span key={item.label} className={`nav-item ${item.active ? 'nav-active' : ''}`}>
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </span>
          ))}
          <span className="nav-item nav-me">
            <span className="nav-avatar" aria-hidden="true">🫡</span>
            <span className="nav-label">Me ▾</span>
          </span>
        </nav>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
      <path d="M14.56 12.44L11.3 9.18a5.51 5.51 0 10-2.12 2.12l3.26 3.26a1.5 1.5 0 102.12-2.12zM3 6.5A3.5 3.5 0 116.5 10 3.5 3.5 0 013 6.5z" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
      <path d="M23 9v2h-2v7a3 3 0 01-3 3h-4v-6h-4v6H6a3 3 0 01-3-3v-7H1V9l11-7z" />
    </svg>
  );
}

function NetworkIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
      <path d="M12 6.5A4.5 4.5 0 117.5 2 4.5 4.5 0 0112 6.5zM13 22H2v-5a3 3 0 013-3h5a3 3 0 013 3zm4.5-9A3.5 3.5 0 1114 9.5a3.5 3.5 0 013.5 3.5zm1 2h-2a2.5 2.5 0 00-2.5 2.5V22h7v-4.5a2.5 2.5 0 00-2.5-2.5z" />
    </svg>
  );
}

function JobsIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
      <path d="M17 6V5a3 3 0 00-3-3h-4a3 3 0 00-3 3v1H2v4a3 3 0 003 3h14a3 3 0 003-3V6zM9 5a1 1 0 011-1h4a1 1 0 011 1v1H9zm13 8.62V17a3 3 0 01-3 3H5a3 3 0 01-3-3v-3.38A4.98 4.98 0 005 15h14a4.98 4.98 0 003-1.38z" />
    </svg>
  );
}

