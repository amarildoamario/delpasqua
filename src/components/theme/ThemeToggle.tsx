"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/lib/theme/useTheme";

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // IMPORTANTISSIMO: niente markup in SSR e niente markup al primo render client
  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      className={[
        "relative h-7 w-[58px] rounded-full p-[3px]",
        "bg-gray-100 hover:bg-gray-200",
        "dark:bg-white/10 dark:hover:bg-white/15",
        "transition-colors",
      ].join(" ")}
      aria-label="Toggle dark mode"
      title="Tema"
    >
      <span
        className={[
          "absolute top-1/2 -translate-y-1/2",
          "h-[22px] w-[22px] rounded-full",
          "bg-[#b7aa60] shadow-sm",
          "transition-all duration-300",
          isDark ? "left-[33px]" : "left-[3px]",
          "grid place-items-center",
        ].join(" ")}
      >
        {isDark ? <MoonIcon className="h-4 w-4 text-white" /> : <SunIcon className="h-4 w-4 text-white" />}
      </span>
    </button>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8Z" />
    </svg>
  );
}
