import React, { useState, useEffect } from 'react';
import { SessionData, StepId, UploadedDoc } from './types';
import { GUIDEBOOK_EXAMPLES } from './data/guidebookExamples';
import { Header } from './components/Header';
import { PairStepper } from './components/PairStepper';
import { PinpointStep } from './components/steps/PinpointStep';
import { AssessStep } from './components/steps/AssessStep';
import { InvestigateStep } from './components/steps/InvestigateStep';
import { RespondStep } from './components/steps/RespondStep';
import { ReportStep } from './components/steps/ReportStep';
import { AgentChat } from './components/AgentChat';
import { SidebarSessions } from './components/SidebarSessions';
import { GuidebookDrawer } from './components/GuidebookDrawer';
import { DocumentUploader } from './components/DocumentUploader';

const STORAGE_KEY = 'ccc_polarity_sessions_v1';

const createDefaultSession = (title: string = 'AI Adoption & Governance Tension'): SessionData => {
  const example = GUIDEBOOK_EXAMPLES[0];
  return {
    id: `sess-${Date.now()}`,
    title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentStep: 'pinpoint',
    rawChallenge: example.rawChallenge,
    neutralChallenge: example.neutralChallenge,
    classification: example.classification,
    classificationEvidence: 'Standard AI adoption tension in higher education',
    immediateProblem: example.immediateProblem,
    largerPolarity: example.largerPolarity,
    diagnosticAnswers: {
      q1_clearAnswer: true,
      q2_canBeClosed: true,
      q3_competingPrioritiesRemain: true,
      q4_overemphasizeRisk: true,
      q5_eliminatingSideDamagesPurpose: true,
    },
    polarityMap: example.polarityMap,
    actions: example.actions,
    followThrough: {
      align30Days: ['Validate polarity map with constituent leaders', 'Confirm action owners'],
      test60Days: ['Implement sandbox pilot program', 'Monitor data entry logs'],
      adapt90Days: ['Review pilot adoption rate & incident metrics'],
    },
    uploadedDocs: [],
    voiceNotes: [],
    chatHistory: [
      {
        id: 'msg-init',
        role: 'assistant',
        content:
          'Welcome to the CCCCO Polarity-to-Action Practitioner AI Workbench. I am ready to help you turn complex institutional tensions into coordinated action.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ],
  };
};

export default function App() {
  const [sessions, setSessions] = useState<SessionData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load sessions from storage', e);
    }
    return [createDefaultSession()];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => sessions[0]?.id || '');

  // Drawers
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSessionsOpen, setIsSessionsOpen] = useState(false);
  const [isGuidebookOpen, setIsGuidebookOpen] = useState(false);

  // Active Session helper
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.warn('Failed to save sessions to storage', e);
    }
  }, [sessions]);

  const updateActiveSession = (updatedFields: Partial<SessionData>) => {
    setSessions((prevSessions) =>
      prevSessions.map((sess) => {
        if (sess.id === activeSession.id) {
          return {
            ...sess,
            ...updatedFields,
            updatedAt: new Date().toISOString(),
          };
        }
        return sess;
      })
    );
  };

  const handleSelectStep = (step: StepId) => {
    updateActiveSession({ currentStep: step });
  };

  const handleNewSession = () => {
    const newSess = createDefaultSession(`New Facilitation ${sessions.length + 1}`);
    newSess.rawChallenge = '';
    newSess.neutralChallenge = '';
    setSessions((prev) => [newSess, ...prev]);
    setActiveSessionId(newSess.id);
  };

  const handleDeleteSession = (id: string) => {
    if (sessions.length <= 1) return;
    const filtered = sessions.filter((s) => s.id !== id);
    setSessions(filtered);
    if (activeSessionId === id) {
      setActiveSessionId(filtered[0].id);
    }
  };

  const handleLoadPreset = (exampleId: string) => {
    const example = GUIDEBOOK_EXAMPLES.find((e) => e.id === exampleId) || GUIDEBOOK_EXAMPLES[0];
    const newSess: SessionData = {
      id: `sess-preset-${Date.now()}`,
      title: `${example.strategicArea} Case Study`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currentStep: 'pinpoint',
      rawChallenge: example.rawChallenge,
      neutralChallenge: example.neutralChallenge,
      classification: example.classification,
      classificationEvidence: 'Loaded from CCCCO Guidebook Case Study',
      immediateProblem: example.immediateProblem,
      largerPolarity: example.largerPolarity,
      diagnosticAnswers: {
        q1_clearAnswer: true,
        q2_canBeClosed: true,
        q3_competingPrioritiesRemain: true,
        q4_overemphasizeRisk: true,
        q5_eliminatingSideDamagesPurpose: true,
      },
      polarityMap: example.polarityMap,
      actions: example.actions,
      followThrough: {
        align30Days: ['Validate map with leadership'],
        test60Days: ['Implement initial pilot actions'],
        adapt90Days: ['Review metrics against shared hope'],
      },
      uploadedDocs: [],
      voiceNotes: [],
      chatHistory: [
        {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: `Loaded the "${example.strategicArea}" case study from the CCCCO Guidebook. You can explore or edit its P.A.I.R. polarity map!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    };

    setSessions((prev) => [newSess, ...prev]);
    setActiveSessionId(newSess.id);
  };

  const handleDocumentAnalyzed = (doc: UploadedDoc, aiResult: any) => {
    const updatedDocs = [...activeSession.uploadedDocs, doc];
    updateActiveSession({
      uploadedDocs: updatedDocs,
      rawChallenge: activeSession.rawChallenge || aiResult.primaryChallenge || '',
      neutralChallenge: aiResult.neutralChallenge || activeSession.neutralChallenge,
      classification: aiResult.classification || activeSession.classification,
      immediateProblem: aiResult.immediateProblem || activeSession.immediateProblem,
      largerPolarity: aiResult.largerPolarity || activeSession.largerPolarity,
      polarityMap: aiResult.polarityMap || activeSession.polarityMap,
      actions: aiResult.suggestedActions ? [...activeSession.actions, ...aiResult.suggestedActions] : activeSession.actions,
      chatHistory: [
        ...activeSession.chatHistory,
        {
          id: `msg-doc-${Date.now()}`,
          role: 'assistant',
          content: `Analyzed document "${doc.name}":\n${aiResult.summary}\n\nI have automatically populated your P.A.I.R. canvas with the extracted challenge and polarity insights!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    });
  };

  const handleRemoveDoc = (docId: string) => {
    updateActiveSession({
      uploadedDocs: activeSession.uploadedDocs.filter((d) => d.id !== docId),
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col">
      {/* App Header */}
      <Header
        session={activeSession}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenSessions={() => setIsSessionsOpen(true)}
        onOpenGuidebook={() => setIsGuidebookOpen(true)}
        onNewSession={handleNewSession}
      />

      {/* P.A.I.R. Step Stepper Bar */}
      <PairStepper
        currentStep={activeSession.currentStep}
        onSelectStep={handleSelectStep}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Document Ingestion Bar (collapsible or top banner) */}
        <div className="mb-2">
          <DocumentUploader
            existingDocs={activeSession.uploadedDocs}
            onDocumentAnalyzed={handleDocumentAnalyzed}
            onRemoveDoc={handleRemoveDoc}
          />
        </div>

        {/* Step Views */}
        {activeSession.currentStep === 'pinpoint' && (
          <PinpointStep
            session={activeSession}
            onUpdateSession={updateActiveSession}
            onNext={() => handleSelectStep('assess')}
          />
        )}

        {activeSession.currentStep === 'assess' && (
          <AssessStep
            session={activeSession}
            onUpdateSession={updateActiveSession}
            onNext={() => handleSelectStep('investigate')}
            onPrev={() => handleSelectStep('pinpoint')}
          />
        )}

        {activeSession.currentStep === 'investigate' && (
          <InvestigateStep
            session={activeSession}
            onUpdateSession={updateActiveSession}
            onNext={() => handleSelectStep('respond')}
            onPrev={() => handleSelectStep('assess')}
          />
        )}

        {activeSession.currentStep === 'respond' && (
          <RespondStep
            session={activeSession}
            onUpdateSession={updateActiveSession}
            onNext={() => handleSelectStep('report')}
            onPrev={() => handleSelectStep('investigate')}
          />
        )}

        {activeSession.currentStep === 'report' && (
          <ReportStep
            session={activeSession}
            onUpdateSession={updateActiveSession}
            onPrev={() => handleSelectStep('respond')}
          />
        )}
      </main>

      {/* Drawers */}
      <AgentChat
        session={activeSession}
        onUpdateSession={updateActiveSession}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      <SidebarSessions
        sessions={sessions}
        activeSessionId={activeSession.id}
        onSelectSession={setActiveSessionId}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
        onLoadPreset={handleLoadPreset}
        isOpen={isSessionsOpen}
        onClose={() => setIsSessionsOpen(false)}
      />

      <GuidebookDrawer
        isOpen={isGuidebookOpen}
        onClose={() => setIsGuidebookOpen(false)}
      />
    </div>
  );
}
