"use client";

import { useEffect, useState } from "react";

export type ThemeMode = "dark" | "light";
const THEME_EVENT = "app:theme";

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000`;
}

function applyTheme(theme: ThemeMode) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  setCookie("theme", theme);
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: theme }));
}

export function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
  const t = (getCookie("theme") as "dark" | "light" | null) ?? "light";
  return t;
});

useEffect(() => {
  document.documentElement.classList.toggle("dark", theme === "dark");
}, [theme]);

  const set = (t: ThemeMode) => {
    setTheme(t);
    applyTheme(t);
  };

  const toggle = () => set(theme === "dark" ? "light" : "dark");

  return { theme, setTheme: set, toggle };
}
