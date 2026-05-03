"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Clock, User, ArrowRight, Filter } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../components/StaffPortal";

const DAYS = [
  "ALL DAYS",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];
const SESSIONS = ["ALL", "MORNING", "EVENING"];

type ClassEntry = {
  day: string;
  time: string;
  activity: string;
  trainer: string | string[];
  session: "MORNING" | "EVENING";
  special?: boolean;
  bookable?: boolean;
  id?: string;
};

const DEFAULT_CLASSES: ClassEntry[] = [
  { day: "Monday", time: "06:00 – 07:00 AM", activity: "AEROBICS", trainer: "Abel Gebeyehu", session: "MORNING" },
  { day: "Monday", time: "07:00 – 08:00 PM", activity: "AEROBICS", trainer: "Kidist Melak", session: "EVENING" },
  { day: "Tuesday", time: "07:00 – 08:00 PM", activity: "SPINNING BIKE", trainer: "G/mariam Tismaw", session: "EVENING", bookable: true },
  { day: "Wednesday", time: "07:00 – 08:00 PM", activity: "AEROBICS & TAYBO", trainer: "Akilu Seid", session: "EVENING" },
  { day: "Thursday", time: "06:00 – 07:00 AM", activity: "CROSSFIT", trainer: "Natsuyel Tesfaye", session: "MORNING" },
  { day: "Thursday", time: "07:00 – 08:00 PM", activity: "SPINNING BIKE", trainer: "G/mariam Tismaw", session: "EVENING" },
  { day: "Friday", time: "07:00 – 08:00 PM", activity: "AEROBICS", trainer: ["Kidist Melak", "Abel Gebeyehu", "Akilu Seid"], session: "EVENING", special: true },
  { day: "Saturday", time: "06:00 – 07:00 AM", activity: "CARDIO TRAINING", trainer: ["Amanuel Henok", "Naodi & Sami"], session: "MORNING" },
  { day: "Saturday", time: "Evening", activity: "SPECIAL GROUP DAY", trainer: "All Trainers", session: "EVENING", special: true },
];

