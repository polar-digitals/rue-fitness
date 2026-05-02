"use client";
import { useState, useEffect, useCallback } from "react";
import { SectionHeader, EmptyState, FormWrapper, Field, inputCls, selectCls, textareaCls, SERVICE_CATEGORIES, SERVICE_ICONS, fetchAll, saveItem, deleteItem, ItemActions, type ServiceItem } from "./shared";

export default function ServiceManager() {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editing, setEditing] = useState<ServiceItem | null>(null);
  const [filter, setFilter] = useState("All");

  const load = useCallback(async () => {
    setRefreshing(true);
    const data = await fetchAll("services");
    setItems(data);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    await saveItem("services", editing);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (await deleteItem("services", id)) load();
  };

  const empty: ServiceItem = { title: "", description: "", icon_key: "circuit", category: SERVICE_CATEGORIES[0], sort_order: items.length };
  const filtered = filter === "All" ? items : items.filter(i => i.category === filter);
  const grouped = SERVICE_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = filtered.filter(i => i.category === cat);
    return acc;
  }, {} as Record<string, ServiceItem[]>);

  return (
    <div>
      <SectionHeader title="Services" count={items.length} onAdd={() => setEditing(empty)} onRefresh={load} refreshing={refreshing} />

      {editing && (
        <FormWrapper title={editing.id ? "Edit Service" : "Add Service"} onClose={() => setEditing(null)} onSave={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Service Title">
              <input required className={inputCls} placeholder="e.g. Aerobics" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} />
            </Field>
            <Field label="Category">
              <select className={selectCls} value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })}>
                {SERVICE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Icon Key">
              <select className={selectCls} value={editing.icon_key} onChange={e => setEditing({ ...editing, icon_key: e.target.value })}>
                {SERVICE_ICONS.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </Field>
            <Field label="Sort Order">
              <input type="number" className={inputCls} value={editing.sort_order} onChange={e => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} />
            </Field>
          </div>
          <Field label="Description">
            <textarea className={textareaCls} placeholder="Brief description of this service..." value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} />
          </Field>
        </FormWrapper>
      )}

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {["All", ...SERVICE_CATEGORIES].map(c => (
          <button key={c} onClick={() => setFilter(c)} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${filter === c ? "bg-brand text-white shadow-md shadow-brand/20" : "border border-white/[0.07] text-white/40 hover:text-white hover:border-white/20"}`}>
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-white/30 text-sm">Loading...</div>
      ) : filtered.length === 0 ? (
        <EmptyState label="services" />
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).filter(([, svcs]) => svcs.length > 0).map(([cat, svcs]) => (
            <div key={cat}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-light mb-4 flex items-center gap-2">
                <span className="w-6 h-px bg-brand/40" />
                {cat}
                <span className="text-white/20 ml-1">({svcs.length})</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {svcs.map(s => (
                  <div key={s.id} className="p-5 rounded-xl bg-[#161616] border border-white/[0.07] hover:border-brand/30 transition-all group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-brand/15 border border-brand/20 flex items-center justify-center text-brand-light text-xs font-bold uppercase">{s.icon_key.slice(0, 2)}</div>
                      <ItemActions onEdit={() => setEditing(s)} onDelete={() => handleDelete(s.id!)} />
                    </div>
                    <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-1">{s.title}</h4>
                    <p className="text-white/35 text-xs leading-relaxed line-clamp-2">{s.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
