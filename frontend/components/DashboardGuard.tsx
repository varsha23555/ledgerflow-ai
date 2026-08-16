"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardGuard({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("ledgerflow_token");
    if (!token) {
      router.push("/auth/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    return <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">Checking authentication...</div>;
  }

  return <>{children}</>;
}
