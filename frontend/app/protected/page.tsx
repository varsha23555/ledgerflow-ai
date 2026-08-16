import DashboardGuard from "../../components/DashboardGuard";

export default function ProtectedDashboard() {
  return (
    <DashboardGuard>
      <main className="min-h-screen bg-slate-950 text-slate-100 px-6 py-10 sm:px-8">
        <section className="mx-auto max-w-6xl">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
            <h1 className="text-3xl font-semibold text-white">Protected Dashboard</h1>
            <p className="mt-3 text-slate-400">Only logged-in users can access this page.</p>
          </div>
        </section>
      </main>
    </DashboardGuard>
  );
}
