import { Link } from "@/i18n/routing";
import { getLocale } from "next-intl/server";

function Arrow(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M5 12h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

async function getUi(locale: string) {
  return {
    title: {
      it: "Questa pagina non esiste.",
      en: "This page does not exist.",
      de: "Diese Seite existiert nicht.",
      nl: "Deze pagina bestaat niet.",
      da: "Denne side findes ikke.",
      no: "Denne siden finnes ikke.",
    }[locale] || "Questa pagina non esiste.",
    description: {
      it: "Probabilmente il link Ã¨ vecchio o lo slug Ã¨ sbagliato. Torna allo shop o riparti dalla home.",
      en: "The link is likely outdated or the slug is incorrect. Return to the shop or start again from the homepage.",
      de: "Der Link ist wahrscheinlich veraltet oder der Slug ist falsch. Kehren Sie zum Shop zurÃ¼ck oder starten Sie auf der Startseite neu.",
      nl: "De link is waarschijnlijk verouderd of de slug is onjuist. Ga terug naar de shop of begin opnieuw vanaf de homepagina.",
      da: "Linket er sandsynligvis forÃ¦ldet, eller sluggen er forkert. GÃ¥ tilbage til shoppen eller start igen fra forsiden.",
      no: "Lenken er trolig utdatert eller slugen er feil. GÃ¥ tilbake til butikken eller start pÃ¥ nytt fra forsiden.",
    }[locale] || "Probabilmente il link Ã¨ vecchio o lo slug Ã¨ sbagliato. Torna allo shop o riparti dalla home.",
    shopCta: {
      it: "Vai allo shop",
      en: "Go to shop",
      de: "Zum Shop",
      nl: "Ga naar de shop",
      da: "GÃ¥ til shoppen",
      no: "GÃ¥ til butikken",
    }[locale] || "Vai allo shop",
    homeCta: {
      it: "Torna alla home",
      en: "Back to home",
      de: "Zur Startseite",
      nl: "Terug naar home",
      da: "Tilbage til forsiden",
      no: "Tilbake til hjem",
    }[locale] || "Torna alla home",
    bookmarkHint: {
      it: "Se lâ€™hai aperta da un bookmark, aggiornalo.",
      en: "If you opened it from a bookmark, update it.",
      de: "Wenn Sie die Seite Ã¼ber ein Lesezeichen geÃ¶ffnet haben, aktualisieren Sie es.",
      nl: "Als je deze via een bladwijzer hebt geopend, werk die dan bij.",
      da: "Hvis du Ã¥bnede den fra et bogmÃ¦rke, sÃ¥ opdater det.",
      no: "Hvis du Ã¥pnet den fra et bokmerke, bÃ¸r du oppdatere det.",
    }[locale] || "Se lâ€™hai aperta da un bookmark, aggiornalo.",
    shop: {
      it: "Shop",
      en: "Shop",
      de: "Shop",
      nl: "Shop",
      da: "Shop",
      no: "Butikk",
    }[locale] || "Shop",
    home: {
      it: "Home",
      en: "Home",
      de: "Startseite",
      nl: "Home",
      da: "Hjem",
      no: "Hjem",
    }[locale] || "Home",
  };
}

function Footer({ home, shop }: { home: string; shop: string }) {
  return (
    <footer className="mt-auto border-t border-black/10 bg-white/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5 text-xs text-black/60">
        <span>Â© {new Date().getFullYear()} â€” All rights reserved</span>
        <div className="flex items-center gap-4">
          <Link className="hover:text-black/80" href="/shop">
            {shop}
          </Link>
          <Link className="hover:text-black/80" href="/">
            {home}
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default async function NotFound() {
  const locale = await getLocale();
  const ui = await getUi(locale);

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-white text-black">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-56 left-1/2 hidden h-[720px] w-[720px] -translate-x-1/2 rounded-full bg-black/5 blur-3xl sm:block" />
        <div className="absolute -bottom-60 left-[-220px] hidden h-[720px] w-[720px] rounded-full bg-black/4 blur-3xl sm:block" />
        <div className="absolute inset-0 hidden bg-gradient-to-b from-black/[0.04] via-transparent to-transparent sm:block" />
      </div>

      <section className="flex flex-1 items-center">
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-24">
          <p className="text-xs font-semibold tracking-[0.24em] text-black/50">404 / NOT FOUND</p>

          <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">
            {ui.title}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-black/60">{ui.description}</p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {ui.shopCta}
              <Arrow className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/"
              className="inline-flex items-center rounded-full px-2 py-2 text-sm font-semibold text-black/70 transition hover:text-black"
            >
              {ui.homeCta}
            </Link>
          </div>

          <div className="mt-14 flex items-center gap-3 text-xs text-black/45">
            <span className="h-[1px] w-10 bg-black/15" />
            <span>{ui.bookmarkHint}</span>
          </div>
        </div>
      </section>

      <Footer home={ui.home} shop={ui.shop} />
    </main>
  );
}
