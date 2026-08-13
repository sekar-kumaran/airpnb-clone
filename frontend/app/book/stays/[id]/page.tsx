import { notFound } from "next/navigation";
import { api } from "@/lib/api-client";
import ClientCheckout from "./ClientCheckout";

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { checkin?: string; checkout?: string; adults?: string; children?: string; infants?: string; pets?: string };
}) {
  const id = Number(params.id);
  if (Number.isNaN(id)) notFound();

  let listing;
  try {
    listing = await api.getListing(id);
  } catch {
    notFound();
  }
  if (!listing) notFound();

  return <ClientCheckout listing={listing} searchParams={searchParams} />;
}
