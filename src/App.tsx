import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { ThemeToggle, useTheme } from './features/theme';
import { LanguageToggle } from './features/localization';
import { requestNotificationPermission } from './shared/lib/notifications';
import './App.css';

function App() {
  const { t } = useTranslation();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const infoCloseButtonRef = useRef<HTMLButtonElement | null>(null);

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Close info modal on Escape
  useEffect(() => {
    if (!isInfoOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsInfoOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isInfoOpen]);

  // Basic focus + scroll handling for modal
  useEffect(() => {
    if (!isInfoOpen) return;
    infoCloseButtonRef.current?.focus();

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isInfoOpen]);

  return (
    <div className="app">
      <button
        className="infoButton"
        onClick={() => setIsInfoOpen(true)}
        aria-label={t('app.info.buttonAria')}
        title={t('app.info.buttonTitle')}
      >
        ℹ️
      </button>
      <LanguageToggle />
      <ThemeToggle theme={theme} onToggle={toggleTheme} />

      <header className="header">
        <h1 className="logo">🍅 {t('app.header.title')}</h1>
        <p className="tagline">{t('app.header.tagline')}</p>

        <nav className="nav" aria-label={t('nav.aria')}>
          <Link
            className={
              location.pathname === '/' ? 'navLink navLinkActive' : 'navLink'
            }
            to="/"
          >
            {t('nav.home')}
          </Link>
          <Link
            className={
              location.pathname.startsWith('/analytics')
                ? 'navLink navLinkActive'
                : 'navLink'
            }
            to="/analytics"
          >
            {t('nav.analytics')}
          </Link>
        </nav>
      </header>

      <Outlet />

      <footer className="footer">
        <p>{t('app.footer.builtWith')}</p>
      </footer>

      {isInfoOpen && (
        <div
          className="modalOverlay"
          role="presentation"
          onClick={() => setIsInfoOpen(false)}
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={t('app.modal.title')}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modalHeader">
              <h2 className="modalTitle">{t('app.modal.title')}</h2>
              <button
                ref={infoCloseButtonRef}
                className="modalClose"
                onClick={() => setIsInfoOpen(false)}
                aria-label={t('app.modal.close')}
              >
                ✕
              </button>
            </div>

            <div className="modalBody">
              <h3 className="modalSectionTitle">
                {t('app.modal.sections.basics')}
              </h3>
              <ul className="modalList">
                {(
                  t('app.modal.basicsItems', {
                    returnObjects: true,
                  }) as string[]
                ).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <h3 className="modalSectionTitle">
                {t('app.modal.sections.app')}
              </h3>
              <ul className="modalList">
                {(
                  t('app.modal.appItems', { returnObjects: true }) as string[]
                ).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <h3 className="modalSectionTitle">
                {t('app.modal.sections.tips')}
              </h3>
              <ul className="modalList">
                {(
                  t('app.modal.tipsItems', { returnObjects: true }) as string[]
                ).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
