/**
 * Allow-listed sanitizer for the contacts page map embed.
 *
 * Admins paste raw HTML from 2GIS / Google Maps / Yandex etc. We render
 * it via dangerouslySetInnerHTML, so a careless or compromised admin could
 * smuggle <script> or arbitrary attributes. This rewrites the embed to a
 * single <iframe> with only safe attributes, and rejects sources that are
 * not on the allow-list.
 */

const ALLOWED_HOST_RE = /^(?:[\w-]+\.)*(2gis\.kz|2gis\.com|2gis\.ru|google\.com|google\.[a-z]{2,3}|yandex\.[a-z]{2,3})$/i;

export function sanitizeIframe(html: string | null | undefined): string {
  if (!html) return "";
  const srcMatch = html.match(/src\s*=\s*["']([^"']+)["']/i);
  if (!srcMatch) return "";
  const src = srcMatch[1];

  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return "";
  }
  if (url.protocol !== "https:") return "";
  if (!ALLOWED_HOST_RE.test(url.hostname)) return "";

  const safeSrc = escapeAttr(url.toString());
  return `<iframe src="${safeSrc}" width="100%" height="400" loading="lazy" referrerpolicy="no-referrer-when-downgrade" style="border:0" title="Карта"></iframe>`;
}

function escapeAttr(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
