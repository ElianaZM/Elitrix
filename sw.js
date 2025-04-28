const CACHE_NAME = 'v3';
const urlsToCache = [
    '/',
    '/index.html',
    '/style/style.css',
    '/js/initialization.js',
    '/js/Hex.js',
    '/js/Block.js',
    '/js/checking.js',
    '/js/comboTimer.js',
    '/js/input.js',
    '/js/main.js',
    '/js/math.js',
    '/js/render.js',
    '/js/save-state.js',
    '/js/Text.js',
    '/js/update.js',
    '/js/view.js',
    '/js/wavegen.js',
    '/images/icons/maskable-512.png',
    '/images/icons/maskable-192.png',
    '/images/icons/maskable-512.webp',
    '/images/icons/maskable-192.webp',
    '/images/icons/maskable.svg',
    '/images/icons/transparent-192.png',
    '/images/icons/transparent-512.png',
    '/images/icons/transparent-192.webp',
    '/images/icons/transparent-512.webp',
    '/images/icons/transparent.svg',
    '/images/icons/apple-touch-512.png',
    '/images/icons/apple-touch-120.png',
    '/images/icons/apple-touch-167.png',
    '/images/icons/apple-touch-180.png',
    '/images/icons/apple-touch-152.png',
    '/images/icons/apple-touch.svg',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then (cache => cache.addAll(urlsToCache))
        );
});
   