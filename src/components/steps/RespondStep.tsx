import React, { useState } from 'react';
import { SessionData, ActionItem } from '../../types';
import { CheckSquare, Sparkles, Plus, Trash2, ArrowRight, ArrowLeft, Calendar, UserCheck, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { enhancePolarityMap } from '../../services/api';

interface RespondStepProps {
  session: SessionData;
  onUpdateSession: (updated: Partial<SessionData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const RespondStep: React.FC<RespondStepProps> = ({ session, onUpdateSession, onNext, onPrev }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const actions: ActionItem[] = session.actions || [];

  const handleAiGenerateActions = async () => {
    setIsGenerating(true);
    try {
      const result = await enhancePolarityMap(session, 'actions');
      if (result.suggestedActions && result.suggestedActions.length > 0) {
        const formattedActions: ActionItem[] = result.suggestedActions.map((a: any, idx: number) => ({
          id: `act-${Date.now()}-${idx}`,
          action: a.action,
          poleSupported: a.poleSupported || 'Both',
          owner: a.owner || 'Project Lead',
          timing: a.timing || '30 Days',
          successEvidence: a.successEvidence || 'Observable outcome',
          earlyWarningIndicator: a.earlyWarningIndicator || 'Early warning signal',
        }));
        onUpdateSession({ actions: [...actions, ...formattedActions] });
      }
    } catch (err) {
      console.error('Failed to generate actions:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const addActionItem = () => {
    const newAction: ActionItem = {
      id: `act-${Date.now()}`,
      action: 'New balanced action item',
      poleSupported: 'Both',
      owner: 'Named Owner / Group',
      timing: '30 Days',
      successEvidence: 'Specific measure or proof',
      earlyWarningIndicator: 'Early warning signal if pole is overused',
    };
    onUpdateSession({ actions: [...actions, newAction] });
  };

  const updateActionItem = (id: string, field: keyof ActionItem, value: any) => {
    const updated = actions.map((act) => (act.id === id ? { ...act, [field]: value } : act));
    onUpdateSession({ actions: updated });
  };

  const deleteActionItem = (id: string) => {
    onUpdateSession({ actions: actions.filter((act) => act.id !== id) });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-sky-800/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-500/20 rounded-xl text-sky-300 border border-sky-400/30">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-sky-300 tracking-wider uppercase">Step 4 — Respond</span>
              <h2 className="text-xl font-bold">Respond with an Action System</h2>
            </div>
          </div>

          <button
            type="button"
            id="btn-ai-generate-actions"
            onClick={handleAiGenerateActions}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-sky-500 text-slate-950 hover:bg-sky-400 disabled:opacity-50 transition-all shadow-md"
          >
            <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Drafting Action System...' : 'AI Action & Signals Generator'}</span>
          </button>
        </div>
        <p className="text-slate-300 text-sm max-w-3xl mt-2">
          Convert insight into ongoing behavior. Create balanced actions supporting both Pole L and Pole R, assign named owners, and monitor early warning indicators to detect imbalance.
        </p>
      </div>

      {/* Action System Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 text-sm">Action & Monitoring Plan Matrix</h3>
          <button
            type="button"
            onClick={addActionItem}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Priority Action</span>
          </button>
        </div>

        {actions.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
            <p className="text-sm font-medium text-slate-600 mb-2">No action items defined yet.</p>
            <p className="text-xs text-slate-400 mb-4">Click below or use AI to generate balanced actions and early warning indicators.</p>
            <button
              type="button"
              onClick={handleAiGenerateActions}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Generate Balanced Actions with AI</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 uppercase font-semibold text-[11px] tracking-wider">
                  <th className="p-3 w-1/3">Priority Action</th>
                  <th className="p-3 w-28">Pole</th>
                  <th className="p-3 w-36">Owner</th>
                  <th className="p-3 w-24">Timing</th>
                  <th className="p-3">Success Evidence</th>
                  <th className="p-3">Early Warning Signal</th>
                  <th className="p-3 w-10 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {actions.map((act) => (
                  <tr key={act.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={act.action}
                        onChange={(e) => updateActionItem(act.id, 'action', e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded-md font-medium text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="p-2.5">
                      <select
                        value={act.poleSupported}
                        onChange={(e) => updateActionItem(act.id, 'poleSupported', e.target.value)}
                        className="w-full p-2 border border-slate-200 rounded-md font-semibold text-slate-700 bg-white"
                      >
                        <option value="L">Pole L</option>
                        <option value="R">Pole R</option>
                        <option value="Both">Both Poles</option>
                      </select>
                    </td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={act.owner}
                        onChange={(e) => updateActionItem(act.id, 'owner', e.target.value)}
                        placeholder="Owner name"
                        className="w-full p-2 border border-slate-200 rounded-md text-slate-700 focus:outline-hidden"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={act.timing}
                        onChange={(e) => updateActionItem(act.id, 'timing', e.target.value)}
                        placeholder="30 days"
                        className="w-full p-2 border border-slate-200 rounded-md text-slate-700 focus:outline-hidden"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={act.successEvidence}
                        onChange={(e) => updateActionItem(act.id, 'successEvidence', e.target.value)}
                        placeholder="Success indicator"
                        className="w-full p-2 border border-slate-200 rounded-md text-slate-700 focus:outline-hidden"
                      />
                    </td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={act.earlyWarningIndicator}
                        onChange={(e) => updateActionItem(act.id, 'earlyWarningIndicator', e.target.value)}
                        placeholder="Early warning signal"
                        className="w-full p-2 border border-rose-200 bg-rose-50/30 text-rose-900 rounded-md focus:outline-hidden"
                      />
                    </td>
                    <td className="p-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => deleteActionItem(act.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 30 / 60 / 90-Day Follow-Through Roadmap */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-xs">
        <h3 className="font-semibold text-slate-800 text-sm mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <span>30 / 60 / 90-Day Practitioner Implementation Roadmap</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 30 DAYS: ALIGN */}
          <div className="bg-white border-t-4 border-t-indigo-600 rounded-xl p-4 border-x border-b border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-indigo-900">Within 30 Days</span>
              <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">ALIGN</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 pl-4 list-disc">
              <li>Validate polarity map with affected constituent groups</li>
              <li>Confirm action owners and decision authority</li>
              <li>Establish early warning indicators & metrics</li>
              <li>Place on existing leadership & governance agenda</li>
            </ul>
          </div>

          {/* 60 DAYS: TEST */}
          <div className="bg-white border-t-4 border-t-amber-500 rounded-xl p-4 border-x border-b border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-amber-900">Within 60 Days</span>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">TEST</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 pl-4 list-disc">
              <li>Implement limited, observable actions on both poles</li>
              <li>Gather feedback from participants and stakeholders</li>
              <li>Review early warning indicators for over-emphasis</li>
              <li>Document barriers requiring regional/statewide support</li>
            </ul>
          </div>

          {/* 90 DAYS: ADAPT */}
          <div className="bg-white border-t-4 border-t-emerald-600 rounded-xl p-4 border-x border-b border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-emerald-900">Within 90 Days</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">ADAPT</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 pl-4 list-disc">
              <li>Review evidence against the Shared Best Hope</li>
              <li>Continue, modify, scale, or stop actions based on data</li>
              <li>Update polarity map when assumptions shift</li>
              <li>Share lessons learned with regional learning networks</li>
            </ul>
          </div>
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
          <span>Back to Step 3 (Investigate)</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xs"
        >
          <span>Generate Convening Report-Out</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
