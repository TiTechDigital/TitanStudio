"use client";
import { useCallback, useState } from "react";
import { Canvas } from "@/components/Canvas";
import { Composer } from "@/components/Composer";
import { Header } from "@/components/Header";
import { History } from "@/components/History";
import { SettingsPanel } from "@/components/SettingsPanel";
import { useTitanAPI } from "@/hooks/useTitanAPI";
import { DEFAULT_PARAMS } from "@/lib/constants";
import type { AspectId, PatchParams, SetParam, StudioParams } from "@/lib/types";

export default function Page() {
  const [p, setP] = useState<StudioParams>(DEFAULT_PARAMS);
  const api = useTitanAPI();
  const busy = api.status === "queued" || api.status === "generating";

  const set: SetParam = useCallback((k, v) => setP((prev) => ({ ...prev, [k]: v })), []);
  const patch: PatchParams = useCallback((x) => setP((prev) => ({ ...prev, ...x })), []);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden lg:h-screen">
      <div aria-hidden className="pointer-events-none absolute -left-40 -top-40 h-[560px] w-[560px] animate-drift rounded-full bg-accent/[0.10] blur-[130px]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-52 left-1/3 h-[520px] w-[620px] animate-drift rounded-full bg-accent-glow/[0.08] blur-[130px] [animation-delay:-6s]" />
      <Header status={api.status} />
      <main className="relative grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex min-h-0 flex-col">
          <div className="flex h-[60vh] min-h-0 flex-col lg:h-auto lg:flex-1">
            <Canvas
              p={p} status={api.status} stage={api.stage} progress={api.progress}
              elapsedMs={api.elapsedMs} etaMs={api.etaMs} result={api.result} error={api.error}
              onRetry={() => api.generate(p)} onCancel={api.cancel}
              onPick={(prompt: string, aspect: AspectId) => patch({ prompt, aspect })}
            />
          </div>
          <History items={api.history} activeId={api.activeId} onSelect={api.show} />
          <Composer p={p} set={set} patch={patch} busy={busy} onGenerate={() => api.generate(p)} />
        </div>
        <aside className="relative border-t border-white/[0.07] bg-ink-950/60 backdrop-blur-xl lg:overflow-y-auto lg:border-l lg:border-t-0">
          <SettingsPanel p={p} set={set} patch={patch} />
        </aside>
      </main>
    </div>
  );
}
