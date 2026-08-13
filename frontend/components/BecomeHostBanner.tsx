import Link from "next/link";
import Image from "next/image";

// Airbnb "Become a Host" style CTA banner
export default function BecomeHostBanner() {
  return (
    <section className="my-12 overflow-hidden rounded-3xl bg-[#F7F0E8]">
      <div className="flex flex-col items-center gap-8 px-8 py-12 md:flex-row md:justify-between">
        {/* Text side */}
        <div className="max-w-lg">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Become a Host, it&apos;s easy to get started
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            Join over 4 million hosts who are earning extra income by sharing their space.
            With AirCover protection every step of the way, you can host with confidence.
          </p>
          <Link
            href="/host"
            className="mt-6 inline-block rounded-xl bg-gray-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-black"
          >
            Try hosting
          </Link>
        </div>

        {/* Image side */}
        <div className="relative h-64 w-full overflow-hidden rounded-2xl md:h-72 md:w-[420px] md:shrink-0">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
            alt="Beautiful home to host"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 420px"
          />
        </div>
      </div>
    </section>
  );
}
