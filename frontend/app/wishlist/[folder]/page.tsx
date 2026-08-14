"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Share, MapPin } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { ListingCard as ListingCardType } from "@/types";
import ListingCard from "@/components/ListingCard";

export default function WishlistFolderPage() {
  const router = useRouter();
  const params = useParams();
  const folderName = decodeURIComponent(params.folder as string);
  
  const [listings, setListings] = useState<ListingCardType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/");
      return;
    }
    loadListings();
  }, [router, folderName]);

  async function loadListings() {
    setLoading(true);
    try {
      const data = await api.getWishlistFolderItems(folderName);
      setListings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden">
      {/* Left Sidebar (Listings) */}
      <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-10 lg:max-w-[800px] xl:max-w-[900px]">
        <Link href="/wishlist" className="mb-6 flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-[32px] font-bold text-gray-900">{folderName}</h1>
        </div>

        <div className="mb-8 flex gap-2">
          <button className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold hover:border-black">
            Add dates
          </button>
          <button className="rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold hover:border-black">
            1 guest
          </button>
          <button className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold hover:border-black">
            Share <Share className="h-4 w-4" />
          </button>
        </div>

        {listings.length === 0 ? (
          <p className="text-gray-500">No properties saved in this wishlist.</p>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <div key={listing.id}>
                <ListingCard listing={listing} />
                <div className="mt-2 text-sm text-gray-500">
                  <input 
                    type="text" 
                    placeholder="Add note" 
                    className="w-full rounded-xl bg-gray-100 px-4 py-3 focus:outline-none" 
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Sidebar (Map Placeholder) */}
      <div className="hidden lg:block lg:flex-1 relative bg-[#e3dfd6]">
        {/* We use a colored background and a generic map pin to simulate a map since we have no API keys */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://maps.wikimedia.org/osm-intl/6/28/19.png')] bg-cover bg-center mix-blend-multiply" />
        
        {/* Buttons on map */}
        <div className="absolute right-6 top-6 flex flex-col gap-2 rounded-xl bg-white shadow-lg overflow-hidden">
          <button className="flex h-10 w-10 items-center justify-center border-b hover:bg-gray-100 font-bold text-xl">+</button>
          <button className="flex h-10 w-10 items-center justify-center hover:bg-gray-100 font-bold text-xl">-</button>
        </div>

        <div className="absolute left-6 top-6 flex flex-col gap-2 rounded-xl bg-white shadow-lg overflow-hidden">
          <button className="flex h-10 w-10 items-center justify-center hover:bg-gray-100">
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 fill-current" aria-hidden="true" role="presentation" focusable="false"><path d="M16 2l14.7 13.5-1.4 1.5-3.3-3V30H20v-8h-8v8H6V14L2.7 17 1.3 15.5z"></path></svg>
          </button>
        </div>

        {/* Mock pins */}
        {listings.slice(0, 5).map((l, i) => (
          <div 
            key={l.id} 
            className="absolute flex items-center justify-center rounded-full bg-white shadow p-2"
            style={{ 
              top: `${40 + (i * 10) % 40}%`, 
              left: `${30 + (i * 15) % 40}%` 
            }}
          >
            <div className="h-2 w-2 rounded-full bg-red-500" />
          </div>
        ))}
      </div>
    </div>
  );
}
