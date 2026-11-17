import type { GenStatus } from "@/lib/types";

export function Header({ status }: { status: GenStatus }) {
  const queued = status === "queued";
  const rendering = status === "generating";
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-line px-5">
      <span className="text-[15px] font-extrabold tracking-[0.14em]" style={{ fontStretch: "125%" }}>TITAN</span>
      <div className="flex items-center gap-2 text-[12.5px] text-mute" role="status">
        {(queued || rendering) ? (
          <>
            <span className="h-2 w-2 animate-tally rounded-full bg-tally" />
            <span className="text-fg">{queued ? "Waiting for GPU" : "Rendering"}</span>
          </>
        ) : (
          <>
            <span className="h-2 w-2 rounded-full bg-dim" />
            Idle
          </>
        )}
      </div>
    </header>
  );
}
