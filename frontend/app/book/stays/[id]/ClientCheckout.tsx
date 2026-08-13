"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, Star } from "lucide-react";
import { ListingDetail } from "@/types";
import { api } from "@/lib/api-client";
import { useToast } from "@/components/ToastProvider";
import AuthModal from "@/components/AuthModal";

interface ClientCheckoutProps {
  listing: ListingDetail;
  searchParams: { checkin?: string; checkout?: string; adults?: string; children?: string; infants?: string; pets?: string };
}

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);
}

function fmtDateRange(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return "";
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  
  const d1Format = d1.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const d2Format = d2.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  
  if (d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()) {
    return `${d1.getDate()}–${d2Format}`;
  }
  return `${d1Format} – ${d2Format}`;
}

export default function ClientCheckout({ listing, searchParams }: ClientCheckoutProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      api.me().then(setUser).catch(() => {});
    }
  }, []);

  const checkIn = searchParams.checkin || "";
  const checkOut = searchParams.checkout || "";
  const adults = Number(searchParams.adults) || 1;
  const children = Number(searchParams.children) || 0;
  const infants = Number(searchParams.infants) || 0;
  const pets = Number(searchParams.pets) || 0;
  const guestsCount = adults + children;

  const nights = checkIn && checkOut
    ? Math.max(0, Math.ceil((new Date(`${checkOut}T00:00:00`).getTime() - new Date(`${checkIn}T00:00:00`).getTime()) / 86400000))
    : 0;

  const basePrice = nights * listing.price_per_night;
  const cleaningFee = listing.cleaning_fee;
  const serviceFee = Math.round(basePrice * listing.service_fee_pct);
  const taxes = Math.round(basePrice * 0.18); // 18% mock tax
  const earlyDiscount = Math.round(basePrice * 0.1); // 10% mock discount
  
  const totalPrice = basePrice + cleaningFee + serviceFee + taxes - earlyDiscount;

  async function handleConfirm() {
    if (!user) return setAuthOpen(true);
    setLoading(true);
    try {
      await api.createBooking({
        listing_id: listing.id,
        check_in: checkIn,
        check_out: checkOut,
        guests_count: guestsCount,
      });
      showToast("Reservation confirmed!", "success");
      router.push("/trips");
    } catch (err: any) {
      showToast(err.message || "Failed to confirm reservation", "error");
    } finally {
      setLoading(false);
    }
  }

  const cancelDate = new Date(checkIn);
  cancelDate.setDate(cancelDate.getDate() - 1);
  const cancelDateStr = cancelDate.toLocaleDateString("en-IN", { day: "numeric", month: "long" });

  return (
    <div className="min-h-screen bg-white">
      {/* Checkout Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-6 sm:px-10">
        <button onClick={() => router.back()} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition -ml-2 mb-4">
          <ChevronLeft className="h-5 w-5 text-gray-800" />
        </button>
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Confirm and pay</h1>
      </div>

      <div className="mx-auto max-w-[1120px] px-6 py-12 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_420px] lg:gap-24">
          {/* LEFT SIDE: STEPS */}
          <div className="space-y-6">
            
            {/* 1. Log in or sign up */}
            <section className="rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">1. Log in or sign up</h2>
                  {user && (
                    <div className="mt-2 text-sm text-gray-600">
                      Logged in as <span className="font-semibold text-gray-900">{user.name}</span> ({user.email})
                    </div>
                  )}
                </div>
                {!user ? (
                  <button onClick={() => setAuthOpen(true)} className="rounded-xl bg-[#E31C5F] px-6 py-3 font-semibold text-white transition hover:bg-[#C11750]">
                    Continue
                  </button>
                ) : (
                  <button onClick={() => { localStorage.removeItem("userId"); setUser(null); }} className="text-sm font-semibold underline text-gray-600 hover:text-gray-900">
                    Log out
                  </button>
                )}
              </div>
            </section>

            {/* 2. Add a payment method */}
            <section className={`rounded-2xl border border-gray-200 p-6 ${!user ? "opacity-50 grayscale pointer-events-none" : "shadow-sm"}`}>
              <h2 className="text-xl font-semibold text-gray-900">2. Add a payment method</h2>
              {user && (
                <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">Visa •••• 4242</span>
                    <button className="text-sm font-semibold underline text-gray-900">Edit</button>
                  </div>
                </div>
              )}
            </section>

            {/* 3. Review your reservation */}
            <section className={`rounded-2xl border border-gray-200 p-6 ${!user ? "opacity-50 grayscale pointer-events-none" : "shadow-sm"}`}>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">3. Review your reservation</h2>
              <p className="mb-6 text-sm text-gray-600">
                By selecting the button below, I agree to the House Rules, Ground Rules for Guests, Airbnb's Rebooking and Refund Policy, and that Airbnb can charge my payment method if I'm responsible for damage.
              </p>
              <button
                onClick={handleConfirm}
                disabled={loading || !user}
                className="rounded-xl bg-[#E31C5F] px-8 py-4 text-base font-bold text-white transition hover:bg-[#C11750] disabled:opacity-50"
              >
                {loading ? "Confirming..." : "Confirm and pay"}
              </button>
            </section>

          </div>

          {/* RIGHT SIDE: BOOKING SUMMARY CARD */}
          <div className="relative">
            <div className="sticky top-28 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              {/* Header */}
              <div className="mb-6 flex gap-4 border-b border-gray-200 pb-6">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  {listing.cover_image && (
                    <Image src={listing.cover_image} alt={listing.title} fill className="object-cover" sizes="96px" />
                  )}
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{listing.property_type}</p>
                    <h3 className="text-sm font-medium leading-tight text-gray-900">{listing.title}</h3>
                  </div>
                  {listing.rating && (
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="h-3 w-3 fill-current text-gray-900" />
                      <span className="font-semibold text-gray-900">{listing.rating.toFixed(2)}</span>
                      <span className="text-gray-500">({listing.review_count})</span>
                      <span className="text-gray-500 ml-1">🏆 Guest favourite</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Free cancellation */}
              <div className="mb-6 border-b border-gray-200 pb-6">
                <h4 className="text-base font-semibold text-gray-900 mb-1">Free cancellation</h4>
                <p className="text-sm text-gray-600">
                  Cancel before {cancelDateStr} for a full refund. <span className="underline font-semibold cursor-pointer text-gray-900">Full policy</span>
                </p>
              </div>

              {/* Dates & Guests */}
              <div className="mb-6 space-y-4 border-b border-gray-200 pb-6">
                <div className="flex justify-between">
                  <div>
                    <h4 className="text-base font-semibold text-gray-900">Dates</h4>
                    <p className="text-sm text-gray-600">{fmtDateRange(checkIn, checkOut)}</p>
                  </div>
                  <button onClick={() => router.back()} className="text-sm font-semibold underline text-gray-900">Change</button>
                </div>
                <div className="flex justify-between">
                  <div>
                    <h4 className="text-base font-semibold text-gray-900">Guests</h4>
                    <p className="text-sm text-gray-600">
                      {guestsCount} guest{guestsCount !== 1 ? "s" : ""}
                      {infants > 0 ? `, ${infants} infant${infants !== 1 ? "s" : ""}` : ""}
                      {pets > 0 ? `, ${pets} pet${pets !== 1 ? "s" : ""}` : ""}
                    </p>
                  </div>
                  <button onClick={() => router.back()} className="text-sm font-semibold underline text-gray-900">Change</button>
                </div>
              </div>

              {/* Price details */}
              <div className="mb-6 border-b border-gray-200 pb-6">
                <h4 className="text-base font-semibold text-gray-900 mb-4">Price details</h4>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span className="underline">{nights} night{nights !== 1 ? "s" : ""} × {formatINR(listing.price_per_night)}</span>
                    <span>{formatINR(basePrice)}</span>
                  </div>
                  {earlyDiscount > 0 && (
                    <div className="flex justify-between text-green-700">
                      <span>Early booking discount</span>
                      <span>-{formatINR(earlyDiscount)}</span>
                    </div>
                  )}
                  {cleaningFee > 0 && (
                    <div className="flex justify-between">
                      <span className="underline">Cleaning fee</span>
                      <span>{formatINR(cleaningFee)}</span>
                    </div>
                  )}
                  {serviceFee > 0 && (
                    <div className="flex justify-between">
                      <span className="underline">Airbnb service fee</span>
                      <span>{formatINR(serviceFee)}</span>
                    </div>
                  )}
                  {taxes > 0 && (
                    <div className="flex justify-between">
                      <span className="underline">Taxes</span>
                      <span>{formatINR(taxes)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-2">
                <div>
                  <h4 className="text-base font-bold text-gray-900">Total <span className="underline">INR</span></h4>
                  <button className="text-sm font-semibold underline text-gray-600 mt-1 hover:text-gray-900">Price breakdown</button>
                </div>
                <span className="text-base font-bold text-gray-900">{formatINR(totalPrice)}</span>
              </div>
            </div>

            {/* Rare find banner */}
            <div className="sticky top-[700px] mt-6 flex items-center justify-center gap-2 rounded-xl bg-[#FFF8F0] p-4 text-sm font-semibold text-gray-900 border border-gray-100 shadow-sm">
              <span className="text-[#E31C5F]">💎</span> Rare find! This place is usually booked
            </div>
          </div>
        </div>
      </div>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onSuccess={setUser} />
    </div>
  );
}
