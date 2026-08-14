"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { useToast } from "@/components/ToastProvider";

export default function EditListingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    property_type: "House",
    price_per_night: 100,
    city: "",
    country: "",
    location: "",
    cover_image: "",
    max_guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getListing(Number(params.id));
        setFormData({
          title: data.title,
          description: data.description,
          property_type: data.property_type,
          price_per_night: data.price_per_night,
          city: data.city,
          country: data.country,
          location: (data as any).location || "",
          cover_image: (data as any).cover_image || "",
          max_guests: data.max_guests,
          bedrooms: data.bedrooms,
          beds: data.beds,
          bathrooms: data.bathrooms,
        });
      } catch (err: any) {
        showToast("Failed to load listing", "error");
        router.push("/host");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params.id, router, showToast]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateListing(Number(params.id), formData as any);
      showToast("Listing updated successfully!", "success");
      router.push("/host");
    } catch (err: any) {
      showToast(err.message || "Failed to update listing", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 lg:px-10 min-h-[60vh] flex justify-center items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:px-10 min-h-[60vh]">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight text-gray-900">Edit listing</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold">Title</label>
            <input required type="text" className="w-full rounded-xl border p-3" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold">Description</label>
            <textarea required className="w-full rounded-xl border p-3 min-h-[100px]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">City</label>
            <input required type="text" className="w-full rounded-xl border p-3" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Country</label>
            <input required type="text" className="w-full rounded-xl border p-3" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold">Location / Address</label>
            <input required type="text" className="w-full rounded-xl border p-3" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Property Type</label>
            <select className="w-full rounded-xl border p-3" value={formData.property_type} onChange={e => setFormData({...formData, property_type: e.target.value})}>
              <option>House</option>
              <option>Apartment</option>
              <option>Cabin</option>
              <option>Villa</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Price per night (USD)</label>
            <input required type="number" min="1" className="w-full rounded-xl border p-3" value={formData.price_per_night} onChange={e => setFormData({...formData, price_per_night: Number(e.target.value)})} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Max Guests</label>
            <input required type="number" min="1" className="w-full rounded-xl border p-3" value={formData.max_guests} onChange={e => setFormData({...formData, max_guests: Number(e.target.value)})} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Bedrooms</label>
            <input required type="number" min="1" className="w-full rounded-xl border p-3" value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: Number(e.target.value)})} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold">Cover Image URL</label>
            <input type="url" className="w-full rounded-xl border p-3" value={formData.cover_image} onChange={e => setFormData({...formData, cover_image: e.target.value})} />
          </div>
        </div>

        <div className="pt-6 border-t flex justify-end gap-4">
          <button type="button" onClick={() => router.push("/host")} className="px-6 py-3 font-semibold hover:bg-gray-50 rounded-xl transition">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="rounded-xl bg-[#FF385C] px-8 py-3 font-semibold text-white transition hover:bg-[#E31C5F] disabled:opacity-70">
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
