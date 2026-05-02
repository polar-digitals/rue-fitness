"use client";
import { useRouter } from "next/navigation";
import { StaffPage } from "../components/StaffPortal";

export default function StaffRoute() {
  const router = useRouter();
  return (
    <StaffPage
      onClose={() => router.push("/")}
      brand={{
        logoSrc: "/logo.svg",
        brandNameNode: "RUE FITNESS",
        brandTitle: "Rue Fitness",
      }}
    />
  );
}
