import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { getGeminiClient, GEMINI_MODEL, sendError, handleApiError } from './_lib/gemini.js';

const PoleSchema = z.object({
  name: z.string().max(200).optional(),
  upsides: z.array(z.string().max(500)).max(10).optional(),
  downsides: z.array(z.string().max(500)).max(10).optional(),
});

const SessionDataSchema = z
  .object({
    title: z.string().max(500).optional(),
    rawChallenge: z.string().max(2_000).optional(),
    neutralChallenge: z.string().max(2_000).optional(),
    classification: z.string().max(50).optional(),
    polarityMap: z
      .object({
        poleL: PoleSchema.optional(),
        poleR: PoleSchema.optional(),
        sharedBestHope: z.string().max(1_000).optional(),
        sharedGreatestFear: z.string().max(1_000).optional(),
      })
      .optional(),
    actions: z.array(z.record(z.string(), z.string().max(1_000))).max(20).optional(),
  })
  .optional();

const BodySchema = z.object({
  sessionData: SessionDataSchema,
  customText: z.string().max(50_000).optional(),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'method_not_allowed');
  }

  const parsed = BodySchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, 400, 'invalid_request');
  }

  const { sessionData, customText } = parsed.data;

  try {
    const ai = getGeminiClient();

    const poleLName = sessionData?.polarityMap?.poleL?.name ?? 'First side';
    const poleRName = sessionData?.polarityMap?.poleR?.name ?? 'Second side';

    const textToConvert =
      customText ??
      `Title: ${sessionData?.title ?? 'Convening Session'}
Challenge: ${sessionData?.neutralChallenge ?? sessionData?.rawChallenge ?? ''}
Classification: ${sessionData?.classification ?? ''}
Pole L: ${poleLName}
Pole L Upsides: ${sessionData?.polarityMap?.poleL?.upsides?.join(', ') ?? ''}
Pole L Downsides: ${sessionData?.polarityMap?.poleL?.downsides?.join(', ') ?? ''}
Pole R: ${poleRName}
Pole R Upsides: ${sessionData?.polarityMap?.poleR?.upsides?.join(', ') ?? ''}
Pole R Downsides: ${sessionData?.polarityMap?.poleR?.downsides?.join(', ') ?? ''}
Shared Best Hope: ${sessionData?.polarityMap?.sharedBestHope ?? ''}
Shared Greatest Fear: ${sessionData?.polarityMap?.sharedGreatestFear ?? ''}
Action System: ${JSON.stringify(sessionData?.actions ?? [])}`;

    const prompt = `You are an expert communicator specializing in Plain Language (6th-8th grade reading level, highly clear, warm, accessible, and jargon-free).
Convert the following Polarity-to-Action facilitation summary into clear Plain Language that students, campus staff, community members, and partners can easily understand.

Avoid academic jargon like "interdependent poles", "matrix", "downside overuse", "bifurcation", "polarity mapping".
Instead use everyday clear headings:
1. What issue are we working on?
2. Why isn't this a simple pick-one choice? (Explain the balance needed)
3. Priority 1 (${poleLName}) - What we gain & What happens if we overdo it
4. Priority 2 (${poleRName}) - What we gain & What happens if we overdo it
5. What everyone wants (Our Shared Goal)
6. What everyone wants to avoid (Our Shared Fear)
7. What we are doing right now (Our Action Plan in plain words)

Source Content to Convert:
${textToConvert}

Return a clean, well-structured, Markdown plain language response.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    res.json({ plainText: response.text });
  } catch (error) {
    handleApiError(res, 'plain-language', error);
  }
}
