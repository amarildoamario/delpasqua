"use client";

import Image from "next/image";
import { useRef } from "react";
import { useLocale } from "next-intl";
import {
  HeartHandshake,
  Leaf,
  PackageCheck,
  ShieldCheck,
  Star,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useScrollTextReveal } from "./useScrollTextReveal";
import {
  AvatarGroup,
  AvatarGroupTooltip,
} from "@/components/animate-ui/components/animate/avatar-group";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const REVIEWER_AVATARS = [
  {
    initials: "MD",
    name: "Marco D.",
    bg: "bg-[#41503A] text-[#fdfaf7]",
  },
  {
    initials: "SR",
    name: "Sophie R.",
    bg: "bg-[#8C7A6B] text-[#fdfaf7]",
  },
  {
    initials: "GL",
    name: "Giovanni L.",
    bg: "bg-[#C7A84F] text-[#1f1a17]",
  },
  {
    initials: "EM",
    name: "Elena M.",
    bg: "bg-[#A7AF99] text-[#1f1a17]",
  },
  {
    initials: "LB",
    name: "Luca B.",
    bg: "bg-[#5F6A52] text-[#fdfaf7]",
  },
];

const GOOGLE_REVIEWS_TEXT: Record<string, string> = {
  it: "Recensioni Google",
  en: "Google Reviews",
  de: "Google-Bewertungen",
  nl: "Google Reviews",
  no: "Google-anmeldelser",
  da: "Google-anmeldelser",
};

type TrustItem = {
  icon: typeof PackageCheck;
  title: string;
  description: string;
};

type ReviewItem = {
  author: string;
  initials: string;
  text: string;
};

type LocaleCopy = {
  trust: TrustItem[];
  reviewsLabel: string;
  reviewsTitle: string;
  reviewsStatus: string;
  reviews: ReviewItem[];
};

