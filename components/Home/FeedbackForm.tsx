"use client";

import { useState } from "react";
import Link from "next/link";

const initialForm = {
  firstImpression: "",
  websitePurpose: "",
  likedMost: "",
  confusing: "",
  improve: "",
  email: "",
};

export default function FeedbackForm() {
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setMessage("");
    try {
      const response = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_name: "Help Us Improve the Academy",
          page_url: typeof window !== "undefined" ? window.location.href : "",
          fields: {
            first_impression: form.firstImpression,
            website_mainly_about: form.websitePurpose,
            liked_most: form.likedMost,
            confusing_or_unclear: form.confusing,
            suggested_improvement: form.improve,
            email_for_discount_code: form.email || "Not provided",
          },
        }),
      });
      const payload = (await response.json().catch(() => null)) as { success?: boolean; message?: string } | null;
      if (!response.ok || !payload?.success) throw new Error(payload?.message || "Delivery could not be confirmed.");
      setForm(initialForm);
      setState("sent");
      setMessage(form.email ? "Thank you. Your feedback was delivered; the Academy will send the discount code to the email you provided." : "Thank you. Your feedback was delivered.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Delivery could not be confirmed. Please try again.");
    }
  }

  const fieldClass = "mt-2 min-h-11 w-full rounded-xl border border-[#0e3b2e]/15 bg-white px-4 py-3 text-sm text-[#0e3b2e] outline-none focus:border-[#7d603a] focus:ring-2 focus:ring-[#7d603a]/20";

  return (
    <section className="w-full bg-[#f0e9d9] px-5 py-20 text-[#0e3b2e] sm:px-8" aria-labelledby="feedback-title">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7d603a]">Two-minute survey</p>
          <h2 id="feedback-title" className="mt-3 font-serif text-4xl font-bold">Help Us Improve the Academy</h2>
          <p className="mt-5 text-sm leading-7 text-[#0e3b2e]/75">The Traditional Archery Academy website has just launched and we are continuously improving it. If you take 2 minutes to share your honest feedback, we will send you a 10% discount code for your first bow from the Academy Series. Your feedback helps us improve the academy for future archers.</p>
          <p className="mt-4 text-xs leading-relaxed text-[#0e3b2e]/60">An email address is optional and is only needed if you want to receive the code. See the <Link href="/privacy-policy" className="font-semibold underline">Privacy Policy</Link>.</p>
        </div>

        <form onSubmit={submit} className="rounded-3xl border border-[#0e3b2e]/10 bg-white p-5 shadow-sm sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-xs font-bold">What was your first impression? *
              <select required value={form.firstImpression} onChange={(event) => setForm({ ...form, firstImpression: event.target.value })} className={fieldClass}>
                <option value="">Select one</option><option>Excellent</option><option>Good</option><option>Neutral</option><option>Needs improvement</option>
              </select>
            </label>
            <label className="text-xs font-bold">What is this website mainly about? *
              <input required value={form.websitePurpose} onChange={(event) => setForm({ ...form, websitePurpose: event.target.value })} className={fieldClass} />
            </label>
            <label className="text-xs font-bold">What did you like most? *
              <textarea required rows={4} value={form.likedMost} onChange={(event) => setForm({ ...form, likedMost: event.target.value })} className={fieldClass} />
            </label>
            <label className="text-xs font-bold">Was anything confusing or unclear? *
              <textarea required rows={4} value={form.confusing} onChange={(event) => setForm({ ...form, confusing: event.target.value })} className={fieldClass} />
            </label>
          </div>
          <label className="mt-5 block text-xs font-bold">What would you improve? *
            <textarea required rows={4} value={form.improve} onChange={(event) => setForm({ ...form, improve: event.target.value })} className={fieldClass} />
          </label>
          <label className="mt-5 block text-xs font-bold">Email (optional, to receive your 10% code)
            <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className={fieldClass} />
          </label>
          {message && <p role={state === "error" ? "alert" : "status"} className={`mt-5 rounded-xl p-3 text-xs ${state === "error" ? "bg-red-50 text-red-800" : "bg-emerald-50 text-emerald-800"}`}>{message}</p>}
          <button disabled={state === "sending"} className="mt-6 min-h-12 w-full rounded-xl bg-[#0e3b2e] px-6 text-xs font-bold uppercase tracking-[0.14em] text-white disabled:opacity-60">{state === "sending" ? "Submitting…" : "Submit feedback"}</button>
        </form>
      </div>
    </section>
  );
}
