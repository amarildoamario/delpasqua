import assert from "node:assert/strict";
import test from "node:test";
import { getSeoAliasRedirect } from "./seoRouteAliases";
import { routing } from "@/i18n/routing";

test("middleware leaves hreflang to metadata and keeps explicit URL language", () => {
  assert.equal(routing.alternateLinks, false);
  assert.equal(routing.localeDetection, false);
});

test("Search Console mixed-language product URLs recover the requested locale", () => {
  assert.equal(getSeoAliasRedirect("/de/laden/medium-fruity/"), "/de/laden/mittel-fruchtig/");
  assert.equal(getSeoAliasRedirect("/fr/boutique/vino-vittoria/"), "/fr/boutique/vin-vittoria/");
  assert.equal(getSeoAliasRedirect("/no/butikk/intens-fruitige-extra-vierge-olijfolie-blik/"), "/no/butikk/intens-fruktig-extra-virgin-olivenolje-kanne/");
});

test("Search Console mixed-language blog URLs recover translated category and slug", () => {
  assert.equal(getSeoAliasRedirect("/en/blog/category/conservazione/quanto-dura-olio-evo/"), "/en/blog/category/storage-preservation/how-long-does-extra-virgin-olive-oil-last-storage/");
});

test("mixed-language category URLs recover the requested language", () => {
  assert.equal(getSeoAliasRedirect("/blog/categoria/recettes-et-accords/"), "/blog/categoria/ricette-e-abbinamenti/");
});

test("canonical URLs, unknown content, feeds and assets are not redirected", () => {
  for (const path of ["/shop/fruttato-medio/", "/de/laden/mittel-fruchtig/", "/en/shop/medium-fruity/", "/shop/unknown/", "/_next/static/test.js", "/comments/feed/", "/wp-json/wc/store/v1/cart/"]) {
    assert.equal(getSeoAliasRedirect(path), null, path);
  }
});
