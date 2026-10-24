import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

/**
 * On-demand ISR endpoint. WordPress (wordpress/tefl-isr-revalidate.php) POSTs
 * here when content changes:
 *
 *   POST /api/revalidate/   X-Revalidate-Secret: <ISRSECRET>
 *   { "tags": ["p:/course/x/", "p:/gb/course/x/", …, "listing"] }
 *
 * Manual / curl:  GET /api/revalidate/?secret=<ISRSECRET>&tag=pages
 *
 * Tags: p:<path> (one page in one geo folder), listing (pages that list other
 * content), pages (everything rendered from WordPress).
 */
function authorised(req: NextRequest): boolean {
  const secret = req.headers.get("x-revalidate-secret") ?? req.nextUrl.searchParams.get("secret");
  return !!process.env.ISRSECRET && secret === process.env.ISRSECRET;
}

function revalidate(tags: string[]) {
  const unique = Array.from(new Set(tags.map((t) => t.trim()).filter(Boolean))).slice(0, 200);
  for (const tag of unique) revalidateTag(tag);
  return NextResponse.json({ ok: true, revalidated: unique, now: Date.now() });
}

export async function POST(req: NextRequest) {
  if (!authorised(req)) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  let tags: string[] = [];
  try {
    const body = (await req.json()) as { tags?: unknown; tag?: unknown };
    if (Array.isArray(body.tags)) tags = body.tags.map(String);
    else if (typeof body.tag === "string") tags = [body.tag];
  } catch {
    /* fall back to the query string */
  }
  if (!tags.length) tags = (req.nextUrl.searchParams.get("tag") ?? "").split(",");
  if (!tags.filter(Boolean).length) return NextResponse.json({ ok: false, error: "no tags" }, { status: 400 });
  return revalidate(tags);
}

export async function GET(req: NextRequest) {
  if (!authorised(req)) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  const tags = (req.nextUrl.searchParams.get("tag") ?? "").split(",");
  if (!tags.filter(Boolean).length) return NextResponse.json({ ok: false, error: "no tags" }, { status: 400 });
  return revalidate(tags);
}
