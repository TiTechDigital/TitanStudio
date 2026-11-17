"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ASPECTS, framesFor, randomSeed } from "@/lib/constants";
import type { GenStatus, HistoryItem, StudioParams, TitanResult } from "@/lib/types";
import { useToasts } from "./useToasts";

/**
 * Talks to RunPod Serverless through the Next.js proxy at /api/titan, which forwards to
 *   https://api.runpod.ai/v2/{ENDPOINT_ID}/runsync   (and /status/{id} for long jobs)
 * so the API key never reaches the browser.
 *
 * NOTE: `stage` is a client-side *estimate* (runsync is a single blocking call and does not
 * stream stage events). If your worker streams progress, swap the timer for real status data.
 */

const ETA_MS: Record<StudioParams["model"], number> = { turbo: 20_000, ultra: 120_000, hybrid: 60_000 };
const POLL_MS = 3000;
const MAX_WAIT_MS = 15 * 60_000;

export function buildPayload(p: StudioParams) {
  const asp = ASPECTS.find((a) => a.id === p.aspect)!;
  return {
    input: {
      prompt: p.prompt.trim(),
      negative_prompt: p.negativePrompt.trim(),
      model: p.model,
      duration_sec: p.durationSec,
      num_frames: framesFor(p.durationSec),
      fps: p.fps,
      aspect_ratio: p.aspect,
      width: asp.w,
      height: asp.h,
      motion_intensity: p.motion,
      upscale_4k: p.upscale4k,
      guidance_scale: p.guidance,
      num_inference_steps: p.steps,
      seed: p.seed,
      audio: {
        script: p.narration.trim(),
        voice: p.voice,
        rate_percent: p.speechRate,
        pitch_hz: p.pitch,
        bgm: p.bgm,
        bgm_volume: p.bgmVolume / 100,
        auto_duck_db: p.autoDuck ? -18 : 0,
      },
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseOutput(out: any, seed: number, elapsedMs: number): TitanResult {
  const o = out?.output ?? out;
  if (o?.error) throw new Error(String(o.error));
  const toUrl = (v?: string) => (v && !v.startsWith("http") && !v.startsWith("data:") ? `data:video/mp4;base64,${v}` : v);
  const videoUrl = toUrl(o?.video_url ?? o?.video_4k_url ?? o?.video ?? o?.video_base64);
  if (!videoUrl) throw new Error("Worker returned no video in `output`");
  return {
    videoUrl,
    rawUrl: toUrl(o?.raw_video_url ?? o?.preview_url),
    url4k: toUrl(o?.video_4k_url),
    seed: typeof o?.seed === "number" ? o.seed : seed,
    elapsedMs,
  };
}

async function http(url: string, init?: RequestInit, signal?: AbortSignal) {
  const r = await fetch(url, { ...init, signal });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data?.error || data?.message || `HTTP ${r.status}`);
  return data;
}

export function useTitanAPI() {
  const { push } = useToasts();
  const [status, setStatus] = useState<GenStatus>("idle");
  const [stage, setStage] = useState(0); // 0..3
  const [progress, setProgress] = useState(0); // 0..100 (estimated)
  const [result, setResult] = useState<TitanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const abort = useRef<AbortController | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  };
  useEffect(() => () => { stopTimer(); abort.current?.abort(); }, []);

  const generate = useCallback(
    async (params: StudioParams) => {
      if (!params.prompt.trim()) {
        push({ kind: "error", title: "Prompt required", message: "Describe your shot first." });
        return;
      }
      abort.current?.abort();
      const ac = new AbortController();
      abort.current = ac;
      const seed = params.lockSeed ? params.seed : randomSeed();
      const eta = ETA_MS[params.model];
      const t0 = Date.now();

      setStatus("generating");
      setError(null);
      setResult(null);
      setStage(0);
      setProgress(2);
      stopTimer();
      timer.current = setInterval(() => {
        const pct = Math.min(95, ((Date.now() - t0) / eta) * 95);
        setProgress(pct);
        setStage(Math.min(3, Math.floor(pct / 24)));
      }, 400);

      try {
        const payload = buildPayload({ ...params, seed });
        let res = await http("/api/titan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }, ac.signal);

        // runsync may hand back an in-flight job; poll /status/{id}
        while (res.status === "IN_QUEUE" || res.status === "IN_PROGRESS") {
          if (Date.now() - t0 > MAX_WAIT_MS) throw new Error("Generation timed out");
          await new Promise((r) => setTimeout(r, POLL_MS));
          res = await http(`/api/titan?id=${encodeURIComponent(res.id)}`, undefined, ac.signal);
        }
        if (res.status === "FAILED" || res.status === "CANCELLED" || res.status === "TIMED_OUT") {
          throw new Error(res.error || `Job ${String(res.status).toLowerCase()}`);
        }

        const parsed = parseOutput(res, seed, Date.now() - t0);
        stopTimer();
        setProgress(100);
        setStage(3);
        const id = Date.now();
        setHistory((h) => [{ id, prompt: params.prompt.trim(), aspect: params.aspect, result: parsed }, ...h].slice(0, 12));
        setActiveId(id);
        setResult(parsed);
        setStatus("completed");
        push({ kind: "success", title: "Render complete", message: `Finished in ${(parsed.elapsedMs / 1000).toFixed(1)}s` });
      } catch (e) {
        stopTimer();
        if (ac.signal.aborted) return;
        const msg = e instanceof Error ? e.message : "Unknown error";
        setError(msg);
        setStatus("error");
        push({ kind: "error", title: "Generation failed", message: msg });
      }
    },
    [push]
  );

  const cancel = useCallback(() => {
    abort.current?.abort();
    stopTimer();
    setStatus("idle");
    setProgress(0);
    push({ kind: "info", title: "Generation cancelled" });
  }, [push]);

  const exportGif = useCallback(async () => {
    if (!result) return;
    try {
      push({ kind: "info", title: "Exporting GIF…" });
      const res = await http("/api/titan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: { action: "export_gif", video_url: result.videoUrl } }),
      });
      const o = res?.output ?? res;
      const url = o?.gif_url ?? (o?.gif_base64 ? `data:image/gif;base64,${o.gif_base64}` : null);
      if (!url) throw new Error("Worker did not return a GIF (add an `export_gif` action to your handler)");
      const a = document.createElement("a");
      a.href = url;
      a.download = "titan-v1.gif";
      a.click();
      push({ kind: "success", title: "GIF exported" });
    } catch (e) {
      push({ kind: "error", title: "GIF export failed", message: e instanceof Error ? e.message : undefined });
    }
  }, [result, push]);

  const show = useCallback((item: HistoryItem) => {
    abort.current?.abort(); stopTimer();
    setError(null); setResult(item.result); setActiveId(item.id); setStatus("completed");
  }, []);

  const reset = useCallback(() => {
    setStatus("idle"); setResult(null); setError(null); setProgress(0); setStage(0);
  }, []);

  return { status, stage, progress, result, error, history, activeId, show, generate, cancel, exportGif, reset };
}
