"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { useState } from "react";
import type { ListingCard as ListingCardType } from "@/types";
import { api } from "@/lib/api-client";
import { useToast } from "@/components/ToastProvider";

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
}: {
  listing: ListingCardType;
  variant?: "grid" | "shelf" | "result";
}) {
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);
  const { showToast } = useToast();
  const isShelf = variant === "shelf";
  const displayPrice = isShelf ? Math.round(listing.price_per_night * 2) : listing.price_per_night;

  async function toggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setPending(true);
    try {
      if (saved) {
        await api.removeFromWishlist(listing.id);
      } else {
        await api.addToWishlist(listing.id);
      }
      setSaved(!saved);
      showToast(saved ? "Removed from wishlist" : "Saved to wishlist", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Unable to update wishlist", "error");
    } finally {
      setPending(false);
    }
  }

  return (
    <Link href={`/listing/${listing.id}`} className="group block">
      <div className={`relative w-full overflow-hidden ${isShelf ? "h-[216px] rounded-[16px]" : "aspect-square rounded-[16px]"}`}>
        {listing.cover_image ? (
          <Image
            src={listing.cover_image}
            alt={listing.title}
            fill
            className="object-cover card-image-zoom"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 226px"
          />
        ) : (
          <div className="h-full w-full bg-gray-200" />
        )}
        <button
          onClick={toggleWishlist}
          disabled={pending}
          aria-label="Save to wishlist"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center"
        >
          <Heart
            className={`h-7 w-7 drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)] ${saved ? "fill-primary stroke-primary" : "fill-black/35 stroke-white"}`}
          />
        </button>
        {(listing.rating ?? 5) >= 4.9 && (
          <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-[13px] font-bold shadow">
            Guest favourite
          </span>
        )}
      </div>

      <div className="mt-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[16px] font-semibold leading-5 text-gray-900">{listing.title}</p>
          {!isShelf && (
            <p className="truncate text-[15px] leading-5 text-gray-500">
              {listing.city}, {listing.country}
            </p>
          )}
        </div>
        {listing.rating !== null && (
          <div className="flex shrink-0 items-center gap-1 text-[15px] text-gray-700">
            <Star className="h-3.5 w-3.5 fill-current text-gray-600" />
            <span>{listing.rating.toFixed(listing.rating >= 5 ? 1 : 2)}</span>
          </div>
        )}
      </div>
      <p className="mt-1 text-[15px] leading-5">
        <span className="text-gray-700">{formatINR(displayPrice)}</span>{" "}
        <span className="text-gray-500">{isShelf ? "for 2 nights" : "night"}</span>
      </p>
    </Link>
  );
}
