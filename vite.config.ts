/// <reference types="node" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
const normalizeBase = (value: string) => {
  if (!value) return '/';
  return value.endsWith('/') ? value : `${value}/`;
};

const baseFromGitHubRepo = () => {
  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
  return repo ? `/${repo}/` : '/';
};

const base = normalizeBase(
  process.env.BASE_PATH ??
    (process.env.GITHUB_ACTIONS ? baseFromGitHubRepo() : '/')
);

const withBase = (path: string) => `${base}${path.replace(/^\/+/, '')}`;

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Pomodoro Timer',
        short_name: 'Pomodoro',
        description:
          'Stay focused with a customizable Pomodoro timer that tracks your work sessions.',
        theme_color: '#1a202c',
        background_color: '#1a202c',
        display: 'standalone',
        start_url: base,
        scope: base,
        icons: [
          {
            src: withBase('android-chrome-192x192.png'),
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: withBase('android-chrome-512x512.png'),
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: withBase('favicon-32x32.png'),
            sizes: '32x32',
            type: 'image/png',
          },
          {
            src: withBase('favicon-16x16.png'),
            sizes: '16x16',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }: { request: { destination: string } }) =>
              request.destination === 'script' ||
              request.destination === 'style',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'assets-cache',
            },
          },
        ],
      },
    }),
  ],
});
