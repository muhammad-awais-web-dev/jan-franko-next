"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { SITE } from "@/data/site";

type CommissionFormProps = { bowyer?: string; heading?: string };
type SubmissionState = "idle" | "sending" | "success" | "error";

export default function CommissionForm({ bowyer = "No preference yet", heading = "Request a bow consultation" }: CommissionFormProps) {
  const [state, setState] = useState<SubmissionState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    setMessage("");
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/forms/equipment-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields, page_url: window.location.href }),
      });
      const result = await response.json().catch(() => ({ success: false, message: "The server returned an unreadable response." }));
      if (!response.ok || !result.success) throw new Error(result.message || "Delivery could not be confirmed.");
      setState("success");
      setMessage(result.message || "Your consultation request has been delivered.");
      form.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : `Delivery could not be confirmed. Please email ${SITE.email}.`);
    }
  }

  const inputClass = "min-h-12 w-full rounded-xl border border-[#0e3b2e]/15 bg-white px-4 text-sm text-[#0e3b2e] outline-none transition focus:border-[#0e3b2e] focus:ring-2 focus:ring-[#c5a880]/40";

  return (
    <section id="commission" className="rounded-3xl bg-[#0e3b2e] p-6 text-white shadow-xl sm:p-10">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c5a880]">Direct commission pathway</p>
      <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">{heading}</h2>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/75">
        This form starts a consultation; it does not place an automatic order or charge a card. After the bowyer confirms feasibility and a written quote is accepted, the normal commission structure is a minimum 50% deposit, with the remaining 50% plus shipping due after completion and before dispatch.
      </p>
      {state === "success" ? (
        <div className="mt-8 rounded-2xl border border-emerald-300/30 bg-emerald-950/30 p-6" role="status">
          <CheckCircle2 className="h-7 w-7 text-emerald-300" />
          <p className="mt-3 font-semibold">{message}</p>
          <p className="mt-2 text-sm text-white/70">A written specification and quote must still be confirmed before any payment is due.</p>
          <button type="button" onClick={() => setState("idle")} className="mt-5 min-h-11 rounded-full border border-white/25 px-5 text-xs font-bold uppercase tracking-wider">Send another request</button>
        </div>
      ) : (
        <form className="mt-8 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <input type="hidden" name="form_name" value="Master Bowyer Commission Request" />
          <input type="hidden" name="bowyer" value={bowyer} />
          <label className="grid gap-2 text-xs font-semibold">Full name *<input className={inputClass} name="full_name" autoComplete="name" required /></label>
          <label className="grid gap-2 text-xs font-semibold">Email *<input className={inputClass} name="email" type="email" autoComplete="email" required /></label>
          <label className="grid gap-2 text-xs font-semibold">Phone / WhatsApp<input className={inputClass} name="phone" type="tel" autoComplete="tel" /></label>
          <label className="grid gap-2 text-xs font-semibold">Country<input className={inputClass} name="country" autoComplete="country-name" /></label>
          <label className="grid gap-2 text-xs font-semibold">Dominant hand<select className={inputClass} name="dominant_hand" defaultValue=""><option value="" disabled>Select</option><option>Right</option><option>Left</option><option>Not sure</option></select></label>
          <label className="grid gap-2 text-xs font-semibold">Intended use<select className={inputClass} name="intended_use" defaultValue=""><option value="" disabled>Select</option><option>Target archery</option><option>3D archery</option><option>Historical practice</option><option>Mounted archery</option><option>Hunting where lawful</option><option>Collector commission</option><option>Not sure</option></select></label>
          <label className="grid gap-2 text-xs font-semibold">Draw length<input className={inputClass} name="draw_length" placeholder="e.g. 29 in / not measured" /></label>
          <label className="grid gap-2 text-xs font-semibold">Preferred draw weight<input className={inputClass} name="draw_weight" placeholder="e.g. 35 lb / need advice" /></label>
          <label className="grid gap-2 text-xs font-semibold">Budget range<input className={inputClass} name="budget" placeholder="Currency and range" /></label>
          <label className="grid gap-2 text-xs font-semibold">Preferred timeframe<input className={inputClass} name="timeframe" placeholder="No promise is made at this stage" /></label>
          <label className="grid gap-2 text-xs font-semibold sm:col-span-2">What would you like commissioned? *<textarea className={`${inputClass} min-h-32 py-3`} name="message" required placeholder="Model or bow tradition, experience level, dimensions, materials, and any other requirements." /></label>
          <label className="flex items-start gap-3 text-xs leading-relaxed text-white/75 sm:col-span-2"><input className="mt-1 h-4 w-4 accent-[#c5a880]" type="checkbox" name="privacy_consent" value="yes" required /><span>I agree that my details may be used to answer this commission request, as described in the Privacy Policy. *</span></label>
          <div className="sm:col-span-2">
            <button disabled={state === "sending"} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#c5a880] px-7 text-xs font-bold uppercase tracking-[0.15em] text-[#0e3b2e] disabled:cursor-wait disabled:opacity-60">{state === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}{state === "sending" ? "Sending…" : "Send consultation request"}</button>
            <p className="mt-3 text-xs text-white/60">If delivery cannot be confirmed, email <a className="underline" href={`mailto:${SITE.email}`}>{SITE.email}</a>.</p>
          </div>
          {state === "error" && <p className="rounded-xl border border-red-300/30 bg-red-950/30 p-4 text-sm text-red-100 sm:col-span-2" role="alert">{message}</p>}
        </form>
      )}
    </section>
  );
}
