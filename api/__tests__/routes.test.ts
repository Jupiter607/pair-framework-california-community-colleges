import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// ---- helpers ----------------------------------------------------------------

function mockRes() {
  const res = {
    _status: 200,
    _body: null as unknown,
    status(code: number) {
      this._status = code;
      return this;
    },
    json(body: unknown) {
      this._body = body;
      return this;
    },
  };
  return res as unknown as VercelResponse & { _status: number; _body: unknown };
}

function mockReq(method: string, body: unknown): VercelRequest {
  return { method, body } as unknown as VercelRequest;
}

// ---- mock Gemini ------------------------------------------------------------

vi.mock('@google/genai', () => {
  const generateContent = vi.fn().mockResolvedValue({ text: '{"transcript":"hello","summary":"test"}' });
  class GoogleGenAI {
    models = { generateContent };
  }
  return { GoogleGenAI };
});

process.env.GEMINI_API_KEY = 'test-key';
process.env.GEMINI_MODEL = 'gemini-test';

// ---- health -----------------------------------------------------------------

describe('GET /api/health', () => {
  it('returns ok', async () => {
    const { default: handler } = await import('../health.js');
    const req = mockReq('GET', null);
    const res = mockRes();
    handler(req, res);
    expect(res._status).toBe(200);
    expect((res._body as { status: string }).status).toBe('ok');
  });

  it('rejects non-GET with 405', async () => {
    const { default: handler } = await import('../health.js');
    const req = mockReq('POST', null);
    const res = mockRes();
    handler(req, res);
    expect(res._status).toBe(405);
  });
});

// ---- chat -------------------------------------------------------------------

describe('POST /api/chat', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 405 for non-POST', async () => {
    const { default: handler } = await import('../chat.js');
    const res = mockRes();
    await handler(mockReq('GET', null), res);
    expect(res._status).toBe(405);
  });

  it('returns 400 for missing messages', async () => {
    const { default: handler } = await import('../chat.js');
    const res = mockRes();
    await handler(mockReq('POST', {}), res);
    expect(res._status).toBe(400);
  });

  it('returns 400 for empty messages array', async () => {
    const { default: handler } = await import('../chat.js');
    const res = mockRes();
    await handler(mockReq('POST', { messages: [] }), res);
    expect(res._status).toBe(400);
  });

  it('accepts valid request', async () => {
    const { default: handler } = await import('../chat.js');
    const res = mockRes();
    await handler(
      mockReq('POST', {
        messages: [{ role: 'user', content: 'Hello' }],
      }),
      res,
    );
    expect(res._status).toBe(200);
  });
});

// ---- analyze-document -------------------------------------------------------

describe('POST /api/analyze-document', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 405 for non-POST', async () => {
    const { default: handler } = await import('../analyze-document.js');
    const res = mockRes();
    await handler(mockReq('GET', null), res);
    expect(res._status).toBe(405);
  });

  it('returns 400 when fileName is missing', async () => {
    const { default: handler } = await import('../analyze-document.js');
    const res = mockRes();
    await handler(mockReq('POST', { textData: 'some text' }), res);
    expect(res._status).toBe(400);
  });

  it('returns 400 when neither base64Data nor textData is provided', async () => {
    const { default: handler } = await import('../analyze-document.js');
    const res = mockRes();
    await handler(mockReq('POST', { fileName: 'test.pdf' }), res);
    expect(res._status).toBe(400);
  });

  it('accepts valid text request', async () => {
    const { default: handler } = await import('../analyze-document.js');
    const res = mockRes();
    await handler(mockReq('POST', { fileName: 'doc.txt', textData: 'some content' }), res);
    expect(res._status).toBe(200);
  });
});

// ---- speech-to-text ---------------------------------------------------------

describe('POST /api/speech-to-text', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 405 for non-POST', async () => {
    const { default: handler } = await import('../speech-to-text.js');
    const res = mockRes();
    await handler(mockReq('GET', null), res);
    expect(res._status).toBe(405);
  });

  it('returns 400 for missing base64Audio', async () => {
    const { default: handler } = await import('../speech-to-text.js');
    const res = mockRes();
    await handler(mockReq('POST', {}), res);
    expect(res._status).toBe(400);
  });

  it('accepts valid request', async () => {
    const { default: handler } = await import('../speech-to-text.js');
    const res = mockRes();
    await handler(mockReq('POST', { base64Audio: 'abc123audio' }), res);
    expect(res._status).toBe(200);
  });
});

// ---- enhance-polarity -------------------------------------------------------

describe('POST /api/enhance-polarity', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 405 for non-POST', async () => {
    const { default: handler } = await import('../enhance-polarity.js');
    const res = mockRes();
    await handler(mockReq('GET', null), res);
    expect(res._status).toBe(405);
  });

  it('returns 400 for missing sessionData', async () => {
    const { default: handler } = await import('../enhance-polarity.js');
    const res = mockRes();
    await handler(mockReq('POST', {}), res);
    expect(res._status).toBe(400);
  });

  it('accepts valid request', async () => {
    const { default: handler } = await import('../enhance-polarity.js');
    const res = mockRes();
    await handler(
      mockReq('POST', {
        sessionData: { rawChallenge: 'test', neutralChallenge: 'how do we...' },
      }),
      res,
    );
    expect(res._status).toBe(200);
  });
});

// ---- plain-language ---------------------------------------------------------

describe('POST /api/plain-language', () => {
  beforeEach(() => vi.clearAllMocks());

  it('returns 405 for non-POST', async () => {
    const { default: handler } = await import('../plain-language.js');
    const res = mockRes();
    await handler(mockReq('GET', null), res);
    expect(res._status).toBe(405);
  });

  it('accepts valid request with customText', async () => {
    const { default: handler } = await import('../plain-language.js');
    const res = mockRes();
    await handler(mockReq('POST', { customText: 'convert this to plain language' }), res);
    expect(res._status).toBe(200);
  });

  it('accepts valid request with sessionData', async () => {
    const { default: handler } = await import('../plain-language.js');
    const res = mockRes();
    await handler(mockReq('POST', { sessionData: { title: 'Test' } }), res);
    expect(res._status).toBe(200);
  });
});
