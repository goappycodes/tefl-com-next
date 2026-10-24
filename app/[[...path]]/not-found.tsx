import WpPage from "@/components/WpPage";
import { getNotFoundPage } from "@/lib/render";

/**
 * 404 — WordPress' own 404 page (theme header/footer + its "not found" content)
 * so a missing URL looks exactly as on live. The layout above it had no page
 * payload, so WpScripts applies the 404 body class + title on mount.
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
  return <WpPage page={page} />;
}
