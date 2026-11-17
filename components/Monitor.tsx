"use client";
import { Download, RotateCcw, X } from "lucide-react";
import { ASPECTS, STAGES } from "@/lib/constants";
import type { GenStatus, StudioParams, TitanResult } from "@/lib/types";

interface Props {
  p: StudioParams;
  status: GenStatus;
  stage: number;
  elapsedMs: number;
  result: TitanResult | null;
  error: string | null;
  onRetry: () => void;
  onCancel: () => void;
  onRetake: () => void;
  className?: string;
}

const clock = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

// SMPTE test pattern: what a real monitor shows with no signal.
const BARS = [
  "linear-gradient(to right,#c0c0c0 0 14.28%,#c0c000 0 28.57%,#00c0c0 0 42.85%,#00c000 0 57.14%,#c000c0 0 71.43%,#c00000 0 85.71%,#0000c0 0 100%) top/100% 68% no-repeat",
  "linear-gradient(to right,#0000c0 0 14.28%,#131313 0 28.57%,#c000c0 0 42.85%,#131313 0 57.14%,#00c0c0 0 71.43%,#131313 0 85.71%,#c0c0c0 0 100%) 0 74%/100% 8% no-repeat",
  "#0a0a0a",
].join(",");

export function Monitor({ p, status, stage, elapsedMs, result, error, onRetry, onCancel, onRetake, className = "" }: Props) {
  const ratio = ASPECTS.find((a) => a.id === p.aspect)!.ratio;
  const frame = {
    aspectRatio: String(ratio),
    maxHeight: "100%",
    maxWidth: "100%",
    ...(ratio < 1 ? { height: "100%" } : { width: "100%" }),
  } as const;
  const busy = status === "queued" || status === "generating";

  return (
    <section aria-label="Monitor" className={`flex min-h-0 flex-col ${className}`}>
      <div className="flex min-h-0 flex-1 items-center justify-center p-6">
        <div style={frame} className="relative overflow-hidden rounded-sm border border-line-strong bg-black">
          {status === "idle" && (
            <>
              <div className="absolute inset-0 opacity-40 saturate-[.7]" style={{ background: BARS }} aria-hidden />
              <div className="absolute inset-0 grid place-items-center p-4">
                <div className="max-w-[260px] bg-night/95 px-5 py-4 text-center">
                  <p className="text-[15px] font-semibold">No signal</p>
                  <p className="mt-1 text-[12.5px] text-mute">Write a prompt on the left, then press Generate video.</p>
                </div>
              </div>
            </>
          )}

          {status === "completed" && result && (
            <video key={result.videoUrl} src={result.videoUrl} controls autoPlay loop playsInline className="h-full w-full bg-black object-contain" />
          )}

          {busy && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-night p-6 text-center">
              <span className="flex items-center gap-2 text-[12.5px] text-mute">
                <span className="h-2 w-2 animate-tally rounded-full bg-tally" />
                {status === "queued" ? "Queued" : "Rendering"}
              </span>
              <p className="num text-[44px] font-medium leading-none text-fg">{clock(elapsedMs)}</p>
              <div>
                <p className="text-[14px] font-medium">{status === "queued" ? "Waiting for a GPU worker" : STAGES[stage].label}</p>
                <p className="mx-auto mt-1 max-w-[230px] text-[12px] text-mute">
                  {status === "queued" ? "A cold start can take a few minutes." : "The stage is an estimate based on your settings."}
                </p>
              </div>
              <button type="button" onClick={onCancel} className="btn"><X size={14} /> Cancel render</button>
            </div>
          )}

          {status === "error" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-night p-6 text-center">
              <p className="text-[15px] font-semibold text-danger">Render failed</p>
              <p className="max-w-[300px] break-words text-[12.5px] text-mute">{error}</p>
              <button type="button" onClick={onRetry} className="btn"><RotateCcw size={14} /> Retry</button>
            </div>
          )}
        </div>
      </div>

      <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-t border-line px-5">
        {status === "completed" && result ? (
          <>
            <p className="num truncate text-[12.5px] text-mute">
              {[result.resolution, result.duration && `${result.duration} s`, `rendered in ${clock(result.elapsedMs)}`].filter(Boolean).join("   ")}
            </p>
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={onRetake} className="btn"><RotateCcw size={14} /> Make another take</button>
              <a href={result.videoUrl} download={`titan-${Date.now()}.mp4`} className="btn border-cobalt bg-cobalt text-white hover:bg-cobalt-hover">
                <Download size={14} /> Download
              </a>
            </div>
          </>
        ) : (
          <p className="text-[12.5px] text-dim">{p.aspect} frame</p>
        )}
      </div>
      {status === "completed" && result?.wanUsed === false && (
        <p className="border-t border-line bg-raised px-5 py-2 text-[12.5px] text-tally">
          The cinema pass failed on the worker. This clip is the base motion only.
        </p>
      )}
    </section>
  );
}
