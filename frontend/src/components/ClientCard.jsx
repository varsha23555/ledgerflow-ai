export default function ClientCard({ title, description }) {
  return (
    <div className="group rounded-[2rem] border border-white/10 bg-slate-950/90 p-8 shadow-[0_25px_80px_rgb(15_23_42/_18%)] transition hover:border-cyan-400/30 hover:bg-slate-900/95">
      <div className="flex items-center justify-between gap-3">
        <div className="h-12 w-12 rounded-3xl bg-cyan-500/15 ring-1 ring-cyan-400/20" />
        <span className="rounded-full bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.26em] text-cyan-300">
          {title.split(" ")[0]}
        </span>
      </div>
      <h2 className="mt-6 text-2xl font-semibold text-white">{title}</h2>
      <p className="mt-4 text-slate-300 leading-7">{description}</p>
      <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300">
        <span>View details</span>
        <span aria-hidden="true">→</span>
      </div>
    </div>
  );
}