"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { useToast } from "@/components/ToastProvider";
import SaveToWishlistModal from "./SaveToWishlistModal";

interface WishlistContextType {
  wishlist: Set<number>;
  toggleWishlist: (listingId: number) => void;
  refreshWishlist: () => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlist: new Set(),
  toggleWishlist: () => {},
  refreshWishlist: async () => {},
  loading: false,
});

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [activeModalListingId, setActiveModalListingId] = useState<number | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      loadWishlist();
    }
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

  function toggleWishlist(listingId: number) {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      showToast("Please log in to save to your wishlist", "error");
      return;
    }
    // Always open modal to manage folders
    setActiveModalListingId(listingId);
  }

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, refreshWishlist: loadWishlist, loading }}>
      {children}
      {activeModalListingId !== null && (
        <SaveToWishlistModal 
          listingId={activeModalListingId} 
          onClose={() => setActiveModalListingId(null)} 
        />
      )}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
