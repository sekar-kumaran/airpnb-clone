"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Globe,
  Home,
  Map,
  Briefcase,
  Search,
  Menu,
  UserCircle,
  Building2,
  CalendarDays,
  CircleHelp,
  LogOut,
  Minus,
  Plus
} from "lucide-react";
import { api } from "@/lib/api-client";
import AuthModal from "@/components/AuthModal";

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────

const DESTINATIONS = [
  { city: "Nearby", sub: "Find what's around you", icon: Home },
  { city: "Lucknow, Uttar Pradesh", sub: "For its stunning architecture", icon: Building2 },
  { city: "Varanasi, Uttar Pradesh", sub: "Popular with travellers near you", icon: Building2 },
  { city: "Noida, Uttar Pradesh", sub: "Popular with travellers near you", icon: Building2 },
  { city: "New Delhi, Delhi", sub: "For sights like India Gate", icon: Building2 },
  { city: "Gurgaon District, Haryana", sub: "Popular destination", icon: Building2 },
  { city: "North Goa, Goa", sub: "Popular beach destination", icon: Building2 },
];

  const navLinks = [
    { label: "All", src: "/icons/all.png", id: "all" },
    { label: "Homes", src: "/icons/homes.png", id: "homes" },
    { label: "Experiences", src: "/icons/experiences.png", id: "experiences" },
    { label: "Services", src: "/icons/services.png", id: "services" },
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
      <svg viewBox="0 0 32 32" className="h-10 w-10 fill-current" aria-hidden>
        <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.910 3.405 0 3.424-2.783 6.124-6.207 6.124-2.212 0-4.524-.945-5.253-2.842l-.185.018C16.944 29.055 14.632 30 12.42 30 8.995 30 6.213 27.3 6.213 23.876c0-.933.242-1.814.91-3.405l.145-.353c.986-2.296 5.146-11.006 7.1-14.836l.533-1.025C16.1 1.963 17.555 1 19.563 1H16zm0 2c-1.566 0-2.648.81-3.706 2.817l-.534 1.025C9.807 10.671 5.647 19.38 4.66 21.677l-.144.353c-.586 1.397-.8 2.129-.8 2.846 0 2.42 1.96 4.124 4.207 4.124 1.717 0 3.705-.832 4.33-2.409l.083-.196c.418-1.04 1.35-1.73 2.564-1.73 1.214 0 2.146.69 2.564 1.73l.083.196c.625 1.577 2.613 2.41 4.33 2.41 2.247 0 4.207-1.705 4.207-4.125 0-.717-.214-1.449-.8-2.846l-.144-.353c-.987-2.296-5.147-11.006-7.1-14.836l-.534-1.025C18.648 3.81 17.566 3 16 3z" />
      </svg>
      <span className="text-[24px] font-bold tracking-tight text-primary hidden sm:inline">airbnb</span>
    </Link>
  );
}

