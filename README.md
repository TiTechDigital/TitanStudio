# Titan Studio

Next.js frontend for the Titan V1 RunPod serverless worker (LTX motion → Wan 14B cinema pass → Real-ESRGAN → voice/music).

## Run

```bash
npm install
cp .env.example .env.local   # set RUNPOD_ENDPOINT_ID and RUNPOD_API_KEY
npm run dev
```

The browser never sees the API key: `app/api/titan/route.ts` proxies to RunPod (`POST` → `/run`, `GET ?id=` → `/status/{id}`, `DELETE ?id=` → `/cancel/{id}`).

`buildPayload()` in `hooks/useTitanAPI.ts` maps UI settings to the worker's `input` (see `handler.py`).

## Notes

- The proxy has no auth. Add a login or access code before exposing it publicly, or anyone can spend your GPU credits.
- Progress bar and stage names are estimates; queue / in-progress state comes from RunPod.
