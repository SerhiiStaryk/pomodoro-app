import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoaderData } from 'react-router-dom';
import { AnalyticsCharts } from '../../features/analytics';
import { loadSessions } from '../../shared/lib/storage';
import type { Session } from '../../shared/types';

export const analyticsLoader = () => {
  return loadSessions();
};

export const AnalyticsPage = () => {
  const { t } = useTranslation();
  const sessions = useLoaderData() as Session[];

  useEffect(() => {
    document.title = t('analytics.documentTitle');
  }, [t]);

  return (
    <main className="main">
      <AnalyticsCharts sessions={sessions} />
    </main>
  );
};
