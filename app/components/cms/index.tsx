"use client";
import { useState } from "react";
import { Images, Users, CalendarDays, Dumbbell, CreditCard, Megaphone } from "lucide-react";
import GalleryManager from "./GalleryManager";
import TrainerManager from "./TrainerManager";
import ScheduleManager from "./ScheduleManager";
import ServiceManager from "./ServiceManager";
import PricingManager from "./PricingManager";
import AnnouncementManager from "./AnnouncementManager";
import SettingsManager from "./SettingsManager";
import { Settings } from "lucide-react";

const TABS = [
  { key: "gallery", label: "Gallery", Icon: Images },
  { key: "trainers", label: "Trainers", Icon: Users },
  { key: "schedule", label: "Schedule", Icon: CalendarDays },
  { key: "services", label: "Services", Icon: Dumbbell },
  { key: "pricing", label: "Pricing", Icon: CreditCard },
  { key: "announcements", label: "Alerts", Icon: Megaphone },
  { key: "settings", label: "Settings", Icon: Settings },
];

export default function CMSDashboard() {
  const [activeTab, setActiveTab] = useState("gallery");

  return (
    <div className="flex-1 px-6 md:px-10 py-8 max-w-7xl mx-auto w-full">
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-3 border-b border-white/[0.06]">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
              activeTab === key
                ? "bg-brand text-white shadow-lg shadow-brand/20"
                : "text-white/35 hover:text-white/60 hover:bg-white/[0.03] border border-transparent hover:border-white/[0.06]"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Active Section */}
      {activeTab === "gallery" && <GalleryManager />}
      {activeTab === "trainers" && <TrainerManager />}
      {activeTab === "schedule" && <ScheduleManager />}
      {activeTab === "services" && <ServiceManager />}
      {activeTab === "pricing" && <PricingManager />}
      {activeTab === "announcements" && <AnnouncementManager />}
      {activeTab === "settings" && <SettingsManager />}
    </div>
  );
}
