"use client";
import { useState, useEffect, useCallback } from "react";
import { Clock, User } from "lucide-react";
import { SectionHeader, EmptyState, FormWrapper, Field, inputCls, selectCls, checkCls, DAYS, SESSIONS, fetchAll, saveItem, deleteItem, ItemActions, type ScheduleEntry } from "./shared";

export default function ScheduleManager() {
  const [items, setItems] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editing, setEditing] = useState<ScheduleEntry | null>(null);
  const [dayFilter, setDayFilter] = useState("All");

  const load = useCallback(async () => {
    setRefreshing(true);
    const data = await fetchAll("schedule");
    setItems(data);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    await saveItem("schedule", editing);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (await deleteItem("schedule", id)) load();
  };

  const empty: ScheduleEntry = { day: "Monday", time: "", activity: "", trainer: "", session: "MORNING", special: false, bookable: false };
  const filtered = dayFilter === "All" ? items : items.filter(i => i.day === dayFilter);

  return (
    <div>
      <SectionHeader title="Class Schedule" count={items.length} onAdd={() => setEditing(empty)} onRefresh={load} refreshing={refreshing} />

      {editing && (
        <FormWrapper title={editing.id ? "Edit Class" : "Add Class"} onClose={() => setEditing(null)} onSave={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Day">
              <select required className={selectCls} value={editing.day} onChange={e => setEditing({ ...editing, day: e.target.value })}>
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Time">
              <input required className={inputCls} placeholder="e.g. 06:00 – 07:00 AM" value={editing.time} onChange={e => setEditing({ ...editing, time: e.target.value })} />
            </Field>
            <Field label="Session">
              <select className={selectCls} value={editing.session} onChange={e => setEditing({ ...editing, session: e.target.value })}>
                {SESSIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Activity">
              <input required className={inputCls} placeholder="e.g. AEROBICS" value={editing.activity} onChange={e => setEditing({ ...editing, activity: e.target.value })} />
            </Field>
            <Field label="Trainer">
              <input required className={inputCls} placeholder="Trainer name" value={editing.trainer} onChange={e => setEditing({ ...editing, trainer: e.target.value })} />
            </Field>
          </div>
          <div className="flex gap-6 p-3">
            <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
              <input type="checkbox" checked={editing.special} onChange={e => setEditing({ ...editing, special: e.target.checked })} className={checkCls} />
              Special Class
            </label>
            <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
              <input type="checkbox" checked={editing.bookable} onChange={e => setEditing({ ...editing, bookable: e.target.checked })} className={checkCls} />
              Bookable Online
            </label>
          </div>
        </FormWrapper>
      )}

      {/* Day filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {["All", ...DAYS].map(d => (
          <button key={d} onClick={() => setDayFilter(d)} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${dayFilter === d ? "bg-brand text-white shadow-md shadow-brand/20" : "border border-white/[0.07] text-white/40 hover:text-white hover:border-white/20"}`}>
            {d}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-white/30 text-sm">Loading...</div>
      ) : filtered.length === 0 ? (
        <EmptyState label="schedule entries" />
      ) : (
        <div className="bg-[#161616] border border-white/[0.07] rounded-xl overflow-hidden">
          <div className="hidden md:grid grid-cols-[1fr_1.4fr_1.6fr_1.4fr_1fr_0.8fr] gap-4 px-6 py-3 bg-white/[0.02] border-b border-white/[0.06]">
            {["Day", "Time", "Activity", "Trainer", "Session", "Actions"].map(h => (
              <span key={h} className="text-[10px] font-bold uppercase tracking-widest text-white/30">{h}</span>
            ))}
          </div>
          <div className="divide-y divide-white/[0.04]">
            {filtered.map(cls => (
              <div key={cls.id} className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr_1.6fr_1.4fr_1fr_0.8fr] gap-3 md:gap-4 px-6 py-4 items-center hover:bg-white/[0.02] transition-colors">
                <span className="font-bold text-white text-sm">{cls.day}</span>
                <div className="flex items-center gap-2 text-white/50 text-sm">
                  <Clock className="w-3.5 h-3.5 text-brand-light shrink-0" />
                  {cls.time}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-bold uppercase tracking-wide ${cls.special ? "text-brand-light" : "text-white"}`}>{cls.activity}</span>
                  {cls.special && <span className="text-brand-light/70 text-xs">✦</span>}
                  {cls.bookable && <span className="text-[9px] bg-brand/20 text-brand-light px-1.5 py-0.5 rounded-full font-bold uppercase tracking-widest">Bookable</span>}
                </div>
                <div className="flex items-center gap-1.5 text-white/50 text-sm">
                  <User className="w-3 h-3 text-brand/50 shrink-0" />
                  {cls.trainer}
                </div>
                <span className={`inline-block w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${cls.session === "MORNING" ? "bg-brand/15 text-brand-light border-brand/25" : "bg-white/[0.04] text-white/50 border-white/[0.08]"}`}>
                  {cls.session}
                </span>
                <ItemActions onEdit={() => setEditing(cls)} onDelete={() => handleDelete(cls.id!)} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
