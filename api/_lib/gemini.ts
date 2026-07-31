import { GoogleGenAI } from '@google/genai';
import type { VercelResponse } from '@vercel/node';

export const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.0-flash';

export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }
  return new GoogleGenAI({ apiKey });
}

export function sendError(
  res: VercelResponse,
  status: number,
  code: string,
): void {
  res.status(status).json({ error: code });
}

export function handleApiError(
  res: VercelResponse,
  route: string,
  error: unknown,
): void {
  console.error(`[api/${route}]`, error);
  sendError(res, 500, 'internal_error');
}
