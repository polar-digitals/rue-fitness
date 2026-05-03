import { motion, AnimatePresence } from "motion/react";
import {
  Menu, X, Phone, MapPin, ChevronRight, Star, Quote,
  Calendar, Clock, User, Mail, MessageSquare, CheckCircle,
  Facebook, Instagram, Send, LogIn, LogOut, Eye, EyeOff,
  Shield, RefreshCw, Search, Filter, Trash2, CheckSquare,
  XSquare, AlertCircle
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

// ─── SUPABASE CONFIG ─────────────────────────────────────────────────────────
// Replace these with your actual Supabase project values
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ommxhoxlkkuxldljydtg.supabase.co";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tbXhob3hsa2t1eGxkbGp5ZHRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2MTIxOTgsImV4cCI6MjA5MzE4ODE5OH0.BQY2jOV2ebA0ycKocPiJtZVgNiTUWUNJtgp_xNLe37g";

type SupabaseClient = {
  from: (table: string) => any;
  storage: {
    from: (bucket: string) => {
      upload: (path: string, file: File) => Promise<any>;
      getPublicUrl: (path: string) => { data: { publicUrl: string } };
    };
  };
  auth: {
    signInWithPassword: (creds: { email: string; password: string }) => Promise<any>;
    signOut: () => Promise<any>;
    getSession: () => Promise<any>;
    onAuthStateChange: (cb: (event: string, session: any) => void) => { data: { subscription: { unsubscribe: () => void } } };
  };
};

// Lightweight Supabase client (no SDK needed)
const createSupabaseClient = (): SupabaseClient => {
  const headers = {
    "Content-Type": "application/json",
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  };

  let authToken = SUPABASE_ANON_KEY;
  let authListeners: Array<(event: string, session: any) => void> = [];

  const getAuthHeaders = () => ({
    ...headers,
    Authorization: `Bearer ${authToken}`,
  });

  return {
    from: (table: string) => ({
      select: (cols = "*") => ({
        order: (col: string, opts = {}) => ({
          async then(resolve: any, reject: any) {
            try {
              const res = await fetch(
                `${SUPABASE_URL}/rest/v1/${table}?select=${cols}&order=${col}.desc`,
                { headers: getAuthHeaders() }
              );
              const data = await res.json();
              resolve({ data, error: res.ok ? null : data });
            } catch (e) { reject(e); }
          }
        }),
        async then(resolve: any, reject: any) {
          try {
            const res = await fetch(
              `${SUPABASE_URL}/rest/v1/${table}?select=${cols}`,
              { headers: getAuthHeaders() }
            );
            const data = await res.json();
            resolve({ data, error: res.ok ? null : data });
          } catch (e) { reject(e); }
        }
      }),
      insert: (rows: any) => ({
        select: () => ({
          async then(resolve: any, reject: any) {
            try {
              const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
                method: "POST",
                headers: { ...getAuthHeaders(), Prefer: "return=representation" },
                body: JSON.stringify(rows),
              });
              const data = await res.json();
              resolve({ data, error: res.ok ? null : data });
            } catch (e) { reject(e); }
          }
        }),
        async then(resolve: any, reject: any) {
          try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
              method: "POST",
              headers: { ...getAuthHeaders(), Prefer: "return=minimal" },
              body: JSON.stringify(rows),
            });
            const data = res.ok ? null : await res.json();
            resolve({ data: null, error: data });
          } catch (e) { reject(e); }
        }
      }),
      update: (vals: any) => ({
        eq: (col: string, val: any) => ({
          async then(resolve: any, reject: any) {
            try {
              const res = await fetch(
                `${SUPABASE_URL}/rest/v1/${table}?${col}=eq.${val}`,
                {
                  method: "PATCH",
                  headers: { ...getAuthHeaders(), Prefer: "return=minimal" },
                  body: JSON.stringify(vals),
                }
              );
              resolve({ data: null, error: res.ok ? null : await res.json() });
            } catch (e) { reject(e); }
          }
        })
      }),
      delete: () => ({
        eq: (col: string, val: any) => ({
          async then(resolve: any, reject: any) {
            try {
              const res = await fetch(
                `${SUPABASE_URL}/rest/v1/${table}?${col}=eq.${val}`,
                { method: "DELETE", headers: getAuthHeaders() }
              );
              resolve({ data: null, error: res.ok ? null : await res.json() });
            } catch (e) { reject(e); }
          }
        })
      }),
    }),
    auth: {
      signInWithPassword: async ({ email, password }) => {
        const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
          method: "POST",
          headers,
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (res.ok && data.access_token) {
          authToken = data.access_token;
          authListeners.forEach(cb => cb("SIGNED_IN", data));
        }
        return { data: res.ok ? data : null, error: res.ok ? null : data };
      },
      signOut: async () => {
        await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
          method: "POST", headers: getAuthHeaders(),
        });
        authToken = SUPABASE_ANON_KEY;
        authListeners.forEach(cb => cb("SIGNED_OUT", null));
        return { error: null };
      },
      getSession: async () => {
        return { data: { session: authToken !== SUPABASE_ANON_KEY ? { access_token: authToken } : null }, error: null };
      },
      onAuthStateChange: (cb) => {
        authListeners.push(cb);
        return { data: { subscription: { unsubscribe: () => { authListeners = authListeners.filter(l => l !== cb); } } } };
      },
    },
    storage: {
      from: (bucket: string) => ({
        upload: async (path: string, file: File) => {
          const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`, {
            method: 'POST',
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${authToken}`,
              'Content-Type': file.type || 'application/octet-stream',
            },
            body: file,
          });
          const data = await res.json();
          return { data: res.ok ? data : null, error: res.ok ? null : data };
        },
        getPublicUrl: (path: string) => {
          return { data: { publicUrl: `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}` } };
        }
      })
    }
  };
};

