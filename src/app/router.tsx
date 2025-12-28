import { createBrowserRouter } from 'react-router-dom';
import App from '../App.tsx';
import { HomePage } from './routes/HomePage.tsx';

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        { index: true, element: <HomePage /> },
        {
          path: 'analytics',
          lazy: async () => {
            const mod = await import('./routes/AnalyticsPage.tsx');
            return {
              loader: mod.analyticsLoader,
              Component: mod.AnalyticsPage,
            };
          },
        },
      ],
    },
  ],
  { basename }
);
