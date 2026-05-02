"use client";
import { useState, useEffect, useCallback } from "react";
import { SectionHeader, EmptyState, FormWrapper, Field, ImageUploadField, inputCls, textareaCls, checkCls, fetchAll, saveItem, deleteItem, ItemActions, type Trainer } from "./shared";

export default function TrainerManager() {
  const [items, setItems] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editing, setEditing] = useState<Trainer | null>(null);

  const load = useCallback(async () => {
    setRefreshing(true);
    const data = await fetchAll("trainers");
    setItems(data);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const initials = editing.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    await saveItem("trainers", { ...editing, initials });
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (await deleteItem("trainers", id)) load();
  };

  const empty: Trainer = { name: "", role: "Personal Trainer", specialty: "", bio: "", img: "", initials: "", featured: false, sort_order: items.length };

  return (
    <div>
      <SectionHeader title="Trainer Profiles" count={items.length} onAdd={() => setEditing(empty)} onRefresh={load} refreshing={refreshing} />

      {editing && (
        <FormWrapper title={editing.id ? "Edit Trainer" : "Add Trainer"} onClose={() => setEditing(null)} onSave={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Full Name">
              <input required className={inputCls} placeholder="e.g. Binyam Degu" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />
            </Field>
            <Field label="Role">
              <input required className={inputCls} placeholder="e.g. Personal Trainer" value={editing.role} onChange={e => setEditing({ ...editing, role: e.target.value })} />
            </Field>
            <Field label="Specialty">
              <input className={inputCls} placeholder="e.g. Weight Loss, Muscle Building" value={editing.specialty} onChange={e => setEditing({ ...editing, specialty: e.target.value })} />
            </Field>
            <Field label="Options">
              <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer p-3">
                <input type="checkbox" checked={editing.featured} onChange={e => setEditing({ ...editing, featured: e.target.checked })} className={checkCls} />
                Featured Trainer (shown on homepage)
              </label>
            </Field>
          </div>
          <Field label="Bio">
            <textarea className={textareaCls} placeholder="Brief description of experience and expertise..." value={editing.bio} onChange={e => setEditing({ ...editing, bio: e.target.value })} />
          </Field>
          <ImageUploadField currentUrl={editing.img} onUploaded={url => setEditing({ ...editing, img: url })} label="Trainer Photo" />
        </FormWrapper>
      )}

      {loading ? (
        <div className="text-center py-20 text-white/30 text-sm">Loading...</div>
      ) : items.length === 0 ? (
        <EmptyState label="trainers" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(t => (
            <div key={t.id} className="group rounded-xl overflow-hidden border border-white/[0.07] hover:border-brand/40 transition-all bg-[#161616]">
              <div className="h-48 bg-gradient-to-b from-[#1e1028] to-[#161616] flex items-center justify-center relative">
                {t.img ? (
                  <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-brand/20 border-2 border-brand/30 flex items-center justify-center">
                    <span className="text-2xl font-black text-brand-light/70">{t.initials || t.name.slice(0, 2).toUpperCase()}</span>
                  </div>
                )}
                {t.featured && (
                  <span className="absolute top-3 right-3 bg-brand text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full">Featured</span>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-bold text-sm uppercase tracking-widest">{t.name}</p>
                    <p className="text-brand-light text-xs uppercase tracking-widest font-semibold mt-0.5">{t.role}</p>
                  </div>
                  <ItemActions onEdit={() => setEditing(t)} onDelete={() => handleDelete(t.id!)} />
                </div>
                {t.specialty && <p className="text-white/35 text-xs mt-2">{t.specialty}</p>}
                {t.bio && <p className="text-white/25 text-xs mt-1 line-clamp-2">{t.bio}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
