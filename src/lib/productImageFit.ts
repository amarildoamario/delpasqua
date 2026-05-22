const CONTAINED_PRODUCT_IMAGES = [
  "EVO-750-ml-gpt.png",
  "fruttato-intenso-bottiglia-1lt-gpt.png",
  "vino-vittoria.png",
] as const

const TRANSPARENT_PRODUCT_IMAGE_OVERRIDES = {
  "EVO-750-ml-gpt.png": "/products_no_background/EVO-750-ml-gpt-no-background.png",
  "fruttato-intenso-bottiglia-1lt-gpt.png": "/products_no_background/magnifico-no-background-v2.png",
  "vino-vittoria.png": "/products_no_background/vino-vittoria-no-background.png",
} as const

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
