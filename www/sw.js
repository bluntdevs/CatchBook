// CatchBook service worker: werkt zonder bereik en meldt nieuwe versies.
// Verhoog VERSION bij elke release (samen met APP_VERSION in index.html en package.json).
const VERSION = '0.5.9';
const CACHE = 'catchbook-' + VERSION;
const FILES = [
  './',
  'index.html',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/maskable-512.png',
  'icons/apple-touch-icon.png',
  'fonts/interd-600.woff',
  'fonts/interd-700.woff',
  'fonts/poppins-500.woff',
  'fonts/poppins-700.woff',
  'help/h0_welkom.jpg',
  'help/h1_start.jpg',
  'help/h2_vissen.jpg',
  'help/h3_stek.jpg',
  'help/h4_sessies.jpg',
  'help/h5_backup.jpg',
  'help/h6_extra.jpg'
];

// cache: 'reload' = altijd vers van de server, niet uit de browsercache (GitHub Pages bewaart 10 min).
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES.map((f) => new Request(f, { cache: 'reload' })))));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('catchbook-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (e) => {
  if (e.data === 'skip') self.skipWaiting();
});

// Eigen bestanden: eerst uit de cache (snel en zonder bereik), op de achtergrond niets ophalen;
// nieuwe versies komen binnen via een nieuwe service worker.
// Externe adressen (bv. Google Maps): gewoon het netwerk.
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        if (res.ok && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => (req.mode === 'navigate' ? caches.match('index.html') : Response.error()));
    })
  );
});
