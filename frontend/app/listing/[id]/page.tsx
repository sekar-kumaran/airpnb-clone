import Image from "next/image";
import { notFound } from "next/navigation";
import { Award, DoorOpen, Medal, Share, Star } from "lucide-react";
import { api } from "@/lib/api-client";
import PhotoGallery from "@/components/PhotoGallery";
import BookingCardWrapper from "@/components/BookingCardWrapper";
import ReviewList from "@/components/ReviewList";

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) notFound();

  let listing;
  try {
    listing = await api.getListing(id);
  } catch {
    notFound();
  }
  if (!listing) notFound();

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1180px] px-6 py-8">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-semibold tracking-tight">{listing.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              {listing.rating && (
                <>
                  <span className="flex items-center gap-1 font-semibold">
                    <Star className="h-4 w-4 fill-current" />
                    {listing.rating.toFixed(2)}
                  </span>
                  <span>·</span>
                  <span className="font-semibold underline">{listing.review_count} reviews</span>
                  <span>·</span>
                </>
              )}
              <span className="font-semibold underline">
                {listing.city}, {listing.country}
              </span>
            </div>
          </div>
          <div className="flex gap-3 text-sm font-semibold">
            <button className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100">
              <Share className="h-4 w-4" />
              Share
            </button>
            <button className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100">
              ♡ Save
            </button>
          </div>
        </div>

        <PhotoGallery images={listing.images} title={listing.title} />

        <div className="mt-10 grid grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1fr)_372px]">
          <main className="min-w-0">
            <section className="flex items-center justify-between border-b border-gray-200 pb-7">
              <div>
                <h2 className="text-[23px] font-semibold">
                  {listing.property_type} hosted by {listing.host.name}
                </h2>
                <div className="mt-1 flex flex-wrap items-center gap-1 text-gray-600">
                  <span>{listing.max_guests} guests</span>
                  <span>·</span>
                  <span>{listing.bedrooms} bedrooms</span>
                  <span>·</span>
                  <span>{listing.beds} beds</span>
                  <span>·</span>
                  <span>{listing.bathrooms} baths</span>
                </div>
              </div>
              {listing.host.avatar_url ? (
                <Image
                  src={listing.host.avatar_url}
                  alt={listing.host.name}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 text-xl font-bold text-white">
                  {listing.host.name[0]}
                </div>
              )}
            </section>

            <section className="space-y-6 border-b border-gray-200 py-8">
              {[
                { icon: Medal, title: "Guest favourite", text: "One of the most loved homes on Airbnb, according to guests." },
                { icon: DoorOpen, title: "Self check-in", text: "Check yourself in with the lockbox." },
                { icon: Award, title: "Experienced host", text: `${listing.host.name} has hosted guests across multiple stays.` },
              ].map((item) => (
                <div key={item.title} className="flex gap-5">
                  <item.icon className="mt-1 h-6 w-6 text-gray-800" />
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.text}</p>
                  </div>
                </div>
              ))}
            </section>

            <section className="border-b border-gray-200 py-8">
              <p className="whitespace-pre-line text-base leading-7 text-gray-700">{listing.description}</p>
            </section>

            <section className="border-b border-gray-200 py-8">
              <h2 className="mb-6 text-[23px] font-semibold">What this place offers</h2>
              <ul className="grid grid-cols-1 gap-5 text-base text-gray-800 sm:grid-cols-2">
                {listing.amenities.map((amenity) => (
                  <li key={amenity.id} className="flex items-center gap-4">
                    <span className="text-xl">✓</span>
                    {amenity.name}
                  </li>
                ))}
              </ul>
            </section>

            <ReviewList rating={listing.rating} reviewCount={listing.review_count} host={listing.host} />
          </main>

          <aside className="lg:pt-1">
            <BookingCardWrapper listing={listing} />
          </aside>
        </div>
      </div>
    </div>
  );
}
