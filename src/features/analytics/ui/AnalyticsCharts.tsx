import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { Session } from '../../../shared/types';
import styles from './AnalyticsCharts.module.css';

type DayPoint = {
  key: string;
  label: string;
  focusMinutes: number;
  workSessions: number;
};

const startOfDay = (timestamp: number): number => {
  const d = new Date(timestamp);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

const addDays = (timestamp: number, days: number): number => {
  const d = new Date(timestamp);
  d.setDate(d.getDate() + days);
  return d.getTime();
};

const formatDayLabel = (timestamp: number, locale: string): string => {
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
  }).format(new Date(timestamp));
};

export const AnalyticsCharts = ({ sessions }: { sessions: Session[] }) => {
  const { t, i18n } = useTranslation();

  const { points, totals } = useMemo(() => {
    const today = startOfDay(Date.now());
    const days = 7;
    const windowStart = addDays(today, -(days - 1));

    const pointsByKey = new Map<string, DayPoint>();
    for (let i = 0; i < days; i += 1) {
      const dayTs = addDays(windowStart, i);
      const key = String(dayTs);
      pointsByKey.set(key, {
        key,
        label: formatDayLabel(dayTs, i18n.language),
        focusMinutes: 0,
        workSessions: 0,
      });
    }

    let totalFocusMinutes = 0;
    let totalWorkSessions = 0;

    for (const session of sessions) {
      if (session.phase !== 'work') continue;
      const dayTs = startOfDay(session.completedAt);
      if (dayTs < windowStart || dayTs > today) continue;

      const key = String(dayTs);
      const point = pointsByKey.get(key);
      if (!point) continue;

      const focusMinutes = Math.round(session.duration / 60);
      point.focusMinutes += focusMinutes;
      point.workSessions += 1;
      totalFocusMinutes += focusMinutes;
      totalWorkSessions += 1;
    }

    const points = Array.from(pointsByKey.values());
    return {
      points,
      totals: {
        totalFocusMinutes,
        totalWorkSessions,
        avgFocusMinutes: points.length
          ? Math.round(totalFocusMinutes / points.length)
          : 0,
      },
    };
  }, [sessions, i18n.language]);

  if (sessions.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h3 className={styles.title}>{t('analytics.title')}</h3>
          <p className={styles.subtitle}>{t('analytics.subtitle')}</p>
          <div className={styles.empty}>
            <p>{t('analytics.empty')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.title}>{t('analytics.title')}</h3>
          <p className={styles.subtitle}>{t('analytics.subtitle')}</p>
        </div>

        <div className={styles.kpis}>
          <div className={styles.kpi}>
            <div className={styles.kpiValue}>{totals.totalWorkSessions}</div>
            <div className={styles.kpiLabel}>
              {t('analytics.kpis.workSessions')}
            </div>
          </div>
          <div className={styles.kpi}>
            <div className={styles.kpiValue}>{totals.totalFocusMinutes}</div>
            <div className={styles.kpiLabel}>
              {t('analytics.kpis.focusMinutes')}
            </div>
          </div>
          <div className={styles.kpi}>
            <div className={styles.kpiValue}>{totals.avgFocusMinutes}</div>
            <div className={styles.kpiLabel}>
              {t('analytics.kpis.avgPerDay')}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <h3 className={styles.title}>{t('analytics.charts.focusMinutes')}</h3>
        <div className={styles.chart}>
          <ResponsiveContainer>
            <BarChart
              data={points}
              margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fill: 'var(--text-secondary)' }} />
              <YAxis tick={{ fill: 'var(--text-secondary)' }} />
              <Tooltip
                contentStyle={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
              />
              <Bar
                dataKey="focusMinutes"
                fill="var(--accent)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.card}>
        <h3 className={styles.title}>{t('analytics.charts.workSessions')}</h3>
        <div className={styles.chart}>
          <ResponsiveContainer>
            <LineChart
              data={points}
              margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fill: 'var(--text-secondary)' }} />
              <YAxis
                allowDecimals={false}
                tick={{ fill: 'var(--text-secondary)' }}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
              />
              <Line
                type="monotone"
                dataKey="workSessions"
                stroke="var(--accent)"
                strokeWidth={3}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
