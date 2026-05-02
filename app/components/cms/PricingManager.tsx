"use client";
import { useState, useEffect, useCallback } from "react";
import { Check } from "lucide-react";
import { SectionHeader, EmptyState, FormWrapper, Field, inputCls, selectCls, textareaCls, checkCls, PLAN_TYPES, MEMBER_TYPES, fetchAll, saveItem, deleteItem, ItemActions, type PricingPlan } from "./shared";

export default function PricingManager() {
  const [items, setItems] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editing, setEditing] = useState<PricingPlan | null>(null);
  const [planFilter, setPlanFilter] = useState("all");
  const [memberFilter, setMemberFilter] = useState("all");

  const load = useCallback(async () => {
    setRefreshing(true);
    const data = await fetchAll("pricing");
    setItems(data);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    await saveItem("pricing", editing);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (await deleteItem("pricing", id)) load();
  };

  const empty: PricingPlan = { plan_type: "gym", member_type: "individual", label: "", price: 0, save_text: "", features: "", popular: false, best: false, sort_order: items.length };

  const filtered = items.filter(i => {
    if (planFilter !== "all" && i.plan_type !== planFilter) return false;
    if (memberFilter !== "all" && i.member_type !== memberFilter) return false;
    return true;
  });

  return (
    <div>
      <SectionHeader title="Pricing Plans" count={items.length} onAdd={() => setEditing(empty)} onRefresh={load} refreshing={refreshing} />

      {editing && (
        <FormWrapper title={editing.id ? "Edit Plan" : "Add Plan"} onClose={() => setEditing(null)} onSave={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Plan Type">
              <select required className={selectCls} value={editing.plan_type} onChange={e => setEditing({ ...editing, plan_type: e.target.value })}>
                {PLAN_TYPES.map(t => <option key={t} value={t}>{t === "gym" ? "🏋️ Gym Only" : "♨️ Gym + Spa"}</option>)}
              </select>
            </Field>
            <Field label="Member Type">
              <select required className={selectCls} value={editing.member_type} onChange={e => setEditing({ ...editing, member_type: e.target.value })}>
                {MEMBER_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </Field>
            <Field label="Duration Label">
              <input required className={inputCls} placeholder="e.g. 1 Month, 6 Months" value={editing.label} onChange={e => setEditing({ ...editing, label: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Price (ETB)">
              <input required type="number" className={inputCls} placeholder="e.g. 7560" value={editing.price || ""} onChange={e => setEditing({ ...editing, price: parseInt(e.target.value) || 0 })} />
            </Field>
            <Field label="Save Text (optional)">
              <input className={inputCls} placeholder="e.g. Save 12%" value={editing.save_text} onChange={e => setEditing({ ...editing, save_text: e.target.value })} />
            </Field>
            <Field label="Sort Order">
              <input type="number" className={inputCls} value={editing.sort_order} onChange={e => setEditing({ ...editing, sort_order: parseInt(e.target.value) || 0 })} />
            </Field>
          </div>
          <Field label="Features (one per line)">
            <textarea className={textareaCls} placeholder={"Unlimited Gym Access\nAll Gym Equipment\nAll Group Classes"} value={editing.features} onChange={e => setEditing({ ...editing, features: e.target.value })} />
          </Field>
          <div className="flex gap-6 p-3">
            <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
              <input type="checkbox" checked={editing.popular} onChange={e => setEditing({ ...editing, popular: e.target.checked, best: e.target.checked ? false : editing.best })} className={checkCls} />
              Most Popular
            </label>
            <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer">
              <input type="checkbox" checked={editing.best} onChange={e => setEditing({ ...editing, best: e.target.checked, popular: e.target.checked ? false : editing.popular })} className={checkCls} />
              Best Value
            </label>
          </div>
        </FormWrapper>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 self-center mr-1">Type:</span>
          {["all", ...PLAN_TYPES].map(t => (
            <button key={t} onClick={() => setPlanFilter(t)} className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${planFilter === t ? "bg-brand text-white" : "border border-white/[0.07] text-white/40 hover:text-white"}`}>
              {t === "all" ? "All" : t === "gym" ? "Gym" : "Gym+Spa"}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 self-center mr-1">Member:</span>
          {["all", ...MEMBER_TYPES].map(t => (
            <button key={t} onClick={() => setMemberFilter(t)} className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${memberFilter === t ? "bg-brand text-white" : "border border-white/[0.07] text-white/40 hover:text-white"}`}>
              {t === "all" ? "All" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-white/30 text-sm">Loading...</div>
      ) : filtered.length === 0 ? (
        <EmptyState label="pricing plans" />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {filtered.map(plan => {
            const features = (plan.features || "").split("\n").filter(Boolean);
            return (
              <div key={plan.id} className={`relative flex flex-col rounded-xl border p-5 transition-all ${plan.best ? "bg-gradient-to-b from-brand/30 to-brand-dark/40 border-brand/60 ring-1 ring-brand/40" : plan.popular ? "bg-gradient-to-b from-[#1e1028] to-[#150e1a] border-brand/40" : "bg-[#161616] border-white/[0.07] hover:border-brand/30"}`}>
                {plan.best && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-brand-dark text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow whitespace-nowrap">Best Value</div>}
                {plan.popular && !plan.best && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow whitespace-nowrap">Popular</div>}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">{plan.plan_type} · {plan.member_type}</span>
                  <ItemActions onEdit={() => setEditing(plan)} onDelete={() => handleDelete(plan.id!)} />
                </div>
                {plan.save_text && <div className="text-[10px] font-bold text-brand-light uppercase tracking-widest mb-1">{plan.save_text}</div>}
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">{plan.label}</div>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-white/40 text-[10px] font-bold">ETB</span>
                  <span className={`font-black text-xl ${plan.best || plan.popular ? "text-brand-light" : "text-white"}`}>{plan.price.toLocaleString()}</span>
                </div>
                <ul className="space-y-1.5 flex-1">
                  {features.map((f, j) => (
                    <li key={j} className="flex items-start gap-1.5 text-white/50 text-[11px]">
                      <Check className={`w-3 h-3 shrink-0 mt-px ${plan.popular || plan.best ? "text-brand-light" : "text-white/20"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
