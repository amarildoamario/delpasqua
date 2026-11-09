import ContactLink from "@/components/ContactLink";
import { setRequestLocale } from 'next-intl/server';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import Footer from "@/components/Footer";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import ContactForm from "./ContactForm";
import WhatsAppButton from "./WhatsAppButton";
import { getTranslations } from "next-intl/server";
import { pageMetadata, absoluteUrl, localizedPath } from "@/lib/seo";
import { companyInfo } from "@/lib/companyInfo";

const WHATSAPP_PHONE = "393388110356";
const WHATSAPP_CONFIG: Record<string, { label: string; sublabel: string; text: string }> = {
  it: {
    label: "Scrivici su WhatsApp",
    sublabel: "Chat diretta • Risposta rapida",
    text: "Salve, vi contatto dal sito delpasqua.com per richiedere informazioni sui vostri prodotti e servizi.",
  },
  en: {
    label: "Chat on WhatsApp",
    sublabel: "Direct chat • Fast response",
    text: "Hello, I am contacting you from delpasqua.com to request information about your products and services.",
  },
  de: {
    label: "Auf WhatsApp schreiben",
    sublabel: "Direktchat • Schnelle Antwort",
    text: "Guten Tag, ich kontaktiere Sie über delpasqua.com für Informationen zu Ihren Produkten und Dienstleistungen.",
  },
  fr: {
    label: "Discuter sur WhatsApp",
    sublabel: "Chat direct • Réponse rapide",
    text: "Bonjour, je vous contacte depuis le site delpasqua.com pour demander des informations sur vos produits et services.",
  },
  es: {
    label: "Escríbenos por WhatsApp",
    sublabel: "Chat directo • Respuesta rápida",
    text: "Hola, les contacto desde el sitio delpasqua.com para solicitar información sobre sus productos y servicios.",
  },
  nl: {
    label: "Chat via WhatsApp",
    sublabel: "Directe chat • Snelle reactie",
    text: "Hallo, ik neem contact met u op via delpasqua.com voor informatie over uw producten en diensten.",
  },
  da: {
    label: "Skriv på WhatsApp",
    sublabel: "Direkte chat • Hurtigt svar",
    text: "Hej, jeg kontakter jer fra delpasqua.com for at få oplysninger om jeres produkter og tjenester.",
  },
  no: {
    label: "Skriv på WhatsApp",
    sublabel: "Direkte chat • Raskt svar",
    text: "Hei, jeg kontakter dere fra delpasqua.com for å be om informasjon om produktene og tjenestene deres.",
  },
};

const CONTACT_ADDRESS = companyInfo.addressMap;
const CONTACT_LAT = companyInfo.geo.latitude;
const CONTACT_LNG = companyInfo.geo.longitude;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return pageMetadata({
    title: locale === "en" ? "Contact" : "Contatti",
    description:
      locale === "en"
        ? "Contact Frantoio Del Pasqua in Monte San Savino for products, orders and business requests."
        : "Contatta il Frantoio Del Pasqua a Monte San Savino per prodotti, ordini e richieste commerciali.",
    path: "/contatti/",
    locale,
  });
}

