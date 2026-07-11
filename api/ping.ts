/** Diagnostic liveness probe for the Vercel Node runtime. Delete after debugging. */
interface NodeRequest {
  method?: string;
}
interface NodeResponse {
  status(code: number): NodeResponse;
  json(body: unknown): void;
}

export default function handler(_req: NodeRequest, res: NodeResponse): void {
  res.status(200).json({ ok: true, runtime: process.version });
}
