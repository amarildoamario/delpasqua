const CONTAINED_PRODUCT_IMAGES = [
  "EVO-750-ml-gpt.png",
  "EVO-500ml-transparent.png",
  "vino-vittoria.png",
] as const

const TRANSPARENT_PRODUCT_IMAGE_OVERRIDES = {
  "EVO-750-ml-gpt.png": "/products/EVO-500ml-transparent.png",
  "vino-vittoria.png": "/products_no_background/vino-vittoria-no-background.png",
} as const

// Uniform packshots include transparent margins; preserve their full silhouette.
export function isUniformProductImage(imageSrc?: string | null) {
  return /^\/products\/(?:fruttato-(?:leggero|medio|intenso)-(?:bottiglia|latta)-[a-z0-9]+|EVO-latta-(?:750ml|1lt|3lt|5lt)(?:-v2)?)\.webp(?:[?#]|$)/.test(imageSrc ?? "")
}

// Optical framing for cards only. Bounds compensate for whitespace baked into
// older photographs; the source files and product-detail gallery stay intact.
// bounds = [left, top, width, height], measured on the original canvas.
export function getProductCardImagePresentation(imageSrc: string): {
  canvas: [number, number]
  bounds: [number, number, number, number]
  height: number
} {
  // EVO has two real container shapes. Legacy URLs are rewritten to these photos.
  if (/\/EVO-latta-750ml(?:-v2)?\.webp(?:[?#]|$)/.test(imageSrc)) {
    return { canvas: [1200, 1800], bounds: [439, 120, 322, 1560], height: 74 }
  }
  if (/\/EVO-latta-(?:1|3|5)lt(?:-v2)?\.(?:webp|png)(?:[?#]|$)/.test(imageSrc)) {
    return { canvas: [1200, 1800], bounds: [241, 120, 718, 1560], height: 62 }
  }
  if (isUniformProductImage(imageSrc)) {
    if (imageSrc.includes("-latta-") || imageSrc.includes("EVO-latta-")) {
      return { canvas: [1200, 1800], bounds: [20, 120, 1160, 1560], height: 62 }
    }
    return { canvas: [1200, 1800], bounds: [0, 90, 1200, 1620], height: 84 }
  }
  if (imageSrc.includes("EVO-750-ml-gpt.png") || imageSrc.includes("EVO-500ml-transparent.png")) {
    return { canvas: [1024, 1536], bounds: [207, 77, 606, 1340], height: 84 }
  }
  if (/\/(tartufo|peperoncino)\.jpg(?:[?#]|$)/.test(imageSrc)) {
    return { canvas: [1024, 1024], bounds: [450, 274, 125, 546], height: 80 }
  }
  if (imageSrc.includes("vino-vittoria.png")) {
    return { canvas: [1023, 1537], bounds: [316, 56, 383, 1414], height: 84 }
  }
  return { canvas: [1, 1], bounds: [0, 0, 1, 1], height: 72 }
}

export function shouldContainProductImage(imageSrc?: string | null) {
  if (!imageSrc) return false

  return CONTAINED_PRODUCT_IMAGES.some((imageName) => imageSrc.includes(imageName))
}

export function resolveTransparentProductImage(imageSrc?: string | null) {
  if (!imageSrc) return ""

  for (const [imageName, transparentSrc] of Object.entries(TRANSPARENT_PRODUCT_IMAGE_OVERRIDES)) {
    if (imageSrc.includes(imageName)) return transparentSrc
  }

  return imageSrc
}
