import type { AspectId, ModelId, StudioParams } from "./types";

export const DIRECTOR_PILLS = {
  "Camera Movements": [
    { emoji: "🚁", label: "High Drone Flyover", text: "high aerial drone flyover shot" },
    { emoji: "🎥", label: "Dolly Push-In", text: "slow cinematic dolly push-in" },
    { emoji: "🏎️", label: "Tracking Shot", text: "fast smooth tracking shot following the subject" },
    { emoji: "🔄", label: "360° Orbit", text: "360-degree orbit around the subject" },
    { emoji: "🔍", label: "Macro Zoom", text: "extreme macro zoom, shallow depth of field" },
  ],
  "Lighting & Style": [
    { emoji: "🌅", label: "Golden Hour Sunlight", text: "golden hour sunlight, warm rim light" },
    { emoji: "🌧️", label: "Cyberpunk Neon Rain", text: "cyberpunk neon rain, wet reflective streets" },
    { emoji: "🎞️", label: "35mm Film Grain", text: "shot on 35mm film, organic film grain" },
    { emoji: "🕯️", label: "Moody Film Noir", text: "moody film noir, hard shadows, low-key lighting" },
  ],
} as const;

export const MODELS: { id: ModelId; name: string; tag: string; desc: string }[] = [
  { id: "turbo", name: "TITAN V1 Turbo", tag: "~18–20s", desc: "Ultra-fast preview" },
  { id: "ultra", name: "TITAN V1 Ultra Cinema", tag: "14B DUAL", desc: "Photorealistic 14B Dual-Engine masterpiece" },
  { id: "hybrid", name: "TITAN V1 Hybrid Motion Mix", tag: "HYBRID", desc: "Blended motion-priority pipeline" },
];

export const DURATIONS: { sec: StudioParams["durationSec"]; frames: number }[] = [
  { sec: 2, frames: 49 },
  { sec: 4, frames: 97 },
  { sec: 6, frames: 145 },
  { sec: 8, frames: 193 },
  { sec: 10, frames: 241 },
];

export const ASPECTS: { id: AspectId; label: string; sub: string; w: number; h: number; ratio: number }[] = [
  { id: "9:16", label: "9:16", sub: "TikTok · Reels · Shorts", w: 720, h: 1280, ratio: 9 / 16 },
  { id: "16:9", label: "16:9", sub: "Cinema · YouTube", w: 1280, h: 720, ratio: 16 / 9 },
  { id: "1:1", label: "1:1", sub: "Square", w: 1024, h: 1024, ratio: 1 },
  { id: "2.39:1", label: "2.39:1", sub: "Anamorphic", w: 1280, h: 536, ratio: 2.39 },
];

export const FPS_OPTIONS: { fps: 24 | 30 | 60; sub: string }[] = [
  { fps: 24, sub: "Cinematic" },
  { fps: 30, sub: "Standard" },
  { fps: 60, sub: "Fluid" },
];

export interface Voice { id: string; name: string; note?: string }
export const VOICE_CATALOG: { group: string; voices: Voice[] }[] = [
  {
    group: "Hollywood Movie Trailer & Deep Baritone",
    voices: ["Adam", "Michael", "Fenrir", "Onyx", "Echo", "Liam", "Daniel", "Brian", "Bill", "Callum"].map(
      (n) => ({ id: n.toLowerCase(), name: n })
    ),
  },
  {
    group: "Epic Documentary & British Storyteller",
    voices: ["George", "Fable", "Harry", "Oliver", "Arthur", "Alice", "Lily", "Charlotte"].map((n) => ({
      id: n.toLowerCase(),
      name: n,
    })),
  },
  {
    group: "Cinematic Female & Warm Narrators",
    voices: ["Bella", "Sarah", "Emma", "Nicole", "Jessica", "Aria", "Nova", "Shimmer", "Matilda", "Rachel", "Domi", "Elli"].map(
      (n) => ({ id: n.toLowerCase(), name: n })
    ),
  },
  {
    group: "Global Accents · Australian",
    voices: ["Natasha", "William", "Annette", "Darren"].map((n) => ({ id: `au-${n.toLowerCase()}`, name: n })),
  },
  {
    group: "Global Accents · French",
    voices: ["Denise", "Henri", "Eloise", "Remy", "Vivienne"].map((n) => ({ id: `fr-${n.toLowerCase()}`, name: n })),
  },
  {
    group: "Global Accents · Italian",
    voices: ["Isabella", "Diego", "Elsa", "Giuseppe", "Benigno"].map((n) => ({ id: `it-${n.toLowerCase()}`, name: n })),
  },
  {
    group: "Global Accents · Spanish",
    voices: ["Alvaro", "Elvira", "Jorge", "Dalia", "Tomas"].map((n) => ({ id: `es-${n.toLowerCase()}`, name: n })),
  },
  {
    group: "Albanian Cinema Voice",
    voices: [
      { id: "sq-AL-IlirNeural", name: "Ilir Neural", note: "Male" },
      { id: "sq-AL-AnilaNeural", name: "Anila Neural", note: "Female" },
    ],
  },
];

export const BGM_TRACKS = [
  { id: "epic_cinematic_drone", name: "Epic Cinematic Drone" },
  { id: "dark_suspense_cello", name: "Dark Suspense Cello" },
  { id: "cyberpunk_synthwave", name: "Cyberpunk Synthwave" },
  { id: "emotional_piano", name: "Emotional Piano" },
  { id: "none", name: "None" },
];

export const PIPELINE_STAGES = [
  { key: "physics", label: "Physics & Motion Trajectory" },
  { key: "diffusion", label: "Neural Diffusion" },
  { key: "audio", label: "Voice & Audio Mastering" },
  { key: "composite", label: "4K Compositing" },
] as const;

export const DEFAULT_PARAMS: StudioParams = {
  prompt: "",
  negativePrompt: "blurry, low quality, watermark, distorted hands, flicker, jitter",
  model: "turbo",
  durationSec: 4,
  fps: 24,
  aspect: "16:9",
  motion: 5,
  upscale4k: false,
  guidance: 5.5,
  steps: 28,
  seed: 42,
  lockSeed: false,
  narration: "",
  voice: "adam",
  speechRate: 0,
  pitch: 0,
  bgm: "epic_cinematic_drone",
  bgmVolume: 40,
  autoDuck: true,
};

export const framesFor = (sec: number) => sec * 24 + 1;
export const randomSeed = () => Math.floor(Math.random() * 2 ** 31);
