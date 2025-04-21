// Durante la instalación, caché archivos esenciales
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('mi-cache').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/css/styles.css', // Asegúrate de que estas rutas sean correctas
                '/js/app.js',
                '/images/icons/maskable-512.png'
            ]);
        })
    );
});

// Manejar las solicitudes de la red
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Si hay una respuesta en caché, devuélvela, de lo contrario, busca en la red
            return cachedResponse || fetch(event.request);
        })
    );
});
