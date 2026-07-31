import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { getGeminiClient, GEMINI_MODEL, sendError, handleApiError } from './_lib/gemini.js';

const PoleSchema = z.object({
  name: z.string().max(200).optional(),
  upsides: z.array(z.string().max(500)).max(10).optional(),
  downsides: z.array(z.string().max(500)).max(10).optional(),
});

const SessionDataSchema = z.object({
  rawChallenge: z.string().max(2_000).optional(),
  neutralChallenge: z.string().max(2_000).optional(),
  polarityMap: z
    .object({
      poleL: PoleSchema.optional(),
      poleR: PoleSchema.optional(),
    })
    .optional(),
});

const BodySchema = z.object({
  sessionData: SessionDataSchema,
  targetField: z.string().max(100).optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'method_not_allowed');
  }

  const parsed = BodySchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, 400, 'invalid_request');
  }

  const { sessionData, targetField } = parsed.data;

  try {
    const ai = getGeminiClient();

    const prompt = `You are a master Polarity Facilitator. Review the current session context:
Raw Challenge: ${sessionData.rawChallenge ?? ''}
Neutral Challenge: ${sessionData.neutralChallenge ?? ''}
Pole L: ${sessionData.polarityMap?.poleL?.name ?? ''}
Pole R: ${sessionData.polarityMap?.poleR?.name ?? ''}

Target to enhance: ${targetField ?? 'entire_map'}

Provide enhanced, high-quality, professional inputs for the P.A.I.R. framework (neutral challenge, polarity map quadrants, shared hope/fear, and balanced action items).

Return JSON format:
{
  "neutralChallenge": "...",
  "classification": "problem" | "polarity" | "problem_in_polarity",
  "immediateProblem": "...",
  "largerPolarity": "...",
  "polarityMap": {
    "poleL": { "name": "...", "upsides": ["..."], "downsides": ["..."] },
    "poleR": { "name": "...", "upsides": ["..."], "downsides": ["..."] },
    "sharedBestHope": "...",
    "sharedGreatestFear": "..."
  },
  "suggestedActions": [
    {
      "action": "...",
      "poleSupported": "L" | "R" | "Both",
      "owner": "...",
      "timing": "...",
      "successEvidence": "...",
      "earlyWarningIndicator": "..."
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const result = JSON.parse(response.text ?? '{}');
    res.json(result);
  } catch (error) {
    handleApiError(res, 'enhance-polarity', error);
  }
}
