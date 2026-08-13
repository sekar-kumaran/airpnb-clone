"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { Booking } from "@/types";
import { useToast } from "@/components/ToastProvider";

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function TripsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/");
      return;
    }
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function loadBookings() {
    setLoading(true);
    try {
      const data = await api.myBookings();
      setBookings(data);
    } catch (err: any) {
      showToast(err.message || "Failed to load trips", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(id: number) {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
    try {
      await api.cancelBooking(id);
      showToast("Reservation cancelled", "success");
      loadBookings();
    } catch (err: any) {
      showToast(err.message || "Failed to cancel reservation", "error");
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-[1120px] px-6 py-12 lg:px-10">
        <h1 className="mb-8 text-3xl font-semibold tracking-tight text-gray-900">Trips</h1>
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-12 lg:px-10 min-h-[60vh]">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight text-gray-900">Trips</h1>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 p-8 sm:p-12 text-center shadow-sm">
          <h2 className="mb-2 text-2xl font-semibold text-gray-900">No trips booked... yet!</h2>
          <p className="mb-6 text-gray-600">Time to dust off your bags and start planning your next adventure.</p>
          <Link
            href="/"
            className="inline-block rounded-xl border border-gray-900 px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-50"
          >
            Start searching
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => {
            const isCancelled = booking.status === "cancelled";
            const isPast = new Date(booking.check_out) < new Date();
            
            return (
              <div key={booking.id} className={`group flex flex-col overflow-hidden rounded-2xl border border-gray-200 shadow-sm transition-shadow hover:shadow-md ${isCancelled ? 'opacity-60 grayscale' : ''}`}>
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                  {booking.listing.cover_image && (
                    <Image
                      src={booking.listing.cover_image}
                      alt={booking.listing.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  )}
                  {isCancelled && (
                    <div className="absolute left-3 top-3 rounded-lg bg-gray-900/80 px-3 py-1 text-sm font-semibold text-white">
                      Cancelled
                    </div>
                  )}
                  {isPast && !isCancelled && (
                    <div className="absolute left-3 top-3 rounded-lg bg-gray-900/80 px-3 py-1 text-sm font-semibold text-white">
                      Past Trip
                    </div>
                  )}
                </div>
                
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">{booking.listing.city}</p>
                    <h3 className="line-clamp-1 text-base font-semibold text-gray-900">{booking.listing.title}</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {fmtDate(booking.check_in)} – {fmtDate(booking.check_out)}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {booking.guests_count} guest{booking.guests_count > 1 ? "s" : ""}
                    </p>
                  </div>
                  
                  <div className="mt-auto border-t border-gray-100 pt-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-900">{formatINR(booking.total_price)}</p>
                      
                      {!isCancelled && !isPast && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="text-sm font-semibold text-[#E31C5F] hover:underline"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
