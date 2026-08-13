"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, X } from "lucide-react";
import { ListingDetail } from "@/types";
import { api } from "@/lib/api-client";
import { useToast } from "@/components/ToastProvider";

interface BookingCardProps {
  listing: ListingDetail;
}

type BookedRange = { check_in: string; check_out: string };

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatShortDate(value: string): string {
  if (!value) return "";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function isDateBooked(day: string, ranges: BookedRange[]): boolean {
  return ranges.some((range) => day >= range.check_in && day < range.check_out);
}

function rangeIncludesBooked(start: string, end: string, ranges: BookedRange[]): boolean {
  if (!start || !end) return false;
  return ranges.some((range) => start < range.check_out && end > range.check_in);
}

export default function BookingCard({ listing }: BookingCardProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestsCount, setGuestsCount] = useState(1);
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    async function loadAvailability() {
      try {
        const res = await api.getAvailability(listing.id);
        setBookedRanges(res.booked_ranges);
      } catch (err) {
        console.error("Failed to load availability", err);
      }
    }
    loadAvailability();
  }, [listing.id]);

  const calendarDays = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from({ length: 63 }, (_, index) => addDays(today, index));
  }, []);

  const nights =
    checkIn && checkOut
      ? Math.max(0, Math.ceil((new Date(`${checkOut}T00:00:00`).getTime() - new Date(`${checkIn}T00:00:00`).getTime()) / 86400000))
      : 0;
  const basePrice = nights * listing.price_per_night;
  const cleaningFee = listing.cleaning_fee;
  const serviceFee = Math.round(basePrice * listing.service_fee_pct);
  const totalPrice = basePrice + cleaningFee + serviceFee;

  function selectDate(day: string) {
    if (isDateBooked(day, bookedRanges)) return;

    if (!checkIn || (checkIn && checkOut) || day < checkIn) {
      setCheckIn(day);
      setCheckOut("");
      return;
    }

    if (day === checkIn) {
      setCheckOut("");
      return;
    }

    if (rangeIncludesBooked(checkIn, day, bookedRanges)) {
      showToast("That range crosses unavailable dates. Choose another checkout.", "error");
      return;
    }
    setCheckOut(day);
  }

  function validateSelection(): boolean {
    if (!checkIn || !checkOut || nights <= 0) {
      showToast("Select a check-in and checkout date", "error");
      return false;
    }
    if (rangeIncludesBooked(checkIn, checkOut, bookedRanges)) {
      showToast("Selected dates overlap with an existing booking.", "error");
      return false;
    }
    if (guestsCount > listing.max_guests) {
      showToast(`This stay allows up to ${listing.max_guests} guests`, "error");
      return false;
    }
    return true;
  }

  function openConfirmation() {
    if (validateSelection()) setConfirmOpen(true);
  }

  async function confirmReservation() {
    setLoading(true);
    try {
      await api.createBooking({
        listing_id: listing.id,
        check_in: checkIn,
        check_out: checkOut,
        guests_count: guestsCount,
      });
      showToast("Booking confirmed", "success");
      router.push("/trips");
    } catch (err: any) {
      showToast(err.message || "Failed to create booking", "error");
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  }

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl md:sticky md:top-28">
        <div className="mb-5 flex items-baseline justify-between">
          <div>
            <span className="text-2xl font-bold">${listing.price_per_night}</span>
            <span className="text-sm font-normal text-gray-500"> night</span>
          </div>
          {listing.rating && (
            <div className="flex items-center gap-1 text-sm font-semibold">
              <Star className="h-4 w-4 fill-current" />
              <span>{listing.rating.toFixed(2)}</span>
              <span className="font-normal text-gray-400">({listing.review_count})</span>
            </div>
          )}
        </div>

        <div className="mb-4 overflow-hidden rounded-xl border border-gray-300">
          <div className="grid grid-cols-2 border-b border-gray-300">
            <div className="border-r border-gray-300 p-3">
              <span className="block text-[10px] font-extrabold uppercase text-gray-700">Check-in</span>
              <span className="text-sm font-medium">{checkIn ? formatShortDate(checkIn) : "Add date"}</span>
            </div>
            <div className="p-3">
              <span className="block text-[10px] font-extrabold uppercase text-gray-700">Checkout</span>
              <span className="text-sm font-medium">{checkOut ? formatShortDate(checkOut) : "Add date"}</span>
            </div>
          </div>
          <label className="block p-3">
            <span className="block text-[10px] font-extrabold uppercase text-gray-700">Guests</span>
            <select
              value={guestsCount}
              onChange={(event) => setGuestsCount(Number(event.target.value))}
              className="mt-0.5 w-full bg-transparent text-sm font-medium outline-none"
            >
              {Array.from({ length: listing.max_guests }, (_, index) => index + 1).map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "guest" : "guests"}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mb-4 rounded-2xl border border-gray-200 p-3">
          <div className="mb-2 grid grid-cols-7 text-center text-[11px] font-semibold text-gray-500">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
              <span key={`${day}-${index}`}>{day}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date) => {
              const day = toIsoDate(date);
              const booked = isDateBooked(day, bookedRanges);
              const selected = day === checkIn || day === checkOut;
              const inRange = checkIn && checkOut && day > checkIn && day < checkOut;

              return (
                <button
                  key={day}
                  type="button"
                  disabled={booked}
                  onClick={() => selectDate(day)}
                  className={`aspect-square rounded-full text-xs font-semibold transition ${
                    selected
                      ? "bg-gray-900 text-white"
                      : inRange
                        ? "bg-gray-100 text-gray-900"
                        : booked
                          ? "cursor-not-allowed text-gray-300 line-through"
                          : "text-gray-700 hover:bg-gray-100"
                  }`}
                  title={booked ? "Unavailable" : day}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span>Unavailable dates are crossed out</span>
            {(checkIn || checkOut) && (
              <button
                type="button"
                onClick={() => {
                  setCheckIn("");
                  setCheckOut("");
                }}
                className="font-semibold underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <button
          onClick={openConfirmation}
          disabled={loading}
          className="mb-4 w-full rounded-xl bg-primary px-4 py-3.5 font-semibold text-white shadow-md transition hover:bg-primary-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reserve
        </button>

        <p className="mb-6 text-center text-xs text-gray-500">You won&apos;t be charged yet</p>

        {nights > 0 && (
          <div className="space-y-3 border-t border-gray-200 pt-4 text-sm text-gray-600">
            <div className="flex justify-between">
              <span className="underline">${listing.price_per_night} x {nights} nights</span>
              <span>${basePrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="underline">Cleaning fee</span>
              <span>${cleaningFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="underline">Service fee</span>
              <span>${serviceFee}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-bold text-gray-900">
              <span>Total before taxes</span>
              <span>${totalPrice}</span>
            </div>
          </div>
        )}
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold">Confirm and reserve</h2>
                <p className="mt-1 text-sm text-gray-500">{listing.title}</p>
              </div>
              <button onClick={() => setConfirmOpen(false)} className="rounded-full p-2 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border p-3">
                  <span className="block text-[10px] font-bold uppercase text-gray-500">Dates</span>
                  <span className="font-semibold">{formatShortDate(checkIn)} - {formatShortDate(checkOut)}</span>
                </div>
                <div className="rounded-xl border p-3">
                  <span className="block text-[10px] font-bold uppercase text-gray-500">Guests</span>
                  <span className="font-semibold">{guestsCount} {guestsCount === 1 ? "guest" : "guests"}</span>
                </div>
              </div>

              <div className="rounded-xl border p-4">
                <div className="mb-2 font-semibold">Price details</div>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between"><span>${listing.price_per_night} x {nights} nights</span><span>${basePrice}</span></div>
                  <div className="flex justify-between"><span>Cleaning fee</span><span>${cleaningFee}</span></div>
                  <div className="flex justify-between"><span>Service fee</span><span>${serviceFee}</span></div>
                  <div className="flex justify-between border-t pt-3 font-bold text-gray-900"><span>Total</span><span>${totalPrice}</span></div>
                </div>
              </div>

              <p className="rounded-xl bg-gray-50 p-3 text-xs text-gray-600">
                Mock checkout: no real payment is processed. Confirming creates a persisted booking and blocks these dates.
              </p>
            </div>

            <button
              onClick={confirmReservation}
              disabled={loading}
              className="mt-5 w-full rounded-xl bg-primary px-4 py-3 font-bold text-white hover:bg-primary-dark disabled:opacity-50"
            >
              {loading ? "Confirming..." : "Confirm reservation"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
