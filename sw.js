const CACHE_NAME = 'smart-display-v4';

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

// Network first, but also save a copy of everything that loads successfully
// (product photos, product data from Supabase) into the cache as it goes.
// If the network fails (no wifi), fall back to the last saved copy instead
// of breaking — so the display keeps showing the last-known products.
self.addEventListener('fetch', (event) => {
    // Only cache "read" requests (GET). Writes from the Admin Panel / Company
    // Portal (POST/PATCH/DELETE) are left alone and always go straight to
    // the network, untouched.
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                if (response && (response.ok || response.type === 'opaque')) {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, copy);
                    }).catch(() => {});
                }
                return response;
            })
            .catch(() => {
                return caches.match(event.request);
            })
    );
});
                        
