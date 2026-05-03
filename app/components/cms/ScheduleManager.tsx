"use client";
import { useState, useEffect, useCallback } from "react";
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

  const empty: ScheduleEntry = { 
    day: DAYS[0], 
    time: "", 
    activity: "", 
    trainer: "", 
    session: SESSIONS[0], 
    special: false, 
    bookable: false 
  };

  const filtered = dayFilter === "All" ? items : items.filter(i => i.day === dayFilter);

  return (
    <div>
      <SectionHeader 
        title="Class Schedule" 
        count={items.length} 
        onAdd={() => setEditing(empty)} 
        onRefresh={load} 
        refreshing={refreshing} 
      />

      {editing && (
        <FormWrapper 
          title={editing.id ? "Edit Class" : "Add Class"} 
          onClose={() => setEditing(null)} 
          onSave={handleSave}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Day of Week">
              <select 
                className={selectCls} 
                value={editing.day} 
                onChange={e => setEditing({ ...editing, day: e.target.value })}
              >
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Time (e.g. 06:00 – 07:00 AM)">
              <input 
                required 
                className={inputCls} 
                placeholder="06:00 – 07:00 AM" 
                value={editing.time} 
                onChange={e => setEditing({ ...editing, time: e.target.value })} 
              />
            </Field>
            <Field label="Activity Name">
              <input 
                required 
                className={inputCls} 
                placeholder="AEROBICS" 
                value={editing.activity} 
                onChange={e => setEditing({ ...editing, activity: e.target.value })} 
              />
            </Field>
            <Field label="Trainer(s)">
              <input 
                required 
                className={inputCls} 
                placeholder="Name of trainer(s)" 
                value={editing.trainer} 
                onChange={e => setEditing({ ...editing, trainer: e.target.value })} 
              />
            </Field>
            <Field label="Session">
              <select 
                className={selectCls} 
                value={editing.session} 
                onChange={e => setEditing({ ...editing, session: e.target.value })}
              >
                {SESSIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          
          <div className="flex gap-6 p-2 mt-2">
            <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
              <input 
                type="checkbox" 
                checked={editing.special} 
                onChange={e => setEditing({ ...editing, special: e.target.checked })} 
                className={checkCls} 
              />
              Special Event/Class
            </label>
            <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
              <input 
                type="checkbox" 
                checked={editing.bookable} 
                onChange={e => setEditing({ ...editing, bookable: e.target.checked })} 
                className={checkCls} 
              />
              Enable Booking
            </label>
          </div>
        </FormWrapper>
      )}

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {["All", ...DAYS].map(d => (
          <button 
            key={d} 
            onClick={() => setDayFilter(d)} 
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${dayFilter === d ? "bg-brand text-white shadow-md shadow-brand/20" : "border border-white/[0.07] text-white/40 hover:text-white hover:border-white/20"}`}
          >
            {d}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-white/30 text-sm">Loading...</div>
      ) : filtered.length === 0 ? (
        <EmptyState label="schedule entries" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(item => (
            <div key={item.id} className="p-5 rounded-xl bg-[#161616] border border-white/[0.07] hover:border-brand/30 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${item.session === "MORNING" ? "bg-brand/10 text-brand-light border border-brand/20" : "bg-white/5 text-white/40 border border-white/10"}`}>
                  {item.session}
                </span>
                <ItemActions onEdit={() => setEditing(item)} onDelete={() => handleDelete(item.id!)} />
              </div>
              <h4 className={`font-bold text-sm uppercase tracking-widest mb-1 ${item.special ? "text-brand-light" : "text-white"}`}>
                {item.activity} {item.special && "✦"}
              </h4>
              <div className="text-[11px] text-white/40 mb-3 font-medium uppercase tracking-wider">{item.day} · {item.time}</div>
              <div className="text-xs text-white/60 flex items-center gap-2">
                <span className="w-4 h-px bg-white/10" />
                {item.trainer}
              </div>
              {item.bookable && (
                <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-widest text-brand-light/60 font-bold italic">Bookable Class</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
