import React from 'react';
import { SessionData, ChallengeClassificationType, DiagnosticAnswers } from '../../types';
import { HelpCircle, ArrowRight, ArrowLeft, Check, AlertCircle, Sparkles, Scale, Wrench } from 'lucide-react';
import { enhancePolarityMap } from '../../services/api';

interface AssessStepProps {
  session: SessionData;
  onUpdateSession: (updated: Partial<SessionData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const AssessStep: React.FC<AssessStepProps> = ({ session, onUpdateSession, onNext, onPrev }) => {
  const diagnosticAnswers = session.diagnosticAnswers || {
    q1_clearAnswer: false,
    q2_canBeClosed: false,
    q3_competingPrioritiesRemain: true,
    q4_overemphasizeRisk: true,
    q5_eliminatingSideDamagesPurpose: true,
  };

  const handleDiagnosticChange = (key: keyof DiagnosticAnswers, value: boolean) => {
    const updatedAnswers = { ...diagnosticAnswers, [key]: value };

    // Calculate recommended classification based on rule of thumb
    const problemScore = (updatedAnswers.q1_clearAnswer ? 1 : 0) + (updatedAnswers.q2_canBeClosed ? 1 : 0);
    const polarityScore =
      (updatedAnswers.q3_competingPrioritiesRemain ? 1 : 0) +
      (updatedAnswers.q4_overemphasizeRisk ? 1 : 0) +
      (updatedAnswers.q5_eliminatingSideDamagesPurpose ? 1 : 0);

    let recommended: ChallengeClassificationType = session.classification;
    if (problemScore >= 1 && polarityScore >= 2) {
      recommended = 'problem_in_polarity';
    } else if (polarityScore >= 2) {
      recommended = 'polarity';
    } else if (problemScore >= 1) {
      recommended = 'problem';
    }

    onUpdateSession({
      diagnosticAnswers: updatedAnswers,
      classification: recommended,
    });
  };

  const handleAiClassify = async () => {
    try {
      const result = await enhancePolarityMap(session, 'assess');
      if (result.classification) {
        onUpdateSession({
          classification: result.classification,
          immediateProblem: result.immediateProblem || session.immediateProblem,
          largerPolarity: result.largerPolarity || session.largerPolarity,
        });
      }
    } catch (err) {
      console.error('Failed to classify challenge:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-amber-800/40">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-amber-500/20 rounded-xl text-amber-300 border border-amber-400/30">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-amber-300 tracking-wider uppercase">Step 2 — Assess</span>
            <h2 className="text-xl font-bold">Assess: Problem, Polarity, or Both?</h2>
          </div>
        </div>
        <p className="text-slate-300 text-sm max-w-3xl">
          Determine which management approach is required. Problems require a single decision or completion point. Polarities require ongoing management between two interdependent priorities.
        </p>
      </div>

      {/* Diagnostic Sequence */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-semibold text-slate-800 text-sm">Diagnostic Assessment Questions</h3>
            <p className="text-xs text-slate-500">Answer these 5 questions to classify the management strategy needed.</p>
          </div>
          <button
            type="button"
            onClick={handleAiClassify}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>AI Diagnostic Suggestion</span>
          </button>
        </div>

        <div className="space-y-3">
          {[
            {
              key: 'q1_clearAnswer',
              question: '1. Is there a clear answer, deliverable, or decision?',
              hint: 'e.g. Select a pilot vendor, schedule a workshop, draft policy',
            },
            {
              key: 'q2_canBeClosed',
              question: '2. Can the issue reasonably be completed or closed?',
              hint: 'e.g. Task has a explicit end date and final sign-off',
            },
            {
              key: 'q3_competingPrioritiesRemain',
              question: '3. Will two competing priorities still require attention after the task is completed?',
              hint: 'e.g. Even after the AI policy is written, speed vs compliance remains',
            },
            {
              key: 'q4_overemphasizeRisk',
              question: '4. Does emphasizing either side too strongly create a predictable downside?',
              hint: 'e.g. Too much innovation causes data leaks; too much control stalls adoption',
            },
            {
              key: 'q5_eliminatingSideDamagesPurpose',
              question: '5. Would eliminating either side damage the larger institutional purpose?',
              hint: 'e.g. Suppressing faculty autonomy or ignoring governance hurts students',
            },
          ].map((item) => {
            const isYes = diagnosticAnswers[item.key as keyof DiagnosticAnswers];

            return (
              <div
                key={item.key}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/50 text-xs"
              >
                <div>
                  <p className="font-semibold text-slate-800">{item.question}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">{item.hint}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-4">
                  <button
                    type="button"
                    onClick={() => handleDiagnosticChange(item.key as keyof DiagnosticAnswers, true)}
                    className={`px-3 py-1.5 rounded-md font-semibold text-xs transition-all ${
                      isYes ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDiagnosticChange(item.key as keyof DiagnosticAnswers, false)}
                    className={`px-3 py-1.5 rounded-md font-semibold text-xs transition-all ${
                      !isYes ? 'bg-slate-700 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rule of thumb callout */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Rule of Thumb:</span> "Yes" to Q1 & Q2 = Problem to solve. "Yes" to Q3, Q4, Q5 = Polarity to manage. "Yes" to both sets = Problem embedded within a Polarity.
          </div>
        </div>
      </div>

      {/* Classification Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            type: 'problem' as ChallengeClassificationType,
            title: 'Solvable Problem',
            desc: 'A decision, answer, or deliverable can resolve it.',
            actionLabel: 'Solve it',
            icon: Wrench,
            color: 'border-blue-300 bg-blue-50/50 text-blue-900',
            activeColor: 'border-blue-600 bg-blue-600 text-white shadow-md ring-2 ring-blue-500/20',
          },
          {
            type: 'polarity' as ChallengeClassificationType,
            title: 'Ongoing Polarity',
            desc: 'Two interdependent priorities must be managed over time.',
            actionLabel: 'Manage it',
            icon: Scale,
            color: 'border-emerald-300 bg-emerald-50/50 text-emerald-900',
            activeColor: 'border-emerald-600 bg-emerald-600 text-white shadow-md ring-2 ring-emerald-500/20',
          },
          {
            type: 'problem_in_polarity' as ChallengeClassificationType,
            title: 'Problem inside Polarity',
            desc: 'A practical task nested inside a broader ongoing tension.',
            actionLabel: 'Solve & Manage',
            icon: HelpCircle,
            color: 'border-amber-300 bg-amber-50/50 text-amber-900',
            activeColor: 'border-amber-600 bg-amber-600 text-white shadow-md ring-2 ring-amber-500/20',
          },
        ].map((item) => {
          const isSelected = session.classification === item.type;
          const Icon = item.icon;

          return (
            <button
              type="button"
              key={item.type}
              id={`btn-classify-${item.type}`}
              onClick={() => onUpdateSession({ classification: item.type })}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected ? item.activeColor : `${item.color} hover:border-slate-400`
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-slate-700'}`} />
                  {isSelected && <Check className="w-4 h-4 text-white font-bold" />}
                </div>
                <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                <p className={`text-xs ${isSelected ? 'text-slate-100' : 'text-slate-600'}`}>{item.desc}</p>
              </div>
              <span className={`text-[11px] font-bold uppercase tracking-wider mt-3 ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                {item.actionLabel} →
              </span>
            </button>
          );
        })}
      </div>

      {/* Immediate Problem & Larger Polarity fields */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="immediate-problem-input" className="block text-xs font-semibold text-slate-800 mb-1">
            Immediate Problem to Solve (Deliverable/Task)
          </label>
          <input
            id="immediate-problem-input"
            type="text"
            value={session.immediateProblem}
            onChange={(e) => onUpdateSession({ immediateProblem: e.target.value })}
            placeholder="e.g. Draft and approve an AI sandbox exception policy."
            className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div>
          <label htmlFor="larger-polarity-input" className="block text-xs font-semibold text-slate-800 mb-1">
            Larger Polarity to Manage (Ongoing Tension)
          </label>
          <input
            id="larger-polarity-input"
            type="text"
            value={session.largerPolarity}
            onChange={(e) => onUpdateSession({ largerPolarity: e.target.value })}
            placeholder="e.g. Rapid Innovation & Experimentation AND Responsible Governance & Security."
            className="w-full rounded-lg border border-slate-300 p-2.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Step 1 (Pinpoint)</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xs"
        >
          <span>Proceed to Step 3 (Investigate & Map)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
