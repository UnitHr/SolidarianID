'use strict';

var version = 'v1';
const currentCache = 'cache-' + version;

const files = [
  'https://code.jquery.com/jquery-3.5.1.slim.min.js',
  'https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css',
  '/shell.html',
  '/stylesheets/style.css',
  '/javascripts/main.js',
  '/javascripts/sw.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(currentCache).then((cache) => {
      return cache.addAll(files);
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
