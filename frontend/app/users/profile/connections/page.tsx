import Link from "next/link";

export default function ConnectionsPage() {
  return (
    <div className="flex flex-col xl:flex-row gap-12 lg:pl-10">
      <div className="flex-1">
        <h2 className="mb-12 text-[32px] font-semibold text-gray-900">Connections</h2>
        
        <div className="flex flex-col items-center justify-center text-center mt-20 max-w-sm mx-auto">
          {/* Mock image placeholder for the group graphic */}
          <div className="h-40 w-full mb-8 flex justify-center text-[100px] leading-none">
            🧑‍🤝‍🧑
          </div>
          
          <p className="mb-8 text-[15px] text-gray-600 leading-relaxed">
            When you join an experience or invite someone on a trip, you&apos;ll find the profiles of other guests here.{" "}
            <Link href="#" className="font-semibold underline">
              Learn more
            </Link>
          </p>
          
          <Link
            href="/"
            className="rounded-lg bg-[#FF385C] px-6 py-3.5 font-semibold text-white transition hover:bg-[#E31C5F]"
          >
            Book a trip
          </Link>
        </div>
      </div>
    </div>
  );
}