export const supabase = createSupabaseClient();

// ─── TYPES ───────────────────────────────────────────────────────────────────
type Page = "home" | "booking" | "contact" | "staff";

interface Appointment {
  id?: string;
  created_at?: string;
  service: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  status?: "pending" | "confirmed" | "cancelled";
}


export interface BrandConfig {
  logoSrc: string;
  brandNameNode: React.ReactNode;
  brandTitle?: string;
}

const StaffLogin = ({ onLogin, brand }: { onLogin: () => void; brand?: BrandConfig }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) { setError("Please enter your credentials."); return; }
    setLoading(true);
    setError("");
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError("Invalid credentials. Please check your email and password.");
      } else {
        onLogin();
      }
    } catch {
      setError("Connection error. Please check your Supabase configuration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-12">
          {brand ? (
            <>
              <img src={brand.logoSrc} alt={brand.brandTitle || "Logo"} className="w-9 h-9 object-contain brightness-0 invert drop-shadow-md" onError={(e) => {
                e.currentTarget.style.display = 'none';
              }} />
              <span className="text-white font-black text-xl tracking-[0.15em] uppercase font-space drop-shadow-md">
                {brand.brandNameNode}
              </span>
            </>
          ) : (
            <>
              <img src="/logo.svg" alt="Logo" className="h-12 w-auto object-contain brightness-0 invert" />
              <span className="font-serif text-2xl font-semibold tracking-tight uppercase text-bg">System</span>
            </>
          )}
        </div>

        <div className="bg-bg p-10 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-accent/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="text-xl font-serif font-semibold">Staff Portal</h1>
              <p className="text-ink/50 text-xs uppercase tracking-widest">Secure Access</p>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm mb-6 p-3 bg-red-50 border border-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-xs uppercase tracking-widest text-ink/50 mb-2 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" />
                <input
                  type="email"
                  placeholder="staff@ruefitness.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="w-full border border-primary/15 pl-10 pr-4 py-3.5 text-ink focus:border-primary outline-none transition-colors text-sm bg-transparent"
                />
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-ink/50 mb-2 block">Password</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30" />
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  className="w-full border border-primary/15 pl-10 pr-12 py-3.5 text-ink focus:border-primary outline-none transition-colors text-sm bg-transparent"
                />
                <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-4 bg-primary text-bg hover:bg-accent hover:text-primary transition-all duration-300 uppercase tracking-widest text-xs font-bold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Authenticating...</> : <><LogIn className="w-4 h-4" /> Sign In</>}
          </button>

          <p className="text-center text-xs text-ink/30 mt-6 leading-relaxed">
            Authorized staff only. Create accounts via Supabase Dashboard - Authentication - Users.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// ─── BOOKINGS DASHBOARD ─────────────────────────────────────────────────────────
const BookingsDashboard = ({ onLogout, onHome, brand }: { onLogout: () => void; onHome: () => void; brand?: BrandConfig }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled" | "today">("all");
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState<Appointment | null>(null);

  const todayStr = new Date().toISOString().split("T")[0];

  const fetchAppointments = useCallback(async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase.from("appointments").select("*").order("created_at", { descending: true });
      if (!error && data) setAppointments(data);
    } catch {
      setAppointments([
        { id: "1", created_at: new Date().toISOString(), service: "Personal Training", date: todayStr, time: "9:00 AM", name: "Helen Tadesse", phone: "+251 911 222 333", email: "helen@example.com", notes: "First session, focus on upper body.", status: "confirmed" },
        { id: "2", created_at: new Date(Date.now() - 3600000).toISOString(), service: "Spinning Class", date: todayStr, time: "11:00 AM", name: "Dawit Bekele", phone: "+251 922 333 444", email: "dawit@example.com", notes: "", status: "pending" },
        { id: "3", created_at: new Date(Date.now() - 7200000).toISOString(), service: "Spa & Massage", date: "2026-04-15", time: "2:00 PM", name: "Sara Haile", phone: "+251 933 444 555", email: "sara@example.com", notes: "Deep tissue massage requested.", status: "cancelled" },
        { id: "4", created_at: new Date(Date.now() - 86400000).toISOString(), service: "Body Assessment", date: "2026-04-16", time: "10:00 AM", name: "Yonas Girma", phone: "+251 944 555 666", email: "yonas@example.com", notes: "", status: "pending" },
        { id: "5", created_at: new Date(Date.now() - 172800000).toISOString(), service: "CrossFit Session", date: "2026-04-17", time: "3:00 PM", name: "Meron Alemu", phone: "+251 955 666 777", email: "meron@example.com", notes: "Beginner level.", status: "confirmed" },
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [todayStr]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const updateStatus = async (id: string, status: "pending" | "confirmed" | "cancelled") => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    try {
      await supabase.from("appointments").update({ status }).eq("id", id);
    } catch {}
  };

  const deleteAppointment = async (id: string) => {
    if (!confirm("Delete this appointment?")) return;
    setAppointments(prev => prev.filter(a => a.id !== id));
    try {
      await supabase.from("appointments").delete().eq("id", id);
    } catch {}
  };

  const exportCSV = () => {
    const headers = ["Name","Phone","Email","Service","Date","Time","Status","Notes","Booked At"];
    const rows = filtered.map(a => [
      a.name, a.phone, a.email, a.service, a.date, a.time,
      a.status || "", a.notes || "",
      a.created_at ? new Date(a.created_at).toLocaleString() : ""
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `appointments-${todayStr}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = appointments.filter(a => {
    let matchFilter = true;
    if (filter === "today") matchFilter = a.date === todayStr;
    else if (filter !== "all") matchFilter = a.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.service.toLowerCase().includes(q) || a.phone.includes(q);
    return matchFilter && matchSearch;
  });

  const stats = {
    total: appointments.length,
    today: appointments.filter(a => a.date === todayStr).length,
    pending: appointments.filter(a => a.status === "pending").length,
    confirmed: appointments.filter(a => a.status === "confirmed").length,
    cancelled: appointments.filter(a => a.status === "cancelled").length,
  };

  const statusColor: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    confirmed: "bg-green-100 text-green-700 border-green-200",
    cancelled: "bg-red-100 text-red-600 border-red-200",
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col">
      {/* Appointment Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="bg-white max-w-lg w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-primary text-bg p-6 flex items-start justify-between">
                <div>
                  <p className="text-bg/50 text-[10px] uppercase tracking-widest mb-1">Appointment Details</p>
                  <h3 className="font-serif text-2xl">{selected.name}</h3>
                </div>
                <button onClick={() => setSelected(null)} className="text-bg/50 hover:text-bg transition-colors mt-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#f4f6f9] p-4">
                    <p className="text-[10px] uppercase tracking-widest text-ink/40 mb-1">Service</p>
                    <p className="font-medium text-sm">{selected.service}</p>
                  </div>
                  <div className="bg-[#f4f6f9] p-4">
                    <p className="text-[10px] uppercase tracking-widest text-ink/40 mb-1">Status</p>
                    <span className={`text-xs px-2 py-0.5 border font-bold uppercase tracking-widest ${statusColor[selected.status || "pending"]}`}>{selected.status}</span>
                  </div>
                  <div className="bg-[#f4f6f9] p-4">
                    <p className="text-[10px] uppercase tracking-widest text-ink/40 mb-1">Date</p>
                    <p className="font-medium text-sm">{selected.date}</p>
                  </div>
                  <div className="bg-[#f4f6f9] p-4">
                    <p className="text-[10px] uppercase tracking-widest text-ink/40 mb-1">Time</p>
                    <p className="font-medium text-sm">{selected.time}</p>
                  </div>
                </div>
                <div className="border-t border-primary/8 pt-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-ink/70"><Phone className="w-4 h-4 text-accent flex-shrink-0" />{selected.phone}</div>
                  <div className="flex items-center gap-3 text-sm text-ink/70"><Mail className="w-4 h-4 text-accent flex-shrink-0" />{selected.email}</div>
                  {selected.notes && (
                    <div className="flex items-start gap-3 text-sm text-ink/70"><MessageSquare className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" /><span>{selected.notes}</span></div>
                  )}
                  {selected.created_at && (
                    <div className="flex items-center gap-3 text-sm text-ink/40"><Clock className="w-4 h-4 flex-shrink-0" />Booked: {new Date(selected.created_at).toLocaleString()}</div>
                  )}
                </div>
                <div className="border-t border-primary/8 pt-4 flex gap-3">
                  {selected.status !== "confirmed" && (
                    <button onClick={() => { updateStatus(selected.id!, "confirmed"); setSelected({ ...selected, status: "confirmed" }); }} className="flex-1 py-3 bg-green-600 text-white text-xs uppercase tracking-widest font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                      <CheckSquare className="w-4 h-4" /> Confirm
                    </button>
                  )}
                  {selected.status !== "cancelled" && (
                    <button onClick={() => { updateStatus(selected.id!, "cancelled"); setSelected({ ...selected, status: "cancelled" }); }} className="flex-1 py-3 bg-red-500 text-white text-xs uppercase tracking-widest font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2">
                      <XSquare className="w-4 h-4" /> Cancel
                    </button>
                  )}
                  {selected.status !== "pending" && (
                    <button onClick={() => { updateStatus(selected.id!, "pending"); setSelected({ ...selected, status: "pending" }); }} className="flex-1 py-3 border border-amber-400 text-amber-600 text-xs uppercase tracking-widest font-bold hover:bg-amber-50 transition-colors flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4" /> Pending
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

// Note: We remove the header from here and put it in the parent StaffDashboard

      <div className="flex-1 px-6 md:px-10 py-8 max-w-7xl mx-auto w-full">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total Bookings", value: stats.total, color: "bg-white border-l-4 border-l-primary", filter: "all" as const },
            { label: "Today", value: stats.today, color: "bg-white border-l-4 border-l-blue-500", filter: "today" as const },
            { label: "Pending", value: stats.pending, color: "bg-white border-l-4 border-l-amber-400", filter: "pending" as const },
            { label: "Confirmed", value: stats.confirmed, color: "bg-white border-l-4 border-l-green-500", filter: "confirmed" as const },
            { label: "Cancelled", value: stats.cancelled, color: "bg-white border-l-4 border-l-red-400", filter: "cancelled" as const },
          ].map((s, i) => (
            <button key={i} onClick={() => setFilter(s.filter)} className={`bg-[#161616] border-l-4 ${s.color.includes('primary') ? 'border-l-brand' : s.color.includes('blue') ? 'border-l-blue-500' : s.color.includes('amber') ? 'border-l-amber-400' : s.color.includes('green') ? 'border-l-green-500' : 'border-l-red-400'} p-5 rounded-xl border border-white/[0.07] text-left transition-all ${filter === s.filter ? "ring-2 ring-brand/30" : "hover:border-white/15"}`}>
              <p className="text-3xl font-serif font-light text-white">{s.value}</p>
              <p className="text-white/50 text-xs uppercase tracking-widest mt-1">{s.label}</p>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-[#161616] border border-white/[0.07] rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search by name, email, phone, service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-white/[0.07] focus:border-brand outline-none text-sm bg-white/[0.03] text-white rounded-lg placeholder:text-white/30"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-white/40" />
            {(["all","today","pending","confirmed","cancelled"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 text-xs uppercase tracking-widest font-bold rounded-lg transition-all ${filter === f ? "bg-brand text-white" : "border border-white/[0.07] hover:border-brand/40 text-white/60"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#161616] border border-white/[0.07] rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <RefreshCw className="w-6 h-6 text-brand animate-spin" />
              <span className="ml-3 text-white/50 text-sm">Loading bookings...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-white/30">
              <Calendar className="w-12 h-12 mb-4" />
              <p className="font-serif text-xl">No bookings found</p>
              <p className="text-sm mt-2">Try adjusting your search or filter</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.07] bg-white/[0.02]">
                    <th className="text-left px-5 py-4 text-[10px] uppercase tracking-widest text-white/40 font-semibold">Member</th>
                    <th className="text-left px-5 py-4 text-[10px] uppercase tracking-widest text-white/40 font-semibold">Service</th>
                    <th className="text-left px-5 py-4 text-[10px] uppercase tracking-widest text-white/40 font-semibold">Date & Time</th>
                    <th className="text-left px-5 py-4 text-[10px] uppercase tracking-widest text-white/40 font-semibold">Contact</th>
                    <th className="text-left px-5 py-4 text-[10px] uppercase tracking-widest text-white/40 font-semibold">Status</th>
                    <th className="text-left px-5 py-4 text-[10px] uppercase tracking-widest text-white/40 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {filtered.map((appt) => (
                    <motion.tr
                      key={appt.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`hover:bg-white/[0.03] transition-colors cursor-pointer ${appt.date === todayStr ? "bg-brand/5" : ""}`}
                      onClick={() => setSelected(appt)}
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-white">{appt.name}</p>
                        {appt.notes && <p className="text-white/40 text-xs mt-0.5 truncate max-w-[140px]">{appt.notes}</p>}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-white/80">{appt.service}</span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-white/80">{appt.date}</p>
                        <p className="text-white/40 text-xs">{appt.time}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-white/70">{appt.phone}</p>
                        <p className="text-white/40 text-xs truncate max-w-[160px]">{appt.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold border ${statusColor[appt.status || "pending"]}`}>
                          {appt.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                          {appt.status !== "confirmed" && (
                            <button onClick={() => updateStatus(appt.id!, "confirmed")} title="Confirm" className="text-green-600 hover:text-green-700 transition-colors">
                              <CheckSquare className="w-4 h-4" />
                            </button>
                          )}
                          {appt.status !== "cancelled" && (
                            <button onClick={() => updateStatus(appt.id!, "cancelled")} title="Cancel" className="text-red-500 hover:text-red-600 transition-colors">
                              <XSquare className="w-4 h-4" />
                            </button>
                          )}
                          {appt.status !== "pending" && (
                            <button onClick={() => updateStatus(appt.id!, "pending")} title="Reset to Pending" className="text-amber-500 hover:text-amber-600 transition-colors">
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={() => deleteAppointment(appt.id!)} title="Delete" className="text-white/30 hover:text-red-500 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {filtered.length > 0 && (
            <div className="border-t border-white/[0.07] px-5 py-3 text-xs text-white/40 flex justify-between items-center">
              <span>Showing {filtered.length} of {appointments.length} bookings · <span className="text-brand-light">Highlighted rows</span> = today · Click any row to view details</span>
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── CMS DASHBOARD (imported from modular CMS) ───────────────────────────────
import CMSDashboard from "./cms";

// ─── MAIN STAFF DASHBOARD (Wrapper) ───────────────────────────────────────────
const StaffDashboard = ({ onLogout, onHome, brand }: { onLogout: () => void; onHome: () => void; brand?: BrandConfig }) => {
  const [activeView, setActiveView] = useState<"bookings" | "cms">("bookings");

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col">
      <header className="bg-[#111] border-b border-white/[0.06] text-white px-6 md:px-10 py-4 flex items-center justify-between z-10 relative shadow-lg">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 pr-6 border-r border-white/10">
            {brand ? (
              <>
                <img src={brand.logoSrc} alt={brand.brandTitle || "Logo"} className="w-9 h-9 object-contain brightness-0 invert drop-shadow-md" onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }} />
                <div>
                  <span className="text-white font-black text-xl tracking-[0.15em] uppercase font-space drop-shadow-md">
                    {brand.brandNameNode}
                  </span>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest">Admin Portal</p>
                </div>
              </>
            ) : (
              <>
                <img src="/logo.svg" alt="Logo" className="h-8 w-auto brightness-0 invert" />
                <div>
                  <span className="font-serif text-lg font-semibold tracking-tight uppercase">Dashboard</span>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest">Admin Portal</p>
                </div>
              </>
            )}
          </div>
          
          <div className="hidden md:flex gap-2">
             <button onClick={() => setActiveView("bookings")} className={`px-4 py-2 rounded-lg text-xs uppercase tracking-widest font-bold transition-all ${activeView === "bookings" ? "bg-brand text-white shadow-md shadow-brand/20" : "text-white/50 hover:bg-white/5 hover:text-white"}`}>Bookings</button>
             <button onClick={() => setActiveView("cms")} className={`px-4 py-2 rounded-lg text-xs uppercase tracking-widest font-bold transition-all ${activeView === "cms" ? "bg-brand text-white shadow-md shadow-brand/20" : "text-white/50 hover:bg-white/5 hover:text-white"}`}>Content CMS</button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onHome} className="text-white/60 hover:text-white transition-colors border border-white/10 px-3 py-1.5 text-xs uppercase tracking-widest hover:border-white/30 hidden md:flex items-center gap-1.5 rounded">
            Exit to Site
          </button>
          <button onClick={onLogout} className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/70 hover:text-white transition-colors border border-white/10 px-4 py-2 hover:border-white/30 rounded bg-white/[0.02]">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </header>

      {/* Mobile nav */}
      <div className="md:hidden flex p-4 gap-2 bg-[#161616] border-b border-white/5">
        <button onClick={() => setActiveView("bookings")} className={`flex-1 py-3 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all ${activeView === "bookings" ? "bg-brand text-white" : "text-white/50 border border-white/10"}`}>Bookings</button>
        <button onClick={() => setActiveView("cms")} className={`flex-1 py-3 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all ${activeView === "cms" ? "bg-brand text-white" : "text-white/50 border border-white/10"}`}>Content CMS</button>
      </div>

      <div className="flex-1 overflow-auto flex flex-col relative">
        {activeView === "bookings" ? (
          <BookingsDashboard onLogout={onLogout} onHome={onHome} brand={brand} />
        ) : (
          <CMSDashboard />
        )}
      </div>
    </div>
  );
};

// ─── STAFF PAGE (Login gate) ──────────────────────────────────────────────────
export const StaffPage = ({ onClose, brand }: { onClose: () => void; brand?: BrandConfig }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setIsAuthenticated(true);
      setCheckingSession(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-bg/50 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <StaffLogin onLogin={() => setIsAuthenticated(true)} brand={brand} />;
  }

  return <StaffDashboard onLogout={handleLogout} onHome={onClose} brand={brand} />;
};

export default StaffPage;

