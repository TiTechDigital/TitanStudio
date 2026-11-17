"use client";
import type { HistoryItem } from "@/lib/types";

export function History({ items, activeId, onSelect }: { items: HistoryItem[]; activeId: number | null; onSelect: (i: HistoryItem) => void }) {
  if (!items.length) return null;
  return (
    <ul className="flex shrink-0 gap-2 overflow-x-auto px-5 pb-3" aria-label="This session">
      {items.map((it) => (
        <li key={it.id} className="shrink-0">
          <button
            type="button" onClick={() => onSelect(it)} title={it.prompt}
            className={`relative block h-14 w-24 overflow-hidden rounded-lg bg-ink-800 ring-1 transition ${it.id === activeId ? "ring-2 ring-lime" : "ring-white/10 hover:ring-white/40"}`}
          >
            <video src={it.result.rawUrl ?? it.result.videoUrl} muted playsInline preload="metadata" className="h-full w-full object-cover" />
          </button>
        </li>
      ))}
    </ul>
  );
}
