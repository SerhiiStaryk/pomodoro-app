import { useTranslation } from 'react-i18next';
import styles from './LanguageToggle.module.css';

const normalizeLanguage = (lng: string): 'en' | 'uk' => {
  if (lng.startsWith('uk')) return 'uk';
  return 'en';
};

export const LanguageToggle = () => {
  const { t, i18n } = useTranslation();

  const current = normalizeLanguage(i18n.language);
  const next = current === 'en' ? 'uk' : 'en';

  return (
    <button
      className={styles.toggle}
      onClick={() => i18n.changeLanguage(next)}
      aria-label={t('language.toggleAria')}
      title={current === 'en' ? 'Українська' : 'English'}
    >
      {current === 'en' ? 'EN' : 'UA'}
    </button>
  );
};
