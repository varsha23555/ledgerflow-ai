import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function UploadInvoice() {
  const { token } = useAuth();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0] || null;
    setError("");
    setResult(null);
    setFile(selected);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!token) {
      setError("Please login before uploading documents.");
      return;
    }

    if (!file) {
      setError("Please select a PDF invoice file to upload.");
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Only PDF files are accepted. Please upload a PDF invoice.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/api/invoice/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const resultJson = await response.json();

      if (!response.ok) {
        setError(resultJson.detail || resultJson.error || "Upload failed. Please try again.");
      } else {
        setResult(resultJson);
        setFile(null);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "An unexpected error occurred during upload. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  const riskColor = (level) => {
    if (level === "Critical") return "border-rose-500 bg-rose-500/10 text-rose-200";
    if (level === "Elevated") return "border-amber-500 bg-amber-500/10 text-amber-200";
    return "border-emerald-500 bg-emerald-500/10 text-emerald-200";
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <section className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white">Upload Invoice</h1>
          <p className="mt-2 text-slate-400">
            Upload a PDF invoice and LedgerFlow AI will automatically extract the values and show the cashflow forecast.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="space-y-2">
              <span className="text-sm text-slate-300">Invoice PDF</span>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="w-full text-slate-100"
              />
              {file ? <p className="text-slate-400 text-sm">Selected file: {file.name}</p> : null}
            </label>

            {error ? (
              <div className="rounded-2xl border border-rose-500 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
              {loading ? "Uploading & Parsing..." : "Upload Invoice PDF"}
            </button>
          </form>
        </div>

        {result ? (
          <div className="mt-10 space-y-6">
            {/* Parsed Invoice Preview */}
            <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Parsed Preview</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Invoice parsing summary</h3>
                </div>
                <span className="rounded-full bg-slate-800 px-4 py-2 text-sm text-slate-300">
                  Match {Math.round(result.parsed_invoice.confidence * 100)}%
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Vendor</p>
                  <p className="mt-2 text-lg font-semibold text-white">{result.parsed_invoice.vendor}</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Total</p>
                  <p className="mt-2 text-lg font-semibold text-white">{formatCurrency(result.parsed_invoice.total)}</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Invoice Date</p>
                  <p className="mt-2 text-lg font-semibold text-white">{result.parsed_invoice.invoiceDate}</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Due Date</p>
                  <p className="mt-2 text-lg font-semibold text-white">{result.parsed_invoice.dueDate}</p>
                </div>
              </div>

              <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Recommendation</p>
                <p className="mt-2 text-white">{result.recommendation}</p>
              </div>
            </div>

            {/* Cashflow Forecast */}
            {result.cashflow_forecast ? (
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
                <div className="mb-6">
                  <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Cashflow Forecast</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">
                    Projected cashflow after paying {result.cashflow_forecast.vendor}
                  </h3>
                </div>

                <div className={`rounded-3xl border px-5 py-4 ${riskColor(result.cashflow_forecast.risk_level)}`}>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em]">
                    Risk Level: {result.cashflow_forecast.risk_level}
                  </p>
                  <p className="mt-2 text-sm">{result.cashflow_forecast.warning}</p>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Current Cash Balance</p>
                    <p className="mt-2 text-xl font-semibold text-white">
                      {formatCurrency(result.cashflow_forecast.current_cash_balance)}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Invoice Payment</p>
                    <p className="mt-2 text-xl font-semibold text-rose-400">
                      {formatCurrency(result.cashflow_forecast.cash_impact)}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Projected Balance After Payment</p>
                    <p className="mt-2 text-xl font-semibold text-emerald-400">
                      {formatCurrency(result.cashflow_forecast.projected_cash_after_payment)}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Forecast Timeline</p>
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full min-w-[500px] text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Projected Cash Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.cashflow_forecast.milestones.map((point) => (
                          <tr key={point.date} className="border-b border-slate-800/60">
                            <td className="px-4 py-3 text-slate-300">{point.date}</td>
                            <td className="px-4 py-3 font-semibold text-white">{formatCurrency(point.cash_balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Suggestions</p>
                  <ul className="mt-3 space-y-2 text-slate-200">
                    {result.cashflow_forecast.suggestions.map((suggestion) => (
                      <li key={suggestion} className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>
    </main>
  );
}