"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Check, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../components/StaffPortal";

type PlanType = "gym" | "spa";
type MemberType = "individual" | "couple" | "family";

export default function PricingPage() {
  const [pricingType, setPricingType] = useState<PlanType>("gym");
  const [memberType, setMemberType] = useState<MemberType>("individual");
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [dbPlans, setDbPlans] = useState<any[]>([]);

  useEffect(() => {
    async function loadContent() {
      try {
        const headers = { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` };
        const [pRes, sRes] = await Promise.all([
          fetch(`${SUPABASE_URL}/rest/v1/pricing?select=*`, { headers }),
          fetch(`${SUPABASE_URL}/rest/v1/site_settings?select=*`, { headers })
        ]);
        if (pRes.ok) {
          const data = await pRes.json();
          setDbPlans(data);
        }
        if (sRes.ok) {
          const data = await sRes.json();
          const map: Record<string, string> = {};
          data.forEach((i: any) => { map[i.id] = i.value; });
          setSettings(map);
        }
      } catch (e) {}
    }
    loadContent();
  }, []);

  const plans = dbPlans.filter(p => p.plan_type === pricingType && p.member_type === memberType);

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white font-sans selection:bg-brand/30">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative h-[55vh] min-h-[420px] flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={settings.pricing_hero_image || "/hero-gym.png"}
            alt="Pricing"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/65 to-[#0b0b0b]" />
          <div className="absolute inset-0 bg-brand/12 mix-blend-multiply" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 px-6 max-w-4xl mx-auto pt-20">
          <span className="text-brand-light text-sm font-bold uppercase tracking-[0.3em] block mb-6">
            Membership Plans
          </span>
          <h1 className="font-black uppercase font-space text-5xl md:text-7xl text-white tracking-tighter leading-none mb-6 drop-shadow-2xl">
            Choose Your <span className="text-brand-light">Plan</span>
          </h1>
          <p className="text-white/60 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Elite training, premium facilities. Find the perfect plan for your
            journey.
          </p>
        </div>
      </section>

      {/* ── PLAN TYPE TOGGLE ── */}
      <section className="bg-[#0b0b0b] pt-10 pb-4">
        <div className="flex items-center justify-center gap-3">
          {(
            [
              { key: "gym", label: "🏋️  Gym Only" },
              { key: "spa", label: "♨️  Gym + Spa" },
            ] as { key: PlanType; label: string }[]
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPricingType(key)}
              className={`px-7 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
                pricingType === key
                  ? "bg-brand text-white border-brand shadow-lg shadow-brand/40"
                  : "bg-white/[0.04] text-white/55 border-white/[0.08] hover:border-brand/40 hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* ── MEMBER TYPE TABS ── */}
      <section className="bg-[#0b0b0b] pb-8">
        <div className="flex items-center justify-center gap-6">
          {(
            [
              { key: "individual", label: "👤  Individual" },
              { key: "couple", label: "👥  Couple (2 People)" },
              { key: "family", label: "👨‍👩‍👧‍👦  Group / Family (4 People)" },
            ] as { key: MemberType; label: string }[]
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setMemberType(key)}
              className={`pb-2 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${
                memberType === key
                  ? "text-white border-brand"
                  : "text-white/35 border-transparent hover:text-white/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* ── PRICING CARDS — UNIFORM SIZE ── */}
      <section className="bg-[#0b0b0b] pb-28 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative flex flex-col rounded-2xl border p-6 transition-all ${
                plan.best
                  ? "bg-gradient-to-b from-brand/30 to-brand-dark/40 border-brand/60 shadow-2xl shadow-brand/25 ring-1 ring-brand/40"
                  : plan.popular
                  ? "bg-gradient-to-b from-[#1e1028] to-[#150e1a] border-brand/40 shadow-xl shadow-brand/15"
                  : "bg-surface border-white/[0.07] hover:border-brand/30"
              }`}
            >
              {plan.best && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white text-brand-dark text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow whitespace-nowrap">
                  Best Value
                </div>
              )}
              {plan.popular && !plan.best && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-brand/40 whitespace-nowrap">
                  Most Popular
                </div>
              )}

              {plan.save && (
                <div className="text-xs font-bold text-brand-light uppercase tracking-widest mb-1">
                  {plan.save}
                </div>
              )}

              <div className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">
                {plan.label}
              </div>

              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-white/40 text-xs font-bold">ETB</span>
                <span
                  className={`font-black leading-none text-2xl ${
                    plan.best || plan.popular
                      ? "text-brand-light"
                      : "text-white"
                  }`}
                >
                  {plan.price.toLocaleString()}
                </span>
              </div>

              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map((f: string, j: number) => (
                  <li
                    key={j}
                    className="flex items-start gap-2 text-white/55 text-xs"
                  >
                    <Check
                      className={`w-3.5 h-3.5 shrink-0 mt-px ${
                        plan.popular || plan.best
                          ? "text-brand-light"
                          : "text-white/25"
                      }`}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                  plan.best
                    ? "bg-brand hover:bg-brand-light text-white shadow-lg shadow-brand/30"
                    : plan.popular
                    ? "bg-brand/80 hover:bg-brand text-white"
                    : "bg-white/[0.05] hover:bg-white/10 text-white border border-white/10"
                }`}
              >
                Select Plan
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-28 px-6 text-center overflow-hidden bg-brand">
        <div className="absolute inset-0">
          <Image
            src={settings.cta_bg_image || "/hero-gym.png"}
            alt=""
            fill
            className="object-cover opacity-10 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/60 via-transparent to-brand-dark/60" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6 font-space text-white drop-shadow-lg leading-tight">
            Not Sure Which
            <br />
            Plan Is Right?
          </h2>
          <p className="text-white/70 mb-10 text-lg max-w-xl mx-auto">
            Visit us for a free consultation and tour of our facility. Our team
            will help you find the perfect membership.
          </p>
          <Link
            href="/"
            className="group bg-white text-brand-dark hover:bg-slate-100 px-12 py-5 rounded-xl text-base font-black tracking-wider uppercase shadow-2xl transition-all inline-flex items-center gap-3"
          >
            Contact Us
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
