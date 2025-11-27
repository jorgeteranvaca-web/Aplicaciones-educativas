export interface StageData {
  id: string;
  title: string;
  narrativeFull: string; // Used for TTS
  narrativeSummary: string; // Displayed text
  imagePrompt: string;
  riddleQuestion?: string;
  riddleAnswer?: number; // Simple numeric answer for linear equations
  isCinematicOnly?: boolean; // For intro/outro
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  COMPLETED = 'COMPLETED'
}