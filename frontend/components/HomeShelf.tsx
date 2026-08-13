"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { ListingCard as ListingCardType } from "@/types";
import ListingCard from "@/components/ListingCard";

export default function HomeShelf({
  title,
  subtitle,
  listings,
  href = "/search",
}: {
  title: string;
  subtitle?: string;
  listings: ListingCardType[];
  href?: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  if (listings.length === 0) return null;

  function scroll(dir: "left" | "right") {
    railRef.current?.scrollBy({ left: dir === "left" ? -600 : 600, behavior: "smooth" });
  }

  return (
    <section className="mb-10">
      {/* Header row */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <Link href={href} className="group inline-flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-gray-900">{title}</h2>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 transition group-hover:bg-gray-200">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
          {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
        </div>

        {/* Scroll buttons (desktop only) */}
        <div className="hidden items-center gap-2 md:flex">
          <button
            onClick={() => scroll("left")}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:border-gray-600 hover:text-gray-900 transition"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:border-gray-600 hover:text-gray-900 transition"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Horizontal scroll rail */}
      <div
        ref={railRef}
        className="no-scrollbar grid auto-cols-[200px] grid-flow-col gap-4 overflow-x-auto scroll-smooth pb-2"
      >
        {listings.slice(0, 8).map((listing) => (
          <ListingCard key={`${title}-${listing.id}`} listing={listing} variant="shelf" />
        ))}
        {/* "See all" card */}
        <Link
          href={href}
          className="flex h-[190px] w-[200px] shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 shadow-sm transition hover:shadow-md"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <ArrowRight className="h-4 w-4" />
          </span>
          See all
        </Link>
      </div>
    </section>
  );
}
