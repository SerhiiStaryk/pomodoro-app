import { useTranslation } from 'react-i18next';
import type { TimerStatus, TimerPhase } from '../../../shared/types';
import styles from './Controls.module.css';

interface ControlsProps {
  status: TimerStatus;
  phase: TimerPhase;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
  onChangePhase: (phase: TimerPhase) => void;
}

export const Controls = ({
  status,
  phase,
  onStart,
  onPause,
  onReset,
  onSkip,
  onChangePhase,
}: ControlsProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.controls}>
      <div className={styles.mainControls}>
        {status === 'running' ? (
          <button
            className={`${styles.button} ${styles.pause}`}
            onClick={onPause}
          >
            {t('controls.pause')}
          </button>
        ) : (
          <button
            className={`${styles.button} ${styles.start}`}
            onClick={onStart}
          >
            {status === 'paused' ? t('controls.resume') : t('controls.start')}
          </button>
        )}

        <button
          className={`${styles.button} ${styles.reset}`}
          onClick={onReset}
          disabled={status === 'idle'}
        >
          {t('controls.reset')}
        </button>

        <button className={`${styles.button} ${styles.skip}`} onClick={onSkip}>
          {t('controls.skip')}
        </button>
      </div>

      <div className={styles.phaseSelector}>
        <button
          className={`${styles.phaseButton} ${
            phase === 'work' ? styles.active : ''
          }`}
          onClick={() => onChangePhase('work')}
          disabled={status === 'running'}
        >
          {t('controls.phase.work')}
        </button>
        <button
          className={`${styles.phaseButton} ${
            phase === 'shortBreak' ? styles.active : ''
          }`}
          onClick={() => onChangePhase('shortBreak')}
          disabled={status === 'running'}
        >
          {t('controls.phase.shortBreak')}
        </button>
        <button
          className={`${styles.phaseButton} ${
            phase === 'longBreak' ? styles.active : ''
          }`}
          onClick={() => onChangePhase('longBreak')}
          disabled={status === 'running'}
        >
          {t('controls.phase.longBreak')}
        </button>
      </div>
    </div>
  );
};
