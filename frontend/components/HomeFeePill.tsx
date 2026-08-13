"use client";

import { useState } from "react";
import { Tag, X } from "lucide-react";

export default function HomeFeePill() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="fixed bottom-8 left-1/2 z-30 -translate-x-1/2 hidden md:flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold shadow-xl">
      <Tag className="h-5 w-5 fill-primary/20 text-primary shrink-0" />
      <span>Prices include all fees</span>
      <button
        onClick={() => setVisible(false)}
        className="ml-1 rounded-full p-0.5 hover:bg-gray-100"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5 text-gray-400" />
      </button>
    </div>
  );
}
