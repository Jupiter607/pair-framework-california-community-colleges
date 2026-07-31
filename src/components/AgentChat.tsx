import React, { useState, useRef, useEffect } from 'react';
import { SessionData, ChatMessage } from '../types';
import { Bot, Send, Sparkles, Volume2, VolumeX, Loader2, Check, ArrowRight, X } from 'lucide-react';
import { VoiceInputButton } from './VoiceInputButton';
import { sendChatMessage } from '../services/api';

interface AgentChatProps {
  session: SessionData;
  onUpdateSession: (updated: Partial<SessionData>) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const AgentChat: React.FC<AgentChatProps> = ({ session, onUpdateSession, isOpen, onClose }) => {
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [enableTts, setEnableTts] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const messages = session.chatHistory || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (customContent?: string) => {
    const textToSend = customContent || inputText.trim();
    if (!textToSend || isSending) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, userMessage];
    onUpdateSession({ chatHistory: updatedHistory });
    setInputText('');
    setIsSending(true);

    try {
      const res = await sendChatMessage(updatedHistory, session);

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: res.text || "I've processed your facilitation request.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: res.jsonUpdate ? { type: 'update_polarity_map', data: res.jsonUpdate } : undefined,
      };

      onUpdateSession({ chatHistory: [...updatedHistory, assistantMessage] });

      // If text-to-speech enabled, read assistant message aloud
      if (enableTts && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(res.text.slice(0, 300));
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: `Facilitator Error: ${err.message || 'Could not process request.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      onUpdateSession({ chatHistory: [...updatedHistory, errorMessage] });
    } finally {
      setIsSending(false);
    }
  };

  const applyAiSuggestion = (jsonUpdate: any) => {
    onUpdateSession({
      neutralChallenge: jsonUpdate.neutralChallenge || session.neutralChallenge,
      classification: jsonUpdate.classification || session.classification,
      immediateProblem: jsonUpdate.immediateProblem || session.immediateProblem,
      largerPolarity: jsonUpdate.largerPolarity || session.largerPolarity,
      polarityMap: jsonUpdate.polarityMap || session.polarityMap,
      actions: jsonUpdate.suggestedActions
        ? [
            ...session.actions,
            ...jsonUpdate.suggestedActions.map((a: any, i: number) => ({
              id: `act-ai-${Date.now()}-${i}`,
              action: a.action,
              poleSupported: a.poleSupported || 'Both',
              owner: a.owner || 'Lead',
              timing: a.timing || '30 days',
              successEvidence: a.successEvidence || 'Measure',
              earlyWarningIndicator: a.earlyWarningIndicator || 'Warning signal',
            })),
          ]
        : session.actions,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white border-l border-slate-300 shadow-2xl z-50 flex flex-col justify-between transition-all">
      {/* Drawer Header */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-500 rounded-lg text-white">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight">P.A.I.R. AI Facilitator</h3>
            <span className="text-[10px] text-indigo-300 font-medium">Gemini 3.6 Practitioner Co-Pilot</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setEnableTts(!enableTts)}
            className={`p-1.5 rounded-lg text-xs transition-all ${
              enableTts ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title={enableTts ? 'Voice output ON (TTS)' : 'Voice output OFF'}
          >
            {enableTts ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Facilitation Prompts */}
      <div className="bg-indigo-50/70 border-b border-indigo-100 p-2.5 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
        {[
          'Convert session to plain language',
          'Reframe challenge neutrally',
          'Identify Pole L & Pole R',
          'Suggest early warning signals',
          'Draft 30-day action plan',
        ].map((promptText, idx) => (
          <button
            type="button"
            key={idx}
            onClick={() => handleSendMessage(promptText)}
            disabled={isSending}
            className="px-2.5 py-1 rounded-full bg-white text-indigo-900 border border-indigo-200 text-[11px] font-semibold hover:bg-indigo-100 whitespace-nowrap shrink-0 transition-all"
          >
            + {promptText}
          </button>
        ))}
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 text-xs">
        {messages.length === 0 ? (
          <div className="text-center py-8 text-slate-500 space-y-2">
            <Bot className="w-10 h-10 text-indigo-400 mx-auto opacity-80" />
            <p className="font-semibold text-slate-700">Welcome, Practitioner!</p>
            <p className="text-[11px] text-slate-500 px-4">
              I am your AI Co-Facilitator. Ask me to help reframe challenges neutrally, classify problems vs polarities, populate your polarity map, or draft early warning signals.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 shadow-2xs ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-xs font-medium'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                  {/* Suggested AI Action Card if update JSON was generated */}
                  {msg.suggestedAction && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/80 bg-indigo-50/80 p-2.5 rounded-xl border border-indigo-200 text-indigo-950">
                      <div className="flex items-center gap-1.5 font-bold text-[11px] mb-1 text-indigo-900">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>AI Facilitation Suggestions Ready</span>
                      </div>
                      <p className="text-[11px] text-indigo-800 mb-2">
                        I've drafted updates for your neutral challenge, polarity map, or actions.
                      </p>
                      <button
                        type="button"
                        onClick={() => applyAiSuggestion(msg.suggestedAction?.data)}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-[11px] hover:bg-indigo-700 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Apply Updates to Session Canvas</span>
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 px-1">{msg.timestamp}</span>
              </div>
            );
          })
        )}
        {isSending && (
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-medium p-2 bg-white rounded-xl border border-indigo-100 max-w-[70%]">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>AI Agent is analyzing session...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-slate-200 space-y-2">
        <div className="flex items-center gap-2">
          <textarea
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ask AI facilitator or dictate voice input..."
            className="flex-1 rounded-lg border border-slate-300 p-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="button"
            id="btn-chat-send"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isSending}
            className="p-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 shrink-0 shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <VoiceInputButton
            onTranscript={(text) => {
              setInputText((prev) => (prev ? `${prev} ${text}` : text));
            }}
          />
          <span className="text-slate-400">Shift+Enter for newline</span>
        </div>
      </div>
    </div>
  );
};
