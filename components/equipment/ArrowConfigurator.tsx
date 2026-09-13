"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { SITE } from "@/data/site";

type Option = { value: string; label: string; price?: number; weight?: number };

const BOW_TYPES: Option[] = [
  { value: "asiatic", label: "Asiatic Bow" },
  { value: "recurve", label: "Recurve Bow" },
  { value: "longbow", label: "Longbow" },
  { value: "horsebow", label: "Horsebow" },
];
const DRAW_WEIGHTS = [
  "20–25 lbs",
  "25–30 lbs",
  "30–35 lbs",
  "35–40 lbs",
  "40–45 lbs",
  "45–50 lbs",
  "50–55 lbs",
  "55–60 lbs",
  "60–65 lbs",
  "65–70 lbs",
];
const PURPOSES = [
  "Beginner Training",
  "Youth Training",
  "Target Shooting",
  "3D Archery",
  "Historical Archery",
  "Mounted Archery",
];
const TRADITIONS = [
  "Medieval Longbow Arrow",
  "Warbow Arrow",
  "Mongolian Arrow",
  "Steppe Horse Archery Arrow",
  "Ottoman Target Arrow",
  "Turkish Flight Arrow",
  "Turkish War Arrow",
  "Korean Traditional Arrow",
  "Japanese Kyudo Arrow",
  "Native American Traditional Arrow",
  "Primitive Survival Arrow",
];
const SHAFTS: Option[] = [
  { value: "spruce", label: "Spruce — light and fast", price: 16, weight: 220 },
  { value: "douglas-fir", label: "Douglas Fir — strong and durable", price: 15, weight: 210 },
  { value: "cedar", label: "Cedar — classic smooth flight", price: 18, weight: 230 },
  { value: "pine", label: "Pine — beginner and youth training", price: 13, weight: 200 },
  { value: "bamboo", label: "Bamboo — natural flexible shaft", price: 11, weight: 180 },
  { value: "carbon", label: "Carbon — consistent modern performance", price: 19, weight: 165 },
];
const CUTS: Option[] = [
  { value: "shield", label: "Shield" },
  { value: "parabolic", label: "Parabolic" },
  { value: "legolas", label: "Legolas", price: 0.5 },
  { value: "shark", label: "Shark", price: 0.5 },
  { value: "banana", label: "Banana", price: 0.5 },
  { value: "super-speed", label: "Super Speed", price: 0.5 },
  { value: "indian", label: "Indian", price: 0.5 },
];
const FEATHER_LENGTHS: Option[] = [
  { value: "2", label: '2"', weight: 6 },
  { value: "3", label: '3"', weight: 8 },
  { value: "4", label: '4"', weight: 10 },
  { value: "5", label: '5" (+€0.50)', price: 0.5, weight: 12 },
  { value: "6", label: '6" (+€1.00)', price: 1, weight: 15 },
];
const COLORS = [
  "White",
  "Black",
  "Brown",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Orange",
  "Purple",
  "Violet",
  "Natural Barred",
  "Neon Green",
  "Fluor. Yellow",
  "Fluor. Orange",
  "Turquoise",
  "Pink",
  "Dark Blue",
];
const POINTS: Option[] = Array.from({ length: 13 }, (_, index) => {
  const grains = 80 + index * 10;
  return { value: String(grains), label: `${grains} grains` };
});
const ARROWHEADS: Option[] = [
  { value: "field", label: "Field Point — training and target" },
  { value: "blunt", label: "Blunt Tip (+€1.00)", price: 1 },
  { value: "whistle", label: "Whistle Point (+€2.50)", price: 2.5 },
  { value: "bodkin", label: "Bodkin Head (hand forged, up to +€8.00)", price: 8 },
  { value: "medieval-war", label: "Medieval War Head (hand forged, up to +€12.00)", price: 12 },
  { value: "forked", label: "Forked Head (hand forged, up to +€15.00)", price: 15 },
];
const CRESTING: Option[] = [
  { value: "none", label: "None" },
  { value: "single", label: "Single Ring (+€1.00)", price: 1 },
  { value: "double", label: "Double Ring (+€1.50)", price: 1.5 },
  { value: "steppe", label: "Traditional Steppe (+€2.50)", price: 2.5 },
  { value: "medieval", label: "Medieval Style (+€2.00)", price: 2 },
];
const BINDING: Option[] = [
  { value: "none", label: "None" },
  { value: "silk", label: "Traditional Silk Binding (+€2.00)", price: 2 },
];
const NOCKS: Option[] = [
  { value: "standard", label: "Standard Nock", weight: 5 },
  { value: "self", label: "Self Nock (+€0.50)", price: 0.5, weight: 6 },
  { value: "horn", label: "Horn Reinforced Nock (+€1.50)", price: 1.5, weight: 8 },
  { value: "lighted", label: "Lighted Nock (+€3.00)", price: 3, weight: 10 },
];

