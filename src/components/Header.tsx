import React from 'react';
import { SessionData } from '../types';
import { Bot, BookOpen, Folders, Plus, Sparkles, FileText, Download } from 'lucide-react';

interface HeaderProps {
  session: SessionData;
  onOpenChat: () => void;
  onOpenSessions: () => void;
  onOpenGuidebook: () => void;
  onNewSession: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  session,
  onOpenChat,
  onOpenSessions,
  onOpenGuidebook,
  onNewSession,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Branding & Session Name */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-sm font-black text-lg tracking-wider">
            P
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm sm:text-base tracking-tight text-white leading-tight">
                CCCCO Polarity-to-Action AI
              </h1>
              <span className="text-[10px] bg-indigo-500/30 text-indigo-300 border border-indigo-400/40 px-2 py-0.5 rounded-full font-semibold hidden sm:inline-block">
                Practitioner Workbench
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium truncate max-w-xs sm:max-w-md">
              Active: <span className="text-slate-200 font-semibold">{session.title}</span>
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="btn-open-sessions"
            onClick={onOpenSessions}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-all border border-slate-700"
            title="Manage practitioner sessions"
          >
            <Folders className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">Sessions</span>
          </button>

          <button
            type="button"
            id="btn-open-guidebook"
            onClick={onOpenGuidebook}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-all border border-slate-700"
            title="Read CCCCO Guidebook rules & examples"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Framework Guide</span>
          </button>

          <button
            type="button"
            id="btn-new-session"
            onClick={onNewSession}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Session</span>
          </button>

          <button
            type="button"
            id="btn-toggle-ai-chat"
            onClick={onOpenChat}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-indigo-500 to-sky-500 text-white hover:from-indigo-600 hover:to-sky-600 transition-all shadow-md ring-2 ring-indigo-400/30"
          >
            <Bot className="w-4 h-4 animate-bounce" />
            <span>AI Co-Pilot</span>
          </button>
        </div>
      </div>
    </header>
  );
};
