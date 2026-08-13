import { api } from "@/lib/api-client";
import SearchContent from "@/components/SearchContent";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: {
    location?: string;
    min_price?: string;
    max_price?: string;
    property_type?: string;
    guests?: string;
    checkin?: string;
    checkout?: string;
    category_id?: string;
    page?: string;
  };
}) {
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const [{ results, total }, categories] = await Promise.all([
    api.searchListings({
      location: searchParams.location,
      min_price: searchParams.min_price ? Number(searchParams.min_price) : undefined,
      max_price: searchParams.max_price ? Number(searchParams.max_price) : undefined,
      property_type: searchParams.property_type,
      guests: searchParams.guests ? Number(searchParams.guests) : undefined,
      checkin: searchParams.checkin,
      checkout: searchParams.checkout,
      category_id: searchParams.category_id ? Number(searchParams.category_id) : undefined,
      page,
      limit: 15,
    }),
    api.getCategories(),
  ]);

  return (
    <SearchContent listings={results} total={total} page={page} limit={15} searchParams={searchParams} categories={categories} />
  );
}
