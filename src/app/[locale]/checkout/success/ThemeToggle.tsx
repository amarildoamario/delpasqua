"use client";

import { useEffect, useState } from "react";

function getCookie(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000`;
}

export default function ThemeToggle() {
const [theme, setTheme] = useState<"dark" | "light">(() => {
  const t = (getCookie("theme") as "dark" | "light" | null) ?? "light";
  return t;
});

useEffect(() => {
  document.documentElement.classList.toggle("dark", theme === "dark");
}, [theme]);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setCookie("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-900 hover:bg-neutral-50"
      aria-label="Toggle theme"
    >
      <span className="text-sm">{theme === "dark" ? "🌙" : "☀️"}</span>
      <span className="hidden sm:inline">{theme === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}
