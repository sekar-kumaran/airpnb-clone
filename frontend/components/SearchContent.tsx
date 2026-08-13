"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, SlidersHorizontal, Star, ChevronLeft, ChevronRight, MapPin, Tag } from "lucide-react";
import FilterModal from "@/components/FilterModal";
import type { Category, ListingCard } from "@/types";

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(n);
}

// ── Quick filter pills ────────────────────────────────────────────────────────
const QUICK_FILTERS = [
  "Wifi", "Kitchen", "Free parking", "Pool", "Air conditioning",
  "Washing machine", "2+ bedrooms", "Allows pets", "1+ bathrooms", "Instant Book"
];

// ── Individual result card ────────────────────────────────────────────────────
function ResultCard({ listing }: { listing: ListingCard }) {
  const [saved, setSaved] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  const images = listing.cover_image
    ? [listing.cover_image, listing.cover_image, listing.cover_image]
    : [];

  return (
    <div className="group">
      {/* Image */}
      <div className="relative aspect-[20/19] overflow-hidden rounded-xl bg-gray-100">
        {images[imgIndex] ? (
          <Image
            src={images[imgIndex]}
            alt={listing.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 320px"
          />
        ) : (
          <div className="h-full w-full bg-gray-200" />
        )}

        {/* Heart */}
        <button
          onClick={() => setSaved(!saved)}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center"
        >
          <Heart className={`h-6 w-6 drop-shadow-md ${saved ? "fill-primary stroke-primary" : "fill-black/30 stroke-white"}`} />
        </button>

        {/* Badges */}
        {(listing.rating ?? 0) >= 4.9 ? (
          <span className="absolute left-3 top-3 flex items-center rounded-full bg-white px-3 py-1 text-[13px] font-bold shadow-md">
            🏆 Guest favourite
          </span>
        ) : (listing.rating ?? 0) >= 4.8 ? (
          <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2 py-0.5 text-[12px] font-bold text-white shadow-sm backdrop-blur-sm">
            Superhost
          </span>
        ) : null}

        {/* Image carousel dots */}
        {images.length > 1 && (
          <>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1">
              {images.map((_, i) => (
                <button key={i} onClick={() => setImgIndex(i)}
                  className={`h-1.5 w-1.5 rounded-full transition ${i === imgIndex ? "bg-white" : "bg-white/50"}`}
                />
              ))}
            </div>
            <button onClick={() => setImgIndex(Math.max(0, imgIndex - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 opacity-0 shadow group-hover:opacity-100 transition">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => setImgIndex(Math.min(images.length - 1, imgIndex + 1))}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 opacity-0 shadow group-hover:opacity-100 transition">
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Card info */}
      <Link href={`/listing/${listing.id}`} className="block pt-3">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-[15px] font-semibold text-gray-900">{listing.title}</p>
          {listing.rating && (
            <div className="flex shrink-0 items-center gap-1 text-[15px]">
              <Star className="h-3 w-3 fill-current text-gray-900" />
              <span className="text-gray-900">{listing.rating.toFixed(2)}</span>
              <span className="text-gray-900">({listing.review_count})</span>
            </div>
          )}
        </div>
        <p className="mt-0.5 truncate text-[15px] text-gray-500">
          The Loft | Self Check-in | {listing.city}
        </p>
        <p className="truncate text-[15px] text-gray-500">
          1 bedroom · 1 king bed · 1 bathroom
        </p>
        <p className="truncate text-[15px] text-gray-500">
          18-23 Aug
        </p>
        <div className="mt-1 flex items-baseline gap-1 text-[15px]">
          <span className="font-semibold text-gray-900">{formatINR(listing.price_per_night)}</span>
          <span className="text-gray-900">for 5 nights</span>
        </div>
      </Link>
    </div>
  );
}

// ── Map with price pins ───────────────────────────────────────────────────────
function MapPanel({ listings }: { listings: ListingCard[] }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gray-100">
      {/* Static map background */}
      <Image
        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&q=70"
        alt="Map"
        fill
        className="object-cover opacity-70"
        sizes="700px"
      />
      {/* Price pins */}
      {listings.slice(0, 14).map((listing, i) => (
        <Link
          key={`pin-${listing.id}`}
          href={`/listing/${listing.id}`}
          className="absolute rounded-full bg-white px-2.5 py-1 text-xs font-bold shadow-lg ring-1 ring-black/10 transition hover:scale-110 hover:z-10 hover:bg-gray-900 hover:text-white"
          style={{
            left: `${8 + ((i * 14) % 75)}%`,
            top: `${5 + ((i * 17) % 82)}%`,
          }}
        >
          {formatINR(listing.price_per_night * 2)}
        </Link>
      ))}
      {/* Map attribution */}
      <div className="absolute bottom-2 right-3 text-[10px] text-gray-600 bg-white/80 px-1.5 py-0.5 rounded">
        Map Data ©2026 · Terms
      </div>
      {/* Expand button */}
      <button className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow">
        <MapPin className="h-4 w-4" />
      </button>
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, pageHref }: { page: number; totalPages: number; pageHref: (p: number) => string }) {
  if (totalPages <= 1) return null;

  function pages(): (number | "...")[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 4) return [1, 2, 3, 4, "...", totalPages];
    if (page >= totalPages - 3) return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  }

  return (
    <div className="mt-10 flex items-center justify-center gap-1">
      <Link href={page > 1 ? pageHref(page - 1) : "#"}
        className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm transition hover:bg-gray-100 ${page <= 1 ? "pointer-events-none text-gray-300" : ""}`}>
        <ChevronLeft className="h-4 w-4" />
      </Link>
      {pages().map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-1 text-sm text-gray-400">...</span>
        ) : (
          <Link key={p} href={pageHref(p as number)}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition ${
              p === page ? "bg-gray-900 text-white" : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            {p}
          </Link>
        )
      )}
      <Link href={page < totalPages ? pageHref(page + 1) : "#"}
        className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm transition hover:bg-gray-100 ${page >= totalPages ? "pointer-events-none text-gray-300" : ""}`}>
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

// ── Main SearchContent ────────────────────────────────────────────────────────
interface SearchContentProps {
  listings: ListingCard[];
  total: number;
  page: number;
  limit: number;
  searchParams: {
    location?: string; min_price?: string; max_price?: string;
    property_type?: string; guests?: string; checkin?: string;
    checkout?: string; category_id?: string; page?: string;
  };
  categories: Category[];
}

export default function SearchContent({ listings, total, page, limit, searchParams }: SearchContentProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const place = searchParams.location || "all homes";

  function pageHref(nextPage: number) {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => { if (v && k !== "page") params.set(k, v); });
    if (nextPage > 1) params.set("page", String(nextPage));
    return `/search${params.toString() ? `?${params.toString()}` : ""}`;
  }

  function toggleFilter(f: string) {
    setActiveFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ── Filter row ── */}
      <div className="sticky top-[86px] z-20 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[1760px] items-center gap-3 overflow-x-auto px-6 py-4 md:px-10 xl:px-20 no-scrollbar">
          {/* Filters button */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex shrink-0 items-center gap-2 rounded-full border border-gray-300 px-5 py-2 text-sm font-medium hover:border-gray-900 transition"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>

          {/* Quick-filter pills */}
          {QUICK_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => toggleFilter(f)}
              className={`shrink-0 rounded-full border px-5 py-2 text-sm transition whitespace-nowrap ${
                activeFilters.includes(f)
                  ? "border-gray-900 bg-gray-100 text-gray-900 font-semibold"
                  : "border-gray-300 hover:border-gray-900 font-medium"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="grid lg:grid-cols-[1fr_45%] lg:gap-0">
        {/* Left: results */}
        <section className="min-h-screen px-6 py-8 md:px-10 xl:px-20 lg:pr-6">
          {/* Count */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">
              {total > 0 ? `${total} homes` : "No homes found"}
            </h1>
            <div className="flex items-center gap-2">
              <span className="flex items-center text-pink-600">
                <Tag className="mr-1 h-5 w-5 fill-pink-600 stroke-white stroke-1" />
              </span>
              <span className="text-sm font-semibold text-gray-900">Prices include all fees</span>
            </div>
          </div>

          {listings.length > 0 ? (
            <>
              <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2">
                {listings.map((listing) => (
                  <ResultCard key={listing.id} listing={listing} />
                ))}
              </div>
              <Pagination page={page} totalPages={totalPages} pageHref={pageHref} />
            </>
          ) : (
            <div className="flex flex-col items-center rounded-3xl border border-gray-200 bg-gray-50 p-16 text-center">
              <span className="text-4xl mb-4">🔍</span>
              <p className="text-lg font-semibold text-gray-800">No exact matches</p>
              <p className="mt-2 text-sm text-gray-500">Try adjusting your dates, location, or filters.</p>
              <Link href="/search" className="mt-5 rounded-xl border border-gray-900 px-5 py-2 text-sm font-semibold hover:bg-gray-900 hover:text-white transition">
                Clear filters
              </Link>
            </div>
          )}
        </section>

        {/* Right: map */}
        <aside className="sticky top-[115px] hidden h-[calc(100vh-115px)] overflow-hidden lg:block">
          <MapPanel listings={listings} />
        </aside>
      </div>

      <FilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </div>
  );
}
