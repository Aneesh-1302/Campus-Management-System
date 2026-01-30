"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect AFTER auth state is restored
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // While restoring session, render nothing (prevents flicker + false redirect)
  if (loading) return null;

  // If user somehow still null after loading, don't render dashboard
  if (!user) return null;

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 60px)" }}>
      <Sidebar role={user.designation} />
      <main style={{ flex: 1, padding: "30px", background: "#f9fafb" }}>
        {children}
      </main>
    </div>
  );
}
