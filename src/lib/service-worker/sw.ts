const CACHE_NAME = 'millionaire-calculator-v1'
const CURRENCY_CACHE_NAME = 'currency-rates-v1'

// Install event - cache static assets
self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        // Add other static assets as needed
      ])
    })
  )
  ;(self as any).skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event: any) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== CURRENCY_CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
  ;(self as any).clients.claim()
})

// Fetch event - stale-while-revalidate for API calls
self.addEventListener('fetch', (event: any) => {
  const url = new URL(event.request.url)

  // Handle currency API requests
  if (url.pathname.includes('exchangerate-api.com') || url.pathname.includes('fixer.io')) {
    event.respondWith(
      caches.open(CURRENCY_CACHE_NAME).then((cache) => {
        return fetch(event.request)
          .then((response) => {
            // Clone the response
            const responseToCache = response.clone()

            // Check if response is valid
            if (response.status === 200) {
            // Store in cache
            cache.put(event.request, responseToCache)
            }

            return response
          })
          .catch(() => {
            // Network failed, try cache
            return cache.match(event.request).then((cachedResponse) => {
              if (cachedResponse) {
                // Return cached response but mark as stale
                const headers = new Headers(cachedResponse.headers)
                headers.set('X-Cache-Stale', 'true')
                return new Response(cachedResponse.body, {
                  status: cachedResponse.status,
                  statusText: cachedResponse.statusText,
                  headers,
                })
              }
              throw new Error('No cached data available')
            })
          })
      })
    )
    return
  }

  // For other requests, try network first, fallback to cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone the response
        const responseToCache = response.clone()

        // Cache successful responses
        if (response.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
        }

        return response
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request)
      })
  )
})

// Export for TypeScript
export {}

