"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Images } from "lucide-react";
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

  function scrollRail(direction: "left" | "right") {
    railRef.current?.scrollBy({
      left: direction === "left" ? -720 : 720,
      behavior: "smooth",
    });
  }

  return (
    <section className="mb-11">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <Link href={href} className="group inline-flex items-center gap-2">
            <h2 className="text-[26px] font-bold leading-8 tracking-tight text-gray-950">{title}</h2>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 transition group-hover:bg-gray-200">
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
          {subtitle && <p className="mt-1 text-base leading-5 text-gray-500">{subtitle}</p>}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={() => scrollRail("left")}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition hover:bg-gray-200 hover:text-gray-900"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollRail("right")}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div ref={railRef} className="no-scrollbar grid auto-cols-[226px] grid-flow-col gap-4 overflow-x-auto scroll-smooth pb-2">
        {listings.slice(0, 7).map((listing) => (
          <ListingCard key={`${title}-${listing.id}`} listing={listing} variant="shelf" />
        ))}
        <Link
          href={href}
          className="flex h-[216px] w-[226px] shrink-0 flex-col items-center justify-center rounded-[16px] border bg-white shadow-md transition hover:shadow-lg"
        >
          <Images className="mb-5 h-12 w-12 text-gray-500" />
          <span className="font-bold">See all</span>
        </Link>
      </div>
    </section>
  );
}
