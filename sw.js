const CACHE_NAME = 'v7';

const urlsToCache = [
  '/',
  '/index.html',
  
  '/vendor/hammer.min.js',
  '/vendor/jquery.js',
  '/vendor/js.cookie.js',
  '/vendor/jsonfn.min.js',
  '/vendor/keypress.min.js',
  '/vendor/sweet-alert.min.js',

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
  '/js/a.js',
 
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
  '/images/android.png',
  '/images/appstore.svg',
  '/images/btn_back.svg',
  '/images/btn_help.svg',
  '/images/btn_pause.svg',
  '/images/btn_restart.svg',
  '/images/btn_resume.svg',
  '/images/icon_arrows.svg',
  '/images/PauseScreenshot.png',
  '/images/twitter-opengraph.png',
  '/images/facebook-opengraph.png',
];

// Activación rápida si se envía el mensaje
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Instalación y cacheado individualizado
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(
      urlsToCache.map(async (url) => {
        try {
          await cache.add(url);
        } catch (err) {
          console.warn(` No se pudo cachear ${url}:`, err);
        }
      })
    );
  })());
  self.skipWaiting();
});

// Limpieza de cachés antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Manejo de peticiones
self.addEventListener('fetch', (event) => {
   // Páginas HTML (navegación)
    if (event.request.mode === 'navigate') {
      event.respondWith((async () => {
        try {
          return await fetch(event.request);
        } catch {
          const cache = await caches.open(CACHE_NAME);
          return await cache.match('/index.html');
        }
      })());
      return;
    }

    // Recursos estáticos (JS, CSS, imágenes...)
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request);
      try {
        const networkResponse = await fetch(event.request);
        if (networkResponse && networkResponse.status === 200) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      } catch {
        return cachedResponse;
      }
    })());
});

