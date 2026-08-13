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
  LogOut,
  Menu,
  Minus,
  Navigation,
  Search,
  Star,
  UserCircle,
  X,
} from "lucide-react";
import { api } from "@/lib/api-client";

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────

const DESTINATIONS = [
  { city: "Nearby", sub: "Find what's around you", icon: Navigation },
  { city: "Lucknow, Uttar Pradesh", sub: "For its stunning architecture", icon: Building2 },
  { city: "Varanasi, Uttar Pradesh", sub: "Popular with travellers near you", icon: Building2 },
  { city: "Noida, Uttar Pradesh", sub: "Popular with travellers near you", icon: Building2 },
  { city: "New Delhi, Delhi", sub: "For sights like India Gate", icon: Building2 },
  { city: "Gurgaon District, Haryana", sub: "Popular destination", icon: Building2 },
  { city: "North Goa, Goa", sub: "Popular beach destination", icon: Building2 },
];

const navItems = [
  { label: "All", href: "/", icon: Globe },
  { label: "Homes", href: "/homes", icon: Home },
  { label: "Experiences", href: "/experiences", icon: Landmark },
  { label: "Services", href: "/services", icon: ConciergeBell },
];

// Build two consecutive months from today
function buildMonths() {
  const result = [];
  const today = new Date();
  for (let m = 0; m < 2; m++) {
    const d = new Date(today.getFullYear(), today.getMonth() + m, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const leadingDays = d.getDay(); // 0=Sun
    const pastDays = m === 0 ? today.getDate() - 1 : 0;
    result.push({
      name: d.toLocaleString("default", { month: "long", year: "numeric" }),
      leading: leadingDays,
      days: daysInMonth,
      pastDays,
    });
  }
  return result;
}

// ──────────────────────────────────────────────
// Logo
// ──────────────────────────────────────────────

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-1 text-primary">
      <svg viewBox="0 0 32 32" className="h-8 w-8 fill-current" aria-hidden>
        <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.910 3.405 0 3.424-2.783 6.124-6.207 6.124-2.212 0-4.524-.945-5.253-2.842l-.185.018C16.944 29.055 14.632 30 12.42 30 8.995 30 6.213 27.3 6.213 23.876c0-.933.242-1.814.91-3.405l.145-.353c.986-2.296 5.146-11.006 7.1-14.836l.533-1.025C16.1 1.963 17.555 1 19.563 1H16zm0 2c-1.566 0-2.648.81-3.706 2.817l-.534 1.025C9.807 10.671 5.647 19.38 4.66 21.677l-.144.353c-.586 1.397-.8 2.129-.8 2.846 0 2.42 1.96 4.124 4.207 4.124 1.717 0 3.705-.832 4.33-2.409l.083-.196c.418-1.04 1.35-1.73 2.564-1.73 1.214 0 2.146.69 2.564 1.73l.083.196c.625 1.577 2.613 2.41 4.33 2.41 2.247 0 4.207-1.705 4.207-4.125 0-.717-.214-1.449-.8-2.846l-.144-.353c-.987-2.296-5.147-11.006-7.1-14.836l-.534-1.025C18.648 3.81 17.566 3 16 3z" />
      </svg>
      <span className="text-[20px] font-bold tracking-tight text-primary hidden sm:inline">airbnb</span>
    </Link>
  );
}

// ──────────────────────────────────────────────
// Main Header
// ──────────────────────────────────────────────

