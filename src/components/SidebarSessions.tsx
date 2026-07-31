import React from 'react';
import { SessionData } from '../types';
import { GUIDEBOOK_EXAMPLES } from '../data/guidebookExamples';
import { Folders, Plus, Trash2, BookOpen, Check, X, FileUp } from 'lucide-react';

interface SidebarSessionsProps {
  sessions: SessionData[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  onLoadPreset: (exampleId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const SidebarSessions: React.FC<SidebarSessionsProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onLoadPreset,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-0 w-full sm:w-80 bg-white border-r border-slate-300 shadow-2xl z-50 flex flex-col justify-between transition-all">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Folders className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-sm">Practitioner Sessions</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Create New Session Button */}
        <button
          type="button"
          onClick={() => {
            onNewSession();
            onClose();
          }}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Start Blank Facilitation Session</span>
        </button>

        {/* Existing User Sessions */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Your Active Sessions ({sessions.length})
          </h4>
          <div className="space-y-2">
            {sessions.map((sess) => {
              const isActive = sess.id === activeSessionId;
              return (
                <div
                  key={sess.id}
                  onClick={() => {
                    onSelectSession(sess.id);
                    onClose();
                  }}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-semibold ring-1 ring-indigo-500/30'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="overflow-hidden pr-2">
                    <p className="truncate font-bold text-slate-800">{sess.title}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Updated: {new Date(sess.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {sessions.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(sess.id);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-md shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CCCCO Preset Guidebook Case Studies */}
        <div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>Load Statewide Case Studies</span>
          </h4>
          <div className="space-y-2">
            {GUIDEBOOK_EXAMPLES.map((ex) => (
              <div
                key={ex.id}
                onClick={() => {
                  onLoadPreset(ex.id);
                  onClose();
                }}
                className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl hover:border-amber-400 cursor-pointer text-xs transition-all space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950">{ex.strategicArea}</span>
                  <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">Preset</span>
                </div>
                <p className="text-[11px] text-amber-900 line-clamp-2">{ex.neutralChallenge}</p>
                <span className="text-[10px] text-indigo-700 font-semibold hover:underline block pt-1">Load this case study →</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
