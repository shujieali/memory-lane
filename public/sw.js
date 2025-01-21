const CACHE_NAME = 'memory-lane-v1'
const STATIC_CACHE = 'static-v1'
const DATA_CACHE = 'data-v1'

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
]

// Install service worker and cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(async (cache) => {
        // Cache the app shell and static assets
        await cache.addAll(urlsToCache)
      }),
      caches.open(DATA_CACHE), // Create data cache
      self.skipWaiting(), // Activate new service worker immediately
    ]),
  )
})

// Serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Handle API requests
  if (request.url.includes('/api/')) {
    event.respondWith(
      caches.open(DATA_CACHE).then((cache) =>
        fetch(request)
          .then((response) => {
            if (response.ok) {
              cache.put(request, response.clone())
            }
            return response
          })
          .catch(() => cache.match(request)),
      ),
    )
    return
  }

  // Handle static assets
  if (
    request.method === 'GET' &&
    (request.url.startsWith('http://') || request.url.startsWith('https://'))
  ) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) =>
        cache.match(request).then((response) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            if (networkResponse.ok) {
              cache.put(request, networkResponse.clone())
            }
            return networkResponse
          })

          // Return cached response immediately, then update cache in background
          return (
            response ||
            fetchPromise.catch(() => {
              // If both cache and network fail, try to serve index.html for navigation requests
              if (request.headers.get('accept')?.includes('text/html')) {
                return cache.match('/index.html')
              }
              return new Response('', {
                status: 408,
                statusText: 'Request timed out',
              })
            })
          )
        }),
      ),
    )
  }
})

// Handle skip waiting message from client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Clean up old caches when a new service worker takes over
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Remove old versions of caches
            if (![STATIC_CACHE, DATA_CACHE].includes(cacheName)) {
              return caches.delete(cacheName)
            }
          }),
        )
      }),
      // Take control of all clients immediately
      clients.claim(),
    ]),
  )
})
