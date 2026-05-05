export const config = { runtime: "edge" };

// Explicit allowlist — prevents this endpoint from being used as an open proxy (SSRF)
const ALLOWED = new Set([
  "https://vivirenelpoblado.com/espacio-7-para-lo-cultural-y-social/",
  "https://vivirenelpoblado.com/cancha-renovada-con-talento-en-garabato/",
]);

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url).searchParams.get("url") ?? "";

  if (!ALLOWED.has(url)) {
    return new Response("Forbidden", { status: 403 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
    });
  } catch {
    return new Response("Failed to reach article", { status: 502 });
  }

  if (!upstream.ok) {
    return new Response(`Upstream error ${upstream.status}`, { status: 502 });
  }

  const html = await upstream.text();

  // Inject <base> so relative asset URLs resolve against the real site
  const origin = new URL(url).origin;
  const withBase = html.replace(/<head[^>]*>/i, (m) => `${m}<base href="${origin}/">`);

  return new Response(withBase, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // Cache for 5 minutes — articles don't change frequently
      "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
