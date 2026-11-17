"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { PIPELINE_STAGES } from "@/lib/constants";
import type { GenStatus } from "@/lib/types";

export function PipelineTelemetry({ status, stage, progress, upscale }: { status: GenStatus; stage: number; progress: number; upscale: boolean }) {
  const stages = PIPELINE_STAGES.filter((s) => s.key !== "composite" || upscale);
  const current = PIPELINE_STAGES[Math.min(stage, PIPELINE_STAGES.length - 1)];
  return (
    <div className="w-full max-w-sm px-6">
      <div className="flex items-end justify-between">
        <p className="text-[13px] text-mute">{current.label}</p>
        <p className="font-display text-6xl font-extrabold tracking-tighter tabular-nums text-fg">{Math.round(progress)}<span className="text-2xl text-lime">%</span></p>
      </div>
      <div className="relative mt-3 h-[2px] overflow-hidden bg-ink-600">
        <motion.div className="h-full bg-lime" animate={{ width: `${progress}%` }} transition={{ ease: "easeOut", duration: 0.4 }} />
        {status === "generating" && <div className="absolute inset-y-0 w-1/4 animate-sweep bg-gradient-to-r from-transparent via-white/40 to-transparent" />}
      </div>

      <ol className="mt-7 space-y-3">
        {stages.map((s) => {
          const i = PIPELINE_STAGES.findIndex((x) => x.key === s.key);
          const complete = status === "completed" || i < stage;
          const active = status === "generating" && i === stage;
          return (
            <li key={s.key} className={`flex items-center gap-3 text-[13px] ${complete ? "text-mute" : active ? "text-fg" : "text-dim"}`}>
              <span className="grid h-4 w-4 place-items-center">
                {complete ? <Check size={14} className="text-lime" /> : <span className={`h-1.5 w-1.5 rounded-full ${active ? "animate-pulseDot bg-lime" : "bg-ink-500"}`} />}
              </span>
              {s.label}
            </li>
          );
        })}
      </ol>
      <p className="mt-6 text-[11px] text-dim">Step progress is an estimate.</p>
    </div>
  );
}
