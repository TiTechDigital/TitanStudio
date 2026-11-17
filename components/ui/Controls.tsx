"use client";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";

export function Group({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="border-b border-white/[0.07] px-5 py-5 last:border-b-0">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-[13px] font-semibold text-fg">{title}</h3>
        {aside}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function Label({ children, htmlFor, aside }: { children: ReactNode; htmlFor?: string; aside?: ReactNode }) {
  return (
    <div className="mb-1.5 flex items-center justify-between">
      <label htmlFor={htmlFor} className="text-xs text-mute">{children}</label>
      {aside}
    </div>
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
      <div className="mb-2.5 flex items-baseline justify-between">
        <span className="text-xs text-mute">{label}</span>
        <span className="font-mono text-xs tabular-nums text-fg">{format ? format(value) : value}</span>
      </div>
      <input
        type="range" className="titan-range" min={min} max={max} step={step} value={value}
        style={{ "--p": `${p}%` } as CSSProperties}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {hint && <p className="mt-2 text-[11px] text-dim">{hint}</p>}
    </div>
  );
}

export function Toggle({ checked, onChange, label, sub }: { checked: boolean; onChange: (v: boolean) => void; label: string; sub?: string }) {
  return (
    <button
      type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 text-left"
    >
      <span>
        <span className="block text-[13px] font-medium text-fg">{label}</span>
        {sub && <span className="mt-0.5 block text-[11.5px] text-mute">{sub}</span>}
      </span>
      <span className={`relative h-[22px] w-10 shrink-0 rounded-full transition-colors ${checked ? "bg-accent" : "bg-ink-600"}`}>
        <span className={`absolute top-[3px] h-4 w-4 rounded-full transition-all ${checked ? "left-[21px] bg-white" : "left-[3px] bg-fg"}`} />
      </span>
    </button>
  );
}

export function Segmented<T extends string | number>({
  value, options, onChange, label,
}: {
  value: T; label: string;
  options: { value: T; label: string }[]; onChange: (v: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="seg" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0,1fr))` }}>
      {options.map((o) => (
        <button key={String(o.value)} type="button" className="seg-item" aria-pressed={o.value === value} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Popover menu that opens upward, closes on outside click / Escape. */
export function Menu({
  trigger, children, width = "w-60", label,
}: {
  trigger: ReactNode; label: string; width?: string;
  children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const down = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", down);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", down); document.removeEventListener("keydown", key); };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button type="button" className="pill" aria-label={label} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {trigger}
        <ChevronDown size={12} className="text-mute" />
      </button>
      {open && (
        <div role="menu" className={`absolute bottom-full left-0 z-40 mb-2 max-h-[60vh] overflow-y-auto rounded-xl border border-white/10 bg-ink-800 p-1 shadow-2xl shadow-black/70 ${width}`}>
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

export function MenuItem({
  active, onClick, title, sub, right,
}: { active?: boolean; onClick: () => void; title: string; sub?: string; right?: ReactNode }) {
  return (
    <button type="button" role="menuitemradio" aria-checked={!!active} onClick={onClick}
      className="flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-white/[0.06]">
      <span className="min-w-0">
        <span className="block text-[13px] font-medium text-fg">{title}</span>
        {sub && <span className="block text-[11.5px] text-mute">{sub}</span>}
      </span>
      <span className="flex shrink-0 items-center gap-2 text-mute">
        {right}
        {active && <Check size={14} className="text-accent-soft" />}
      </span>
    </button>
  );
}
