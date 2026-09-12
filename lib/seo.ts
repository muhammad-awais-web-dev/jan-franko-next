import type { Metadata } from "next";

export const SITE_NAME = "Jan Franko - Traditional Archery";
export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jan-franko-next.vercel.app";

/**
 * Truncate title under 60 characters (max 57 chars + '...')
 */
export function truncateTitle(title: string, maxLen = 57): string {
  if (!title) return "";
  const cleaned = title.trim();
  if (cleaned.length <= maxLen) return cleaned;
  return cleaned.substring(0, maxLen).trim() + "...";
}

/**
 * Truncate description under 160 characters (max 152 chars + '...')
 */
export function truncateDescription(desc: string, maxLen = 152): string {
  if (!desc) return "";
  const plainText = desc.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  if (plainText.length <= maxLen) return plainText;
  return plainText.substring(0, maxLen).trim() + "...";
}

export const SUPPORTED_LANGUAGES: Record<string, string> = {
  en: "en",
  de: "de",
  sk: "sk",
  cs: "cs",
  es: "es",
  ru: "ru",
  fr: "fr",
  it: "it",
  ja: "ja",
  pl: "pl",
  uk: "uk",
  hu: "hu",
  ro: "ro",
  bg: "bg",
  el: "el",
  hy: "hy",
  ka: "ka",
  et: "et",
  lv: "lv",
  lt: "lt",
  pt: "pt",
  mn: "mn",
  ko: "ko",
  "zh-CN": "zh-CN",
  th: "th",
  vi: "vi",
  tl: "tl",
  am: "am",
  dz: "dz",
  no: "no",
  sv: "sv",
  fi: "fi",
  da: "da",
  is: "is",
};

/**
 * Construct standardized SEO, OpenGraph metadata object, and hreflang alternates
 */
export function constructMetadata({
  title,
  description,
  ogImage,
  canonicalUrl,
  type = "website",
}: {
  title: string;
  description: string;
  ogImage?: string;
  canonicalUrl?: string;
  type?: "website" | "article";
}): Metadata {
  const formattedTitle = truncateTitle(title);
  const formattedDescription = truncateDescription(description);
  const imageUrl = ogImage || "/opengraph-image";
  const url = canonicalUrl || BASE_URL;

  // Build 34-language hreflang alternates dictionary
  const languageAlternates: Record<string, string> = {
    "x-default": url,
  };
  Object.keys(SUPPORTED_LANGUAGES).forEach((lang) => {
    languageAlternates[lang] = `${url}#googtrans(en|${lang})`;
  });

  return {
    metadataBase: new URL(BASE_URL),
    title: formattedTitle,
    description: formattedDescription,
    alternates: {
      canonical: url,
      languages: languageAlternates,
    },
    openGraph: {
      siteName: SITE_NAME,
      title: formattedTitle,
      description: formattedDescription,
      url,
      type,
      locale: "en_US",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: formattedTitle,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: formattedTitle,
      description: formattedDescription,
      images: [imageUrl],
    },
  };
}
