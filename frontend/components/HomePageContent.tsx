import HomeShelf from "@/components/HomeShelf";
import HomeFeePill from "@/components/HomeFeePill";
import { api } from "@/lib/api-client";
import type { ListingCard } from "@/types";

type HomeMode = "all" | "homes" | "experiences" | "services";

const MODE_SECTIONS: Record<HomeMode, { title: string; subtitle?: string; location?: string; property_type?: string; href: string }[]> = {
  all: [
    { title: "Popular homes in North Goa", location: "North Goa", href: "/search?location=North%20Goa" },
    { title: "Available in Lonavala this weekend", location: "Lonavala", href: "/search?location=Lonavala" },
    { title: "Stay in South Goa", location: "South Goa", href: "/search?location=South%20Goa" },
  ],
  homes: [
    { title: "Popular homes in Varanasi", location: "Varanasi", href: "/search?location=Varanasi" },
    { title: "Available in Noida this weekend", location: "Noida", href: "/search?location=Noida" },
    { title: "Stay in New Delhi", location: "New Delhi", href: "/search?location=New%20Delhi" },
  ],
  experiences: [
    { title: "Airbnb Originals", subtitle: "Hosted by the world's most interesting people", property_type: "Experience", href: "/search?property_type=Experience" },
    { title: "Experiences in Varanasi", location: "Varanasi", property_type: "Experience", href: "/search?location=Varanasi&property_type=Experience" },
    { title: "Popular with travellers from your area", location: "New Delhi", property_type: "Experience", href: "/search?property_type=Experience" },
  ],
  services: [
    { title: "Services in Gurgaon District", location: "Gurgaon District", property_type: "Service", href: "/search?location=Gurgaon%20District&property_type=Service" },
    { title: "Services in Dehradun", location: "Dehradun", property_type: "Service", href: "/search?location=Dehradun&property_type=Service" },
    { title: "Popular services near you", property_type: "Service", href: "/search?property_type=Service" },
  ],
};

async function getShelfListings(
  section: { location?: string; property_type?: string },
  fallback: ListingCard[]
) {
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

export default async function HomePageContent({ mode = "all" }: { mode?: HomeMode }) {
  const { results: fallback } = await api.searchListings({ limit: 18 });
  const sections = await Promise.all(
    MODE_SECTIONS[mode].map(async (section) => ({
      ...section,
      listings: await getShelfListings(section, fallback),
    }))
  );

  return (
    <div className="border-t bg-white">
      <div className="mx-auto max-w-[1720px] px-7 py-[66px]">
        {sections.map((section) => (
          <HomeShelf
            key={section.title}
            title={section.title}
            subtitle={section.subtitle}
            listings={section.listings}
            href={section.href}
          />
        ))}
      </div>
      <HomeFeePill />
    </div>
  );
}
