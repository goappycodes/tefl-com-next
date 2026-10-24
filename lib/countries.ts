/**
 * Geo folders.
 *
 * teflinstitute.com serves the US site at the root and one folder per market:
 * /gb/, /za/, /nl/, /ca/, /it/, /fr/. On WordPress each folder is a symlink to
 * the same install; wp-config picks `SEO_LANG` from the URL, which switches
 * WP_HOME, the <html lang>, hreflang links, per-country ACF copy
 * (`text_translations`, `page_title_<cc>` …) and Yoast titles. Prices are NOT
 * tied to the folder — WCPBC resolves them from the visitor's IP, client-side.
 *
 * Next reproduces the exact same URL structure: the catch-all route forwards
 * the full path (folder included) to `tefl/v1/render`, so a /gb/ URL renders
 * the GB variant, cached separately from the US one.
 */
export const COUNTRY_FOLDERS = ["gb", "za", "nl", "ca", "it", "fr"] as const;
export type CountryFolder = (typeof COUNTRY_FOLDERS)[number];

/** "/gb/course/x/" → { country: "gb", path: "/course/x/" }; un-prefixed → "us". */
export function splitCountry(path: string): { country: CountryFolder | "us"; path: string } {
  for (const cc of COUNTRY_FOLDERS) {
    if (path === `/${cc}` || path === `/${cc}/`) return { country: cc, path: "/" };
    if (path.startsWith(`/${cc}/`)) return { country: cc, path: path.slice(cc.length + 1) };
  }
  return { country: "us", path };
}

/** Every geo variant of a bare path: ["/x/", "/gb/x/", "/za/x/", …]. */
export function allCountryPaths(path: string): string[] {
  return [path, ...COUNTRY_FOLDERS.map((cc) => `/${cc}${path}`)];
}
