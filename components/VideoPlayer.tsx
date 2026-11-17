"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Pause, Play, Repeat, Volume2, VolumeX } from "lucide-react";

const SPEEDS = [0.25, 0.5, 1, 1.5, 2];
const pad = (n: number) => String(n).padStart(2, "0");

export function timecode(t: number, fps: number) {
  const s = Math.floor(t);
  const f = Math.min(fps - 1, Math.floor((t - s) * fps));
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f)}`;
}

const icon = "grid h-8 w-8 place-items-center rounded-md text-fg transition-colors hover:bg-white/10";

export function VideoPlayer({ src, fps }: { src: string; fps: number }) {
  const v = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [loop, setLoop] = useState(true);
  const [muted, setMuted] = useState(false);

  useEffect(() => { if (v.current) v.current.playbackRate = speed; }, [speed, src]);

  useEffect(() => {
    let raf = 0;
    const tick = () => { if (v.current) setT(v.current.currentTime); raf = requestAnimationFrame(tick); };
    if (playing) raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  const toggle = () => { const el = v.current; if (!el) return; el.paused ? el.play() : el.pause(); };
  const pct = dur ? (t / dur) * 100 : 0;

  return (
    <div className="group relative h-full w-full">
      <video
        ref={v} src={src} loop={loop} muted={muted} playsInline autoPlay
        className="absolute inset-0 h-full w-full cursor-pointer object-contain" onClick={toggle}
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
        onTimeUpdate={(e) => !playing && setT(e.currentTarget.currentTime)}
      />

      <div className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-gradient-to-t from-black/80 to-transparent px-3 pb-2 pt-8 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
        <button onClick={toggle} aria-label={playing ? "Pause" : "Play"} className={icon}>{playing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}</button>
        <span className="w-[88px] shrink-0 font-mono text-[11px] tabular-nums text-fg/90">{timecode(t, fps)}</span>
        <input
          type="range" className="titan-range min-w-0 flex-1" min={0} max={dur || 1} step={0.01} value={t} aria-label="Seek"
          style={{ "--p": `${pct}%` } as CSSProperties}
          onChange={(e) => { const x = Number(e.target.value); setT(x); if (v.current) v.current.currentTime = x; }}
        />
        <button onClick={() => setSpeed(SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length])} aria-label="Playback speed" className={`${icon} w-11 font-mono text-[11px]`}>{speed}×</button>
        <button onClick={() => setLoop(!loop)} aria-pressed={loop} aria-label="Loop" className={`${icon} ${loop ? "!text-lime" : "!text-mute"}`}><Repeat size={14} /></button>
        <button onClick={() => setMuted(!muted)} aria-label={muted ? "Unmute" : "Mute"} className={icon}>{muted ? <VolumeX size={15} /> : <Volume2 size={15} />}</button>
      </div>
    </div>
  );
}
