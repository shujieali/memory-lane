const CACHE_NAME = 'memory-lane-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
]

// Install service worker and cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(async (cache) => {
        // Cache the app shell and static assets
        await cache.addAll(urlsToCache)
      }),
      self.skipWaiting(), // Activate new service worker immediately
    ]),
  )
})

// Serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Don't cache POST requests (like file uploads)
  if (event.request.method === 'POST') {
    return
  }

  // Don't cache API requests
  if (event.request.url.includes('api')) {
    return
  }

  // Only cache static assets with supported URL schemes
  if (
    event.request.method === 'GET' &&
    (event.request.url.startsWith('http://') ||
      event.request.url.startsWith('https://')) &&
    event.request.url.match(/\.(js|css|html|png|jpg|jpeg|gif|svg|ico)$/)
  ) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response
        }
        return fetch(event.request)
          .then((response) => {
            // Check if we received a valid response
            if (
              !response ||
              response.status !== 200 ||
              response.type !== 'basic'
            ) {
              return response
            }

            const responseToCache = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache)
            })

            return response
          })
          .catch(() => {
            // If the fetch fails (e.g., due to being offline), serve the app shell
            // The app's router will handle showing the offline page
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/index.html')
            }
            return null
          })
      }),
    )
  }
})

// Clean up old caches when a new service worker takes over
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName)
            }
          }),
        )
      }),
      clients.claim(), // Take control of all clients immediately
    ]),
  )
})
