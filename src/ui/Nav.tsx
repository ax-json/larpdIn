/**
 * The global nav — a straight-faced LinkedIn parody bar.
 *
 * 52px white bar: brand logo + wordmark, pale-blue search pill, then the
 * icon rail (Home active with the black underline) and the mascot as "Me".
 * Pure set dressing; only the brand is real. Icons from the asset bundle.
 */

import type { ReactElement } from 'react';
import { Logo, IconHome, IconNetwork, IconJobs, IconSearch } from './Icons';

const NAV_ITEMS: { label: string; icon: ReactElement; active?: boolean }[] = [
  { label: 'Home', icon: <IconHome />, active: true },
  { label: 'My Network', icon: <IconNetwork /> },
  { label: 'Jobs', icon: <IconJobs /> },
];

export default function Nav() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="nav-left">
          <Logo size={34} aria-hidden="true" />
          <span className="brand-word">
            LARPed<span className="brand-y">In</span>
          </span>
          <label className="nav-search">
            <IconSearch size={16} />
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
            <img className="nav-avatar" src="/mascot-founder.png" alt="" />
            <span className="nav-label">Me ▾</span>
          </span>
        </nav>
      </div>
    </header>
  );
}
