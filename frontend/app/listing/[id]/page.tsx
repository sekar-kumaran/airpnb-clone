import Image from "next/image";
import { notFound } from "next/navigation";
import { Award, DoorOpen, Medal, Share, Star, Heart, MapPin, Clock, Leaf } from "lucide-react";
import { api } from "@/lib/api-client";
import PhotoGallery from "@/components/PhotoGallery";
import BookingCardWrapper from "@/components/BookingCardWrapper";
import ReviewList from "@/components/ReviewList";

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) notFound();

  let listing: any;
  try {
    listing = await api.getListing(id);
  } catch {
    notFound();
  }
  if (!listing) notFound();

  const isExperience = listing.property_type === "Experience" || listing.property_type === "Service";

  // ── EXPERIENCE / SERVICE LAYOUT ────────────────────────────────────────────
  if (isExperience) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-[1100px] px-6 py-8">
          {/* Top: 2×2 photo grid + title/info side by side */}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
            {/* Left: 2×2 photo grid */}
            <div>
              <div className="grid grid-cols-2 grid-rows-2 gap-2 overflow-hidden rounded-2xl" style={{ height: 420 }}>
                {listing.images.slice(0, 4).map((img: any, i: number) => (
                  <div key={img.id || i} className="relative overflow-hidden bg-gray-100">
                    <Image
                      src={img.url}
                      alt={`${listing.title} photo ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="260px"
                    />
                  </div>
                ))}
                {listing.images.length < 4 &&
                  Array.from({ length: 4 - listing.images.length }).map((_, i) => (
                    <div key={`empty-${i}`} className="bg-gray-100" />
                  ))}
              </div>

              {/* What you'll do */}
              <section className="mt-10 border-b border-gray-200 pb-8">
                <h2 className="mb-5 text-[22px] font-semibold">What you&apos;ll do</h2>
                <p className="text-base leading-7 text-gray-700">{listing.description}</p>
              </section>

              {/* Reviews */}
              <ReviewList rating={listing.rating} reviewCount={listing.review_count} host={listing.host} />

              {/* Where we'll meet */}
              <section className="border-b border-gray-200 py-8">
                <h2 className="mb-4 text-[22px] font-semibold">Where we&apos;ll meet</h2>
                <p className="mb-4 text-sm text-gray-600">{listing.city}, {listing.country}</p>
                {/* Static map placeholder */}
                <div className="relative h-[240px] w-full overflow-hidden rounded-xl bg-gray-100">
                  <Image
                    src={`https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=70`}
                    alt="Map"
                    fill
                    className="object-cover opacity-60"
                    sizes="800px"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg">
                      <MapPin className="h-5 w-5 text-primary fill-primary" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 rounded-md bg-white/90 px-2 py-1 text-xs text-gray-500 shadow">
                    Map Data ©2026 · Terms
                  </div>
                </div>
              </section>

              {/* About the host */}
              <section className="border-b border-gray-200 py-8">
                <h2 className="mb-5 text-[22px] font-semibold">About me</h2>
                <div className="flex gap-6">
                  <div className="flex w-40 shrink-0 flex-col items-center rounded-2xl border border-gray-200 p-4 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 text-xl font-bold text-white mb-2">
                      {listing.host.name[0]}
                    </div>
                    <p className="text-sm font-bold">{listing.host.name}</p>
                    <p className="text-xs text-gray-500">Experience host</p>
                    <button className="mt-3 w-full rounded-xl border border-gray-700 py-2 text-xs font-semibold hover:bg-gray-50">
                      Message {listing.host.name.split(" ")[0]}
                    </button>
                  </div>
                  <p className="text-sm leading-7 text-gray-700">
                    {listing.host.name} is an experienced host with a passion for sharing local culture and expertise. They have hosted numerous guests and received excellent feedback for their attentiveness and knowledge.
                  </p>
                </div>
              </section>

              {/* Things to know */}
              <section className="py-8">
                <h2 className="mb-5 text-[22px] font-semibold">Things to know</h2>
                <div className="grid grid-cols-3 gap-8 text-sm">
                  <div>
                    <h3 className="mb-3 font-semibold">Guest requirements</h3>
                    <p className="text-gray-500">Guests aged 18 and over can attend, up to {listing.max_guests} guests in total.</p>
                  </div>
                  <div>
                    <h3 className="mb-3 font-semibold">Accessibility</h3>
                    <p className="text-gray-500">Message your host for details. <span className="underline cursor-pointer">Learn more</span></p>
                  </div>
                  <div>
                    <h3 className="mb-3 font-semibold">Cancellation policy</h3>
                    <p className="text-gray-500">Cancel at least 7 days before the start time for a full refund.</p>
                  </div>
                </div>
              </section>
            </div>

            {/* Right: title, info, booking card */}
            <div>
              <div className="lg:sticky lg:top-24">
                {/* Title + description */}
                <h1 className="text-2xl font-semibold leading-tight text-gray-900">{listing.title}</h1>
                <p className="mt-2 text-sm leading-6 text-gray-600">{listing.description?.slice(0, 140)}…</p>
                <p className="mt-1 text-xs text-gray-400">Automatically translated</p>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{listing.city}</span>
                  <span>·</span>
                  <span>Art workshops</span>
                </div>

                <div className="mt-3 flex gap-4">
                  <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900">
                    <Share className="h-4 w-4" />
                  </button>
                  <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-5 space-y-3 border-t border-gray-200 pt-5 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
                      <span className="text-sm">👤</span>
                    </div>
                    <div>
                      <p className="font-semibold">Hosted by {listing.host.name}</p>
                      <p className="text-xs text-gray-500">Experience host</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 shrink-0 text-gray-500" />
                    <p className="text-gray-600">{listing.city}, {listing.country}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 shrink-0 text-gray-500" />
                    <p className="text-gray-600">Around 2hr experience</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Leaf className="h-5 w-5 shrink-0 text-gray-500" />
                    <div>
                      <p className="font-semibold">Airbnb Original</p>
                      <p className="text-xs text-gray-500">This experience is designed exclusively for Airbnb.</p>
                    </div>
                  </div>
                </div>

                {/* Experience booking card */}
                <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-lg">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold">From {formatINR(listing.price_per_night)}</span>
                      <span className="ml-1 text-sm text-gray-500">/ guest</span>
                    </div>
                    <button className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90">
                      Show dates
                    </button>
                  </div>
                  <p className="mb-4 text-xs text-green-600 font-medium">Free cancellation</p>

                  {/* Date slots */}
                  <div className="space-y-2">
                    {[0, 1, 2, 3, 4].map((offset) => {
                      const d = new Date();
                      d.setDate(d.getDate() + offset + 2);
                      // Skip weekends for experience slots pattern
                      const label = d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
                      return (
                        <button
                          key={offset}
                          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-left text-sm hover:border-gray-400 transition"
                        >
                          <p className="font-semibold text-gray-900">{label}</p>
                          <p className="text-xs text-gray-400">12:30 - 2:30pm · 10 spots available</p>
                        </button>
                      );
                    })}
                    <button className="w-full py-2 text-center text-sm font-semibold underline text-gray-700 hover:text-gray-900">
                      Show all dates
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Airbnb Originals footer banner */}
        <div className="border-t border-gray-200 bg-[#F7F5EE] py-12 text-center">
          <div className="mx-auto max-w-sm">
            <div className="mb-3 text-4xl">🪶</div>
            <h3 className="text-xl font-semibold">Airbnb Originals are designed for Airbnb</h3>
            <p className="mt-2 text-sm text-gray-500">Airbnb Originals are handpicked and designed to represent the best of what a city has to offer.</p>
          </div>
        </div>
      </div>
    );
  }

  // ── HOME LISTING LAYOUT ────────────────────────────────────────────────────
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1180px] px-6 py-8">
        {/* Title row */}
        <div className="mb-4 flex items-start justify-between gap-4">
          <h1 className="text-[26px] font-semibold tracking-tight">{listing.title}</h1>
          <div className="flex shrink-0 gap-1 text-sm font-semibold">
            <button className="flex items-center gap-2 rounded-lg px-3 py-2 underline hover:bg-gray-100">
              <Share className="h-4 w-4" /> Share
            </button>
            <button className="flex items-center gap-2 rounded-lg px-3 py-2 underline hover:bg-gray-100">
              <Heart className="h-4 w-4" /> Save
            </button>
          </div>
        </div>

        {/* Photo gallery */}
        <PhotoGallery images={listing.images} title={listing.title} />

        {/* Two-column layout */}
        <div className="mt-8 grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1fr)_372px]">
          <main className="min-w-0">
            {/* Subtitle */}
            <section className="border-b border-gray-200 pb-6">
              <h2 className="text-[22px] font-semibold text-gray-900">
                {listing.property_type} in {listing.city}, {listing.country}
              </h2>
              <p className="mt-1 text-gray-500">
                {listing.max_guests} guests · {listing.bedrooms} bedroom{listing.bedrooms !== 1 ? "s" : ""} · {listing.beds} bed{listing.beds !== 1 ? "s" : ""} · {listing.bathrooms} bathroom{listing.bathrooms !== 1 ? "s" : ""}
              </p>
            </section>

            {/* Guest favourite + rating + reviews */}
            <section className="flex flex-wrap items-center gap-4 border-b border-gray-200 py-6">
              <div className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5">
                <span className="text-sm">🏆</span>
                <div>
                  <p className="text-[11px] font-bold leading-none">Guest</p>
                  <p className="text-[11px] font-bold leading-none">favourite</p>
                </div>
                <span className="text-[11px] text-gray-500">One of the most loved homes on Airbnb, according to guests</span>
              </div>
              {listing.rating && (
                <>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-bold">{listing.rating.toFixed(2)}</span>
                  </div>
                  <button className="text-sm font-semibold underline">{listing.review_count} Reviews</button>
                </>
              )}
            </section>

            {/* Hosted by */}
            <section className="flex items-center justify-between border-b border-gray-200 py-6">
              <div>
                <h2 className="text-[18px] font-semibold">Hosted by {listing.host.name}</h2>
                <p className="text-sm text-gray-500">Superhost · 11 months hosting</p>
              </div>
              {listing.host.avatar_url ? (
                <Image src={listing.host.avatar_url} alt={listing.host.name} width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-lg font-bold text-white">
                  {listing.host.name[0]}
                </div>
              )}
            </section>

            {/* Highlights */}
            <section className="space-y-5 border-b border-gray-200 py-6">
              {[
                { icon: "❄️", title: "Designed for staying cool", text: "Beat the heat with the A/C and ceiling fan." },
                { icon: "🗝️", title: "Great check-in experience", text: "Recent guests loved the smooth start to this stay." },
                { icon: "🏠", title: "Extra spacious", text: "Guests love this home's spaciousness for a comfortable stay." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <span className="mt-0.5 text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.text}</p>
                  </div>
                </div>
              ))}
            </section>

            {/* Description */}
            <section className="border-b border-gray-200 py-6">
              <p className="text-base leading-7 text-gray-700 line-clamp-5">{listing.description}</p>
              <button className="mt-3 text-sm font-semibold underline hover:text-gray-700">Show more</button>
            </section>

            {/* Where you'll sleep */}
            {listing.bedrooms > 0 && (
              <section className="border-b border-gray-200 py-6">
                <h2 className="mb-5 text-[22px] font-semibold">Where you&apos;ll sleep</h2>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {Array.from({ length: Math.min(listing.bedrooms, 3) }).map((_, i) => (
                    <div key={i} className="min-w-[200px] overflow-hidden rounded-2xl border border-gray-200">
                      <div className="relative h-[140px] w-full bg-gray-100">
                        {listing.images[i + 1] ? (
                          <Image src={listing.images[i + 1].url} alt={`Bedroom ${i + 1}`} fill className="object-cover" sizes="200px" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-3xl">🛏️</div>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-semibold">Bedroom {i + 1}</p>
                        <p className="text-xs text-gray-500">1 double bed, 2 floor mattresses</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* What this place offers */}
            <section className="border-b border-gray-200 py-6">
              <h2 className="mb-5 text-[22px] font-semibold">What this place offers</h2>
              <ul className="grid grid-cols-2 gap-4">
                {listing.amenities.slice(0, 10).map((amenity: any) => (
                  <li key={amenity.id} className="flex items-center gap-3 text-sm text-gray-700">
                    <span className="text-lg">✓</span>
                    <span>{amenity.name}</span>
                  </li>
                ))}
              </ul>
              {listing.amenities.length > 10 && (
                <button className="mt-5 rounded-xl border border-gray-700 px-5 py-3 text-sm font-semibold hover:bg-gray-50">
                  Show all {listing.amenities.length} amenities
                </button>
              )}
            </section>

            {/* Reviews */}
            <ReviewList rating={listing.rating} reviewCount={listing.review_count} host={listing.host} />
          </main>

          {/* Booking card sidebar */}
          <aside className="lg:pt-1">
            <BookingCardWrapper listing={listing} />
          </aside>
        </div>
      </div>
    </div>
  );
}
