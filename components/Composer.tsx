"use client";
import { useEffect, useRef } from "react";
import { Loader2, Square, Wand2 } from "lucide-react";
import { ASPECTS, DIRECTOR_PILLS, DURATIONS, FPS_OPTIONS, MODELS } from "@/lib/constants";
import type { StudioProps } from "@/lib/types";
import { Menu, MenuItem } from "./ui/Controls";

interface Props extends StudioProps {
  generating: boolean;
  onGenerate: () => void;
  onCancel: () => void;
}

function RatioGlyph({ ratio }: { ratio: number }) {
  const w = ratio >= 1 ? 14 : 14 * ratio;
  const h = ratio >= 1 ? 14 / ratio : 14;
  return <span className="block rounded-[2px] border border-current" style={{ width: w, height: h }} aria-hidden />;
}

export function Composer({ p, set, generating, onGenerate, onCancel }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const model = MODELS.find((m) => m.id === p.model)!;
  const aspect = ASPECTS.find((a) => a.id === p.aspect)!;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 168)}px`;
  }, [p.prompt]);

  const toggleStyle = (text: string) => {
    const has = p.prompt.toLowerCase().includes(text.toLowerCase());
    if (has) {
      const re = new RegExp(`,?\\s*${text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i");
      set("prompt", p.prompt.replace(re, "").replace(/^\s*,\s*/, "").trim());
      return;
    }
    const base = p.prompt.trimEnd();
    set("prompt", base ? `${base}${/[.,]$/.test(base) ? "" : ","} ${text}` : text);
  };

  const canSubmit = p.prompt.trim().length > 0;

  return (
    <div className="relative z-10 shrink-0 px-5 pb-5 pt-1">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/[0.05] p-4 shadow-[0_20px_60px_-20px_rgba(0,0,0,.9)] backdrop-blur-xl transition focus-within:border-lime/40">
        <textarea
          ref={ref} rows={2} value={p.prompt}
          onChange={(e) => set("prompt", e.target.value)}
          onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && canSubmit && !generating) onGenerate(); }}
          placeholder="Describe the shot: subject, camera movement, light. Ctrl+Enter to generate."
          aria-label="Prompt"
          className="block w-full resize-none bg-transparent px-1 text-[15px] leading-relaxed text-fg outline-none placeholder:text-dim"
        />

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <Menu label="Model" width="w-72" trigger={<span>{model.name}</span>}>
            {(close) => MODELS.map((m) => (
              <MenuItem key={m.id} active={p.model === m.id} title={m.name} sub={m.desc} right={<span className="font-mono text-[11px]">{m.tag}</span>}
                onClick={() => { set("model", m.id); close(); }} />
            ))}
          </Menu>

          <Menu label="Duration" width="w-44" trigger={<span>{p.durationSec}s</span>}>
            {(close) => DURATIONS.map((d) => (
              <MenuItem key={d.sec} active={p.durationSec === d.sec} title={`${d.sec} seconds`} sub={`${d.frames} frames`}
                onClick={() => { set("durationSec", d.sec); close(); }} />
            ))}
          </Menu>

          <Menu label="Aspect ratio" width="w-60" trigger={<><RatioGlyph ratio={aspect.ratio} /><span>{aspect.label}</span></>}>
            {(close) => ASPECTS.map((a) => (
              <MenuItem key={a.id} active={p.aspect === a.id} title={a.label} sub={a.sub} right={<RatioGlyph ratio={a.ratio} />}
                onClick={() => { set("aspect", a.id); close(); }} />
            ))}
          </Menu>

          <Menu label="Frame rate" width="w-44" trigger={<span>{p.fps} fps</span>}>
            {(close) => FPS_OPTIONS.map((f) => (
              <MenuItem key={f.fps} active={p.fps === f.fps} title={`${f.fps} fps`} sub={f.sub}
                onClick={() => { set("fps", f.fps); close(); }} />
            ))}
          </Menu>

          <Menu label="Camera and style presets" width="w-72" trigger={<><Wand2 size={13} /><span>Camera & style</span></>}>
            {() => Object.entries(DIRECTOR_PILLS).map(([group, pills]) => (
              <div key={group} className="pb-1">
                <p className="px-2.5 pb-1 pt-2 text-[11px] text-dim">{group}</p>
                {pills.map((pill) => (
                  <MenuItem key={pill.label} title={pill.label} active={p.prompt.toLowerCase().includes(pill.text.toLowerCase())}
                    onClick={() => toggleStyle(pill.text)} />
                ))}
              </div>
            ))}
          </Menu>

          <div className="ml-auto flex items-center gap-2">
            {generating && (
              <button type="button" className="btn-ghost !h-10 !w-10 !px-0" onClick={onCancel} aria-label="Cancel generation">
                <Square size={13} fill="currentColor" />
              </button>
            )}
            <button type="button" className="btn-primary" disabled={generating || !canSubmit} onClick={onGenerate}>
              {generating ? <><Loader2 size={15} className="animate-spin" />Generating</> : "Generate"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
