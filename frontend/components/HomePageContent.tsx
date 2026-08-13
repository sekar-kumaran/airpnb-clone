import { Suspense } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";
import type { ListingCard } from "@/types";
import HomeShelf from "@/components/HomeShelf";
import CategoryRail from "@/components/CategoryRail";
import DestinationGrid from "@/components/DestinationGrid";
import BecomeHostBanner from "@/components/BecomeHostBanner";
import AirCoverSection from "@/components/AirCoverSection";
import HomeFeePill from "@/components/HomeFeePill";
import ListingCard from "@/components/ListingCard";

type HomeMode = "all" | "homes" | "experiences" | "services";

// ── Shelf config per mode ─────────────────────────────────────────────────────
const MODE_SECTIONS: Record<
  HomeMode,
  { title: string; subtitle?: string; location?: string; property_type?: string; href: string }[]
> = {
  all: [
    { title: "Popular homes in North Goa", location: "North Goa", href: "/search?location=North%20Goa" },
    { title: "Available in Lonavala this weekend", location: "Lonavala", href: "/search?location=Lonavala" },
    { title: "Stay in South Goa", location: "South Goa", href: "/search?location=South%20Goa" },
    { title: "Escapes near Manali", location: "Manali", href: "/search?location=Manali" },
  ],
  homes: [
    { title: "Popular homes in Varanasi", location: "Varanasi", href: "/search?location=Varanasi" },
    { title: "Available in Noida this weekend", location: "Noida", href: "/search?location=Noida" },
    { title: "Stay in New Delhi", location: "New Delhi", href: "/search?location=New%20Delhi" },
    { title: "Homes in Jaipur", location: "Jaipur", href: "/search?location=Jaipur" },
  ],
  experiences: [
    {
      title: "Airbnb Originals",
      subtitle: "Hosted by the world's most interesting people",
      property_type: "Experience",
      href: "/search?property_type=Experience",
    },
    {
      title: "Experiences in Varanasi",
      location: "Varanasi",
      property_type: "Experience",
      href: "/search?location=Varanasi&property_type=Experience",
    },
    {
      title: "Popular with travellers from your area",
      property_type: "Experience",
      href: "/search?property_type=Experience",
    },
  ],
  services: [
    {
      title: "Services in Gurgaon",
      location: "Gurgaon District",
      property_type: "Service",
      href: "/search?location=Gurgaon%20District&property_type=Service",
    },
    {
      title: "Services in Dehradun",
      location: "Dehradun",
      property_type: "Service",
      href: "/search?location=Dehradun&property_type=Service",
    },
    { title: "Popular services near you", property_type: "Service", href: "/search?property_type=Service" },
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────
async function getShelfListings(
  section: { location?: string; property_type?: string },
  fallback: ListingCard[]
): Promise<ListingCard[]> {
  try {
    const { results } = await api.searchListings({
      location: section.location,
      property_type: section.property_type,
      limit: 8,
    });
    return results.length ? results : fallback;
  } catch {
    return fallback;
  }
}

// ── Guest-favourite grid (top-rated listings) ─────────────────────────────────
function GuestFavouritesGrid({ listings }: { listings: ListingCard[] }) {
  const top = listings.filter((l) => (l.rating ?? 0) >= 4.9).slice(0, 4);
  if (top.length < 2) return null;

  return (
    <section className="mb-12">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">Guest favourites</h2>
          <p className="mt-1 text-sm text-gray-500">The most-loved homes in all of Airbnb</p>
        </div>
        <Link
          href="/search"
          className="hidden rounded-full border border-gray-900 px-4 py-2 text-sm font-semibold hover:bg-gray-900 hover:text-white transition md:block"
        >
          Show all
        </Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {top.map((listing) => (
          <ListingCard key={listing.id} listing={listing} variant="grid" />
        ))}
      </div>
    </section>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default async function HomePageContent({ mode = "all" }: { mode?: HomeMode }) {
  // Fetch everything in parallel
  const [{ results: allListings }, categories] = await Promise.all([
    api.searchListings({ limit: 24 }).catch(() => ({ results: [], total: 0, page: 1, limit: 24 })),
    api.getCategories().catch(() => []),
  ]);

  const sections = await Promise.all(
    MODE_SECTIONS[mode].map(async (section) => ({
      ...section,
      listings: await getShelfListings(section, allListings),
    }))
  );

  return (
    <div className="bg-white">
      {/* ── SECTION 1: Category Rail ─────────────────────────────────────── */}
      <Suspense fallback={<div className="h-16 border-b border-gray-200" />}>
        {categories.length > 0 && (
          <CategoryRail categories={categories} />
        )}
      </Suspense>

      <div className="mx-auto max-w-[1760px] px-6 sm:px-10">

        {/* ── SECTION 2: Explore Nearby (destination grid) ─────────────── */}
        <DestinationGrid />

        <div className="my-2 border-b border-gray-100" />

        {/* ── SECTION 3: Listing Shelves (3–4 horizontal scrollable rows) ─ */}
        <div className="py-10">
          {sections.map((section, i) => (
            <div key={section.title}>
              <HomeShelf
                title={section.title}
                subtitle={section.subtitle}
                listings={section.listings}
                href={section.href}
              />
              {/* Insert AirCover banner between shelf 1 and 2 */}
              {i === 0 && <AirCoverSection />}
            </div>
          ))}
        </div>

        {/* ── SECTION 4: Guest Favourites featured grid ─────────────────── */}
        <GuestFavouritesGrid listings={allListings} />

        {/* ── SECTION 5: Become a Host CTA ─────────────────────────────── */}
        <BecomeHostBanner />

        {/* ── SECTION 6: "Prices include all fees" pill ────────────────── */}
        <div className="py-4">
          <HomeFeePill />
        </div>

      </div>
    </div>
  );
}
