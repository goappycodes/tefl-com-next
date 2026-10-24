#!/usr/bin/env node
/**
 * Post-deploy cache warmer.
 *
 * Nothing is prerendered at build (≈1,050 paths × 7 geo folders), so the first
 * visitor to each URL would pay the WordPress render. This primes the ISR cache:
 * it asks WordPress for every public path (tefl/v1/routes) and requests each one
 * from the Next deployment, a few at a time so the origin isn't hammered.
 *
 *   node scripts/warm-cache.mjs https://next.teflinstitute.com            # US paths
 *   node scripts/warm-cache.mjs https://next.teflinstitute.com --all      # + every geo folder
 *   node scripts/warm-cache.mjs https://next.teflinstitute.com --type=page,course
 *
 * Env: NEXT_PUBLIC_WP_ORIGIN (default https://teflinstitute.com), WARM_CONCURRENCY (default 4).
 */
const base = (process.argv[2] || "").replace(/\/$/, "");
if (!/^https?:\/\//.test(base)) {
  console.error("Usage: node scripts/warm-cache.mjs <next-base-url> [--all] [--type=page,post]");
  process.exit(1);
}
const all = process.argv.includes("--all");
const typeArg = process.argv.find((a) => a.startsWith("--type="));
const wp = (process.env.NEXT_PUBLIC_WP_ORIGIN || "https://teflinstitute.com").replace(/\/$/, "");
const concurrency = Number(process.env.WARM_CONCURRENCY || 4);
const UA = "Mozilla/5.0 (compatible; tefl-com-next-warmer)";

const q = typeArg ? `?type=${encodeURIComponent(typeArg.slice(7))}` : "";
const res = await fetch(`${wp}/wp-json/tefl/v1/routes${q}`, { headers: { "User-Agent": UA } });
if (!res.ok) {
  console.error(`routes endpoint failed: HTTP ${res.status}`);
  process.exit(1);
}
const { routes, countries } = await res.json();
const paths = routes.map((r) => r.path);
const targets = all ? paths.flatMap((p) => [p, ...countries.map((cc) => `/${cc}${p}`)]) : paths;

console.log(`Warming ${targets.length} URLs on ${base} (concurrency ${concurrency})…`);
let done = 0;
let failed = 0;
const started = Date.now();

async function worker(queue) {
  for (let p = queue.shift(); p !== undefined; p = queue.shift()) {
    try {
      const r = await fetch(base + p, { headers: { "User-Agent": UA }, redirect: "manual" });
      if (r.status >= 500) {
        failed++;
        console.warn(`  ${r.status} ${p}`);
      }
      await r.arrayBuffer();
    } catch (e) {
      failed++;
      console.warn(`  ERR ${p} ${e.message}`);
    }
    if (++done % 50 === 0) console.log(`  ${done}/${targets.length}`);
  }
}

const queue = [...targets];
await Promise.all(Array.from({ length: concurrency }, () => worker(queue)));
console.log(`Done: ${done} URLs, ${failed} failed, ${Math.round((Date.now() - started) / 1000)}s.`);
