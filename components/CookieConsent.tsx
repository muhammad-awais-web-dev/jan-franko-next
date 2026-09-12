"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, Cookie, Settings2, ShieldCheck, X } from "lucide-react";
import { createConsent, readConsent, storeConsent } from "@/lib/consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [functional, setFunctional] = useState(false);
  const [buzzFunctional, setBuzzFunctional] = useState(false);

  useEffect(() => {
    const saved = readConsent();
    if (saved) {
      setFunctional(saved.functional);
    } else {
      setVisible(true);
    }

    const openPreferences = (e?: Event) => {
      const customEvent = e as CustomEvent<{ highlightFunctional?: boolean }> | undefined;
      const current = readConsent();
      setFunctional(current?.functional ?? false);
      setVisible(true);
      setPreferencesOpen(true);

      if (customEvent?.detail?.highlightFunctional) {
        setBuzzFunctional(true);
        setTimeout(() => {
          setBuzzFunctional(false);
        }, 3000);
      }
    };

    window.addEventListener("jf:open-consent", openPreferences);
    return () => window.removeEventListener("jf:open-consent", openPreferences);
  }, []);

  const save = (allowFunctional: boolean) => {
    storeConsent(createConsent(allowFunctional));
    setFunctional(allowFunctional);
    setVisible(false);
    setPreferencesOpen(false);
    setBuzzFunctional(false);
  };

  if (!visible) return null;

  // Render centered modal dialog when preferences/settings are open
  if (preferencesOpen) {
    return (
      <div
        className="notranslate fixed inset-0 z-[100] flex items-center justify-center bg-[#051713]/60 backdrop-blur-sm p-4 sm:p-6"
        translate="no"
        role="presentation"
      >
        <section
          className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#c5a880]/35 bg-[#0e3b2e] p-6 text-white shadow-2xl sm:p-8 scrollbar-thin scrollbar-thumb-white/20"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-settings-title"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#c5a880]/30 bg-[#c5a880]/15 text-[#c5a880]">
                <Cookie className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 id="cookie-settings-title" className="font-serif text-xl font-bold">Privacy & Cookie Settings</h2>
                <p className="mt-1 text-xs leading-relaxed text-white/75">
                  Essential storage is always active for security and core operation. You can manage optional functional translation and third-party services below.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => save(false)}
              className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white"
              aria-label="Close and reject optional cookies"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 space-y-3" aria-label="Cookie categories">
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div>
                <p className="text-sm font-bold">Essential Storage</p>
                <p className="mt-1 text-[11px] leading-relaxed text-white/65">Stores your privacy choices and enables core site security and form submissions.</p>
              </div>
              <span className="rounded-full bg-[#c5a880]/20 px-3 py-1 text-[10px] font-bold uppercase text-[#c5a880]">Always on</span>
            </div>

            <label
              className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border p-4 transition-all duration-300 ${
                buzzFunctional
                  ? "animate-buzz border-[#c5a880] bg-[#c5a880]/20 ring-4 ring-[#c5a880]/60 shadow-[0_0_30px_rgba(197,168,128,0.7)]"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              <div>
                <span className="text-sm font-bold flex items-center gap-2">
                  Functional Translation
                  {buzzFunctional && (
                    <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-[#c5a880] text-[#0e3b2e] animate-pulse">
                      Enable this to translate page
                    </span>
                  )}
                </span>
                <p className="mt-1 text-[11px] leading-relaxed text-white/65">Loads Google Translate only after permission. Google may set language-related cookies.</p>
              </div>
              <input
                type="checkbox"
                checked={functional}
                onChange={(e) => setFunctional(e.target.checked)}
                className="h-5 w-5 accent-[#c5a880] cursor-pointer shrink-0"
              />
            </label>

            <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 opacity-75">
              <div>
                <p className="text-sm font-bold">Analytics</p>
                <p className="mt-1 text-[11px] leading-relaxed text-white/65">No analytics or tracking platforms are installed.</p>
              </div>
              <span className="rounded-full border border-white/15 px-3 py-1 text-[10px] font-bold uppercase text-white/60">Not in use</span>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 opacity-75">
              <div>
                <p className="text-sm font-bold">Marketing</p>
                <p className="mt-1 text-[11px] leading-relaxed text-white/65">No advertising pixels or cross-site marketing trackers are used.</p>
              </div>
              <span className="rounded-full border border-white/15 px-3 py-1 text-[10px] font-bold uppercase text-white/60">Not in use</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => save(false)}
              className="min-h-11 rounded-xl border border-white/20 px-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10"
            >
              Reject optional
            </button>
            <button
              type="button"
              onClick={() => save(functional)}
              className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#c5a880] px-4 text-xs font-bold uppercase tracking-wider text-[#0e3b2e] hover:bg-[#d4ba95]"
            >
              <ShieldCheck className="h-4 w-4" />
              Save choices
            </button>
          </div>

          <p className="mt-4 text-[10px] leading-relaxed text-white/55">
            You can reopen these choices anytime from &quot;Cookie settings&quot; in the footer. Read our{" "}
            <Link href="/privacy-policy" className="text-[#c5a880] underline hover:text-white">
              Privacy Policy
            </Link>{" "}
            for full details.
          </p>
        </section>
      </div>
    );
  }

  // Render non-intrusive banner fixed in the bottom-left corner
  return (
    <div
      className="notranslate fixed bottom-4 left-4 z-[100] max-w-md w-[calc(100%-2rem)] sm:w-auto"
      translate="no"
    >
      <section
        className="rounded-2xl border border-[#c5a880]/35 bg-[#0e3b2e] p-5 text-white shadow-2xl"
        role="region"
        aria-label="Cookie consent banner"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#c5a880]/30 bg-[#c5a880]/15 text-[#c5a880]">
              <Cookie className="h-4 w-4" aria-hidden="true" />
            </span>
            <h3 className="font-serif text-sm font-bold text-white">Cookie &amp; Privacy Notice</h3>
          </div>
          <button
            type="button"
            onClick={() => save(false)}
            className="rounded-full p-1 text-white/60 hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <p className="mt-2 text-xs leading-relaxed text-white/80">
          We use essential storage for security. Translation services load only if permitted. No analytics or marketing trackers are active.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => save(true)}
            className="flex min-h-9 items-center gap-1.5 rounded-lg bg-[#c5a880] px-3 text-xs font-bold uppercase tracking-wider text-[#0e3b2e] hover:bg-[#d4ba95]"
          >
            <Check className="h-3.5 w-3.5" />
            Allow functional
          </button>
          <button
            type="button"
            onClick={() => save(false)}
            className="min-h-9 rounded-lg border border-white/20 px-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => setPreferencesOpen(true)}
            className="flex min-h-9 items-center gap-1 rounded-lg border border-white/20 px-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10"
          >
            <Settings2 className="h-3.5 w-3.5" />
            Settings
          </button>
        </div>
      </section>
    </div>
  );
}
