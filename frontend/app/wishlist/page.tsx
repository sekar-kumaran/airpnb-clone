"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { useToast } from "@/components/ToastProvider";
import ListingGrid from "@/components/ListingGrid";
import type { ListingCard } from "@/types";

export default function WishlistPage() {
  const [listings, setListings] = useState<ListingCard[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    let active = true;
    api
      .getWishlist()
      .then((data) => {
        if (active) setListings(data);
      })
      .catch((err: any) => showToast(err.message || "Failed to load wishlist", "error"))
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [showToast]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Wishlist</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-64 bg-gray-100 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Wishlist</h1>

      {listings.length === 0 ? (
        <div className="text-center py-16 border rounded-2xl bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Create your first wishlist</h2>
          <p className="text-gray-500 mb-6">
            As you search, tap the heart icon to save your favourite places for later.
          </p>
          <Link
            href="/search"
            className="inline-block px-6 py-3 bg-rose-500 text-white font-semibold rounded-xl hover:bg-rose-600 transition"
          >
            Start exploring
          </Link>
        </div>
      ) : (
        <ListingGrid listings={listings} />
      )}
    </div>
  );
}
