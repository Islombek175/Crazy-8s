export type ToolType = 'pen' | 'pencil' | 'eraser';

export type WorkspaceMode = 'draw' | 'write' | 'both';

export type SessionStatus = 'draft' | 'running' | 'paused' | 'completed';

export interface Point {
  x: number;
  y: number;
  pressure?: number;
}

export interface Stroke {
  tool: ToolType;
  color: string;
  size: number;
  points: Point[];
}

export interface Idea {
  id: number; // 1 to 8
  title: string;
  description: string;
  bulletPoints: string[];
  canvasData: string | null; // Base64 data URL
  strokes: Stroke[];
  isFavorite: boolean;
  notes: string;
  mode: 'draw' | 'write';
}

export interface Reflections {
  surprise: string;
  potential: string;
  nextStep: string;
}

export interface Session {
  id: string;
  challenge: string;
  context: string;
  durationSeconds: number; // e.g. 480
  remainingSeconds: number;
  elapsedSeconds: number;
  status: SessionStatus;
  startTime: number | null; // Date.now() timestamp
  lastActiveTimestamp: number | null;
  ideas: Idea[];
  reflections: Reflections;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  preferences: {
    defaultMode: 'draw' | 'write';
    autoProgress: boolean;
    showPrompts: boolean;
    soundEnabled: boolean;
  };
}

export interface UserSettings {
  defaultDuration: number; // in seconds: 240, 480, 720
  defaultWorkspaceMode: 'draw' | 'write';
  autoProgression: boolean;
  inspirationPrompts: boolean;
  soundEffects: boolean;
  reducedMotion: boolean;
}

export type ViewState = 
  | 'landing'
  | 'setup'
  | 'workspace'
  | 'review'
  | 'history'
  | 'settings';