const INITIAL = {
  bow_type: "",
  draw_weight: "",
  draw_length: "",
  shooting_style: "",
  purpose: "",
  tradition: "",
  shaft: "",
  arrow_length: "",
  custom_length: "",
  spine: "",
  fletching_style: "traditional",
  fletching_cut: "",
  feather_length: "",
  hen_color: "",
  cock_color: "",
  feather_1_color: "",
  feather_2_color: "",
  feather_3_color: "",
  orientation: "",
  point_weight: "120",
  arrowhead: "",
  cresting: "none",
  binding: "none",
  nock: "",
  quantity: "6",
};

const findOption = (options: Option[], value: string) => options.find((option) => option.value === value);

export default function ArrowConfigurator() {
  const [config, setConfig] = useState(INITIAL);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const figures = useMemo(() => {
    const shaft = findOption(SHAFTS, config.shaft);
    const cut = findOption(CUTS, config.fletching_cut);
    const feather = findOption(FEATHER_LENGTHS, config.feather_length);
    const head = findOption(ARROWHEADS, config.arrowhead);
    const cresting = findOption(CRESTING, config.cresting);
    const binding = findOption(BINDING, config.binding);
    const nock = findOption(NOCKS, config.nock);
    const unit = [shaft?.price, cut?.price, feather?.price, head?.price, cresting?.price, binding?.price, nock?.price].reduce<number>(
      (sum, value) => sum + (value || 0),
      0
    );
    const weight =
      shaft?.weight && feather?.weight && nock?.weight
        ? shaft.weight + Number(config.point_weight) + feather.weight * 3 + nock.weight
        : null;
    return { unit, total: unit * Number(config.quantity), weight };
  }, [config]);

  function update(name: keyof typeof INITIAL, value: string) {
    setConfig((current) => ({ ...current, [name]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");
    const form = event.currentTarget;
    const formDataObj = Object.fromEntries(new FormData(form).entries());

    const rawFields = {
      ...formDataObj,
      ...config,
      estimated_unit_price_eur: figures.unit.toFixed(2),
      estimated_total_eur: figures.total.toFixed(2),
      estimated_weight_grains: figures.weight ? String(figures.weight) : "Pending",
    };

    // Human-readable summary for WordPress form submission entries
    const specSummaryParts = [
      `Bow Type: ${config.bow_type || "N/A"}`,
      `Draw Weight: ${config.draw_weight || "N/A"}`,
      `Draw Length: ${config.draw_length || "N/A"}"`,
      `Shooting Style: ${config.shooting_style || "N/A"}`,
      `Purpose: ${config.purpose || "N/A"}`,
      `Tradition: ${config.tradition || "N/A"}`,
      `Shaft: ${config.shaft || "N/A"}`,
      `Arrow Length: ${config.arrow_length === "custom" ? config.custom_length + '"' : config.arrow_length + '"'}`,
      `Spine: ${config.spine || "N/A"}`,
      `Fletching Cut: ${config.fletching_cut || "N/A"} (${config.feather_length}")`,
      `Point Weight: ${config.point_weight} gr`,
      `Arrowhead: ${config.arrowhead || "N/A"}`,
      `Nock: ${config.nock || "N/A"}`,
      `Quantity: ${config.quantity} arrows`,
      `Unit Price: €${figures.unit.toFixed(2)}`,
      `Estimated Total: €${figures.total.toFixed(2)}`,
    ];

    const fields = {
      ...rawFields,
      specifications_summary: specSummaryParts.join(" | "),
    };

    try {
      const response = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_name: "Custom Arrow Builder Request",
          fields,
          page_url: window.location.href,
        }),
      });
      const payload = await response.json().catch(() => ({
        success: false,
        message: "The server returned an unreadable response.",
      }));
      if (!response.ok || !payload.success) {
        throw new Error(payload.message || "Delivery could not be confirmed.");
      }
      setStatus("success");
      setMessage(payload.message || "Your custom arrow specification has been recorded and submitted for review.");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : `Delivery could not be confirmed. Please email ${SITE.email}.`
      );
    }
  }

  const inputClass =
    "min-h-12 w-full rounded-xl border border-[#0e3b2e]/15 bg-white px-4 text-sm outline-none focus:border-[#7d603a] focus:ring-2 focus:ring-[#c5a880]/35 text-[#0e3b2e]";
  const fieldsetClass = "rounded-3xl border border-[#0e3b2e]/10 bg-white p-5 shadow-sm sm:p-8";
  const labelClass = "grid gap-2 text-xs font-bold text-[#0e3b2e]/75";

  return (
    <main id="main-content" className="min-h-screen bg-[#f0e9d9] text-[#0e3b2e]">
      <header className="bg-[#0e3b2e] px-5 py-14 text-white sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#c5a880]">Arrows &amp; Shafts</p>
          <h1 className="mt-3 font-serif text-4xl font-bold sm:text-6xl">Custom Arrow Configurator</h1>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-white/75 sm:text-base">
            Configure every field from the Jan Franko arrow builder. The submitted specification is reviewed before an order is confirmed, because safe spine and length selection depends on the complete bow and archer setup.
          </p>
        </div>
      </header>

      <form onSubmit={submit} className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-8">
        <div className="space-y-7">
          <fieldset className={fieldsetClass}>
            <legend className="px-2 font-serif text-3xl font-bold">1. Bow information</legend>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                Bow type *
                <select className={inputClass} value={config.bow_type} onChange={(e) => update("bow_type", e.target.value)} required>
                  <option value="">Select bow type</option>
                  {BOW_TYPES.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Draw weight *
                <select className={inputClass} value={config.draw_weight} onChange={(e) => update("draw_weight", e.target.value)} required>
                  <option value="">Select draw weight</option>
                  {DRAW_WEIGHTS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Draw length *
                <select className={inputClass} value={config.draw_length} onChange={(e) => update("draw_length", e.target.value)} required>
                  <option value="">Select draw length</option>
                  {[26, 27, 28, 29, 30, 31, 32, 33].map((o) => (
                    <option key={o} value={String(o)}>
                      {o}&quot;
                    </option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Shooting style *
                <select className={inputClass} value={config.shooting_style} onChange={(e) => update("shooting_style", e.target.value)} required>
                  <option value="">Select shooting style</option>
                  <option>Mediterranean</option>
                  <option>Thumb Draw</option>
                </select>
              </label>
            </div>
          </fieldset>

          <fieldset className={fieldsetClass}>
            <legend className="px-2 font-serif text-3xl font-bold">2. Arrow core</legend>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                Arrow purpose *
                <select className={inputClass} value={config.purpose} onChange={(e) => update("purpose", e.target.value)} required>
                  <option value="">Select purpose</option>
                  {PURPOSES.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Arrow type / tradition{["Historical Archery", "Mounted Archery"].includes(config.purpose) ? " *" : ""}
                <select
                  className={inputClass}
                  value={config.tradition}
                  onChange={(e) => update("tradition", e.target.value)}
                  required={["Historical Archery", "Mounted Archery"].includes(config.purpose)}
                >
                  <option value="">Not applicable / select tradition</option>
                  {TRADITIONS.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Shaft material *
                <select className={inputClass} value={config.shaft} onChange={(e) => update("shaft", e.target.value)} required>
                  <option value="">Select shaft</option>
                  {SHAFTS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label} — €{o.price?.toFixed(2)}/arrow
                    </option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Arrow length *
                <select className={inputClass} value={config.arrow_length} onChange={(e) => update("arrow_length", e.target.value)} required>
                  <option value="">Select length</option>
                  {[29, 30, 31, 32].map((o) => (
                    <option key={o} value={String(o)}>
                      {o}&quot;
                    </option>
                  ))}
                  <option value="custom">Custom length</option>
                </select>
              </label>
              {config.arrow_length === "custom" && (
                <label className={labelClass}>
                  Custom length (inches) *
                  <input
                    className={inputClass}
                    type="number"
                    min="20"
                    max="40"
                    step="0.25"
                    value={config.custom_length}
                    onChange={(e) => update("custom_length", e.target.value)}
                    required
                  />
                </label>
              )}
              <label className={labelClass}>
                Spine *
                <select className={inputClass} value={config.spine} onChange={(e) => update("spine", e.target.value)} required>
                  <option value="">Select spine</option>
                  {[350, 400, 500, 600, 700, 800].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>
            </div>
            <p className="mt-5 rounded-xl bg-amber-50 p-4 text-xs leading-relaxed text-amber-950/75">
              <strong>Bamboo note:</strong> natural structure means its spine cannot be matched as precisely as selected wooden shafts. Spruce, cedar, or Douglas fir is recommended for competition-level precision. Every submitted spine remains subject to final review.
            </p>
          </fieldset>

          <fieldset className={fieldsetClass}>
            <legend className="px-2 font-serif text-3xl font-bold">3. Fletching</legend>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                Fletching style *
                <select className={inputClass} value={config.fletching_style} onChange={(e) => update("fletching_style", e.target.value)} required>
                  <option value="traditional">Traditional (2 Hen + 1 Cock)</option>
                  <option value="custom">Custom (3 Different Colors)</option>
                </select>
              </label>
              <label className={labelClass}>
                Fletching cut *
                <select className={inputClass} value={config.fletching_cut} onChange={(e) => update("fletching_cut", e.target.value)} required>
                  <option value="">Select cut</option>
                  {CUTS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                      {o.price ? ` (+€${o.price.toFixed(2)})` : ""}
                    </option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Feather length *
                <select className={inputClass} value={config.feather_length} onChange={(e) => update("feather_length", e.target.value)} required>
                  <option value="">Select feather length</option>
                  {FEATHER_LENGTHS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Feather orientation *
                <select className={inputClass} value={config.orientation} onChange={(e) => update("orientation", e.target.value)} required>
                  <option value="">Select orientation</option>
                  <option>Right Wing — most common</option>
                  <option>Left Wing — for left-handed</option>
                </select>
              </label>
              {config.fletching_style === "traditional" ? (
                <>
                  <label className={labelClass}>
                    Hen feather color ×2 *
                    <select className={inputClass} value={config.hen_color} onChange={(e) => update("hen_color", e.target.value)} required>
                      <option value="">Select color</option>
                      {COLORS.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </label>
                  <label className={labelClass}>
                    Cock feather color ×1 *
                    <select className={inputClass} value={config.cock_color} onChange={(e) => update("cock_color", e.target.value)} required>
                      <option value="">Select color</option>
                      {COLORS.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </label>
                </>
              ) : (
                [1, 2, 3].map((number) => (
                  <label key={number} className={labelClass}>
                    Feather {number} color *
                    <select
                      className={inputClass}
                      value={config[`feather_${number}_color` as "feather_1_color"]}
                      onChange={(e) => update(`feather_${number}_color` as "feather_1_color", e.target.value)}
                      required
                    >
                      <option value="">Select color</option>
                      {COLORS.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </label>
                ))
              )}
            </div>
          </fieldset>

          <fieldset className={fieldsetClass}>
            <legend className="px-2 font-serif text-3xl font-bold">4. Finishing</legend>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                Point weight *
                <select className={inputClass} value={config.point_weight} onChange={(e) => update("point_weight", e.target.value)} required>
                  {POINTS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                      {o.value === "120" ? " (default)" : ""}
                    </option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Arrowhead type *
                <select className={inputClass} value={config.arrowhead} onChange={(e) => update("arrowhead", e.target.value)} required>
                  <option value="">Select arrowhead</option>
                  {ARROWHEADS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Cresting pattern *
                <select className={inputClass} value={config.cresting} onChange={(e) => update("cresting", e.target.value)} required>
                  {CRESTING.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Silk binding *
                <select className={inputClass} value={config.binding} onChange={(e) => update("binding", e.target.value)} required>
                  {BINDING.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Nock type *
                <select className={inputClass} value={config.nock} onChange={(e) => update("nock", e.target.value)} required>
                  <option value="">Select nock</option>
                  {NOCKS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className={labelClass}>
                Quantity *
                <select className={inputClass} value={config.quantity} onChange={(e) => update("quantity", e.target.value)} required>
                  {[6, 12, 24, 36].map((o) => (
                    <option key={o} value={o}>
                      {o} arrows
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </fieldset>

          <fieldset className={fieldsetClass}>
            <legend className="px-2 font-serif text-3xl font-bold">5. Contact &amp; delivery</legend>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <input type="hidden" name="form_name" value="Custom Arrow Builder Request" />
              <label className={labelClass}>
                Full name *<input name="full_name" className={inputClass} autoComplete="name" required />
              </label>
              <label className={labelClass}>
                Email *<input name="email" className={inputClass} type="email" autoComplete="email" required />
              </label>
              <label className={labelClass}>
                Phone<input name="phone" className={inputClass} type="tel" autoComplete="tel" />
              </label>
              <label className={labelClass}>
                Country *<input name="country" className={inputClass} autoComplete="country-name" required />
              </label>
              <label className={labelClass}>
                Street address<input name="street_address" className={inputClass} autoComplete="street-address" />
              </label>
              <label className={labelClass}>
                City<input name="city" className={inputClass} autoComplete="address-level2" />
              </label>
              <label className={labelClass}>
                State / region<input name="region" className={inputClass} autoComplete="address-level1" />
              </label>
              <label className={labelClass}>
                Postal code<input name="postal_code" className={inputClass} autoComplete="postal-code" />
              </label>
              <label className={`${labelClass} sm:col-span-2`}>
                Additional notes
                <textarea
                  name="notes"
                  className={`${inputClass} min-h-32 py-3`}
                  placeholder="Anything the Academy should know before follow-up"
                />
              </label>
              <label className="flex items-start gap-3 text-xs leading-relaxed text-[#0e3b2e]/70 sm:col-span-2">
                <input name="privacy_consent" value="yes" type="checkbox" required className="mt-0.5 h-4 w-4 accent-[#0e3b2e]" />
                <span>
                  I agree to be contacted by Jan Franko Academy regarding this custom arrow request and accept the{" "}
                  <Link href="/privacy-policy" className="font-bold underline">
                    Privacy Policy
                  </Link>
                  . *
                </span>
              </label>
              <div className="sm:col-span-2">
                <button
                  disabled={status === "sending"}
                  className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#0e3b2e] px-7 text-xs font-bold uppercase tracking-[0.15em] text-white disabled:opacity-60"
                >
                  {status === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
                  {status === "sending" ? "Sending…" : "Submit configuration for review"}
                </button>
                {status === "error" && (
                  <p className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-800" role="alert">
                    {message}
                  </p>
                )}
                {status === "success" && (
                  <p className="mt-4 flex gap-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800" role="status">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    {message}
                  </p>
                )}
              </div>
            </div>
          </fieldset>
        </div>

        <aside className="h-fit rounded-3xl bg-[#0e3b2e] p-6 text-white shadow-xl lg:sticky lg:top-28">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c5a880]">Your configuration</p>
          <svg className="mt-6 w-full" viewBox="0 0 700 72" role="img" aria-label="Simple arrow configuration preview">
            <rect x="12" y="33" width="10" height="6" rx="1" fill="#c5a880" />
            <polygon points="22,36 68,18 62,36" fill="#c5a880" opacity=".9" />
            <polygon points="22,36 68,54 62,36" fill="#f0e9d9" opacity=".8" />
            <line x1="62" y1="36" x2="638" y2="36" stroke="#c5a880" strokeWidth="4.5" strokeLinecap="round" />
            <polygon points="638,36 675,33 686,36 675,39" fill="#e5e7eb" />
          </svg>
          <dl className="mt-6 space-y-3 text-xs">
            {[
              ["Bow", BOW_TYPES.find((o) => o.value === config.bow_type)?.label],
              ["Purpose", config.purpose],
              ["Tradition", config.tradition],
              ["Shaft", SHAFTS.find((o) => o.value === config.shaft)?.label.split(" — ")[0]],
              [
                "Length",
                config.arrow_length === "custom"
                  ? `${config.custom_length || "—"}"`
                  : config.arrow_length
                  ? `${config.arrow_length}"`
                  : "",
              ],
              ["Spine", config.spine],
              ["Fletching", CUTS.find((o) => o.value === config.fletching_cut)?.label],
              ["Point", config.point_weight ? `${config.point_weight} gr` : ""],
              ["Quantity", `${config.quantity} arrows`],
            ].map(([key, value]) => (
              <div key={key} className="flex justify-between gap-4 border-b border-white/10 pb-3">
                <dt className="text-white/55">{key}</dt>
                <dd className="text-right font-semibold">{value || "—"}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 rounded-2xl bg-white/10 p-5">
            <div className="flex justify-between">
              <span className="text-sm text-white/65">Estimated per arrow</span>
              <strong className="font-serif text-2xl">€{figures.unit.toFixed(2)}</strong>
            </div>
            <div className="mt-3 flex justify-between">
              <span className="text-sm text-white/65">Estimated total</span>
              <strong className="font-serif text-2xl">€{figures.total.toFixed(2)}</strong>
            </div>
            <div className="mt-3 flex justify-between">
              <span className="text-sm text-white/65">Estimated weight</span>
              <strong>{figures.weight ? `~${figures.weight} gr` : "—"}</strong>
            </div>
          </div>
          <div className="mt-5 space-y-2 text-[11px] leading-relaxed text-white/60">
            <p>Lead time: 2–4 weeks from order confirmation.</p>
            <p>Minimum order: 6 arrows per configuration.</p>
            <p>Spine tolerance: ±5 of the selected value.</p>
            <p>Flu-Flu arrows are available as a separate product.</p>
          </div>
          <p className="mt-5 flex gap-2 border-t border-white/10 pt-5 text-xs leading-relaxed text-white/70">
            <ShieldCheck className="h-5 w-5 shrink-0 text-[#c5a880]" />
            Prices and weight are estimates from the builder. Submission is a review request, not payment or automatic order confirmation.
          </p>
        </aside>
      </form>
    </main>
  );
}
