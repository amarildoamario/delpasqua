import "./globals.css";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import { cookies } from "next/headers";
import { Providers } from "./providers";
import AnalyticsTracker from "@/components/analytics/AnalyticsTracker";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value; // "dark" | "light" | undefined
  const isDark = theme === "dark";

  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark light" />

        {/* Fallback: se cookie manca (prima visita), decide da localStorage/system */}
        <Script id="theme-init" strategy="beforeInteractive">{`
  (function () {
    try {
      var m = document.cookie.match(/(?:^|; )theme=([^;]*)/);
      var cookieTheme = m ? decodeURIComponent(m[1]) : null;

      var saved = localStorage.getItem("theme");

      // ✅ default: sempre light alla prima visita
      var theme = cookieTheme || saved || "light";
      var dark = theme === "dark";

      var root = document.documentElement;
      root.classList.toggle("dark", dark);
      root.style.colorScheme = dark ? "dark" : "light";

      localStorage.setItem("theme", theme);
      document.cookie = "theme=" + theme + "; Path=/; Max-Age=31536000; SameSite=Lax";
    } catch (e) {}
  })();
`}</Script>

        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  try {
    var t = localStorage.getItem('theme');
    if (!t) return;
    var isDark = t === 'dark';
    var root = document.documentElement;
    if (isDark) root.classList.add('dark');
    else root.classList.remove('dark');
    root.style.colorScheme = isDark ? 'dark' : 'light';
  } catch (e) {}
})();
`,
          }}
        />
      </head>

      <body className="bg-white text-zinc-900 dark:bg-black dark:text-zinc-50">
        <Providers>
          <AnalyticsTracker />
          <Navbar />

          <main>
            {children}

            {/* ✅ Spacer SOLO in fondo pagina per non far coprire il footer dalla bottom navbar mobile */}
            <div
              className="md:hidden"
              aria-hidden="true"
              style={{ height: "calc(76px + env(safe-area-inset-bottom))" }}
            />
          </main>
        </Providers>
      </body>
    </html>
  );
}
