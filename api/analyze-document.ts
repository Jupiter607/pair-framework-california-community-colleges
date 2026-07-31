import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { getGeminiClient, GEMINI_MODEL, sendError, handleApiError } from './_lib/gemini.js';

// ~3 MB of base64 text is ~2.25 MB of binary data — safely under Vercel's 4.5 MB cap
const MAX_BASE64_CHARS = 3_000_000;

const BodySchema = z.object({
  fileName: z.string().min(1).max(500),
  mimeType: z.string().max(100).optional(),
  base64Data: z.string().max(MAX_BASE64_CHARS).optional(),
  textData: z.string().max(200_000).optional(),
}).refine((d) => d.base64Data || d.textData, {
  message: 'Either base64Data or textData must be provided',
});

const ANALYSIS_PROMPT = (fileName: string) =>
  `You are an expert CCCCO Polarity-to-Action Facilitation Assistant.
Analyze the attached document ("${fileName}") and extract key institutional tensions, challenges, stakeholders, or meeting notes.

Provide:
1. A concise 2-3 sentence summary of the document.
2. The primary challenge or tension identified in the document.
3. Suggested neutral challenge statement (in the format: "How do we [Preserve Value A] while [Protecting Value B]?").
4. A suggested Polarity Classification (problem, polarity, or problem_in_polarity).
5. Suggested Pole L & Pole R names, upsides, downsides, shared best hope, and shared greatest fear.
6. 2-3 actionable next steps with early warning indicators.

Return your response strictly in JSON format matching this schema:
{
  "summary": "...",
  "primaryChallenge": "...",
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'method_not_allowed');
  }

  const parsed = BodySchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, 400, 'invalid_request');
  }

  const { fileName, mimeType, base64Data, textData } = parsed.data;

  try {
    const ai = getGeminiClient();
    const analysisPrompt = ANALYSIS_PROMPT(fileName);

    const contents = base64Data
      ? [
          { inlineData: { mimeType: mimeType ?? 'application/pdf', data: base64Data } },
          { text: analysisPrompt },
        ]
      : [{ text: `${analysisPrompt}\n\nDocument Text Content:\n${textData}` }];

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: { responseMimeType: 'application/json' },
    });

    const parsedData = JSON.parse(response.text ?? '{}');
    res.json(parsedData);
  } catch (error) {
    handleApiError(res, 'analyze-document', error);
  }
}
