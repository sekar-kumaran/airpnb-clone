"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, X, ChevronDown, Minus, Plus } from "lucide-react";
import { ListingDetail } from "@/types";
import { api } from "@/lib/api-client";
import { useToast } from "@/components/ToastProvider";

interface BookingCardProps { listing: ListingDetail; }
type BookedRange = { check_in: string; check_out: string };

function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}
function toIsoDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function fmtShort(v: string) {
  if (!v) return "";
  return new Date(`${v}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" });
}
function addDays(d: Date, n: number) { const r = new Date(d); r.setDate(r.getDate()+n); return r; }
function isBooked(day: string, ranges: BookedRange[]) { return ranges.some(r => day >= r.check_in && day < r.check_out); }
function rangeOverlaps(s: string, e: string, ranges: BookedRange[]) { return ranges.some(r => s < r.check_out && e > r.check_in); }

export default function BookingCard({ listing }: BookingCardProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);

  const guestsCount = adults + children;
  const guestLabel = [
    `${guestsCount} guest${guestsCount !== 1 ? "s" : ""}`,
    infants ? `${infants} infant${infants !== 1 ? "s" : ""}` : "",
    pets ? `${pets} pet${pets !== 1 ? "s" : ""}` : "",
  ].filter(Boolean).join(", ");

  useEffect(() => {
    api.getAvailability(listing.id)
      .then(r => setBookedRanges(r.booked_ranges))
      .catch(() => {});
  }, [listing.id]);

  const calDays = useMemo(() => {
    const t = new Date(); t.setHours(0,0,0,0);
    return Array.from({length: 63}, (_, i) => addDays(t, i));
  }, []);

  const nights = checkIn && checkOut
    ? Math.max(0, Math.ceil((new Date(`${checkOut}T00:00:00`).getTime() - new Date(`${checkIn}T00:00:00`).getTime()) / 86400000))
    : 0;
  const basePrice = nights * listing.price_per_night;
  const cleaningFee = listing.cleaning_fee;
  const serviceFee = Math.round(basePrice * listing.service_fee_pct);
  const totalPrice = basePrice + cleaningFee + serviceFee;

  function selectDay(day: string) {
    if (isBooked(day, bookedRanges)) return;
    if (!checkIn || (checkIn && checkOut) || day < checkIn) { setCheckIn(day); setCheckOut(""); return; }
    if (day === checkIn) { setCheckOut(""); return; }
    if (rangeOverlaps(checkIn, day, bookedRanges)) { showToast("That range crosses unavailable dates.", "error"); return; }
    setCheckOut(day);
    setCalOpen(false);
  }

  function validateSelection() {
    if (!checkIn || !checkOut || nights <= 0) { showToast("Select check-in and checkout dates", "error"); return false; }
    if (rangeOverlaps(checkIn, checkOut, bookedRanges)) { showToast("Selected dates overlap with an existing booking.", "error"); return false; }
    if (guestsCount > listing.max_guests) { showToast(`Max ${listing.max_guests} guests allowed`, "error"); return false; }
    return true;
  }

  function openConfirmation() {
    if (validateSelection()) {
      const p = new URLSearchParams();
      p.set("checkin", checkIn);
      p.set("checkout", checkOut);
      p.set("adults", String(adults));
      if (children > 0) p.set("children", String(children));
      if (infants > 0) p.set("infants", String(infants));
      if (pets > 0) p.set("pets", String(pets));
      router.push(`/book/stays/${listing.id}?${p.toString()}`);
    }
  }

  // Group calendar days by month for display
  const currentMonth = calDays[0];
  const monthLabel = currentMonth.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  const firstDayOfWeek = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl md:sticky md:top-28">
        {/* "Rare find" badge */}
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-[#FFF8F0] px-3 py-2 text-sm">
          <span className="text-primary">🌟</span>
          <span className="font-semibold text-gray-800">Rare find!</span>
          <span className="text-gray-500 text-xs">This place is usually booked.</span>
        </div>

        {/* Price */}
        <div className="mb-4 flex items-baseline justify-between">
          <div>
            <span className="text-2xl font-bold">{formatINR(listing.price_per_night)}</span>
            <span className="ml-1 text-sm text-gray-500">night</span>
          </div>
          {listing.rating && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-semibold">{listing.rating.toFixed(2)}</span>
              <span className="text-gray-400">({listing.review_count})</span>
            </div>
          )}
        </div>

        {/* Date + Guests inputs */}
        <div className="mb-4 overflow-hidden rounded-xl border border-gray-300">
          {/* Check in / out */}
          <div className="grid grid-cols-2 border-b border-gray-300">
            <button
              onClick={() => { setCalOpen(!calOpen); setGuestsOpen(false); }}
              className="border-r border-gray-300 p-3 text-left hover:bg-gray-50"
            >
              <span className="block text-[10px] font-extrabold uppercase text-gray-600">Check-in</span>
              <span className="text-sm font-medium text-gray-900">{checkIn ? fmtShort(checkIn) : "Add date"}</span>
            </button>
            <button
              onClick={() => { setCalOpen(!calOpen); setGuestsOpen(false); }}
              className="p-3 text-left hover:bg-gray-50"
            >
              <span className="block text-[10px] font-extrabold uppercase text-gray-600">Checkout</span>
              <span className="text-sm font-medium text-gray-900">{checkOut ? fmtShort(checkOut) : "Add date"}</span>
            </button>
          </div>

          {/* Guests */}
          <button
            onClick={() => { setGuestsOpen(!guestsOpen); setCalOpen(false); }}
            className="flex w-full items-center justify-between p-3 text-left hover:bg-gray-50"
          >
            <div>
              <span className="block text-[10px] font-extrabold uppercase text-gray-600">Guests</span>
              <span className="text-sm font-medium text-gray-900">{guestLabel}</span>
            </div>
            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${guestsOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Calendar dropdown */}
        {calOpen && (
          <div className="mb-4 rounded-2xl border border-gray-200 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold">{monthLabel}</p>
              {(checkIn || checkOut) && (
                <button onClick={() => { setCheckIn(""); setCheckOut(""); }} className="text-xs font-semibold underline">Clear</button>
              )}
            </div>
            <div className="mb-2 grid grid-cols-7 text-center text-[11px] font-semibold text-gray-500">
              {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <span key={d}>{d}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({length: firstDayOfWeek}).map((_, i) => <span key={`e${i}`} />)}
              {calDays.map(date => {
                const day = toIsoDate(date);
                const booked = isBooked(day, bookedRanges);
                const selected = day === checkIn || day === checkOut;
                const inRange = checkIn && checkOut && day > checkIn && day < checkOut;
                return (
                  <button key={day} disabled={booked} onClick={() => selectDay(day)}
                    className={`aspect-square rounded-full text-xs font-semibold transition ${
                      selected ? "bg-gray-900 text-white"
                      : inRange ? "bg-gray-100"
                      : booked ? "cursor-not-allowed text-gray-300 line-through"
                      : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Guests dropdown */}
        {guestsOpen && (
          <div className="mb-4 rounded-2xl border border-gray-200 p-4">
            {[
              { label: "Adults", sub: "Age 13+", val: adults, set: setAdults, min: 1, max: listing.max_guests },
              { label: "Children", sub: "Ages 2–12", val: children, set: setChildren, min: 0, max: 5 },
              { label: "Infants", sub: "Under 2", val: infants, set: setInfants, min: 0, max: 5 },
              { label: "Pets", sub: "Bringing a service animal?", val: pets, set: setPets, min: 0, max: 5 },
            ].map(g => (
              <div key={g.label} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-semibold">{g.label}</p>
                  <p className="text-xs text-gray-500">{g.sub}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button disabled={g.val <= g.min} onClick={() => g.set(Math.max(g.min, g.val - 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 disabled:opacity-30 hover:border-gray-600 transition"
                  ><Minus className="h-3 w-3" /></button>
                  <span className="w-5 text-center text-sm">{g.val}</span>
                  <button disabled={g.val >= g.max} onClick={() => g.set(Math.min(g.max, g.val + 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 disabled:opacity-30 hover:border-gray-600 transition"
                  ><Plus className="h-3 w-3" /></button>
                </div>
              </div>
            ))}
            <p className="mt-2 text-xs text-gray-500">This place has a maximum of {listing.max_guests} guests, not including infants. Pets aren't allowed.</p>
            <button onClick={() => setGuestsOpen(false)} className="mt-3 text-sm font-semibold underline">Close</button>
          </div>
        )}

        {/* Reserve button */}
        <button
          onClick={openConfirmation}
          className="mb-3 w-full rounded-xl bg-primary px-4 py-3.5 font-bold text-white shadow transition hover:bg-primary/90 active:scale-[0.98]"
        >
          Reserve
        </button>
        <p className="mb-5 text-center text-xs text-gray-500">You won&apos;t be charged yet</p>

        {/* Price breakdown */}
        {nights > 0 && (
          <div className="space-y-3 border-t border-gray-200 pt-4 text-sm text-gray-700">
            <div className="flex justify-between"><span className="underline">{formatINR(listing.price_per_night)} × {nights} night{nights !== 1 ? "s" : ""}</span><span>{formatINR(basePrice)}</span></div>
            <div className="flex justify-between"><span className="underline">Cleaning fee</span><span>{formatINR(cleaningFee)}</span></div>
            <div className="flex justify-between"><span className="underline">Service fee</span><span>{formatINR(serviceFee)}</span></div>
            <div className="flex justify-between border-t border-gray-200 pt-3 font-bold text-gray-900 text-base">
              <span>Total before taxes</span><span>{formatINR(totalPrice)}</span>
            </div>
          </div>
        )}

        <button className="mt-4 w-full text-center text-xs text-gray-400 hover:underline">Report this listing</button>
      </div>

    </>
  );
}
