/* Master Keys (fka Clue Duel) — service worker: caches the whole app so it plays offline.
   Bump CACHE whenever any file changes, so players get the update. */
const CACHE = 'master-keys-v11f-1'; // v11f-1: KeyRing 3-letter Rings fixed, corner text fit, Key grid below the switch, speed coins capped; LockWord Enter / space keys (JM CD-107, CD-110); v11e-3: Master Keys Lexicon L14.06 (KeyRing everyday words round 2: 335 ON-DECK rows D-H with drafts); v11e-2: Master Keys Lexicon L14.05 (JM's CD-104 Copy Edits applied, 315 KeyRing words ACTIVE, letter-F drafts); v11e-1: one 3D gold coin + new coin pill everywhere, Button Colors in every game, glass / 3D relief on every button, KeyRing polish (JM CD-102, CD-105); v11d-2: Master Keys Lexicon L14.04 (KeyRing everyday words round 1: 315 ON-DECK rows A-C with drafts); v11d-1: KeyRing v11d (JM CD-98, CD-100): corner-piece coin buttons (3 looks), Hint skips clue-less words, colors switch in the Key grid, bigger Pause panel; v11c-2: Master Keys Lexicon L14.03 (data-only: drafts round 3, 138 letter-E rows); v11c-1: KeyRing v11c (JM CD-97): everyday words (keyrings.js K03), Key / Bonus Words Quantity, timer flash, speed coins, bigger header icons; v11b-2: install fetches every file fresh (a stale v11a copy was cached as v11b-1); v11b-1: KeyRing v11b (JM CD-90, CD-95), keyrings.js K02, red muted speaker, Coins heading with the balance; v11a-1: one-row win report in every game (CD-93); v11-1: KeyRing, the word builder (keyring.js, keyrings.js, icons/keyring.svg); v10b-1: Hint marks a cell only (no tile picked); v10a-1: Alfa Slab One titles (fonts/alfa-slab-one.woff2), collapsible game cards, New Game fits, striped Hint cell; v10-1: the Lobby (one card per game), CrossKeys Setup screen, Master Keys settings, How To Play split; v09a-3: v09a-3: Master Keys Lexicon L14.02 (data-only: drafts round 2); v09a-2: L14.01; v09a: Night crossing-clue text, quicker tile drops + slow-drop recorder, new icons, code files renamed lockword.js / lockwords.js
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
  'keyrings.js',
  'keyring.js',
  'engine.js',
  'app.js',
  'manifest.webmanifest',
  'icons/icon.svg',
  'icons/crosskeys.svg',
  'icons/lockword.svg',
  'icons/keyring.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/maskable-512.png',
  'icons/apple-touch-icon.png',
  'fonts/alfa-slab-one.woff2'
];

// v11b-2: every file is fetched fresh from the server (cache: 'reload'), never from the browser's own short-term copy; that
// copy could still hold the previous version's files for a few minutes after a release and freeze them under the new name
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
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
