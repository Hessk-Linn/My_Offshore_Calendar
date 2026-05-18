import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const pwaOptions = {
  registerType: 'autoUpdate',
  includeAssets: ['favicon.svg', 'icons/icon-192.svg', 'icons/icon-512.svg'],
  manifest: {
    name: 'Offshore Rotation Planner',
    short_name: 'Rotation',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#0f172a',
    description: 'Offline-first offshore rotation planner shell.',
    icons: [
      {
        src: 'icons/icon-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any maskable',
      },
      {
        src: 'icons/icon-512.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any maskable',
      },
    ],
  },
  workbox: {
    navigateFallback: '/index.html',
    runtimeCaching: [
      {
        urlPattern: ({ request }) => request.destination === 'document',
        handler: 'NetworkFirst',
        options: {
          cacheName: 'html-cache',
          networkTimeoutSeconds: 3,
        },
      },
      {
        urlPattern: ({ request }) => request.destination === 'style' || request.destination === 'script',
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'assets-cache',
        },
      },
      {
        urlPattern: ({ request }) => request.destination === 'image',
        handler: 'CacheFirst',
        options: {
          cacheName: 'image-cache',
          expiration: {
            maxEntries: 60,
            maxAgeSeconds: 60 * 60 * 24 * 30,
          },
        },
      },
    ],
  },
};

export default defineConfig({
  plugins: [react(), VitePWA(pwaOptions)],
});
