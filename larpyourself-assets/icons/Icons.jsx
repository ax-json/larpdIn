// larpYourself icon set — drop-in React components.
// All nav/action icons use `currentColor`, so control them with the `color`
// CSS property (or Tailwind text-* classes). Pass `size` to scale, plus any
// standard SVG props (className, onClick, aria-label, etc).
//
// Usage:
//   <IconHome size={26} className="text-[#0a66c2]" />
//   <IconLike size={22} color="#6b7280" />
//   <Logo size={40} />

const base = (size) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
});

// --- Logo (keeps its own brand colors; not currentColor) ---
export const Logo = ({ size = 40, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none"
       xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect width="40" height="40" rx="9" fill="#0a66c2" />
    <rect x="10.5" y="10" width="3.2" height="20" rx="1.6" fill="#fff" />
    <path d="M18 11.5 L23.5 20 L23.5 30" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" fill="none" />
    <path d="M29 11.5 L23.5 20" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" fill="none" />
  </svg>
);

// --- Navigation ---
export const IconHome = ({ size = 24, ...props }) => (
  <svg {...base(size)} {...props}>
    <path d="M3 10.2 L12 3.5 L21 10.2 V20 a1 1 0 0 1-1 1h-4.5v-6h-5v6H4 a1 1 0 0 1-1-1z" fill="currentColor" />
  </svg>
);

export const IconNetwork = ({ size = 24, ...props }) => (
  <svg {...base(size)} {...props}>
    <circle cx="8.5" cy="8" r="3.2" fill="currentColor" />
    <path d="M2.5 20 c0-3.6 2.7-6 6-6 s6 2.4 6 6 z" fill="currentColor" />
    <circle cx="17" cy="9.2" r="2.6" fill="currentColor" opacity=".55" />
    <path d="M14.6 20 c0-2.9 2-5 4.9-5 c2.2 0 3.9 1.4 4.4 3.4" fill="currentColor" opacity=".55" />
  </svg>
);

export const IconJobs = ({ size = 24, ...props }) => (
  <svg {...base(size)} {...props}>
    <rect x="3" y="7.5" width="18" height="12.5" rx="2" fill="currentColor" />
    <path d="M9 7.5 V6 a2 2 0 0 1 2-2 h2 a2 2 0 0 1 2 2 v1.5" stroke="currentColor" strokeWidth="2" fill="none" />
    <rect x="9.6" y="12" width="4.8" height="2.4" rx="1.2" fill="#fff" opacity=".9" />
  </svg>
);

export const IconMe = ({ size = 24, ...props }) => (
  <svg {...base(size)} {...props}>
    <circle cx="10" cy="8" r="3.4" fill="currentColor" />
    <path d="M3.6 20 c0-3.8 2.9-6.4 6.4-6.4 s6.4 2.6 6.4 6.4 z" fill="currentColor" />
    <path d="M18 10 l2 2 2-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

// --- Post actions ---
export const IconLike = ({ size = 24, ...props }) => (
  <svg {...base(size)} {...props}>
    <path d="M8 10.5 L11.2 3.7 a1.6 1.6 0 0 1 3 .7 V9 h4.7 a2 2 0 0 1 2 2.35 l-.95 5.6 a2.2 2.2 0 0 1-2.15 1.85 H8z" fill="currentColor" />
    <rect x="2.6" y="10.5" width="3.6" height="9" rx="1.4" fill="currentColor" />
  </svg>
);

export const IconComment = ({ size = 24, ...props }) => (
  <svg {...base(size)} {...props}>
    <path d="M3 6 a2 2 0 0 1 2-2 h14 a2 2 0 0 1 2 2 v8 a2 2 0 0 1-2 2 H9 l-4.5 3.6 a.6.6 0 0 1-1-.5 V16 H5 a2 2 0 0 1-2-2z" fill="currentColor" />
  </svg>
);

export const IconRepost = ({ size = 24, ...props }) => (
  <svg {...base(size)} {...props}>
    <path d="M4 8.5 V8 a3 3 0 0 1 3-3 h9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M14 2.5 L17.5 5 L14 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M20 15.5 V16 a3 3 0 0 1-3 3 H7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M10 21.5 L6.5 19 L10 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

export const IconSend = ({ size = 24, ...props }) => (
  <svg {...base(size)} {...props}>
    <path d="M21.4 2.6 L2.9 10.2 a.55 .55 0 0 0 .02 1.03 L9 13.1 v4.7 a.55 .55 0 0 0 .98 .34 L12.4 15 l4.5 3.3 a.55 .55 0 0 0 .86-.3 L21.4 2.6z" fill="currentColor" />
    <path d="M21.4 2.6 L9 13.1" stroke="#fff" strokeWidth="1.3" opacity=".55" strokeLinecap="round" />
  </svg>
);

// --- Utility / feed ---
export const IconSearch = ({ size = 24, ...props }) => (
  <svg {...base(size)} {...props}>
    <circle cx="10.5" cy="10.5" r="6" stroke="currentColor" strokeWidth="2.2" fill="none" />
    <path d="M15 15 l5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

export const IconClipboard = ({ size = 24, ...props }) => (
  <svg {...base(size)} {...props}>
    <rect x="4.5" y="4" width="15" height="17" rx="2.2" fill="currentColor" />
    <rect x="8.5" y="2.6" width="7" height="3.4" rx="1.4" fill="currentColor" stroke="#fff" strokeWidth="1.2" />
    <path d="M8 11 h8 M8 14.5 h8 M8 18 h5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const IconGavel = ({ size = 24, ...props }) => (
  <svg {...base(size)} {...props}>
    <rect x="12.2" y="2.6" width="7.4" height="4" rx="1.4" transform="rotate(45 12.2 2.6)" fill="currentColor" />
    <rect x="3.8" y="8.4" width="7.4" height="4" rx="1.4" transform="rotate(45 3.8 8.4)" fill="currentColor" />
    <path d="M8.5 13.5 L3.5 18.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    <rect x="3" y="20" width="12" height="2.6" rx="1.3" fill="currentColor" />
  </svg>
);

export const IconTrophy = ({ size = 24, ...props }) => (
  <svg {...base(size)} {...props}>
    <path d="M7 4 h10 v4 a5 5 0 0 1-10 0z" fill="currentColor" />
    <path d="M7 5 H4.5 a1 1 0 0 0-1 1 c0 2 1.4 3.4 3.5 3.6 M17 5 h2.5 a1 1 0 0 1 1 1 c0 2-1.4 3.4-3.5 3.6" stroke="currentColor" strokeWidth="1.8" fill="none" />
    <rect x="10.7" y="12.5" width="2.6" height="4" fill="currentColor" />
    <rect x="7.5" y="16.5" width="9" height="2.8" rx="1" fill="currentColor" />
  </svg>
);
