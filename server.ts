import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

// Increase body limit to handle document uploads & audio base64
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Lazy initializer for Gemini client to prevent crash if key is missing
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System prompt for the CCCCO Polarity-to-Action Facilitation Agent
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

// 1. API Endpoint: Chat & Facilitation Guidance
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, sessionContext } = req.body;
    const ai = getGeminiClient();

    const formattedContext = sessionContext ? `
CURRENT SESSION STATE:
- Step: ${sessionContext.currentStep}
- Raw Challenge: ${sessionContext.rawChallenge || '(None yet)'}
- Neutral Challenge: ${sessionContext.neutralChallenge || '(None yet)'}
- Classification: ${sessionContext.classification}
- Pole L: ${sessionContext.polarityMap?.poleL?.name || 'Pole L'}
- Pole R: ${sessionContext.polarityMap?.poleR?.name || 'Pole R'}
- Shared Best Hope: ${sessionContext.polarityMap?.sharedBestHope || '(None)'}
- Shared Greatest Fear: ${sessionContext.polarityMap?.sharedGreatestFear || '(None)'}
- Uploaded Documents: ${sessionContext.uploadedDocs?.map((d: any) => d.name).join(', ') || 'None'}
` : '';

    const promptMessages = [
      { role: 'user', parts: [{ text: `${SYSTEM_FACILITATION_PROMPT}\n\n${formattedContext}` }] },
      ...messages.map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }))
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptMessages,
    });

    const replyText = response.text || "I've processed your request. How else can I assist with your polarity map?";
    
    // Check for json_update block
    let jsonUpdate = null;
    const updateMatch = replyText.match(/```json_update\s*([\s\S]*?)\s*```/);
    if (updateMatch) {
      try {
        jsonUpdate = JSON.parse(updateMatch[1]);
      } catch (err) {
        console.warn('Failed to parse json_update:', err);
      }
    }

    // Clean text by removing json_update block for clean chat output
    const cleanReplyText = replyText.replace(/```json_update\s*([\s\S]*?)\s*```/g, '').trim();

    res.json({
      text: cleanReplyText,
      jsonUpdate,
    });
  } catch (error: any) {
    console.error('API /api/chat error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate chat response' });
  }
});

// 2. API Endpoint: Document Analysis (PDF / Text / Image upload)
app.post('/api/analyze-document', async (req, res) => {
  try {
    const { fileName, mimeType, base64Data, textData } = req.body;
    const ai = getGeminiClient();

    let contents: any[] = [];
    
    const analysisPrompt = `You are an expert CCCCO Polarity-to-Action Facilitation Assistant.
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

    if (base64Data) {
      contents = [
        {
          inlineData: {
            mimeType: mimeType || 'application/pdf',
            data: base64Data,
          },
        },
        { text: analysisPrompt },
      ];
    } else {
      contents = [{ text: `${analysisPrompt}\n\nDocument Text Content:\n${textData}` }];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    res.json(parsedData);
  } catch (error: any) {
    console.error('API /api/analyze-document error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze document' });
  }
});

// 3. API Endpoint: Speech / Voice Audio Transcription & Analysis
app.post('/api/speech-to-text', async (req, res) => {
  try {
    const { base64Audio, mimeType } = req.body;
    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        {
          inlineData: {
            mimeType: mimeType || 'audio/webm',
            data: base64Audio,
          },
        },
        {
          text: `Transcribe this voice audio accurately. In addition, summarize the key practitioner point or challenge mentioned.
Return JSON:
{
  "transcript": "Exact transcription of spoken audio...",
  "summary": "Key point or practitioner thought..."
}`,
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const result = JSON.parse(response.text || '{}');
    res.json(result);
  } catch (error: any) {
    console.error('API /api/speech-to-text error:', error);
    res.status(500).json({ error: error.message || 'Failed to process voice audio' });
  }
});

// 4. API Endpoint: Auto-Enhance Polarity Map / Actions
app.post('/api/enhance-polarity', async (req, res) => {
  try {
    const { sessionData, targetField } = req.body;
    const ai = getGeminiClient();

    const prompt = `You are a master Polarity Facilitator. Review the current session context:
Raw Challenge: ${sessionData.rawChallenge}
Neutral Challenge: ${sessionData.neutralChallenge}
Pole L: ${sessionData.polarityMap?.poleL?.name}
Pole R: ${sessionData.polarityMap?.poleR?.name}

Target to enhance: ${targetField || 'entire_map'}

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
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const result = JSON.parse(response.text || '{}');
    res.json(result);
  } catch (error: any) {
    console.error('API /api/enhance-polarity error:', error);
    res.status(500).json({ error: error.message || 'Failed to enhance polarity map' });
  }
});

// 5. API Endpoint: Convert Session Polarity Output into Plain Language
app.post('/api/plain-language', async (req, res) => {
  try {
    const { sessionData, customText } = req.body;
    const ai = getGeminiClient();

    const textToConvert = customText || `
Title: ${sessionData?.title || 'Convening Session'}
Challenge: ${sessionData?.neutralChallenge || sessionData?.rawChallenge}
Classification: ${sessionData?.classification}
Pole L: ${sessionData?.polarityMap?.poleL?.name}
Pole L Upsides: ${sessionData?.polarityMap?.poleL?.upsides?.join(', ')}
Pole L Downsides: ${sessionData?.polarityMap?.poleL?.downsides?.join(', ')}
Pole R: ${sessionData?.polarityMap?.poleR?.name}
Pole R Upsides: ${sessionData?.polarityMap?.poleR?.upsides?.join(', ')}
Pole R Downsides: ${sessionData?.polarityMap?.poleR?.downsides?.join(', ')}
Shared Best Hope: ${sessionData?.polarityMap?.sharedBestHope}
Shared Greatest Fear: ${sessionData?.polarityMap?.sharedGreatestFear}
Action System: ${JSON.stringify(sessionData?.actions || [])}
`;

    const prompt = `You are an expert communicator specializing in Plain Language (6th-8th grade reading level, highly clear, warm, accessible, and jargon-free).
Convert the following Polarity-to-Action facilitation summary into clear Plain Language that students, campus staff, community members, and partners can easily understand.

Avoid academic jargon like "interdependent poles", "matrix", "downside overuse", "bifurcation", "polarity mapping".
Instead use everyday clear headings:
1. What issue are we working on?
2. Why isn't this a simple pick-one choice? (Explain the balance needed)
3. Priority 1 (${sessionData?.polarityMap?.poleL?.name || 'First side'}) - What we gain & What happens if we overdo it
4. Priority 2 (${sessionData?.polarityMap?.poleR?.name || 'Second side'}) - What we gain & What happens if we overdo it
5. What everyone wants (Our Shared Goal)
6. What everyone wants to avoid (Our Shared Fear)
7. What we are doing right now (Our Action Plan in plain words)

Source Content to Convert:
${textToConvert}

Return a clean, well-structured, Markdown plain language response.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    res.json({ plainText: response.text });
  } catch (error: any) {
    console.error('API /api/plain-language error:', error);
    res.status(500).json({ error: error.message || 'Failed to convert to plain language' });
  }
});

// Vite middleware & static file serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
