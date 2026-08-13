"use client";

import BookingCard from "@/components/BookingCard";
import { ListingDetail } from "@/types";

export default function BookingCardWrapper({ listing }: { listing: ListingDetail }) {
  return <BookingCard listing={listing} />;
}
