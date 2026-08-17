const CONFIG = {
  available: { color: "bg-teal-500", label: "Available now", animate: true },
  busy: { color: "bg-pulse", label: "In consultation", animate: false },
  offline: { color: "bg-ink-soft/40", label: "Offline today", animate: false },
};

export default function StatusDot({ status = "available", showLabel = true, className = "" }) {
  const cfg = CONFIG[status] ?? CONFIG.available;
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="relative flex h-2 w-2">
        {cfg.animate && (
          <span className={`absolute inline-flex h-full w-full rounded-full ${cfg.color} opacity-60 animate-ping`} />
        )}
        <span className={`relative inline-flex h-2 w-2 rounded-full ${cfg.color}`} />
      </span>
      {showLabel && <span className="text-xs font-medium text-ink-soft">{cfg.label}</span>}
    </span>
  );
}
