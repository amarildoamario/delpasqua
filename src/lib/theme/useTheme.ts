"use client";

import { useEffect, useState } from "react";

export type ThemeMode = "dark" | "light";
const THEME_EVENT = "app:theme";

function readCookie(name: string) {
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
}

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

function applyToDom(mode: ThemeMode) {
  const isDark = mode === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
}

function persist(mode: ThemeMode) {
  localStorage.setItem("theme", mode);
  writeCookie("theme", mode);
}

function broadcast(mode: ThemeMode) {
  window.dispatchEvent(new CustomEvent<ThemeMode>(THEME_EVENT, { detail: mode }));
}

export function setThemeGlobal(mode: ThemeMode) {
  applyToDom(mode);
  persist(mode);
  broadcast(mode);
}

function readInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  try {
    const ls = (localStorage.getItem("theme") as ThemeMode | null) ?? null;
    const ck = (readCookie("theme") as ThemeMode | null) ?? null;
    return (
      ls ??
      ck ??
      (document.documentElement.classList.contains("dark") ? "dark" : "light")
    );
  } catch {
    return "light";
  }
}

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(() => readInitialTheme());

  useEffect(() => {
    applyToDom(mode);
  }, [mode]);

  useEffect(() => {
    const onTheme = (e: Event) => {
      const ce = e as CustomEvent<ThemeMode>;
      const next = ce.detail;
      if (next === "dark" || next === "light") setMode(next);
    };

    window.addEventListener(THEME_EVENT, onTheme);
    return () => window.removeEventListener(THEME_EVENT, onTheme);
  }, []);

  const toggle = () => {
    const next: ThemeMode = mode === "dark" ? "light" : "dark";
    setMode(next);
    setThemeGlobal(next);
  };

  const set = (next: ThemeMode) => {
    setMode(next);
    setThemeGlobal(next);
  };

  return { mode, isDark: mode === "dark", toggle, setTheme: set };
}