export default function ClassesPage() {
  const [activeDay, setActiveDay] = useState("ALL DAYS");
  const [activeSession, setActiveSession] = useState("ALL");
  const [schedule, setSchedule] = useState<ClassEntry[]>(DEFAULT_CLASSES);
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadContent() {
      try {
        const headers = { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` };
        const [schRes, setRes] = await Promise.all([
          fetch(`${SUPABASE_URL}/rest/v1/schedule?select=*`, { headers }),
          fetch(`${SUPABASE_URL}/rest/v1/site_settings?select=*`, { headers })
        ]);
        if (schRes.ok) {
          const data = await schRes.json();
          if (data && data.length > 0) setSchedule(data);
        }
        if (setRes.ok) {
          const data = await setRes.json();
          const map: Record<string, string> = {};
          data.forEach((i: any) => { map[i.id] = i.value; });
          setSettings(map);
        }
      } catch (e) {}
    }
    loadContent();
  }, []);

  const filtered = schedule.filter((c) => {
    const dayMatch =
      activeDay === "ALL DAYS" || c.day.toUpperCase() === activeDay;
    const sessionMatch =
      activeSession === "ALL" || c.session === activeSession;
    return dayMatch && sessionMatch;
  });

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white font-sans selection:bg-brand/30">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative h-[75vh] min-h-[520px] flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={settings.classes_hero_image || "/classes-hero.png"}
            alt="Group Class"
            fill
            className="object-cover object-top"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-[#0b0b0b]" />
          <div className="absolute inset-0 bg-brand/12 mix-blend-multiply" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-brand/25 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 px-6 max-w-5xl mx-auto pt-20 flex flex-col items-center">
          <h1 className="font-black uppercase leading-none font-space mb-5 drop-shadow-2xl text-center">
            <span className="block text-5xl sm:text-6xl md:text-8xl text-white tracking-tighter">
              GROUP CLASS
            </span>
            <span className="block text-5xl sm:text-6xl md:text-8xl text-brand-light tracking-tighter">
              PROGRAM
            </span>
          </h1>
          <p className="text-white/60 text-base md:text-lg font-semibold tracking-[0.3em] uppercase mb-14">
            Train. Sweat. Transform.
          </p>

          {/* DAY FILTER PILLS */}
          <div className="flex flex-wrap justify-center gap-2.5">
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
                  activeDay === day
                    ? "bg-brand text-white border-brand shadow-lg shadow-brand/40"
                    : "bg-black/40 backdrop-blur-sm text-white/65 border-white/15 hover:border-brand/50 hover:text-white"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── SESSION FILTER ── */}
      <section className="bg-[#0b0b0b] py-6">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 text-white/35 text-xs font-bold uppercase tracking-[0.2em]">
            <Filter className="w-3.5 h-3.5" />
            Filter
          </div>
          <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.07] rounded-full p-1">
            {SESSIONS.map((s) => (
              <button
                key={s}
                onClick={() => setActiveSession(s)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  activeSession === s
                    ? "bg-white text-[#0b0b0b] shadow"
                    : "text-white/45 hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCHEDULE TABLE ── */}
      <section className="bg-[#0b0b0b] pb-28">
        <div className="max-w-5xl mx-auto px-6">
          {filtered.length === 0 ? (
            <div className="text-center py-24 text-white/25 text-xs font-bold uppercase tracking-[0.3em]">
              No classes for this selection.
            </div>
          ) : (
            <div className="rounded-2xl border border-white/[0.07] overflow-hidden shadow-2xl">
              {/* Header row */}
              <div className="hidden md:grid grid-cols-[1.1fr_1.7fr_2.2fr_2fr_1.3fr_1.1fr] gap-4 px-8 py-4 bg-white/[0.025] border-b border-white/[0.06]">
                {["DAY", "TIME", "ACTIVITY", "TRAINER", "SESSION", "ACTION"].map((h) => (
                  <span key={h} className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-white/30">
                    {h}
                  </span>
                ))}
              </div>

              {/* Rows */}
              <div className="divide-y divide-white/[0.045]">
                {filtered.map((cls, i) => (
                  <div
                    key={i}
                    className="group flex flex-col md:grid md:grid-cols-[1.1fr_1.7fr_2.2fr_2fr_1.3fr_1.1fr] gap-3 md:gap-4 px-6 md:px-8 py-5 md:py-6 items-start md:items-center hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="font-bold text-white text-sm">
                      {cls.day}
                    </span>

                    <div className="flex items-center gap-2 text-white/45 text-sm">
                      <Clock className={`w-3.5 h-3.5 shrink-0 ${cls.time === "Evening" ? "text-white/30" : "text-brand-light"}`} />
                      <span>{cls.time}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold uppercase tracking-wide ${cls.special ? "text-brand-light" : "text-white"}`}>
                        {cls.activity}
                      </span>
                      {cls.special && <span className="text-brand-light/70 text-xs">✦</span>}
                    </div>

                    <div className="flex flex-col gap-1">
                      {(Array.isArray(cls.trainer) ? cls.trainer : [cls.trainer]).map((t, j) => (
                        <div key={j} className="flex items-center gap-1.5 text-white/50 text-sm">
                          <User className="w-3 h-3 text-brand/50 shrink-0" />
                          {t}
                        </div>
                      ))}
                    </div>

                    <div>
                      <span className={`inline-block px-3 py-1.5 rounded-full text-[0.65rem] font-bold uppercase tracking-widest border ${
                        cls.session === "MORNING"
                          ? "bg-brand/15 text-brand-light border-brand/25"
                          : "bg-white/[0.04] text-white/50 border-white/[0.08]"
                      }`}>
                        {cls.session}
                      </span>
                    </div>

                    <div className="flex items-center">
                      {cls.bookable ? (
                        <button className="px-4 py-2 rounded-lg border border-brand/50 text-brand-light text-xs font-bold uppercase tracking-widest hover:bg-brand hover:border-brand hover:text-white transition-all shadow-md shadow-brand/20">
                          Book Spot
                        </button>
                      ) : (
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity px-4 py-2 rounded-lg border border-white/[0.08] text-white/30 text-xs font-bold uppercase tracking-widest hover:border-brand/40 hover:text-brand-light">
                          Join
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-28 px-6 text-center overflow-hidden bg-brand">
        <div className="absolute inset-0">
          <Image src={settings.cta_bg_image || "/hero-gym.png"} alt="" fill className="object-cover opacity-10 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/60 via-transparent to-brand-dark/60" />
        </div>
        <div className="relative z-10 max-w-xl mx-auto">
          <h2 className="font-black uppercase tracking-tight font-space text-white text-3xl md:text-5xl mb-4 leading-tight">
            JOIN A <span className="text-brand-light">CLASS TODAY</span>
          </h2>
          <div className="w-14 h-1 bg-brand mx-auto mb-8 rounded-full" />
          <Link
            href="/pricing"
            className="group inline-flex items-center gap-3 bg-brand hover:bg-brand-light text-white px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-xl shadow-brand/30 hover:shadow-brand/50"
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
