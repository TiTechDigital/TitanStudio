import { NextRequest, NextResponse } from "next/server";

// Server-side proxy: keeps RUNPOD_API_KEY off the browser.
//   POST        -> /run              (async job, returns { id, status })
//   GET ?id=    -> /status/{id}      (poll)
//   DELETE ?id= -> /cancel/{id}
// /run + polling (instead of /runsync) because a render takes minutes, far longer than one HTTP request should block.
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const ID_RE = /^[\w-]{1,100}$/;

const cfg = () => {
  const id = process.env.RUNPOD_ENDPOINT_ID;
  const key = process.env.RUNPOD_API_KEY;
  if (!id || !key) return null;
  return { url: `https://api.runpod.ai/v2/${id}`, key };
};

const notConfigured = () =>
  NextResponse.json({ error: "RUNPOD_ENDPOINT_ID / RUNPOD_API_KEY not configured on the server" }, { status: 500 });

const upstreamError = (e: unknown) =>
  NextResponse.json({ error: e instanceof Error ? e.message : "Upstream failure" }, { status: 502 });

async function relay(url: string, key: string, init: RequestInit = {}) {
  const r = await fetch(url, {
    ...init,
    cache: "no-store",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
  });
  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}

export async function POST(req: NextRequest) {
  const c = cfg();
  if (!c) return notConfigured();
  try {
    const body = await req.json();
    if (!body || typeof body.input !== "object" || body.input === null) {
      return NextResponse.json({ error: "Body must be { input: {...} }" }, { status: 400 });
    }
    return await relay(`${c.url}/run`, c.key, { method: "POST", body: JSON.stringify({ input: body.input }) });
  } catch (e) {
    return upstreamError(e);
  }
}

export async function GET(req: NextRequest) {
  const c = cfg();
  if (!c) return notConfigured();
  const id = req.nextUrl.searchParams.get("id") ?? "";
  if (!ID_RE.test(id)) return NextResponse.json({ error: "bad id" }, { status: 400 });
  try {
    return await relay(`${c.url}/status/${id}`, c.key);
  } catch (e) {
    return upstreamError(e);
  }
}

export async function DELETE(req: NextRequest) {
  const c = cfg();
  if (!c) return notConfigured();
  const id = req.nextUrl.searchParams.get("id") ?? "";
  if (!ID_RE.test(id)) return NextResponse.json({ error: "bad id" }, { status: 400 });
  try {
    return await relay(`${c.url}/cancel/${id}`, c.key, { method: "POST" });
  } catch (e) {
    return upstreamError(e);
  }
}
