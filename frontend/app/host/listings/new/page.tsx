"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { useToast } from "@/components/ToastProvider";

interface AmenityOption {
  id: number;
  name: string;
  icon: string | null;
}

interface CategoryOption {
  id: number;
  name: string;
  icon: string | null;
}

export default function NewListingPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [amenities, setAmenities] = useState<AmenityOption[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [propertyType, setPropertyType] = useState("Apartment");
  const [pricePerNight, setPricePerNight] = useState("");
  const [cleaningFee, setCleaningFee] = useState("");
  const [serviceFeePct, setServiceFeePct] = useState("12");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [maxGuests, setMaxGuests] = useState("2");
  const [bedrooms, setBedrooms] = useState("1");
  const [beds, setBeds] = useState("1");
  const [bathrooms, setBathrooms] = useState("1");
  const [imageUrls, setImageUrls] = useState<string[]>([""]);
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    api.getAmenities().then(setAmenities).catch(() => {});
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  const handleAddImage = () => setImageUrls([...imageUrls, ""]);
  const handleRemoveImage = (idx: number) => setImageUrls(imageUrls.filter((_, i) => i !== idx));

  const toggleAmenity = (id: number) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const validate = (): string | null => {
    if (!title.trim()) return "Title is required";
    if (!description.trim()) return "Description is required";
    if (!pricePerNight || Number(pricePerNight) <= 0) return "Price per night must be positive";
    if (!city.trim()) return "City is required";
    if (!country.trim()) return "Country is required";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      showToast(error, "error");
      return;
    }

    setLoading(true);
    try {
      await api.createListing({
        title: title.trim(),
        description: description.trim(),
        property_type: propertyType,
        price_per_night: Number(pricePerNight),
        cleaning_fee: Number(cleaningFee) || 0,
        service_fee_pct: (Number(serviceFeePct) || 12) / 100,
        city: city.trim(),
        country: country.trim(),
        max_guests: Number(maxGuests),
        bedrooms: Number(bedrooms),
        beds: Number(beds),
        bathrooms: Number(bathrooms),
        image_urls: imageUrls.filter((u) => u.trim()),
        amenity_ids: selectedAmenities,
        category_ids: selectedCategory ? [selectedCategory] : [],
      });
      showToast("Listing created successfully!", "success");
      router.push("/host");
    } catch (err: any) {
      showToast(err.message || "Failed to create listing", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Create a new listing</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Cozy beachfront villa"
            className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Describe your place..."
            className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
          />
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-semibold mb-1">Property type</label>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            {["Apartment", "House", "Villa", "Cabin", "Cottage", "Loft", "Condo"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Price / night ($)</label>
            <input
              type="number"
              min="1"
              value={pricePerNight}
              onChange={(e) => setPricePerNight(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Cleaning fee ($)</label>
            <input
              type="number"
              min="0"
              value={cleaningFee}
              onChange={(e) => setCleaningFee(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Service fee %</label>
            <input
              type="number"
              min="0"
              max="50"
              value={serviceFeePct}
              onChange={(e) => setServiceFeePct(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="San Francisco"
              className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Country</label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="United States"
              className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        {/* Capacity */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Guests", value: maxGuests, setter: setMaxGuests },
            { label: "Bedrooms", value: bedrooms, setter: setBedrooms },
            { label: "Beds", value: beds, setter: setBeds },
            { label: "Bathrooms", value: bathrooms, setter: setBathrooms },
          ].map(({ label, value, setter }) => (
            <div key={label}>
              <label className="block text-sm font-semibold mb-1">{label}</label>
              <input
                type="number"
                min="1"
                max="50"
                value={value}
                onChange={(e) => setter(e.target.value)}
                className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          ))}
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-semibold mb-2">Image URLs</label>
          {imageUrls.map((url, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  const updated = [...imageUrls];
                  updated[idx] = e.target.value;
                  setImageUrls(updated);
                }}
                placeholder="https://..."
                className="flex-1 border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              {imageUrls.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="px-3 text-red-500 hover:bg-red-50 rounded-lg text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddImage}
            className="text-sm text-rose-500 font-semibold hover:underline"
          >
            + Add another image
          </button>
        </div>

        {/* Amenities */}
        {amenities.length > 0 && (
          <div>
            <label className="block text-sm font-semibold mb-2">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {amenities.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => toggleAmenity(a.id)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition ${
                    selectedAmenities.includes(a.id)
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-700 border-gray-300 hover:border-black"
                  }`}
                >
                  {a.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category */}
        {categories.length > 0 && (
          <div>
            <label className="block text-sm font-semibold mb-1">Category</label>
            <select
              value={selectedCategory ?? ""}
              onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
              className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="">Select a category (optional)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 transition disabled:opacity-50 text-base"
        >
          {loading ? "Publishing..." : "Publish Listing"}
        </button>
      </form>
    </div>
  );
}
