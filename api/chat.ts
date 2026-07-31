import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { getGeminiClient, GEMINI_MODEL, sendError, handleApiError } from './_lib/gemini.js';

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().max(10_000),
});

const SessionContextSchema = z.object({
  currentStep: z.string().max(50).optional(),
  rawChallenge: z.string().max(2_000).optional(),
  neutralChallenge: z.string().max(2_000).optional(),
  classification: z.string().max(50).optional(),
  polarityMap: z
    .object({
      poleL: z.object({ name: z.string().max(200) }).optional(),
      poleR: z.object({ name: z.string().max(200) }).optional(),
      sharedBestHope: z.string().max(1_000).optional(),
      sharedGreatestFear: z.string().max(1_000).optional(),
    })
    .optional(),
  uploadedDocs: z.array(z.object({ name: z.string().max(500) })).max(20).optional(),
}).optional();

const BodySchema = z.object({
  messages: z.array(MessageSchema).min(1).max(50),
  sessionContext: SessionContextSchema,
});

const SYSTEM_FACILITATION_PROMPT = `You are the CCCCO Polarity-to-Action AI Facilitation Co-Pilot, an expert practitioner assistant based on the California Community Colleges Polarity-to-Action Framework (P.A.I.R.).

Your Core Role:
1. Help practitioners (facilitators, college leaders, educators, project managers) turn persistent institutional tensions into coordinated action.
2. Follow the P.A.I.R. Framework:
   - P - Pinpoint the challenge: Help write neutral challenge statements without blame or solution bias (e.g., "How do we [preserves Pole L value] while [protecting Pole R value]?").
   - A - Assess the challenge: Distinguish a solvable Problem (clear deliverable/closed task) vs a Polarity (ongoing relationship between 2 interdependent priorities) vs a Problem inside a Polarity.
   - I - Investigate the system: Map Pole L & Pole R upsides, downside risks of overdoing each pole, Shared Best Hope, and Shared Greatest Fear.
   - R - Respond with an action system: Generate balanced actions for both poles, early warning indicators, metrics, owners, and 30/60/90-day review cycles.

Tone & Style:
- Professional, empathetic, structured, and action-oriented.
- Concise and direct guidance.
- When generating suggestions, produce structured recommendations that can update the session state.

Response Format:
You can return a normal text answer. If you want to suggest concrete updates to the session (like reframing the challenge, classifying, or populating the Polarity Map / Actions), include a JSON block enclosed in \`\`\`json_update ... \`\`\` at the end of your response with the following schema if applicable:
\`\`\`json_update
{
  "neutralChallenge": "Neutral challenge statement...",
  "classification": "problem" | "polarity" | "problem_in_polarity",
  "immediateProblem": "Immediate deliverable...",
  "largerPolarity": "Broader tension...",
  "polarityMap": {
    "poleL": { "name": "...", "upsides": [...], "downsides": [...] },
    "poleR": { "name": "...", "upsides": [...], "downsides": [...] },
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
}
\`\`\`
`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return sendError(res, 405, 'method_not_allowed');
  }

  const parsed = BodySchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(res, 400, 'invalid_request');
  }

  const { messages, sessionContext } = parsed.data;

  try {
    const ai = getGeminiClient();

    const formattedContext = sessionContext
      ? `\nCURRENT SESSION STATE:\n- Step: ${sessionContext.currentStep ?? ''}\n- Raw Challenge: ${sessionContext.rawChallenge ?? '(None yet)'}\n- Neutral Challenge: ${sessionContext.neutralChallenge ?? '(None yet)'}\n- Classification: ${sessionContext.classification ?? ''}\n- Pole L: ${sessionContext.polarityMap?.poleL?.name ?? 'Pole L'}\n- Pole R: ${sessionContext.polarityMap?.poleR?.name ?? 'Pole R'}\n- Shared Best Hope: ${sessionContext.polarityMap?.sharedBestHope ?? '(None)'}\n- Shared Greatest Fear: ${sessionContext.polarityMap?.sharedGreatestFear ?? '(None)'}\n- Uploaded Documents: ${sessionContext.uploadedDocs?.map((d) => d.name).join(', ') || 'None'}`
      : '';

    const promptMessages = [
      { role: 'user', parts: [{ text: `${SYSTEM_FACILITATION_PROMPT}\n\n${formattedContext}` }] },
      ...messages.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
    ];

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: promptMessages,
    });

    const replyText =
      response.text ?? "I've processed your request. How else can I assist with your polarity map?";

    let jsonUpdate = null;
    const updateMatch = replyText.match(/```json_update\s*([\s\S]*?)\s*```/);
    if (updateMatch) {
      try {
        jsonUpdate = JSON.parse(updateMatch[1]);
      } catch {
        // malformed json_update block — ignore silently
      }
    }

    const cleanReplyText = replyText.replace(/```json_update\s*([\s\S]*?)\s*```/g, '').trim();

    res.json({ text: cleanReplyText, jsonUpdate });
  } catch (error) {
    handleApiError(res, 'chat', error);
  }
}
