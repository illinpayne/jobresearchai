export interface AiPresetEventType {
  presetId: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  ownRule?: string;
  usageCredits: number;
  paidTier: string;
  llmName: string;
}

export interface AiResumeUploadEventType {
  preset: AiPresetEventType;
  accountId: string;
  jobId: string;
  extractedText: string;
}
