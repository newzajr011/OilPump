const CACHE_NAME = 'oil-pump-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/data.js',
  '/icon.svg',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) return response;
        return fetch(event.request).catch(() => {
          if (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) {
             return caches.match('/index.html');
          }
        });
      })
  );
});
