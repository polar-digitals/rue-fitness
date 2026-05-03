"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ChevronRight } from "lucide-react";

import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./StaffPortal";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Classes", href: "/classes" },
  { label: "Pricing", href: "/pricing" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logo, setLogo] = useState("/logo.svg");
  const pathname = usePathname();

  useEffect(() => {
    async function loadLogo() {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?id=eq.logo_image&select=value`, {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data[0] && data[0].value) setLogo(data[0].value);
        }
      } catch (err) {}
    }
    loadLogo();
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="absolute top-0 inset-x-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative">
          {/* Logo + Brand Name */}
          <Link href="/" className="flex items-center gap-3 group z-10">
            <Image
              src={logo}
              alt="Rue Fitness"
              width={36}
              height={36}
              className="w-9 h-9 object-contain brightness-0 invert drop-shadow-md"
            />
            <span className="text-white font-black text-xl tracking-[0.15em] uppercase font-space drop-shadow-md">
              RUE FITNESS
            </span>
          </Link>

          {/* Desktop Nav (Centered) */}
          <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className={`text-sm font-bold tracking-wide transition-colors duration-200 drop-shadow-md ${
                  isActive(l.href)
                    ? "text-brand-light"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA Button (Right) */}
          <div className="hidden lg:block z-10">
            <Link
              href="/pricing"
              className="text-brand-light hover:text-white px-2 py-2 text-sm font-bold tracking-wide transition-all uppercase drop-shadow-md"
            >
              Explore Membership
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden z-10 w-10 h-10 flex items-center justify-end text-white/80 hover:text-white"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Nav Drawer */}
      <div
        className={`mobile-nav ${
          mobileOpen ? "open" : ""
        } fixed top-0 right-0 bottom-0 w-72 bg-[#0b0b0b] border-l border-white/[0.06] z-40 flex flex-col pt-24 px-8 gap-2`}
      >
        {NAV_LINKS.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            onClick={() => setMobileOpen(false)}
            className={`py-4 text-lg font-semibold border-b border-white/[0.06] flex items-center justify-between group ${
              isActive(l.href) ? "text-brand-light" : "text-white/70 hover:text-white"
            }`}
          >
            {l.label}
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-brand-light transition-opacity" />
          </Link>
        ))}
        <Link
          href="/pricing"
          onClick={() => setMobileOpen(false)}
          className="mt-8 text-brand-light hover:text-white py-4 font-bold tracking-wider uppercase transition-all text-center"
        >
          Explore Membership
        </Link>
      </div>
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
        />
      )}
    </>
  );
}
