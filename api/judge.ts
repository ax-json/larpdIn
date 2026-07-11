/**
 * POST /api/judge — the live courtroom (Vercel serverless function).
 *
 * Takes { prompt, larp }, calls OpenAI with the courtroom system prompt, parses
 * the strict-JSON verdict, computes the rating in code, and returns a full
 * CourtroomResult. The API key lives ONLY here (server side) — never shipped to
 * the browser (SPEC §5 / security).
 *
 * Runs on Vercel's Node runtime. Locally there is no serverless layer, so the
 * client (src/game/judge.ts) falls back to mock fixtures when this route 404s.
 */

import { JUDGE_SYSTEM_PROMPT, JUDGE_TEMPERATURE, buildJudgeUserMessage } from '../src/llm/judgePrompt.js';
import { finalizeCourtroom } from '../src/game/scoring.js';
import type { Prompt, Larp, CourtroomResult, TranscriptTurn, Verdict } from '../src/types/contracts.js';

const LLM_URL = 'https://api.featherless.ai/v1/chat/completions';
const MODEL = 'Qwen/Qwen2.5-72B-Instruct';
const MAX_TOKENS = 1600;

/** Input bounds — same game rules the UI enforces, re-checked at the trust boundary. */
const MIN_LARP_CHARS = 20;
const MAX_LARP_CHARS = 2000;
const MAX_PROMPT_CHARS = 300;

const JUDGES = new Set(['recruiter', 'vc', 'intern']);
const AXES = new Set(['plausibility', 'restraint', 'buzzword', 'detectability']);
const MAX_TRANSCRIPT_TURNS = 12;

/** Minimal Node req/res shapes — avoids a @vercel/node type dependency. */
interface NodeRequest {
  method?: string;
  body?: unknown;
}
interface NodeResponse {
  status(code: number): NodeResponse;
  json(body: unknown): void;
}

/** Let a gpt-4o completion breathe past Vercel's 10s default. */
export const config = { maxDuration: 60 };

/** Pull the first JSON object out of the model's text, tolerating stray prose/fences. */
function extractJSON(text: string): unknown {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) {
    throw new Error('no JSON object in model response');
  }
  return JSON.parse(text.slice(start, end + 1));
}

/**
 * Validate + sanitize the model's output element by element. Unknown judges,
 * unknown axes, and non-string lines are dropped rather than passed to the UI;
 * an empty transcript or verdict list after filtering throws so the client can
 * fall back to a fixture. The rating is never read from the model.
 */
function validateRaw(value: unknown): Omit<CourtroomResult, 'rating'> {
  if (typeof value !== 'object' || value === null) throw new Error('response not an object');
  const v = value as Record<string, unknown>;
  if (!Array.isArray(v.transcript) || !Array.isArray(v.verdicts)) throw new Error('bad shape');
  if (typeof v.verdictLine !== 'string' || v.verdictLine.trim() === '') throw new Error('bad verdictLine');

  const transcript = v.transcript
    .filter((t): t is TranscriptTurn => {
      if (typeof t !== 'object' || t === null) return false;
      const turn = t as Record<string, unknown>;
      return JUDGES.has(turn.judge as string) && typeof turn.line === 'string' && turn.line.trim() !== '';
    })
    .slice(0, MAX_TRANSCRIPT_TURNS);

  const seenAxes = new Set<string>();
  const verdicts = v.verdicts.filter((entry): entry is Verdict => {
    if (typeof entry !== 'object' || entry === null) return false;
    const verdict = entry as Record<string, unknown>;
    const axis = verdict.axis as string;
    const ok =
      JUDGES.has(verdict.judge as string) &&
      AXES.has(axis) &&
      !seenAxes.has(axis) &&
      typeof verdict.score === 'number' &&
      Number.isFinite(verdict.score) &&
      typeof verdict.oneLiner === 'string';
    if (ok) seenAxes.add(axis);
    return ok;
  });

  if (transcript.length === 0) throw new Error('no valid transcript turns');
  // All four axes or bust — a partial panel would skew the rating's mean and
  // drift live scores away from the fixture-calibrated distribution.
  if (verdicts.length !== AXES.size) {
    throw new Error(`expected ${AXES.size} verdicts, got ${verdicts.length}`);
  }
  return { transcript, verdicts, verdictLine: v.verdictLine };
}

export default async function handler(req: NodeRequest, res: NodeResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST only' });
    return;
  }

  const apiKey = process.env.FEATHERLESS_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: 'server missing FEATHERLESS_API_KEY' });
    return;
  }

  // Vercel parses the JSON body for content-type application/json.
  const body = (req.body ?? {}) as { prompt?: Prompt; larp?: Larp };
  if (!body.prompt || typeof body.prompt.text !== 'string' || !body.larp || typeof body.larp.text !== 'string') {
    res.status(400).json({ error: 'expected { prompt, larp }' });
    return;
  }
  const larpLength = body.larp.text.trim().length;
  if (larpLength < MIN_LARP_CHARS || larpLength > MAX_LARP_CHARS) {
    res.status(400).json({ error: `larp text must be ${MIN_LARP_CHARS}-${MAX_LARP_CHARS} chars` });
    return;
  }
  if (body.prompt.text.length > MAX_PROMPT_CHARS) {
    res.status(400).json({ error: 'prompt text too long' });
    return;
  }
  const prompt = body.prompt;
  const larp = body.larp;

  try {
    const upstream = await fetch(LLM_URL, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        temperature: JUDGE_TEMPERATURE,
        messages: [
          { role: 'system', content: JUDGE_SYSTEM_PROMPT },
          { role: 'user', content: buildJudgeUserMessage(prompt, larp) },
        ],
      }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text();
      res.status(502).json({ error: 'llm call failed', status: upstream.status, detail });
      return;
    }

    const data = (await upstream.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const text = data.choices?.[0]?.message?.content ?? '';
    const raw = validateRaw(extractJSON(text));
    const result: CourtroomResult = finalizeCourtroom(raw);
    res.status(200).json(result);
  } catch (err) {
    res.status(502).json({ error: 'could not parse verdict', detail: String(err) });
  }
}
