import type { GenStatus } from "@/lib/types";

const LABEL: Record<GenStatus, string> = {
  idle: "Ready",
  queued: "Waiting for GPU",
  generating: "Rendering",
  completed: "Ready",
  error: "Ready",
};

export function Header({ status }: { status: GenStatus }) {
  const busy = status === "queued" || status === "generating";
  return (
    <header className="relative z-20 flex h-14 shrink-0 items-center justify-between border-b border-white/[0.07] px-5">
      <div className="flex items-center gap-3">
        <span className="relative grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-accent-soft to-accent-deep shadow-[0_0_24px_-2px_rgba(59,130,255,.8)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M4 5h16M12 5v15" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </span>
        <span className="font-display text-[17px] font-bold tracking-[0.18em]">TITAN</span>
        <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-accent-soft">STUDIO</span>
      </div>
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-mute">
        <span className={`h-1.5 w-1.5 rounded-full ${busy ? "animate-pulseDot bg-accent" : "bg-emerald-400"}`} />
        {LABEL[status]}
      </div>
    </header>
  );
}
