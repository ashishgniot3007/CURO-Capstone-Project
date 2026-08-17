export default function PulseTicker({
  label = "Live queue",
  ahead = 3,
  waitMins = 22,
  tone = "teal", // "teal" | "pulse"
  size = "md", // "sm" | "md" | "lg"
}) {
  const toneColor = tone === "pulse" ? "#E8604C" : "#0F5C56";
  const sizes = {
    sm: { h: 32, num: "text-xl", label: "text-[10px]" },
    md: { h: 40, num: "text-2xl", label: "text-[11px]" },
    lg: { h: 52, num: "text-4xl", label: "text-xs" },
  }[size];

  return (
    <div className="flex items-center gap-4">
      <svg
        width="120"
        height={sizes.h}
        viewBox="0 0 120 40"
        fill="none"
        className="shrink-0"
        aria-hidden="true"
      >
        <path
          d="M0 20 H30 L38 6 L48 34 L56 20 H70 L76 12 L82 28 L88 20 H120"
          stroke={toneColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="240"
          className="animate-pulseline"
        />
      </svg>
      <div className="flex items-baseline gap-4 font-mono">
        <div>
          <div className={`${sizes.num} font-semibold leading-none text-ink`}>{ahead}</div>
          <div className={`${sizes.label} uppercase tracking-[0.14em] text-ink-soft/70 mt-1`}>
            {label === "Live queue" ? "ahead of you" : label}
          </div>
        </div>
        <div className="h-8 w-px bg-line" />
        <div>
          <div className={`${sizes.num} font-semibold leading-none text-ink`}>~{waitMins}<span className="text-sm font-medium">m</span></div>
          <div className={`${sizes.label} uppercase tracking-[0.14em] text-ink-soft/70 mt-1`}>est. wait</div>
        </div>
      </div>
    </div>
  );
}
