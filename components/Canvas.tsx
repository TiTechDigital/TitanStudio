"use client";
import { AlertTriangle, Download, RotateCcw, Sparkles, X } from "lucide-react";
import { ASPECTS, EXAMPLES, STAGES } from "@/lib/constants";
import type { AspectId, GenStatus, StudioParams, TitanResult } from "@/lib/types";

interface Props {
  p: StudioParams;
  status: GenStatus;
  stage: number;
  progress: number;
  elapsedMs: number;
  etaMs: number;
  result: TitanResult | null;
  error: string | null;
  onRetry: () => void;
  onCancel: () => void;
  onPick: (prompt: string, aspect: AspectId) => void;
}

const fmt = (ms: number) => {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

export function Canvas({ p, status, stage, progress, elapsedMs, etaMs, result, error, onRetry, onCancel, onPick }: Props) {
  const ratio = ASPECTS.find((a) => a.id === p.aspect)!.ratio;
  const busy = status === "queued" || status === "generating";
  const frame = {
    aspectRatio: String(ratio),
    maxHeight: "100%",
    maxWidth: "100%",
    ...(ratio < 1 ? { height: "100%" } : { width: "100%" }),
  } as const;

  if (status === "idle") {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto px-5 py-8">
        <div className="animate-rise text-center">
          <h1 className="font-display text-[clamp(30px,5vw,54px)] font-bold leading-[1.05] tracking-tight">
            Direct your next shot<span className="text-accent">.</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[14px] text-mute">
            One prompt in. Cinematic video, voice-over and music out. Pick a starting point or write your own below.
          </p>
        </div>
        <div className="mt-8 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
          {EXAMPLES.map((e, i) => (
            <button
              key={e.title} type="button" onClick={() => onPick(e.prompt, e.aspect)}
              style={{ animationDelay: `${120 + i * 70}ms` }}
              className={`group relative animate-rise overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${e.hue} to-ink-900 p-3.5 text-left transition hover:border-accent/60 hover:shadow-[0_0_32px_-8px_rgba(59,130,255,.8)] ${e.aspect === "9:16" ? "aspect-[3/4]" : "aspect-[4/3]"} sm:aspect-[3/4]`}
            >
              <span className="absolute right-3 top-3 rounded-full bg-black/30 px-2 py-0.5 font-mono text-[10px] text-white/70 backdrop-blur">{e.aspect}</span>
              <span className="absolute inset-x-3.5 bottom-3.5">
                <span className="block text-[13px] font-semibold">{e.title}</span>
                <span className="mt-1 line-clamp-3 block text-[11px] leading-snug text-white/60">{e.prompt}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 items-center justify-center p-4">
      <div style={frame} className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-900 shadow-[0_30px_120px_-30px_rgba(59,130,255,.5)]">
        {status === "completed" && result && (
          <>
            {/* key forces a fresh element when switching history items */}
            <video key={result.videoUrl} src={result.videoUrl} controls autoPlay loop playsInline className="h-full w-full bg-black object-contain" />
            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 bg-gradient-to-b from-black/60 to-transparent p-3">
              <span className="rounded-full bg-black/40 px-2.5 py-1 font-mono text-[10.5px] text-white/80 backdrop-blur">
                {[result.resolution, result.duration && `${result.duration}s`, result.voiceUsed && result.voiceUsed !== "none" && result.voiceUsed].filter(Boolean).join(" · ")}
              </span>
              <a
                href={result.videoUrl} download={`titan-${Date.now()}.mp4`}
                className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-accent/30 transition hover:brightness-110"
              >
                <Download size={13} /> Download
              </a>
            </div>
            {result.wanUsed === false && (
              <div className="absolute inset-x-3 bottom-14 rounded-xl border border-amber-400/30 bg-amber-950/70 p-2.5 text-[11.5px] text-amber-200 backdrop-blur">
                Cinema pass (Wan) failed on the worker, this clip is the base motion pass only.
              </div>
            )}
          </>
        )}

        {busy && (
          <div className="grain absolute inset-0 flex flex-col items-center justify-center gap-6 bg-gradient-to-b from-ink-800 to-ink-950 p-6 text-center">
            <div className="relative grid h-24 w-24 place-items-center">
              <span className="absolute inset-0 animate-breathe rounded-full bg-accent/25 blur-2xl" />
              <span className="absolute inset-0 animate-spinSlow rounded-full border-2 border-transparent border-t-accent border-r-accent/40" />
              <Sparkles className="text-accent-soft" size={26} />
            </div>

            <div>
              <p className="font-display text-lg font-semibold">
                {status === "queued" ? "Waiting for a GPU worker" : STAGES[stage].label}
              </p>
              <p className="mx-auto mt-1 max-w-[260px] text-[12px] text-mute">
                {status === "queued"
                  ? "Cold starts can take a few minutes while the worker boots."
                  : "Stage shown is an estimate based on your settings."}
              </p>
            </div>

            <div className="w-full max-w-[280px]">
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="relative h-full rounded-full bg-gradient-to-r from-accent-deep to-accent-glow transition-[width] duration-500" style={{ width: `${status === "queued" ? 4 : progress}%` }}>
                  <span className="absolute inset-y-0 w-1/3 animate-sweep bg-white/40 blur-sm" />
                </div>
              </div>
              <div className="mt-2 flex justify-between font-mono text-[11px] text-mute">
                <span>{fmt(elapsedMs)} elapsed</span>
                <span>~{fmt(etaMs)} after start</span>
              </div>
            </div>

            <button type="button" onClick={onCancel} className="btn-ghost"><X size={14} /> Cancel</button>
          </div>
        )}

        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink-900 p-6 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-danger/15 text-danger"><AlertTriangle size={22} /></span>
            <div>
              <p className="font-display text-lg font-semibold">Render failed</p>
              <p className="mx-auto mt-1 max-w-sm break-words text-[12.5px] text-mute">{error}</p>
            </div>
            <button type="button" onClick={onRetry} className="btn-ghost"><RotateCcw size={14} /> Try again</button>
          </div>
        )}
      </div>
    </div>
  );
}
