"use client";
import { useState } from "react";
import type { StudioProps } from "@/lib/types";
import { AudioStudio } from "./AudioStudio";
import { MotionControls } from "./MotionControls";

const TABS = [
  { id: "video", label: "Video" },
  { id: "audio", label: "Audio" },
] as const;

export function SettingsPanel({ p, set }: StudioProps) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("video");
  return (
    <div className="flex min-h-full flex-col">
      <div role="tablist" aria-label="Settings" className="sticky top-0 z-10 flex gap-1 border-b border-ink-700 bg-ink-900 px-3 pt-2">
        {TABS.map((t) => (
          <button
            key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}
            className={`relative px-3 py-2.5 text-[13px] font-medium transition-colors ${tab === t.id ? "text-fg" : "text-mute hover:text-fg"}`}
          >
            {t.label}
            {tab === t.id && <span className="absolute inset-x-3 -bottom-px h-[2px] bg-lime" />}
          </button>
        ))}
      </div>
      <div role="tabpanel">
        {tab === "video" ? <MotionControls p={p} set={set} /> : <AudioStudio p={p} set={set} />}
      </div>
    </div>
  );
}
