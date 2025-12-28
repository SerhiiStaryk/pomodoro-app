export type TimerPhase = 'work' | 'shortBreak' | 'longBreak';

export type TimerStatus = 'idle' | 'running' | 'paused';

export interface TimerSettings {
  workDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  sessionsUntilLongBreak: number;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
}

export interface TimerProfile {
  id: string;
  name: string;
  settings: TimerSettings;
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
}

export interface Session {
  id: string;
  phase: TimerPhase;
  duration: number; // in seconds
  completedAt: number; // timestamp
}

export interface TimerState {
  phase: TimerPhase;
  status: TimerStatus;
  timeRemaining: number; // in seconds
  sessionsCompleted: number;
  currentSessionStart: number | null;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number; // timestamp
  completedAt: number | null; // timestamp
}
