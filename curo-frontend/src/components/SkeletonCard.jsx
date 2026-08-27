export default function SkeletonCard({ lines = 2, hasAvatar = true, className = "" }) {
  return (
    <div className={`rounded-xl2 border border-line bg-white p-5 animate-pulse ${className}`}>
      <div className="flex items-start gap-4">
        {hasAvatar && (
          <div className="h-14 w-14 shrink-0 rounded-full bg-paper-dim" />
        )}
        <div className="min-w-0 flex-1 space-y-3">
          <div className="h-5 w-2/5 rounded bg-paper-dim" />
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={`h-4 rounded bg-line ${i === lines - 1 ? "w-3/5" : "w-4/5"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonSlot({ className = "" }) {
  return (
    <div className={`h-16 rounded-lg border border-line bg-paper-dim animate-pulse ${className}`} />
  );
}
