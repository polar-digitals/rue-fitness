"use client";
import { useEffect, useState } from "react";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./StaffPortal";
import { X, ExternalLink, Bell } from "lucide-react";
import Link from "next/link";

interface Announcement {
  id: string;
  message: string;
  type: string;
  active: boolean;
  link_text: string | null;
  link_url: string | null;
  bg_color: string | null;
}

const TYPE_STYLES: Record<string, { bg: string; text: string; icon: string }> = {
  promo: { bg: "bg-brand text-black", text: "text-black font-black uppercase tracking-widest text-xs md:text-sm font-space", icon: "text-black" },
  info: { bg: "bg-blue-600 text-white", text: "text-white font-black uppercase tracking-widest text-xs md:text-sm font-space", icon: "text-blue-100" },
  warning: { bg: "bg-amber-500 text-black", text: "text-black font-black uppercase tracking-widest text-xs md:text-sm font-space", icon: "text-amber-950" },
  urgent: { bg: "bg-red-600 text-white", text: "text-white font-black uppercase tracking-widest text-xs md:text-sm font-space", icon: "text-red-100" },
};

export default function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    if (sessionStorage.getItem("dismissedAnnouncement")) {
      setDismissed(true);
    }

    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/announcements?select=*&active=eq.true&order=created_at.desc&limit=1`,
          {
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok && data && data.length > 0) {
          setAnnouncement(data[0]);
        }
      } catch (err) {
        console.error("Error fetching announcements:", err);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("dismissedAnnouncement", "true");
  };

  if (!announcement || dismissed) return null;

  const style = TYPE_STYLES[announcement.type || "promo"] || TYPE_STYLES.promo;

  return (
    <div className={`w-full ${style.bg} relative z-[60] px-4 py-3 shadow-lg flex items-center justify-center`}>
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 pr-8 w-full">
        <Bell className={`w-4 h-4 md:w-5 md:h-5 flex-shrink-0 animate-pulse ${style.icon}`} />
        <p className={`text-center ${style.text}`}>
          {announcement.message}
        </p>
        
        {announcement.link_text && announcement.link_url && (
          <Link 
            href={announcement.link_url} 
            className={`flex items-center gap-1 font-bold text-[10px] md:text-xs uppercase tracking-widest whitespace-nowrap ml-2 border-b-2 hover:opacity-70 transition-opacity ${style.icon} border-current`}
          >
            {announcement.link_text} <ExternalLink className="w-3 h-3 md:w-4 md:h-4" />
          </Link>
        )}
      </div>
      
      <button 
        onClick={handleDismiss}
        className={`absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-black/10 transition-colors ${style.icon}`}
        aria-label="Dismiss announcement"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
