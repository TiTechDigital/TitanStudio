"use client";
import { ASPECTS, DIRECTOR_PILLS, EXAMPLES, MODELS, RESOLUTIONS, estimateMs } from "@/lib/constants";
import type { StudioProps } from "@/lib/types";
import { Section, Segmented, Slider } from "./ui/Controls";

interface Props extends StudioProps {
  busy: boolean;
  onGenerate: () => void;
  className?: string;
}

const SUB: Record<string, string> = { "9:16": "Shorts, Reels", "16:9": "YouTube" };
const RES_PX: Record<string, string> = { draft: "704p", hd: "1080p", uhd: "2160p" };

export function ShotSheet({ p, set, patch, busy, onGenerate, className = "" }: Props) {
  const hasNarration = !!p.narration.trim();
  const mins = Math.max(1, Math.round((estimateMs(p).total - 45_000) / 60_000));
  const append = (text: string) =>
    set("prompt", p.prompt.trim() ? `${p.prompt.trim().replace(/[,.\s]+$/, "")}, ${text}` : text);

  return (
    <aside aria-label="Shot settings" className={`flex min-h-0 flex-col border-line lg:border-r ${className}`}>
      <div className="min-h-0 flex-1 lg:overflow-y-auto">
        <Section title="Prompt" aside={<span className="num text-[11.5px] text-dim">{p.prompt.length}/1000</span>}>
          <textarea
            value={p.prompt} rows={6} maxLength={1000} aria-label="Prompt"
            onChange={(e) => set("prompt", e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !busy && p.prompt.trim()) onGenerate(); }}
            placeholder="Subject, camera move, light, mood."
            className="field resize-none leading-relaxed"
          />
          {p.prompt.trim() ? (
            <div>
              <p className="mb-1.5 text-[12px] text-dim">Add to prompt</p>
              <div className="flex flex-wrap gap-1.5">
                {Object.values(DIRECTOR_PILLS).flat().map((it) => (
                  <button key={it.label} type="button" onClick={() => append(it.text)}
                    className="rounded border border-line-strong px-2 py-1 text-[12px] text-mute transition-colors hover:border-cobalt hover:text-fg">
                    {it.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p className="mb-1 text-[12px] text-dim">Start from a shot</p>
              <ul>
                {EXAMPLES.map((e) => (
                  <li key={e.prompt}>
                    <button type="button" onClick={() => patch({ prompt: e.prompt, aspect: e.aspect })}
                      className="block w-full border-t border-line py-2 text-left text-[12.5px] leading-snug text-mute transition-colors first:border-t-0 hover:text-fg">
                      {e.prompt}
                      <span className="num ml-2 text-[11px] text-dim">{e.aspect}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Section>

        <Section title="Quality">
          <Segmented
            label="Quality" value={p.model}
            options={MODELS.map((m) => ({ value: m.id, label: m.name, sub: m.tag }))}
            onChange={(id) => { const m = MODELS.find((x) => x.id === id)!; patch({ model: id, steps: m.steps, strength: m.strength }); }}
          />
        </Section>

        <Section title="Format">
          <Segmented label="Aspect ratio" value={p.aspect} onChange={(v) => set("aspect", v)}
            options={ASPECTS.map((a) => ({ value: a.id, label: a.label, sub: SUB[a.id] }))} />
          <Segmented label="Resolution" value={p.resolution} onChange={(v) => set("resolution", v)}
            options={RESOLUTIONS.map((r) => ({ value: r.id, label: r.label, sub: RES_PX[r.id] }))} />
        </Section>

        <Section title="Length">
          <Slider label="Duration" value={p.durationSec} min={2} max={10} onChange={(v) => patch({ durationSec: v, autoDuration: false })}
            format={(v) => `${v} s`} />
          <label className={`flex items-center gap-2 text-[12.5px] ${hasNarration ? "text-fg" : "text-dim"}`}>
            <input type="checkbox" className="h-3.5 w-3.5 accent-[#2F5BFF]" disabled={!hasNarration}
              checked={p.autoDuration && hasNarration} onChange={(e) => set("autoDuration", e.target.checked)} />
            Match the voice-over length
          </label>
        </Section>

        <details className="border-b border-line">
          <summary className="flex items-center justify-between px-5 py-4 text-[12.5px] font-semibold">
            Fine-tune
            <span className="num text-[11.5px] font-normal text-dim">{p.steps} steps, {p.strength.toFixed(2)}</span>
          </summary>
          <div className="space-y-4 px-5 pb-5">
            <Slider label="Cinema strength" value={p.strength} min={0.3} max={0.9} step={0.05} onChange={(v) => set("strength", v)}
              format={(v) => v.toFixed(2)} hint="How far the cinema pass restyles the base motion. Higher looks more stylised and less like the motion pass." />
            <Slider label="Cinema steps" value={p.steps} min={8} max={30} onChange={(v) => set("steps", v)}
              hint="More steps add detail and render time, about 8 s per step on the worker." />
            <div>
              <p className="mb-1.5 text-[12.5px] text-mute">Voice engine</p>
              <Segmented label="Voice engine" value={p.ttsEngine} onChange={(v) => set("ttsEngine", v)}
                options={[{ value: "chattts", label: "ChatTTS" }, { value: "kokoro", label: "Kokoro" }]} />
              {(p.voice === "albanian" || p.voice === "anila") && (
                <p className="mt-2 text-[12px] text-dim">Albanian voices always use Edge TTS.</p>
              )}
            </div>
          </div>
        </details>
      </div>

      <div className="shrink-0 border-t border-line p-4">
        <button type="button" className="btn-primary" disabled={busy || !p.prompt.trim()} onClick={onGenerate}>
          {busy ? "Rendering" : "Generate video"}
        </button>
        <p className="num mt-2 text-center text-[11.5px] text-dim">About {mins} min once a worker is running</p>
      </div>
    </aside>
  );
}
