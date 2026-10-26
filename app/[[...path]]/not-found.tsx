import NotFound404 from "@/components/pages/notfound/NotFound404";
import type { NotFoundData } from "@/components/pages/notfound/types";
import WpPage from "@/components/WpPage";
import WpShell from "@/components/WpShell";
import { getNativeData } from "@/lib/native/data";
import { getNotFoundPage, type RenderedPage } from "@/lib/render";
import { splitShell } from "@/lib/shell";

/** The path getNotFoundPage() renders (one that can never exist). */
const NOT_FOUND_PATH = "/tefl-next-404-page/";

/**
 * 404 — WordPress' own 404 page (theme header/footer + its "not found" content)
 * so a missing URL looks exactly as on live. The layout above it had no page
 * payload, so WpScripts applies the 404 body class + title on mount.
 *
 * The content is the native port of the theme's 404.php
 * (components/pages/notfound/, endpoint native/error404.php) inside the
 * page's WordPress shell; the passthrough render is the fallback.
 */
export default async function NotFound() {
  const page = await getNotFoundPage();
  if (!page) {
    return (
      <main style={{ padding: "6rem 1rem", textAlign: "center", fontFamily: "sans-serif" }}>
        <h1>Page not found</h1>
        <p>
          <a href="/">Back to the homepage</a>
        </p>
      </main>
    );
  }
  const native = await nativeNotFound(page);
  if (native) return native;
  return <WpPage page={page} />;
}

async function nativeNotFound(page: RenderedPage) {
  if (!new Set(page.body_class.split(/\s+/)).has("error404")) return null;
  const shell = splitShell(page.body);
  if (!shell) return null;
  let data: NotFoundData | null = null;
  try {
    data = await getNativeData<NotFoundData>("error404", page, NOT_FOUND_PATH, "__404");
  } catch {
    return null;
  }
  if (!data) return null;
  return (
    <WpShell page={page} shell={shell}>
      <NotFound404 data={data} />
    </WpShell>
  );
}
