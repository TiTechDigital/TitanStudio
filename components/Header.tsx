export function Header({ generating }: { generating: boolean }) {
  return (
    <header className="relative z-20 flex h-14 shrink-0 items-center justify-between px-5">
      <div className="flex items-center gap-2.5">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-lime text-ink-950" aria-hidden>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M4 5h16v4h-6v10h-4V9H4z" /></svg>
        </span>
        <h1 className="font-display text-[19px] font-extrabold tracking-tight text-fg">Titan <span className="text-mute">V1</span></h1>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] text-mute">
        <span className={`h-1.5 w-1.5 rounded-full ${generating ? "animate-pulseDot bg-lime" : "bg-dim"}`} />
        {generating ? "Rendering" : "Ready"}
      </div>
    </header>
  );
}
