/**
 * Registers the service worker for offline/PWA support and handles seamless
 * updates: when a new version is deployed, the waiting worker is told to
 * activate, and the page reloads exactly once so users always get the latest
 * build without manually clearing the cache.
 *
 * No-op in development so it doesn't interfere with Vite HMR.
 */
export function registerServiceWorker() {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;
  if (import.meta.env.DEV) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        // Check for an update right away and periodically (e.g. long sessions).
        registration.update().catch(() => {});
        setInterval(() => registration.update().catch(() => {}), 60 * 60 * 1000);

        // A new worker is installing — when it's ready, ask it to take over.
        registration.addEventListener('updatefound', () => {
          const installing = registration.installing;
          if (!installing) return;
          installing.addEventListener('statechange', () => {
            if (
              installing.state === 'installed' &&
              navigator.serviceWorker.controller // an old SW is still controlling
            ) {
              installing.postMessage('SKIP_WAITING');
            }
          });
        });
      })
      .catch((err) => {
        console.warn('Service worker registration failed:', err);
      });

    // When the controlling worker changes, reload once to load fresh assets.
    let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (reloaded) return;
      reloaded = true;
      window.location.reload();
    });
  });
}