const COPY: Record<string, LocaleCopy> = {
  it: {
    trust: [
      {
        icon: PackageCheck,
        title: "Spedizione garantita",
        description: "Imballaggi anti-urto in carta riciclata e consegna tracciata in 48h.",
      },
      {
        icon: ShieldCheck,
        title: "Qualita premium certificata",
        description: "Analisi chimiche e panel test su ogni singolo lotto prodotto.",
      },
      {
        icon: Leaf,
        title: "Materie prime locali",
        description: "Olive coltivate nei nostri terreni e lavorate con filiera corta.",
      },
      {
        icon: HeartHandshake,
        title: "Supporto diretto",
        description: "Parli direttamente con chi produce, per ordini, dubbi e consigli.",
      },
    ],
    reviewsLabel: "Recensioni",
    reviewsTitle: "Le Voci di Chi ci sceglie",
    reviewsStatus: "Recensioni Google pronte da collegare",
    reviews: [
      {
        author: "Marco D.",
        initials: "M",
        text: "Ordinare questo extravergine e diventata una tradizione familiare. La spedizione e sempre puntuale e il profumo quando apri la bottiglia e incredibile.",
      },
      {
        author: "Sophie R.",
        initials: "S",
        text: "L'attenzione al dettaglio e superba. Il monocultivar e potente, strutturato, con un packaging elegante e minimale.",
      },
      {
        author: "Giovanni L.",
        initials: "G",
        text: "Uso la linea biologica per il mio ristorante. I clienti notano subito la differenza. Una qualita costante anno dopo anno che mi rassicura.",
      },
      {
        author: "Elena M.",
        initials: "E",
        text: "Un olio che racconta il territorio. Lo uso a crudo sui miei piatti migliori, ha una nota piccante finale che risveglia il palato.",
      },
      {
        author: "Luca B.",
        initials: "L",
        text: "Ho acquistato una selezione per un regalo aziendale. Confezione curata, tempi rispettati e prodotto davvero superiore alla media.",
      },
      {
        author: "Francesca P.",
        initials: "F",
        text: "Lo uso ogni giorno su verdure, zuppe e pane tostato. Ha un profumo verde pulito e un gusto che resta elegante.",
      },
      {
        author: "Andrea S.",
        initials: "A",
        text: "Servizio diretto e preciso. Si capisce che dietro non c'e un catalogo anonimo, ma persone che conoscono il proprio olio.",
      },
      {
        author: "Martina C.",
        initials: "M",
        text: "La differenza si sente appena arriva in tavola. Fruttato, fresco, mai pesante. Ormai lo tengo sempre in dispensa.",
      },
      {
        author: "Paolo V.",
        initials: "P",
        text: "Ottimo equilibrio tra amaro e piccante. Perfetto sulla carne alla brace e anche su piatti semplici come legumi e insalate.",
      },
      {
        author: "Chiara F.",
        initials: "C",
        text: "Ho chiesto consiglio prima dell'acquisto e mi hanno risposto con grande attenzione. L'olio e arrivato perfetto.",
      },
    ],
  },
  en: {
    trust: [
      {
        icon: PackageCheck,
        title: "Protected shipping",
        description: "Shock-safe recycled paper packaging and tracked delivery within 48 hours.",
      },
      {
        icon: ShieldCheck,
        title: "Certified premium quality",
        description: "Chemical analysis and panel testing on every production batch.",
      },
      {
        icon: Leaf,
        title: "Local raw materials",
        description: "Olives grown on our land and processed through a short supply chain.",
      },
      {
        icon: HeartHandshake,
        title: "Direct support",
        description: "You speak directly with the producer for orders, questions, and advice.",
      },
    ],
    reviewsLabel: "Reviews",
    reviewsTitle: "Voices From Those Who Choose Us",
    reviewsStatus: "Google reviews ready to connect",
    reviews: [
      {
        author: "Marco D.",
        initials: "M",
        text: "Ordering this extra virgin oil has become a family habit. Delivery is always punctual and the aroma when you open the bottle is remarkable.",
      },
      {
        author: "Sophie R.",
        initials: "S",
        text: "The attention to detail is excellent. The monocultivar is structured and vibrant, and the packaging feels elegant and restrained.",
      },
      {
        author: "Giovanni L.",
        initials: "G",
        text: "I use the organic line for my restaurant. Guests notice the difference immediately. The quality is steady year after year.",
      },
      {
        author: "Elena M.",
        initials: "E",
        text: "An oil that speaks of its territory. I use it raw on my best dishes and the peppery finish wakes up the palate.",
      },
      {
        author: "Luca B.",
        initials: "L",
        text: "I bought a selection as a business gift. The packaging was careful, timing was respected, and the product felt truly above average.",
      },
      {
        author: "Francesca P.",
        initials: "F",
        text: "I use it every day on vegetables, soups, and toasted bread. It has a clean green aroma and a taste that stays elegant.",
      },
      {
        author: "Andrea S.",
        initials: "A",
        text: "Direct and precise service. You can tell there are real people behind it, not an anonymous catalogue.",
      },
      {
        author: "Martina C.",
        initials: "M",
        text: "You notice the difference as soon as it reaches the table. Fruity, fresh, never heavy. I now always keep it in the pantry.",
      },
      {
        author: "Paolo V.",
        initials: "P",
        text: "Excellent balance between bitter and peppery notes. Perfect on grilled meat and on simple dishes like legumes and salads.",
      },
      {
        author: "Chiara F.",
        initials: "C",
        text: "I asked for advice before buying and received a careful answer. The oil arrived in perfect condition.",
      },
    ],
  },
  de: {
    trust: [
      {
        icon: PackageCheck,
        title: "Gesicherter Versand",
        description: "Sto?sichere Verpackung aus Recyclingpapier und Sendungsverfolgung innerhalb von 48 Stunden.",
      },
      {
        icon: ShieldCheck,
        title: "Zertifizierte Premiumqualitat",
        description: "Chemische Analysen und Paneltests fur jede einzelne Produktionscharge.",
      },
      {
        icon: Leaf,
        title: "Lokale Rohstoffe",
        description: "Oliven aus unseren eigenen Hainen mit kurzer, kontrollierter Lieferkette.",
      },
      {
        icon: HeartHandshake,
        title: "Direkter Support",
        description: "Sie sprechen direkt mit dem Produzenten fur Bestellungen, Fragen und Beratung.",
      },
    ],
    reviewsLabel: "Bewertungen",
    reviewsTitle: "Stimmen Derer, Die uns wahlen",
    reviewsStatus: "Google-Bewertungen bereit zur Anbindung",
    reviews: [
      {
        author: "Marco D.",
        initials: "M",
        text: "Dieses native Olivenol ist fur unsere Familie zur Gewohnheit geworden. Die Lieferung ist punktlich und das Aroma beim Offnen beeindruckt jedes Mal.",
      },
      {
        author: "Sophie R.",
        initials: "S",
        text: "Die Liebe zum Detail ist hervorragend. Der Monokultivar ist kraftvoll und ausgewogen, das Packaging elegant und reduziert.",
      },
      {
        author: "Giovanni L.",
        initials: "G",
        text: "Ich nutze die Bio-Linie fur mein Restaurant. Die Gaste merken den Unterschied sofort. Konstante Qualitat, Jahr fur Jahr.",
      },
      {
        author: "Elena M.",
        initials: "E",
        text: "Ein Ol, das sein Herkunftsgebiet erzahlt. Ich nutze es roh auf meinen besten Gerichten, mit einem finalen pikanten Akzent.",
      },
    ],
  },
  nl: {
    trust: [
      {
        icon: PackageCheck,
        title: "Beschermde verzending",
        description: "Schokbestendige verpakking van gerecycled papier en levering met tracking binnen 48 uur.",
      },
      {
        icon: ShieldCheck,
        title: "Gecertificeerde premiumkwaliteit",
        description: "Chemische analyses en paneltests op elke afzonderlijke productiebatch.",
      },
      {
        icon: Leaf,
        title: "Lokale grondstoffen",
        description: "Olijven van eigen grond, verwerkt via een korte en gecontroleerde keten.",
      },
      {
        icon: HeartHandshake,
        title: "Directe support",
        description: "Je spreekt direct met de producent voor bestellingen, vragen en advies.",
      },
    ],
    reviewsLabel: "Reviews",
    reviewsTitle: "De Stemmen Van Wie ons kiest",
    reviewsStatus: "Google reviews klaar om te koppelen",
    reviews: [
      {
        author: "Marco D.",
        initials: "M",
        text: "Deze extra vergine bestellen is een familietraditie geworden. De levering is altijd stipt en het aroma bij het openen van de fles is indrukwekkend.",
      },
      {
        author: "Sophie R.",
        initials: "S",
        text: "De aandacht voor detail is sterk. De monocultivar is krachtig en evenwichtig, met een verfijnde en sobere verpakking.",
      },
      {
        author: "Giovanni L.",
        initials: "G",
        text: "Ik gebruik de biologische lijn in mijn restaurant. Gasten merken meteen het verschil. De kwaliteit blijft jaar na jaar constant.",
      },
      {
        author: "Elena M.",
        initials: "E",
        text: "Een olie die zijn herkomst laat spreken. Ik gebruik hem rauw op mijn beste gerechten, met een levendige pittige afdronk.",
      },
    ],
  },
  no: {
    trust: [
      {
        icon: PackageCheck,
        title: "Trygg frakt",
        description: "Stotsikker emballasje i resirkulert papir og sporet levering innen 48 timer.",
      },
      {
        icon: ShieldCheck,
        title: "Sertifisert premiumkvalitet",
        description: "Kjemiske analyser og paneltest pa hver eneste produksjonsbatch.",
      },
      {
        icon: Leaf,
        title: "Lokale ravarer",
        description: "Oliven fra egne marker, bearbeidet gjennom en kort og kontrollert kjede.",
      },
      {
        icon: HeartHandshake,
        title: "Direkte support",
        description: "Du snakker direkte med produsenten for bestillinger, sporsmal og rad.",
      },
    ],
    reviewsLabel: "Anmeldelser",
    reviewsTitle: "Stemmer Fra Dem Som Velger Oss",
    reviewsStatus: "Google-anmeldelser klare for tilkobling",
    reviews: [
      {
        author: "Marco D.",
        initials: "M",
        text: "A bestille denne extra virgin-oljen har blitt en familietradisjon. Leveringen er alltid presis og duften nar flasken apnes er fantastisk.",
      },
      {
        author: "Sophie R.",
        initials: "S",
        text: "Detaljnivaet er imponerende. Monocultivaren er strukturert og elegant, og emballasjen foles raffinert og ren.",
      },
      {
        author: "Giovanni L.",
        initials: "G",
        text: "Jeg bruker den okologiske linjen i restauranten min. Gjestene merker forskjellen med en gang. Kvaliteten er stabil ar etter ar.",
      },
      {
        author: "Elena M.",
        initials: "E",
        text: "En olje som forteller om territoriet sitt. Jeg bruker den raw pa mine beste retter, med en livlig pepperaktig avslutning.",
      },
    ],
  },
  da: {
    trust: [
      {
        icon: PackageCheck,
        title: "Sikker levering",
        description: "Stodsikker emballage i genbrugspapir og sporet levering inden for 48 timer.",
      },
      {
        icon: ShieldCheck,
        title: "Certificeret premiumkvalitet",
        description: "Kemiske analyser og paneltest pa hver enkelt produktionsbatch.",
      },
      {
        icon: Leaf,
        title: "Lokale ravarer",
        description: "Oliven fra egne marker, forarbejdet gennem en kort og kontrolleret forsyningskade.",
      },
      {
        icon: HeartHandshake,
        title: "Direkte support",
        description: "Du taler direkte med producenten om ordrer, sporgsmal og rad.",
      },
    ],
    reviewsLabel: "Anmeldelser",
    reviewsTitle: "Stemmer Fra Dem Der Valger os",
    reviewsStatus: "Google-anmeldelser klar til tilkobling",
    reviews: [
      {
        author: "Marco D.",
        initials: "M",
        text: "At bestille denne extra virgin er blevet en familietradition. Leveringen er altid punktlig, og duften nar flasken abnes er fantastisk.",
      },
      {
        author: "Sophie R.",
        initials: "S",
        text: "Opmarksomheden pa detaljer er fremragende. Monocultivaren er struktureret og elegant med et sobert og raffineret udtryk.",
      },
      {
        author: "Giovanni L.",
        initials: "G",
        text: "Jeg bruger den okologiske linje i min restaurant. Gasterne marker forskellen med det samme. Kvaliteten er stabil ar efter ar.",
      },
      {
        author: "Elena M.",
        initials: "E",
        text: "En olie der fortaller om sit territorium. Jeg bruger den ra pa mine bedste retter med en livlig pebret afslutning.",
      },
    ],
  },
};

