/* Caspian Journeys — minimal offline shell. Safe to delete/update at any time. */
'use strict';

const CACHE = 'cj-shell-v2';

const SHELL = [
  '.',
  'index.html',
  'css/style.css?v=2',
  'js/main.js?v=2',
  'manifest.json',
  'assets/images/carpet-pattern.svg',
  'assets/images/logo-full-cropped.jpg',
  'assets/images/dest-baku.jpg',
  'assets/images/dest-gobustan.jpg',
  'assets/images/dest-lahic.jpg',
  'assets/images/dest-shahdag.jpg',
  'assets/images/dest-sheki.jpg',
  'assets/images/exp-cuisine.jpg',
  'assets/images/icon-192.png',
  'assets/images/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then(async (cache) => {
      // A missing file must not break the whole install.
      await Promise.all(SHELL.map((url) => cache.add(url).catch(() => undefined)));
      await self.skipWaiting();
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    // Pages: fresh content first, cached shell when offline.
    event.respondWith(
      fetch(request).then((response) => {
        const path = new URL(request.url).pathname;
        if (response.ok && (path.endsWith('/') || path.endsWith('/index.html'))) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put('index.html', copy));
        }
        return response;
      }).catch(async () => {
        const cache = await caches.open(CACHE);
        return (await cache.match(request)) || (await cache.match('index.html')) || (await cache.match('.')) || Response.error();
      })
    );
    return;
  }

  // Static assets: cache first, then network with a silent cache write.
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) return cached;
      const response = await fetch(request);
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
  );
});
