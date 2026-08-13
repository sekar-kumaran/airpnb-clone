import Link from "next/link";

const FOOTER_LINKS = [
  {
    heading: "Support",
    links: [
      { label: "Help Centre", href: "#" },
      { label: "Get help with a safety issue", href: "#" },
      { label: "Anti-discrimination policy", href: "#" },
      { label: "Disability support", href: "#" },
      { label: "Cancellation options", href: "#" },
      { label: "Report a neighbourhood concern", href: "#" },
    ],
  },
  {
    heading: "Hosting",
    links: [
      { label: "Airbnb your home", href: "/host" },
      { label: "AirCover for Hosts", href: "#" },
      { label: "Hosting resources", href: "#" },
      { label: "Community forum", href: "#" },
      { label: "Hosting responsibly", href: "#" },
      { label: "Airbnb-friendly apartments", href: "#" },
    ],
  },
  {
    heading: "Airbnb",
    links: [
      { label: "Newsroom", href: "#" },
      { label: "New features", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Investors", href: "#" },
      { label: "Gift cards", href: "#" },
      { label: "Airbnb.org emergency stays", href: "#" },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      {/* Links grid */}
      <div className="mx-auto max-w-[1760px] px-6 py-12 sm:px-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {FOOTER_LINKS.map((col) => (
            <div key={col.heading}>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-900">
                {col.heading}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-gray-900 hover:underline transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200">
        <div className="mx-auto flex max-w-[1760px] flex-wrap items-center justify-between gap-4 px-6 py-5 sm:px-10">
          <div className="flex flex-wrap items-center gap-1 text-xs text-gray-500">
            <span>© {year} Airbnb Clone, Inc.</span>
            <span>·</span>
            <Link href="#" className="hover:underline">Privacy</Link>
            <span>·</span>
            <Link href="#" className="hover:underline">Terms</Link>
            <span>·</span>
            <Link href="#" className="hover:underline">Sitemap</Link>
            <span>·</span>
            <Link href="#" className="hover:underline">Company details</Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-gray-900">
              <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current" aria-hidden>
                <path d="M8 .25a7.75 7.75 0 1 0 0 15.5A7.75 7.75 0 0 0 8 .25zm-1.786 11.78l.016-.001.017.001-1.002 1.715A6.25 6.25 0 0 1 1.75 8c0-1.298.397-2.504 1.074-3.503L4.57 6.244a4.74 4.74 0 0 0-.32 1.756c0 1.07.354 2.056.944 2.848l-1.496 2.563c.158.11.32.215.486.314l-.97 1.67zm.83-4.362a1.25 1.25 0 1 1 1.912 0v3.082L8.956 13H7.044l0-6.332z" />
              </svg>
              English (IN)
            </button>
            <button className="text-xs font-semibold text-gray-700 hover:text-gray-900">₹ INR</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
