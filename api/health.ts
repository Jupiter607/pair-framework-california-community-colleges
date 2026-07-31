import type { VercelRequest, VercelResponse } from '@vercel/node';
import { sendError } from './_lib/gemini.js';

const VERSION = process.env.npm_package_version ?? '0.0.0';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return sendError(res, 405, 'method_not_allowed');
  }
  res.json({ status: 'ok', version: VERSION, timestamp: new Date().toISOString() });
}
