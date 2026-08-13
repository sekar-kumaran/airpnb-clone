"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import Image from "next/image";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HISTOGRAM_DATA = [
  10, 20, 15, 30, 45, 60, 40, 30, 50, 70, 90, 80, 60, 40, 20, 10, 5, 20, 35, 60, 85, 70, 50, 30, 15, 5,
  10, 25, 40, 20, 10, 5,
];

export default function FilterModal({ isOpen, onClose }: FilterModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [minPrice, setMinPrice] = useState(searchParams.get("min_price") || "4800");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("max_price") || "40000+");
  const [typeOfPlace, setTypeOfPlace] = useState(searchParams.get("property_type") || "Any type");
  
  // Recommended toggles
  const [recommended, setRecommended] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice && minPrice !== "4800") params.set("min_price", minPrice.replace(/\D/g, "")); else params.delete("min_price");
    if (maxPrice && maxPrice !== "40000+") params.set("max_price", maxPrice.replace(/\D/g, "")); else params.delete("max_price");
    if (typeOfPlace && typeOfPlace !== "Any type") params.set("property_type", typeOfPlace); else params.delete("property_type");
    
    router.push(`/search?${params.toString()}`);
    onClose();
  };

  const handleClear = () => {
    setMinPrice("4800");
    setMaxPrice("40000+");
    setTypeOfPlace("Any type");
    setRecommended([]);
  };

  const toggleRecommended = (item: string) => {
    setRecommended(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6">
      <div className="relative flex max-h-[90vh] w-full max-w-[780px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex h-[72px] shrink-0 items-center justify-center border-b border-gray-200 px-6">
          <button onClick={onClose} className="absolute left-6 rounded-full p-2 hover:bg-gray-100 transition">
            <X className="h-5 w-5 text-gray-800" />
          </button>
          <h2 className="text-[16px] font-bold text-gray-900">Filters</h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:px-8">
          
          {/* Recommended for you */}
          <section className="pb-8 border-b border-gray-200">
            <h3 className="text-[22px] font-semibold text-gray-900 mb-6">Recommended for you</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { id: "Kitchen", icon: "🍳" },
                { id: "Instant Book", icon: "⚡" },
                { id: "Free parking", icon: "🅿️" },
                { id: "1+ bathrooms", icon: "🚽" },
              ].map((item) => {
                const isActive = recommended.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleRecommended(item.id)}
                    className={`flex flex-col items-start justify-between rounded-xl border p-4 h-[120px] transition ${
                      isActive ? "border-gray-900 bg-gray-50 ring-1 ring-gray-900" : "border-gray-200 hover:border-gray-900"
                    }`}
                  >
                    <span className="text-3xl">{item.icon}</span>
                    <span className="text-[15px] font-medium text-gray-900">{item.id}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Type of place */}
          <section className="py-8 border-b border-gray-200">
            <h3 className="text-[22px] font-semibold text-gray-900 mb-6">Type of place</h3>
            <div className="flex w-full overflow-hidden rounded-xl border border-gray-300 bg-white">
              {["Any type", "Room", "Entire home"].map((type, i) => (
                <button
                  key={type}
                  onClick={() => setTypeOfPlace(type)}
                  className={`flex-1 py-4 text-[15px] font-medium transition ${
                    typeOfPlace === type
                      ? "bg-white text-gray-900 ring-2 ring-gray-900 z-10 rounded-xl"
                      : "bg-white text-gray-600 hover:text-gray-900"
                  } ${i !== 0 && typeOfPlace !== type ? "border-l border-gray-300" : ""}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </section>

          {/* Price range */}
          <section className="py-8">
            <h3 className="text-[22px] font-semibold text-gray-900 mb-1">Price range</h3>
            <p className="text-[15px] text-gray-500 mb-8">Trip price, includes all fees</p>
            
            <div className="relative pt-12 pb-8 px-2 max-w-lg mx-auto">
              {/* Histogram */}
              <div className="absolute bottom-16 left-2 right-2 flex items-end justify-between h-20 gap-[2px]">
                {HISTOGRAM_DATA.map((val, i) => (
                  <div
                    key={i}
                    className="w-full bg-[#B0B0B0] rounded-sm"
                    style={{ height: `${val}%` }}
                  />
                ))}
                {/* Active overlay (mocked for visual) */}
                <div className="absolute inset-y-0 left-[10%] right-[20%] flex items-end justify-between gap-[2px]">
                  {HISTOGRAM_DATA.slice(3, 25).map((val, i) => (
                     <div
                     key={`active-${i}`}
                     className="w-full bg-[#FF385C] rounded-sm"
                     style={{ height: `${val}%` }}
                   />
                  ))}
                </div>
              </div>

              {/* Slider Track */}
              <div className="relative h-1 w-full rounded-full bg-gray-200">
                <div className="absolute left-[10%] right-[20%] h-full rounded-full bg-[#FF385C]" />
                
                {/* Thumbs */}
                <div className="absolute -top-3 left-[10%] -ml-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white shadow-md">
                  <div className="flex gap-0.5">
                    <span className="h-2 w-px bg-gray-300" /><span className="h-2 w-px bg-gray-300" /><span className="h-2 w-px bg-gray-300" />
                  </div>
                </div>
                <div className="absolute -top-3 right-[20%] -mr-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white shadow-md">
                  <div className="flex gap-0.5">
                    <span className="h-2 w-px bg-gray-300" /><span className="h-2 w-px bg-gray-300" /><span className="h-2 w-px bg-gray-300" />
                  </div>
                </div>
              </div>

              {/* Min / Max Inputs */}
              <div className="mt-8 flex items-center gap-4">
                <div className="flex-1 rounded-2xl border border-gray-400 px-4 py-2 focus-within:border-black focus-within:ring-1 focus-within:ring-black">
                  <label className="block text-[12px] text-gray-500">Minimum</label>
                  <div className="flex items-center">
                    <span className="text-[15px]">₹</span>
                    <input
                      type="text"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full bg-transparent p-0 text-[15px] border-none focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>
                <span className="text-gray-400">-</span>
                <div className="flex-1 rounded-2xl border border-gray-400 px-4 py-2 focus-within:border-black focus-within:ring-1 focus-within:ring-black">
                  <label className="block text-[12px] text-gray-500">Maximum</label>
                  <div className="flex items-center">
                    <span className="text-[15px]">₹</span>
                    <input
                      type="text"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full bg-transparent p-0 text-[15px] border-none focus:outline-none focus:ring-0"
                    />
                  </div>
                </div>
              </div>
            </div>

          </section>

        </div>

        {/* Footer */}
        <div className="flex h-[84px] shrink-0 items-center justify-between border-t border-gray-200 px-6">
          <button
            onClick={handleClear}
            className="text-[15px] font-semibold text-gray-900 underline hover:text-black"
          >
            Clear all
          </button>
          <button
            onClick={handleApply}
            className="rounded-lg bg-gray-900 px-6 py-3.5 text-[15px] font-bold text-white hover:bg-black transition"
          >
            Show 193 places
          </button>
        </div>

      </div>
    </div>
  );
}
