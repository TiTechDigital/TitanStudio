import { NextRequest, NextResponse } from "next/server";

// Server-side proxy: keeps RUNPOD_API_KEY off the browser.
// POST -> https://api.runpod.ai/v2/{ENDPOINT_ID}/runsync
// GET ?id= -> https://api.runpod.ai/v2/{ENDPOINT_ID}/status/{id}   (used when runsync returns IN_PROGRESS)
export const maxDuration = 300;

const base = () => {
  const id = process.env.RUNPOD_ENDPOINT_ID;
  const key = process.env.RUNPOD_API_KEY;
  if (!id || !key) return null;
  return { url: `https://api.runpod.ai/v2/${id}`, key };
};

const missing = () =>
  NextResponse.json({ error: "RUNPOD_ENDPOINT_ID / RUNPOD_API_KEY not configured on server" }, { status: 500 });

export async function POST(req: NextRequest) {
  const cfg = base();
  if (!cfg) return missing();
  try {
    const body = await req.json();
    const r = await fetch(`${cfg.url}/runsync`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${cfg.key}` },
      body: JSON.stringify(body),
    });
    const data = await r.json().catch(() => ({}));
    return NextResponse.json(data, { status: r.status });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Upstream failure" }, { status: 502 });
  }
}

export async function GET(req: NextRequest) {
  const cfg = base();
  if (!cfg) return missing();
  const id = req.nextUrl.searchParams.get("id");
  if (!id || !/^[\w-]+$/.test(id)) return NextResponse.json({ error: "bad id" }, { status: 400 });
  try {
    const r = await fetch(`${cfg.url}/status/${id}`, { headers: { Authorization: `Bearer ${cfg.key}` } });
    return NextResponse.json(await r.json().catch(() => ({})), { status: r.status });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Upstream failure" }, { status: 502 });
  }
}
