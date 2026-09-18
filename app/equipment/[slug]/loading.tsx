import React from "react";

export default function EquipmentDetailLoading() {
  return (
    <div className="w-full min-h-screen bg-secondary text-primary select-text relative pb-24 animate-pulse">
      {/* Back link skeleton */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 pb-4">
        <div className="w-40 h-4 bg-primary/10 rounded-full" />
      </div>

      {/* Main product detail section skeleton */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4 items-start">
        {/* Left Column: Image & Thumbnails */}
        <div className="lg:col-span-6 space-y-6">
          <div className="w-full aspect-[4/3] bg-primary/10 rounded-3xl" />
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="w-20 h-20 bg-primary/10 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Right Column: Title, Excerpt, Form Trigger & Specs */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="w-32 h-4 bg-primary/10 rounded-full" />
            <div className="w-80 h-10 bg-primary/10 rounded-2xl" />
            <div className="w-full h-16 bg-primary/10 rounded-2xl" />
          </div>

          <div className="w-full h-14 bg-primary/10 rounded-2xl" />

          <div className="space-y-4 pt-4 border-t border-primary/10">
            <div className="w-44 h-6 bg-primary/10 rounded-full" />
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="w-full h-10 bg-primary/10 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
