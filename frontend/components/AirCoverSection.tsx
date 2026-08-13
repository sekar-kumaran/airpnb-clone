import Image from "next/image";
import Link from "next/link";
import { Shield, Star, Home } from "lucide-react";

const FEATURES = [
  {
    icon: Shield,
    title: "AirCover",
    desc: "$3M damage protection, $1M liability insurance — included free for every host.",
  },
  {
    icon: Star,
    title: "Guest Favourites",
    desc: "Stay in the most-loved homes based on ratings, reviews, and reliability.",
  },
  {
    icon: Home,
    title: "Verified listings",
    desc: "Millions of reviews from real guests help you find the perfect place.",
  },
];

export default function AirCoverSection() {
  return (
    <section className="my-12 overflow-hidden rounded-3xl bg-[#F7F7F7]">
      <div className="flex flex-col gap-10 px-8 py-12 lg:flex-row lg:items-center lg:gap-16">
        {/* Left — image */}
        <div className="relative h-64 w-full shrink-0 overflow-hidden rounded-2xl lg:h-[340px] lg:w-[480px]">
          <Image
            src="https://images.unsplash.com/photo-1534430480872-3498386e7856?w=960&q=80"
            alt="AirCover protection"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 480px"
          />
          {/* AirCover badge overlay */}
          <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-md">
            <span className="text-[11px] font-black tracking-wide text-[#FF385C]">air</span>
            <span className="text-[11px] font-black tracking-wide text-gray-900">cover</span>
          </div>
        </div>

        {/* Right — text */}
        <div className="flex-1">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
            Only on Airbnb
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Protection that has your back
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-600">
            Airbnb gives you the tools and peace of mind to host — or travel — with confidence.
          </p>

          <div className="mt-8 space-y-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <Icon className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{title}</p>
                  <p className="mt-0.5 text-sm text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/host"
            className="mt-8 inline-block rounded-xl border border-gray-900 px-6 py-3 text-sm font-bold text-gray-900 transition hover:bg-gray-900 hover:text-white"
          >
            Learn about AirCover
          </Link>
        </div>
      </div>
    </section>
  );
}
