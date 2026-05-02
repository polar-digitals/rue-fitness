"use client";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Twitter, Instagram } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Classes", href: "/classes" },
  { label: "Pricing", href: "/pricing" },
];

export default function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-white/[0.04] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5 group">
              <Image
                src="/logo.svg"
                alt="Rue Fitness"
                width={36}
                height={36}
                className="w-9 h-9 object-contain brightness-0 invert drop-shadow-md"
              />
              <span className="text-white font-black text-xl tracking-[0.15em] uppercase font-space drop-shadow-md">
                RUE FITNESS
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Your premium fitness destination in Addis Ababa. Built for those
              who take their health seriously.
            </p>
            <div className="flex gap-3 mt-6">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center hover:bg-brand text-white/40 hover:text-white transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/staff"
                className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-brand-light transition-all flex items-center gap-2 group"
              >
                <div className="w-5 h-px bg-white/10 group-hover:bg-brand-light transition-colors" />
                Staff Portal
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-white/50 hover:text-white text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 mb-5">
              Hours
            </h4>
            <ul className="space-y-2 text-sm text-white/50">
              <li>Mon – Sat</li>
              <li className="text-white/70 font-medium">6:00 AM – 10:00 PM</li>
              <li className="mt-3">Sunday</li>
              <li className="text-white/70 font-medium">6:00 AM – 8:00 PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.04] pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <p>© 2025 Rue Fitness. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
