‎const CACHE_NAME = 'smart-display-v2';
‎const ASSETS = [
‎  '/',
‎  '/index.html',
‎  '/manifest.json',
‎  '/icon.png'
‎];
‎
‎// ইন্সটল এবং ক্যাশ করা
‎self.addEventListener('install', (event) => {
‎    event.waitUntil(
‎        caches.open(CACHE_NAME).then((cache) => {
‎            return cache.addAll(ASSETS);
‎        })
‎    );
‎    self.skipWaiting();
‎});
‎
‎// পুরনো ক্যাশ ডিলিট করা
‎self.addEventListener('activate', (event) => {
‎    event.waitUntil(
‎        caches.keys().then((keys) => {
‎            return Promise.all(
‎                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
‎            );
‎        })
‎    );
‎    self.skipWaiting();
‎});
‎
‎// নেটওয়ার্ক ফার্স্ট স্ট্র্যাটেজি (যাতে নতুন প্রোডাক্ট সবসময় দেখা যায়)
‎self.addEventListener('fetch', (event) => {
‎    event.respondWith(
‎        fetch(event.request).catch(() => {
‎            return caches.match(event.request);
‎        })
‎    );
‎});
‎