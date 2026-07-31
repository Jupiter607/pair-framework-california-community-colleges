import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { SessionData } from '../../types';
import { FileText, Copy, Download, Printer, Check, ArrowLeft, Sparkles, Languages, RefreshCw } from 'lucide-react';
import { sendChatMessage, convertToPlainLanguage } from '../../services/api';

interface ReportStepProps {
  session: SessionData;
  onUpdateSession: (updated: Partial<SessionData>) => void;
  onPrev: () => void;
}

export const ReportStep: React.FC<ReportStepProps> = ({ session, onUpdateSession, onPrev }) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isConvertingPlain, setIsConvertingPlain] = useState(false);
  const [viewMode, setViewMode] = useState<'standard' | 'plain'>('standard');

  const reportSummary =
    session.reportSummary ||
    `THE CCCCO POLARITY-TO-ACTION CONVENING REPORT-OUT

CHALLENGE: ${session.neutralChallenge || session.rawChallenge || 'Not specified'}

CLASSIFICATION: ${
      session.classification === 'polarity'
        ? 'Ongoing Polarity (Manage it over time)'
        : session.classification === 'problem_in_polarity'
        ? 'Problem Embedded within a Polarity (Solve & Manage)'
        : 'Solvable Problem (Solve it)'
    }

INTERDEPENDENT POLES:
- Pole L: ${session.polarityMap?.poleL?.name || 'Pole L'}
- Pole R: ${session.polarityMap?.poleR?.name || 'Pole R'}

SHARED BEST HOPE:
${session.polarityMap?.sharedBestHope || 'N/A'}

SHARED GREATEST FEAR:
${session.polarityMap?.sharedGreatestFear || 'N/A'}

MOST IMPORTANT INSIGHT:
Managing this tension requires balancing ${session.polarityMap?.poleL?.name || 'Pole L'} with ${
      session.polarityMap?.poleR?.name || 'Pole R'
    } rather than forcing a one-sided resolution.

IMMEDIATE ACTION PLAN:
${
  session.actions?.map((a) => `- ${a.action} (Owner: ${a.owner}, Timing: ${a.timing})`).join('\n') ||
  '- Action items pending'
}

30/60/90-DAY REVIEW DATE: ${new Date(Date.now() + 30 * 86400000).toLocaleDateString()}
`;

  const handleCopyReport = () => {
    const textToCopy = viewMode === 'plain' && session.plainLanguageSummary ? session.plainLanguageSummary : reportSummary;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const textToDownload = viewMode === 'plain' && session.plainLanguageSummary ? session.plainLanguageSummary : reportSummary;
    const blob = new Blob([textToDownload], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `polarity-report-${viewMode}-${session.title.toLowerCase().replace(/\s+/g, '-')}.md`;
    link.click();
  };

  const handlePrint = () => {
    try {
      window.focus();
      const reportElement = document.getElementById('printable-report');

      // Check if running inside iframe
      const isIframe = window.self !== window.top;

      if (isIframe && reportElement) {
        // Create popup window for clean iframe printing
        const printWin = window.open('', '_blank', 'width=900,height=800');
        if (printWin) {
          printWin.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>${session.title.replace(/"/g, '&quot;')} - Convenient Report</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
                  body {
                    font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif;
                    padding: 24px;
                    background: #ffffff !important;
                    color: #0f172a !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                  }
                  @media print {
                    body { padding: 0 !important; }
                    @page { margin: 1.2cm; size: letter portrait; }
                  }
                </style>
              </head>
              <body>
                <div style="max-width: 850px; margin: 0 auto;">
                  ${reportElement.innerHTML}
                </div>
                <script>
                  window.onload = function() {
                    setTimeout(function() {
                      window.focus();
                      window.print();
                    }, 500);
                  };
                </script>
              </body>
            </html>
          `);
          printWin.document.close();
          return;
        }
      }

      // Direct window print fallback
      window.print();
    } catch (err) {
      console.warn('Printing fallback executed:', err);
      window.print();
    }
  };

  const handleAiRefineSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const promptText = `Generate a polished 1-page Convening Report-Out summary based on this session:
Challenge: ${session.neutralChallenge}
Classification: ${session.classification}
Pole L: ${session.polarityMap?.poleL?.name}
Pole R: ${session.polarityMap?.poleR?.name}
Shared Hope: ${session.polarityMap?.sharedBestHope}
Shared Fear: ${session.polarityMap?.sharedGreatestFear}
Actions: ${JSON.stringify(session.actions)}
`;
      const res = await sendChatMessage([{ id: '1', role: 'user', content: promptText, timestamp: '' }], session);
      if (res.text) {
        onUpdateSession({ reportSummary: res.text });
      }
    } catch (err) {
      console.error('Failed to generate summary:', err);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleConvertToPlainLanguage = async () => {
    setIsConvertingPlain(true);
    try {
      const res = await convertToPlainLanguage(session);
      if (res.plainText) {
        onUpdateSession({ plainLanguageSummary: res.plainText });
        setViewMode('plain');
      }
    } catch (err) {
      console.error('Failed plain language conversion:', err);
      // Fallback local plain language generator if API fails
      const fallbackPlain = `# Plain Language Summary: ${session.title}

## 📌 What issue are we working on?
${session.neutralChallenge || session.rawChallenge || 'We are balancing two important goals.'}

## ⚖️ Why can't we just pick one side?
We need to balance **${session.polarityMap?.poleL?.name || 'our first priority'}** and **${session.polarityMap?.poleR?.name || 'our second priority'}**. Focusing only on one will cause us to lose the benefits of the other.

## 🔵 Priority 1: ${session.polarityMap?.poleL?.name}
- **What we gain when balanced:** ${session.polarityMap?.poleL?.upsides?.join('; ') || 'Essential strength'}
- **What happens if overused:** ${session.polarityMap?.poleL?.downsides?.join('; ') || 'Risks and friction'}

## 🟢 Priority 2: ${session.polarityMap?.poleR?.name}
- **What we gain when balanced:** ${session.polarityMap?.poleR?.upsides?.join('; ') || 'Essential strength'}
- **What happens if overused:** ${session.polarityMap?.poleR?.downsides?.join('; ') || 'Risks and friction'}

## 🌟 What everyone wants to achieve (Our Shared Goal)
${session.polarityMap?.sharedBestHope || 'Success and equity for all students and team members.'}

## ⚠️ What everyone wants to avoid (Our Shared Fear)
${session.polarityMap?.sharedGreatestFear || 'System breakdown or team burnout.'}

## 🚀 What we are doing right now
${session.actions?.map((a) => `- **${a.action}**: Led by ${a.owner} (${a.timing})`).join('\n') || '- Setting up action steps'}
`;
      onUpdateSession({ plainLanguageSummary: fallbackPlain });
      setViewMode('plain');
    } finally {
      setIsConvertingPlain(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 no-print">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-300 border border-indigo-400/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-indigo-300 tracking-wider uppercase">Convening Output</span>
              <h2 className="text-xl font-bold">Convening Report-Out Summary</h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Plain Language Button */}
            <button
              type="button"
              id="btn-convert-plain-language"
              onClick={handleConvertToPlainLanguage}
              disabled={isConvertingPlain}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-xs ${
                viewMode === 'plain'
                  ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 ring-2 ring-amber-300/50'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500'
              }`}
              title="Convert output into plain, accessible language for non-technical stakeholders"
            >
              <Languages className={`w-4 h-4 ${isConvertingPlain ? 'animate-spin' : ''}`} />
              <span>{isConvertingPlain ? 'Translating...' : 'Convert to Plain Language'}</span>
            </button>

            <button
              type="button"
              onClick={handleAiRefineSummary}
              disabled={isGeneratingSummary}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xs"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGeneratingSummary ? 'animate-spin' : ''}`} />
              <span>{isGeneratingSummary ? 'Refining...' : 'AI Refine Report'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyReport}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition-all border border-white/20"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition-all border border-white/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .md</span>
            </button>

            <button
              type="button"
              id="btn-print-pdf"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-sky-500 text-white hover:bg-sky-400 transition-all shadow-sm ring-1 ring-sky-300/50"
              title="Print document or save as PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* View Mode Switcher Controls */}
      <div className="flex items-center justify-between bg-white rounded-xl p-2 border border-slate-200 shadow-xs max-w-4xl mx-auto no-print">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 pl-2">Format View:</span>
          <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('standard')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                viewMode === 'standard' ? 'bg-white text-indigo-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Standard Framework Report
            </button>
            <button
              type="button"
              onClick={() => {
                if (!session.plainLanguageSummary) {
                  handleConvertToPlainLanguage();
                } else {
                  setViewMode('plain');
                }
              }}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'plain' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Languages className="w-3.5 h-3.5" />
              <span>Plain Language Version</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 pr-2">
          {viewMode === 'plain' && session.plainLanguageSummary && (
            <button
              type="button"
              onClick={handleConvertToPlainLanguage}
              disabled={isConvertingPlain}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 hover:text-amber-900 bg-amber-50 px-2 py-1 rounded-md border border-amber-200"
            >
              <RefreshCw className={`w-3 h-3 ${isConvertingPlain ? 'animate-spin' : ''}`} />
              <span>Regenerate Plain Text</span>
            </button>
          )}
          <span className="text-[11px] text-slate-500 font-medium hidden sm:block">
            {viewMode === 'plain' ? '✨ Simplified for community & non-technical audiences' : '📋 Academic & Institutional Facilitation Format'}
          </span>
        </div>
      </div>

      {/* Printable Report Document Card */}
      {viewMode === 'standard' ? (
        <div id="printable-report" className="bg-white rounded-2xl border border-slate-300 p-8 shadow-md max-w-4xl mx-auto font-sans text-slate-800 space-y-6">
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">CCCCO POLARITY-TO-ACTION CONVENING REPORT-OUT</h1>
              <p className="text-xs text-slate-500 mt-1">California Community Colleges | Statewide Facilitation Resource</p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p className="font-semibold text-slate-700">{session.title}</p>
              <p>Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          {/* Challenge & Classification */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="md:col-span-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Challenge Statement</span>
              <p className="text-sm font-semibold text-slate-900">{session.neutralChallenge || session.rawChallenge || 'No challenge defined.'}</p>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Classification</span>
              <p className="text-xs font-bold text-indigo-700 bg-indigo-50 inline-block px-2.5 py-1 rounded-md border border-indigo-200">
                {session.classification === 'polarity'
                  ? 'Ongoing Polarity'
                  : session.classification === 'problem_in_polarity'
                  ? 'Problem inside Polarity'
                  : 'Solvable Problem'}
              </p>
            </div>
          </div>

          {/* Polarity Poles & Hopes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-sky-200 bg-sky-50/50 p-4 rounded-xl">
              <h3 className="font-bold text-xs text-sky-900 uppercase tracking-wider mb-2">Pole L: {session.polarityMap?.poleL?.name}</h3>
              <p className="text-xs font-semibold text-slate-700 mb-1">Key Benefits:</p>
              <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4 mb-3">
                {session.polarityMap?.poleL?.upsides?.map((u, i) => <li key={i}>{u}</li>)}
              </ul>
              <p className="text-xs font-semibold text-rose-800 mb-1">Overuse Risks:</p>
              <ul className="text-xs text-rose-700 space-y-1 list-disc pl-4">
                {session.polarityMap?.poleL?.downsides?.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </div>

            <div className="border border-teal-200 bg-teal-50/50 p-4 rounded-xl">
              <h3 className="font-bold text-xs text-teal-900 uppercase tracking-wider mb-2">Pole R: {session.polarityMap?.poleR?.name}</h3>
              <p className="text-xs font-semibold text-slate-700 mb-1">Key Benefits:</p>
              <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4 mb-3">
                {session.polarityMap?.poleR?.upsides?.map((u, i) => <li key={i}>{u}</li>)}
              </ul>
              <p className="text-xs font-semibold text-amber-800 mb-1">Overuse Risks:</p>
              <ul className="text-xs text-amber-700 space-y-1 list-disc pl-4">
                {session.polarityMap?.poleR?.downsides?.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </div>
          </div>

          {/* Shared Hope & Fear */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">Shared Best Hope</span>
              <p className="text-xs text-emerald-950 font-medium">{session.polarityMap?.sharedBestHope}</p>
            </div>

            <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl">
              <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block mb-1">Shared Greatest Fear</span>
              <p className="text-xs text-rose-950 font-medium">{session.polarityMap?.sharedGreatestFear}</p>
            </div>
          </div>

          {/* Immediate Action System Table */}
          <div>
            <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-2">Committed Action System</h3>
            <table className="w-full text-left text-xs border border-slate-300">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-semibold">
                  <th className="p-2 border-r border-slate-300">Action Item</th>
                  <th className="p-2 border-r border-slate-300 w-20">Pole</th>
                  <th className="p-2 border-r border-slate-300">Owner</th>
                  <th className="p-2 border-r border-slate-300">Timing</th>
                  <th className="p-2">Early Warning Signal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {session.actions?.map((act) => (
                  <tr key={act.id}>
                    <td className="p-2 border-r border-slate-200 font-medium text-slate-800">{act.action}</td>
                    <td className="p-2 border-r border-slate-200 font-semibold">{act.poleSupported}</td>
                    <td className="p-2 border-r border-slate-200 text-slate-700">{act.owner}</td>
                    <td className="p-2 border-r border-slate-200 text-slate-700">{act.timing}</td>
                    <td className="p-2 text-rose-800 font-medium">{act.earlyWarningIndicator}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer closing quote */}
          <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-500 italic">
            "The objective is not perfect balance. The objective is purposeful movement between two necessary priorities without becoming trapped in the downside of either one."
          </div>
        </div>
      ) : (
        /* Plain Language Document Card */
        <div id="printable-report" className="bg-white rounded-2xl border-2 border-amber-300 p-8 shadow-md max-w-4xl mx-auto font-sans text-slate-800 space-y-6">
          <div className="border-b-2 border-amber-400 pb-4 flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-900 rounded-md text-xs font-bold mb-1">
                <Languages className="w-4 h-4 text-amber-600" />
                <span>Plain Language Summary (Community & Stakeholder View)</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">{session.title}</h1>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p>Date: {new Date().toLocaleDateString()}</p>
              <p className="text-amber-700 font-semibold">Reading Level: Accessible / Plain Language</p>
            </div>
          </div>

          {session.plainLanguageSummary ? (
            <div className="plain-markdown bg-amber-50/40 p-6 rounded-2xl border border-amber-200 text-slate-800 space-y-3 leading-relaxed">
              <ReactMarkdown>{session.plainLanguageSummary}</ReactMarkdown>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl">
                <h3 className="font-bold text-sm text-sky-900 mb-1">📌 What issue are we working on?</h3>
                <p className="text-xs text-slate-800">{session.neutralChallenge || session.rawChallenge}</p>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <h3 className="font-bold text-sm text-amber-900 mb-1">⚖️ Why can't we just pick one side?</h3>
                <p className="text-xs text-slate-800">
                  This isn't a problem with one quick answer. We need to balance both <strong>{session.polarityMap?.poleL?.name}</strong> and <strong>{session.polarityMap?.poleR?.name}</strong> so our college succeeds without burning out.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
                  <h4 className="font-bold text-xs text-blue-900 uppercase">Priority 1: {session.polarityMap?.poleL?.name}</h4>
                  <div>
                    <span className="font-bold text-xs text-slate-700 block">Good things when balanced:</span>
                    <ul className="list-disc pl-4 text-xs text-slate-600 space-y-0.5">
                      {session.polarityMap?.poleL?.upsides?.map((u, i) => <li key={i}>{u}</li>)}
                    </ul>
                  </div>
                  <div>
                    <span className="font-bold text-xs text-rose-800 block">What happens if overdone:</span>
                    <ul className="list-disc pl-4 text-xs text-rose-700 space-y-0.5">
                      {session.polarityMap?.poleL?.downsides?.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl space-y-2">
                  <h4 className="font-bold text-xs text-teal-900 uppercase">Priority 2: {session.polarityMap?.poleR?.name}</h4>
                  <div>
                    <span className="font-bold text-xs text-slate-700 block">Good things when balanced:</span>
                    <ul className="list-disc pl-4 text-xs text-slate-600 space-y-0.5">
                      {session.polarityMap?.poleR?.upsides?.map((u, i) => <li key={i}>{u}</li>)}
                    </ul>
                  </div>
                  <div>
                    <span className="font-bold text-xs text-amber-800 block">What happens if overdone:</span>
                    <ul className="list-disc pl-4 text-xs text-amber-700 space-y-0.5">
                      {session.polarityMap?.poleR?.downsides?.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <h4 className="font-bold text-xs text-emerald-900 mb-1">🌟 What everyone hopes to achieve</h4>
                  <p className="text-xs text-emerald-950">{session.polarityMap?.sharedBestHope}</p>
                </div>
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
                  <h4 className="font-bold text-xs text-rose-900 mb-1">⚠️ What everyone wants to prevent</h4>
                  <p className="text-xs text-rose-950">{session.polarityMap?.sharedGreatestFear}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-2">🚀 Our Immediate Action Plan in Plain Words</h3>
                <div className="space-y-2 text-xs">
                  {session.actions?.map((act, i) => (
                    <div key={act.id} className="p-2.5 bg-white rounded-lg border border-slate-200 flex flex-col sm:flex-row justify-between gap-2">
                      <div>
                        <span className="font-bold text-slate-800">{i + 1}. {act.action}</span>
                        <p className="text-slate-500 text-[11px]">Warning sign to watch for: <span className="text-rose-700 font-medium">{act.earlyWarningIndicator}</span></p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-md text-[10px] block mb-0.5">{act.owner}</span>
                        <span className="text-slate-400 text-[10px]">{act.timing}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-amber-200 text-center text-xs text-amber-900 font-medium italic">
            "Plain Language helps everyone—faculty, students, staff, and leadership—understand our shared commitments and work together effectively."
          </div>
        </div>
      )}

      {/* Back button */}
      <div className="flex items-center justify-start pt-2 no-print">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Step 4 (Respond)</span>
        </button>
      </div>
    </div>
  );
};

