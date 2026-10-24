import WpHead from "@/components/WpHead";
import { loadPage } from "@/lib/page-data";

/**
 * Root layout for every WordPress-rendered URL (all paths, all geo folders).
 *
 * It lives inside the catch-all segment — not at app/layout.tsx — so it gets
 * the route params and can server-render the exact <html lang="en-GB"> and
 * <body class="…page-template-…"> WordPress emits. The theme CSS keys a lot off
 * body classes (page templates, ast-* layout flags), so they must be present on
 * first paint, not patched in by script.
 *
 * Native React templates added later get their own root layout via a route
 * group, sharing WpHead / the theme asset loader.
 */
export default async function WpRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { path?: string[] };
}) {
  const data = await loadPage(params.path).catch(() => null);
  const page = data && data.ok ? data : null;

  return (
    <html lang={page?.lang ?? "en-US"} suppressHydrationWarning>
      <head>
        <WpHead page={page} />
      </head>
      <body className={page?.body_class} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
