// Service Worker for Ankit Jha Portfolio PWA
// Version 1.0.0

const CACHE_NAME = 'ankit-jha-portfolio-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/next-gen-styles.css',
  '/advanced-animations.css',
  '/enhanced-ux.css',
  '/next-gen-features.js',
  '/advanced-animations.js',
  '/enhanced-ux.js',
  '/manifest.json',
  '/ankit jha.jpg',
  '/favicon.svg.png',
  '/Resume.pdf',
  '/karm.jpg',
  '/work-1.png',
  '/work-2.png',
  '/work-3.png',
  '/xenocrm.png',
  '/zaika.png',
  '/budmatching.png',
  // External CDN resources
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap',
  'https://unpkg.com/aos@next/dist/aos.css',
  'https://unpkg.com/aos@next/dist/aos.js',
  'https://unpkg.com/typed.js@2.1.0/dist/typed.umd.js'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: All files cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Cache failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip Chrome extension requests
  if (event.request.url.startsWith('chrome-extension://')) return;

  // Skip analytics and external API calls
  if (event.request.url.includes('analytics') || 
      event.request.url.includes('gtag') ||
      event.request.url.includes('google-analytics')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          console.log('Service Worker: Serving from cache', event.request.url);
          return response;
        }

        // Otherwise fetch from network
        console.log('Service Worker: Fetching from network', event.request.url);
        return fetch(event.request).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response (can only be consumed once)
          const responseToCache = response.clone();

          // Add to cache if it's a same-origin request
          if (event.request.url.startsWith(self.location.origin)) {
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
          }

          return response;
        }).catch((error) => {
          console.error('Service Worker: Fetch failed', error);
          
          // Return offline fallback for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          
          throw error;
        });
      })
  );
});

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'contact-form-sync') {
    console.log('Service Worker: Background sync for contact form');
    event.waitUntil(
      // Handle offline form submissions here if needed
      Promise.resolve()
    );
  }
});

// Push notifications (for future use)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/favicon.svg.png',
    badge: '/favicon.svg.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'View Portfolio',
        icon: '/favicon.svg.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/favicon.svg.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Ankit Jha Portfolio', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle messages from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Network-first strategy for API calls
const networkFirstUrls = [
  '/api/',
  'https://script.google.com/'
];

// Cache-first strategy for static assets
const cacheFirstUrls = [
  '.css',
  '.js',
  '.png',
  '.jpg',
  '.jpeg',
  '.svg',
  '.pdf'
];

// Enhanced fetch strategy
self.addEventListener('fetch', (event) => {
  const requestUrl = event.request.url;

  // Network-first for API calls
  if (networkFirstUrls.some(url => requestUrl.includes(url))) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for static assets
  if (cacheFirstUrls.some(ext => requestUrl.includes(ext))) {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
    return;
  }
});

// Update check
self.addEventListener('message', (event) => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

console.log('Service Worker: Loaded successfully');
