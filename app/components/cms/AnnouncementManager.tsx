"use client";
import { useState, useEffect, useCallback } from "react";
import { Bell, ExternalLink, Eye, EyeOff } from "lucide-react";
import { SectionHeader, EmptyState, FormWrapper, Field, inputCls, selectCls, textareaCls, checkCls, ALERT_TYPES, fetchAll, saveItem, deleteItem, ItemActions, type Announcement } from "./shared";

const TYPE_STYLES: Record<string, { bg: string; border: string; text: string; label: string }> = {
  promo: { bg: "bg-brand/20", border: "border-brand/40", text: "text-brand-light", label: "🎉 Promo" },
  info: { bg: "bg-blue-500/15", border: "border-blue-500/30", text: "text-blue-400", label: "ℹ️ Info" },
  warning: { bg: "bg-amber-500/15", border: "border-amber-500/30", text: "text-amber-400", label: "⚠️ Warning" },
  urgent: { bg: "bg-red-500/15", border: "border-red-500/30", text: "text-red-400", label: "🚨 Urgent" },
};

export default function AnnouncementManager() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);

  const load = useCallback(async () => {
    setRefreshing(true);
    const data = await fetchAll("announcements");
    setItems(data);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    await saveItem("announcements", editing);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (await deleteItem("announcements", id)) load();
  };

  const toggleActive = async (item: Announcement) => {
    const updated = { ...item, active: !item.active };
    setItems(prev => prev.map(i => i.id === item.id ? updated : i));
    await saveItem("announcements", updated);
  };

  const empty: Announcement = { message: "", type: "promo", active: true, link_text: "", link_url: "", bg_color: "" };

  return (
    <div>
      <SectionHeader title="Announcements" count={items.length} onAdd={() => setEditing(empty)} onRefresh={load} refreshing={refreshing} />

      {editing && (
        <FormWrapper title={editing.id ? "Edit Announcement" : "New Announcement"} onClose={() => setEditing(null)} onSave={handleSave}>
          <Field label="Message">
            <textarea required className={textareaCls} placeholder="e.g. 🔥 Limited offer! 20% off all memberships this week only." value={editing.message} onChange={e => setEditing({ ...editing, message: e.target.value })} />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Type">
              <select className={selectCls} value={editing.type} onChange={e => setEditing({ ...editing, type: e.target.value })}>
                {ALERT_TYPES.map(t => <option key={t} value={t}>{TYPE_STYLES[t]?.label || t}</option>)}
              </select>
            </Field>
            <Field label="Link Text (optional)">
              <input className={inputCls} placeholder="e.g. View Offers" value={editing.link_text} onChange={e => setEditing({ ...editing, link_text: e.target.value })} />
            </Field>
            <Field label="Link URL (optional)">
              <input className={inputCls} placeholder="e.g. /pricing" value={editing.link_url} onChange={e => setEditing({ ...editing, link_url: e.target.value })} />
            </Field>
          </div>
          <div className="flex gap-6 p-3">
            <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
              <input type="checkbox" checked={editing.active} onChange={e => setEditing({ ...editing, active: e.target.checked })} className={checkCls} />
              Active (visible on website)
            </label>
          </div>
          {/* Preview */}
          <Field label="Preview">
            <div className={`${TYPE_STYLES[editing.type]?.bg || "bg-brand/20"} border ${TYPE_STYLES[editing.type]?.border || "border-brand/40"} rounded-lg p-4`}>
              <div className="flex items-center justify-center gap-3 text-sm">
                <Bell className={`w-4 h-4 ${TYPE_STYLES[editing.type]?.text || "text-brand-light"}`} />
                <span className="text-white/90 font-medium">{editing.message || "Your announcement will appear here..."}</span>
                {editing.link_text && (
                  <span className={`flex items-center gap-1 font-bold text-xs uppercase tracking-widest ${TYPE_STYLES[editing.type]?.text || "text-brand-light"}`}>
                    {editing.link_text} <ExternalLink className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>
          </Field>
        </FormWrapper>
      )}

      {loading ? (
        <div className="text-center py-20 text-white/30 text-sm">Loading...</div>
      ) : items.length === 0 ? (
        <EmptyState label="announcements" />
      ) : (
        <div className="space-y-3">
          {items.map(item => {
            const style = TYPE_STYLES[item.type] || TYPE_STYLES.promo;
            return (
              <div key={item.id} className={`rounded-xl border ${item.active ? style.border : "border-white/[0.05]"} ${item.active ? "bg-[#161616]" : "bg-[#111] opacity-60"} p-5 transition-all`}>
                <div className="flex items-start gap-4">
                  {/* Active toggle */}
                  <button onClick={() => toggleActive(item)} className="mt-1 shrink-0" title={item.active ? "Deactivate" : "Activate"}>
                    {item.active ? (
                      <Eye className="w-5 h-5 text-green-400" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-white/20" />
                    )}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${style.bg} ${style.text} border ${style.border}`}>
                        {style.label}
                      </span>
                      {item.active && <span className="text-[9px] font-bold uppercase tracking-widest text-green-400">● Live</span>}
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed">{item.message}</p>
                    {item.link_text && (
                      <p className="text-white/30 text-xs mt-1 flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        {item.link_text} → {item.link_url}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <ItemActions onEdit={() => setEditing(item)} onDelete={() => handleDelete(item.id!)} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
