import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { SessionData } from '../types';

// Minimal mock session that satisfies the full SessionData interface
const mockSession: SessionData = {
  id: 'test-session',
  title: 'Test Session',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  currentStep: 'pinpoint',
  rawChallenge: 'How do we stop faculty from using AI?',
  neutralChallenge: 'How do we enable AI experimentation while protecting institutional trust?',
  classification: 'polarity',
  classificationEvidence: '',
  immediateProblem: '',
  largerPolarity: '',
  diagnosticAnswers: {
    q1_clearAnswer: false,
    q2_canBeClosed: false,
    q3_competingPrioritiesRemain: true,
    q4_overemphasizeRisk: true,
    q5_eliminatingSideDamagesPurpose: true,
  },
  polarityMap: {
    poleL: { name: 'AI Innovation', upsides: [], downsides: [] },
    poleR: { name: 'Data Security', upsides: [], downsides: [] },
    sharedBestHope: '',
    sharedGreatestFear: '',
  },
  actions: [],
  followThrough: { align30Days: [], test60Days: [], adapt90Days: [] },
  uploadedDocs: [],
  voiceNotes: [],
  chatHistory: [],
};

const noop = () => {};

// Mock the api service so component renders don't trigger real network calls
vi.mock('../services/api', () => ({
  sendChatMessage: vi.fn(),
  analyzeDocument: vi.fn(),
  transcribeAudio: vi.fn(),
  enhancePolarityMap: vi.fn(),
  convertToPlainLanguage: vi.fn(),
}));

// Mock VoiceInputButton since it uses browser MediaRecorder APIs
vi.mock('../components/VoiceInputButton', () => ({
  VoiceInputButton: () => null,
}));

describe('PinpointStep', () => {
  it('renders without crashing', async () => {
    const { PinpointStep } = await import('../components/steps/PinpointStep');
    render(<PinpointStep session={mockSession} onUpdateSession={noop} onNext={noop} />);
    expect(screen.getByText(/Pinpoint the Challenge/i)).toBeInTheDocument();
  });
});

describe('AssessStep', () => {
  it('renders without crashing', async () => {
    const { AssessStep } = await import('../components/steps/AssessStep');
    const { container } = render(
      <AssessStep session={mockSession} onUpdateSession={noop} onNext={noop} onPrev={noop} />,
    );
    expect(container.firstChild).toBeTruthy();
    expect(screen.getAllByText(/Assess/i).length).toBeGreaterThan(0);
  });
});

describe('InvestigateStep', () => {
  it('renders without crashing', async () => {
    const { InvestigateStep } = await import('../components/steps/InvestigateStep');
    const { container } = render(
      <InvestigateStep session={mockSession} onUpdateSession={noop} onNext={noop} onPrev={noop} />,
    );
    expect(container.firstChild).toBeTruthy();
    expect(screen.getAllByText(/Investigate/i).length).toBeGreaterThan(0);
  });
});

describe('RespondStep', () => {
  it('renders without crashing', async () => {
    const { RespondStep } = await import('../components/steps/RespondStep');
    const { container } = render(
      <RespondStep session={mockSession} onUpdateSession={noop} onNext={noop} onPrev={noop} />,
    );
    expect(container.firstChild).toBeTruthy();
    expect(screen.getAllByText(/Respond/i).length).toBeGreaterThan(0);
  });
});

describe('ReportStep', () => {
  it('renders without crashing', async () => {
    const { ReportStep } = await import('../components/steps/ReportStep');
    const { container } = render(
      <ReportStep session={mockSession} onUpdateSession={noop} onPrev={noop} />,
    );
    expect(container.firstChild).toBeTruthy();
    expect(screen.getAllByText(/Report/i).length).toBeGreaterThan(0);
  });
});
