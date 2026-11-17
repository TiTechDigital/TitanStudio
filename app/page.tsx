"use client";
import { useCallback, useState } from "react";
import { CinemaMonitor } from "@/components/CinemaMonitor";
import { Composer } from "@/components/Composer";
import { History } from "@/components/History";
import { Header } from "@/components/Header";
import { SettingsPanel } from "@/components/SettingsPanel";
import { useTitanAPI } from "@/hooks/useTitanAPI";
import { DEFAULT_PARAMS } from "@/lib/constants";
import type { AspectId, SetParam, StudioParams } from "@/lib/types";

export default function Page() {
  const [p, setP] = useState<StudioParams>(DEFAULT_PARAMS);
  const api = useTitanAPI();
  const generating = api.status === "generating";

  const set: SetParam = useCallback((k, v) => setP((prev) => ({ ...prev, [k]: v })), []);

  // Re-run with the same seed: lock the seed used by the last render, then run again.
  const reroll = () => {
    const seed = api.result?.seed ?? p.seed;
    setP((prev) => ({ ...prev, seed, lockSeed: true }));
    api.generate({ ...p, seed, lockSeed: true });
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden lg:h-screen">
      <div aria-hidden className="pointer-events-none absolute -left-40 -top-40 h-[560px] w-[560px] animate-drift rounded-full bg-lime/[0.07] blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-52 left-1/3 h-[520px] w-[620px] animate-drift rounded-full bg-violet-500/[0.10] blur-[130px] [animation-delay:-6s]" />
      <Header generating={generating} />
      <main className="relative grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex min-h-0 flex-col">
          <CinemaMonitor
            p={p} status={api.status} stage={api.stage} progress={api.progress} result={api.result} error={api.error}
            onReroll={reroll} onExportGif={api.exportGif} onRetry={() => api.generate(p)}
            onPick={(prompt: string, aspect: AspectId) => { set("prompt", prompt); set("aspect", aspect); }}
          />
          <History items={api.history} activeId={api.activeId} onSelect={api.show} />
          <Composer p={p} set={set} generating={generating} onGenerate={() => api.generate(p)} onCancel={api.cancel} />
        </div>
        <aside className="relative border-t border-white/10 bg-ink-950/70 backdrop-blur-xl lg:overflow-y-auto lg:border-l lg:border-t-0">
          <SettingsPanel p={p} set={set} />
        </aside>
      </main>
    </div>
  );
}
