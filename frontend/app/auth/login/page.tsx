"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ username: email, password }),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.detail || "Login failed. Please check your credentials.");
        return;
      }

      localStorage.setItem("ledgerflow_token", result.access_token);
      router.push("/");
    } catch (err) {
      setError("Unable to login at this time. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <section className="mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
        <h1 className="text-3xl font-semibold text-white">Login to LedgerFlow AI</h1>
        <p className="mt-2 text-slate-400">Securely access your invoice parsing and cash flow dashboard.</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm text-slate-300">Email</span>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              placeholder="you@example.com"
              type="email"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-slate-300">Password</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              type="password"
              placeholder="Enter your password"
            />
          </label>

          {error ? <div className="rounded-2xl border border-rose-500 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
}
