// service-worker.js

// Usamos el Workbox si quieres (aunque puedes hacerlo manual)
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const CACHE_NAME = 'hextris-v1';
const offlineFallbackPage = '/offline.html'; // <-- Cambia a tu página offline real

const urlsToCache = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    '/images/icons/maskable-512.png',
    offlineFallbackPage  // También cacheamos la página offline
];

// Instalar y cachear
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting();
});

// Activar y limpiar caches viejos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Interceptar requests
self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
        // Si es navegación de página
        event.respondWith((async () => {
            try {
                const preloadResp = await event.preloadResponse;
                if (preloadResp) {
                    return preloadResp;
                }

                const networkResp = await fetch(event.request);
                return networkResp;
            } catch (error) {
                const cache = await caches.open(CACHE_NAME);
                const cachedResp = await cache.match(offlineFallbackPage);
                return cachedResp;
            }
        })());
    } else {
        // Para otros archivos (css, js, imagenes, etc.)
        event.respondWith(
            caches.match(event.request).then((cached) => {
                return cached || fetch(event.request);
            })
        );
    }
});

// Background Sync
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-jugadores') {
        event.waitUntil(syncJugadores());
    }
});

async function syncJugadores() {
    console.log('Intentando sincronizar datos con el servidor...');
    try {
        const response = await fetch('/api/sync');
        if (!response.ok) throw new Error('Fallo en la sincronización');
        return response;
    } catch (err) {
        console.error('Error al sincronizar:', err);
    }
}

// Habilitar navegación preload si existe
if (workbox.navigationPreload.isSupported()) {
    workbox.navigationPreload.enable();
}
