/* Offline support. Online, the site's own files always come fresh from the network and a copy
   is saved; offline, that saved copy is used. Fonts rarely change, so they are served from the
   saved copy first. Change CACHE only to wipe every visitor's saved copy. */
const CACHE = 'pancha-tattva-v2';
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
    const save = res => { if (res.ok || res.type === 'opaque') cache.put(e.request, res.clone()); return res; };
    if (font) return (await cache.match(e.request)) || fetch(e.request).then(save);
    try {
      return save(await fetch(e.request));
    } catch (err) {
      const saved = await cache.match(e.request, { ignoreSearch: true });
      if (saved) return saved;
      throw err;
    }
  }));
});
