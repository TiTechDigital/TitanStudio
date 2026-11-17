"use client";
import { Mic, Music2, SlidersHorizontal } from "lucide-react";
import { BGM_TRACKS, VOICE_CATALOG } from "@/lib/constants";
import type { StudioProps } from "@/lib/types";
import { Group, Label, Segmented, Slider } from "./ui/Controls";

export function SettingsPanel({ p, set }: StudioProps) {
  const words = p.narration.trim() ? p.narration.trim().split(/\s+/).length : 0;
  const albanian = p.voice === "albanian" || p.voice === "anila";

  return (
    <div>
      <Group title="Voice-over" aside={<Mic size={15} className="text-accent-soft" />}>
        <div>
          <Label htmlFor="narration" aside={<span className="font-mono text-[11px] text-dim">{words} words</span>}>Script</Label>
          <textarea
            id="narration" rows={4} value={p.narration} onChange={(e) => set("narration", e.target.value)}
            className="field resize-none leading-relaxed" placeholder="Leave empty for a clip without voice."
          />
        </div>
        <div className="space-y-1.5">
          {VOICE_CATALOG.map((g) => (
            <div key={g.group}>
              <p className="mb-1.5 mt-2 text-[11px] font-medium uppercase tracking-wider text-dim">{g.group}</p>
              <div className="grid grid-cols-1 gap-1.5">
                {g.voices.map((v) => {
                  const on = p.voice === v.id;
                  return (
                    <button key={v.id} type="button" aria-pressed={on} onClick={() => set("voice", v.id)}
                      className={`flex items-center justify-between rounded-xl border px-3 py-2 text-left transition ${on ? "border-accent/70 bg-accent/15" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07]"}`}>
                      <span className="text-[13px] font-medium">{v.name}</span>
                      <span className="text-[11.5px] text-mute">{v.note}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div>
          <Label>Voice engine</Label>
          <Segmented
            label="Voice engine" value={p.ttsEngine} onChange={(v) => set("ttsEngine", v)}
            options={[{ value: "chattts", label: "ChatTTS" }, { value: "kokoro", label: "Kokoro" }]}
          />
          {albanian && <p className="mt-2 text-[11px] text-dim">Albanian voices use Edge TTS regardless of engine.</p>}
        </div>
      </Group>

      <Group title="Soundtrack" aside={<Music2 size={15} className="text-accent-soft" />}>
        <div className="grid grid-cols-2 gap-1.5">
          {BGM_TRACKS.map((t) => {
            const on = p.music === t.id;
            return (
              <button key={t.id} type="button" aria-pressed={on} onClick={() => set("music", t.id)}
                className={`rounded-xl border px-3 py-2.5 text-left text-[12.5px] font-medium transition ${on ? "border-accent/70 bg-accent/15 text-fg" : "border-white/10 bg-white/[0.03] text-mute hover:bg-white/[0.07] hover:text-fg"}`}>
                {t.name}
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-dim">Generated with MusicGen. Adds ~25s to the render.</p>
      </Group>

      <Group title="Fine-tune" aside={<SlidersHorizontal size={15} className="text-accent-soft" />}>
        <Slider label="Cinema strength" value={p.strength} min={0.3} max={0.9} step={0.05} onChange={(v) => set("strength", v)}
          format={(v) => v.toFixed(2)} hint="How much the cinema pass restyles the base motion. Higher = more stylised, less faithful." />
        <Slider label="Cinema steps" value={p.steps} min={8} max={30} onChange={(v) => set("steps", v)}
          hint="More steps = finer detail but a longer render (about 8s per step on the worker)." />
      </Group>
    </div>
  );
}
