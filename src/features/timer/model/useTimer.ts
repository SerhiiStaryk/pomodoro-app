import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  TimerPhase,
  TimerStatus,
  TimerSettings,
  Session,
  TimerState,
} from '../../../shared/types';
import {
  saveTimerState,
  loadTimerState,
  clearTimerState,
  saveSessions,
  loadSessions,
} from '../../../shared/lib/storage';
import { audioNotifier } from '../../../shared/lib/audio';
import { showNotification } from '../../../shared/lib/notifications';

export const useTimer = (settings: TimerSettings) => {
  const getInitialState = () => {
    const savedState = loadTimerState();
    const savedSessions = loadSessions();

    return {
      phase: savedState?.phase ?? ('work' as TimerPhase),
      status: 'idle' as TimerStatus,
      timeRemaining: savedState?.timeRemaining ?? settings.workDuration * 60,
      sessionsCompleted: savedState?.sessionsCompleted ?? 0,
      sessions: savedSessions,
    };
  };

  const initialState = getInitialState();

  const [phase, setPhase] = useState<TimerPhase>(initialState.phase);
  const [status, setStatus] = useState<TimerStatus>(initialState.status);
  const [timeRemaining, setTimeRemaining] = useState(
    initialState.timeRemaining
  );
  const [sessionsCompleted, setSessionsCompleted] = useState(
    initialState.sessionsCompleted
  );
  const [sessions, setSessions] = useState<Session[]>(initialState.sessions);

  const intervalRef = useRef<number | null>(null);
  const currentSessionStartRef = useRef<number | null>(null);

  useEffect(() => {
    const state: TimerState = {
      phase,
      status,
      timeRemaining,
      sessionsCompleted,
      currentSessionStart: currentSessionStartRef.current,
    };
    saveTimerState(state);
  }, [phase, status, timeRemaining, sessionsCompleted]);

  const getDurationForPhase = useCallback(
    (currentPhase: TimerPhase): number => {
      switch (currentPhase) {
        case 'work':
          return settings.workDuration * 60;
        case 'shortBreak':
          return settings.shortBreakDuration * 60;
        case 'longBreak':
          return settings.longBreakDuration * 60;
      }

      // Exhaustiveness guard
      return settings.workDuration * 60;
    },
    [settings]
  );

  // If settings (profile) change while idle, update the displayed duration.
  useEffect(() => {
    if (status !== 'idle') return;
    setTimeRemaining(getDurationForPhase(phase));
  }, [settings, status, phase, getDurationForPhase]);

  const getNextPhase = useCallback((): TimerPhase => {
    if (phase === 'work') {
      const nextSessionCount = sessionsCompleted + 1;
      return nextSessionCount % settings.sessionsUntilLongBreak === 0
        ? 'longBreak'
        : 'shortBreak';
    }
    return 'work';
  }, [phase, sessionsCompleted, settings.sessionsUntilLongBreak]);

  const saveCompletedSession = useCallback(
    (completedPhase: TimerPhase, duration: number) => {
      const newSession: Session = {
        id: Date.now().toString(),
        phase: completedPhase,
        duration,
        completedAt: Date.now(),
      };

      const updatedSessions = [newSession, ...sessions];
      setSessions(updatedSessions);
      saveSessions(updatedSessions);
    },
    [sessions]
  );

  const transitionToNextPhase = useCallback(() => {
    const completedPhase = phase;
    const duration = getDurationForPhase(phase);

    saveCompletedSession(completedPhase, duration);

    if (completedPhase === 'work') {
      setSessionsCompleted((prev: number) => prev + 1);
    }

    const nextPhase = getNextPhase();
    setPhase(nextPhase);
    setTimeRemaining(getDurationForPhase(nextPhase));

    if (completedPhase === 'work') {
      audioNotifier.playWorkComplete();
    } else {
      audioNotifier.playBreakComplete();
    }
    showNotification(nextPhase);

    const shouldAutoStart =
      (nextPhase === 'work' && settings.autoStartWork) ||
      (nextPhase !== 'work' && settings.autoStartBreaks);

    if (shouldAutoStart) {
      currentSessionStartRef.current = Date.now();
      setStatus('running');
    } else {
      setStatus('idle');
    }
  }, [
    phase,
    getDurationForPhase,
    getNextPhase,
    saveCompletedSession,
    settings,
  ]);

  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = window.setInterval(() => {
        setTimeRemaining((prev: number) => {
          if (prev <= 1) {
            transitionToNextPhase();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status, transitionToNextPhase]);

  const start = useCallback(() => {
    setStatus('running');
    currentSessionStartRef.current = Date.now();
  }, []);

  const pause = useCallback(() => {
    setStatus('paused');
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setTimeRemaining(getDurationForPhase(phase));
    currentSessionStartRef.current = null;
  }, [phase, getDurationForPhase]);

  const skip = useCallback(() => {
    transitionToNextPhase();
  }, [transitionToNextPhase]);

  const changePhase = useCallback(
    (newPhase: TimerPhase) => {
      setPhase(newPhase);
      setTimeRemaining(getDurationForPhase(newPhase));
      setStatus('idle');
      currentSessionStartRef.current = null;
    },
    [getDurationForPhase]
  );

  const clearAllData = useCallback(() => {
    setPhase('work');
    setStatus('idle');
    setTimeRemaining(settings.workDuration * 60);
    setSessionsCompleted(0);
    setSessions([]);
    clearTimerState();
    saveSessions([]);
  }, [settings.workDuration]);

  return {
    phase,
    status,
    timeRemaining,
    sessionsCompleted,
    sessions,
    start,
    pause,
    reset,
    skip,
    changePhase,
    clearAllData,
  };
};
