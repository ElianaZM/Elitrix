const CACHE_NAME = 'v3';
const urlsToCache = [
    '/',
    '/index.html',
    '/style/styles.css',
    '/js/initialization.js',
    '/js/Hex.js',
    '/images/icons/maskable-512.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then (cache => cache.addAll(urlsToCache))
        );
});
   