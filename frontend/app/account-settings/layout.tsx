"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AccountSettingsLayout({ children }: { children: React.ReactNode }) {
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
    { label: "Personal information", href: "/account-settings", icon: "👤" },
    { label: "Login & security", href: "#", icon: "🛡️" },
    { label: "Privacy", href: "#", icon: "👁️" },
    { label: "Notifications", href: "/notifications", icon: "🔔" },
    { label: "Taxes", href: "#", icon: "🧾" },
    { label: "Payments", href: "#", icon: "💳" },
    { label: "Languages & currency", href: "#", icon: "🌐" },
    { label: "Booking permissions", href: "#", icon: "⚙️" },
    { label: "Travel for work", href: "#", icon: "💼" },
    { label: "Professional hosting tools", href: "#", icon: "🛠️" },
  ];

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-12 lg:px-10 min-h-[60vh] flex flex-col md:flex-row gap-12">
      {/* Sidebar */}
      <aside className="w-full md:w-72 shrink-0">
        <h1 className="mb-6 text-3xl font-semibold tracking-tight text-gray-900">Account settings</h1>
        <nav className="flex flex-col gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] transition ${
                  isActive ? "bg-gray-100 font-semibold text-gray-900" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span className="w-5 text-center text-lg grayscale">{link.icon}</span>
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
