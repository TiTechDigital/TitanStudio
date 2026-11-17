"use client";
import { Clock, Film, Monitor, Proportions, Sparkles, Wand2 } from "lucide-react";
import { ASPECTS, DIRECTOR_PILLS, MODELS, RESOLUTIONS, estimateMs } from "@/lib/constants";
import type { StudioProps } from "@/lib/types";
import { Menu, MenuItem } from "./ui/Controls";

interface Props extends StudioProps {
  busy: boolean;
  onGenerate: () => void;
}

export function Composer({ p, set, patch, busy, onGenerate }: Props) {
  const model = MODELS.find((m) => m.id === p.model)!;
  const res = RESOLUTIONS.find((r) => r.id === p.resolution)!;
  const warmMin = Math.max(1, Math.round((estimateMs(p).total - 45_000) / 60_000));
  const append = (text: string) => set("prompt", p.prompt.trim() ? `${p.prompt.trim().replace(/[,.\s]+$/, "")}, ${text}` : text);

  return (
    <div className="relative shrink-0 px-4 pb-4">
      <div className="glass mx-auto max-w-3xl rounded-[28px] p-3 shadow-[0_20px_80px_-20px_rgba(59,130,255,.45)]">
        <textarea
          value={p.prompt} rows={2} maxLength={1000}
          onChange={(e) => set("prompt", e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !busy) onGenerate(); }}
          placeholder="Describe your shot: subject, camera move, light, mood…"
          aria-label="Prompt"
          className="max-h-40 w-full resize-none bg-transparent px-3 pb-1 pt-2 text-[15px] leading-relaxed text-fg outline-none placeholder:text-dim"
        />
        <div className="flex flex-wrap items-center gap-2 px-1 pt-1">
          <Menu label="Quality preset" width="w-64" trigger={<><Film size={14} className="text-accent-soft" />{model.name}</>}>
            {(close) => MODELS.map((m) => (
              <MenuItem key={m.id} active={m.id === p.model} title={m.name} sub={m.desc} right={<span className="text-[10.5px]">{m.tag}</span>}
                onClick={() => { patch({ model: m.id, steps: m.steps, strength: m.strength }); close(); }} />
            ))}
          </Menu>

          <Menu label="Duration" width="w-56" trigger={<><Clock size={14} className="text-accent-soft" />{p.autoDuration && p.narration.trim() ? "Auto" : `${p.durationSec}s`}</>}>
            {(close) => (
              <div className="p-2">
                <div className="grid grid-cols-3 gap-1.5">
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
                    <button key={s} type="button" aria-pressed={!p.autoDuration && s === p.durationSec}
                      onClick={() => { patch({ durationSec: s, autoDuration: false }); close(); }}
                      className={`rounded-lg py-2 text-[13px] font-medium transition ${!p.autoDuration && s === p.durationSec ? "bg-accent text-white" : "bg-white/[0.05] text-fg hover:bg-white/10"}`}>
                      {s}s
                    </button>
                  ))}
                </div>
                <button type="button" disabled={!p.narration.trim()}
                  onClick={() => { set("autoDuration", true); close(); }}
                  className={`mt-2 w-full rounded-lg py-2 text-[12.5px] font-medium transition disabled:opacity-40 ${p.autoDuration ? "bg-accent text-white" : "bg-white/[0.05] text-fg hover:bg-white/10"}`}>
                  Match narration length
                </button>
              </div>
            )}
          </Menu>

          <Menu label="Aspect ratio" width="w-56" trigger={<><Proportions size={14} className="text-accent-soft" />{p.aspect}</>}>
            {(close) => ASPECTS.map((a) => (
              <MenuItem key={a.id} active={a.id === p.aspect} title={a.label} sub={a.sub} onClick={() => { set("aspect", a.id); close(); }} />
            ))}
          </Menu>

          <Menu label="Resolution" width="w-60" trigger={<><Monitor size={14} className="text-accent-soft" />{res.label}</>}>
            {(close) => RESOLUTIONS.map((r) => (
              <MenuItem key={r.id} active={r.id === p.resolution} title={r.label} sub={r.sub} onClick={() => { set("resolution", r.id); close(); }} />
            ))}
          </Menu>

          <Menu label="Camera and style" width="w-72" trigger={<><Wand2 size={14} className="text-accent-soft" />Director</>}>
            {() => (
              <div className="p-2">
                {Object.entries(DIRECTOR_PILLS).map(([group, items]) => (
                  <div key={group} className="mb-2 last:mb-0">
                    <p className="mb-1.5 px-1 text-[11px] font-medium uppercase tracking-wider text-dim">{group}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {items.map((it) => (
                        <button key={it.label} type="button" onClick={() => append(it.text)}
                          className="rounded-full bg-white/[0.06] px-2.5 py-1 text-[12px] text-fg transition hover:bg-accent/25">
                          {it.emoji} {it.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Menu>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden font-mono text-[11px] text-dim sm:inline">~{warmMin} min</span>
            <button type="button" className="btn-primary" disabled={busy || !p.prompt.trim()} onClick={onGenerate}>
              <Sparkles size={16} /> {busy ? "Rendering…" : "Generate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
