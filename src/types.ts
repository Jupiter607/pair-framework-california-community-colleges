export type StepId = 'pinpoint' | 'assess' | 'investigate' | 'respond' | 'report';

export type ChallengeClassificationType = 'problem' | 'polarity' | 'problem_in_polarity';

export interface DiagnosticAnswers {
  q1_clearAnswer: boolean; // Clear answer, deliverable, or decision?
  q2_canBeClosed: boolean; // Can issue reasonably be completed or closed?
  q3_competingPrioritiesRemain: boolean; // Will two competing priorities still require attention after completion?
  q4_overemphasizeRisk: boolean; // Does emphasizing either side too strongly create predictable downsides?
  q5_eliminatingSideDamagesPurpose: boolean; // Would eliminating either side damage the larger purpose?
}

export interface PoleData {
  name: string;
  upsides: string[];
  downsides: string[];
}

export interface PolarityMap {
  poleL: PoleData;
  poleR: PoleData;
  sharedBestHope: string;
  sharedGreatestFear: string;
}

export interface ActionItem {
  id: string;
  action: string;
  poleSupported: 'L' | 'R' | 'Both';
  owner: string;
  timing: string; // e.g. "30 days", "Q3", "Bi-weekly"
  successEvidence: string;
  earlyWarningIndicator: string;
}

export interface FollowThroughPlan {
  align30Days: string[];
  test60Days: string[];
  adapt90Days: string[];
}

export interface UploadedDoc {
  id: string;
  name: string;
  mimeType: string;
  uploadedAt: string;
  summary?: string;
  extractedText?: string;
}

export interface VoiceNote {
  id: string;
  timestamp: string;
  text: string;
  durationSeconds?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  sources?: string[];
  suggestedAction?: {
    type: 'update_pinpoint' | 'update_classification' | 'update_polarity_map' | 'add_action';
    data: any;
  };
}

export interface SessionData {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  currentStep: StepId;
  
  // Phase P
  rawChallenge: string;
  neutralChallenge: string;
  biasedFramingExamples?: { biased: string; neutral: string }[];

  // Phase A
  classification: ChallengeClassificationType;
  classificationEvidence: string;
  immediateProblem: string;
  largerPolarity: string;
  diagnosticAnswers: DiagnosticAnswers;

  // Phase I
  polarityMap: PolarityMap;

  // Phase R
  actions: ActionItem[];
  followThrough: FollowThroughPlan;

  // Outputs
  reportSummary?: string;
  plainLanguageSummary?: string;

  // Uploaded docs & voice
  uploadedDocs: UploadedDoc[];
  voiceNotes: VoiceNote[];
  chatHistory: ChatMessage[];
}

export interface ExampleCase {
  id: string;
  strategicArea: string;
  poleLName: string;
  poleRName: string;
  rawChallenge: string;
  neutralChallenge: string;
  classification: ChallengeClassificationType;
  immediateProblem: string;
  largerPolarity: string;
  polarityMap: PolarityMap;
  actions: ActionItem[];
}
