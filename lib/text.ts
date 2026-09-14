export function decodeHtmlEntities(raw: string | undefined | null): string {
  if (!raw) return "";
  return raw
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(Number(dec)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#038;/g, "&")
    .replace(/\bMr\.\s*Bows\b/gi, "MR Bows");
}

export const cleanTitle = decodeHtmlEntities;
