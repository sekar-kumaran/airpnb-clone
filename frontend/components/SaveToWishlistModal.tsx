import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { api } from "@/lib/api-client";
import { useWishlist } from "./WishlistProvider";
import { useToast } from "./ToastProvider";

export default function SaveToWishlistModal({ listingId, onClose }: { listingId: number; onClose: () => void }) {
  const [folders, setFolders] = useState<{ name: string; count: number; cover_image: string | null }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  
  const { refreshWishlist } = useWishlist();
  const { showToast } = useToast();

  useEffect(() => {
    loadFolders();
  }, []);

  async function loadFolders() {
    try {
      const data = await api.getWishlistFolders();
      setFolders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(folderName: string) {
    try {
      await api.addToWishlist(listingId, folderName);
      await refreshWishlist();
      showToast(`Saved to ${folderName}`, "success");
      onClose();
    } catch (err) {
      showToast("Failed to save to wishlist", "error");
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    await handleSave(newFolderName.trim());
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-[560px] rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
          <h2 className="text-base font-bold">Save to wishlist</h2>
          <div className="w-9" /> {/* spacer for centering */}
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {loading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            </div>
          ) : isCreating ? (
            <form onSubmit={handleCreate} className="p-4">
              <h3 className="mb-4 text-xl font-semibold">Name this wishlist</h3>
              <input
                type="text"
                autoFocus
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Name"
                className="w-full rounded-xl border border-gray-400 p-4 text-lg focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                maxLength={50}
              />
              <p className="mt-2 text-sm text-gray-500">{newFolderName.length}/50 characters</p>
              <div className="mt-8 flex justify-between">
                <button type="button" onClick={() => setIsCreating(false)} className="font-semibold underline">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newFolderName.trim()}
                  className="rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-black disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <button
                onClick={() => setIsCreating(true)}
                className="flex aspect-square flex-col items-center justify-center rounded-2xl bg-gray-100 hover:bg-gray-200"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
                  <Plus className="h-6 w-6" />
                </div>
                <span className="mt-4 font-semibold">Create new</span>
              </button>

              {folders.map((folder) => (
                <button
                  key={folder.name}
                  onClick={() => handleSave(folder.name)}
                  className="group relative flex aspect-square flex-col overflow-hidden rounded-2xl"
                >
                  {folder.cover_image ? (
                    <img
                      src={folder.cover_image}
                      alt={folder.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-200" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-left text-white">
                    <p className="font-semibold">{folder.name}</p>
                    <p className="text-sm opacity-80">{folder.count} saved</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
