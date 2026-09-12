import React from "react";
import Link from "next/link";
import { ArrowLeft, Compass, Mail, ShieldAlert } from "lucide-react";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "404 — Path Not Found | Jan Franko Traditional Archery",
  description: "The requested path or page could not be located. Return to the main range or explore our traditional archery programs.",
});

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-20 bg-[#f0e9d9] text-[#0e3b2e]">
      <div className="max-w-2xl w-full text-center space-y-8 bg-[#e6ddc5]/50 border border-[#1a4a38]/15 rounded-2xl p-8 md:p-12 shadow-xl backdrop-blur-sm">
        
        {/* Visual Badge */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#1a4a38]/10 text-[#1a4a38] border border-[#1a4a38]/20 mb-2">
          <ShieldAlert className="w-10 h-10 stroke-[1.5]" />
        </div>

        {/* Header */}
        <div className="space-y-3">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#b2823b] bg-[#b2823b]/10 px-3 py-1 rounded-full border border-[#b2823b]/20">
            Error 404
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-[#0e3b2e]">
            Path Not Found
          </h1>
          <p className="text-[#1a4a38]/80 text-base md:text-lg italic max-w-lg mx-auto font-serif">
            &ldquo;Even the most disciplined arrow occasionally strays off target into uncharted woods.&rdquo;
          </p>
        </div>

        <p className="text-sm md:text-base text-[#1a4a38]/90 max-w-md mx-auto leading-relaxed">
          The page or route you were attempting to access has moved, been renamed, or does not exist on this range.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0e3b2e] text-[#f0e9d9] hover:bg-[#1a4a38] transition-colors rounded-lg font-medium text-sm border border-[#0e3b2e]"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Main Range
          </Link>
          
          <Link
            href="/programs"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent text-[#0e3b2e] hover:bg-[#0e3b2e]/10 transition-colors rounded-lg font-medium text-sm border border-[#0e3b2e]/30"
          >
            <Compass className="w-4 h-4 text-[#b2823b]" />
            Explore Programs
          </Link>

          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent text-[#0e3b2e] hover:bg-[#0e3b2e]/10 transition-colors rounded-lg font-medium text-sm border border-[#0e3b2e]/30"
          >
            <Mail className="w-4 h-4 text-[#b2823b]" />
            Contact Jan
          </Link>
        </div>

      </div>
    </div>
  );
}
