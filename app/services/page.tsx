"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Dumbbell, Flame, Target } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../components/StaffPortal";
// ── SVG Silhouette Icons ──
const SvcIcons: Record<string, React.JSX.Element> = {
  aerobics: (
    <svg viewBox="0 0 64 64" fill="currentColor" className="w-14 h-14">
      <ellipse cx="32" cy="8" rx="5" ry="5" />
      <path d="M32 14c-4 0-7 2-8 6l-6 14h6l2-6v20h4V32h4v16h4V28l2 6h6l-6-14c-1-4-4-6-8-6z" />
      <path d="M18 36l-4 14h5l3-10M46 36l4 14h-5l-3-10" />
    </svg>
  ),
  zumba: (
    <svg viewBox="0 0 64 64" fill="currentColor" className="w-14 h-14">
      <ellipse cx="32" cy="8" rx="5" ry="5" />
      <path d="M26 14c-3 1-5 4-4 7l3 8-8 6 3 4 10-7 2 5-6 18h5l5-14 5 14h5l-6-18 2-5 10 7 3-4-8-6 3-8c1-3-1-6-4-7l-10-2-10 2z" />
    </svg>
  ),
  spinning: (
    <svg viewBox="0 0 64 64" fill="currentColor" className="w-14 h-14">
      <ellipse cx="38" cy="8" rx="5" ry="5" />
      <circle cx="20" cy="44" r="7" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="48" cy="44" r="7" fill="none" stroke="currentColor" strokeWidth="3" />
      <path d="M20 44h28M34 44V28l-8-8h14l4 8" />
      <path d="M26 20h16l6 8H28z" opacity=".6" />
    </svg>
  ),
  dance: (
    <svg viewBox="0 0 64 64" fill="currentColor" className="w-14 h-14">
      <ellipse cx="32" cy="8" rx="5" ry="5" />
      <path d="M32 14c-3 0-6 2-7 5l-5 10 4 3 4-7v9l-8 12 4 3 8-10 8 10 4-3-8-12v-9l4 7 4-3-5-10c-1-3-4-5-7-5z" />
    </svg>
  ),
  hiit: (
    <svg viewBox="0 0 64 64" fill="currentColor" className="w-14 h-14">
      <ellipse cx="32" cy="8" rx="5" ry="5" />
      <path d="M20 14l12 6 12-6v10l-12 6-12-6z" opacity=".5" />
      <path d="M32 14v12M20 24l12 6 12-6" />
      <path d="M20 38l-4 16h6l3-10 7 10 7-10 3 10h6l-4-16-12 6-12-6z" />
    </svg>
  ),
  circuit: (
    <svg viewBox="0 0 64 64" fill="currentColor" className="w-14 h-14">
      <ellipse cx="32" cy="8" rx="5" ry="5" />
      <path d="M26 14l-8 8 4 4 6-4v6l-10 14 4 4 8-10 8 10 4-4-10-14v-6l6 4 4-4-8-8h-8z" />
    </svg>
  ),
  crossfit: (
    <svg viewBox="0 0 64 64" fill="currentColor" className="w-14 h-14">
      <ellipse cx="32" cy="7" rx="5" ry="5" />
      <rect x="6" y="28" width="52" height="5" rx="2.5" />
      <rect x="6" y="22" width="10" height="5" rx="2" />
      <rect x="48" y="22" width="10" height="5" rx="2" />
      <rect x="4" y="17" width="10" height="10" rx="3" />
      <rect x="50" y="17" width="10" height="10" rx="3" />
      <path d="M32 14v14M26 20l6-6 6 6" />
    </svg>
  ),
  strength: (
    <svg viewBox="0 0 64 64" fill="currentColor" className="w-14 h-14">
      <ellipse cx="32" cy="7" rx="5" ry="5" />
      <path d="M18 28h28v5H18z" />
      <path d="M10 22h8v17h-8zM46 22h8v17h-8z" />
      <path d="M6 26h6v9H6zM52 26h6v9h-6z" />
      <path d="M32 14v14M26 38l-2 16h6l2-8 2 8h6l-2-16" />
    </svg>
  ),
  bodyweight: (
    <svg viewBox="0 0 64 64" fill="currentColor" className="w-14 h-14">
      <ellipse cx="32" cy="8" rx="5" ry="5" />
      <path d="M32 14c-4 0-7 3-7 7v8h14v-8c0-4-3-7-7-7z" />
      <path d="M20 42h24v5H20z" />
      <path d="M25 29v13M39 29v13" />
    </svg>
  ),
  functional: (
    <svg viewBox="0 0 64 64" fill="currentColor" className="w-14 h-14">
      <ellipse cx="26" cy="8" rx="5" ry="5" />
      <path d="M20 14c-3 1-5 4-4 8l4 10 8-4-2-8 6 2 8-6-4-4-8 2c-2-2-5-2-8 0z" />
      <path d="M28 28l-6 16h5l3-8 4 8h6l-6-16" />
    </svg>
  ),
  bootcamp: (
    <svg viewBox="0 0 64 64" fill="currentColor" className="w-14 h-14">
      <ellipse cx="32" cy="8" rx="5" ry="5" />
      <path d="M32 14c-5 0-8 3-8 8v6h16v-6c0-5-3-8-8-8z" />
      <path d="M16 44h32v5H16z" />
      <path d="M20 28v16M44 28v16M24 28h16" />
    </svg>
  ),
  core: (
    <svg viewBox="0 0 64 64" fill="currentColor" className="w-14 h-14">
      <ellipse cx="46" cy="10" rx="5" ry="5" />
      <path d="M52 16c-2-1-5 0-7 3l-18 24 4 4 18-20v6l-10 22h6l8-18 4 18h6l-6-26 2-4c2-4 1-8-7-9z" />
      <path d="M10 48h20v5H10z" />
    </svg>
  ),
  muscle: (
    <svg viewBox="0 0 64 64" fill="currentColor" className="w-14 h-14">
      <ellipse cx="32" cy="7" rx="5" ry="5" />
      <path d="M32 13c-3 0-6 2-7 5l-3 8 4 2 2-4v6l-6 22h5l4-12 4 12h5l4-12 4 12h5l-6-22v-6l2 4 4-2-3-8c-1-3-4-5-7-5h-11z" />
    </svg>
  ),
  personal: (
    <svg viewBox="0 0 64 64" fill="currentColor" className="w-14 h-14">
      <ellipse cx="22" cy="9" rx="5" ry="5" />
      <ellipse cx="42" cy="9" rx="5" ry="5" />
      <path d="M16 16c-3 1-5 4-5 8v12h6V26h2v28h5V38h5v16h5V26h2v10h6V24c0-4-2-7-5-8l-10 4-10-4z" />
    </svg>
  ),
  weightloss: (
    <svg viewBox="0 0 64 64" fill="currentColor" className="w-14 h-14">
      <ellipse cx="32" cy="8" rx="5" ry="5" />
      <path d="M32 14c-4 0-7 3-7 7v10l-5 20h6l4-12 4 12h6l-5-20V21c0-4-3-7-7-7z" />
      <path d="M14 28l6 6M50 28l-6 6" />
      <path d="M10 40c0 6 10 10 22 10s22-4 22-10" fill="none" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  ),
  online: (
    <svg viewBox="0 0 64 64" fill="currentColor" className="w-14 h-14">
      <rect x="8" y="14" width="48" height="32" rx="4" fill="none" stroke="currentColor" strokeWidth="3" />
      <rect x="22" y="46" width="20" height="4" rx="2" />
      <ellipse cx="32" cy="30" rx="6" ry="6" />
      <path d="M22 42c0-6 4-10 10-10s10 4 10 10" />
    </svg>
  ),
};

