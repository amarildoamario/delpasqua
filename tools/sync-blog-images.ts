import fs from "node:fs";
import path from "node:path";
import { mockBlogPosts } from "../src/lib/blog-data";

const root = process.cwd();
const publicBlogDir = path.join(root, "public", "blog");
const libDir = path.join(root, "src", "lib");
const sourceFiles = [
  path.join(libDir, "blog-data.ts"),
  ...fs
    .readdirSync(libDir)
    .filter((name) => /^blog-posts-.*\.ts$/i.test(name))
    .map((name) => path.join(libDir, name)),
];
const fallbackImageBySlug: Record<string, string> = {
  "acidita-olio-evo": "/blog/polifenoli-e-perossidi.jpg",
  "supermercato-vs-frantoio": "/blog/come-nasce-nostro-olio.jpg",
  "friggere-con-olio-evo": "/blog/crudo-vs-cottura-quando-usare-evo.jpg",
  "esaltare-olio-nuovo-crudo": "/blog/olio-nuovo-cose-e-quanto-dura.jpg",
  "dop-igp-100-italiano-differenze": "/blog/tracciabilita-lotto-analisi-qualita.jpg",
  "amaro-piccante-olio-non-e-difetto": "/blog/polifenoli-e-perossidi.jpg",
  "conservare-olio-casa": "/blog/quanto-dura-olio-evo-moderna.png",
  "come-capire-olio-rancido": "/blog/rancido-cause-prevenzione.jpg",
  "punto-di-fumo-friggere-evo": "/blog/crudo-vs-cottura-quando-usare-evo.jpg",
  "errori-conservazione-olio-cucina": "/blog/quanto-dura-olio-evo-moderna.png",
  "miglior-olio-bruschetta": "/blog/olio-per-insalata.jpg",
  "olio-per-pasta-aglio-olio": "/blog/olio-per-pizza.jpg",
  "pane-e-olio-degustazione": "/blog/oleoturismo-degustazioni-frantoio.jpg",
  "olio-nei-dolci": "/blog/fruttato-leggero-abbinamenti.jpg",
  "difetti-olio-evo-guida-completa": "/blog/rancido-cause-prevenzione.jpg",
  "polifenoli-oleocantale-oleuropeina": "/blog/composizione-chimica-olio-evo.jpg",
  "come-degustare-olio-5-minuti": "/blog/oleoturismo-degustazioni-frantoio.jpg",
  "numero-perossidi-che-misura": "/blog/polifenoli-e-perossidi.jpg",
  "filtrazione-olio-effetti-stabilita": "/blog/quanto-dura-olio-evo-moderna.png",
  "difetto-avvinato-inacetito-olio": "/blog/rancido-cause-prevenzione.jpg",
  "olio-per-carne-grigliat": "/blog/fruttato-intenso-quando-usarlo.jpg",
  "perche-olio-cambia-ogni-anno": "/blog/olio-nuovo-cose-e-quanto-dura.jpg",
  "faq-olio-evo": "/blog/come-nasce-nostro-olio.jpg",
};

type RemotePost = {
  slug: string;
  remoteUrl: string;
};

function isRemoteUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

function inferExtension(remoteUrl: string, contentType: string | null) {
  const normalized = contentType?.split(";")[0].trim().toLowerCase();

  if (normalized === "image/jpeg") return ".jpg";
  if (normalized === "image/png") return ".png";
  if (normalized === "image/webp") return ".webp";
  if (normalized === "image/avif") return ".avif";

  try {
    const pathname = new URL(remoteUrl).pathname;
    const ext = path.extname(pathname).toLowerCase();
    if (ext) return ext;
  } catch {
    // fallback below
  }

  return ".jpg";
}

function ensureDir(dirPath: string) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function downloadNeededPosts() {
  const posts = mockBlogPosts
    .filter((post) => isRemoteUrl(post.imageUrl))
    .map(
      (post): RemotePost => ({
        slug: post.slug,
        remoteUrl: post.imageUrl,
      }),
    );

  const uniqueSlugs = new Set<string>();
  for (const post of posts) {
    if (uniqueSlugs.has(post.slug)) {
      throw new Error(`Slug duplicato nei post blog: ${post.slug}`);
    }
    uniqueSlugs.add(post.slug);
  }

  return posts;
}

