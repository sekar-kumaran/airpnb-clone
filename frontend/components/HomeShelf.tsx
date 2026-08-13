"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { ListingCard as ListingCardType } from "@/types";
import ListingCard from "@/components/ListingCard";

// ── "See all" collage card (stacked polaroids) ──────────────────────────────
function SeeAllCard({ href, images }: { href: string; images: (string | null)[] }) {
  const thumbs = images.filter(Boolean).slice(0, 3) as string[];

  return (
    <Link
      href={href}
      className="group flex h-[200px] w-[170px] shrink-0 flex-col items-center justify-center rounded-[20px] border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
    >
      <div className="relative mb-5 mt-2 h-[80px] w-[100px]">
        {thumbs[0] && (
          <div className="absolute -left-1 top-0 h-[68px] w-[76px] -rotate-[10deg] overflow-hidden rounded-[10px] border-[3px] border-white bg-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
            <Image src={thumbs[0]} alt="" fill className="object-cover" sizes="80px" />
          </div>
        )}
        {thumbs[1] && (
          <div className="absolute -right-1 top-1.5 h-[68px] w-[76px] rotate-[10deg] overflow-hidden rounded-[10px] border-[3px] border-white bg-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.12)] z-10">
            <Image src={thumbs[1]} alt="" fill className="object-cover" sizes="80px" />
          </div>
        )}
        {thumbs[2] && (
          <div className="absolute left-1/2 top-5 h-[68px] w-[76px] -translate-x-1/2 overflow-hidden rounded-[10px] border-[3px] border-white bg-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-20">
            <Image src={thumbs[2]} alt="" fill className="object-cover" sizes="80px" />
          </div>
        )}
      </div>
      <span className="text-[15px] font-semibold text-gray-900 mt-2">See all</span>
    </Link>
  );
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
