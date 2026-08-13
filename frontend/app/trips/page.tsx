"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { useToast } from "@/components/ToastProvider";
import ConfirmDialog from "@/components/ConfirmDialog";
import type { Booking } from "@/types";

export default function TripsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingToCancel, setBookingToCancel] = useState<number | null>(null);
  const { showToast } = useToast();

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.myBookings();
      setBookings(data);
    } catch (err: any) {
      showToast(err.message || "Failed to load trips", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancel = async (bookingId: number) => {
    try {
      await api.cancelBooking(bookingId);
      showToast("Reservation cancelled successfully", "success");
      setBookingToCancel(null);
      fetchBookings();
    } catch (err: any) {
      showToast(err.message || "Failed to cancel reservation", "error");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Trips</h1>
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="h-32 bg-gray-100 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Trips</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-16 border rounded-2xl bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">No trips booked... yet!</h2>
          <p className="text-gray-500 mb-6">Time to dust off your bags and start planning your next adventure.</p>
          <Link
            href="/search"
            className="inline-block px-6 py-3 bg-rose-500 text-white font-semibold rounded-xl hover:bg-rose-600 transition"
          >
            Start searching
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="border rounded-2xl overflow-hidden flex flex-col sm:flex-row shadow-sm hover:shadow-md transition"
            >
              <div className="relative w-full sm:w-48 h-48 sm:h-auto bg-gray-100 flex-shrink-0">
                <Image
                  src={booking.listing.cover_image || "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7"}
                  alt={booking.listing.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex justify-between items-start">
                    <span
                      className={`text-xs font-bold uppercase px-2 py-0.5 rounded-md ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                    <span className="text-xs text-gray-500">#{booking.id}</span>
                  </div>

                  <Link href={`/listing/${booking.listing.id}`} className="hover:underline">
                    <h3 className="font-bold text-lg mt-2 line-clamp-1">{booking.listing.title}</h3>
                  </Link>

                  <p className="text-sm text-gray-500 mt-1">{booking.listing.location}</p>

                  <div className="mt-3 text-sm space-y-1">
                    <p>
                      <span className="font-semibold">Dates:</span> {booking.check_in} to {booking.check_out}
                    </p>
                    <p>
                      <span className="font-semibold">Guests:</span> {booking.guests_count}
                    </p>
                    <p>
                      <span className="font-semibold">Total Price:</span> ${booking.total_price}
                    </p>
                  </div>
                </div>

                {booking.status === "confirmed" && (
                  <button
                    onClick={() => setBookingToCancel(booking.id)}
                    className="mt-4 px-4 py-2 border border-gray-300 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition self-start"
                  >
                    Cancel Reservation
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {bookingToCancel !== null && (
        <ConfirmDialog
          title="Cancel this reservation?"
          message="The trip will remain visible in your history with a cancelled status."
          confirmLabel="Cancel reservation"
          tone="danger"
          onCancel={() => setBookingToCancel(null)}
          onConfirm={() => handleCancel(bookingToCancel)}
        />
      )}
    </div>
  );
}
