import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Dashboard() {
  const { token, user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    const fetchDashboard = async () => {
      try {
        const response = await fetch(`${API_URL}/api/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  if (loading) {
    return <div className="mx-auto max-w-7xl px-6 py-12 text-center text-slate-400">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="mx-auto max-w-7xl px-6 py-12 text-center text-rose-400">{error}</div>;
  }

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  if (!dashboardData) {
    return <div className="mx-auto max-w-7xl px-6 py-12 text-center text-slate-400">No dashboard data available.</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Welcome, {user?.name || user?.email || "there"}
        </h1>
        <p className="mt-2 text-slate-400">Here is your cash flow overview.</p>
      </div>

      <div className="space-y-8">
        {/* Key metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Current Cash</p>
            <p className="mt-2 text-2xl font-semibold text-white">{formatCurrency(dashboardData.current_cash || 0)}</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Expected Inflows</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-400">{formatCurrency(dashboardData.expected_inflows || 0)}</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Expected Outflows</p>
            <p className="mt-2 text-2xl font-semibold text-rose-400">{formatCurrency(dashboardData.expected_outflows || 0)}</p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Risk Level</p>
            <p className="mt-2 text-2xl font-semibold text-amber-400">{dashboardData.risk_level || "Unknown"}</p>
          </div>
        </div>

        {/* Warning */}
        {dashboardData.warning && (
          <div className="rounded-3xl border border-amber-500/40 bg-amber-500/10 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">Warning</p>
            <p className="mt-2 text-amber-100">{dashboardData.warning}</p>
          </div>
        )}

        {/* Forecast */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-xl font-semibold text-white">Cash Flow Forecast</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[400px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Expected Cash</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.forecast?.map((point) => (
                  <tr key={point.date} className="border-b border-slate-800/60">
                    <td className="px-4 py-3 text-slate-300">{point.date}</td>
                    <td className="px-4 py-3 font-semibold text-white">{formatCurrency(point.expected_cash || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming bills and overdue invoices */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-xl font-semibold text-white">Upcoming Bills</h2>
            {dashboardData.upcoming_bills?.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {dashboardData.upcoming_bills.map((bill) => (
                  <li key={bill.vendor} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3">
                    <div>
                      <p className="font-medium text-white">{bill.vendor}</p>
                      <p className="text-sm text-slate-400">Due {bill.due_date}</p>
                    </div>
                    <span className="font-semibold text-rose-400">{formatCurrency(bill.amount || 0)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-slate-400">No upcoming bills</p>
            )}
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-xl font-semibold text-white">Overdue Invoices</h2>
            {dashboardData.overdue_invoices?.length > 0 ? (
              <ul className="mt-4 space-y-3">
                {dashboardData.overdue_invoices.map((inv) => (
                  <li key={inv.invoice_number} className="rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-white">{inv.vendor}</p>
                      <span className="font-semibold text-emerald-400">{formatCurrency(inv.amount || 0)}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-400">
                      {inv.invoice_number} · {inv.days_past_due} days past due
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-slate-400">No overdue invoices</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}