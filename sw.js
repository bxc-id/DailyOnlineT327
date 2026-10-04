const CACHE_NAME = 'daily-report-pwa-v1';
const urlsToCache = [
  './',
  './index.html', // Sesuaikan jika nama file Anda index (9).html, namun sangat disarankan untuk merubah nama file utama menjadi index.html agar lebih rapi.
  './manifest.json',
  './favicon.png',
  './favicon.jpg'
];

// Menginstall Service Worker dan menyimpan file ke cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Membuka cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Melakukan Fetching dari cache jika aplikasi offline
self.addEventListener('fetch', event => {
  // Hanya simpan request GET (Abaikan request POST untuk Google Script App)
  if (event.request.method !== 'GET') {
      return; 
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Update Cache (Mengaktifkan Service Worker)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
