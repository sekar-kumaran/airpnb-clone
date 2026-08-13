"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/types";

// ── SVG icon paths for each category ──────────────────────────────────────────
const SVG_ICONS: Record<string, React.ReactNode> = {
  "Amazing views": (
    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M5 24 L16 8 L27 24 Z" />
      <path d="M12 24 L19 14 L26 24 Z" opacity="0.4" />
    </svg>
  ),
  "Beachfront": (
    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M4 22 Q8 14 16 18 Q20 20 26 14" />
      <path d="M4 26 L28 26" />
      <circle cx="22" cy="10" r="4" />
    </svg>
  ),
  "Cabins": (
    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M4 16 L16 4 L28 16" />
      <rect x="8" y="16" width="16" height="12" />
      <rect x="13" y="20" width="6" height="8" />
    </svg>
  ),
  "Camping": (
    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M4 26 L16 6 L28 26 Z" />
      <path d="M10 26 L22 26" />
      <path d="M16 6 L16 26" strokeDasharray="2 2" />
    </svg>
  ),
  "Castles": (
    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M4 28 L4 12 L8 12 L8 8 L8 12 L12 12 L12 8 L12 12 L20 12 L20 8 L20 12 L24 12 L24 8 L24 12 L28 12 L28 28 Z" />
      <rect x="13" y="20" width="6" height="8" />
    </svg>
  ),
  "Countryside": (
    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M4 24 Q10 14 16 20 Q22 26 28 16" />
      <circle cx="8" cy="12" r="4" />
      <path d="M4 24 L28 24" />
    </svg>
  ),
  "Design": (
    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="4" y="4" width="24" height="24" rx="2" />
      <path d="M4 12 L28 12" />
      <path d="M14 12 L14 28" />
    </svg>
  ),
  "Farms": (
    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M4 20 L16 8 L28 20" />
      <rect x="10" y="20" width="12" height="8" />
      <path d="M22 20 L22 28" />
      <circle cx="22" cy="18" r="2" />
    </svg>
  ),
  "Islands": (
    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75">
      <ellipse cx="16" cy="22" rx="10" ry="4" />
      <path d="M16 22 L16 10" />
      <path d="M16 10 Q20 6 24 10 Q20 14 16 10" />
    </svg>
  ),
  "Lakefront": (
    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M4 20 Q10 16 16 20 Q22 24 28 20" />
      <path d="M4 24 Q10 20 16 24 Q22 28 28 24" />
      <path d="M12 8 L16 4 L20 8 L20 20 L12 20 Z" />
    </svg>
  ),
  "Luxe": (
    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M16 4 L18.5 11 L26 11 L20 15.5 L22.5 23 L16 18.5 L9.5 23 L12 15.5 L6 11 L13.5 11 Z" />
    </svg>
  ),
  "National parks": (
    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M4 28 L10 14 L16 22 L22 10 L28 28 Z" />
      <circle cx="24" cy="8" r="3" />
    </svg>
  ),
  "New": (
    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M16 4 L16 8 M22 6 L19.5 9.5 M28 12 L24 13.5 M28 20 L24 18.5 M22 26 L19.5 22.5 M16 28 L16 24 M10 26 L12.5 22.5 M4 20 L8 18.5 M4 12 L8 13.5 M10 6 L12.5 9.5" strokeLinecap="round" />
      <circle cx="16" cy="16" r="5" />
    </svg>
  ),
  "OMG!": (
    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M16 4 C8 4 4 10 4 16 C4 24 10 28 16 28 C22 28 28 24 28 16 C28 10 24 4 16 4 Z" />
      <path d="M12 20 Q16 24 20 20" />
      <circle cx="12" cy="14" r="1.5" fill="currentColor" />
      <circle cx="20" cy="14" r="1.5" fill="currentColor" />
    </svg>
  ),
  "Rooms": (
    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="4" y="4" width="24" height="24" rx="2" />
      <path d="M4 16 L28 16" />
      <path d="M16 4 L16 28" />
    </svg>
  ),
  "Skiing": (
    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M4 28 L14 12 L20 18 L28 4" />
      <circle cx="22" cy="8" r="3" />
      <path d="M4 28 L28 28" />
    </svg>
  ),
  "Surfing": (
    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M4 22 Q8 18 12 22 Q16 26 20 22 Q24 18 28 22" />
      <path d="M4 26 Q8 22 12 26 Q16 30 20 26 Q24 22 28 26" />
      <path d="M20 8 L28 4 L26 16 L18 12 Z" />
    </svg>
  ),
  "Tiny homes": (
    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M10 26 L10 16 L16 10 L22 16 L22 26 Z" />
      <path d="M7 18 L16 8 L25 18" />
      <rect x="13" y="20" width="6" height="6" />
    </svg>
  ),
  "Treehouse": (
    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="16" cy="12" r="8" />
      <path d="M16 20 L16 28" />
      <rect x="10" y="14" width="12" height="8" rx="2" />
      <path d="M8 28 L24 28" />
    </svg>
  ),
  "Trending": (
    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M4 28 Q8 20 12 16 Q16 12 20 14 Q24 16 28 6" />
      <path d="M22 6 L28 6 L28 12" />
    </svg>
  ),
  "Tropical": (
    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M16 28 L16 12" />
      <path d="M16 12 C10 8 4 12 8 18 C12 14 16 12 16 12" />
      <path d="M16 16 C22 12 28 16 24 22 C20 18 16 16 16 16" />
    </svg>
  ),
  "Unique stays": (
    <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M16 4 L20 12 L28 13 L22 19 L23.5 27 L16 23 L8.5 27 L10 19 L4 13 L12 12 Z" />
    </svg>
  ),
};

const DEFAULT_ICON = (
  <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75">
    <circle cx="16" cy="16" r="10" />
    <path d="M16 10 L16 16 L20 18" />
  </svg>
);

// ──────────────────────────────────────────────────────────────────────────────

export default function CategoryRail({
  categories,
  activeId,
  onSelect,
}: {
  categories: Category[];
  activeId?: number | null;
  onSelect?: (id: number | null) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId =
    activeId ?? (searchParams.get("category_id") ? Number(searchParams.get("category_id")) : null);

  function selectCategory(id: number) {
    const nextId = selectedId === id ? null : id;
    if (onSelect) {
      onSelect(nextId);
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    if (nextId) params.set("category_id", String(nextId));
    else params.delete("category_id");
    params.delete("page");
    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <div className="sticky top-[73px] z-30 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-[1760px] px-6 sm:px-10">
        <div className="relative flex gap-1 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const icon = SVG_ICONS[cat.name] ?? DEFAULT_ICON;
            const active = selectedId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => selectCategory(cat.id)}
                className={`category-btn flex shrink-0 flex-col items-center gap-1.5 px-3 py-3 min-w-[72px] transition-opacity ${
                  active ? "opacity-100 active" : "opacity-60 hover:opacity-100"
                }`}
              >
                <span className={`transition-colors ${active ? "text-gray-900" : "text-gray-600"}`}>
                  {icon}
                </span>
                <span className={`text-[11px] font-semibold whitespace-nowrap ${active ? "text-gray-900" : "text-gray-500"}`}>
                  {cat.name}
                </span>
                {active && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gray-900 rounded-t" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
