import { useTranslation } from 'react-i18next';
import type { Theme } from '../model/useTheme';
import styles from './ThemeToggle.module.css';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export const ThemeToggle = ({ theme, onToggle }: ThemeToggleProps) => {
  const { t } = useTranslation();

  return (
    <button
      className={styles.toggle}
      onClick={onToggle}
      aria-label={t('theme.toggleAria')}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};
