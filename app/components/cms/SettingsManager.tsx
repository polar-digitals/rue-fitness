"use client";
import { useState, useEffect, useCallback } from "react";
import { SectionHeader, FormWrapper, Field, ImageUploadField, inputCls, fetchAll, saveSetting } from "./shared";

const SETTINGS_FIELDS = [
  { id: "logo_image", label: "Site Logo", type: "image" },
  { id: "hero_image", label: "Home Hero Image", type: "image" },
  { id: "hero_heading", label: "Home Hero Heading", type: "text" },
  { id: "hero_subheading", label: "Home Hero Subheading", type: "text" },
  { id: "about_image", label: "Home About Image", type: "image" },
  { id: "about_heading", label: "Home About Heading", type: "text" },
  { id: "about_text", label: "Home About Text", type: "text" },
  { id: "services_hero_image", label: "Services Hero Image", type: "image" },
  { id: "pricing_hero_image", label: "Pricing Hero Image", type: "image" },
  { id: "classes_hero_image", label: "Classes Hero Image", type: "image" },
  { id: "about_hero_image", label: "About Page Hero", type: "image" },
  { id: "about_story_image", label: "Our Story Image", type: "image" },
  { id: "cta_bg_image", label: "CTA Section Background", type: "image" },
];

export default function SettingsManager() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    const data = await fetchAll("site_settings");
    const settingsMap: Record<string, string> = {};
    if (data && data.length) {
      data.forEach((item: any) => {
        settingsMap[item.id] = item.value;
      });
    }
    setSettings(settingsMap);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleChange = (id: string, value: string) => {
    setSettings(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    for (const [id, value] of Object.entries(settings)) {
      await saveSetting({ id, value });
    }
    setSaving(false);
    alert("Site settings saved successfully.");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-black uppercase tracking-widest text-white font-space">Site Settings</h2>
          <p className="text-white/30 text-xs mt-1 uppercase tracking-widest">Global Site Content</p>
        </div>
        <button 
          onClick={handleSaveAll} 
          disabled={saving || loading}
          className="bg-brand text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-brand-light transition-colors shadow-lg shadow-brand/20 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-white/30 text-sm">Loading settings...</div>
      ) : (
        <div className="bg-[#161616] border border-white/[0.07] rounded-xl p-6 mb-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SETTINGS_FIELDS.map(field => (
              <div key={field.id} className="space-y-2">
                {field.type === "text" ? (
                  <Field label={field.label}>
                    <input 
                      className={inputCls} 
                      value={settings[field.id] || ""} 
                      onChange={e => handleChange(field.id, e.target.value)} 
                    />
                  </Field>
                ) : (
                  <ImageUploadField 
                    label={field.label}
                    currentUrl={settings[field.id]} 
                    onUploaded={url => handleChange(field.id, url)} 
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
