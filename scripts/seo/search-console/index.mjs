import { fileURLToPath, pathToFileURL } from "node:url";
import { readFileSync } from "node:fs";
import { parseArgs } from "node:util";
import dotenv from "dotenv";
import { GoogleAuth } from "google-auth-library";
import { auditIndexing } from "./indexing.mjs";

const DEFAULT_PROPERTY = "sc-domain:delpasqua.com";
const READONLY_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";
const googleAuth = new GoogleAuth({ scopes: [READONLY_SCOPE] });
const PROPERTIES_ENDPOINT = "https://www.googleapis.com/webmasters/v3/sites";
const INSPECTION_ENDPOINT = "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect";
const CRUX_ENDPOINT = "https://chromeuxreport.googleapis.com/v1/records:queryRecord";
const VITALS = ["largest_contentful_paint", "interaction_to_next_paint", "cumulative_layout_shift"];
const DEVICES = { mobile: "PHONE", desktop: "DESKTOP", tablet: "TABLET" };

const HELP = `npm run seo:search-console -- <comando>

  sites                                      Elenca le proprietà accessibili
  sitemaps                                   Elenca le sitemap inviate
  inspect <URL>                              Ispeziona lo stato nell'indice
  indexing [--limit 2000] [--offset 0]        Ispeziona gli URL delle sitemap pubbliche
  performance --from AAAA-MM-GG --to AAAA-MM-GG [--by page,query] [--device mobile] [--limit 1000]
  vitals [URL] [--device mobile]              Dati CrUX per URL; senza URL, dati dell'origine

Proprietà predefinita: ${DEFAULT_PROPERTY}. Configurazione in .env.search-console.local.`;

function webUrl(value) {
  const url = URL.parse(value);
  if (!url || !["http:", "https:"].includes(url.protocol) || url.username || url.password) {
    throw new Error("Fornisci un URL assoluto http o https.");
  }
  url.hash = "";
  return url;
}

function isDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) return false;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function performanceQuery(values) {
  const { from, to, by = "page", device, limit = "1000" } = values;
  if (!isDate(from) || !isDate(to) || from > to) {
    throw new Error("Imposta --from e --to con date valide AAAA-MM-GG in ordine cronologico.");
  }
  const dimensions = by.split(",");
  const allowed = ["date", "page", "query", "country", "device"];
  if (dimensions.some(dimension => !allowed.includes(dimension)) || new Set(dimensions).size !== dimensions.length) {
    throw new Error("--by accetta date,page,query,country,device senza duplicati.");
  }
  const rowLimit = Number(limit);
  if (!/^\d+$/.test(limit) || rowLimit < 1 || rowLimit > 25000) {
    throw new Error("--limit deve essere un intero tra 1 e 25000.");
  }
  const body = { startDate: from, endDate: to, dimensions, type: "web", dataState: "final", rowLimit };
  if (device) {
    body.dimensionFilterGroups = [{
      filters: [{ dimension: "device", operator: "equals", expression: device.toUpperCase() }],
    }];
  }
  return body;
}

export function buildRequest(args, property) {
  const [command, ...flags] = args;
  const { values, positionals } = parseArgs({
    args: flags,
    allowPositionals: command === "inspect" || command === "vitals",
    options: command === "performance" ? {
      from: { type: "string" },
      to: { type: "string" },
      by: { type: "string" },
      device: { type: "string" },
      limit: { type: "string" },
    } : command === "vitals" ? { device: { type: "string" } } : {},
  });
  const { device } = values;
  if (device !== undefined && !Object.hasOwn(DEVICES, device)) {
    throw new Error("--device deve essere mobile, desktop o tablet.");
  }

  const propertyEndpoint = `${PROPERTIES_ENDPOINT}/${encodeURIComponent(property)}`;
  switch (command) {
    case "sites":
      return { endpoint: PROPERTIES_ENDPOINT };
    case "sitemaps":
      return { endpoint: `${propertyEndpoint}/sitemaps` };
    case "inspect":
      if (positionals.length !== 1) throw new Error("Uso: inspect <URL>.");
      return {
        endpoint: INSPECTION_ENDPOINT,
        body: { inspectionUrl: webUrl(positionals[0]).href, siteUrl: property, languageCode: "it-IT" },
      };
    case "performance":
      return { endpoint: `${propertyEndpoint}/searchAnalytics/query`, body: performanceQuery(values) };
    case "vitals": {
      if (positionals.length > 1) throw new Error("Uso: vitals [URL] [--device mobile].");
      const target = positionals[0]
        ? { url: webUrl(positionals[0]).href }
        : { origin: webUrl(property.replace(/^sc-domain:/, "https://")).origin };
      return {
        service: "CrUX",
        endpoint: CRUX_ENDPOINT,
        body: { ...target, formFactor: DEVICES[device ?? "mobile"], metrics: VITALS },
      };
    }
    default:
      throw new Error("Comando sconosciuto. Usa --help per vedere i comandi.");
  }
}

