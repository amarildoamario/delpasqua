import Image from "next/image"
import { getProductCardImagePresentation } from "@/lib/productImageFit"

/** A shared shelf and optical scale for catalog cards, including the mobile list. */
export default function ProductCardImage({
  src,
  alt,
  sizes,
}: {
  src: string
  alt: string
  sizes: string
}) {
  const { bounds, canvas, height } = getProductCardImagePresentation(src)
  const [left, top, width, imageHeight] = bounds

  return (
    <div className="absolute inset-0 overflow-hidden bg-[linear-gradient(180deg,#fff_0%,#fff_65%,#f7f4ee_100%)]">
      <div
        aria-hidden="true"
        className="absolute bottom-[9%] left-[17%] h-[6%] w-[66%] rounded-[50%] bg-[radial-gradient(ellipse,rgba(111,91,59,0.15)_0%,rgba(111,91,59,0.05)_48%,transparent_72%)]"
      />
      <div
        className="absolute bottom-[12%] left-[8%] right-[8%] flex items-end justify-center transition-transform duration-500 ease-out group-hover:scale-[1.01] motion-reduce:scale-100 motion-reduce:transition-none origin-bottom mix-blend-multiply"
        style={{ height: `${height}%` }}
      >
        <div className="relative h-full max-w-full overflow-hidden" style={{ aspectRatio: `${width} / ${imageHeight}` }}>
          <Image
            src={src}
            alt={alt}
            width={canvas[0]}
            height={canvas[1]}
            sizes={sizes}
            className="absolute object-contain"
            style={{
              maxWidth: "none",
              width: `${canvas[0] / width * 100}%`,
              height: `${canvas[1] / imageHeight * 100}%`,
              left: `${-left / width * 100}%`,
              top: `${-top / imageHeight * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
