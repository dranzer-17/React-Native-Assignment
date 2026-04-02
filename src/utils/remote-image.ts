/**
 * Many logo CDNs block default RN user agents; Figma-style remote logos need a browser-like UA.
 */
const BROWSER_USER_AGENT =
  "Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";

export function remoteImageWithHeaders(uri: string): {
  uri: string;
  headers: Record<string, string>;
} {
  return { uri, headers: { "User-Agent": BROWSER_USER_AGENT } };
}
