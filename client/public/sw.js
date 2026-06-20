/* Three Clues service worker — offline support for the PWA.
 * Strategy:
 *  - Precache the app shell on install.
 *  - Navigations: network-first, fall back to cached index.html when offline.
 *  - Static assets (hashed JS/CSS/images/fonts): cache-first (they're immutable).
 */

const VERSION = 'v1';
const SHELL_CACHE = `three-clues-shell-${VERSION}`;
const RUNTIME_CACHE = `three-clues-runtime-${VERSION}`;

const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.png',
  '/icon-192.png',
  '/icon-512.png',
  '/maskable-512.png',
  '/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== SHELL_CACHE && key !== RUNTIME_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests from the same origin.
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // App navigations: network-first so updates land, offline falls back to shell.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put('/index.html', copy));
          return response;
        })
        .catch(() => caches.match('/index.html').then((r) => r || caches.match('/'))),
    );
    return;
  }

  // Static assets: cache-first, then populate the runtime cache.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (response.ok && response.type === 'basic') {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
    }),
  );
});
