import React from 'react';
import { BookOpen, X, CheckCircle, Scale, Wrench, ShieldAlert } from 'lucide-react';

interface GuidebookDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuidebookDrawer: React.FC<GuidebookDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[500px] bg-white border-l border-slate-300 shadow-2xl z-50 flex flex-col justify-between transition-all">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <div>
            <h3 className="font-bold text-sm">CCCCO Guidebook Reference</h3>
            <span className="text-[10px] text-amber-300">Statewide Facilitation Resource</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs text-slate-800">
        {/* Central Core Rule */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 text-amber-950 font-medium">
          <h4 className="font-bold text-sm text-amber-900 mb-1">Central Core Question</h4>
          <p className="text-xs mb-2 italic font-semibold">"Can this be solved once, or must it be continuously managed?"</p>
          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-amber-200">
            <div className="bg-white p-2 rounded-lg border border-amber-200">
              <span className="font-bold text-blue-900 block">PROBLEM</span>
              <span>A decision, deliverable, or answer resolves it. <strong>Solve it.</strong></span>
            </div>
            <div className="bg-white p-2 rounded-lg border border-amber-200">
              <span className="font-bold text-emerald-900 block">POLARITY</span>
              <span>Two interdependent priorities managed over time. <strong>Manage it.</strong></span>
            </div>
          </div>
        </div>

        {/* The P.A.I.R. Framework */}
        <div>
          <h4 className="font-bold text-sm text-slate-900 mb-2">The P.A.I.R. Framework Steps</h4>
          <div className="space-y-2">
            <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-lg">
              <span className="font-bold text-indigo-900 block">P — Pinpoint the Challenge</span>
              <span>State the issue in neutral language without blame or solution bias.</span>
            </div>
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
              <span className="font-bold text-amber-900 block">A — Assess the Type of Challenge</span>
              <span>Use the 5 diagnostic questions to classify problem vs polarity.</span>
            </div>
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
              <span className="font-bold text-emerald-900 block">I — Investigate the System</span>
              <span>Map Pole L/R benefits, overuse risks, shared best hope, and shared greatest fear.</span>
            </div>
            <div className="p-2.5 bg-sky-50 border border-sky-200 rounded-lg">
              <span className="font-bold text-sky-900 block">R — Respond with Action System</span>
              <span>Establish balanced actions, early warning signals, owners, and review dates.</span>
            </div>
          </div>
        </div>

        {/* Common Statewide Tensions Matrix */}
        <div>
          <h4 className="font-bold text-sm text-slate-900 mb-2">Common Statewide Tensions Matrix</h4>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="p-2">Strategic Area</th>
                  <th className="p-2 text-sky-800">Pole L</th>
                  <th className="p-2 text-teal-800">Pole R</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-2 font-semibold">AI Adoption</td>
                  <td className="p-2">Rapid Innovation</td>
                  <td className="p-2">Responsible Governance</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold">Instruction</td>
                  <td className="p-2">Faculty Autonomy</td>
                  <td className="p-2">Institutional Consistency</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold">Student AI Use</td>
                  <td className="p-2">Access & Experimentation</td>
                  <td className="p-2">Academic Integrity</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold">Data Policy</td>
                  <td className="p-2">Expanded Analytics</td>
                  <td className="p-2">Privacy & Security</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold">Workforce Ed</td>
                  <td className="p-2">Employer Responsiveness</td>
                  <td className="p-2">Academic Rigor</td>
                </tr>
                <tr>
                  <td className="p-2 font-semibold">Operations</td>
                  <td className="p-2">Automation & Efficiency</td>
                  <td className="p-2">Human Empathy & Judgment</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Facilitator Script Stance */}
        <div className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 space-y-2">
          <h4 className="font-bold text-xs text-indigo-300 uppercase tracking-wider">Suggested Facilitator Script</h4>
          <p className="italic text-[11px] text-slate-300">
            "Today we are not trying to eliminate tension. We are learning to distinguish issues we can solve from tensions we must manage over time."
          </p>
          <p className="italic text-[11px] text-slate-300">
            When participants argue for one side, ask: <span className="text-amber-300 font-semibold font-sans">"What value are you protecting?"</span> Then ask: <span className="text-amber-300 font-semibold font-sans">"What downside appears when that value is overused?"</span>
          </p>
        </div>
      </div>
    </div>
  );
};
