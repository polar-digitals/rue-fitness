"use client";
import { useState, useEffect, useCallback } from "react";
import { SectionHeader, EmptyState, FormWrapper, Field, ImageUploadField, inputCls, selectCls, GALLERY_CATEGORIES, fetchAll, saveItem, deleteItem, ItemActions, type GalleryItem } from "./shared";

export default function GalleryManager() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [filter, setFilter] = useState("All");

  const load = useCallback(async () => {
    setRefreshing(true);
    const data = await fetchAll("gallery");
    setItems(data.length ? data : []);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    await saveItem("gallery", editing);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (await deleteItem("gallery", id)) load();
  };

  const filtered = filter === "All" ? items : items.filter(i => i.category === filter);

  return (
    <div>
      <SectionHeader title="Image Gallery" count={items.length} onAdd={() => setEditing({ title: "", image_url: "", category: "Gym Floor", sort_order: items.length })} onRefresh={load} refreshing={refreshing} />

      {editing && (
        <FormWrapper title={editing.id ? "Edit Image" : "Add Image"} onClose={() => setEditing(null)} onSave={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title">
              <input required className={inputCls} placeholder="e.g. Main Gym Floor" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} />
            </Field>
            <Field label="Category">
              <select className={selectCls} value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })}>
                {GALLERY_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
          </div>
          <ImageUploadField currentUrl={editing.image_url} onUploaded={url => setEditing({ ...editing, image_url: url })} />
          <Field label="Or paste image URL">
            <input className={inputCls} placeholder="https://..." value={editing.image_url} onChange={e => setEditing({ ...editing, image_url: e.target.value })} />
          </Field>
        </FormWrapper>
      )}

      {/* Category Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {["All", ...GALLERY_CATEGORIES].map(c => (
          <button key={c} onClick={() => setFilter(c)} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${filter === c ? "bg-brand text-white shadow-md shadow-brand/20" : "border border-white/[0.07] text-white/40 hover:text-white hover:border-white/20"}`}>
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-white/30 text-sm">Loading...</div>
      ) : filtered.length === 0 ? (
        <EmptyState label="gallery images" />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(item => (
            <div key={item.id} className="group relative rounded-xl overflow-hidden border border-white/[0.07] hover:border-brand/40 transition-all bg-[#161616] aspect-[4/3]">
              {item.image_url ? (
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-white/[0.03] flex items-center justify-center text-white/10 text-xs uppercase tracking-widest">No Image</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-sm font-bold truncate">{item.title}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-brand-light text-[10px] uppercase tracking-widest font-bold">{item.category}</span>
                  <ItemActions onEdit={() => setEditing(item)} onDelete={() => handleDelete(item.id!)} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
