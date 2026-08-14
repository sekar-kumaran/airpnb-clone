"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { useWishlist } from "@/components/WishlistProvider";

export default function WishlistPage() {
  const router = useRouter();
  const { loading: wishlistLoading } = useWishlist();
  const [folders, setFolders] = useState<{ name: string; count: number; cover_image: string | null }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/");
      return;
    }
    loadFolders();
  }, [router]);

  async function loadFolders() {
    setLoading(true);
    try {
      const data = await api.getWishlistFolders();
      setFolders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

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

      {folders.length === 0 ? (
        <div className="py-12">
          <h2 className="mb-2 text-2xl font-semibold text-gray-900">Create your first wishlist</h2>
          <p className="mb-8 text-gray-600">
            As you search, tap the heart icon to save your favourite places to stay or things to do to a wishlist.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:gap-x-6">
          {folders.map((folder) => (
            <Link key={folder.name} href={`/wishlist/${encodeURIComponent(folder.name)}`} className="group block">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-200">
                {folder.cover_image && (
                  <img
                    src={folder.cover_image}
                    alt={folder.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              </div>
              <div className="mt-4">
                <h3 className="text-[22px] font-semibold text-gray-900">{folder.name}</h3>
                <p className="text-sm text-gray-500">{folder.count} saved</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
