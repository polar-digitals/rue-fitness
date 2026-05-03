"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Star,
  Phone,
  MapPin,
  Clock,
  ArrowRight,
  Zap,
  Heart,
  Users,
  Trophy,
  Dumbbell,
  Flame,
  Target,
  Activity
} from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { BookingPage } from "./components/Booking";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./components/StaffPortal";

const TESTIMONIALS = [
  {
    name: "Sara Mekonnen",
    role: "Member since 2023",
    avatar:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=200",
    text: "Rue Fitness completely transformed my lifestyle. The trainers are world-class and the environment keeps you motivated every single day.",
    rating: 5,
  },
  {
    name: "Dawit Haile",
    role: "Member since 2022",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    text: "Best gym in Addis Ababa, no question. The equipment is always clean, staff is friendly, and the classes are absolutely intense.",
    rating: 5,
  },
  {
    name: "Mekdes Alemu",
    role: "Member since 2024",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
    text: "I've tried many gyms but none compare to Rue Fitness. The atmosphere is electric and I've seen incredible results in just 3 months.",
    rating: 5,
  },
];

const FALLBACK_TRAINERS = [
  {
    name: "Binyam Degu",
    role: "Personal Trainer",
    desc: "8 years of experience in weight loss, muscle building, nutrition, and strength training.",
    initials: "BD",
    img: ""
  },
  {
    name: "Admassu",
    role: "Personal Trainer",
    desc: "9 years of experience specializing in muscle building, nutrition guidance, and strength conditioning.",
    initials: "AD",
    img: ""
  },
  {
    name: "Natnael Tesfaye",
    role: "CrossFit Coach",
    desc: "Expert in functional fitness, CrossFit methodology, and personalized athletic performance training.",
    initials: "NT",
    img: ""
  },
];

const FALLBACK_SERVICES = [
  {
    icon_key: "hiit",
    title: "Cardio & Dance",
    description: "Boost stamina and burn fat with high-energy cardio workouts, aerobics, Zumba, spinning, and HIIT training.",
  },
  {
    icon_key: "strength",
    title: "Strength & Conditioning",
    description: "Build muscle, power, and endurance with circuit training, CrossFit, functional exercises, and boot camps.",
  },
  {
    icon_key: "personal",
    title: "Personalized Training",
    description: "Achieve your unique fitness goals with one-on-one coaching, weight loss programs, and online coaching.",
  },
];

const ICON_MAP: Record<string, any> = {
  aerobics: Activity, zumba: Users, spinning: Zap, dance: Users, hiit: Flame,
  circuit: Dumbbell, crossfit: Dumbbell, strength: Dumbbell, bodyweight: Dumbbell,
  functional: Activity, bootcamp: Users, core: Target, muscle: Dumbbell,
  personal: Target, weightloss: Flame, online: Target
};

