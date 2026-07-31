import React from 'react';
import { StepId } from '../types';
import { Target, HelpCircle, Layers, CheckSquare, FileText } from 'lucide-react';

interface PairStepperProps {
  currentStep: StepId;
  onSelectStep: (step: StepId) => void;
}

const STEPS: { id: StepId; letter: string; label: string; desc: string; icon: any; color: string }[] = [
  {
    id: 'pinpoint',
    letter: 'P',
    label: 'Pinpoint',
    desc: 'Neutral Challenge',
    icon: Target,
    color: 'bg-indigo-600 border-indigo-600 text-white',
  },
  {
    id: 'assess',
    letter: 'A',
    label: 'Assess',
    desc: 'Problem vs Polarity',
    icon: HelpCircle,
    color: 'bg-amber-500 border-amber-500 text-white',
  },
  {
    id: 'investigate',
    letter: 'I',
    label: 'Investigate',
    desc: 'Polarity Mapping',
    icon: Layers,
    color: 'bg-emerald-600 border-emerald-600 text-white',
  },
  {
    id: 'respond',
    letter: 'R',
    label: 'Respond',
    desc: 'Actions & Signals',
    icon: CheckSquare,
    color: 'bg-sky-600 border-sky-600 text-white',
  },
  {
    id: 'report',
    letter: 'Out',
    label: 'Report-Out',
    desc: 'Convening Summary',
    icon: FileText,
    color: 'bg-slate-800 border-slate-800 text-white',
  },
];

export const PairStepper: React.FC<PairStepperProps> = ({ currentStep, onSelectStep }) => {
  return (
    <div className="w-full bg-white border-b border-slate-200 px-4 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 scrollbar-none w-full md:w-auto">
          {STEPS.map((step, idx) => {
            const isActive = currentStep === step.id;
            const StepIcon = step.icon;

            return (
              <React.Fragment key={step.id}>
                {idx > 0 && <div className="hidden sm:block w-4 h-0.5 bg-slate-200 shrink-0" />}

                <button
                  type="button"
                  id={`btn-step-${step.id}`}
                  onClick={() => onSelectStep(step.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all border shrink-0 ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-indigo-500/20'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-md font-bold text-xs flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {step.letter}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-semibold text-xs leading-tight">
                      <span>{step.label}</span>
                      <StepIcon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-300' : 'text-slate-400'}`} />
                    </div>
                    <span className={`text-[10px] block leading-tight ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                      {step.desc}
                    </span>
                  </div>
                </button>
              </React.Fragment>
            );
          })}
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <span className="font-semibold text-indigo-700">CCCCO P.A.I.R. Rule:</span>
          <span>Problems require solutions. Polarities require ongoing management.</span>
        </div>
      </div>
    </div>
  );
};
