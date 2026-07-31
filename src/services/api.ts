import { SessionData, ChatMessage } from '../types';

export async function sendChatMessage(messages: ChatMessage[], sessionContext: Partial<SessionData>) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, sessionContext }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to communicate with AI Facilitator');
  }
  return response.json();
}

export async function analyzeDocument(file: { name: string; mimeType: string; base64Data?: string; textData?: string }) {
  const response = await fetch('/api/analyze-document', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: file.name,
      mimeType: file.mimeType,
      base64Data: file.base64Data,
      textData: file.textData,
    }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to analyze document');
  }
  return response.json();
}

export async function transcribeAudio(base64Audio: string, mimeType: string = 'audio/webm') {
  const response = await fetch('/api/speech-to-text', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base64Audio, mimeType }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to transcribe speech');
  }
  return response.json();
}

export async function enhancePolarityMap(sessionData: SessionData, targetField?: string) {
  const response = await fetch('/api/enhance-polarity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionData, targetField }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to enhance polarity map');
  }
  return response.json();
}

export async function convertToPlainLanguage(sessionData: SessionData, customText?: string) {
  const response = await fetch('/api/plain-language', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionData, customText }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to convert to plain language');
  }
  return response.json() as Promise<{ plainText: string }>;
}
