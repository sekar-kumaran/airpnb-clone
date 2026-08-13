"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Flame,
  Home,
  Landmark,
  LucideIcon,
  Mountain,
  Palmtree,
  Sparkles,
  TentTree,
  TreePalm,
  Waves,
} from "lucide-react";
import type { Category } from "@/types";

const ICON_MAP: Record<string, LucideIcon> = {
  beach: Waves,
  cabin: TentTree,
  cabins: TentTree,
  city: Landmark,
  iconic: Sparkles,
  island: Palmtree,
  mansion: Home,
  mountain: Mountain,
  trending: Flame,
  tropical: TreePalm,
  view: Mountain,
};

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
    <div className="flex gap-6 overflow-x-auto border-b border-gray-200 px-6 py-4 no-scrollbar">
      {categories.map((category) => {
        const Icon = ICON_MAP[(category.icon || category.name).toLowerCase()] || Sparkles;
        const active = selectedId === category.id;

        return (
          <button
            key={category.id}
            onClick={() => selectCategory(category.id)}
            className={`flex shrink-0 flex-col items-center gap-2 border-b-2 pb-2 text-xs ${
              active
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            <Icon className="h-5 w-5" />
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
