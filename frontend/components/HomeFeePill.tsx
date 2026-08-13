"use client";

import { Tag } from "lucide-react";

export default function HomeFeePill() {
  return (
    <div className="pointer-events-none fixed bottom-10 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 text-[17px] font-semibold shadow-xl md:flex">
      <Tag className="h-7 w-7 fill-primary/20 text-primary" />
      Prices include all fees
    </div>
  );
}
