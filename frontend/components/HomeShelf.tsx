"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { ListingCard as ListingCardType } from "@/types";
import ListingCard from "@/components/ListingCard";

// ── "See all" collage card (2×2 thumbnails — full height like real Airbnb) ────
function SeeAllCard({ href, images }: { href: string; images: (string | null)[] }) {
  const thumbs = images.filter(Boolean).slice(0, 4) as string[];

  return (
    <Link
      href={href}
      className="group relative h-[200px] w-[170px] shrink-0 overflow-hidden rounded-2xl transition hover:shadow-lg"
    >
      {/* 2×2 grid fills full card */}
      <div className="grid h-full grid-cols-2 grid-rows-2 gap-0.5">
        {[0, 1, 2, 3].map((i) =>
          thumbs[i] ? (
            <div key={i} className="relative overflow-hidden bg-gray-100">
              <Image src={thumbs[i]} alt="" fill className="object-cover" sizes="85px" />
            </div>
          ) : (
            <div key={i} className="bg-gray-200" />
          )
        )}
      </div>
      {/* "See all" overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center bg-gradient-to-t from-black/50 to-transparent pb-3 pt-6">
        <span className="text-sm font-bold text-white drop-shadow">See all</span>
      </div>
    </Link>
  );
}

}

// ── HomeShelf ─────────────────────────────────────────────────────────────────
export default function HomeShelf({
  title,
  subtitle,
  listings,
  href = "/search",
  cardType = "home",
}: {
  title: string;
  subtitle?: string;
  listings: ListingCardType[];
  href?: string;
  cardType?: "home" | "experience" | "service";
}) {
  const railRef = useRef<HTMLDivElement>(null);
  if (listings.length === 0) return null;

  function scroll(dir: "left" | "right") {
    railRef.current?.scrollBy({ left: dir === "left" ? -700 : 700, behavior: "smooth" });
  }

  const seeAllImages = listings.slice(0, 4).map((l) => l.cover_image);

  return (
    <section className="mb-10">
      {/* Header row */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <Link href={href} className="group inline-flex items-center gap-2">
            <h2 className="text-[22px] font-bold tracking-tight text-gray-900">{title}</h2>
            <ArrowRight className="h-4 w-4 text-gray-600 transition group-hover:translate-x-0.5" />
          </Link>
          {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
        </div>
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
        className="no-scrollbar grid auto-cols-[170px] grid-flow-col gap-3 overflow-x-auto scroll-smooth pb-2"
      >
        {listings.slice(0, 10).map((listing) => (
          <ListingCard
            key={`${title}-${listing.id}`}
            listing={listing}
            variant="shelf"
            cardType={cardType}
          />
        ))}
        <SeeAllCard href={href} images={seeAllImages} />
      </div>
    </section>
  );
}