async function ContattiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "ContactPage" });
  const tFooter = await getTranslations({ locale, namespace: "Common.footer.bottom" });

  const wa = WHATSAPP_CONFIG[locale] || WHATSAPP_CONFIG.it;
  const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(wa.text)}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": absoluteUrl(localizedPath("/", locale))
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": locale === "en" ? "Contact" : "Contatti",
        "item": absoluteUrl(localizedPath("/contatti", locale))
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section className="bg-[#FDFCF8] min-h-screen">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
          {/* Breadcrumb sottile */}
          <nav className="mb-12 flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
            <Link href="/" className="hover:text-[#3D5A3D] transition-colors">Home</Link>
            <span className="text-[#D6D3D1]">/</span>
            <span className="text-[#57534E]">{locale === "en" ? "Contact" : "Contatti"}</span>
          </nav>
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

              {/* Box WhatsApp Ufficiale in Cima */}
              <div className="mt-8 flex justify-center md:justify-start">
                <WhatsAppButton url={waUrl} label={wa.label} sublabel={wa.sublabel} />
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3">
                <Pill>{t("hero.pills.response")}</Pill>
                <Pill>{t("hero.pills.support")}</Pill>
                <Pill>{t("hero.pills.b2b")}</Pill>
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="absolute -inset-4 rounded-[5px] bg-gradient-to-br from-[#3D5A3D]/5 to-[#B8860B]/5 blur-2xl" />

                {/* ✅ IMMAGINE FRANTOIO */}
                <div className="relative overflow-hidden rounded-[5px] border border-[#E7E5E4] bg-[#F5F5F4]">
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
              <div className="rounded-[5px] border border-[#E7E5E4] bg-white p-6 lg:p-8">
                <div className="text-[10px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
                  {t("info.company_label")}
                </div>

                <h2 className="mt-4 font-serif text-2xl font-light tracking-tight text-[#1C1917]">
                  {companyInfo.brandName}
                </h2>

                <div className="mt-8 space-y-5">
                  <InfoRow label={t("info.address_label")}>
                    {companyInfo.postalAddress.streetAddress}
                    <br />
                    {companyInfo.postalAddress.addressLocality} - {companyInfo.postalAddress.postalCode} ({companyInfo.postalAddress.addressRegion})
                  </InfoRow>

                  <InfoRow label={t("info.phone_label")}>
                    <ContactLink channel="phone" source="contatti_page" className="text-[#3D5A3D] hover:underline" href="tel:+390575810065">
                      +39 0575 810065
                    </ContactLink>
                  </InfoRow>

                  <InfoRow label={t("info.mobile_label")}>
                    <div className="flex flex-wrap items-center gap-3">
                      <ContactLink channel="phone" source="contatti_page" className="text-[#3D5A3D] hover:underline" href="tel:+393388110356">
                        +39 338 811 0356
                      </ContactLink>
                      <ContactLink channel="whatsapp" source="contatti_page_inline"
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-[5px] bg-[#25D366]/10 px-2.5 py-1 text-xs font-medium text-[#1A7737] hover:bg-[#25D366]/20 transition"
                      >
                        <WhatsAppIcon className="h-3.5 w-3.5 fill-[#25D366] shrink-0" />
                        WhatsApp
                      </ContactLink>
                    </div>
                  </InfoRow>

                  <InfoRow label={t("info.email_label")}>
                    <ContactLink channel="email" source="contatti_page" className="text-[#3D5A3D] hover:underline" href="mailto:info@delpasqua.com">
                      info@delpasqua.com
                    </ContactLink>
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
                      className="inline-flex items-center gap-2 rounded-[5px] border border-[#E7E5E4] bg-[#FDFCF8] px-4 py-2 text-xs text-[#57534E] transition hover:border-[#3D5A3D]/30 hover:bg-white"
                    >
                      <IconFile className="h-4 w-4 text-[#3D5A3D]" />
                      {t("info.docs_gender")}
                    </a>

                    <Link
                      href="/privacy"
                      className="inline-flex items-center gap-2 rounded-[5px] border border-[#E7E5E4] bg-[#FDFCF8] px-4 py-2 text-xs text-[#57534E] transition hover:border-[#3D5A3D]/30 hover:bg-white"
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
            <div className="rounded-[5px] border border-[#E7E5E4] bg-white p-6 lg:p-8">
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
            <div className="rounded-[5px] border border-[#E7E5E4] bg-white p-6 lg:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-[10px] font-medium tracking-[0.2em] text-[#8B7355] uppercase">
                    {t("map.label")}
                  </div>
                  <div className="mt-2 text-sm text-[#1C1917]">
                    {CONTACT_ADDRESS}
                  </div>
                </div>

                <a
                  className="inline-flex items-center gap-2 rounded-[5px] border border-[#E7E5E4] bg-[#FDFCF8] px-4 py-2 text-xs font-medium text-[#57534E] transition hover:border-[#3D5A3D]/30 hover:bg-white"
                  href={`https://www.google.com/maps/search/?api=1&query=${CONTACT_LAT},${CONTACT_LNG}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <IconPin className="h-4 w-4 text-[#3D5A3D]" />
                  {t("map.button")}
                </a>
              </div>

              <div className="mt-6">
                <GoogleMapEmbed address={CONTACT_ADDRESS} latitude={CONTACT_LAT} longitude={CONTACT_LNG} />
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-[#E7E5E4] pt-5 text-xs leading-relaxed text-[#78716C]">
            {tFooter("legal_office")}: {companyInfo.addressLegal}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex min-w-[130px] sm:min-w-[140px] flex-1 sm:flex-initial items-center justify-center text-center gap-1.5 rounded-[5px] bg-[#3D5A3D]/10 px-4 py-2 text-xs font-semibold tracking-wide text-[#3D5A3D]">
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



function GoogleMapEmbed({
  address,
  latitude,
  longitude,
}: {
  address: string;
  latitude: number;
  longitude: number;
}) {
  const src = `https://maps.google.com/maps?hl=it&q=${latitude},${longitude}&t=&z=17&ie=UTF8&iwloc=B&output=embed`;

  return (
    <div className="relative overflow-hidden rounded-[5px] border border-[#E7E5E4] bg-[#F5F5F4]">
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
      className="inline-flex h-10 w-10 items-center justify-center rounded-[5px] border border-[#E7E5E4] bg-[#FDFCF8] text-[#57534E] transition hover:border-[#3D5A3D]/30 hover:bg-white hover:text-[#3D5A3D]"
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


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function ContattiPageWrapper(props: any) {
  const { locale } = await props.params;
  setRequestLocale(locale);
  const messages = await getMessages();
  const pageMessages = {
    Common: messages.Common,
    Cart: messages.Cart,
    ContactPage: messages.ContactPage,
  };
  return (
    <NextIntlClientProvider messages={pageMessages}>
      <ContattiPage {...props} />
    </NextIntlClientProvider>
  );
}


function WhatsAppIcon({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="#25D366"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0012.04 2z"
      />
      <path
        fill="#FFFFFF"
        d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.2-.24-.59-.49-.5-.67-.52-.18 0-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.3-1.03 1.01-1.03 2.47 0 1.47 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z"
      />
    </svg>
  );
}
