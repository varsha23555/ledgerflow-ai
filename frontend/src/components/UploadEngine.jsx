import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function UploadEngine() {
  const { token } = useAuth();
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [amount, setAmount] = useState(0);
  const [vendor, setVendor] = useState("");
  const [description, setDescription] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [file, setFile] = useState(null);
  const [inputKey, setInputKey] = useState(Date.now());
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState(null);

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0] ?? null;
    setSuccessMessage("");
    setErrorMessage("");
    setResult(null);
    setFile(selected);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    setResult(null);

    if (!token) {
      setErrorMessage("Please login before uploading documents.");
      return;
    }

    if (!file) {
      setErrorMessage("Please attach an invoice or receipt file before uploading.");
      return;
    }

    if (amount <= 0) {
      setErrorMessage("Please enter a valid amount greater than zero.");
      return;
    }

    if (!invoiceDate || !dueDate) {
      setErrorMessage("Please provide both invoice date and due date.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("invoice_number", invoiceNumber || `INV-${Date.now()}`);
      formData.append("amount", amount.toString());
      formData.append("description", description);
      formData.append("invoice_date", invoiceDate);
      formData.append("due_date", dueDate);
      formData.append("vendor", vendor);
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
        setErrorMessage(resultJson.detail || resultJson.error || "Upload failed. Please try again.");
      } else {
        setSuccessMessage(`Upload complete: ${resultJson.invoice_number} (${resultJson.file_name})`);
        setInvoiceNumber("");
        setAmount(0);
        setVendor("");
        setDescription("");
        setInvoiceDate("");
        setDueDate("");
        setFile(null);
        setInputKey(Date.now());
        setResult(resultJson);
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred during upload. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const riskColor = (level) => {
    if (level === "Critical") return "border-rose-500 bg-rose-500/10 text-rose-200";
    if (level === "Elevated") return "border-amber-500 bg-amber-500/10 text-amber-200";
    return "border-emerald-500 bg-emerald-500/10 text-emerald-200";
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/20">
      <div className="mb-8">
        <p className="text-cyan-300 text-sm uppercase tracking-[0.3em]">Multimodal Upload</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Invoice & Receipt Upload Engine</h2>
        <p className="mt-3 text-slate-300">
          Upload an invoice and see the projected cashflow impact on your banking institution after the payment is made.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm text-slate-300">Invoice / Receipt Number</span>
            <input
              value={invoiceNumber}
              onChange={(event) => setInvoiceNumber(event.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              placeholder="INV-0001"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-300">Amount</span>
            <input
              type="number"
              value={amount || ""}
              onChange={(event) => setAmount(Number(event.target.value))}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              placeholder="1200.00"
              min="0"
              step="0.01"
            />
          </label>
        </div>

        <label className="space-y-2">
          <span className="text-sm text-slate-300">Payee / Vendor (e.g. John)</span>
          <input
            value={vendor}
            onChange={(event) => setVendor(event.target.value)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            placeholder="John"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm text-slate-300">Invoice Date</span>
            <input
              type="date"
              value={invoiceDate}
              onChange={(event) => setInvoiceDate(event.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm text-slate-300">Due Date</span>
            <input
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            />
          </label>
        </div>

        <label className="space-y-2">
          <span className="text-sm text-slate-300">Description / Notes</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            rows={4}
            placeholder="Client invoice for website retainer or expense receipt details"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-slate-300">Invoice / Receipt File</span>
          <input
            key={inputKey}
            type="file"
            accept="application/pdf,image/png,image/jpeg"
            onChange={handleFileChange}
            className="w-full text-slate-100"
          />
          {file ? <p className="text-slate-400 text-sm">Selected file: {file.name}</p> : null}
        </label>

        {errorMessage ? <div className="rounded-2xl border border-rose-500 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{errorMessage}</div> : null}
        {successMessage ? <div className="rounded-2xl border border-emerald-500 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{successMessage}</div> : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700"
        >
          {loading ? "Uploading..." : "Upload Invoice / Receipt"}
        </button>
      </form>

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

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Payment Terms</p>
                <p className="mt-2 text-white">{result.parsed_invoice.paymentTerms}</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">File</p>
                <p className="mt-2 text-white">{result.file_name}</p>
                <p className="text-slate-400 text-sm">{result.content_type}</p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Line Items</p>
              <ul className="mt-3 space-y-2 text-slate-200">
                {result.parsed_invoice.lineItems.map((item) => (
                  <li key={item} className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3">{item}</li>
                ))}
              </ul>
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
                <p className="text-sm font-semibold uppercase tracking-[0.2em]">Risk Level: {result.cashflow_forecast.risk_level}</p>
                <p className="mt-2 text-sm">{result.cashflow_forecast.warning}</p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Current Cash Balance</p>
                  <p className="mt-2 text-xl font-semibold text-white">{formatCurrency(result.cashflow_forecast.current_cash_balance)}</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Invoice Payment</p>
                  <p className="mt-2 text-xl font-semibold text-rose-400">{formatCurrency(result.cashflow_forecast.cash_impact)}</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Projected Balance After Payment</p>
                  <p className="mt-2 text-xl font-semibold text-emerald-400">{formatCurrency(result.cashflow_forecast.projected_cash_after_payment)}</p>
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
    </div>
  );
}