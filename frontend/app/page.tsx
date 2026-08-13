import HomePageContent from "@/components/HomePageContent";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { mode?: "all" | "homes" | "experiences" | "services" };
}) {
  return <HomePageContent mode={searchParams.mode || "all"} />;
}
