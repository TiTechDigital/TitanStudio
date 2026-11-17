"use client";
import { BGM_TRACKS, MODELS, STAGES, VOICE_CATALOG, resLabel } from "@/lib/constants";
import type { GenStatus, HistoryItem, StudioProps, TitanResult } from "@/lib/types";

interface Props extends StudioProps {
  status: GenStatus;
  stage: number;
  parts: Record<string, number>;
  result: TitanResult | null;
  history: HistoryItem[];
  activeId: number | null;
  onSelect: (i: HistoryItem) => void;
  className?: string;
}

const Lane = ({ label, sub, children }: { label: React.ReactNode; sub?: React.ReactNode; children: React.ReactNode }) => (
  <div className="grid grid-cols-1 border-b border-line last:border-b-0 sm:grid-cols-[150px_minmax(0,1fr)]">
    <div className="px-5 pt-3 sm:py-3">
      <div className="text-[12.5px] font-semibold">{label}</div>
      {sub}
    </div>
    <div className="px-5 py-3 sm:pl-0">{children}</div>
  </div>
);

export function Timeline({ p, set, status, stage, parts, result, history, activeId, onSelect, className = "" }: Props) {
  const model = MODELS.find((m) => m.id === p.model)!;
  const busy = status === "queued" || status === "generating";

  const words = p.narration.trim() ? p.narration.trim().split(/\s+/).length : 0;
  const voiceSec = words / 2.5;
  const clipSec = p.autoDuration ? voiceSec : p.durationSec;
  const overrun = words > 0 && voiceSec > clipSec + 0.3;
  const voice = VOICE_CATALOG.flatMap((g) => g.voices).find((v) => v.id === p.voice);

  const total = STAGES.reduce((a, s) => a + (parts[s.key] ?? 0), 0) || 1;
  const segs = STAGES.map((s) => ({ ...s, w: parts[s.key] ?? 0 })).filter((s) => s.w > 0);

  return (
    <section aria-label="Timeline" className={`border-t border-line ${className}`}>
      <Lane label="Video" sub={<p className="num text-[11.5px] text-dim">{p.autoDuration && words ? "auto" : `${p.durationSec} s`}, {p.aspect}</p>}>
        {busy ? (
          <div>
            <div className="flex gap-0.5" role="progressbar" aria-label="Render stages (estimated)">
              {segs.map((s) => {
                const i = STAGES.findIndex((x) => x.key === s.key);
                const cls = status === "queued" ? "bg-line-strong" : i < stage ? "bg-cobalt" : i === stage ? "bg-tally" : "bg-line-strong";
                return <span key={s.key} style={{ flexGrow: s.w / total }} className={`h-2 basis-0 ${cls}`} />;
              })}
            </div>
            <div className="mt-1.5 flex gap-0.5 text-[11.5px]">
              {segs.map((s) => {
                const i = STAGES.findIndex((x) => x.key === s.key);
                return (
                  <span key={s.key} style={{ flexGrow: s.w / total }}
                    className={`basis-0 truncate ${i === stage && status === "generating" ? "text-fg" : "hidden text-dim sm:block"}`}>
                    {s.label}
                  </span>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-[12.5px] text-mute">
            {model.name} quality, {resLabel(p.resolution)}, {p.steps} cinema steps at strength {p.strength.toFixed(2)}
            {result && status === "completed" ? "" : ""}
          </p>
        )}
      </Lane>

      <Lane
        label="Voice"
        sub={
          <select aria-label="Voice" value={p.voice} onChange={(e) => set("voice", e.target.value)} className="field mt-2 py-1.5 text-[12.5px]">
            {VOICE_CATALOG.map((g) => (
              <optgroup key={g.group} label={g.group}>
                {g.voices.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
              </optgroup>
            ))}
          </select>
        }
      >
        <textarea
          value={p.narration} rows={2} aria-label="Voice-over script" onChange={(e) => set("narration", e.target.value)}
          placeholder="Voice-over script. Leave empty for a clip without voice." className="field resize-none leading-relaxed"
        />
        <div className="mt-2 flex items-center gap-3">
          <div className="relative h-1 flex-1 bg-line-strong" aria-hidden>
            <span className={`absolute inset-y-0 left-0 ${overrun ? "bg-tally" : "bg-cobalt"}`}
              style={{ width: `${words ? Math.min(100, (voiceSec / Math.max(clipSec, 0.1)) * 100) : 0}%` }} />
          </div>
          <span className={`num shrink-0 text-[11.5px] ${overrun ? "text-tally" : "text-dim"}`}>
            {words ? `about ${voiceSec.toFixed(1)} s of ${clipSec.toFixed(0)} s` : voice?.note}
          </span>
        </div>
        {overrun && <p className="mt-1.5 text-[12px] text-tally">The voice runs longer than the clip, so the last frame is held until it ends.</p>}
      </Lane>

      <Lane label="Music" sub={<p className="text-[11.5px] text-dim">Adds about 25 s</p>}>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Music track">
          {BGM_TRACKS.map((t) => (
            <button key={t.id} type="button" aria-pressed={p.music === t.id} onClick={() => set("music", t.id)}
              className={`rounded border px-2.5 py-1.5 text-[12.5px] transition-colors ${
                p.music === t.id ? "border-cobalt bg-cobalt text-white" : "border-line-strong text-mute hover:border-dim hover:text-fg"
              }`}>
              {t.name}
            </button>
          ))}
        </div>
      </Lane>

      <Lane label="Takes" sub={<p className="num text-[11.5px] text-dim">{history.length} this session</p>}>
        {history.length === 0 ? (
          <p className="text-[12.5px] text-dim">Finished videos appear here. They are cleared when you refresh the page.</p>
        ) : (
          <div className="flex gap-2 overflow-x-auto pb-1" role="list">
            {history.map((it, i) => (
              <button key={it.id} type="button" role="listitem" onClick={() => onSelect(it)} title={it.prompt}
                className={`shrink-0 text-left ${it.id === activeId ? "" : "opacity-60 hover:opacity-100"}`}>
                <video src={`${it.result.videoUrl}#t=0.1`} muted preload="metadata" playsInline
                  className={`h-14 border bg-black object-cover ${it.aspect === "9:16" ? "w-8" : "w-24"} ${it.id === activeId ? "border-cobalt" : "border-line-strong"}`} />
                <span className="num mt-1 block text-[11px] text-dim">Take {history.length - i}</span>
              </button>
            ))}
          </div>
        )}
      </Lane>
    </section>
  );
}
