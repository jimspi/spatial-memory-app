const CACHE_NAME = 'spatial-memory-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New spatial memory update',
    icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOTIgMTkyIj4KICA8cmVjdCB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgZmlsbD0iIzAwMDAwMCIvPgogIDxjaXJjbGUgY3g9Ijk2IiBjeT0iOTYiIHI9IjI4IiBmaWxsPSIjM0I4MkY2Ii8+CiAgPGNpcmNsZSBjeD0iOTYiIGN5PSIxNTYiIHI9IjEyIiBmaWxsPSIjM0I4MkY2Ii8+Cjwvc3ZnPg==',
    badge: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA5NiA5NiI+CiAgPHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2IiBmaWxsPSIjMDAwMDAwIi8+CiAgPGNpcmNsZSBjeD0iNDgiIGN5PSI0OCIgcj0iMTQiIGZpbGw9IiMzQjgyRjYiLz4KICA8Y2lyY2xlIGN4PSI0OCIgY3k9Ijc4IiByPSI2IiBmaWxsPSIjM0I4MkY2Ii8+Cjwvc3ZnPg==',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Memory',
        icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOTIgMTkyIj4KICA8cmVjdCB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgZmlsbD0iIzAwMDAwMCIvPgogIDxjaXJjbGUgY3g9Ijk2IiBjeT0iOTYiIHI9IjI4IiBmaWxsPSIjM0I4MkY2Ii8+CiAgPGNpcmNsZSBjeD0iOTYiIGN5PSIxNTYiIHI9IjEyIiBmaWxsPSIjM0I4MkY2Ii8+Cjwvc3ZnPg=='
      },
      {
        action: 'close',
        title: 'Close',
        icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOTIgMTkyIj4KICA8cmVjdCB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgZmlsbD0iIzAwMDAwMCIvPgogIDxjaXJjbGUgY3g9Ijk2IiBjeT0iOTYiIHI9IjI4IiBmaWxsPSIjM0I4MkY2Ii8+CiAgPGNpcmNsZSBjeD0iOTYiIGN5PSIxNTYiIHI9IjEyIiBmaWxsPSIjM0I4MkY2Ii8+Cjwvc3ZnPg=='
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('AI Spatial Memory', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
