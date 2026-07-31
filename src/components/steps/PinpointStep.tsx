import React, { useState } from 'react';
import { SessionData } from '../../types';
import { Target, Sparkles, ArrowRight, CheckCircle, HelpCircle, Lightbulb } from 'lucide-react';
import { VoiceInputButton } from '../VoiceInputButton';
import { enhancePolarityMap } from '../../services/api';

interface PinpointStepProps {
  session: SessionData;
  onUpdateSession: (updated: Partial<SessionData>) => void;
  onNext: () => void;
}

export const PinpointStep: React.FC<PinpointStepProps> = ({ session, onUpdateSession, onNext }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAiReframe = async () => {
    if (!session.rawChallenge.trim()) return;
    setIsGenerating(true);
    try {
      const result = await enhancePolarityMap(session, 'pinpoint');
      if (result.neutralChallenge) {
        onUpdateSession({
          neutralChallenge: result.neutralChallenge,
          classification: result.classification || session.classification,
          immediateProblem: result.immediateProblem || session.immediateProblem,
          largerPolarity: result.largerPolarity || session.largerPolarity,
          polarityMap: result.polarityMap || session.polarityMap,
        });
      }
    } catch (err) {
      console.error('Failed to generate neutral challenge:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const applyPresetExample = (biased: string, neutral: string) => {
    onUpdateSession({
      rawChallenge: biased,
      neutralChallenge: neutral,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-indigo-800/40">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-300 border border-indigo-400/30">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-indigo-300 tracking-wider uppercase">Step 1 — Pinpoint</span>
            <h2 className="text-xl font-bold">Pinpoint the Challenge</h2>
          </div>
        </div>
        <p className="text-slate-300 text-sm max-w-3xl">
          State the institutional challenge in neutral language without assigning blame, predetermining a single answer, or framing one pole as inherently good and the other as inherently bad.
        </p>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Challenge & Voice */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label htmlFor="raw-challenge-input" className="block text-sm font-semibold text-slate-800">
                1. Initial Challenge or Recurring Disagreement
              </label>
              <VoiceInputButton
                onTranscript={(text) => {
                  const combined = session.rawChallenge ? `${session.rawChallenge} ${text}` : text;
                  onUpdateSession({ rawChallenge: combined });
                }}
              />
            </div>

            <p className="text-xs text-slate-500 mb-2">
              Describe the friction, frustration, or strategic tension your team experiences (or dictate via mic).
            </p>

            <textarea
              id="raw-challenge-input"
              rows={4}
              value={session.rawChallenge}
              onChange={(e) => onUpdateSession({ rawChallenge: e.target.value })}
              placeholder="e.g., Faculty are using unapproved AI tools without security review and leadership wants to ban them..."
              className="w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              id="btn-ai-reframe"
              onClick={handleAiReframe}
              disabled={isGenerating || !session.rawChallenge.trim()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xs"
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Neutralizing with AI...' : 'Generate Neutral Framing'}</span>
            </button>
            <span className="text-[11px] text-slate-400">Powered by Gemini AI</span>
          </div>
        </div>

        {/* Right: Neutral Reframing Output */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <label htmlFor="neutral-challenge-input" className="block text-sm font-semibold text-slate-800">
                2. Neutral Challenge Statement
              </label>
            </div>

            <p className="text-xs text-slate-500 mb-2">
              Formula: <span className="font-semibold text-slate-700">"How do we [preserve Pole L value] while [protecting Pole R value]?"</span>
            </p>

            <textarea
              id="neutral-challenge-input"
              rows={4}
              value={session.neutralChallenge}
              onChange={(e) => onUpdateSession({ neutralChallenge: e.target.value })}
              placeholder="e.g., How do we enable useful AI experimentation while protecting data, privacy, and institutional trust?"
              className="w-full rounded-lg border border-emerald-300 bg-emerald-50/20 p-3 text-sm text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-end">
            <button
              type="button"
              id="btn-pinpoint-next"
              onClick={onNext}
              disabled={!session.neutralChallenge.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-all shadow-xs"
            >
              <span>Proceed to Step 2 (Assess)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Guidebook Examples Matrix */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="w-5 h-5 text-amber-600" />
          <h3 className="text-sm font-semibold text-slate-800">CCCCO Guidebook Reframing Examples</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              biased: 'How do we stop faculty from using unsafe AI tools?',
              neutral: 'How do we enable useful AI experimentation while protecting data, privacy, and institutional trust?',
              label: 'AI Security vs Innovation',
            },
            {
              biased: 'How do we make every college follow the same process?',
              neutral: 'How do we create statewide coherence while preserving local flexibility?',
              label: 'Statewide Coherence vs Local Flexibility',
            },
            {
              biased: 'How do we automate more student services?',
              neutral: 'How do we improve efficiency while preserving human judgment and student agency?',
              label: 'Automation vs Human Empathy',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-3.5 rounded-lg border border-slate-200 hover:border-indigo-300 transition-all text-xs flex flex-col justify-between space-y-2"
            >
              <div>
                <span className="font-semibold text-indigo-700 block mb-1">{item.label}</span>
                <p className="text-rose-700 bg-rose-50 p-2 rounded-md mb-2 font-mono text-[11px] line-through decoration-rose-400">
                  {item.biased}
                </p>
                <p className="text-emerald-800 bg-emerald-50 p-2 rounded-md font-medium">
                  {item.neutral}
                </p>
              </div>
              <button
                type="button"
                onClick={() => applyPresetExample(item.biased, item.neutral)}
                className="mt-2 text-indigo-600 hover:text-indigo-800 font-semibold text-[11px] text-left hover:underline"
              >
                Use this example →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
