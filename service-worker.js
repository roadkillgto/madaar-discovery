// service-worker.js — Mada'ar offline cache
// Cache-first strategy: serves from cache instantly, falls back to network.
// On first load this caches every asset. After that: zero internet needed.

const CACHE_NAME = 'madaar-v1';

const ASSETS = [
  './',
  './index.html',
  './main.js',
  './moon.js',
  './data.js',
  './utils.js',
  './config.js',
  './style.css',
  './manifest.json'
];

// Install: cache everything up front
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: delete any old cache versions
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch: serve from cache, fall back to network
// If both fail (offline + not cached), serve index.html for navigation requests
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
