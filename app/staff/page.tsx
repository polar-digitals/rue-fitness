"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StaffPage, SUPABASE_URL, SUPABASE_ANON_KEY } from "../components/StaffPortal";

export default function StaffRoute() {
  const router = useRouter();
  const [logo, setLogo] = useState("/logo.svg");

  useEffect(() => {
    async function loadLogo() {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?id=eq.logo_image&select=value`, {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data[0] && data[0].value) setLogo(data[0].value);
        }
      } catch (err) {}
    }
    loadLogo();
  }, []);

  return (
    <StaffPage
      onClose={() => router.push("/")}
      brand={{
        logoSrc: logo,
        brandNameNode: "RUE FITNESS",
        brandTitle: "Rue Fitness",
      }}
    />
  );
}
