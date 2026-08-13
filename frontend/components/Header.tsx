"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  CircleHelp,
  ConciergeBell,
  Globe,
  Home,
  Landmark,
  Menu,
  Minus,
  Navigation,
  Search,
  UserCircle,
} from "lucide-react";

const DESTINATIONS = [
  { city: "Nearby", sub: "Find what's around you", icon: Navigation },
  { city: "Lucknow, Uttar Pradesh", sub: "For its stunning architecture", icon: Building2 },
  { city: "Varanasi, Uttar Pradesh", sub: "Popular with travellers near you", icon: Building2 },
  { city: "Noida, Uttar Pradesh", sub: "Popular with travellers near you", icon: Building2 },
  { city: "New Delhi, Delhi", sub: "For sights like India Gate", icon: Building2 },
  { city: "Gurgaon District, Haryana", sub: "Popular destination", icon: Building2 },
  { city: "North Goa, Goa", sub: "Popular beach destination", icon: Building2 },
];

const MONTHS = [
  {
    name: "August 2026",
    leading: 6,
    disabled: 12,
    days: 31,
  },
  {
    name: "September 2026",
    leading: 2,
    disabled: 0,
    days: 30,
  },
];

const navItems = [
  { label: "All", href: "/", icon: Globe },
  { label: "Homes", href: "/homes", icon: Home },
  { label: "Experiences", href: "/experiences", icon: Landmark },
  { label: "Services", href: "/services", icon: ConciergeBell },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-[28px] font-bold tracking-tight text-primary">
      <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary text-[21px] leading-none">A</span>
      <span>airbnb</span>
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const compact = pathname.startsWith("/search") || pathname.startsWith("/listing");
  const activePath = pathname === "/" ? "/" : `/${pathname.split("/")[1]}`;
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeField, setActiveField] = useState<"where" | "when" | "who">("where");
  const [location, setLocation] = useState("");
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const selectedNav = useMemo(() => navItems.find((item) => item.href === activePath) || navItems[0], [activePath]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) setMenuOpen(false);
      if (searchWrapRef.current && !searchWrapRef.current.contains(target)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function submitSearch() {
    const params = new URLSearchParams();
    if (location.trim() && location !== "Nearby") params.set("location", location.replace(/,\s*(Goa|Delhi|Haryana|Uttar Pradesh)$/i, "").trim());
    const guests = adults + children;
    if (guests > 0) params.set("guests", String(guests));
    setSearchOpen(false);
    router.push(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function openField(field: "where" | "when" | "who") {
    setSearchOpen(true);
    setActiveField(field);
  }

  function chooseDestination(city: string) {
    setLocation(city);
    setActiveField("when");
  }

  const guestsLabel = adults + children > 0 ? `${adults + children} guest${adults + children === 1 ? "" : "s"}` : "Add guests";

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-[1800px] px-[60px] py-9">
        <div className="grid items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
          <Logo />

          {!compact && (
            <nav className="hidden items-center gap-[42px] justify-self-center lg:flex">
              {navItems.map((item) => {
                const active = selectedNav.href === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 border-b-[3px] pb-[14px] text-[18px] font-semibold ${
                      active ? "border-gray-900 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className="h-9 w-9" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          )}

          {compact && (
            <button
              type="button"
              onClick={() => openField("where")}
              className="justify-self-center hidden h-14 max-w-[620px] items-center rounded-full border bg-white shadow-md lg:flex"
            >
              <span className="flex min-w-0 flex-1 items-center gap-2 px-5 text-left text-[16px] font-semibold">
                <selectedNav.icon className="h-7 w-7" />
                <span className="truncate">{location ? `Homes in ${location}` : "Anywhere"}</span>
              </span>
              <span className="h-7 w-px bg-gray-200" />
              <span className="px-5 text-[16px] font-semibold">Any weekend</span>
              <span className="h-7 w-px bg-gray-200" />
              <span className="px-5 text-[16px] font-semibold text-gray-600">{guestsLabel}</span>
              <span className="mr-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                <Search className="h-5 w-5" />
              </span>
            </button>
          )}

          <div className="flex items-center justify-end gap-4">
            <Link href="/host" className="hidden rounded-full px-4 py-2 text-[16px] font-semibold hover:bg-gray-100 md:block">
              Become a host
            </Link>
            <button className="hidden h-12 w-12 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 md:flex" aria-label="Language">
              <Globe className="h-5 w-5" />
            </button>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 z-50 mt-4 w-[330px] rounded-2xl bg-white p-7 shadow-2xl ring-1 ring-black/5">
                  <Link href="/login" className="flex items-center gap-3 border-b pb-5 text-[18px] hover:text-primary">
                    <CircleHelp className="h-5 w-5" />
                    Help Centre
                  </Link>
                  <Link href="/host" className="block border-b py-5 hover:text-primary">
                    <span className="block text-[17px] font-bold">Become a host</span>
                    <span className="mt-1 block text-[15px] leading-5 text-gray-500">It&apos;s easy to start hosting and earn extra income.</span>
                  </Link>
                  <Link href="/host" className="block py-3 text-[16px] hover:text-primary">Refer a host</Link>
                  <Link href="/host" className="block border-b pb-5 pt-2 text-[16px] hover:text-primary">Find a co-host</Link>
                  <Link href="/login" className="flex items-center gap-2 pt-5 text-[16px] hover:text-primary">
                    <UserCircle className="h-5 w-5" />
                    Log in or sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {!compact && (
          <div ref={searchWrapRef} className="relative mx-auto mt-8 max-w-[1062px]">
            <div className="flex h-[82px] items-center rounded-full border border-gray-200 bg-white shadow-xl shadow-gray-200/80">
              <button
                type="button"
                onClick={() => openField("where")}
                className={`h-[82px] flex-1 rounded-full px-10 text-left transition ${activeField === "where" && searchOpen ? "bg-white shadow-lg" : "hover:bg-gray-100"}`}
              >
                <span className="block text-[15px] font-bold leading-5 text-gray-900">Where</span>
                <span className="text-[20px] leading-6 text-gray-500">{location || (selectedNav.href === "/experiences" ? "Search by city or landmark" : "Search destinations")}</span>
              </button>
              <span className="h-10 w-px bg-gray-200" />
              <button
                type="button"
                onClick={() => openField("when")}
                className={`h-[82px] flex-1 rounded-full px-8 text-left transition ${activeField === "when" && searchOpen ? "bg-white shadow-lg" : "hover:bg-gray-100"}`}
              >
                <span className="block text-[15px] font-bold leading-5 text-gray-900">When</span>
                <span className="text-[20px] leading-6 text-gray-500">Add dates</span>
              </button>
              <span className="h-10 w-px bg-gray-200" />
              <button
                type="button"
                onClick={() => openField("who")}
                className={`h-[82px] flex-1 rounded-full px-8 text-left transition ${activeField === "who" && searchOpen ? "bg-white shadow-lg" : "hover:bg-gray-100"}`}
              >
                <span className="block text-[15px] font-bold leading-5 text-gray-900">{selectedNav.href === "/services" ? "Type of service" : "Who"}</span>
                <span className="text-[20px] leading-6 text-gray-500">{selectedNav.href === "/services" ? "Add service" : guestsLabel}</span>
              </button>
              <button
                onClick={submitSearch}
                className="mr-3 flex h-[58px] items-center gap-2 rounded-full bg-primary px-5 text-[18px] font-bold text-white hover:bg-primary-dark"
              >
                <Search className="h-5 w-5" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>

            {searchOpen && activeField === "where" && (
              <div className="absolute left-0 top-[96px] z-50 max-h-[675px] w-[532px] overflow-y-auto rounded-[32px] bg-white p-10 shadow-2xl">
                <p className="mb-4 text-[15px] font-medium text-gray-700">Suggested destinations</p>
                {DESTINATIONS.map((destination, index) => (
                  <button
                    key={destination.city}
                    onClick={() => chooseDestination(destination.city)}
                    className={`flex w-full items-center gap-5 rounded-2xl p-3 text-left ${index === 0 ? "bg-gray-50" : "hover:bg-gray-50"}`}
                  >
                    <span className="flex h-[70px] w-[70px] items-center justify-center rounded-xl bg-gray-100 text-primary">
                      <destination.icon className="h-8 w-8" />
                    </span>
                    <span>
                      <span className="block text-[18px] font-semibold leading-6">{destination.city}</span>
                      <span className="text-[17px] leading-6 text-gray-500">{destination.sub}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}

            {searchOpen && activeField === "when" && (
              <div className="absolute left-1/2 top-[96px] z-50 w-[min(92vw,1062px)] -translate-x-1/2 rounded-[32px] bg-white px-11 pb-14 pt-10 shadow-2xl">
                <div className="mx-auto mb-9 flex w-[388px] rounded-full bg-gray-100 p-1 text-center text-[18px] font-semibold">
                  <span className="flex-1 rounded-full bg-white py-2 shadow">Dates</span>
                  <span className="flex-1 py-2 text-gray-700">Flexible</span>
                </div>
                <div className="grid gap-20 md:grid-cols-2">
                  {MONTHS.map((month) => (
                    <div key={month.name}>
                      <h3 className="mb-7 text-center text-[22px] font-bold">{month.name}</h3>
                      <div className="mb-5 grid grid-cols-7 text-center text-[15px] font-semibold text-gray-500">
                        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                          <span key={`${month.name}-${day}-${index}`}>{day}</span>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-y-7 text-center text-[20px] font-semibold">
                        {Array.from({ length: month.leading }).map((_, index) => (
                          <span key={`blank-${index}`} />
                        ))}
                        {Array.from({ length: month.days }).map((_, index) => {
                          const day = index + 1;
                          const disabled = day <= month.disabled;
                          return (
                            <button key={day} className={disabled ? "text-gray-300" : "text-gray-900"}>
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-12 flex flex-wrap gap-3">
                  {["Exact dates", "+ 1 day", "+ 2 days", "+ 3 days", "+ 7 days", "+ 14 days"].map((label, index) => (
                    <button key={label} className={`rounded-full border px-5 py-3 text-[15px] ${index === 0 ? "border-gray-900" : "border-gray-200"}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {searchOpen && activeField === "who" && (
              <div className="absolute right-0 top-[96px] z-50 w-[532px] rounded-[32px] bg-white p-14 shadow-2xl">
                {[
                  ["Adults", "Ages 13 or above", adults, setAdults, 0],
                  ["Children", "Ages 2-12", children, setChildren, 0],
                  ["Infants", "Under 2", infants, setInfants, 0],
                  ["Pets", "Bringing a service animal?", pets, setPets, 0],
                ].map(([label, sub, value, setter, min]) => (
                  <div key={String(label)} className="flex items-center justify-between border-b py-7 first:pt-0 last:border-b-0 last:pb-0">
                    <span>
                      <span className="block text-[22px] font-semibold leading-7">{String(label)}</span>
                      <span className={`text-[18px] leading-6 ${label === "Pets" ? "font-semibold underline text-gray-400" : "text-gray-500"}`}>{String(sub)}</span>
                    </span>
                    <span className="flex items-center gap-5">
                      <button
                        onClick={() => (setter as typeof setAdults)(Math.max(Number(min), Number(value) - 1))}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-5 text-center text-[20px]">{Number(value)}</span>
                      <button
                        onClick={() => (setter as typeof setAdults)(Number(value) + 1)}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-[24px]"
                      >
                        +
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
