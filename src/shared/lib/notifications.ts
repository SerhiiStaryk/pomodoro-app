import type { TimerPhase } from '../types';

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const showNotification = (phase: TimerPhase): void => {
  if (Notification.permission !== 'granted') {
    return;
  }

  const messages: Record<TimerPhase, { title: string; body: string }> = {
    work: {
      title: '🍅 Time to Focus!',
      body: "Your work session is starting. Let's get productive!",
    },
    shortBreak: {
      title: '☕ Short Break',
      body: 'Great work! Take a 5-minute break to recharge.',
    },
    longBreak: {
      title: '🎉 Long Break',
      body: 'Excellent progress! Enjoy your well-deserved long break.',
    },
  };

  const { title, body } = messages[phase];

  new Notification(title, {
    body,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: 'pomodoro-timer',
    requireInteraction: false,
  });
};
