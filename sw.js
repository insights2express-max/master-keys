/* Clue Duel — service worker: caches the whole app so it plays offline.
   Bump CACHE whenever any file changes, so players get the update. */
const CACHE = 'clue-duel-v08t-1'; // v08t: Lexicon L13 (JM's A review: 375 drafts accepted; sound-alike clues to Wordplay, blanks to Indirect; 125 new 1-letter clues with the blank inside the word). v08s: Lexicon L12 (JM's edits sorted Literal / Indirect). v08r: top boxes mirrored (Bot clock in per-turn games, names centered), long settings line wraps, Lexicon L11. v08q: Screen setting with Night, ⚙ Changes now / From your next game, Letters in Hand 4–8 and changeable mid-game, Full Hand 2 per tile, bigger hub, DONE under the hand on upright tablets, word progress on clue cards, Lexicon L10. v08p: new top band, floating messages, tap-a-clue cards, orange missing-letter marks, the Bot waits after red marks, 2-second Bot finish, wide-screen wings and big DONE. v08o: the Bot's own whole-game clock, play on alone after a clock runs out, "N min each (whole game)". v08n: the 3D look (candy-drop tiles, wells, clue plaques, float-and-settle, keycap buttons), zoom arrow keys + Esc, "the Bot" wording. v08m: grid zoom (pinch, Ctrl + wheel, 🔍 focus, arrows, mini-map), reports wait for the red marks, no "didn't fit" notices, gold win frame, hatched Scan cells, ⚙ New game fixed. v08L: ⏭ pass chip, 🔦 Scan, pale crossing clues, Results after the wrong-tile bounce, ⚙ fits phones, clue popup fits, Space pauses. v08k: faster on phones, WordGrams-style wrong tiles, held clock-out notice, no row highlight, open-bonus pulse, new colors, louder countdown. v08j: grid colors (5 schemes), final-play view, clock-out final turn, menu defaults (defaults.json), louder countdown, phone two-finger drag
const ASSETS = [
  './',
  'index.html',
  'style.css',
  'lexicon.js',
  'cluepics.js',
  'wordplay.js',
  'vaultwords.js',
  'vault.js',
  'engine.js',
  'app.js',
  'manifest.webmanifest',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/maskable-512.png',
  'icons/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
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
