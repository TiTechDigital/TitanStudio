"use client";
import type { AspectId } from "@/lib/types";

const SHOTS: { title: string; prompt: string; aspect: AspectId; art: string }[] = [
  {
    title: "Neon rain chase",
    prompt: "A courier on a motorbike weaving through a rain-soaked neon alley at night, fast tracking shot, cyberpunk neon rain, wet reflective streets",
    aspect: "9:16",
    art: "radial-gradient(120% 70% at 30% 100%, #ff2d95 0%, transparent 60%), radial-gradient(90% 60% at 80% 20%, #17d4ff 0%, transparent 60%), #0a0612",
  },
  {
    title: "Desert flyover",
    prompt: "High aerial drone flyover of a lone red truck crossing white salt flats, golden hour sunlight, warm rim light",
    aspect: "16:9",
    art: "linear-gradient(180deg, #1c2a52 0%, #e8895a 62%, #ffd9a0 100%)",
  },
  {
    title: "Ink in water",
    prompt: "Extreme macro zoom of black ink blooming through clear water, shallow depth of field, slow motion",
    aspect: "1:1",
    art: "radial-gradient(70% 70% at 50% 45%, #1a1a2e 0%, #0b3b4a 45%, #d1fe17 140%)",
  },
  {
    title: "Noir interrogation",
    prompt: "Slow cinematic dolly push-in on a detective under a swinging lamp, moody film noir, hard shadows, low-key lighting",
    aspect: "2.39:1",
    art: "conic-gradient(from 200deg at 60% 30%, #000, #3a3a42, #000 40%), #050505",
  },
];

export function Hero({ onPick }: { onPick: (prompt: string, aspect: AspectId) => void }) {
  return (
    <div className="relative z-10 flex w-full max-w-5xl flex-col items-center px-6 text-center">
      <h2 className="animate-rise font-display text-[clamp(2.6rem,7vw,5.5rem)] font-extrabold leading-[0.92] tracking-[-0.04em] text-fg">
        Direct the shot.<br /><span className="text-mute">We handle the crew.</span>
      </h2>
      <p className="animate-rise mt-5 max-w-md text-[14.5px] leading-relaxed text-mute [animation-delay:.1s]">
        Describe a scene and Titan renders video with voice-over and music in one pass.
      </p>
      <ul className="animate-rise mt-10 grid w-full grid-cols-2 gap-3 [animation-delay:.2s] sm:grid-cols-4">
        {SHOTS.map((s) => (
          <li key={s.title}>
            <button
              type="button" onClick={() => onPick(s.prompt, s.aspect)}
              className="group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl text-left ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:ring-lime/60"
              style={{ background: s.art }}
            >
              <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <span className="absolute inset-x-3 bottom-3">
                <span className="block font-display text-[16px] font-bold leading-tight text-white">{s.title}</span>
                <span className="mt-1 block text-[11.5px] text-white/60 transition group-hover:text-lime">Use this prompt · {s.aspect}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
