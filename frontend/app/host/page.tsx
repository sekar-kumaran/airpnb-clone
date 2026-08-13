"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CalendarDays, DollarSign, Home, Users } from "lucide-react";
import { api } from "@/lib/api-client";
import { useToast } from "@/components/ToastProvider";
import ConfirmDialog from "@/components/ConfirmDialog";
import type { Booking, ListingCard } from "@/types";

export default function HostDashboardPage() {
  const [listings, setListings] = useState<ListingCard[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [listingToDelete, setListingToDelete] = useState<number | null>(null);
  const { showToast } = useToast();

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const [listingData, bookingData] = await Promise.all([
        api.myListings(),
        api.hostBookings(),
      ]);
      setListings(listingData);
      setBookings(bookingData);
    } catch (err: any) {
      showToast(err.message || "Failed to load host dashboard", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const stats = useMemo(() => {
    const confirmed = bookings.filter((booking) => booking.status === "confirmed");
    return {
      listings: listings.length,
      reservations: confirmed.length,
      guests: confirmed.reduce((sum, booking) => sum + booking.guests_count, 0),
      revenue: confirmed.reduce((sum, booking) => sum + booking.total_price, 0),
    };
  }, [bookings, listings.length]);

  async function handleDelete(id: number) {
    try {
      await api.deleteListing(id);
      showToast("Listing deleted", "success");
      setListingToDelete(null);
      fetchDashboard();
    } catch (err: any) {
      showToast(err.message || "Failed to delete listing", "error");
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-gray-500">Host mode</p>
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500">Manage stays, reservations, and listing performance.</p>
        </div>
        <Link
          href="/host/listings/new"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-dark"
        >
          + New listing
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Listings", value: stats.listings, icon: Home },
          { label: "Reservations", value: stats.reservations, icon: CalendarDays },
          { label: "Guests hosted", value: stats.guests, icon: Users },
          { label: "Revenue", value: `$${Math.round(stats.revenue)}`, icon: DollarSign },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-gray-200 p-5">
            <item.icon className="mb-3 h-5 w-5 text-primary" />
            <div className="text-2xl font-bold">{item.value}</div>
            <div className="text-sm text-gray-500">{item.label}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-24 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your listings</h2>
              <span className="text-sm text-gray-500">{listings.length} total</span>
            </div>

            {listings.length === 0 ? (
              <div className="rounded-2xl border bg-gray-50 py-16 text-center">
                <h3 className="mb-2 text-xl font-semibold">No listings yet</h3>
                <p className="mb-6 text-gray-500">Create your first listing and start hosting.</p>
                <Link
                  href="/host/listings/new"
                  className="inline-block rounded-xl bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark"
                >
                  Create a listing
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="flex items-center gap-5 rounded-xl border p-4 transition hover:shadow-md"
                  >
                    <div className="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={listing.cover_image || "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7"}
                        alt={listing.title}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>

                    <div className="min-w-0 flex-grow">
                      <h3 className="truncate text-base font-bold">{listing.title}</h3>
                      <p className="text-sm text-gray-500">
                        {listing.city}, {listing.country}
                      </p>
                      <p className="mt-0.5 text-sm font-semibold">${listing.price_per_night} / night</p>
                    </div>

                    <div className="flex flex-shrink-0 items-center gap-3">
                      <Link
                        href={`/host/listings/${listing.id}/edit`}
                        className="rounded-lg border px-4 py-2 text-sm font-semibold transition hover:bg-gray-50"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setListingToDelete(listing.id)}
                        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Reservations</h2>
              <span className="text-sm text-gray-500">{bookings.length} total</span>
            </div>

            {bookings.length === 0 ? (
              <div className="rounded-2xl border bg-gray-50 p-8 text-sm text-gray-500">
                Reservations across your listings will appear here.
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border">
                <div className="max-h-[620px] divide-y overflow-auto">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link href={`/listing/${booking.listing?.id}`} className="font-semibold hover:underline">
                            {booking.listing?.title || `Listing #${booking.listing_id}`}
                          </Link>
                          <p className="mt-1 text-sm text-gray-500">
                            {booking.check_in} to {booking.check_out}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {booking.guests_count} {booking.guests_count === 1 ? "guest" : "guests"} · ${booking.total_price}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold capitalize ${
                            booking.status === "confirmed"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {listingToDelete !== null && (
        <ConfirmDialog
          title="Delete this listing?"
          message="This removes the listing from the public grid and your host dashboard."
          confirmLabel="Delete listing"
          tone="danger"
          onCancel={() => setListingToDelete(null)}
          onConfirm={() => handleDelete(listingToDelete)}
        />
      )}
    </div>
  );
}
