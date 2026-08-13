"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import type { ListingCard as ListingCardType } from "@/types";
import { useWishlist } from "@/components/WishlistProvider";

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ListingCard({
  listing,
  variant = "grid",
  cardType = "home",
  href,
}: {
  listing: ListingCardType;
  variant?: "grid" | "shelf" | "result";
  cardType?: "home" | "experience" | "service";
  href?: string;
}) {
  const { wishlist, toggleWishlist } = useWishlist();
  const isSaved = wishlist.has(listing.id);
  const isShelf = variant === "shelf";
  const isExperience = cardType === "experience";
  const isService = cardType === "service";
  const isSpecial = isExperience || isService; // not a home

  // Homes show "for 2 nights" price on shelf; experiences/services show per-guest
  const displayPrice = isShelf && !isSpecial
    ? Math.round(listing.price_per_night * 2)
    : listing.price_per_night;

  return (
    <Link href={href || `/listing/${listing.id}`} className="group block">
      {/* Image container */}
      <div
        className={`relative w-full overflow-hidden ${
          isShelf ? "h-[200px] rounded-[16px]" : "aspect-square rounded-[16px]"
        }`}
      >
        {listing.cover_image ? (
          <Image
            src={listing.cover_image}
            alt={listing.title}
            fill
            className="object-cover card-image-zoom"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 220px"
          />
        ) : (
          <div className="h-full w-full bg-gray-200" />
        )}

        {/* Heart button */}
        <button 
          className="absolute right-3 top-3 z-10 rounded-full p-1 transition hover:scale-110 active:scale-95"
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(listing.id);
          }}
        >
          <Heart 
            className={`h-[22px] w-[22px] transition ${
              isSaved ? "fill-[#FF385C] text-[#FF385C]" : "fill-black/30 text-white"
            }`} 
            strokeWidth={1.5} 
          />
        </button>

        {/* Badge */}
        {isExperience && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold shadow">
            <span className="text-primary">✦</span> Original
          </span>
        )}
        {isService && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold shadow">
            Popular
          </span>
        )}
        {!isSpecial && (listing.rating ?? 5) >= 4.9 && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold shadow">
            Guest favourite
          </span>
        )}
      </div>

      {/* Card info */}
      <div className="mt-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold leading-5 text-gray-900">{listing.title}</p>
          {/* For experiences/services: show city + country */}
          {isSpecial ? (
            <p className="truncate text-[13px] leading-5 text-gray-500">
              {listing.city}, {listing.country}
            </p>
          ) : (
            !isShelf && (
              <p className="truncate text-[13px] leading-5 text-gray-500">
                {listing.city}, {listing.country}
              </p>
            )
          )}
        </div>
        {listing.rating !== null && (
          <div className="flex shrink-0 items-center gap-0.5 text-[13px] text-gray-700">
            <Star className="h-3 w-3 fill-current text-gray-700" />
            <span>{listing.rating.toFixed(listing.rating >= 5 ? 1 : 2)}</span>
          </div>
        )}
      </div>

      {/* Price */}
      <p className="mt-0.5 text-[13px] leading-5">
        {isSpecial ? (
          <>
            <span className="font-semibold text-gray-700">From {formatINR(displayPrice)}</span>{" "}
            <span className="text-gray-500">/ guest</span>
          </>
        ) : (
          <>
            <span className="font-semibold text-gray-700">{formatINR(displayPrice)}</span>{" "}
            <span className="text-gray-500">{isShelf ? "for 2 nights" : "night"}</span>
          </>
        )}
      </p>
    </Link>
  );
}
