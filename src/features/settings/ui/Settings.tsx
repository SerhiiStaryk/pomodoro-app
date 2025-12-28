import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TimerProfile, TimerSettings } from '../../../shared/types';
import styles from './Settings.module.css';

interface SettingsProps {
  profiles: TimerProfile[];
  activeProfileId: string;
  onSelectProfile: (profileId: string) => void;
  onCreateProfile: (name: string) => boolean;
  onRenameProfile: (profileId: string, name: string) => boolean;
  onDeleteProfile: (profileId: string) => boolean;
  settings: TimerSettings;
  onUpdate: (settings: Partial<TimerSettings>) => void;
  onReset: () => void;
}

export const Settings = ({
  profiles,
  activeProfileId,
  onSelectProfile,
  onCreateProfile,
  onRenameProfile,
  onDeleteProfile,
  settings,
  onUpdate,
  onReset,
}: SettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [renameValue, setRenameValue] = useState('');
  const { t } = useTranslation();

  const activeProfile = useMemo(
    () => profiles.find((p) => p.id === activeProfileId) ?? null,
    [profiles, activeProfileId]
  );

  const canDelete = profiles.length > 1;

  return (
    <div className={styles.settings}>
      <button
        className={styles.toggleButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={t('settings.toggleAria')}
      >
        {t('settings.toggle')}
      </button>

      {isOpen && (
        <div className={styles.panel}>
          <h3 className={styles.title}>{t('settings.title')}</h3>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>
              {t('settings.profilesTitle')}
            </h4>

            <div className={styles.field}>
              <label htmlFor="profile-select">
                {t('settings.profileLabel')}
              </label>
              <select
                id="profile-select"
                className={styles.select}
                value={activeProfileId}
                onChange={(e) => {
                  onSelectProfile(e.target.value);
                  setRenameValue('');
                }}
              >
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.inlineRow}>
              <input
                className={styles.textInput}
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder={t('settings.newProfilePlaceholder')}
                aria-label={t('settings.newProfileAria')}
              />
              <button
                className={styles.smallButton}
                type="button"
                onClick={() => {
                  const ok = onCreateProfile(newProfileName);
                  if (ok) setNewProfileName('');
                }}
                disabled={!newProfileName.trim()}
              >
                {t('settings.createProfile')}
              </button>
            </div>

            <div className={styles.inlineRow}>
              <input
                className={styles.textInput}
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                placeholder={activeProfile?.name ?? ''}
                aria-label={t('settings.renameProfileAria')}
              />
              <button
                className={styles.smallButton}
                type="button"
                onClick={() => {
                  if (!activeProfile) return;
                  const ok = onRenameProfile(activeProfile.id, renameValue);
                  if (ok) setRenameValue('');
                }}
                disabled={!activeProfile || !renameValue.trim()}
              >
                {t('settings.renameProfile')}
              </button>
              <button
                className={styles.smallButtonDanger}
                type="button"
                onClick={() => onDeleteProfile(activeProfileId)}
                disabled={!canDelete}
              >
                {t('settings.deleteProfile')}
              </button>
            </div>

            {activeProfile && (
              <div className={styles.profileNote}>
                {t('settings.activeProfileNote', { name: activeProfile.name })}
              </div>
            )}
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>
              {t('settings.durationsTitle')}
            </h4>

            <div className={styles.field}>
              <label htmlFor="work-duration">{t('settings.workSession')}</label>
              <input
                id="work-duration"
                type="number"
                min="1"
                max="60"
                value={settings.workDuration}
                onChange={(e) =>
                  onUpdate({ workDuration: parseInt(e.target.value) || 25 })
                }
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="short-break">{t('settings.shortBreak')}</label>
              <input
                id="short-break"
                type="number"
                min="1"
                max="30"
                value={settings.shortBreakDuration}
                onChange={(e) =>
                  onUpdate({
                    shortBreakDuration: parseInt(e.target.value) || 5,
                  })
                }
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="long-break">{t('settings.longBreak')}</label>
              <input
                id="long-break"
                type="number"
                min="1"
                max="60"
                value={settings.longBreakDuration}
                onChange={(e) =>
                  onUpdate({
                    longBreakDuration: parseInt(e.target.value) || 15,
                  })
                }
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="sessions-until-long">
                {t('settings.sessionsUntilLongBreak')}
              </label>
              <input
                id="sessions-until-long"
                type="number"
                min="2"
                max="10"
                value={settings.sessionsUntilLongBreak}
                onChange={(e) =>
                  onUpdate({
                    sessionsUntilLongBreak: parseInt(e.target.value) || 4,
                  })
                }
              />
            </div>
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>
              {t('settings.autoStartTitle')}
            </h4>

            <div className={styles.checkboxField}>
              <input
                id="auto-start-breaks"
                type="checkbox"
                checked={settings.autoStartBreaks}
                onChange={(e) =>
                  onUpdate({ autoStartBreaks: e.target.checked })
                }
              />
              <label htmlFor="auto-start-breaks">
                {t('settings.autoStartBreaks')}
              </label>
            </div>

            <div className={styles.checkboxField}>
              <input
                id="auto-start-work"
                type="checkbox"
                checked={settings.autoStartWork}
                onChange={(e) => onUpdate({ autoStartWork: e.target.checked })}
              />
              <label htmlFor="auto-start-work">
                {t('settings.autoStartWork')}
              </label>
            </div>
          </div>

          <button className={styles.resetButton} onClick={onReset}>
            {t('settings.resetDefaults')}
          </button>
        </div>
      )}
    </div>
  );
};
