/* Offline support. The site's own files are saved on first visit and served from that copy,
   while a fresh copy is fetched in the background for next time. Fonts are saved the same way.
   Change CACHE to force every visitor onto a clean copy. */
const CACHE = 'pancha-tattva-v1';
const SHELL = ['./', 'index.html', 'css/styles.css', 'js/content.js', 'js/shaders.js', 'js/app.js',
  'manifest.webmanifest', 'assets/icon.svg', 'assets/icon-192.png', 'assets/icon-512.png'];
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  const ours = url.origin === location.origin, font = FONT_HOSTS.includes(url.hostname);
  if (e.request.method !== 'GET' || !(ours || font)) return;
  e.respondWith(caches.open(CACHE).then(async cache => {
    const saved = await cache.match(e.request, { ignoreSearch: ours });
    const fresh = fetch(e.request).then(res => {
      if (res.ok || res.type === 'opaque') cache.put(e.request, res.clone());
      return res;
    });
    if (saved) { fresh.catch(() => {}); return saved; }
    return fresh;
  }));
});
