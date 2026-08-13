"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { useToast } from "@/components/ToastProvider";

interface WishlistContextType {
  wishlist: Set<number>;
  toggleWishlist: (listingId: number) => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: new Set(),
  toggleWishlist: async () => {},
  loading: false,
});

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    // Only load wishlist if user is logged in
    const userId = localStorage.getItem("userId");
    if (userId) {
      loadWishlist();
    }
    // We poll localStorage occasionally or listen to an event if auth changes, 
    // but a simple mount check is fine for this mock.
  }, []);

  async function loadWishlist() {
    setLoading(true);
    try {
      const items = await api.getWishlist();
      setWishlist(new Set(items.map((i) => i.id)));
    } catch (err: any) {
      console.error("Failed to load wishlist", err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleWishlist(listingId: number) {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      showToast("Please log in to save to your wishlist", "error");
      return;
    }

    const isSaved = wishlist.has(listingId);
    
    // Optimistic update
    const newWishlist = new Set(wishlist);
    if (isSaved) newWishlist.delete(listingId);
    else newWishlist.add(listingId);
    setWishlist(newWishlist);

    try {
      if (isSaved) {
        await api.removeFromWishlist(listingId);
      } else {
        await api.addToWishlist(listingId);
      }
    } catch (err: any) {
      // Revert on failure
      setWishlist(wishlist);
      showToast("Failed to update wishlist", "error");
    }
  }

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
