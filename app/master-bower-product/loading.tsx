import React from "react";

export default function MasterBowyerProductLoading() {
  return (
    <div className="w-full min-h-screen bg-secondary text-primary select-text relative pb-24 animate-pulse">
      {/* Top Header Skeleton */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8">
        <div className="w-36 h-4 bg-primary/10 rounded-full" />
      </div>

      {/* Product Detail Main Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="w-full aspect-[4/3] bg-primary/10 rounded-3xl" />
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="w-20 h-20 bg-primary/10 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Right Column: Details & Specs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <div className="w-28 h-4 bg-primary/10 rounded-md" />
            <div className="w-72 h-10 bg-primary/10 rounded-2xl" />
            <div className="w-48 h-5 bg-primary/10 rounded-md" />
          </div>

          <div className="w-full h-[1px] bg-primary/10" />

          <div className="space-y-3">
            <div className="w-full h-24 bg-primary/10 rounded-2xl" />
            <div className="w-full h-32 bg-primary/10 rounded-2xl" />
          </div>

          <div className="w-full h-12 bg-primary/10 rounded-xl mt-6" />
        </div>
      </div>
    </div>
  );
}
