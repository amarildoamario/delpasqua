export function enforceBodyLimit(req: Request, maxBytes: number) {
  const len = req.headers.get("content-length");
  if (!len) return;
  const n = Number(len);
  if (Number.isFinite(n) && n > maxBytes) {
    const err = new Error("PAYLOAD_TOO_LARGE");
    (err as any).status = 413;
    throw err;
  }
}
