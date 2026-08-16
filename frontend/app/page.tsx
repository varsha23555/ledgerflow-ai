import Link from 'next/link';
import ClientCard from '../components/ClientCard';
import UploadEngine from '../components/UploadEngine';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-6 py-10 sm:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/80 p-8 shadow-[0_30px_90px_rgb(15_23_42/_22%)] ring-1 ring-white/5 sm:p-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-br from-cyan-500/20 via-transparent to-fuchsia-500/10 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1.65fr_0.95fr] lg:items-end">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.36em] text-cyan-300">LedgerFlow AI</p>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Intelligent cash flow insights with a polished, cinematic experience.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                Connect invoices, receipts and bank records to get proactive forecasting, accurate matching, and an elegant dashboard experience built for modern SMB finance teams.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-[0_18px_60px_rgb(15_23_42/_12%)]">
                  <p className="text-sm uppercase tracking-[0.26em] text-cyan-300">Fast setup</p>
                  <p className="mt-3 text-xl font-semibold text-white">Launch in minutes</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-[0_18px_60px_rgb(15_23_42/_12%)]">
                  <p className="text-sm uppercase tracking-[0.26em] text-cyan-300">Smart alerts</p>
                  <p className="mt-3 text-xl font-semibold text-white">Stay ahead of shortfalls</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[2rem] bg-slate-950/95 p-6 shadow-[0_24px_70px_rgb(15_23_42/_18%)] ring-1 ring-white/5">
                <p className="text-sm uppercase tracking-[0.26em] text-slate-400">Featured workflow</p>
                <h2 className="mt-4 text-2xl font-semibold text-white">Invoice-to-bank matching</h2>
                <p className="mt-3 text-slate-300">Automatically reconcile received invoices with payment events, flagging mismatches before they impact liquidity.</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-slate-900/90 p-4 border border-white/10">
                    <p className="text-sm text-slate-400">Accuracy</p>
                    <p className="mt-2 text-lg font-semibold text-white">98.7%</p>
                  </div>
                  <div className="rounded-3xl bg-slate-900/90 p-4 border border-white/10">
                    <p className="text-sm text-slate-400">Confidence</p>
                    <p className="mt-2 text-lg font-semibold text-white">Real-time</p>
                  </div>
                </div>
              </div>
              <div className="rounded-[2rem] bg-slate-950/95 p-6 shadow-[0_24px_70px_rgb(15_23_42/_18%)] ring-1 ring-white/5">
                <p className="text-sm uppercase tracking-[0.26em] text-slate-400">Your next step</p>
                <h2 className="mt-4 text-2xl font-semibold text-white">Upload a document</h2>
                <p className="mt-3 text-slate-300">See how the platform extracts totals, due dates, line items, and smart recommendations from your first invoice.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-3">
          <ClientCard title="Invoice Match" description="Upload invoices and statements to reconcile transactions automatically." />
          <ClientCard title="Forecasting" description="Build 30/60/90-day cash flow scenarios with AI-driven guidance." />
          <ClientCard title="Liquidity Alerts" description="Receive proactive notifications before cash crunches and payroll risk." />
        </div>

        <div className="mt-12 rounded-[2rem] border border-white/10 bg-slate-900/70 p-8 shadow-[0_40px_120px_rgb(15_23_42/_16%)] backdrop-blur-xl">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Upload Engine</p>
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Invoice and receipt analysis with cinematic polish</h2>
              <p className="max-w-2xl text-slate-300 leading-8">
                Drag in a document, provide a few details, and let LedgerFlow extract vendor, total, due date, and payment recommendations in one elegant flow.
              </p>
            </div>
            <div className="rounded-[1.75rem] bg-slate-950/90 p-6 shadow-[0_32px_90px_rgb(15_23_42/_18%)] ring-1 ring-white/5">
              <UploadEngine />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
