import React from "react";

export const FlagIcon = ({ locale, className }: { locale: string; className?: string }) => {
  const flags: Record<string, React.ReactNode> = {
    it: (
      <svg viewBox="0 0 3 2" className={className}>
        <rect width="1" height="2" fill="#009246" />
        <rect width="1" height="2" x="1" fill="#fff" />
        <rect width="1" height="2" x="2" fill="#ce2b37" />
      </svg>
    ),
    en: (
      <svg viewBox="0 0 60 30" className={className}>
        <clipPath id="nav-flag-en">
          <path d="M0,0 v30 h60 v-30 z" />
        </clipPath>
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </svg>
    ),
    de: (
      <svg viewBox="0 0 5 3" className={className}>
        <rect width="5" height="3" y="0" fill="#000" />
        <rect width="5" height="2" y="1" fill="#d00" />
        <rect width="5" height="1" y="2" fill="#ffce00" />
      </svg>
    ),
    nl: (
      <svg viewBox="0 0 3 2" className={className}>
        <rect width="3" height="2" fill="#ae1c28" />
        <rect width="3" height="1.33" y="0.66" fill="#fff" />
        <rect width="3" height="0.66" y="1.33" fill="#21468b" />
      </svg>
    ),
    da: (
      <svg viewBox="0 0 37 28" className={className}>
        <rect width="37" height="28" fill="#c8102e" />
        <rect x="12" width="4" height="28" fill="#fff" />
        <rect y="12" width="37" height="4" fill="#fff" />
      </svg>
    ),
    no: (
      <svg viewBox="0 0 22 16" className={className}>
        <rect width="22" height="16" fill="#ba0c2f" />
        <path d="M0,8h22M8,0v16" stroke="#fff" strokeWidth="4" />
        <path d="M0,8h22M8,0v16" stroke="#00205b" strokeWidth="2" />
      </svg>
    ),
    us: (
      <svg viewBox="0 0 7410 3900" className={className}>
        <rect width="7410" height="3900" fill="#b22234" />
        <path d="M0,300h7410M0,900h7410M0,1500h7410M0,2100h7410M0,2700h7410M0,3300h7410" stroke="#fff" strokeWidth="300" />
        <rect width="2964" height="2100" fill="#3c3b6e" />
        <path d="M0,0 h2964 v2100 H0 z" fill="#3c3b6e" />
        <circle cx="300" cy="300" r="80" fill="#fff" />
        <circle cx="900" cy="300" r="80" fill="#fff" />
        <circle cx="1500" cy="300" r="80" fill="#fff" />
        <circle cx="2100" cy="300" r="80" fill="#fff" />
        <circle cx="2700" cy="300" r="80" fill="#fff" />
        <circle cx="600" cy="600" r="80" fill="#fff" />
        <circle cx="1200" cy="600" r="80" fill="#fff" />
        <circle cx="1800" cy="600" r="80" fill="#fff" />
        <circle cx="2400" cy="600" r="80" fill="#fff" />
        <circle cx="300" cy="900" r="80" fill="#fff" />
        <circle cx="900" cy="900" r="80" fill="#fff" />
        <circle cx="1500" cy="900" r="80" fill="#fff" />
        <circle cx="2100" cy="900" r="80" fill="#fff" />
        <circle cx="2700" cy="900" r="80" fill="#fff" />
        <circle cx="600" cy="1200" r="80" fill="#fff" />
        <circle cx="1200" cy="1200" r="80" fill="#fff" />
        <circle cx="1800" cy="1200" r="80" fill="#fff" />
        <circle cx="2400" cy="1200" r="80" fill="#fff" />
        <circle cx="300" cy="1500" r="80" fill="#fff" />
        <circle cx="900" cy="1500" r="80" fill="#fff" />
        <circle cx="1500" cy="1500" r="80" fill="#fff" />
        <circle cx="2100" cy="1500" r="80" fill="#fff" />
        <circle cx="2700" cy="1500" r="80" fill="#fff" />
        <circle cx="600" cy="1800" r="80" fill="#fff" />
        <circle cx="1200" cy="1800" r="80" fill="#fff" />
        <circle cx="1800" cy="1800" r="80" fill="#fff" />
        <circle cx="2400" cy="1800" r="80" fill="#fff" />
      </svg>
    ),
    es: (
      <svg viewBox="0 0 750 500" className={className}>
        <rect width="750" height="500" fill="#c11a2a" />
        <rect width="750" height="250" y="125" fill="#f1bf00" />
      </svg>
    ),
    fr: (
      <svg viewBox="0 0 3 2" className={className}>
        <rect width="1" height="2" fill="#00209f" />
        <rect width="1" height="2" x="1" fill="#fff" />
        <rect width="1" height="2" x="2" fill="#f31830" />
      </svg>
    ),
  };

  return flags[locale] || null;
};

export default FlagIcon;
