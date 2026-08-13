"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { ListingCard as ListingCardType } from "@/types";
import ListingCard from "@/components/ListingCard";
import { useWishlist } from "@/components/WishlistProvider";

export default function WishlistPage() {
  const router = useRouter();
  const { wishlist, loading: wishlistLoading } = useWishlist();
  const [listings, setListings] = useState<ListingCardType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/");
      return;
    }
    loadWishlists();
  }, [router]);

  async function loadWishlists() {
    setLoading(true);
    try {
      const data = await api.getWishlist();
      setListings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Filter listings based on the global wishlist state, so if they unlike it 
  // on this page, it immediately disappears.
  const displayListings = listings.filter((l) => wishlist.has(l.id));

  if (loading || wishlistLoading) {
    return (
      <div className="mx-auto max-w-[1120px] px-6 py-12 lg:px-10">
        <h1 className="mb-8 text-3xl font-semibold tracking-tight text-gray-900">Wishlists</h1>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-12 lg:px-10 min-h-[60vh]">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight text-gray-900">Wishlists</h1>

      {displayListings.length === 0 ? (
        <div className="py-12">
          <h2 className="mb-2 text-2xl font-semibold text-gray-900">Create your first wishlist</h2>
          <p className="mb-8 text-gray-600">
            As you search, tap the heart icon to save your favourite places to stay or things to do to a wishlist.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
          {displayListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
