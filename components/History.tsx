"use client";
import type { HistoryItem } from "@/lib/types";

export function History({ items, activeId, onSelect }: { items: HistoryItem[]; activeId: number | null; onSelect: (i: HistoryItem) => void }) {
  if (!items.length) return null;
  return (
    <div className="shrink-0 px-4 pb-3">
      <div className="flex gap-2.5 overflow-x-auto pb-1" role="list" aria-label="This session">
        {items.map((it) => (
          <button
            key={it.id} type="button" role="listitem" onClick={() => onSelect(it)} title={it.prompt}
            className={`group relative h-16 shrink-0 overflow-hidden rounded-xl border bg-ink-900 transition ${it.aspect === "9:16" ? "w-9" : "w-28"} ${
              it.id === activeId ? "border-accent shadow-[0_0_20px_-4px_rgba(59,130,255,.9)]" : "border-white/10 opacity-70 hover:opacity-100"
            }`}
          >
            {/* #t=0.1 shows the first frame as a thumbnail */}
            <video src={`${it.result.videoUrl}#t=0.1`} muted preload="metadata" playsInline className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
