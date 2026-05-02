"use client";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Users,
  Zap,
  Trophy,
  Heart,
  Dumbbell,
  Award,
  Target,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white font-sans selection:bg-brand/30">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/About.png"
            alt="Rue Fitness"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-[#0b0b0b]" />
          <div className="absolute inset-0 bg-brand/12 mix-blend-multiply" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 px-6 max-w-4xl mx-auto pt-20">
          <span className="text-brand-light text-sm font-bold uppercase tracking-[0.3em] block mb-6">
            About Rue Fitness
          </span>
          <h1 className="font-black uppercase font-space text-5xl md:text-7xl text-white tracking-tighter leading-none mb-6 drop-shadow-2xl">
            More Than
            <br />
            <span className="text-brand-light">A Gym</span>
          </h1>
          <p className="text-white/60 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            We are a community of driven individuals working toward a
            healthier, stronger future — together.
          </p>
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section className="py-28 bg-[#0b0b0b]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-brand-light text-sm font-bold uppercase tracking-[0.25em] block mb-4">
              Our Story
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase font-space text-white leading-tight mb-6">
              Where It
              <br />
              All Began
            </h2>
            <div className="space-y-4 text-white/55 text-[0.9375rem] leading-relaxed">
              <p>
                Rue Fitness was born from a simple vision: to build the most
                inspiring and high-performance fitness space in Addis Ababa.
                What started as a passion project quickly grew into a movement.
              </p>
              <p>
                Today, we serve hundreds of members across all fitness levels —
                from first-time gym-goers to competitive athletes. Our
                state-of-the-art facility features premium equipment, expert
                coaching, and a community that pushes each other to be better.
              </p>
              <p>
                Every program, every class, and every trainer at Rue Fitness is
                dedicated to one thing: helping you reach your full potential.
              </p>
            </div>
          </div>

          <div className="relative h-[420px] rounded-2xl overflow-hidden ring-1 ring-white/[0.07] shadow-2xl">
            <Image
              src="/hero-gym.png"
              alt="Rue Fitness"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        </div>
      </section>

      {/* ── 3 PILLARS ── */}
      <section className="py-28 bg-surface">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-brand-light text-sm font-bold uppercase tracking-[0.25em] block mb-4">
              Our Foundation
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase font-space text-white leading-tight">
              3 Pillars of Rue Fitness
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                Icon: Users,
                title: "Unity",
                desc: "We believe true progress happens together. Our gym is a community where every member lifts each other up — both physically and mentally. You're never alone on your fitness journey.",
                gradient: "from-brand/20 to-brand-dark/30",
              },
              {
                Icon: Zap,
                title: "Energy",
                desc: "Step inside and feel the difference. Our high-drive atmosphere is designed to fuel your workouts and keep you motivated, session after session. The energy here is contagious.",
                gradient: "from-brand/25 to-brand-dark/35",
              },
              {
                Icon: Trophy,
                title: "Purpose",
                desc: "Every workout has a goal. We foster a culture of discipline and ambition, where each member is working toward something meaningful — whether it's their first 5K or their next personal record.",
                gradient: "from-brand/20 to-brand-dark/30",
              },
            ].map(({ Icon, title, desc, gradient }, i) => (
              <div
                key={i}
                className={`relative p-8 rounded-2xl bg-gradient-to-b ${gradient} border border-brand/20 hover:border-brand/40 transition-all group overflow-hidden`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 rounded-full blur-[60px] pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-brand/20 border border-brand/30 flex items-center justify-center mb-6 group-hover:bg-brand/30 transition-colors">
                    <Icon className="w-7 h-7 text-brand-light" />
                  </div>
                  <h3 className="text-white font-bold text-lg uppercase tracking-widest mb-4">
                    {title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VISION ── */}
      <section className="py-24 bg-[#0b0b0b]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="text-brand-light text-sm font-bold uppercase tracking-[0.3em] block mb-6">
            Our Vision
          </span>
          <div className="border border-brand/30 rounded-2xl px-10 py-12 bg-brand/[0.04] relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-px w-24 h-px bg-brand/50" />
            <p className="text-white font-black uppercase text-lg md:text-xl leading-snug tracking-wide">
              &ldquo;To become a well-known and preferred fitness center in
              Ethiopia and at the international level — recognized for
              excellence, unity, and strength.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-28 bg-surface relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-brand-light text-sm font-bold uppercase tracking-[0.25em] block mb-4">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight font-space text-white">
              Built For Results
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                Icon: Dumbbell,
                title: "Pro Equipment",
                desc: "State-of-the-art machines maintained to the highest standards for your safety and performance.",
              },
              {
                Icon: Users,
                title: "Community",
                desc: "Train alongside motivated members and coaches who push you to achieve more every session.",
              },
              {
                Icon: Heart,
                title: "Personal Care",
                desc: "Every member gets personalized attention and guidance tailored to their unique fitness goals.",
              },
              {
                Icon: Award,
                title: "Certified Coaches",
                desc: "Our trainers hold internationally recognized certifications and years of practical experience.",
              },
            ].map(({ Icon, title, desc }, i) => (
              <div
                key={i}
                className="p-7 rounded-2xl bg-[#0b0b0b] border border-white/[0.06] hover:border-brand/30 hover:bg-surface-elevated transition-all group card-glow"
              >
                <div className="w-12 h-12 rounded-xl bg-brand/15 border border-brand/20 flex items-center justify-center mb-5 group-hover:bg-brand/25 transition-colors">
                  <Icon className="w-5 h-5 text-brand-light" />
                </div>
                <h3 className="font-bold uppercase tracking-widest text-white mb-3 text-sm">
                  {title}
                </h3>
                <p className="text-white/45 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
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
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-6 font-space text-white drop-shadow-lg leading-tight">
            Join the Rue Fitness
            <br />
            Community
          </h2>
          <p className="text-white/70 mb-10 text-lg max-w-xl mx-auto">
            Be part of something bigger. Start your journey with us today.
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
