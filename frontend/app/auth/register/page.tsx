"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (!name.trim()) {
      setError("Please enter your full name.");
      return false;
    }
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const formatError = (result: any) => {
    if (!result) {
      return "Registration failed. Please try again.";
    }

    if (typeof result === "string") {
      return result;
    }

    if (Array.isArray(result)) {
      return result
        .map((item) => (typeof item === "string" ? item : item.msg || JSON.stringify(item)))
        .join(" ");
    }

    if (typeof result.detail === "string") {
      return result.detail;
    }

    if (Array.isArray(result.detail)) {
      return result.detail.map((item: any) => item.msg || JSON.stringify(item)).join(" ");
    }

    if (typeof result.error === "string") {
      return result.error;
    }

    if (result.message) {
      return String(result.message);
    }

    return JSON.stringify(result);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();
      if (!response.ok) {
        setError(formatError(result));
        return;
      }

      router.push("/auth/login");
    } catch (err) {
      setError("Unable to register at this time. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <section className="mx-auto max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
        <h1 className="text-3xl font-semibold text-white">Create your LedgerFlow AI account</h1>
        <p className="mt-2 text-slate-400">Sign up to save invoices, models, and forecasts securely.</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm text-slate-300">Full Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              placeholder="Jane Doe"
              type="text"
            />
          </label>

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
              placeholder="Create a password"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-slate-300">Confirm Password</span>
            <input
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
              type="password"
              placeholder="Confirm your password"
            />
          </label>

          {error ? <div className="rounded-2xl border border-rose-500 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
      </section>
    </main>
  );
}