// ──────────────────────────────────────────────
// Main Header
// ──────────────────────────────────────────────

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isExpandedOverride, setIsExpandedOverride] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isSearchOrListing = pathname.startsWith("/search") || pathname.startsWith("/listing");
  const compact = (isSearchOrListing || isScrolled) && !isExpandedOverride;

  // UI state
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleBecomeHost = async () => {
    if (user) {
      try {
        const updatedUser = await api.becomeHost();
        setUser(updatedUser);
        router.push("/host/listings/new");
        setMenuOpen(false);
      } catch (err) {
        console.error("Failed to become host", err);
      }
    } else {
      setMenuOpen(false);
      setAuthOpen(true);
    }
  };
  
  const [activeField, setActiveField] = useState<"where" | "when" | "who">("where");
  
  // Read activeMode from URL if present, otherwise default to "all"
  const urlMode = searchParams.get("mode") as any;
  const [activeMode, setActiveMode] = useState<"all" | "homes" | "experiences" | "services">(urlMode || "all");

  // Keep activeMode in sync with URL if user navigates back/forward
  useEffect(() => {
    if (urlMode) setActiveMode(urlMode);
    else setActiveMode("all");
  }, [urlMode]);

  const [location, setLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);

  // Auth state
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const searchWrapRef = useRef<HTMLDivElement>(null);

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
      if (searchWrapRef.current && !searchWrapRef.current.contains(t)) {
        setSearchOpen(false);
        setIsExpandedOverride(false);
      }
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
    setIsExpandedOverride(false);
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
    <header className="sticky top-0 z-40 bg-gradient-to-b from-gray-100 via-white to-white transition-all border-b-[2px] border-gray-200">
      <div className="mx-auto max-w-[1760px] px-6 py-4 md:px-10 xl:px-20">
        {/* ── Top row ── */}
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center justify-start">
            <Logo />
          </div>

          {/* Centre: nav tabs (home) or compact search pill (search/listing) */}
          <div className="flex flex-[2] items-center justify-center">
            {!compact ? (
              <nav className="hidden items-center gap-6 lg:flex">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveMode(link.id as any);
                    router.push(`/?mode=${link.id}`);
                  }}
                  className={`flex items-center gap-3 pb-3 transition ${
                    activeMode === link.id
                      ? "border-b-2 border-gray-900 text-gray-900"
                      : "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900"
                  }`}
                >
                  <Image src={link.src} alt={link.label} width={30} height={30} className={`${activeMode === link.id ? "opacity-100" : "opacity-70"}`} unoptimized />
                  <span className="text-[18px] font-semibold">{link.label}</span>
                </button>
              ))}
            </nav>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsExpandedOverride(true);
                openField("where");
              }}
              className="hidden h-12 w-auto items-center rounded-full border border-gray-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.18)] transition lg:flex"
            >
              <span className="flex items-center gap-2 pl-6 pr-4 text-[14px] font-semibold">
                {location && location !== "NEARBY" ? (
                  <>
                    <span className="truncate max-w-[200px]">{location}</span>
                  </>
                ) : (
                  <>
                    <Image src="/icons/homes.png" alt="Homes" width={18} height={18} className="object-contain" unoptimized />
                    <span>Homes nearby</span>
                  </>
                )}
              </span>
              <span className="h-6 w-px bg-gray-200" />
              <span className="px-4 text-[14px] font-semibold whitespace-nowrap">{selectedDate ? selectedDate : "Any week"}</span>
              <span className="h-6 w-px bg-gray-200" />
              <span className="pl-4 pr-2 text-[14px] font-semibold text-gray-500">{guestsLabel}</span>
              <span className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                <Search className="h-4 w-4" />
              </span>
            </button>
          )}
          </div>

          {/* Right: host link + lang + menu */}
          <div className="flex flex-1 items-center justify-end gap-2">
            <button
              onClick={handleBecomeHost}
              className="hidden rounded-full px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 md:block"
            >
              Become a host
            </button>
            <button
              className="hidden h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 md:flex"
              aria-label="Language"
            >
              <Globe className="h-[18px] w-[18px]" />
            </button>

            {/* Hamburger + user menu pill */}
            <div className="relative flex items-center gap-2" ref={menuRef}>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-gray-300 bg-white hover:shadow-md transition-shadow"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5 text-gray-800" />
                </button>
                {user && (
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-gray-300 bg-white hover:shadow-md transition-shadow"
                    aria-label="User profile"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-700 text-[12px] font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </button>
                )}
              </div>

              {menuOpen && (
                <div className="absolute right-0 top-[100%] z-50 mt-2 w-64 rounded-2xl bg-white py-2 shadow-2xl ring-1 ring-black/5">
                  {user ? (
                    <>
                      <Link href="/wishlist" onClick={() => setMenuOpen(false)} className="block px-4 py-[10px] text-[15px] hover:bg-gray-50">Wishlists</Link>
                      <Link href="/trips" onClick={() => setMenuOpen(false)} className="block px-4 py-[10px] text-[15px] hover:bg-gray-50">Trips</Link>
                      <Link href="#" onClick={() => setMenuOpen(false)} className="block px-4 py-[10px] text-[15px] hover:bg-gray-50">Messages</Link>
                      <Link href="/users/profile" onClick={() => setMenuOpen(false)} className="block px-4 py-[10px] text-[15px] hover:bg-gray-50">Profile</Link>
                      <div className="border-t my-2" />
                      <Link href="/notifications" onClick={() => setMenuOpen(false)} className="block px-4 py-[10px] text-[15px] hover:bg-gray-50">Notifications</Link>
                      <Link href="/account-settings" onClick={() => setMenuOpen(false)} className="block px-4 py-[10px] text-[15px] hover:bg-gray-50">Account settings</Link>
                      <Link href="#" onClick={() => setMenuOpen(false)} className="block px-4 py-[10px] text-[15px] hover:bg-gray-50">Languages & currency</Link>
                      <Link href="#" className="block px-4 py-[10px] text-[15px] hover:bg-gray-50">Help Centre</Link>
                      <div className="border-t my-2" />
                      <button onClick={handleBecomeHost} className="block w-full px-4 py-[10px] text-left text-[15px] hover:bg-gray-50">
                        Become a host
                        <span className="block text-[13px] text-gray-500">It&apos;s easy to start hosting</span>
                      </button>
                      <Link href="#" onClick={() => setMenuOpen(false)} className="block px-4 py-[10px] text-[15px] hover:bg-gray-50">Refer a host</Link>
                      <Link href="#" onClick={() => setMenuOpen(false)} className="block px-4 py-[10px] text-[15px] hover:bg-gray-50">Find a co-host</Link>
                      <div className="border-t my-2" />
                      <button onClick={logout} className="flex w-full items-center px-4 py-[10px] text-[15px] hover:bg-gray-50">
                        Log out
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { setMenuOpen(false); setAuthOpen(true); }} className="block w-full text-left px-4 py-3 text-sm font-semibold hover:bg-gray-50">Log in</button>
                      <button onClick={() => { setMenuOpen(false); setAuthOpen(true); }} className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-50">Sign up</button>
                      <div className="border-t my-1" />
                      <button onClick={handleBecomeHost} className="block w-full text-left px-4 py-3 text-sm hover:bg-gray-50">
                        <span className="block font-semibold">Airbnb your home</span>
                        <span className="text-xs text-gray-500">It&apos;s easy to start hosting</span>
                      </button>
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
          <div ref={searchWrapRef} className="relative mx-auto mt-7 mb-2 max-w-[700px]">
            <div className="flex h-[66px] items-center rounded-full border border-gray-200 bg-gray-100 transition-shadow">
              {/* Where */}
              <button
                type="button"
                onClick={() => openField("where")}
                className={`h-[66px] flex-1 rounded-full px-6 text-left transition ${
                  activeField === "where" && searchOpen ? "bg-white shadow-xl hover:bg-white" : "hover:bg-gray-200"
                }`}
              >
                <span className="block text-[13px] font-bold text-gray-900 tracking-wide">Where</span>
                <span className="text-[15px] text-gray-500">{location || "Search destinations"}</span>
              </button>

              {!(activeField === "where" && searchOpen) && !(activeField === "when" && searchOpen) && (
                <span className="h-8 w-px bg-gray-300" />
              )}

              {/* When */}
              <button
                type="button"
                onClick={() => openField("when")}
                className={`h-[66px] flex-1 rounded-full px-6 text-left transition ${
                  activeField === "when" && searchOpen ? "bg-white shadow-xl hover:bg-white" : "hover:bg-gray-200"
                }`}
              >
                <span className="block text-[13px] font-bold text-gray-900 tracking-wide">When</span>
                <span className="text-[15px] text-gray-500 truncate">{selectedDate ? selectedDate : "Add dates"}</span>
              </button>

              {!(activeField === "when" && searchOpen) && !(activeField === "who" && searchOpen) && (
                <span className="h-8 w-px bg-gray-300" />
              )}

              {/* Who */}
              <div
                onClick={() => openField("who")}
                className={`cursor-pointer h-[66px] flex-[1.4] flex items-center justify-between rounded-full pl-6 pr-3 transition ${
                  activeField === "who" && searchOpen ? "bg-white shadow-xl hover:bg-white" : "hover:bg-gray-200"
                }`}
              >
                <div className="text-left">
                  <span className="block text-[13px] font-bold text-gray-900 tracking-wide">Who</span>
                  <span className="text-[15px] text-gray-500">{guestsLabel}</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); submitSearch(); }}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-dark transition-colors"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
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
                              onClick={() => {
                                setSelectedDate(`${month.name.split(" ")[0]} ${day}`);
                                setActiveField("who");
                              }}
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
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onSuccess={setUser} />
    </header>
  );
}