export default function Header() {
  const pathname = usePathname();
  const compact = pathname.startsWith("/search") || pathname.startsWith("/listing");
  const activePath = pathname === "/" ? "/" : `/${pathname.split("/")[1]}`;
  const router = useRouter();

  // UI state
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeField, setActiveField] = useState<"where" | "when" | "who">("where");
  const [location, setLocation] = useState("");
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);

  // Auth state
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  const selectedNav = useMemo(
    () => navItems.find((item) => item.href === activePath) || navItems[0],
    [activePath]
  );

  const MONTHS = useMemo(() => buildMonths(), []);

  // Load user from localStorage on mount
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      api.me().then(setUser).catch(() => {});
    }
  }, []);

  // Close panels on outside click
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      const t = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(t)) setMenuOpen(false);
      if (searchWrapRef.current && !searchWrapRef.current.contains(t)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  function submitSearch() {
    const params = new URLSearchParams();
    if (location.trim() && location !== "Nearby")
      params.set("location", location.replace(/,\s*(Goa|Delhi|Haryana|Uttar Pradesh)$/i, "").trim());
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

  function logout() {
    localStorage.removeItem("userId");
    setUser(null);
    setMenuOpen(false);
    router.push("/");
  }

  const guestsLabel =
    adults + children > 0
      ? `${adults + children} guest${adults + children === 1 ? "" : "s"}`
      : "Add guests";

  const guestCounters = [
    { label: "Adults", sub: "Ages 13 or above", value: adults, setter: setAdults, min: 0 },
    { label: "Children", sub: "Ages 2–12", value: children, setter: setChildren, min: 0 },
    { label: "Infants", sub: "Under 2", value: infants, setter: setInfants, min: 0 },
    { label: "Pets", sub: "Bringing a service animal?", value: pets, setter: setPets, min: 0 },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-[1760px] px-6 py-3 sm:px-10">
        {/* ── Top row ── */}
        <div className="flex items-center justify-between gap-4">
          <Logo />

          {/* Centre: nav tabs (home) or compact search pill (search/listing) */}
          {!compact ? (
            <nav className="hidden items-center gap-6 lg:flex">
              {navItems.map((item) => {
                const active = selectedNav.href === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-1.5 border-b-2 pb-1 text-sm font-semibold transition-colors ${
                      active
                        ? "border-gray-900 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          ) : (
            <button
              type="button"
              onClick={() => openField("where")}
              className="hidden h-12 max-w-[500px] flex-1 items-center rounded-full border border-gray-300 bg-white shadow-sm transition hover:shadow-md lg:flex"
            >
              <span className="flex min-w-0 flex-1 items-center gap-2 px-4 text-left text-sm font-semibold">
                <selectedNav.icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{location ? `Homes in ${location}` : "Anywhere"}</span>
              </span>
              <span className="h-6 w-px bg-gray-200" />
              <span className="px-4 text-sm font-semibold">Any week</span>
              <span className="h-6 w-px bg-gray-200" />
              <span className="px-4 text-sm font-semibold text-gray-500">{guestsLabel}</span>
              <span className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                <Search className="h-4 w-4" />
              </span>
            </button>
          )}

          {/* Right: host link + lang + menu */}
          <div className="flex items-center gap-2">
            <Link
              href="/host"
              className="hidden rounded-full px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 md:block"
            >
              Airbnb your home
            </Link>
            <button
              className="hidden h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 md:flex"
              aria-label="Language"
            >
              <Globe className="h-4 w-4" />
            </button>

            {/* Hamburger + user menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex h-10 items-center gap-2 rounded-full border border-gray-300 px-3 hover:shadow-md transition-shadow"
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" />
                {user ? (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-700 text-xs font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <UserCircle className="h-6 w-6 text-gray-500" />
                )}
              </button>

              {menuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-64 rounded-2xl bg-white py-2 shadow-2xl ring-1 ring-black/5">
                  {user ? (
                    <>
                      <div className="border-b px-4 py-3">
                        <p className="font-semibold text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link href="/trips" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm hover:bg-gray-50">My Trips</Link>
                      <Link href="/wishlist" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm hover:bg-gray-50">My Wishlist</Link>
                      <Link href="/host" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm hover:bg-gray-50">Switch to Hosting</Link>
                      <div className="border-t my-1" />
                      <Link href="/host" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm hover:bg-gray-50">Airbnb your home</Link>
                      <Link href="#" className="block px-4 py-3 text-sm hover:bg-gray-50">
                        <CircleHelp className="inline h-4 w-4 mr-2" />Help Centre
                      </Link>
                      <div className="border-t my-1" />
                      <button onClick={logout} className="flex w-full items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50 text-red-600">
                        <LogOut className="h-4 w-4" />Log out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm font-semibold hover:bg-gray-50">Log in</Link>
                      <Link href="/signup" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm hover:bg-gray-50">Sign up</Link>
                      <div className="border-t my-1" />
                      <Link href="/host" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm hover:bg-gray-50">
                        <span className="block font-semibold">Airbnb your home</span>
                        <span className="text-xs text-gray-500">It's easy to start hosting</span>
                      </Link>
                      <Link href="#" className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50">
                        <CircleHelp className="h-4 w-4" />Help Centre
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Search bar (home pages only) ── */}
        {!compact && (
          <div ref={searchWrapRef} className="relative mx-auto mt-3 max-w-[860px]">
            <div className="flex h-[62px] items-center rounded-full border border-gray-300 bg-white shadow-md hover:shadow-lg transition-shadow">
              {/* Where */}
              <button
                type="button"
                onClick={() => openField("where")}
                className={`h-[62px] flex-1 rounded-full px-6 text-left transition ${
                  activeField === "where" && searchOpen ? "bg-white shadow-md" : "hover:bg-gray-50"
                }`}
              >
                <span className="block text-xs font-bold text-gray-900">Where</span>
                <span className="text-sm text-gray-500">{location || "Search destinations"}</span>
              </button>

              <span className="h-8 w-px bg-gray-200" />

              {/* When */}
              <button
                type="button"
                onClick={() => openField("when")}
                className={`h-[62px] flex-1 rounded-full px-6 text-left transition ${
                  activeField === "when" && searchOpen ? "bg-white shadow-md" : "hover:bg-gray-50"
                }`}
              >
                <span className="block text-xs font-bold text-gray-900">When</span>
                <span className="text-sm text-gray-500">Add dates</span>
              </button>

              <span className="h-8 w-px bg-gray-200" />

              {/* Who */}
              <button
                type="button"
                onClick={() => openField("who")}
                className={`h-[62px] flex-[1.4] flex items-center justify-between rounded-full pl-6 pr-3 transition ${
                  activeField === "who" && searchOpen ? "bg-white shadow-md" : "hover:bg-gray-50"
                }`}
              >
                <div className="text-left">
                  <span className="block text-xs font-bold text-gray-900">Who</span>
                  <span className="text-sm text-gray-500">{guestsLabel}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); submitSearch(); }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark transition-colors"
                >
                  <Search className="h-4 w-4" />
                </button>
              </button>
            </div>

            {/* ── Where dropdown ── */}
            {searchOpen && activeField === "where" && (
              <div className="absolute left-0 top-[70px] z-50 w-[440px] rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-black/5">
                <p className="mb-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Suggested destinations</p>
                {DESTINATIONS.map((dest, i) => (
                  <button
                    key={dest.city}
                    onClick={() => chooseDestination(dest.city)}
                    className={`flex w-full items-center gap-4 rounded-xl p-3 text-left hover:bg-gray-50 ${i === 0 ? "bg-gray-50" : ""}`}
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-primary">
                      <dest.icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold leading-5">{dest.city}</span>
                      <span className="text-sm text-gray-500">{dest.sub}</span>
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* ── When dropdown ── */}
            {searchOpen && activeField === "when" && (
              <div className="absolute left-1/2 top-[70px] z-50 w-[min(95vw,860px)] -translate-x-1/2 rounded-3xl bg-white px-10 pb-8 pt-6 shadow-2xl ring-1 ring-black/5">
                <div className="mx-auto mb-6 flex w-72 rounded-full bg-gray-100 p-1 text-center text-sm font-semibold">
                  <span className="flex-1 rounded-full bg-white py-1.5 shadow text-xs">Dates</span>
                  <span className="flex-1 py-1.5 text-gray-500 text-xs">Months</span>
                  <span className="flex-1 py-1.5 text-gray-500 text-xs">Flexible</span>
                </div>
                <div className="grid gap-12 md:grid-cols-2">
                  {MONTHS.map((month) => (
                    <div key={month.name}>
                      <h3 className="mb-4 text-center text-sm font-bold">{month.name}</h3>
                      <div className="mb-3 grid grid-cols-7 text-center text-xs font-semibold text-gray-400">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d, i) => (
                          <span key={i}>{d}</span>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-y-1 text-center text-sm">
                        {Array.from({ length: month.leading }).map((_, i) => <span key={`l-${i}`} />)}
                        {Array.from({ length: month.days }).map((_, i) => {
                          const day = i + 1;
                          const disabled = day <= month.pastDays;
                          return (
                            <button
                              key={day}
                              disabled={disabled}
                              className={`aspect-square rounded-full text-sm font-medium ${
                                disabled
                                  ? "text-gray-300 cursor-not-allowed"
                                  : "text-gray-800 hover:bg-gray-100"
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["Exact dates", "+ 1 day", "+ 2 days", "+ 3 days", "+ 7 days", "+ 14 days"].map((label, i) => (
                    <button key={label} className={`rounded-full border px-4 py-2 text-sm ${i === 0 ? "border-gray-900 font-semibold" : "border-gray-300 hover:border-gray-500"}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Who dropdown ── */}
            {searchOpen && activeField === "who" && (
              <div className="absolute right-0 top-[70px] z-50 w-[420px] rounded-3xl bg-white p-8 shadow-2xl ring-1 ring-black/5">
                {guestCounters.map(({ label, sub, value, setter, min }) => (
                  <div key={label} className="flex items-center justify-between border-b py-5 first:pt-0 last:border-b-0 last:pb-0">
                    <span>
                      <span className="block text-sm font-semibold">{label}</span>
                      <span className="text-sm text-gray-500">{sub}</span>
                    </span>
                    <span className="flex items-center gap-4">
                      <button
                        onClick={() => setter(Math.max(min, value - 1))}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:border-gray-600 disabled:opacity-30"
                        disabled={value <= min}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-5 text-center text-sm font-semibold">{value}</span>
                      <button
                        onClick={() => setter(value + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:border-gray-600"
                      >
                        <span className="text-lg leading-none">+</span>
                      </button>
                    </span>
                  </div>
                ))}
                <button
                  onClick={submitSearch}
                  className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-bold text-white hover:bg-primary-dark transition-colors"
                >
                  Search
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
