'use strict';

var version = 'v3';
const CACHE_NAME = 'solidarianid-cache-' + version;

// Archivos que queremos precachear
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles/index.css',
  '/styles/links.css',
  '/styles/profile.css',
  '/assets/logo-solidarianid.png',
  '/assets/chico.png',
  '/assets/chica-solidarianid.png',
  '/assets/community-logo.png',
  '/assets/filter-actions-image.png',
  '/assets/filter-causes-image.png',
  '/assets/filter-communities-image-2.png',
  '/assets/filter-community-image.png',
  // ODS Images
  '/assets/ods/goal1.gif',
  '/assets/ods/goal-1.png',
  '/assets/ods/goal-2.png',
  '/assets/ods/goal-3.png',
  '/assets/ods/goal-4.png',
  '/assets/ods/goal-5.png',
  '/assets/ods/goal-6.png',
  '/assets/ods/goal-7.png',
  '/assets/ods/goal-8.png',
  '/assets/ods/goal-9.png',
  '/assets/ods/goal-10.png',
  '/assets/ods/goal-11.png',
  '/assets/ods/goal-12.png',
  '/assets/ods/goal-13.png',
  '/assets/ods/goal-14.png',
  '/assets/ods/goal-15.png',
  '/assets/ods/goal-16.png',
  '/assets/ods/goal-17.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .map((c) => c.split('-'))
          .filter((c) => c[0] === 'cache')
          .filter((c) => c[1] !== version)
          .map((c) => caches.delete(c.join('-')))
      )
    )
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      console.log(event.request.url + ' ' + (response ? 'in cache' : 'not in cache'));
      return response || fetch(event.request);
    })
  );
});

// Register event listener for the 'push' event.
self.addEventListener('push', function (event) {
  const payload = event.data ? event.data.text() : 'no payload';

  // Keep the service worker alive until the notification is created.
  event.waitUntil(
    self.registration.showNotification('New notification from SolidarianID', {
      body: payload,
      data: { url: 'http://localhost:5173/notifications' },
    })
  );
});

self.addEventListener('notificationclick', function (event) {
  let urlToOpen = event.notification.data.url;

  console.log('URL to open:', urlToOpen); // Muestra la URL en la consola para depuración.

  // Usamos waitUntil para abrir la ventana en el cliente.
  event.waitUntil(
    clients.openWindow(urlToOpen) // Abre la URL en la ventana activa del cliente.
  );
});
