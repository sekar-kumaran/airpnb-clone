"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Heart, SlidersHorizontal, Star } from "lucide-react";
import FilterModal from "@/components/FilterModal";
import type { Category, ListingCard } from "@/types";

interface SearchContentProps {
  listings: ListingCard[];
  total: number;
  page: number;
  limit: number;
  searchParams: {
    location?: string;
    min_price?: string;
    max_price?: string;
    property_type?: string;
    guests?: string;
    checkin?: string;
    checkout?: string;
    category_id?: string;
    page?: string;
  };
  categories: Category[];
}

function ResultCard({ listing, featured = false }: { listing: ListingCard; featured?: boolean }) {
  return (
    <Link
      href={`/listing/${listing.id}`}
      className={`group block overflow-hidden bg-white transition ${
        featured ? "rounded-[32px] p-5 shadow-xl shadow-gray-200/80" : "rounded-[28px]"
      }`}
    >
      <div className={featured ? "grid items-center gap-10 md:grid-cols-[300px_1fr]" : ""}>
        <div className={`relative overflow-hidden bg-gray-100 ${featured ? "h-[300px] rounded-[26px]" : "aspect-square rounded-[22px]"}`}>
          {listing.cover_image && (
            <Image
              src={listing.cover_image}
              alt={listing.title}
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
              sizes={featured ? "320px" : "(max-width: 1024px) 50vw, 260px"}
            />
          )}
          {(listing.rating ?? 5) >= 4.9 && (
            <span className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-sm font-bold shadow">
              Guest favourite
            </span>
          )}
          <span className="absolute right-4 top-4 rounded-full bg-white/90 p-3 shadow">
            <Heart className="h-5 w-5" />
          </span>
          {featured && (
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1">
              {[0, 1, 2, 3].map((dot) => (
                <span key={dot} className={`h-2 w-2 rounded-full ${dot === 0 ? "bg-white" : "bg-white/60"}`} />
              ))}
            </div>
          )}
        </div>
        <div className={featured ? "" : "pt-3"}>
          <h2 className={`${featured ? "text-[26px]" : "text-lg"} font-bold leading-tight text-gray-900`}>
            {listing.title}
          </h2>
          <p className={`${featured ? "mt-3 text-2xl" : "mt-1 text-sm"} text-gray-500`}>
            {featured ? "Skywatch by CasaFlip - Penthouse 2BH..." : `${listing.city}, ${listing.country}`}
          </p>
          {featured && (
            <>
              <p className="mt-1 text-2xl leading-snug text-gray-500">2 bedrooms · 2 beds · 2 private bathrooms</p>
              <p className="mt-1 text-2xl text-gray-500">11-13 Sept</p>
            </>
          )}
          <div className={`${featured ? "mt-7 text-2xl" : "mt-1 text-sm"} flex items-end justify-between gap-4`}>
            <span>
              {featured && <span className="mr-2 text-gray-500 line-through">${listing.price_per_night * 4}</span>}
              <strong>${listing.price_per_night * 2}</strong>
              <span className="text-gray-500"> for 2 nights</span>
            </span>
            <span className="flex items-center gap-1">
              <Star className={`${featured ? "h-6 w-6" : "h-4 w-4"} fill-current`} />
              {listing.rating?.toFixed(2) || "5.0"}
              {featured && <span className="text-gray-500">({listing.review_count || 51})</span>}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function SearchContent({ listings, total, page, limit, searchParams }: SearchContentProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const place = searchParams.location || "North Goa";
  const [featured, ...rest] = listings;

  function pageHref(nextPage: number) {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== "page") params.set(key, value);
    });
    if (nextPage > 1) params.set("page", String(nextPage));
    return `/search${params.toString() ? `?${params.toString()}` : ""}`;
  }

  return (
    <div className="border-t bg-white">
      <div className="mx-auto flex max-w-[1800px] justify-center gap-3 px-6 py-7">
        <button onClick={() => setIsFilterOpen(true)} className="flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold hover:border-black">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
        <button className="rounded-full border px-5 py-3 text-sm font-semibold hover:border-black">Price</button>
        <button className="rounded-full border px-5 py-3 text-sm font-semibold hover:border-black">Type of place</button>
      </div>

      <div className="grid min-h-screen gap-14 px-8 pb-12 lg:grid-cols-[minmax(620px,850px)_1fr] lg:px-[60px]">
        <section className="pt-8">
          <div className="mb-10 flex items-center justify-between">
            <h1 className="text-[28px] font-bold tracking-tight">Over 1,000 homes in {place}</h1>
            <div className="hidden items-center gap-3 text-lg font-semibold md:flex">
              <span className="text-3xl">🏷</span>
              Prices include all fees
            </div>
          </div>

          {featured ? (
            <>
              <ResultCard listing={featured} featured />
              <div className="mt-10 grid gap-x-8 gap-y-10 md:grid-cols-2">
                {rest.map((listing) => (
                  <ResultCard key={listing.id} listing={listing} />
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-3xl border bg-gray-50 p-12 text-center text-gray-500">
              No homes found. Try adjusting your filters.
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              {page > 1 && (
                <Link href={pageHref(page - 1)} className="rounded-xl border px-5 py-2 text-sm font-semibold hover:bg-gray-50">
                  Previous
                </Link>
              )}
              <span className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link href={pageHref(page + 1)} className="rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-black">
                  Show more
                </Link>
              )}
            </div>
          )}
        </section>

        <aside className="sticky top-[120px] hidden h-[calc(100vh-140px)] overflow-hidden rounded-[26px] bg-[#e7f2d8] lg:block">
          <div className="relative h-full w-full bg-[radial-gradient(circle_at_20%_20%,#f7fbef_0_10%,transparent_11%),linear-gradient(135deg,#eef7dd,#faf6ed_45%,#d5edcd)]">
            <div className="absolute right-7 top-7 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow">
              <ExternalLink className="h-5 w-5" />
            </div>
            <div className="absolute right-7 top-24 overflow-hidden rounded-full bg-white shadow">
              <button className="block h-12 w-12 text-3xl">+</button>
              <button className="block h-12 w-12 border-t text-3xl">-</button>
            </div>
            {listings.slice(0, 16).map((listing, index) => (
              <Link
                key={`pin-${listing.id}`}
                href={`/listing/${listing.id}`}
                className="absolute rounded-full bg-white px-3 py-2 text-base font-bold shadow-lg ring-1 ring-black/10 transition hover:scale-105"
                style={{
                  left: `${6 + ((index * 13) % 76)}%`,
                  top: `${4 + ((index * 19) % 82)}%`,
                }}
              >
                ${listing.price_per_night * 2}
              </Link>
            ))}
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-gray-600">Map Data ©2026 · Terms</span>
          </div>
        </aside>
      </div>

      <FilterModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </div>
  );
}
