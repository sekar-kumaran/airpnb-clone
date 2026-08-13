import type { ListingCard as ListingCardType } from "@/types";
import ListingCard from "./ListingCard";

export default function ListingGrid({ listings }: { listings: ListingCardType[] }) {
  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center text-gray-500">
        <p className="text-lg font-medium">No places found</p>
        <p className="text-sm">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
