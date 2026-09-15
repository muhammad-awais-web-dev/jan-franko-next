import React from "react";

export default function BowyerLoading() {
  return (
    <div className="w-full min-h-screen bg-secondary text-primary select-text relative pb-24 animate-pulse">
      {/* Back to Armory Bar Skeleton */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-6">
        <div className="w-32 h-4 bg-primary/10 rounded-full" />
      </div>

      {/* Hero Banner Section Skeleton */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-8 md:py-14 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
        <div className="lg:col-span-5 relative aspect-[3/4] w-full max-w-md mx-auto rounded-3xl bg-primary/10" />

        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="w-36 h-6 bg-primary/10 rounded-full" />
            <div className="w-64 h-12 bg-primary/10 rounded-2xl" />
            <div className="w-48 h-5 bg-primary/10 rounded-md" />
            <div className="w-full max-w-lg h-16 bg-primary/10 rounded-xl mt-2" />
          </div>

          <div className="w-16 h-[1px] bg-primary/10" />

          <div className="rounded-2xl bg-primary/5 p-6 space-y-3">
            <div className="w-40 h-4 bg-primary/10 rounded-md" />
            <div className="w-full h-12 bg-primary/10 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Products Grid Skeleton */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-10 space-y-8">
        <div className="flex items-center justify-between border-b border-primary/10 pb-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="w-24 h-9 bg-primary/10 rounded-xl" />
            ))}
          </div>
          <div className="w-60 h-9 bg-primary/10 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white border border-primary/10 rounded-2xl h-[540px] overflow-hidden flex flex-col shadow-xs">
              <div className="w-full h-[360px] bg-primary/10" />
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="w-20 h-3 bg-primary/10 rounded-md" />
                  <div className="w-48 h-5 bg-primary/10 rounded-md" />
                  <div className="w-full h-10 bg-primary/10 rounded-md" />
                </div>
                <div className="w-full h-8 bg-primary/10 rounded-xl border-t border-primary/5 pt-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
