const CACHE_NAME = 'hextris-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    '/images/icons/maskable-512.png'
];

// Instalar y cachear
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Activar y limpiar caches viejas
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );
});

// Interceptar requests
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cached) => {
            return cached || fetch(event.request);
        })
    );
});

// 🔄 Background Sync
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-jugadores') {
        event.waitUntil(syncJugadores());
    }
});

function syncJugadores() {
    console.log('Intentando sincronizar datos con el servidor...');
    
    // Simulación: Podés cambiar a POST o tu lógica real
    return fetch('/api/sync')
        .then(response => {
            if (!response.ok) throw new Error('Fallo en la sincronización');
            return response;
        })
        .catch(err => {
            console.error('Error al sincronizar:', err);
        });
}
