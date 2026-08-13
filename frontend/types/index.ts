export interface ListingCard {
  id: number;
  title: string;
  city: string;
  country: string;
  price_per_night: number;
  cover_image: string | null;
  rating: number | null;
  review_count: number;
}

export interface ListingImage {
  id: number;
  url: string;
  sort_order: number;
}

export interface Amenity {
  id: number;
  name: string;
  icon: string | null;
}

export interface Category {
  id: number;
  name: string;
  icon: string | null;
}

export interface Host {
  id: number;
  name: string;
  avatar_url: string | null;
}

export interface ListingDetail {
  id: number;
  host: Host;
  title: string;
  description: string;
  property_type: string;
  price_per_night: number;
  cleaning_fee: number;
  service_fee_pct: number;
  city: string;
  country: string;
  lat: number | null;
  lng: number | null;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  images: ListingImage[];
  amenities: Amenity[];
  categories: Category[];
  rating: number | null;
  review_count: number;
  created_at: string;
}

export interface BookingListing {
  id: number;
  title: string;
  city: string;
  country: string;
  location: string;
  cover_image: string | null;
}

export interface Booking {
  id: number;
  listing_id: number;
  guest_id: number;
  check_in: string;
  check_out: string;
  guests_count: number;
  nightly_rate_snapshot: number;
  cleaning_fee_snapshot: number;
  service_fee_snapshot: number;
  total_price: number;
  status: "confirmed" | "cancelled";
  created_at: string;
  listing: BookingListing;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  is_host: boolean;
  created_at: string;
}

export interface SearchFilters {
  location?: string;
  min_price?: number;
  max_price?: number;
  property_type?: string;
  guests?: number;
  checkin?: string;
  checkout?: string;
  category_id?: number;
  page?: number;
  limit?: number;
}
