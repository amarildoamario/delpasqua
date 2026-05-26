"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const GALLERY_CAROUSEL_OPTS = {
  align: "start" as const,
  containScroll: "trimSnaps" as const,
  loop: true,
};

const HOME_GALLERY_IMAGES = [
  "1.jpeg",
  "2.jpg",
  "3.jpeg",
  "4.jpeg",
  "5.jpg",
  "_DRM2535.jpg",
  "BON04567.jpg",
  "DJI_20240922104707_0163_D.jpg",
  "WhatsApp Image 2026-05-07 at 16.27.42 (7).jpeg",
  "_DRM2492.jpg",
  "BON04548.jpg",
  "WhatsApp Image 2026-05-07 at 16.27.41 (6).jpeg",
  "DJI_20240922100135_0145_D.jpg",
  "_DRM2485.jpg",
  "BON04498.jpg",
  "WhatsApp Image 2026-05-07 at 16.27.40.jpeg",
  "DJI_20240803090407_0112_D.jpg",
  "BON04380.jpg",
  "WhatsApp Image 2026-05-07 at 16.27.31.jpeg",
  "BON04513.jpg",
  "DJI_20240922095628_0133_D.jpg",
  "WhatsApp Image 2026-05-07 at 16.27.38.jpeg",
  "BON04466.jpg",
  "WhatsApp Image 2026-05-07 at 16.27.30 (3).jpeg",
  "BON04544.jpg",
  "WhatsApp Image 2026-05-07 at 16.27.32 (1).jpeg",
  "BON04510.jpg",
  "WhatsApp Image 2026-05-07 at 16.27.41 (5).jpeg",
  "BON04353.jpg",
  "WhatsApp Image 2026-05-07 at 16.27.40 (6).jpeg",
  "WhatsApp Image 2026-05-07 at 16.27.38 (2).jpeg",
  "WhatsApp Image 2026-05-07 at 16.27.30.jpeg",
  "WhatsApp Image 2026-05-07 at 16.27.32.jpeg",
  "WhatsApp Image 2026-05-07 at 16.27.31 (2).jpeg",
  "WhatsApp Image 2026-05-07 at 16.27.41 (4).jpeg",
  "WhatsApp Image 2026-05-07 at 16.27.30 (1).jpeg",
];

function getGalleryImageSrc(fileName: string) {
  return `/home_gallery/${encodeURIComponent(fileName)}`;
}

interface HomeGalleryProps {
  images?: string[];
}

export default function HomeGallery({ images }: HomeGalleryProps) {
  const t = useTranslations("HomePage.HomeGallery");
  const imagesList = images && images.length > 0 ? images : HOME_GALLERY_IMAGES;

  return (
    <section className="bg-[#f3f1eb] py-8 sm:py-16 text-[#1f1a17] lg:py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="mb-5 md:mb-9 flex flex-col gap-4 md:flex-row md:items-center">
          <h2 className="font-serif text-3xl font-light tracking-tight text-[#1f1a17] md:text-4xl">
            {t("title")}
          </h2>
          <div className="hidden h-px w-28 bg-[#DCCFBE] md:block" />
        </div>

        <Carousel
          aria-label={t("carouselLabel")}
          className="relative w-full cursor-grab select-none px-6 active:cursor-grabbing sm:px-10 lg:px-0"
          opts={GALLERY_CAROUSEL_OPTS}
        >
          <CarouselContent className="-ml-4">
            {imagesList.map((imageName, index) => (
              <CarouselItem
                key={imageName}
                className="basis-[85%] pl-4 sm:basis-1/2 lg:basis-1/4"
              >
                <div className="relative aspect-[1.08/1] overflow-hidden rounded-[5px] bg-[#E4DED3]">
                  <Image
                    src={getGalleryImageSrc(imageName)}
                    alt={t("imageAlt", { index: index + 1 })}
                    fill
                    sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 22vw"
                    className="rounded-[5px] object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious
            aria-label={t("previousImage")}
            className="left-0 z-10 h-9 w-9 border border-white/70 bg-white/80 text-[#9A928A] shadow-[0_6px_18px_rgba(58,47,37,0.12)] hover:bg-white hover:text-[#314030] sm:-left-1 lg:-left-10"
            size="icon-lg"
            variant="ghost"
          />
          <CarouselNext
            aria-label={t("nextImage")}
            className="right-0 z-10 h-9 w-9 border border-white/70 bg-white/80 text-[#9A928A] shadow-[0_6px_18px_rgba(58,47,37,0.12)] hover:bg-white hover:text-[#314030] sm:-right-1 lg:-right-10"
            size="icon-lg"
            variant="ghost"
          />
        </Carousel>
      </div>
    </section>
  );
}
