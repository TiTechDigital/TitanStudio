"use client";
import { useCallback, useState } from "react";
import { Header } from "@/components/Header";
import { Monitor } from "@/components/Monitor";
import { ShotSheet } from "@/components/ShotSheet";
import { Timeline } from "@/components/Timeline";
import { useTitanAPI } from "@/hooks/useTitanAPI";
import { DEFAULT_PARAMS } from "@/lib/constants";
import type { PatchParams, SetParam, StudioParams } from "@/lib/types";

export default function Page() {
  const [p, setP] = useState<StudioParams>(DEFAULT_PARAMS);
  const api = useTitanAPI();
  const busy = api.status === "queued" || api.status === "generating";

  const set: SetParam = useCallback((k, v) => setP((prev) => ({ ...prev, [k]: v })), []);
  const patch: PatchParams = useCallback((x) => setP((prev) => ({ ...prev, ...x })), []);
  const generate = () => api.generate(p);

  return (
    <div className="flex min-h-screen flex-col lg:h-screen">
      <Header status={api.status} />
      <main className="grid min-h-0 flex-1 lg:grid-cols-[340px_minmax(0,1fr)] lg:grid-rows-[minmax(0,1fr)_auto]">
        <Monitor
          p={p} status={api.status} stage={api.stage} elapsedMs={api.elapsedMs} result={api.result} error={api.error}
          onRetry={generate} onCancel={api.cancel} onRetake={generate}
          className="order-1 h-[72vh] lg:col-start-2 lg:row-start-1 lg:h-auto"
        />
        <ShotSheet
          p={p} set={set} patch={patch} busy={busy} onGenerate={generate}
          className="order-2 border-t lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:border-t-0"
        />
        <Timeline
          p={p} set={set} patch={patch} status={api.status} stage={api.stage} parts={api.parts} result={api.result}
          history={api.history} activeId={api.activeId} onSelect={api.show}
          className="order-3 lg:col-start-2 lg:row-start-2 lg:max-h-[46vh] lg:overflow-y-auto"
        />
      </main>
    </div>
  );
}
