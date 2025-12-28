import type {
  TimerSettings,
  TimerProfile,
  Session,
  Task,
  TimerState,
} from '../types';

const SETTINGS_KEY = 'pomodoro_settings';
const PROFILES_KEY = 'pomodoro_profiles';
const ACTIVE_PROFILE_ID_KEY = 'pomodoro_active_profile_id';
const SESSIONS_KEY = 'pomodoro_sessions';
const TIMER_STATE_KEY = 'pomodoro_timer_state';
const TASKS_KEY = 'pomodoro_tasks';

const createId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

export const defaultSettings: TimerSettings = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
  autoStartBreaks: false,
  autoStartWork: false,
};

export const loadSettings = (): TimerSettings => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored
      ? { ...defaultSettings, ...JSON.parse(stored) }
      : defaultSettings;
  } catch {
    return defaultSettings;
  }
};

export const saveSettings = (settings: TimerSettings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

const createProfile = (name: string, settings: TimerSettings): TimerProfile => {
  const now = Date.now();
  return {
    id: createId(),
    name,
    settings,
    createdAt: now,
    updatedAt: now,
  };
};

export const loadProfiles = (): TimerProfile[] => {
  try {
    const stored = localStorage.getItem(PROFILES_KEY);
    if (stored) return JSON.parse(stored);

    // Migration path: if legacy single settings exist, wrap them into a default profile.
    const legacy = loadSettings();
    const migrated = [createProfile('Default', legacy)];
    localStorage.setItem(PROFILES_KEY, JSON.stringify(migrated));
    localStorage.setItem(ACTIVE_PROFILE_ID_KEY, migrated[0].id);
    return migrated;
  } catch {
    const fallback = [createProfile('Default', defaultSettings)];
    try {
      localStorage.setItem(PROFILES_KEY, JSON.stringify(fallback));
      localStorage.setItem(ACTIVE_PROFILE_ID_KEY, fallback[0].id);
    } catch {
      // ignore
    }
    return fallback;
  }
};

export const saveProfiles = (profiles: TimerProfile[]): void => {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
};

export const loadActiveProfileId = (): string | null => {
  try {
    return localStorage.getItem(ACTIVE_PROFILE_ID_KEY);
  } catch {
    return null;
  }
};

export const saveActiveProfileId = (profileId: string): void => {
  localStorage.setItem(ACTIVE_PROFILE_ID_KEY, profileId);
};

export const loadSessions = (): Session[] => {
  try {
    const stored = localStorage.getItem(SESSIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveSessions = (sessions: Session[]): void => {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};

export const saveTimerState = (state: TimerState): void => {
  localStorage.setItem(TIMER_STATE_KEY, JSON.stringify(state));
};

export const loadTimerState = (): TimerState | null => {
  try {
    const stored = localStorage.getItem(TIMER_STATE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const clearTimerState = (): void => {
  localStorage.removeItem(TIMER_STATE_KEY);
};

export const loadTasks = (): Task[] => {
  try {
    const stored = localStorage.getItem(TASKS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};
