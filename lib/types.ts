export type GenStatus = "idle" | "generating" | "completed" | "error";
export type ModelId = "turbo" | "ultra" | "hybrid";
export type AspectId = "9:16" | "16:9" | "1:1" | "2.39:1";

export interface StudioParams {
  prompt: string;
  negativePrompt: string;
  model: ModelId;
  durationSec: 2 | 4 | 6 | 8 | 10;
  fps: 24 | 30 | 60;
  aspect: AspectId;
  motion: number; // 1..10
  upscale4k: boolean;
  guidance: number; // 1..10
  steps: number; // 12..40
  seed: number;
  lockSeed: boolean;
  narration: string;
  voice: string;
  speechRate: number; // -20..20 (%)
  pitch: number; // -50..50 (Hz)
  bgm: string;
  bgmVolume: number; // 0..100
  autoDuck: boolean;
}

export type SetParam = <K extends keyof StudioParams>(key: K, value: StudioParams[K]) => void;
export interface StudioProps {
  p: StudioParams;
  set: SetParam;
}

export interface TitanResult {
  videoUrl: string;
  rawUrl?: string; // pre-upscale, for compare slider
  url4k?: string;
  seed: number;
  elapsedMs: number;
}

export interface HistoryItem {
  id: number;
  prompt: string;
  aspect: AspectId;
  result: TitanResult;
}

export interface Toast {
  id: number;
  kind: "success" | "error" | "info";
  title: string;
  message?: string;
}
