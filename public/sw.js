/**
 * TraviQue PWA Service Worker
 * Enables fully offline itinerary consulting, checklist verification, and emergency SOS tools.
 */

const CACHE_NAME = 'travique-static-cache-v1';
const RUNTIME_CACHE_NAME = 'travique-runtime-cache-v1';

// Assets to precache immediately on service worker installation
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap'
];

// Installation event - precaches critical startup shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Precaching app shell assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation event - cleans up deprecated legacy caches
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE_NAME];
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!currentCaches.includes(cacheName)) {
              console.log('[Service Worker] Cleaning up old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event interceptor
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Skip caching for non-GET requests (e.g., POST api calls) or chrome extensions
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin) && !event.request.url.startsWith('http')) {
    return;
  }

  // Handle local development HMR and websocket traffic - do not cache
  if (requestUrl.pathname.includes('ws') || requestUrl.pathname.includes('vite') || requestUrl.pathname.includes('hmr')) {
    return;
  }

  // Stale-While-Revalidate for app assets, scripts, stylesheets, static pages, and third-party resources (Fonts, Icons, Unsplash photos)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Create a fetch promise to update the cache in the background
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          // If the network response is valid, clone and store it in the runtime cache
          if (networkResponse && networkResponse.status === 200) {
            const cacheToUse = requestUrl.origin === self.location.origin ? CACHE_NAME : RUNTIME_CACHE_NAME;
            caches.open(cacheToUse).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        })
        .catch((err) => {
          console.warn('[Service Worker] Fetch failed, serving cached fallback if available:', err);
          // Return cached fallback if fetch fails completely offline
          return cachedResponse;
        });

      // Return the cached version instantly if present, falling back to the network fetch
      return cachedResponse || fetchPromise;
    })
  );
});
