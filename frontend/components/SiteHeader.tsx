"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function SiteHeader() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("ledgerflow_token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("ledgerflow_token");
    setToken(null);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4 sm:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight text-white">
          LedgerFlow AI
        </Link>
        <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
          <Link href="/" className="rounded-2xl px-4 py-2 transition hover:bg-slate-800 hover:text-white">
            Home
          </Link>
          {token ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-2xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Logout
            </button>
          ) : (
            <>
              <Link href="/auth/login" className="rounded-2xl px-4 py-2 transition hover:bg-slate-800 hover:text-white">
                Login
              </Link>
              <Link href="/auth/register" className="rounded-2xl bg-cyan-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-400">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
