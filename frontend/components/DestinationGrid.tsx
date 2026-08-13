import Link from "next/link";
import Image from "next/image";

// ── Destination data ──────────────────────────────────────────────────────────
const DESTINATIONS = [
  {
    city: "Goa",
    state: "India",
    time: "2 hours away",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=80",
  },
  {
    city: "Manali",
    state: "Himachal Pradesh",
    time: "14 hours away",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&q=80",
  },
  {
    city: "Coorg",
    state: "Karnataka",
    time: "5 hours away",
    image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=400&q=80",
  },
  {
    city: "Jaipur",
    state: "Rajasthan",
    time: "4 hours away",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=80",
  },
  {
    city: "Rishikesh",
    state: "Uttarakhand",
    time: "6 hours away",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
  },
  {
    city: "Ooty",
    state: "Tamil Nadu",
    time: "5 hours away",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&q=80",
  },
  {
    city: "Udaipur",
    state: "Rajasthan",
    time: "8 hours away",
    image: "https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=400&q=80",
  },
  {
    city: "Darjeeling",
    state: "West Bengal",
    time: "12 hours away",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  },
];

export default function DestinationGrid() {
  return (
    <section className="py-12">
      <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-900">Explore nearby</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {DESTINATIONS.map((dest) => (
          <Link
            key={dest.city}
            href={`/search?location=${encodeURIComponent(dest.city)}`}
            className="group flex items-center gap-3 rounded-xl p-3 transition hover:bg-gray-50"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
              <Image
                src={dest.image}
                alt={dest.city}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="64px"
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900">{dest.city}</p>
              <p className="truncate text-xs text-gray-500">{dest.time}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
