// Version should be updated whenever service worker logic changes
const SW_VERSION = '2.0.0'

// Unregister any existing service workers and clear caches
const unregisterAndClearCaches = async () => {
  try {
    // Unregister all service workers
    const registrations = await navigator.serviceWorker.getRegistrations()
    await Promise.all(
      registrations.map((registration) => registration.unregister()),
    )

    // Clear all caches
    const cacheKeys = await caches.keys()
    await Promise.all(cacheKeys.map((key) => caches.delete(key)))

    console.log('Successfully cleared all service workers and caches')
  } catch (error) {
    console.error('Failed to clear service workers and caches:', error)
  }
}

// Handle service worker updates
const handleServiceWorkerUpdate = (registration: ServiceWorkerRegistration) => {
  // When the service worker is updated, show a message to the user
  if (registration.waiting) {
    // New service worker is waiting to activate
    console.log('New version available! Updating service worker...')

    // Post message to service worker to skip waiting and activate immediately
    registration.waiting.postMessage({ type: 'SKIP_WAITING' })

    // Reload the page to ensure the new service worker takes control
    window.location.reload()
  }
}

export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      // First, unregister existing service workers and clear caches
      await unregisterAndClearCaches()

      // Register new service worker with version parameter to force update
      const registration = await navigator.serviceWorker.register(
        `/sw.js?v=${SW_VERSION}`,
        {
          scope: '/',
          updateViaCache: 'none', // Prevent browser from caching the service worker file
        },
      )

      // Log registration status
      if (registration.installing) {
        console.log('Service worker installing')
      } else if (registration.waiting) {
        console.log('Service worker installed and waiting')
        handleServiceWorkerUpdate(registration)
      } else if (registration.active) {
        console.log('Service worker active')
      }

      // Listen for service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              handleServiceWorkerUpdate(registration)
            }
          })
        }
      })

      // Handle service worker controlled changes
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('New service worker activated')
      })
    } catch (error) {
      console.error('Service worker registration failed:', error)
    }
  } else {
    console.log('Service workers are not supported')
  }
}
