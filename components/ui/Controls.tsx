"use client";
import type { CSSProperties, ReactNode } from "react";

/** A block of the shot sheet, separated from its neighbours by a hairline. */
export function Section({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="border-b border-line px-5 py-4">
      <div className="mb-2.5 flex items-baseline justify-between gap-3">
        <h3 className="text-[12.5px] font-semibold text-fg">{title}</h3>
        {aside}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function Slider({
  label, value, min, max, step = 1, onChange, format, hint,
}: {
  label: string; value: number; min: number; max: number; step?: number;
  onChange: (v: number) => void; format?: (v: number) => string; hint?: string;
}) {
  const p = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-[12.5px] text-mute">{label}</span>
        <span className="num text-[12.5px] text-fg">{format ? format(value) : value}</span>
      </div>
      <input
        type="range" className="titan-range" min={min} max={max} step={step} value={value}
        style={{ "--p": `${p}%` } as CSSProperties} aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {hint && <p className="mt-2 text-[12px] leading-snug text-dim">{hint}</p>}
    </div>
  );
}

export function Segmented<T extends string | number>({
  value, options, onChange, label,
}: {
  value: T; label: string;
  options: { value: T; label: string; sub?: string }[]; onChange: (v: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="seg" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0,1fr))` }}>
      {options.map((o) => (
        <button key={String(o.value)} type="button" className="seg-item" aria-pressed={o.value === value} onClick={() => onChange(o.value)}>
          {o.label}
          {o.sub && <span className="num mt-0.5 block text-[10.5px] font-normal opacity-70">{o.sub}</span>}
        </button>
      ))}
    </div>
  );
}
