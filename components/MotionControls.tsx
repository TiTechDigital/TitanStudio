"use client";
import { Dices, Lock, Unlock } from "lucide-react";
import { randomSeed } from "@/lib/constants";
import type { StudioProps } from "@/lib/types";
import { Group, Label, Slider, Toggle } from "./ui/Controls";

export function MotionControls({ p, set }: StudioProps) {
  return (
    <>
      <Group title="Motion">
        <Slider label="Motion intensity" value={p.motion} min={1} max={10} onChange={(v) => set("motion", v)} format={(v) => `${v} / 10`} />
        <Toggle checked={p.upscale4k} onChange={(v) => set("upscale4k", v)} label="Upscale to 4K" sub="Adds a super-resolution pass. Takes longer." />
      </Group>

      <Group title="Quality">
        <Slider label="Guidance" value={p.guidance} min={1} max={10} step={0.1} onChange={(v) => set("guidance", v)} format={(v) => v.toFixed(1)} />
        <Slider label="Steps" value={p.steps} min={12} max={40} onChange={(v) => set("steps", v)} />
        <div>
          <Label htmlFor="negative">Avoid</Label>
          <textarea
            id="negative" rows={2} value={p.negativePrompt} onChange={(e) => set("negativePrompt", e.target.value)}
            className="field resize-none" placeholder="Things to keep out of the shot"
          />
        </div>
      </Group>

      <Group title="Seed">
        <div className="flex gap-2">
          <input
            id="seed" type="number" className="field font-mono" value={p.seed} aria-label="Seed"
            onChange={(e) => set("seed", Math.max(0, Math.floor(Number(e.target.value) || 0)))}
          />
          <button type="button" className="btn-ghost !px-2.5" onClick={() => set("seed", randomSeed())} aria-label="Random seed"><Dices size={15} /></button>
          <button
            type="button" className={`btn-ghost !px-2.5 ${p.lockSeed ? "!border-lime/60 !text-lime" : ""}`}
            onClick={() => set("lockSeed", !p.lockSeed)} aria-pressed={p.lockSeed} aria-label="Lock seed"
          >
            {p.lockSeed ? <Lock size={15} /> : <Unlock size={15} />}
          </button>
        </div>
        <p className="text-[11.5px] text-mute">{p.lockSeed ? "Locked. The same prompt gives the same clip." : "A new seed is picked for every generation."}</p>
      </Group>
    </>
  );
}
