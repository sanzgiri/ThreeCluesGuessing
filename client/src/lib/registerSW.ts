/**
 * Registers the service worker for offline/PWA support.
 * No-op in development so it doesn't interfere with Vite HMR.
 */
export function registerServiceWorker() {
  if (typeof window === 'undefined') return;
  if (!('serviceWorker' in navigator)) return;
  if (import.meta.env.DEV) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('Service worker registration failed:', err);
    });
  });
}
