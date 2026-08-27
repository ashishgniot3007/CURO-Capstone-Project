export default function ProviderStatsTab({ stats, loading, error }) {
  return (
    <div className="rounded-xl border border-line bg-white p-6 shadow-card">
      <h2 className="font-display text-lg font-semibold text-ink mb-4">Provider Performance & Stats</h2>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 rounded-lg border border-line bg-paper-dim animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-pulse py-4 font-medium">{error}</p>
      ) : stats && typeof stats === "object" && Object.keys(stats).length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(stats).map(([key, val]) => (
            <div key={key} className="rounded-lg border border-line bg-paper p-4">
              <div className="text-xs font-medium text-ink-soft uppercase tracking-wider">
                {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
              </div>
              <div className="mt-2 font-mono text-2xl font-bold text-teal-700">
                {typeof val === "object" ? JSON.stringify(val) : String(val)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-ink-soft py-4">No statistical data available yet.</p>
      )}
    </div>
  );
}