async function downloadImage(post: RemotePost) {
  const response = await fetch(post.remoteUrl, {
    headers: {
      "user-agent": "FrantoioDelPasquaBlogImageSync/1.0",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`Download fallito per ${post.slug}: ${response.status} ${response.statusText}`);
  }

  const ext = inferExtension(post.remoteUrl, response.headers.get("content-type"));
  const filename = `${post.slug}${ext}`;
  const absolutePath = path.join(publicBlogDir, filename);
  const buffer = Buffer.from(await response.arrayBuffer());

  fs.writeFileSync(absolutePath, buffer);

  return {
    slug: post.slug,
    remoteUrl: post.remoteUrl,
    localUrl: `/blog/${filename}`,
    absolutePath,
  };
}

function rewriteSourceFile(filePath: string, replacementsBySlug: Map<string, string>) {
  const raw = fs.readFileSync(filePath, "utf8");
  const lines = raw.split(/\r?\n/);
  let activeSlug: string | null = null;
  let changed = false;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const slugMatch = line.match(/\bslug:\s*"([^"]+)"/);
    if (slugMatch) {
      activeSlug = replacementsBySlug.has(slugMatch[1]) ? slugMatch[1] : null;
    }

    if (activeSlug && /\bimageUrl:\s*"/.test(line)) {
      const localUrl = replacementsBySlug.get(activeSlug);
      if (!localUrl) {
        activeSlug = null;
        continue;
      }

      const updatedLine = line.replace(/imageUrl:\s*"([^"]+)"/, `imageUrl: "${localUrl}"`);
      if (updatedLine !== line) {
        lines[index] = updatedLine;
        changed = true;
      }
      activeSlug = null;
      continue;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, `${lines.join("\n")}\n`, "utf8");
  }

  return changed;
}

async function main() {
  ensureDir(publicBlogDir);

  const posts = downloadNeededPosts();
  const replacementsBySlug = new Map<string, string>();
  const failures: Array<{ slug: string; remoteUrl: string; error: string }> = [];
  const fallbacksUsed: Array<{ slug: string; localUrl: string }> = [];
  let downloaded = 0;

  for (const post of posts) {
    const existingFile = fs
      .readdirSync(publicBlogDir)
      .find((name) => name.startsWith(`${post.slug}.`));

    if (existingFile) {
      replacementsBySlug.set(post.slug, `/blog/${existingFile}`);
      continue;
    }

    try {
      const result = await downloadImage(post);
      replacementsBySlug.set(post.slug, result.localUrl);
      downloaded += 1;
      console.log(`saved ${result.localUrl} <- ${post.remoteUrl}`);
    } catch (error) {
      const fallbackUrl = fallbackImageBySlug[post.slug];
      const fallbackAbsPath = fallbackUrl
        ? path.join(root, "public", fallbackUrl.replace(/^\//, ""))
        : "";

      if (fallbackUrl && fs.existsSync(fallbackAbsPath)) {
        replacementsBySlug.set(post.slug, fallbackUrl);
        fallbacksUsed.push({ slug: post.slug, localUrl: fallbackUrl });
        console.warn(`fallback ${post.slug} -> ${fallbackUrl}`);
        continue;
      }

      failures.push({
        slug: post.slug,
        remoteUrl: post.remoteUrl,
        error: error instanceof Error ? error.message : String(error),
      });
      console.warn(`failed ${post.slug} <- ${post.remoteUrl}`);
    }
  }

  let rewrittenFiles = 0;
  for (const filePath of sourceFiles) {
    if (rewriteSourceFile(filePath, replacementsBySlug)) {
      rewrittenFiles += 1;
      console.log(`updated ${path.relative(root, filePath)}`);
    }
  }

  console.log("");
  console.log(`remote images processed: ${posts.length}`);
  console.log(`new files downloaded: ${downloaded}`);
  console.log(`source files updated: ${rewrittenFiles}`);
  console.log(`fallbacks used: ${fallbacksUsed.length}`);

  if (failures.length > 0) {
    console.log(`failed downloads: ${failures.length}`);
    for (const failure of failures) {
      console.log(`- ${failure.slug}: ${failure.error}`);
    }
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
