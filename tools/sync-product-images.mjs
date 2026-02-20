// tools/sync-product-images.mjs  (SAFE: no deletions)
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dbPath = path.join(root, "src", "db", "products.json");
const publicProductsDir = path.join(root, "public", "products");

// includo anche varianti con estensioni maiuscole (Windows)
const exts = [".jpg", ".jpeg", ".png", ".webp", ".JPG", ".JPEG", ".PNG", ".WEBP"];

function existsFile(absPath) {
  try {
    return fs.existsSync(absPath) && fs.statSync(absPath).isFile();
  } catch {
    return false;
  }
}

function toAbsFromPublic(rel) {
  const clean = rel.startsWith("/") ? rel.slice(1) : rel;
  return path.join(root, "public", clean);
}

function normalizeSlugish(s) {
  return String(s ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")
    .replace(/\-+/g, "-");
}

function findFirstExistingInProducts(baseNameNoExt) {
  for (const ext of exts) {
    const abs = path.join(publicProductsDir, baseNameNoExt + ext);
    if (existsFile(abs)) return "/products/" + baseNameNoExt + ext;
  }
  return null;
}

function validateExistingImageSrc(currentSrc) {
  if (!currentSrc) return null;
  const abs = toAbsFromPublic(currentSrc);
  return existsFile(abs) ? currentSrc : null;
}

function guessVariantImage(productBase, variant) {
  const variantId = normalizeSlugish(variant.id);
  const labelSlug = normalizeSlugish(variant.label);

  const candidates = [
    `${productBase}-${variantId}`,
    `${productBase}-${labelSlug}`,
    // extra comuni: "100-ml" ecc.
    `${productBase}-${variantId.replace(/ml$/, "-ml")}`,
    `${productBase}-${labelSlug.replace(/ml$/, "-ml")}`,
  ].filter(Boolean);

  for (const c of candidates) {
    const found = findFirstExistingInProducts(c);
    if (found) return found;
  }
  return null;
}

function guessProductImage(product) {
  const base = normalizeSlugish(product.slug || product.id);
  const found = findFirstExistingInProducts(base);
  return found;
}

function main() {
  if (!existsFile(dbPath)) {
    console.error("❌ Non trovo:", dbPath);
    process.exit(1);
  }
  if (!fs.existsSync(publicProductsDir)) {
    console.error("❌ Non trovo cartella:", publicProductsDir);
    process.exit(1);
  }

  // backup automatico SEMPRE
  const backupPath = dbPath.replace(/\.json$/, `.backup.${Date.now()}.json`);
  fs.copyFileSync(dbPath, backupPath);

  const raw = fs.readFileSync(dbPath, "utf8");
  const products = JSON.parse(raw);

  let fixedProducts = 0;
  let fixedVariants = 0;

  const missing = {
    productImages: [],
    variantImages: [],
  };

  const updated = products.map((p) => {
    const productBase = normalizeSlugish(p.slug || p.id);

    // PRODUCT IMAGE
    const validProductSrc = validateExistingImageSrc(p.imageSrc);
    if (!validProductSrc) {
      const guessed = guessProductImage(p);
      if (guessed) {
        p.imageSrc = guessed;
        if (!p.imageAlt) p.imageAlt = p.title || productBase;
        fixedProducts++;
      } else {
        missing.productImages.push({
          product: p.id || p.slug,
          expectedBase: productBase,
          current: p.imageSrc,
        });
      }
    }

    // VARIANTS
    const variants = Array.isArray(p.variants) ? p.variants : [];
    for (const v of variants) {
      const validVariantSrc = validateExistingImageSrc(v.imageSrc);

      if (validVariantSrc) continue;

      // se non c’è o non esiste, provo ad indovinare
      const guessed = guessVariantImage(productBase, v);
      if (guessed) {
        v.imageSrc = guessed;
        if (!v.imageAlt) v.imageAlt = `${p.title ?? productBase} ${v.label ?? v.id}`;
        fixedVariants++;
      } else {
        missing.variantImages.push({
          product: p.id || p.slug,
          variantId: v.id,
          label: v.label,
          current: v.imageSrc,
          triedBase: productBase,
        });
      }
    }

    return p;
  });

  fs.writeFileSync(dbPath, JSON.stringify(updated, null, 2) + "\n", "utf8");

  console.log("✅ Sync SAFE completato (nessuna variante eliminata).");
  console.log("Backup creato:", backupPath);
  console.log("Immagini prodotto sistemate:", fixedProducts);
  console.log("Immagini varianti sistemate:", fixedVariants);

  if (missing.productImages.length || missing.variantImages.length) {
    console.log("\n⚠️ MANCANO immagini per alcuni elementi:");
    if (missing.productImages.length) {
      console.log("\nProdotti senza immagine trovata:");
      for (const m of missing.productImages) {
        console.log(`- ${m.product} (base: ${m.expectedBase}) current: ${m.current}`);
      }
    }
    if (missing.variantImages.length) {
      console.log("\nVarianti senza immagine trovata:");
      for (const m of missing.variantImages) {
        console.log(`- ${m.product} :: ${m.variantId} (${m.label}) current: ${m.current}`);
      }
    }
  }
}

main();
