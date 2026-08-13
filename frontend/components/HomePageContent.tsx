import { api } from "@/lib/api-client";
import type { ListingCard } from "@/types";
import HomeShelf from "@/components/HomeShelf";
import HomeFeePill from "@/components/HomeFeePill";

type HomeMode = "all" | "homes" | "experiences" | "services";

// ── Shelf config per mode ─────────────────────────────────────────────────────
const MODE_SECTIONS: Record<
  HomeMode,
  {
    title: string;
    subtitle?: string;
    location?: string;
    property_type?: string;
    href: string;
    cardType?: "home" | "experience" | "service";
  }[]
> = {
  all: [
    { title: "Popular homes in North Goa", location: "North Goa", href: "/search?location=North%20Goa" },
    { title: "Available in Lonavala this weekend", location: "Lonavala", href: "/search?location=Lonavala" },
    { title: "Stay in South Goa", location: "South Goa", href: "/search?location=South%20Goa" },
    { title: "Escapes near Manali", location: "Manali", href: "/search?location=Manali" },
    { title: "Popular homes in Varanasi", location: "Varanasi", href: "/search?location=Varanasi" },
    { title: "Homes in New Delhi", location: "New Delhi", href: "/search?location=New%20Delhi" },
  ],
  homes: [
    { title: "Popular homes in Varanasi", location: "Varanasi", href: "/search?location=Varanasi" },
    { title: "Available in Noida this weekend", location: "Noida", href: "/search?location=Noida" },
    { title: "Stay in New Delhi", location: "New Delhi", href: "/search?location=New%20Delhi" },
    { title: "Homes in Jaipur", location: "Jaipur", href: "/search?location=Jaipur" },
    { title: "Popular homes in North Goa", location: "North Goa", href: "/search?location=North%20Goa" },
    { title: "Stays in Lonavala", location: "Lonavala", href: "/search?location=Lonavala" },
  ],
  experiences: [
    {
      title: "Airbnb Originals",
      subtitle: "Hosted by the world's most interesting people",
      property_type: "Experience",
      href: "/search?property_type=Experience",
      cardType: "experience",
    },
    {
      title: "Popular with travellers from your area",
      property_type: "Experience",
      href: "/search?property_type=Experience",
      cardType: "experience",
    },
    {
      title: "Experiences in Varanasi",
      location: "Varanasi",
      property_type: "Experience",
      href: "/search?location=Varanasi&property_type=Experience",
      cardType: "experience",
    },
  ],
  services: [
    {
      title: "Services in Gurgaon District",
      location: "Gurgaon District",
      property_type: "Service",
      href: "/search?location=Gurgaon%20District&property_type=Service",
      cardType: "service",
    },
    {
      title: "Services in Dehradun",
      location: "Dehradun",
      property_type: "Service",
      href: "/search?location=Dehradun&property_type=Service",
      cardType: "service",
    },
    {
      title: "Popular services near you",
      property_type: "Service",
      href: "/search?property_type=Service",
      cardType: "service",
    },
  ],
};

// ── Helper: fetch listings for a shelf ────────────────────────────────────────
async function getShelfListings(
  section: { location?: string; property_type?: string },
  fallback: ListingCard[]
): Promise<ListingCard[]> {
  try {
    const { results } = await api.searchListings({
      location: section.location,
      property_type: section.property_type,
      limit: 15,
    });
    return results.length ? results : fallback;
  } catch {
    return fallback;
  }
}

// ── Main component ────────────────────────────────────────────────────────────
export default async function HomePageContent({ mode = "all" }: { mode?: HomeMode }) {
  const { results: allListings } = await api
    .searchListings({ limit: 20 })
    .catch(() => ({ results: [], total: 0, page: 1, limit: 20 }));

  const sections = await Promise.all(
    MODE_SECTIONS[mode].map(async (section) => ({
      ...section,
      listings: await getShelfListings(section, allListings),
    }))
  );

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-[1760px] px-6 md:px-10 xl:px-20">
        <div className="py-8">
          {sections.map((section) => (
            <HomeShelf
              key={section.title}
              title={section.title}
              subtitle={section.subtitle}
              listings={section.listings}
              href={section.href}
              cardType={section.cardType ?? "home"}
            />
          ))}
        </div>
        <HomeFeePill />
      </div>
    </div>
  );
}
