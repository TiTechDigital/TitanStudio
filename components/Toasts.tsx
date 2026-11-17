"use client";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { useToasts } from "@/hooks/useToasts";

const ICON = { success: CheckCircle2, error: AlertTriangle, info: Info } as const;
const TONE = { success: "text-lime", error: "text-danger", info: "text-mute" } as const;

export function Toasts() {
  const { toasts, dismiss } = useToasts();
  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-5 right-5 z-50 flex w-[min(92vw,360px)] flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = ICON[t.kind];
          return (
            <motion.div
              key={t.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 24 }} transition={{ duration: 0.18 }}
              className="pointer-events-auto flex items-start gap-3 rounded-xl border border-ink-600 bg-ink-800 p-3.5 shadow-2xl shadow-black/60"
            >
              <Icon size={16} className={`mt-0.5 shrink-0 ${TONE[t.kind]}`} />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium text-fg">{t.title}</p>
                {t.message && <p className="mt-0.5 break-words text-[12px] text-mute">{t.message}</p>}
              </div>
              <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="text-dim transition-colors hover:text-fg"><X size={14} /></button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
