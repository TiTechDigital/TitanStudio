"use client";
import { BGM_TRACKS, VOICE_CATALOG } from "@/lib/constants";
import type { StudioProps } from "@/lib/types";
import { Group, Label, Slider, Toggle } from "./ui/Controls";

export function AudioStudio({ p, set }: StudioProps) {
  const words = p.narration.trim() ? p.narration.trim().split(/\s+/).length : 0;

  return (
    <>
      <Group title="Voice-over">
        <div>
          <Label htmlFor="narration" aside={<span className="font-mono text-[11px] text-dim">{words} words</span>}>Script</Label>
          <textarea
            id="narration" rows={4} value={p.narration} onChange={(e) => set("narration", e.target.value)}
            className="field resize-none leading-relaxed" placeholder="Leave empty for a clip without voice."
          />
        </div>
        <div>
          <Label htmlFor="voice">Voice</Label>
          <select id="voice" className="field" value={p.voice} onChange={(e) => set("voice", e.target.value)}>
            {VOICE_CATALOG.map((g) => (
              <optgroup key={g.group} label={g.group}>
                {g.voices.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}{v.note ? ` (${v.note})` : ""}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <Slider label="Speed" value={p.speechRate} min={-20} max={20} onChange={(v) => set("speechRate", v)} format={(v) => `${v > 0 ? "+" : ""}${v}%`} />
        <Slider label="Pitch" value={p.pitch} min={-50} max={50} onChange={(v) => set("pitch", v)} format={(v) => `${v > 0 ? "+" : ""}${v} Hz`} />
      </Group>

      <Group title="Music">
        <div>
          <Label htmlFor="bgm">Track</Label>
          <select id="bgm" className="field" value={p.bgm} onChange={(e) => set("bgm", e.target.value)}>
            {BGM_TRACKS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <Slider label="Volume" value={p.bgmVolume} min={0} max={100} onChange={(v) => set("bgmVolume", v)} format={(v) => `${v}%`} />
        <Toggle checked={p.autoDuck} onChange={(v) => set("autoDuck", v)} label="Lower music under voice" sub="Drops the track by 18 dB while the voice speaks." />
      </Group>
    </>
  );
}
