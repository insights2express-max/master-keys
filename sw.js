/* Master Keys (fka Clue Duel) — service worker: caches the whole app so it plays offline.
   Bump CACHE whenever any file changes, so players get the update. */
const CACHE = 'master-keys-v10b-1'; // v10b-1: Hint marks a cell only (no tile picked); v10a-1: Alfa Slab One titles (fonts/alfa-slab-one.woff2), collapsible game cards, New Game fits, striped Hint cell; v10-1: the Lobby (one card per game), CrossKeys Setup screen, Master Keys settings, How To Play split; v09a-3: v09a-3: Master Keys Lexicon L14.02 (data-only: drafts round 2); v09a-2: L14.01; v09a: Night crossing-clue text, quicker tile drops + slow-drop recorder, new icons, code files renamed lockword.js / lockwords.js
const ASSETS = [
  './',
  'index.html',
  'names.js',
  'style.css',
  'lexicon.js',
  'cluepics.js',
  'wordplay.js',
  'lockwords.js',
  'lockword.js',
  'engine.js',
  'app.js',
  'manifest.webmanifest',
  'icons/icon.svg',
  'icons/crosskeys.svg',
  'icons/lockword.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/maskable-512.png',
  'icons/apple-touch-icon.png',
  'fonts/alfa-slab-one.woff2'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE && /^(master-keys|clue-duel)-/.test(k)).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // v08j: the owner's defaults file is always read fresh from the network (never cached), so edits reach players
  if (new URL(req.url).pathname.endsWith('/defaults.json')) return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => {
      if (hit) return hit;
      return fetch(req).then(res => {
        if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => (req.mode === 'navigate' ? caches.match('index.html') : Response.error()));
    })
  );
});
