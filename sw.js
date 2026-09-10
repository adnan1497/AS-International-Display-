const CACHE_NAME = 'smart-display-v3';

const ASSETS = [
    '/AS-International-Display-/',
    '/AS-International-Display-/display-app.html',
    '/AS-International-Display-/manifest.json',
    '/AS-International-Display-/icon.png'
];

// Install and cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );

    self.skipWaiting();
});

// Activate and remove old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        })
    );

    self.clients.claim();
});

// Network first
// This keeps your latest products/data available.
// If network fails, use cached version.
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});