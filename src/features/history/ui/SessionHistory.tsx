import { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Session, TimerPhase } from '../../../shared/types';
import styles from './SessionHistory.module.css';

interface SessionHistoryProps {
  sessions: Session[];
  onClear: () => void;
}

const phaseEmojis: Record<TimerPhase, string> = {
  work: '🍅',
  shortBreak: '☕',
  longBreak: '🎉',
};

const formatDate = (timestamp: number, locale: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  return `${mins}m`;
};

export const SessionHistory = ({ sessions, onClear }: SessionHistoryProps) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  const todaySessions = sessions.filter((s) => {
    const sessionDate = new Date(s.completedAt).toDateString();
    const today = new Date().toDateString();
    return sessionDate === today;
  });

  const workSessionsToday = todaySessions.filter(
    (s) => s.phase === 'work'
  ).length;
  const totalTimeToday = todaySessions.reduce((acc, s) => acc + s.duration, 0);

  return (
    <div className={styles.history}>
      <button
        className={styles.toggleButton}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span className={styles.title}>{t('history.title')}</span>
        <span className={styles.chevron}>{isOpen ? '▾' : '▸'}</span>
      </button>

      {isOpen && (
        <div id={panelId} className={styles.panel}>
          <div className={styles.header}>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <div className={styles.statValue}>{workSessionsToday}</div>
                <div className={styles.statLabel}>
                  {t('history.stats.sessions')}
                </div>
              </div>
              <div className={styles.stat}>
                <div className={styles.statValue}>
                  {Math.floor(totalTimeToday / 60)}
                </div>
                <div className={styles.statLabel}>
                  {t('history.stats.minutes')}
                </div>
              </div>
            </div>

            {sessions.length > 0 && (
              <button className={styles.clearButton} onClick={onClear}>
                {t('history.clearAll')}
              </button>
            )}
          </div>

          {sessions.length > 0 ? (
            <div className={styles.list}>
              {sessions.slice(0, 10).map((session) => (
                <div key={session.id} className={styles.session}>
                  <span className={styles.sessionEmoji}>
                    {phaseEmojis[session.phase]}
                  </span>
                  <span className={styles.sessionLabel}>
                    {t(`history.phase.${session.phase}`)}
                  </span>
                  <span className={styles.sessionDuration}>
                    {formatDuration(session.duration)}
                  </span>
                  <span className={styles.sessionTime}>
                    {formatDate(session.completedAt, i18n.language)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <p>{t('history.empty')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
