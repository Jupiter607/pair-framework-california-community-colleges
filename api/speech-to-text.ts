import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { getGeminiClient, GEMINI_MODEL, sendError, handleApiError } from './_lib/gemini.js';

const MAX_BASE64_CHARS = 3_000_000;

const BodySchema = z.object({
  base64Audio: z.string().min(1).max(MAX_BASE64_CHARS),
  mimeType: z.string().max(100).optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'method_not_allowed');
  }

  const parsed = BodySchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, 400, 'invalid_request');
  }

  const { base64Audio, mimeType } = parsed.data;

  try {
    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        { inlineData: { mimeType: mimeType ?? 'audio/webm', data: base64Audio } },
        {
          text: `Transcribe this voice audio accurately. In addition, summarize the key practitioner point or challenge mentioned.
Return JSON:
{
  "transcript": "Exact transcription of spoken audio...",
  "summary": "Key point or practitioner thought..."
}`,
        },
      ],
      config: { responseMimeType: 'application/json' },
    });

    const result = JSON.parse(response.text ?? '{}');
    res.json(result);
  } catch (error) {
    handleApiError(res, 'speech-to-text', error);
  }
}
