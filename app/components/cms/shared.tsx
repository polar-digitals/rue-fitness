"use client";
import { Plus, RefreshCw, Trash2, Pencil, X, Save, Upload } from "lucide-react";
import { useState, type ReactNode } from "react";
import { supabase } from "../StaffPortal";

// ─── TYPES ────────────────────────────────────────────────
export type GalleryItem = { id?: string; title: string; image_url: string; category: string; sort_order: number; created_at?: string };
export type Trainer = { id?: string; name: string; role: string; specialty: string; bio: string; img: string; initials: string; featured: boolean; sort_order: number };
export type ScheduleEntry = { id?: string; day: string; time: string; activity: string; trainer: string; session: string; special: boolean; bookable: boolean };
export type ServiceItem = { id?: string; title: string; description: string; icon_key: string; category: string; sort_order: number };
export type PricingPlan = { id?: string; plan_type: string; member_type: string; label: string; price: number; save_text: string; features: string; popular: boolean; best: boolean; sort_order: number };
export type Announcement = { id?: string; message: string; type: string; active: boolean; link_text: string; link_url: string; bg_color: string; created_at?: string };

// ─── CONSTANTS ────────────────────────────────────────────
export const GALLERY_CATEGORIES = ["Gym Floor", "Classes", "Equipment", "Events", "Facility"];
export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export const SESSIONS = ["MORNING", "EVENING"];
export const SERVICE_CATEGORIES = ["Cardio & Dance", "Strength & Conditioning", "Personalized Training"];
export const SERVICE_ICONS = ["aerobics", "zumba", "spinning", "dance", "hiit", "circuit", "crossfit", "strength", "bodyweight", "functional", "bootcamp", "core", "muscle", "personal", "weightloss", "online"];
export const PLAN_TYPES = ["gym", "spa"];
export const MEMBER_TYPES = ["individual", "couple", "family"];
export const ALERT_TYPES = ["promo", "info", "warning", "urgent"];

// ─── STYLE CONSTANTS ──────────────────────────────────────
export const inputCls = "w-full bg-[#0f0f0f] border border-white/[0.07] text-white p-3 rounded-lg focus:border-brand outline-none transition-colors text-sm placeholder:text-white/20";
export const selectCls = "w-full bg-[#0f0f0f] border border-white/[0.07] text-white p-3 rounded-lg focus:border-brand outline-none transition-colors text-sm appearance-none";
export const textareaCls = "w-full bg-[#0f0f0f] border border-white/[0.07] text-white p-3 rounded-lg focus:border-brand outline-none transition-colors text-sm placeholder:text-white/20 h-24 resize-none";
export const checkCls = "accent-brand w-4 h-4";

// ─── SHARED COMPONENTS ────────────────────────────────────
export function SectionHeader({ title, count, onAdd, onRefresh, refreshing }: { title: string; count: number; onAdd: () => void; onRefresh: () => void; refreshing: boolean }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-xl font-black uppercase tracking-widest text-white font-space">{title}</h2>
        <p className="text-white/30 text-xs mt-1 uppercase tracking-widest">{count} {count === 1 ? "item" : "items"}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={onRefresh} disabled={refreshing} className="p-2.5 rounded-lg border border-white/[0.07] text-white/40 hover:text-white hover:border-white/20 transition-all disabled:opacity-30">
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
        </button>
        <button onClick={onAdd} className="flex items-center gap-2 bg-brand text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-brand-light transition-colors shadow-lg shadow-brand/20">
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>
    </div>
  );
}

export function EmptyState({ label }: { label: string }) {
  return (
    <div className="text-center py-20 border border-dashed border-white/[0.07] rounded-xl">
      <div className="w-14 h-14 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
        <Plus className="w-6 h-6 text-white/20" />
      </div>
      <p className="text-sm font-bold uppercase tracking-widest text-white/25">No {label} yet</p>
      <p className="text-xs mt-2 text-white/15">Click &quot;Add New&quot; to get started</p>
    </div>
  );
}

export function FormWrapper({ title, onClose, onSave, children }: { title: string; onClose: () => void; onSave: (e: React.FormEvent) => void; children: ReactNode }) {
  return (
    <div className="bg-[#161616] border border-white/[0.07] rounded-xl p-6 mb-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-black uppercase tracking-widest text-white font-space">{title}</h3>
        <button onClick={onClose} className="text-white/40 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
      </div>
      <form onSubmit={onSave} className="space-y-4">
        {children}
        <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.05]">
          <button type="button" onClick={onClose} className="px-5 py-2.5 border border-white/[0.07] text-white/50 hover:text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-colors">Cancel</button>
          <button type="submit" className="flex items-center gap-2 bg-brand text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-brand-light transition-colors shadow-lg shadow-brand/20">
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </form>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 font-bold">{label}</label>
      {children}
    </div>
  );
}

export function ItemActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex gap-1">
      <button onClick={onEdit} className="p-2 rounded-lg text-brand-light hover:bg-brand/20 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
      <button onClick={onDelete} className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
    </div>
  );
}

export function ImageUploadField({ currentUrl, onUploaded, label = "Image" }: { currentUrl?: string; onUploaded: (url: string) => void; label?: string }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const { error } = await supabase.storage.from("uploads").upload(fileName, file);
      if (error) throw error;
      const { data } = supabase.storage.from("uploads").getPublicUrl(fileName);
      onUploaded(data.publicUrl);
    } catch {
      alert("Upload failed. Ensure you have a public 'uploads' bucket in Supabase Storage.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Field label={label}>
      <div className="p-4 border border-white/[0.07] rounded-lg bg-white/[0.02]">
        {currentUrl && <img src={currentUrl} alt="Preview" className="h-28 object-cover rounded-lg mb-3 border border-white/10" />}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 bg-brand/20 text-brand-light px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-brand/30 transition-colors border border-brand/20">
            <Upload className="w-3.5 h-3.5" />
            {currentUrl ? "Replace" : "Upload"}
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </label>
          {uploading && <span className="text-xs text-brand-light animate-pulse">Uploading...</span>}
        </div>
      </div>
    </Field>
  );
}

// ─── CRUD HELPERS ──────────────────────────────────────────
export async function fetchAll(table: string) {
  try {
    const { data, error } = await supabase.from(table).select("*");
    if (!error && data) return data;
    return [];
  } catch { return []; }
}

export async function saveItem(table: string, item: any) {
  try {
    if (item.id) {
      const { id, created_at, ...rest } = item;
      await supabase.from(table).update(rest).eq("id", id);
    } else {
      const { id, created_at, ...rest } = item;
      await supabase.from(table).insert([rest]);
    }
    return true;
  } catch { return false; }
}

export async function deleteItem(table: string, id: string) {
  if (!confirm("Delete this item?")) return false;
  try {
    await supabase.from(table).delete().eq("id", id);
    return true;
  } catch { return false; }
}