function ReviewStars() {
  return (
    <div className="flex items-center gap-1 text-[#C7A84F]">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} className="h-3.5 w-3.5 fill-current" strokeWidth={1.8} />
      ))}
    </div>
  );
}

const REVIEW_CAROUSEL_OPTS = {
  align: "start" as const,
  containScroll: "trimSnaps" as const,
  dragFree: true,
};

export default function HomeTrustAndReviews() {
  const locale = useLocale();
  const copy = COPY[locale] ?? COPY.en;
  const reviews =
    copy.reviews.length >= 10
      ? copy.reviews
      : [...copy.reviews, ...COPY.en.reviews.slice(copy.reviews.length)];
  const textRef = useRef<HTMLDivElement | null>(null);

  useScrollTextReveal(textRef);

  return (
    <section className="bg-[#FBF6F0] text-[#1f1a17]">
      <div className="bg-[#A7AF99]">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-6 px-6 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:gap-10 sm:overflow-visible sm:pb-0">
            {copy.trust.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex min-w-[calc(50%-12px)] snap-center flex-col items-center text-center sm:min-w-0"
                >
                  <div className="mb-2.5 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-[#41503A]/16 bg-white/16 text-[#314030] backdrop-blur-sm">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.7} />
                  </div>
                  <h3 className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.15em] sm:tracking-[0.18em] text-[#314030]">
                    {item.title}
                  </h3>
                  <p className="mt-1 sm:mt-2 max-w-[130px] sm:max-w-[16rem] text-[10px] sm:text-sm leading-normal sm:leading-6 text-[#314030]/78">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="py-18 lg:py-22">
        <div ref={textRef} className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <span data-reveal-text className="mb-3 block text-xs font-medium uppercase tracking-[0.28em] text-[#7D876B]">
            {copy.reviewsLabel}
          </span>

          <div data-reveal-text className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <h2 className="font-serif text-3xl font-light tracking-tight text-[#1f1a17] md:text-4xl">
                {copy.reviewsTitle}
              </h2>
              <div className="hidden h-px w-24 bg-[#DCCFBE] md:block" />
            </div>

            <div className="flex items-center gap-3">
              <AvatarGroup invertOverlap={true} className="h-12 -space-x-4">
                {REVIEWER_AVATARS.map((avatar, idx) => (
                  <Avatar key={idx} size="lg" className="size-12 border-none after:border-0 shadow-sm hover:scale-110 transition-transform duration-200 cursor-pointer">
                    <AvatarFallback className={cn("text-xs font-bold tracking-wider", avatar.bg)}>
                      {avatar.initials}
                    </AvatarFallback>
                    <AvatarGroupTooltip className="font-semibold text-xs bg-[#314030] text-stone-100 py-1.5 px-3 rounded shadow-md border-0">{avatar.name}</AvatarGroupTooltip>
                  </Avatar>
                ))}
              </AvatarGroup>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-extrabold text-[#1f1a17] leading-none">4.9</span>
                  <div className="flex text-[#C7A84F] leading-none">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-current" />
                    ))}
                  </div>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5F6A52] leading-none">
                  {GOOGLE_REVIEWS_TEXT[locale] ?? GOOGLE_REVIEWS_TEXT.en}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Carousel
          aria-label={copy.reviewsTitle}
          className="mt-4 w-full cursor-grab select-none active:cursor-grabbing"
          opts={REVIEW_CAROUSEL_OPTS}
        >
          {/* Fallback layout ready to swap with a live Google reviews feed later. */}
          <CarouselContent className="-ml-5 px-8 py-10 sm:px-10 lg:px-14">
            {reviews.map((review, index) => (
              <CarouselItem
                key={`${review.author}-${index}`}
                className="basis-[82vw] pl-5 sm:basis-[24rem] md:basis-[25rem] lg:basis-[26rem] xl:basis-[27rem]"
              >
                <article
                  data-review-source="google"
                  className="flex min-h-[330px] flex-col rounded-[5px] border border-[#ECE3D8] bg-white p-6 shadow-[0_10px_30px_rgba(72,55,34,0.06)] transition-transform duration-300 hover:-translate-y-1"
                >
                  <ReviewStars />

                  <p className="mt-5 flex-1 text-[15px] leading-7 text-[#54483E]">
                    &ldquo;{review.text}&rdquo;
                  </p>

                  <div className="mt-6 flex min-h-14 items-center justify-between gap-4 border-t border-[#F1E9DF] pt-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#314030] text-sm font-medium text-white">
                        {review.initials}
                      </div>
                      <span className="text-sm font-medium text-[#2F2924]">{review.author}</span>
                    </div>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
                      <Image
                        src="/loghi/google-logo.jpg"
                        alt="Google"
                        width={24}
                        height={24}
                        className="h-6 w-6 object-contain"
                      />
                    </div>
                  </div>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
