"use client";

import React, { useState } from "react";
import Link from "next/link";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "message" && value.length > 180) return; // limit to 180 chars
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.phone || !formData.interest || !formData.message) {
      alert("Please fill in all required fields.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_name: "Homepage Quick Inquiry",
          page_url: typeof window !== "undefined" ? window.location.href : "/",
          fields: {
            first_name: formData.firstName,
            email: formData.email,
            phone: formData.phone,
            interest: formData.interest,
            message: formData.message,
          },
        }),
      });
    } catch (err) {
      // Fallback
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        firstName: "",
        email: "",
        phone: "",
        interest: "",
        message: "",
      });
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full py-24 px-6 md:px-12 lg:px-24 overflow-hidden border-t border-accent/15 bg-fixed bg-cover bg-center bg-no-repeat min-h-screen flex items-center justify-center z-10"
      style={{
        backgroundImage: "url('/images/wp-assets/contact-bg.webp')",
      }}
    >
      {/* Transparent Dark Primary Color Overlay */}
      <div className="absolute inset-0 bg-[#0e3b2e]/85 md:bg-[#0e3b2e]/90 z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Text Column: Responsive alignment and paragraph sizing */}
          <div className="lg:col-span-7 flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-6 text-secondary">
            
            <div className="flex flex-col items-center lg:items-start space-y-2">
              <span className="text-xs md:text-sm font-semibold tracking-[0.3em] text-accent uppercase">
                Reach us
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-white tracking-tight leading-tight max-w-xl">
                Official Communications & Inquiries
              </h2>
            </div>

            {/* Desktop Paragraph (Sized for wider screens) */}
            <p className="hidden md:block text-lg text-secondary/80 font-light leading-relaxed max-w-2xl">
              Explorer Academy operates on principles of structure, discipline, and intentional
              progression. Whether you are inquiring about our flagship equipment, seeking qualification
              for an upcoming expedition, or requesting corporate placement, all official communications
              are processed here. Please ensure your inquiry is clear and specific. We review all
              submissions carefully and will respond with the appropriate institutional guidance.
            </p>

            {/* Mobile Paragraph (Shorter version for cleaner mobile view) */}
            <p className="block md:hidden text-base text-secondary/85 font-light leading-relaxed max-w-md">
              Rooted in disciplined progression, Explorer Academy processes all official equipment,
              expedition, and corporate inquiries here. Submit precise requests for appropriate
              institutional guidance.
            </p>

            {/* Contact Details with gold SVG icons */}
            <div className="w-full max-w-md pt-4 flex flex-col items-center lg:items-start space-y-4">
              
              {/* WhatsApp Row */}
              <div className="flex flex-col lg:flex-row items-center gap-3 w-full justify-center lg:justify-start">
                <svg
                  className="w-6 h-6 text-accent flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  href="https://wa.me/436641645360"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base md:text-lg text-white hover:text-accent font-serif tracking-wide transition-colors duration-300"
                >
                  WhatsApp: +43 664 164 53 60
                </a>
              </div>

              {/* Horizontal Separator - Centered on mobile, aligned left on desktop */}
              <div className="w-48 lg:w-full h-[1px] bg-white/20 my-2" />

              {/* Email Row */}
              <div className="flex flex-col lg:flex-row items-center gap-3 w-full justify-center lg:justify-start">
                <svg
                  className="w-6 h-6 text-accent flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:contact@janfranko.com"
                  className="text-base md:text-lg text-white hover:text-accent font-serif tracking-wide transition-colors duration-300"
                >
                  Email: contact@janfranko.com
                </a>
              </div>

            </div>
          </div>

          {/* Right Column: Form Card with design details matching screenshots */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end w-full">
            <div className="bg-white text-primary rounded-2xl p-6 md:p-8 shadow-2xl w-full max-w-[550px] border border-white/10 select-text">
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
                  <div className="w-16 h-16 bg-[#0e3b2e]/10 text-primary rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-primary">Inquiry Sent</h3>
                  <p className="text-sm text-primary/75 max-w-xs font-light">
                    Thank you for reaching out. We have received your inquiry and our team will get back to you shortly.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="text-xs text-[#0e3b2e] hover:underline font-medium pt-4"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Name and Email side-by-side on desktop */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-xs font-semibold text-primary mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-800 transition-all duration-300"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-primary mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-800 transition-all duration-300"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {/* Phone Row */}
                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold text-primary mb-1">
                      Phone / WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-800 transition-all duration-300"
                      placeholder="+1 234 567 890"
                    />
                  </div>

                  {/* Interest Area Dropdown */}
                  <div>
                    <label htmlFor="interest" className="block text-xs font-semibold text-primary mb-1">
                      Interest <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="interest"
                      name="interest"
                      required
                      value={formData.interest}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-700 transition-all duration-300"
                    >
                      <option value="" disabled>Area of Interest</option>
                      <option value="Bespoke Custom Bow Build">Bespoke Custom Bow Build</option>
                      <option value="Field Archery Workshops & Training">Field Archery Workshops &amp; Training</option>
                      <option value="Wilderness Archery Expeditions">Wilderness Archery Expeditions</option>
                      <option value="Corporate & Group Events">Corporate &amp; Group Events</option>
                      <option value="Professional Cooperation & Media">Professional Cooperation &amp; Media</option>
                    </select>
                  </div>

                  {/* Message Textarea with character counter */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor="message" className="block text-xs font-semibold text-primary">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <span className="text-xs text-gray-400 font-light select-none">
                        {formData.message.length} / 180
                      </span>
                    </div>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary h-32 resize-none text-gray-800 transition-all duration-300"
                      placeholder="Tell us briefly about your interest, experience level, or expedition inquiry."
                    />
                  </div>

                  {/* Privacy Policy Consent Checkbox */}
                  <div className="flex items-start gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="home-privacy-consent"
                      required
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#0e3b2e] focus:ring-1 focus:ring-[#0e3b2e] cursor-pointer shrink-0"
                    />
                    <label htmlFor="home-privacy-consent" className="text-[11px] text-gray-600 font-light leading-snug cursor-pointer select-none">
                      I agree to the processing of my personal data in accordance with the{" "}
                      <Link href="/privacy-policy" target="_blank" className="text-[#0e3b2e] underline font-semibold hover:text-accent transition-colors">
                        Privacy Policy
                      </Link>
                      . *
                    </label>
                  </div>

                  {/* Helper Text */}
                  <p className="text-[11px] text-gray-500 leading-normal font-light">
                    We usually respond within 24–48 hours. Please briefly describe your experience level or expedition interest.
                  </p>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#0e3b2e] hover:bg-[#071f18] text-white font-serif tracking-widest text-sm uppercase py-3.5 px-6 rounded-lg transition-all duration-300 shadow-md font-semibold disabled:opacity-75 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      "Send Inquiry"
                    )}
                  </button>



                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