export default function Home() {
  const [showBooking, setShowBooking] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [trainers, setTrainers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loadingContent, setLoadingContent] = useState(true);

  useEffect(() => {
    async function loadDynamicContent() {
      try {
        const headers = {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        };
        const settingsRes = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?select=*`, { headers });
        if (settingsRes.ok) {
          const data = await settingsRes.json();
          const sMap: Record<string, string> = {};
          data.forEach((item: any) => { sMap[item.id] = item.value; });
          setSettings(sMap);
        }

        const trainersRes = await fetch(`${SUPABASE_URL}/rest/v1/trainers?select=*&order=sort_order.asc`, { headers });
        if (trainersRes.ok) {
          const data = await trainersRes.json();
          if (data && data.length > 0) setTrainers(data);
        }

        const servicesRes = await fetch(`${SUPABASE_URL}/rest/v1/services?select=*&order=sort_order.asc`, { headers });
        if (servicesRes.ok) {
          const data = await servicesRes.json();
          if (data && data.length > 0) setServices(data);
        }
      } catch (err) {
        console.error("Error loading dynamic content", err);
      } finally {
        setLoadingContent(false);
      }
    }
    loadDynamicContent();
  }, []);

  const rueBrand = {
    logoSrc: "/logo.svg",
    brandNameNode: <>Rue Fitness</>,
    brandTitle: "Rue Fitness",
  };

  if (showBooking) {
    return (
      <BookingPage onBack={() => setShowBooking(false)} brand={rueBrand} />
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white font-sans selection:bg-brand/30">
      <Navbar />

      {/* ── 1. HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={settings.hero_image || "/hero-gym.png"}
            alt="Rue Fitness Gym"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-[#0b0b0b]" />
          <div className="absolute inset-0 bg-brand/12 mix-blend-multiply" />
        </div>

        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32">
          <div className="animate-float-up inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 text-sm font-medium text-white/90 mb-8">
            <Zap className="w-4 h-4 text-brand-light fill-brand-light" />
            Addis Ababa&apos;s Premium Fitness Destination
          </div>

          <h1 className="animate-float-up delay-100 text-gradient text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter font-space leading-[0.85] mb-6 drop-shadow-2xl whitespace-pre-line">
            {settings.hero_heading || "Train\nWith\nPurpose."}
          </h1>

          <p className="animate-float-up delay-200 text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            {settings.hero_subheading || "Reach your goals at Rue Fitness. Build strength, improve your health, and change your body in our premium, modern gym."}
          </p>

          <div className="animate-float-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/pricing"
              className="group bg-brand hover:bg-brand-light text-white px-10 py-4 rounded-xl text-sm font-bold tracking-wider uppercase transition-all shadow-xl shadow-brand/30 hover:shadow-brand/50 flex items-center gap-3"
            >
              Explore Membership
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/services"
              className="text-white/70 hover:text-white px-8 py-4 rounded-xl border border-white/20 hover:border-white/40 font-semibold tracking-wide transition-all text-sm uppercase"
            >
              Our Services
            </Link>
          </div>

          <div className="animate-float-up delay-500 mt-20 flex flex-col items-center gap-2 text-white/30">
            <div className="w-px h-12 bg-gradient-to-b from-transparent to-brand-light/60" />
            <span className="text-xs tracking-[0.2em] uppercase">Scroll</span>
          </div>
        </div>
      </section>

      {/* ── 2 & 3. ABOUT & SOCIAL PROOFS ── */}
      <section className="relative py-32 flex flex-col items-center justify-center text-center overflow-hidden min-h-screen">
        <div className="absolute inset-0 z-0">
          <Image
            src={settings.about_image || "/About.png"}
            alt="About Rue Fitness"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/80" />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 w-full flex flex-col items-center">
          {/* Social Proofs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mb-24 w-full">
            {[
              { value: "500+", label: "Active Members" },
              { value: "15+", label: "Expert Trainers" },
              {
                value: "5",
                label: "Star Rated",
                isStars: true,
              },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                {s.isStars ? (
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className="w-8 h-8 fill-brand-light text-brand-light"
                      />
                    ))}
                  </div>
                ) : (
                  <span className="text-5xl font-black text-gradient drop-shadow-lg">
                    {s.value}
                  </span>
                )}
                <span className="text-sm text-white/60 font-medium uppercase tracking-widest mt-2">
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {/* About Elements Centered */}
          <div className="max-w-5xl mx-auto">
            <span className="text-brand-light text-sm font-bold uppercase tracking-[0.25em] block mb-4">
              Who We Are
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase font-space text-white leading-tight mb-8 drop-shadow-xl whitespace-pre-line">
              {settings.about_heading || "Built On Unity.\nDriven By Purpose."}
            </h2>
            <p className="text-white/70 text-base md:text-lg leading-relaxed mb-14 max-w-2xl mx-auto">
              {settings.about_text || "Rue Fitness was founded on the belief that true progress happens together. Our gym brings together ambition, discipline, and support to create a space where every member feels empowered."}
            </p>

            {/* 3 Pillars Centered */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              {[
                { Icon: Users, label: "Unity", desc: "A supportive community that trains and grows together." },
                { Icon: Zap, label: "Energy", desc: "High-drive atmosphere that fuels every workout." },
                { Icon: Trophy, label: "Purpose", desc: "Goal-oriented culture built on discipline and ambition." },
              ].map(({ Icon, label, desc }) => (
                <div key={label} className="flex flex-col items-center p-8 rounded-2xl bg-[#0b0b0b]/60 border border-white/[0.08] hover:border-brand/40 transition-colors backdrop-blur-md">
                  <div className="w-14 h-14 rounded-xl bg-brand/20 border border-brand/30 flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-brand-light" />
                  </div>
                  <p className="text-white font-bold text-sm uppercase tracking-widest mb-3">{label}</p>
                  <p className="text-white/55 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 mt-16 text-brand-light text-sm font-bold uppercase tracking-widest hover:gap-3 transition-all"
            >
              Learn More About Us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. SERVICES — 3 CATEGORIES ── */}
      <section className="py-28 bg-surface relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
          <Dumbbell className="w-[600px] h-[600px] text-white" strokeWidth={0.3} />
        </div>

        <div className="relative z-10 text-center mb-16 px-6">
          <span className="text-brand-light text-sm font-bold uppercase tracking-[0.25em] block mb-4">
            What We Offer
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase font-space text-white leading-tight">
            Our Services
          </h2>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          {(services.length > 0 ? services : FALLBACK_SERVICES).map(({ icon_key, title, description }, i) => {
            const Icon = ICON_MAP[icon_key] || Dumbbell;
            return (
              <div
                key={i}
                className="group p-8 rounded-2xl bg-[#0b0b0b] border border-white/[0.06] hover:border-brand/40 transition-all card-glow"
              >
                <div className="w-14 h-14 rounded-xl bg-brand/15 border border-brand/25 flex items-center justify-center mb-6 group-hover:bg-brand/25 transition-colors">
                  <Icon className="w-7 h-7 text-brand-light" />
                </div>
                <h3 className="text-white font-bold text-base uppercase tracking-widest mb-3">
                  {title}
                </h3>
                <p className="text-white/45 text-sm leading-relaxed mb-6">
                  {description}
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 text-brand-light text-sm font-bold uppercase tracking-widest hover:gap-3 transition-all"
                >
                  Explore More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 5. TRAINERS — 3 CARDS ── */}
      <section className="py-28 bg-[#0b0b0b] relative overflow-hidden">
        <div className="absolute left-0 top-0 w-96 h-96 bg-brand/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 text-center mb-16 px-6">
          <span className="text-brand-light text-sm font-bold uppercase tracking-[0.25em] block mb-4">
            Meet The Team
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase font-space text-white leading-tight">
            Expert Trainers
          </h2>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          {(trainers.length > 0 ? trainers : FALLBACK_TRAINERS).map((trainer, i) => (
            <div
              key={i}
              className="group rounded-2xl overflow-hidden border border-white/[0.06] hover:border-brand/40 transition-all card-glow"
            >
              <div className="h-64 bg-gradient-to-b from-surface-elevated to-surface flex items-center justify-center relative">
                {trainer.img ? (
                  <Image src={trainer.img} alt={trainer.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-brand/20 border-2 border-brand/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl font-black text-brand-light/70 uppercase">
                      {trainer.initials || trainer.name.substring(0, 2)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-brand/0 group-hover:bg-brand/5 transition-colors" />
              </div>

              <div className="p-6 bg-surface relative z-10">
                <p className="text-white font-bold text-sm uppercase tracking-widest mb-1">
                  {trainer.name}
                </p>
                <p className="text-brand-light text-xs uppercase tracking-widest font-semibold mb-3">
                  {trainer.role}
                </p>
                <p className="text-white/45 text-sm leading-relaxed">
                  {trainer.bio || trainer.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. TESTIMONIALS ── */}
      <section className="py-28 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-brand-light text-sm font-bold uppercase tracking-[0.25em] block mb-4">
              What Members Say
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight font-space text-white">
              Success Stories
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="testimonial-quote relative p-8 rounded-2xl bg-[#0b0b0b] border border-white/[0.06] hover:border-brand/30 transition-all card-glow"
              >
                <div className="flex gap-1 mb-5 mt-6">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star
                      key={j}
                      className="w-4 h-4 fill-brand-light text-brand-light"
                    />
                  ))}
                </div>
                <p className="text-white/65 leading-relaxed text-sm mb-6">
                  {t.text}
                </p>
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-brand/30">
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{t.name}</p>
                    <p className="text-white/40 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. CONTACT — MAP + INFO ── */}
      <section className="py-28 bg-[#0b0b0b]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-brand-light text-sm font-bold uppercase tracking-[0.25em] block mb-4">
              Contact & Location
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight font-space text-white">
              Visit Us
            </h2>
          </div>

          {/* Full-width Map */}
          <div className="w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden ring-1 ring-white/[0.07] shadow-2xl mb-12">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.5!2d38.74!3d9.01!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85f1b0b0b0b%3A0x0!2sRue+Fitness!5e0!3m2!1sen!2set!4v1700000000000!5m2!1sen!2set"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>

          {/* Contact Info Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                Icon: Phone,
                title: "Call Us",
                lines: [
                  "+251 98 621 2121",
                  "+251 902 67 77 69",
                  "+251 911 80 77 69",
                ],
              },
              {
                Icon: MapPin,
                title: "Location",
                lines: [
                  "Fikremariam Aba Techan St,",
                  "Addis Ababa, Ethiopia",
                ],
              },
              {
                Icon: Clock,
                title: "Working Hours",
                lines: [
                  "MON – SAT: 6:00 AM – 10:00 PM",
                  "SUN: 6:00 AM – 8:00 PM",
                ],
              },
            ].map(({ Icon, title, lines }, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-6 rounded-xl bg-surface border border-white/[0.06] hover:border-brand/30 transition-colors"
              >
                <div className="w-11 h-11 rounded-xl border border-brand/25 bg-brand/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-brand-light" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-white font-bold text-sm uppercase tracking-widest mb-1">
                    {title}
                  </p>
                  {lines.map((l, j) => (
                    <span key={j} className="text-white/60 text-sm">
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. CTA BANNER ── */}
      <section className="relative py-28 px-6 text-center overflow-hidden bg-brand">
        <div className="absolute inset-0">
          <Image
            src="/hero-gym.png"
            alt=""
            fill
            className="object-cover opacity-10 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/60 via-transparent to-brand-dark/60" />
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6 font-space text-white drop-shadow-lg leading-tight">
            Ready to Start
            <br />
            Your Journey?
          </h2>
          <p className="text-white/70 mb-10 text-lg max-w-xl mx-auto">
            Join hundreds of members who have transformed their bodies and
            their lives at Rue Fitness.
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
