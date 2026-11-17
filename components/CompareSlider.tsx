"use client";
import { useEffect, useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";

/** Before (raw) vs After (4K) wipe comparison. Two muted looping videos kept in sync. */
export function CompareSlider({ before, after }: { before: string; after: string }) {
  const box = useRef<HTMLDivElement>(null);
  const vb = useRef<HTMLVideoElement>(null);
  const va = useRef<HTMLVideoElement>(null);
  const [pos, setPos] = useState(50);
  const drag = useRef(false);

  const move = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  useEffect(() => {
    const id = setInterval(() => {
      const a = va.current, b = vb.current;
      if (a && b && Math.abs(a.currentTime - b.currentTime) > 0.1) b.currentTime = a.currentTime;
    }, 500);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      ref={box} className="relative h-full w-full cursor-ew-resize select-none overflow-hidden touch-none"
      onPointerDown={(e) => { drag.current = true; e.currentTarget.setPointerCapture(e.pointerId); move(e.clientX); }}
      onPointerMove={(e) => drag.current && move(e.clientX)}
      onPointerUp={() => (drag.current = false)}
    >
      <video ref={va} src={after} className="absolute inset-0 h-full w-full object-contain" autoPlay loop muted playsInline />
      <video ref={vb} src={before} className="absolute inset-0 h-full w-full object-contain" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} autoPlay loop muted playsInline />
      <span className="absolute left-3 top-3 rounded bg-black/70 px-2 py-1 text-[11px] font-medium text-fg">Original</span>
      <span className="absolute right-3 top-3 rounded bg-lime px-2 py-1 text-[11px] font-semibold text-ink-950">4K</span>
      <div className="absolute inset-y-0 w-px bg-white" style={{ left: `${pos}%` }}>
        <span className="absolute left-1/2 top-1/2 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink-950">
          <MoveHorizontal size={15} />
        </span>
      </div>
    </div>
  );
}
