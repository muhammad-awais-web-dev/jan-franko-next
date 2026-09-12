export const CONSENT_STORAGE_KEY = "jf_consent_v2";

export type ConsentPreferences = {
  version: 2;
  essential: true;
  functional: boolean;
  analytics: false;
  marketing: false;
  updatedAt: string;
};

export function createConsent(functional: boolean): ConsentPreferences {
  return {
    version: 2,
    essential: true,
    functional,
    analytics: false,
    marketing: false,
    updatedAt: new Date().toISOString(),
  };
}

export function readConsent(): ConsentPreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(CONSENT_STORAGE_KEY) || "null") as Partial<ConsentPreferences> | null;
    if (!parsed || parsed.version !== 2) return null;
    return {
      version: 2,
      essential: true,
      functional: parsed.functional === true,
      analytics: false,
      marketing: false,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function storeConsent(preferences: ConsentPreferences) {
  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(preferences));
  window.dispatchEvent(new CustomEvent("jf:consent-changed", { detail: preferences }));
}
