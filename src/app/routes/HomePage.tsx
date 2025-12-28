import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Timer, Controls, useTimer } from '../../features/timer';
import { Settings, useSettings } from '../../features/settings';
import { SessionHistory } from '../../features/history';
import { TaskList } from '../../features/tasks';
import type { TimerPhase } from '../../shared/types';

export const HomePage = () => {
  const { t, i18n } = useTranslation();

  const {
    profiles,
    activeProfileId,
    settings,
    selectProfile,
    createProfile,
    renameProfile,
    deleteProfile,
    updateSettings,
    resetSettings,
  } = useSettings();
  const timer = useTimer(settings);

  // Update document title with timer
  useEffect(() => {
    const formatTime = (seconds: number) => {
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

    document.title =
      timer.status === 'running'
        ? t('app.documentTitle.running', {
            emoji: phaseEmojis[timer.phase],
            time: formatTime(timer.timeRemaining),
          })
        : t('app.documentTitle.idle');
  }, [timer.timeRemaining, timer.status, timer.phase, t, i18n.language]);

  return (
    <main className="main">
      <div className="flex flex-row">
        <div className="flex flex-column">
          <Timer
            phase={timer.phase}
            status={timer.status}
            timeRemaining={timer.timeRemaining}
            sessionsCompleted={timer.sessionsCompleted}
          />
          <Controls
            status={timer.status}
            phase={timer.phase}
            onStart={timer.start}
            onPause={timer.pause}
            onReset={timer.reset}
            onSkip={timer.skip}
            onChangePhase={timer.changePhase}
          />
        </div>
        <div className="flex flex-column">
          <Settings
            profiles={profiles}
            activeProfileId={activeProfileId}
            onSelectProfile={selectProfile}
            onCreateProfile={createProfile}
            onRenameProfile={renameProfile}
            onDeleteProfile={deleteProfile}
            settings={settings}
            onUpdate={updateSettings}
            onReset={resetSettings}
          />
          <TaskList />
          <SessionHistory
            sessions={timer.sessions}
            onClear={timer.clearAllData}
          />
        </div>
      </div>
    </main>
  );
};
