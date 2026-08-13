"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) return null;

  const links = [
    { label: "About me", href: "/users/profile/about" },
    { label: "Past trips", href: "/trips" },
    { label: "Connections", href: "/users/profile/connections" },
  ];

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-12 lg:px-10 min-h-[60vh] flex flex-col md:flex-row gap-12">
      {/* Sidebar */}
      <aside className="w-full md:w-72 shrink-0">
        <h1 className="mb-6 text-3xl font-semibold tracking-tight text-gray-900">Profile</h1>
        <nav className="flex flex-col gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href === "/users/profile/about" && pathname === "/users/profile");
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {/* Mock Icons matching Airbnb's style could go here */}
                {link.label === "About me" && (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-800 text-xs font-bold">
                    S
                  </div>
                )}
                {link.label === "Past trips" && <span className="text-xl">💼</span>}
                {link.label === "Connections" && <span className="text-xl">🧑‍🤝‍🧑</span>}
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
