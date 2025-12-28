import { useTranslation } from 'react-i18next';
import type { TimerPhase, TimerStatus } from '../../../shared/types';
import styles from './Timer.module.css';

interface TimerProps {
  phase: TimerPhase;
  status: TimerStatus;
  timeRemaining: number;
  sessionsCompleted: number;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
};

const phaseEmojis: Record<TimerPhase, string> = {
  work: '🍅',
  shortBreak: '☕',
  longBreak: '🎉',
};

export const Timer = ({
  phase,
  status,
  timeRemaining,
  sessionsCompleted,
}: TimerProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.timer}>
      <div className={styles.phaseInfo}>
        <span className={styles.emoji}>{phaseEmojis[phase]}</span>
        <h2 className={styles.phaseLabel}>{t(`timer.phase.${phase}`)}</h2>
      </div>

      <div className={styles.timeDisplay}>
        <div className={styles.time}>{formatTime(timeRemaining)}</div>
        <div className={styles.status}>
          {status === 'running' && <span className={styles.statusDot}>●</span>}
          {status === 'paused' && (
            <span className={styles.statusPaused}>⏸</span>
          )}
        </div>
      </div>

      <div className={styles.sessionsInfo}>
        <div className={styles.sessions}>
          {t('timer.sessionsCompleted')} <strong>{sessionsCompleted}</strong>
        </div>
      </div>
    </div>
  );
};