function ServiceCard({
  iconKey,
  title,
  desc,
}: {
  iconKey: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="relative group rounded-2xl p-7 flex flex-col items-center text-center transition-all duration-300 cursor-default bg-[#0b0b0b] border border-white/[0.06] hover:border-brand/40 hover:bg-surface-elevated">
      <div className="mb-5 transition-opacity duration-300 text-white/35 group-hover:text-brand-light/70">
        {SvcIcons[iconKey] ?? SvcIcons["circuit"]}
      </div>
      <h4 className="text-xs font-bold uppercase tracking-widest leading-snug mb-2.5 text-white">
        {title}
      </h4>
      <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

const CAT_META = [
  {
    id: "Cardio & Dance",
    Icon: Flame,
    title: "Cardio & Dance-Based Workouts",
    desc: "Boost stamina and burn fat with high-energy cardio and dance workouts, including aerobics, cycling, HIIT, and more.",
  },
  {
    id: "Strength & Conditioning",
    Icon: Dumbbell,
    title: "Strength & Conditioning",
    desc: "Build muscle, strength, and endurance with structured training programs, functional exercises, and bodyweight challenges.",
  },
  {
    id: "Personalized Training",
    Icon: Target,
    title: "Personalized & Specialized Training",
    desc: "Achieve your fitness goals with tailored training sessions, specialized programs, and online coaching.",
  },
];

export default function ServicesPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    async function loadContent() {
      try {
        const headers = { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` };
        const [sRes, svRes] = await Promise.all([
          fetch(`${SUPABASE_URL}/rest/v1/site_settings?select=*`, { headers }),
          fetch(`${SUPABASE_URL}/rest/v1/services?select=*&order=sort_order.asc`, { headers })
        ]);
        if (sRes.ok) {
          const data = await sRes.json();
          const map: Record<string, string> = {};
          data.forEach((i: any) => { map[i.id] = i.value; });
          setSettings(map);
        }
        if (svRes.ok) {
          const data = await svRes.json();
          setServices(data);
        }
      } catch (e) {}
    }
    loadContent();
  }, []);

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white font-sans selection:bg-brand/30">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative h-[60vh] min-h-[450px] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={settings.services_hero_image || "/hero-gym.png"}
            alt="Services"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-[#0b0b0b]" />
          <div className="absolute inset-0 bg-brand/12 mix-blend-multiply" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 px-6 max-w-4xl mx-auto pt-20">
          <span className="text-brand-light text-sm font-bold uppercase tracking-[0.3em] block mb-6">
            What We Offer
          </span>
          <h1 className="font-black uppercase font-space text-5xl md:text-7xl text-white tracking-tighter leading-none mb-6 drop-shadow-2xl">
            Our <span className="text-brand-light">Services</span>
          </h1>
          <p className="text-white/60 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Comprehensive fitness solutions designed to push your limits and
            achieve your goals.
          </p>
        </div>
      </section>

      {/* ── SERVICE CATEGORIES ── */}
      <section className="py-20 bg-[#0b0b0b]">
        <div className="max-w-5xl mx-auto px-6 space-y-28">
          {CAT_META.map((cat, ci) => {
            const catServices = services.filter(s => s.category === cat.id);
            if (catServices.length === 0) return null;

            return (
              <div key={ci}>
                {/* Category Header */}
                <div className="text-center mb-12">
                  <div className="w-14 h-14 rounded-xl bg-brand/15 border border-brand/25 flex items-center justify-center mx-auto mb-5">
                    <cat.Icon className="w-7 h-7 text-brand-light" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wider text-white mb-3">
                    {cat.title}
                  </h2>
                  <div className="w-12 h-0.5 bg-brand mx-auto mb-4" />
                  <p className="text-white/45 text-sm max-w-lg mx-auto leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                {/* Service Cards Grid */}
                <div className="flex flex-wrap justify-center gap-4">
                  {catServices.map((s, si) => (
                    <div key={si} className="w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1rem)]">
                      <ServiceCard iconKey={s.icon_key} title={s.title} desc={s.description} />
                    </div>
                  ))}
                </div>

                {/* CTA per category */}
                <div className="text-center mt-10">
                  <Link
                    href="/classes"
                    className="group inline-flex items-center gap-3 bg-brand hover:bg-brand-light text-white px-8 py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest transition-all shadow-lg shadow-brand/30 hover:shadow-brand/50"
                  >
                    View Class Schedule
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-28 px-6 text-center overflow-hidden bg-brand">
        <div className="absolute inset-0">
          <Image src={settings.cta_bg_image || "/hero-gym.png"} alt="" fill className="object-cover opacity-10 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/60 via-transparent to-brand-dark/60" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6 font-space text-white drop-shadow-lg leading-tight">
            Ready to Get Started?
          </h2>
          <p className="text-white/70 mb-10 text-lg max-w-xl mx-auto">
            Choose a plan and begin training with our expert coaches today.
          </p>
          <Link
            href="/pricing"
            className="group bg-white text-brand-dark hover:bg-slate-100 px-12 py-5 rounded-xl text-base font-black tracking-wider uppercase shadow-2xl transition-all inline-flex items-center gap-3"
          >
            Explore Membership
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
