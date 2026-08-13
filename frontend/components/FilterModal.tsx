"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterModal({ isOpen, onClose }: FilterModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "");
  const [propertyType, setPropertyType] = useState(searchParams.get("property_type") || "");
  const [guests, setGuests] = useState(searchParams.get("guests") || "");

  useEffect(() => {
    setMinPrice(searchParams.get("min_price") || "");
    setMaxPrice(searchParams.get("max_price") || "");
    setPropertyType(searchParams.get("property_type") || "");
    setGuests(searchParams.get("guests") || "");
  }, [searchParams]);

  if (!isOpen) return null;

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (minPrice) params.set("min_price", minPrice); else params.delete("min_price");
    if (maxPrice) params.set("max_price", maxPrice); else params.delete("max_price");
    if (propertyType) params.set("property_type", propertyType); else params.delete("property_type");
    if (guests) params.set("guests", guests); else params.delete("guests");

    router.push(`/search?${params.toString()}`);
    onClose();
  };

  const handleClear = () => {
    setMinPrice("");
    setMaxPrice("");
    setPropertyType("");
    setGuests("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Price Range */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Price range</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 border rounded-lg p-2">
                <label className="text-[10px] text-gray-500 block uppercase font-bold">Minimum</label>
                <input
                  type="number"
                  placeholder="$0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none"
                />
              </div>
              <span className="text-gray-400">-</span>
              <div className="flex-1 border rounded-lg p-2">
                <label className="text-[10px] text-gray-500 block uppercase font-bold">Maximum</label>
                <input
                  type="number"
                  placeholder="$1000+"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Property Type */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Property type</h3>
            <div className="grid grid-cols-2 gap-3">
              {["Entire home", "Apartment", "House", "Villa", "Cabin", "Private room", "Bungalow", "Farmhouse"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setPropertyType(propertyType === type ? "" : type)}
                  className={`p-3 border rounded-xl text-left text-sm transition font-medium ${
                    propertyType === type
                      ? "border-black bg-gray-50 ring-1 ring-black"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Guests */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Minimum Guests</h3>
            <input
              type="number"
              min="1"
              max="20"
              placeholder="Any"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:border-black"
            />
          </div>
        </div>

        <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClear}
            className="text-sm font-semibold underline text-gray-700 hover:text-black"
          >
            Clear all
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2.5 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition"
          >
            Show results
          </button>
        </div>
      </div>
    </div>
  );
}
