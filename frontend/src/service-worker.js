import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

precacheAndRoute(self.__WB_MANIFEST);

// Cache first strategy for static assets
registerRoute(
  ({ request }) =>
    request.destination === 'image' ||
    request.destination === 'style' ||
    request.destination === 'script',
  new CacheFirst({
    cacheName: 'static-resources',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

// Network first strategy for API requests
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-resources',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 Minutes
      }),
    ],
  })
);

self.addEventListener('push', (event) => {
  const payload = event.data?.text() ?? 'No payload';
  event.waitUntil(
    self.registration.showNotification('New notification from SolidarianID', {
      body: payload,
      data: { url: '/notifications' },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  const url = event.notification.data.url;
  event.waitUntil(clients.openWindow(url));
});
