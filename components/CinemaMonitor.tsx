"use client";
import { useState } from "react";
import { AlertTriangle, Copy, Download, ImageDown, RefreshCw } from "lucide-react";
import { ASPECTS } from "@/lib/constants";
import type { GenStatus, StudioParams, TitanResult } from "@/lib/types";
import { useToasts } from "@/hooks/useToasts";
import { Hero } from "./Hero";
import { CompareSlider } from "./CompareSlider";
import { PipelineTelemetry } from "./PipelineTelemetry";
import { VideoPlayer } from "./VideoPlayer";
import { Segmented } from "./ui/Controls";

interface Props {
  p: StudioParams;
  status: GenStatus;
  stage: number;
  progress: number;
  result: TitanResult | null;
  error: string | null;
  onReroll: () => void;
  onExportGif: () => void;
  onRetry: () => void;
  onPick: (prompt: string, aspect: StudioParams["aspect"]) => void;
}

export function CinemaMonitor({ p, status, stage, progress, result, error, onReroll, onExportGif, onRetry, onPick }: Props) {
  const { push } = useToasts();
  const [tab, setTab] = useState<"player" | "compare">("player");
  const aspect = ASPECTS.find((a) => a.id === p.aspect)!;
  const canCompare = !!result?.rawUrl && !!(result.url4k ?? result.videoUrl);
  const finalUrl = result?.url4k ?? result?.videoUrl;
  const idle = status === "idle";
  const done = status === "completed" && !!result && !!finalUrl;

  const copyUrl = async () => {
    if (!finalUrl) return;
    if (finalUrl.startsWith("data:")) return push({ kind: "info", title: "No shareable link", message: "The worker returned the video inline. Return a hosted video_url to enable sharing." });
    try {
      await navigator.clipboard.writeText(finalUrl);
      push({ kind: "success", title: "Link copied" });
    } catch {
      push({ kind: "error", title: "Could not copy", message: "Clipboard access is blocked in this browser." });
    }
  };

  return (
    <section className="flex min-h-0 flex-1 flex-col">
      <div className={`flex h-12 shrink-0 items-center justify-between gap-4 px-5 ${idle ? "hidden" : ""}`}>
        <p className="truncate font-mono text-[11.5px] text-mute">
          {done ? `Seed ${result!.seed}  ·  ${p.fps} fps  ·  ${p.aspect}  ·  ${(result!.elapsedMs / 1000).toFixed(1)}s` : `${aspect.label}  ·  ${aspect.w}×${aspect.h}`}
        </p>
        {done && canCompare && (
          <div className="w-56">
            <Segmented label="View" value={tab} onChange={setTab} options={[{ value: "player", label: "Result" }, { value: "compare", label: "Compare" }]} />
          </div>
        )}
      </div>

      {idle ? (
        <div className="relative grid min-h-[420px] flex-1 place-items-center overflow-y-auto py-6">
          <Hero onPick={onPick} />
        </div>
      ) : (
      <div className="relative grid min-h-[280px] flex-1 place-items-center px-5 pb-3 [--stage-h:56vh] lg:[--stage-h:max(240px,calc(100vh_-_430px))]">
        {status === "generating" && <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[55%] w-[55%] -translate-x-1/2 -translate-y-1/2 animate-drift rounded-full bg-lime/20 blur-[110px]" />}
        <div
          className="grain relative flex items-center justify-center overflow-hidden rounded-2xl bg-black shadow-[0_30px_90px_-20px_rgba(0,0,0,.9)] ring-1 ring-white/10"
          style={{ aspectRatio: aspect.ratio, width: `min(100%, calc(var(--stage-h) * ${aspect.ratio}))` }}
        >
          {done ? (
            tab === "compare" && canCompare ? <CompareSlider before={result!.rawUrl!} after={finalUrl!} /> : <VideoPlayer src={finalUrl!} fps={p.fps} />
          ) : status === "generating" ? (
            <PipelineTelemetry status={status} stage={stage} progress={progress} upscale={p.upscale4k} />
          ) : (
            <div className="flex max-w-sm flex-col items-center gap-3 px-6 text-center">
              <AlertTriangle className="text-danger" size={22} />
              <p className="text-[14px] font-semibold text-fg">Generation failed</p>
              <p className="break-words text-[12.5px] text-mute">{error}</p>
              <button className="btn-ghost mt-1" onClick={onRetry}><RefreshCw size={13} />Try again</button>
            </div>
          )}
        </div>
      </div>
      )}

      <div className={`flex h-14 shrink-0 items-center justify-center gap-2 px-5 ${idle ? "hidden" : ""}`}>
        <a
          className={`btn-ghost ${!done ? "pointer-events-none opacity-40" : ""}`}
          href={finalUrl} download="titan-v1.mp4" aria-disabled={!done}
        ><Download size={14} /><span className="hidden sm:inline">Download{p.upscale4k ? " 4K" : ""}</span></a>
        <button className="btn-ghost" disabled={!done} onClick={copyUrl}><Copy size={14} /><span className="hidden sm:inline">Copy link</span></button>
        <button className="btn-ghost" disabled={!done} onClick={onExportGif}><ImageDown size={14} /><span className="hidden sm:inline">GIF</span></button>
        <button className="btn-ghost" disabled={status === "generating" || status === "idle"} onClick={onReroll} title="Run again with the same seed">
          <RefreshCw size={14} /><span className="hidden sm:inline">Rerun</span>
        </button>
      </div>
    </section>
  );
}
