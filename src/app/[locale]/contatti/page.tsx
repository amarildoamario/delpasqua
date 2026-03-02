import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import ContactForm from "./ContactForm";
import { useTranslations } from "next-intl";

export default function ContattiPage() {
  const t = useTranslations("ContactPage");
  return (
    <>
      <section className="bg-[#FDFCF8] min-h-screen">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
          {/* HERO */}
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
                <span className="h-px w-6 bg-[#8B7355]" />
                {t("hero.label")}
              </div>

              <h1 className="mt-6 font-serif text-4xl font-light leading-[1.1] tracking-tight text-[#1C1917] lg:text-5xl xl:text-6xl">
                {t("hero.title_part1")} <span className="italic text-[#3D5A3D]">{t("hero.title_italic")}</span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-relaxed text-[#57534E] lg:text-lg">
                {t("hero.description")}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Pill>{t("hero.pills.response")}</Pill>
                <Pill>{t("hero.pills.support")}</Pill>
                <Pill>{t("hero.pills.b2b")}</Pill>
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[#3D5A3D]/5 to-[#B8860B]/5 blur-2xl" />

                {/* ✅ IMMAGINE FRANTOIO */}
                <div className="relative overflow-hidden rounded-3xl border border-[#E7E5E4] bg-[#F5F5F4]">
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src="/contatti/frantoio.jpg"
                      alt="Frantoio"
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/10 to-transparent" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* GRID: INFO + FORM */}
          <div className="mt-20 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            {/* INFO */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-[#E7E5E4] bg-white p-6 lg:p-8">
                <div className="text-[10px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
                  {t("info.company_label")}
                </div>

                <h2 className="mt-4 font-serif text-2xl font-light tracking-tight text-[#1C1917]">
                  FRANTOIO DEL PASQUA <span className="text-[#8B7355]">srl</span>
                </h2>

                <div className="mt-8 space-y-5">
                  <InfoRow label={t("info.address_label")}>
                    Loc. Infernaccio 510/B
                    <br />
                    Monte San Savino - Arezzo
                  </InfoRow>

                  <InfoRow label={t("info.phone_label")}>
                    <a className="text-[#3D5A3D] hover:underline" href="tel:+390575810065">
                      +39 0575 810065
                    </a>
                  </InfoRow>

                  <InfoRow label={t("info.mobile_label")}>
                    <a className="text-[#3D5A3D] hover:underline" href="tel:+393388110356">
                      +39 338 811 0356
                    </a>
                  </InfoRow>

                  <InfoRow label={t("info.email_label")}>
                    <a className="text-[#3D5A3D] hover:underline" href="mailto:info@delpasqua.com">
                      info@delpasqua.com
                    </a>
                  </InfoRow>
                </div>

                <div className="mt-8 border-t border-[#E7E5E4] pt-6">
                  <div className="text-[10px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
                    {t("info.docs_label")}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href="https://delpasqua.com/wp-content/uploads/2025/03/Politica-Parita-di-Genere-Frantoio-Del-Pasqua-gen-20251.pdf"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-[#E7E5E4] bg-[#FDFCF8] px-4 py-2 text-xs text-[#57534E] transition hover:border-[#3D5A3D]/30 hover:bg-white"
                    >
                      <IconFile className="h-4 w-4 text-[#3D5A3D]" />
                      {t("info.docs_gender")}
                    </a>

                    <Link
                      href="/privacy"
                      className="inline-flex items-center gap-2 rounded-full border border-[#E7E5E4] bg-[#FDFCF8] px-4 py-2 text-xs text-[#57534E] transition hover:border-[#3D5A3D]/30 hover:bg-white"
                    >
                      <IconShield className="h-4 w-4 text-[#3D5A3D]" />
                      {t("info.docs_privacy")}
                    </Link>
                  </div>
                </div>

                <div className="mt-6 border-t border-[#E7E5E4] pt-6">
                  <div className="text-[10px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
                    {t("info.social_label")}
                  </div>

                  <div className="mt-4 flex gap-3">
                    <SocialChip href="https://facebook.com/" label="Facebook">
                      <FacebookIcon className="h-4 w-4" />
                    </SocialChip>
                    <SocialChip href="https://instagram.com/" label="Instagram">
                      <InstagramIcon className="h-4 w-4" />
                    </SocialChip>
                  </div>
                </div>
              </div>
            </div>

            {/* FORM */}
            <div className="rounded-3xl border border-[#E7E5E4] bg-white p-6 lg:p-8">
              <div className="text-[10px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
                {t("form.label")}
              </div>

              <h2 className="mt-4 font-serif text-2xl font-light tracking-tight text-[#1C1917]">
                {t("form.title")}
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-[#57534E]">
                {t("form.subtitle")}
              </p>

              <ContactForm />
            </div>
          </div>

          {/* MAP */}
          <div className="mt-8">
            <div className="rounded-3xl border border-[#E7E5E4] bg-white p-6 lg:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-[10px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
                    {t("map.label")}
                  </div>
                  <div className="mt-2 text-sm text-[#1C1917]">
                    Loc. Infernaccio 510/B, Monte San Savino - Arezzo
                  </div>
                </div>

                <a
                  className="inline-flex items-center gap-2 rounded-full border border-[#E7E5E4] bg-[#FDFCF8] px-4 py-2 text-xs font-medium text-[#57534E] transition hover:border-[#3D5A3D]/30 hover:bg-white"
                  href="https://www.google.com/maps/search/?api=1&query=Loc.%20Infernaccio%20510%2FB%20Monte%20San%20Savino%20Arezzo"
                  target="_blank"
                  rel="noreferrer"
                >
                  <IconPin className="h-4 w-4 text-[#3D5A3D]" />
                  {t("map.button")}
                </a>
              </div>

              <div className="mt-6">
                <GoogleMapEmbed address="Loc. Infernaccio 510/B, Monte San Savino, Arezzo, Italia" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3D5A3D]/10 px-4 py-2 text-xs font-medium text-[#3D5A3D]">
      <span className="h-1.5 w-1.5 rounded-full bg-[#3D5A3D]" />
      {children}
    </span>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
      <div className="w-24 text-[10px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
        {label}
      </div>
      <div className="flex-1 text-sm text-[#1C1917]">{children}</div>
    </div>
  );
}



function GoogleMapEmbed({ address }: { address: string }) {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#E7E5E4] bg-[#F5F5F4]">
      <div className="h-[420px] w-full sm:h-auto sm:aspect-[21/9]">
        <iframe
          title={`Mappa - ${address}`}
          src={src}
          className="h-full w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
}

function SocialChip({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E7E5E4] bg-[#FDFCF8] text-[#57534E] transition hover:border-[#3D5A3D]/30 hover:bg-white hover:text-[#3D5A3D]"
    >
      {children}
    </a>
  );
}

function IconPin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s7-4.4 7-11a7 7 0 0 0-14 0c0 6.6 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function IconFile({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h6" />
    </svg>
  );
}

function IconShield({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7l8-4z" />
      <path d="M9 12l2 2 4-5" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
      <path d="M16 11.37a4 4 0 1 1-7.88 1.26 4 4 0 0 1 7.88-1.26Z" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2z" />
    </svg>
  );
}