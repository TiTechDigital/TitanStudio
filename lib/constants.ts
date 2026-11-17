import type { AspectId, ModelId, ResolutionId, StudioParams } from "./types";

export const DIRECTOR_PILLS = {
  "Camera movement": [
    { emoji: "🚁", label: "Drone flyover", text: "high aerial drone flyover shot" },
    { emoji: "🎥", label: "Dolly push-in", text: "slow cinematic dolly push-in" },
    { emoji: "🏎️", label: "Tracking shot", text: "fast smooth tracking shot following the subject" },
    { emoji: "🔄", label: "360° orbit", text: "360-degree orbit around the subject" },
    { emoji: "🔍", label: "Macro zoom", text: "extreme macro zoom, shallow depth of field" },
  ],
  "Light & style": [
    { emoji: "🌅", label: "Golden hour", text: "golden hour sunlight, warm rim light" },
    { emoji: "🌧️", label: "Neon rain", text: "cyberpunk neon rain, wet reflective streets" },
    { emoji: "🎞️", label: "35mm film", text: "shot on 35mm film, organic film grain" },
    { emoji: "🕯️", label: "Film noir", text: "moody film noir, hard shadows, low-key lighting" },
  ],
} as const;

/** Presets drive the worker's Wan 14B pass (`wan_steps`, `wan_strength`). */
export const MODELS: { id: ModelId; name: string; tag: string; desc: string; steps: number; strength: number }[] = [
  { id: "turbo", name: "Turbo", tag: "Fastest", desc: "Quick preview, light cinema pass", steps: 10, strength: 0.45 },
  { id: "cinema", name: "Cinema", tag: "Balanced", desc: "Recommended look and speed", steps: 18, strength: 0.6 },
  { id: "ultra", name: "Ultra", tag: "Best", desc: "Maximum detail, slowest", steps: 28, strength: 0.7 },
];

export const ASPECTS: { id: AspectId; label: string; sub: string; ratio: number }[] = [
  { id: "9:16", label: "9:16", sub: "TikTok · Reels · Shorts", ratio: 9 / 16 },
  { id: "16:9", label: "16:9", sub: "Cinema · YouTube", ratio: 16 / 9 },
];

export const RESOLUTIONS: { id: ResolutionId; label: string; sub: string; enable4k: boolean; true4k: boolean }[] = [
  { id: "draft", label: "Draft", sub: "704p · no upscale", enable4k: false, true4k: false },
  { id: "hd", label: "Full HD", sub: "1080p · Real-ESRGAN", enable4k: true, true4k: false },
  { id: "uhd", label: "4K", sub: "2160p · slowest", enable4k: true, true4k: true },
];

export interface Voice { id: string; name: string; note: string }
/** IDs match the worker's VOICE_MAP / CHATTTS_SEEDS keys. */
export const VOICE_CATALOG: { group: string; voices: Voice[] }[] = [
  {
    group: "Male",
    voices: [
      { id: "adam", name: "Adam", note: "Hollywood deep baritone" },
      { id: "george", name: "George", note: "British documentary" },
      { id: "michael", name: "Michael", note: "Storyteller" },
    ],
  },
  {
    group: "Female",
    voices: [
      { id: "bella", name: "Bella", note: "Cinematic" },
      { id: "sarah", name: "Sarah", note: "Warm" },
    ],
  },
  {
    group: "Albanian",
    voices: [
      { id: "albanian", name: "Ilir", note: "Shqip · male" },
      { id: "anila", name: "Anila", note: "Shqip · female" },
    ],
  },
];

/** `prompt` is sent to the worker as `music_prompt` (MusicGen). `none` sends nothing. */
export const BGM_TRACKS: { id: string; name: string; prompt: string }[] = [
  { id: "none", name: "No music", prompt: "" },
  { id: "epic", name: "Epic cinematic", prompt: "epic cinematic orchestral score, deep drones, powerful drums, trailer music" },
  { id: "suspense", name: "Dark suspense", prompt: "dark suspense cello, tense atmospheric underscore, slow build" },
  { id: "synthwave", name: "Synthwave", prompt: "cyberpunk synthwave, pulsing analog bass, neon night drive" },
  { id: "piano", name: "Emotional piano", prompt: "emotional solo piano, soft, cinematic, melancholic" },
  { id: "ambient", name: "Ambient", prompt: "calm ambient pads, slow evolving texture, spacious" },
];

export const EXAMPLES: { title: string; prompt: string; aspect: AspectId; hue: string }[] = [
  { title: "Neon metropolis", prompt: "aerial drone shot flying over a neon-lit futuristic city at night, rain, reflective streets", aspect: "16:9", hue: "from-blue-600/50 via-indigo-700/30" },
  { title: "Red dunes", prompt: "slow cinematic dolly push-in on a lone astronaut walking across red desert dunes, golden hour", aspect: "16:9", hue: "from-sky-500/40 via-blue-800/30" },
  { title: "Water macro", prompt: "extreme macro of a water droplet splashing in slow motion, shallow depth of field, soft light", aspect: "9:16", hue: "from-cyan-500/40 via-blue-700/30" },
  { title: "Samurai", prompt: "a samurai standing still as cherry blossoms fall around him, shot on 35mm film", aspect: "9:16", hue: "from-indigo-500/40 via-blue-900/30" },
];

export const DEFAULT_PARAMS: StudioParams = {
  prompt: "",
  model: "cinema",
  durationSec: 5,
  autoDuration: false,
  aspect: "9:16",
  resolution: "hd",
  strength: 0.6,
  steps: 18,
  narration: "",
  voice: "adam",
  ttsEngine: "chattts",
  music: "none",
};

export const resLabel = (id: ResolutionId) => RESOLUTIONS.find((r) => r.id === id)!.label;

/**
 * Rough wall-clock estimate in ms, used only for the progress bar.
 * Constants come from worker logs: LTX ~15s, Wan ~8.5s per effective step (steps × strength), ESRGAN ~30s, all per 5s of video.
 */
export function estimateMs(p: StudioParams) {
  const k = (p.autoDuration ? 5 : p.durationSec) / 5;
  const parts = {
    load: 45_000, // model loading inside the job (drops to ~0 once models are preloaded at worker start)
    motion: 15_000 * k,
    cinema: p.steps * p.strength * 8_500 * k,
    upscale: p.resolution === "draft" ? 0 : (p.resolution === "uhd" ? 70_000 : 35_000) * k,
    audio: (p.narration.trim() ? 8_000 : 0) + (p.music !== "none" ? 25_000 : 0) + 10_000,
  };
  const total = Object.values(parts).reduce((a, b) => a + b, 0);
  return { parts, total };
}

export const STAGES = [
  { key: "load", label: "Loading models" },
  { key: "motion", label: "Motion pass · LTX" },
  { key: "cinema", label: "Cinema pass · Wan 14B" },
  { key: "upscale", label: "Upscaling" },
  { key: "audio", label: "Voice, music & mix" },
] as const;
