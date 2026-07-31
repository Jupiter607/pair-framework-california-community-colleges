import React, { useState } from 'react';
import { SessionData, PolarityMap } from '../../types';
import { Layers, Sparkles, Plus, Trash2, ArrowRight, ArrowLeft, Heart, AlertTriangle } from 'lucide-react';
import { enhancePolarityMap } from '../../services/api';

interface InvestigateStepProps {
  session: SessionData;
  onUpdateSession: (updated: Partial<SessionData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const InvestigateStep: React.FC<InvestigateStepProps> = ({ session, onUpdateSession, onNext, onPrev }) => {
  const [isEnhancing, setIsEnhancing] = useState(false);

  const polarityMap: PolarityMap = session.polarityMap || {
    poleL: {
      name: 'Rapid Innovation',
      upsides: ['Faculty & students experiment with emerging tools', 'Colleges respond quickly to workforce needs'],
      downsides: ['Unreviewed tools expose sensitive data', 'Equity gaps widen with uneven access'],
    },
    poleR: {
      name: 'Responsible Governance',
      upsides: ['Student and institutional data are protected', 'Expectations are transparent and consistent'],
      downsides: ['Approval processes become too slow', 'Faculty innovate outside official systems'],
    },
    sharedBestHope: 'A trusted, equitable, and adaptable college system using AI to improve student success.',
    sharedGreatestFear: 'A fragmented system where some colleges adopt unsafe tools while others are immobilized by fear.',
  };

  const updateMap = (newMap: PolarityMap) => {
    onUpdateSession({ polarityMap: newMap });
  };

  const handleAiAutoPopulate = async () => {
    setIsEnhancing(true);
    try {
      const result = await enhancePolarityMap(session, 'polarity_map');
      if (result.polarityMap) {
        onUpdateSession({ polarityMap: result.polarityMap });
      }
    } catch (err) {
      console.error('Failed to enhance polarity map:', err);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Helper to add bullet point to quadrant
  const addBullet = (target: 'poleL_upsides' | 'poleL_downsides' | 'poleR_upsides' | 'poleR_downsides') => {
    const newMap = { ...polarityMap };
    if (target === 'poleL_upsides') newMap.poleL.upsides.push('New benefit of ' + newMap.poleL.name);
    if (target === 'poleL_downsides') newMap.poleL.downsides.push('Risk of overdoing ' + newMap.poleL.name);
    if (target === 'poleR_upsides') newMap.poleR.upsides.push('New benefit of ' + newMap.poleR.name);
    if (target === 'poleR_downsides') newMap.poleR.downsides.push('Risk of overdoing ' + newMap.poleR.name);
    updateMap(newMap);
  };

  // Helper to edit bullet point
  const editBullet = (
    target: 'poleL_upsides' | 'poleL_downsides' | 'poleR_upsides' | 'poleR_downsides',
    index: number,
    text: string
  ) => {
    const newMap = { ...polarityMap };
    if (target === 'poleL_upsides') newMap.poleL.upsides[index] = text;
    if (target === 'poleL_downsides') newMap.poleL.downsides[index] = text;
    if (target === 'poleR_upsides') newMap.poleR.upsides[index] = text;
    if (target === 'poleR_downsides') newMap.poleR.downsides[index] = text;
    updateMap(newMap);
  };

  // Helper to remove bullet point
  const removeBullet = (
    target: 'poleL_upsides' | 'poleL_downsides' | 'poleR_upsides' | 'poleR_downsides',
    index: number
  ) => {
    const newMap = { ...polarityMap };
    if (target === 'poleL_upsides') newMap.poleL.upsides.splice(index, 1);
    if (target === 'poleL_downsides') newMap.poleL.downsides.splice(index, 1);
    if (target === 'poleR_upsides') newMap.poleR.upsides.splice(index, 1);
    if (target === 'poleR_downsides') newMap.poleR.downsides.splice(index, 1);
    updateMap(newMap);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-emerald-800/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-300 border border-emerald-400/30">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-300 tracking-wider uppercase">Step 3 — Investigate</span>
              <h2 className="text-xl font-bold">Map the Polarity System</h2>
            </div>
          </div>

          <button
            type="button"
            id="btn-ai-enhance-map"
            onClick={handleAiAutoPopulate}
            disabled={isEnhancing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 disabled:opacity-50 transition-all shadow-md"
          >
            <Sparkles className={`w-4 h-4 ${isEnhancing ? 'animate-spin' : ''}`} />
            <span>{isEnhancing ? 'Synthesizing Quad-Map...' : 'AI Auto-Map Enhancer'}</span>
          </button>
        </div>
        <p className="text-slate-300 text-sm max-w-3xl mt-2">
          A polarity map makes the whole system visible. Name the legitimate benefits of both Pole L and Pole R before discussing risks.
        </p>
      </div>

      {/* Visual Polarity Map Canvas */}
      <div className="space-y-4 bg-slate-100 p-5 rounded-2xl border border-slate-300 shadow-inner">
        {/* 1. SHARED BEST HOPE (GREEN PILL) */}
        <div className="bg-emerald-600 text-white p-4 rounded-xl shadow-sm text-center border-2 border-emerald-700">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Heart className="w-4 h-4 text-emerald-200 fill-emerald-200" />
            <span className="font-bold text-xs uppercase tracking-wider text-emerald-100">SHARED BEST HOPE</span>
          </div>
          <p className="text-xs text-emerald-100 mb-2 font-medium">What becomes possible when BOTH poles are managed well?</p>
          <textarea
            rows={2}
            value={polarityMap.sharedBestHope}
            onChange={(e) => updateMap({ ...polarityMap, sharedBestHope: e.target.value })}
            placeholder="e.g. A trusted, equitable, and adaptable community college system..."
            className="w-full text-center bg-white/10 text-white font-semibold text-sm rounded-lg p-2.5 border border-emerald-400/40 focus:bg-white/20 focus:outline-hidden"
          />
        </div>

        {/* POLE NAMES HEADER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-sky-700 text-white p-3 rounded-lg flex items-center justify-between border border-sky-800">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-200">POLE L (Left Priority)</span>
            <input
              type="text"
              value={polarityMap.poleL.name}
              onChange={(e) =>
                updateMap({
                  ...polarityMap,
                  poleL: { ...polarityMap.poleL, name: e.target.value },
                })
              }
              placeholder="e.g. Rapid Innovation"
              className="font-bold text-sm bg-sky-950/60 px-3 py-1 rounded-md text-white border border-sky-500/50 w-2/3 text-right focus:outline-hidden"
            />
          </div>

          <div className="bg-teal-700 text-white p-3 rounded-lg flex items-center justify-between border border-teal-800">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-200">POLE R (Right Priority)</span>
            <input
              type="text"
              value={polarityMap.poleR.name}
              onChange={(e) =>
                updateMap({
                  ...polarityMap,
                  poleR: { ...polarityMap.poleR, name: e.target.value },
                })
              }
              placeholder="e.g. Responsible Governance"
              className="font-bold text-sm bg-teal-950/60 px-3 py-1 rounded-md text-white border border-teal-500/50 w-2/3 text-right focus:outline-hidden"
            />
          </div>
        </div>

        {/* 4 QUADRANTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* TOP LEFT: UPSIDES OF POLE L */}
          <div className="bg-sky-50/90 border border-sky-300 rounded-xl p-4 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-sky-200 pb-2 mb-3">
                <span className="font-bold text-xs text-sky-900 uppercase tracking-wide">
                  UPSIDE OF POLE L: {polarityMap.poleL.name || 'Pole L'}
                </span>
                <span className="text-[10px] bg-sky-200 text-sky-900 px-2 py-0.5 rounded-full font-semibold">Benefits & Results</span>
              </div>
              <div className="space-y-2">
                {polarityMap.poleL.upsides.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600 shrink-0" />
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => editBullet('poleL_upsides', idx, e.target.value)}
                      className="w-full text-xs font-medium text-sky-950 bg-white border border-sky-200 rounded-md p-1.5 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeBullet('poleL_upsides', idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => addBullet('poleL_upsides')}
              className="mt-3 text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Benefit
            </button>
          </div>

          {/* TOP RIGHT: UPSIDES OF POLE R */}
          <div className="bg-teal-50/90 border border-teal-300 rounded-xl p-4 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-teal-200 pb-2 mb-3">
                <span className="font-bold text-xs text-teal-900 uppercase tracking-wide">
                  UPSIDE OF POLE R: {polarityMap.poleR.name || 'Pole R'}
                </span>
                <span className="text-[10px] bg-teal-200 text-teal-900 px-2 py-0.5 rounded-full font-semibold">Benefits & Results</span>
              </div>
              <div className="space-y-2">
                {polarityMap.poleR.upsides.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0" />
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => editBullet('poleR_upsides', idx, e.target.value)}
                      className="w-full text-xs font-medium text-teal-950 bg-white border border-teal-200 rounded-md p-1.5 focus:outline-hidden focus:ring-1 focus:ring-teal-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeBullet('poleR_upsides', idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => addBullet('poleR_upsides')}
              className="mt-3 text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Benefit
            </button>
          </div>

          {/* BOTTOM LEFT: DOWNSIDE OF OVERDOING POLE L */}
          <div className="bg-rose-50/90 border border-rose-300 rounded-xl p-4 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-rose-200 pb-2 mb-3">
                <span className="font-bold text-xs text-rose-900 uppercase tracking-wide">
                  DOWNSIDE OF OVERDOING POLE L
                </span>
                <span className="text-[10px] bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full font-semibold">Overuse Risks</span>
              </div>
              <div className="space-y-2">
                {polarityMap.poleL.downsides.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => editBullet('poleL_downsides', idx, e.target.value)}
                      className="w-full text-xs font-medium text-rose-950 bg-white border border-rose-200 rounded-md p-1.5 focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeBullet('poleL_downsides', idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => addBullet('poleL_downsides')}
              className="mt-3 text-xs font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Overuse Risk
            </button>
          </div>

          {/* BOTTOM RIGHT: DOWNSIDE OF OVERDOING POLE R */}
          <div className="bg-amber-50/90 border border-amber-300 rounded-xl p-4 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-amber-200 pb-2 mb-3">
                <span className="font-bold text-xs text-amber-900 uppercase tracking-wide">
                  DOWNSIDE OF OVERDOING POLE R
                </span>
                <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-semibold">Overuse Risks</span>
              </div>
              <div className="space-y-2">
                {polarityMap.poleR.downsides.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => editBullet('poleR_downsides', idx, e.target.value)}
                      className="w-full text-xs font-medium text-amber-950 bg-white border border-amber-200 rounded-md p-1.5 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeBullet('poleR_downsides', idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => addBullet('poleR_downsides')}
              className="mt-3 text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Overuse Risk
            </button>
          </div>
        </div>

        {/* 2. SHARED GREATEST FEAR (RED PILL) */}
        <div className="bg-rose-700 text-white p-4 rounded-xl shadow-sm text-center border-2 border-rose-800">
          <div className="flex items-center justify-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-rose-200" />
            <span className="font-bold text-xs uppercase tracking-wider text-rose-100">SHARED GREATEST FEAR</span>
          </div>
          <p className="text-xs text-rose-100 mb-2 font-medium">What happens when BOTH poles fall into their downsides?</p>
          <textarea
            rows={2}
            value={polarityMap.sharedGreatestFear}
            onChange={(e) => updateMap({ ...polarityMap, sharedGreatestFear: e.target.value })}
            placeholder="e.g. A fragmented system where some colleges adopt unsafe tools while others become paralyzed by fear..."
            className="w-full text-center bg-white/10 text-white font-semibold text-sm rounded-lg p-2.5 border border-rose-400/40 focus:bg-white/20 focus:outline-hidden"
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
          <span>Back to Step 2 (Assess)</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xs"
        >
          <span>Proceed to Step 4 (Respond & Actions)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
