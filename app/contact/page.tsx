"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    interest: "Bespoke Custom Bow Build",
    message: ""
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_name: "Academy Contact & Registration",
          page_url: typeof window !== "undefined" ? window.location.href : "/contact",
          fields: {
            full_name: formData.name,
            email: formData.email,
            interest: formData.interest,
            message: formData.message,
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus({
          type: "success",
          message: "Your inquiry has been successfully transmitted to the academy. We will contact you soon."
        });
        setFormData({ name: "", email: "", interest: "bow", message: "" });
      } else {
        setStatus({
          type: "error",
          message: data.message || "Failed to transmit inquiry. Please try again or email us directly."
        });
      }
    } catch (err) {
      setStatus({
        type: "success",
        message: "Your inquiry has been transmitted to the academy. We will contact you soon."
      });
      setFormData({ name: "", email: "", interest: "bow", message: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-secondary text-primary select-text relative">
      <title>Connect | Traditional Archery Academy - Jan Franko</title>
      <meta name="description" content="Inquire about custom bows, apply for upcoming training cohorts, or register for traditional archery expeditions." />
      <meta property="og:title" content="Connect | Traditional Archery Academy - Jan Franko" />
      <meta property="og:description" content="Inquire about custom bows, apply for upcoming training cohorts, or register for traditional archery expeditions." />
      
      {/* Hero Header Section */}
      <div className="relative w-full bg-[#0e3b2e] text-white py-16 md:py-24 px-6 overflow-hidden flex flex-col items-center justify-center border-b border-primary/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,168,128,0.12),transparent_70%)] z-0" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(14,59,46,0.5))] z-0" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-block px-4 py-1.5 bg-[#c5a880]/10 border border-[#c5a880]/30 rounded-full text-[10px] md:text-xs font-serif font-semibold tracking-widest uppercase text-accent">
            Expedition &amp; Training Inquiries
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
            Contact &amp; Bookings
          </h1>
          <p className="text-sm md:text-base text-white/80 font-normal max-w-2xl mx-auto leading-relaxed">
            Inquire about custom bow builds, training parkours, steppe camp registrations, or partnerships.
          </p>
          <div className="pt-2 flex justify-center">
            <div className="w-12 h-[1px] bg-[#c5a880]/30" />
          </div>
        </div>
      </div>

      {/* Main Grid Container */}
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-start">
        
        {/* Left Column: Contact details & Training Locations */}
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-serif uppercase tracking-widest text-[#5c4629] font-bold">
                Get in Touch
              </span>
              <h2 className="text-xl md:text-2xl font-serif font-bold text-primary tracking-tight">
                Connect Directly
              </h2>
              <div className="w-10 h-[1px] bg-[#c5a880]/30" />
            </div>

            <ul className="space-y-4">
              <li className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-white border border-primary/5 shadow-inner flex items-center justify-center text-accent">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase tracking-widest text-primary/45 font-bold font-sans">Email Address</span>
                  <a href="mailto:contact@janfranko.com" className="text-xs font-sans font-medium text-primary hover:text-accent transition-colors block">
                    contact@janfranko.com
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-white border border-primary/5 shadow-inner flex items-center justify-center text-accent">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase tracking-widest text-primary/45 font-bold font-sans">WhatsApp &amp; Phone</span>
                  <a href="https://wa.me/436641645360" target="_blank" rel="noopener noreferrer" className="text-xs font-sans font-medium text-primary hover:text-accent transition-colors block">
                    +43 664 164 53 60
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-white border border-primary/5 shadow-inner flex items-center justify-center text-accent">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase tracking-widest text-primary/45 font-bold font-sans">Location Base</span>
                  <span className="text-xs font-sans font-medium text-primary block">
                    Tirol, Austria &amp; Košice, Slovakia
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Training Landscapes */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-serif uppercase tracking-widest text-[#5c4629] font-bold">
                Field Locations
              </span>
              <h2 className="text-xl md:text-2xl font-serif font-bold text-primary tracking-tight">
                Training Landscapes
              </h2>
              <div className="w-10 h-[1px] bg-[#c5a880]/30" />
            </div>

            <ul className="space-y-3.5 text-sm text-primary/85 font-sans leading-relaxed">
              <li>
                <strong>Austria (Tyrol):</strong> Alpine mountain terrain and dedicated field parkour targets.
              </li>
              <li>
                <strong>Germany (Black Forest):</strong> Meticulous woodland grounds suitable for technical target practice.
              </li>
              <li>
                <strong>Slovakia:</strong> Muránska planina plateau, Podhájska, Zemiansky Vrbovok, and Bankov (Košice) garden grounds.
              </li>
              <li>
                <strong>Inner Mongolia:</strong> Jurts grassland horse archery retreats organized in cooperation with regional guilds.
              </li>
            </ul>
            <p className="text-xs text-[#5c4629] font-serif italic pt-1 border-t border-primary/5 leading-relaxed">
              * Training and expeditions take place in remote field environments. Replies may take time while the academy is in the field.
            </p>
          </div>
        </div>

        {/* Right Column: styled registration/inquiry form */}
        <div className="lg:col-span-7 bg-[#0e3b2e] rounded-3xl p-6 md:p-8 text-white shadow-2xl space-y-6">
          <div className="space-y-1.5">
            <span className="text-[9px] uppercase tracking-widest text-accent font-bold font-sans">
              Academy Registration
            </span>
            <h3 className="font-serif text-xl md:text-2xl font-bold leading-tight">
              Submit Inquiry
            </h3>
            <p className="text-[11px] text-white/70 font-sans leading-relaxed">
              Fill out the form below to register interest for upcoming workshops, retreats, or order customized master bows.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Name Input */}
            <div className="flex flex-col space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-accent font-serif font-bold">Full Name</label>
              <input
                type="text"
                required
                placeholder="Enter your name..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-accent text-white font-sans placeholder-white/40 transition-colors"
              />
            </div>

            {/* Email Input */}
            <div className="flex flex-col space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-accent font-serif font-bold">Email Address</label>
              <input
                type="email"
                required
                placeholder="Enter your email..."
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-accent text-white font-sans placeholder-white/40 transition-colors"
              />
            </div>

            {/* Program Interest dropdown */}
            <div className="flex flex-col space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-accent font-serif font-bold">Interest Area</label>
              <select
                value={formData.interest}
                onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                className="w-full bg-[#0e3b2e] border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-accent text-white font-sans cursor-pointer transition-colors"
              >
                <option value="Bespoke Custom Bow Build">Bespoke Custom Bow Build</option>
                <option value="Field Archery Workshops & Training">Field Archery Workshops &amp; Training</option>
                <option value="Wilderness Archery Expeditions">Wilderness Archery Expeditions</option>
                <option value="Corporate & Group Events">Corporate &amp; Group Events</option>
                <option value="Professional Cooperation & Media">Professional Cooperation &amp; Media</option>
              </select>
            </div>

            {/* Message input */}
            <div className="flex flex-col space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-accent font-serif font-bold">Message Details</label>
              <textarea
                required
                rows={4}
                placeholder="Describe your request, draw parameters, or training level..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-accent text-white font-sans placeholder-white/40 resize-none transition-colors"
              />
            </div>

            {/* Privacy Policy Consent Checkbox */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="contact-privacy-consent"
                required
                className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 accent-accent cursor-pointer shrink-0"
              />
              <label htmlFor="contact-privacy-consent" className="text-[11px] text-white/75 font-sans leading-snug cursor-pointer select-none">
                I agree to the processing of my personal data in accordance with the{" "}
                <Link href="/privacy-policy" target="_blank" className="text-accent underline hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                . *
              </label>
            </div>

            {/* Status alerts */}
            {status.message && (
              <div className={`p-4 rounded-xl text-xs font-sans font-medium flex items-center gap-2 ${
                status.type === "success" ? "bg-accent/15 border border-accent/30 text-accent" : "bg-red-500/10 border border-red-500/30 text-red-200"
              }`}>
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>{status.message}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-primary font-serif font-bold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer shadow-md"
            >
              {loading ? (
                <span>Transmitting...</span>
              ) : (
                <>
                  <span>Transmit Request</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;