async function fetchReport(request) {
  const { service = "Search Console", endpoint, body } = request;
  const url = new URL(endpoint);
  const headers = new Headers({ Accept: "application/json" });

  if (service === "CrUX") {
    const key = process.env.CRUX_API_KEY?.trim();
    if (!key) throw new Error("Configura CRUX_API_KEY in .env.search-console.local.");
    url.searchParams.set("key", key);
  } else {
    const authHeaders = await searchConsoleHeaders(url);
    authHeaders.forEach((value, name) => headers.set(name, value));
  }

  if (body) headers.set("Content-Type", "application/json");
  let response;
  try {
    response = await fetch(url, {
      method: body ? "POST" : "GET",
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    throw new Error(`Google ${service} non raggiungibile. Controlla la connessione e riprova.`);
  }
  const result = await response.json().catch(() => null);
  if (response.ok && result) return result;
  if (service === "CrUX" && response.status === 404 && result?.error?.status === "NOT_FOUND") {
    const { url, origin, formFactor } = body;
    return { status: "no_data", ...(url ? { url } : { origin }), formFactor };
  }
  const hint = response.status === 403 ? " Verifica che l’API sia abilitata e che le credenziali abbiano accesso." : "";
  const error = new Error(`Google ${service} ha restituito HTTP ${response.status}.${hint}`);
  error.status = response.status;
  throw error;
}

async function searchConsoleHeaders(url) {
  const tokenFile = process.env.SEARCH_CONSOLE_TOKEN_FILE?.trim();
  if (tokenFile) {
    let token;
    try {
      token = JSON.parse(readFileSync(tokenFile, "utf8"));
    } catch {
      throw Object.assign(new Error("Impossibile leggere il file del token temporaneo di Search Console."), { status: 401 });
    }
    if (!/^[-\w.]+$/.test(token?.accessToken ?? "") || !(Date.parse(token?.expireTime) > Date.now())) {
      throw Object.assign(new Error("Il token temporaneo di Search Console è scaduto oppure non è valido."), { status: 401 });
    }
    return new Headers({ Authorization: `Bearer ${token.accessToken}` });
  }

  try {
    const client = await googleAuth.getClient();
    return await client.getRequestHeaders(url);
  } catch {
    throw new Error("Autenticazione Google non disponibile. Controlla le credenziali locali nel README della cartella.");
  }
}

async function main(args) {
  if (!args.length || args.includes("--help")) {
    console.log(HELP);
    return;
  }
  const config = dotenv.config({
    path: fileURLToPath(new URL("../../../.env.search-console.local", import.meta.url)),
    quiet: true,
  });
  if (config.error && config.error.code !== "ENOENT") {
    throw new Error("Impossibile leggere .env.search-console.local.");
  }
  const property = process.env.SEARCH_CONSOLE_PROPERTY?.trim() || DEFAULT_PROPERTY;
  if (args[0] === "indexing") {
    const { values } = parseArgs({
      args: args.slice(1),
      options: { limit: { type: "string", default: "2000" }, offset: { type: "string", default: "0" } },
    });
    const limit = Number(values.limit);
    const offset = Number(values.offset);
    if (!/^\d+$/.test(values.limit) || limit < 1 || limit > 2000) {
      throw new Error("--limit deve essere un intero tra 1 e 2000.");
    }
    if (!/^\d+$/.test(values.offset) || !Number.isSafeInteger(offset)) {
      throw new Error("--offset deve essere un intero non negativo.");
    }
    const report = await auditIndexing({
      property, limit, offset,
      inspect: url => fetchReport(buildRequest(["inspect", url], property)),
    });
    console.log(JSON.stringify(report, null, 2));
    if (report.failed > 0) process.exitCode = 1;
    return;
  }
  const request = buildRequest(args, property);
  console.error(`Lettura da Google ${request.service ?? "Search Console"}…`);
  console.log(JSON.stringify(await fetchReport(request), null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
