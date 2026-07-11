/**
 * The header search bar — a functional-as-a-joke easter egg.
 *
 * Entirely client-side and hardcoded: no LLM, no API, no index. Matching is
 * a forgiving lowercase check (word-boundary regexes for short tokens like
 * "me"/"vc" so "resume" doesn't false-positive). A session-scoped counter
 * escalates the copy the more the player searches — by search 10 the site
 * gives up and returns the only result it has: you.
 */

import { useRef, useState } from 'react';
import type { FocusEvent, KeyboardEvent } from 'react';
import { IconSearch } from './Icons';

interface SearchResult {
  /** Only the default "0 results" case has a heading. */
  heading?: string;
  lines: string[];
  /** Styled "Did you mean:" suggestion line. */
  suggestion?: string;
  /** Search 10+: render the single fake profile result card. */
  showProfileCard?: boolean;
}

// Escalation thresholds for the session search counter.
const NAG_AT = 3;
const WORRY_AT = 5;
const PLEAD_AT = 8;
const SURRENDER_AT = 10;

const PROFANITY_PATTERN =
  /\b(fuck|shit|bitch|cunt|dick|cock|pussy|slut|whore|porn)\w*/;
const COMPANY_PATTERN =
  /\b(google|meta|amazon|apple|microsoft|openai|anthropic|netflix|tesla|nvidia|facebook)\b/;

/** Keyword routing — first match wins, in the order the bit lands best. */
function matchQuery(raw: string): SearchResult {
  const trimmed = raw.trim();
  const q = trimmed.toLowerCase();

  if (!q) {
    return { lines: ['You searched for nothing. The court finds this refreshingly honest.'] };
  }
  if (/\b(me|you|yourself)\b/.test(q)) {
    return {
      lines: ['Found: You. You have been here the whole time. Viewed 47 times. We assume by you.'],
    };
  }
  if (/\bjobs?\b/.test(q) || q.includes('hiring')) {
    return { lines: ['There are no jobs. There is only the court.'] };
  }
  if (q.includes('recruiter')) {
    return {
      lines: [
        'The Burnt-Out Recruiter is not accepting messages. The Burnt-Out Recruiter is not accepting anything.',
      ],
    };
  }
  if (/\bvc\b/.test(q) || q.includes('investor') || q.includes('funding')) {
    return {
      lines: [
        'The Buzzword VC would love to hear your pitch. The Buzzword VC will not be wiring any money.',
      ],
    };
  }
  if (q.includes('intern')) {
    return {
      lines: ["The Gen-Z Intern has seen your search history and said nothing. That's worse."],
    };
  }
  if (/\bfriends?\b/.test(q) || q.includes('connection') || q.includes('network')) {
    return { lines: ['No. (See: My Network.)'] };
  }
  if (/\bhelp\b/.test(q)) {
    return { lines: ['The court cannot help you. The court can only judge you.'] };
  }
  if (q.includes('linkedin')) {
    return { lines: ["You're thinking of a different website. This one is honest about it."] };
  }
  if (PROFANITY_PATTERN.test(q)) {
    return { lines: ['The clerk heard that.'] };
  }
  if (COMPANY_PATTERN.test(q)) {
    return { lines: ['Aim lower. Or LARP higher.'] };
  }
  // Looks like a proper noun / famous person — capitalized query.
  if (/^[A-Z]/.test(trimmed)) {
    return { lines: ['Real people are not indexed here. Only LARPs.'] };
  }
  return {
    heading: `0 results for "${trimmed}"`,
    lines: [
      'There is nobody here. There has never been anybody here. The 1,847 people who liked your post do not exist — they were generated to make you feel something, and it worked.',
    ],
    suggestion: 'Did you mean: yourself?',
  };
}

/** The escalating gag overrides normal matching at fixed search counts. */
export function getSearchResult(raw: string, searchCount: number): SearchResult {
  if (searchCount >= SURRENDER_AT) {
    return { lines: ['Fine. Here is one result:'], showProfileCard: true };
  }
  if (searchCount === PLEAD_AT) {
    return { lines: ['Please stop. Go LARP about something. The judges are waiting.'] };
  }
  if (searchCount === WORRY_AT) {
    return {
      lines: ["You have searched five times. There is nobody here. We're a little worried about you."],
    };
  }
  if (searchCount === NAG_AT) {
    return { lines: ['Still nothing. There will continue to be nothing.'] };
  }
  return matchQuery(raw);
}

export default function NavSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  // Ref, not state: nothing renders the raw count, and a ref can't read stale
  // under batched events — every Enter increments, even back-to-back ones.
  const searchCountRef = useRef(0);

  function submit() {
    searchCountRef.current += 1;
    setResult(getSearchResult(query, searchCountRef.current));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') submit();
    if (e.key === 'Escape') setIsOpen(false);
  }

  function handleBlur(e: FocusEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setIsOpen(false);
  }

  return (
    <div className="nav-search-wrap" onFocus={() => setIsOpen(true)} onBlur={handleBlur}>
      <label className="nav-search">
        <IconSearch size={16} />
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Search LARPedIn"
        />
      </label>

      {isOpen && (
        <div className="search-panel card" role="status">
          {result === null ? (
            <>
              <span className="search-title">Search LARPedIn</span>
              <p className="search-line">
                There is nothing to search. This is a closed system. You are the only one here.
              </p>
            </>
          ) : (
            <>
              {result.heading && <span className="search-title">{result.heading}</span>}
              {result.lines.map((line) => (
                <p key={line} className="search-line">{line}</p>
              ))}
              {result.suggestion && <p className="search-suggest">{result.suggestion}</p>}
              {result.showProfileCard && (
                <>
                  <div className="search-hit">
                    <img className="nav-avatar" src="/mascot-founder.png" alt="" />
                    <div className="search-hit-lines">
                      <span className="search-hit-name">You</span>
                      <span className="search-hit-headline">
                        Aspiring Thought Leader · Open to Delusion
                      </span>
                    </div>
                  </div>
                  <p className="search-line">That's it. That's the whole website.</p>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
