/* Master Keys (fka Clue Duel) — service worker: caches the whole app so it plays offline.
   Bump CACHE whenever any file changes, so players get the update. */
const CACHE = 'master-keys-v12h-1'; // v12h-1: KeyCubes 💡 mark on words a Hint helped (JM CD-126: 2.1.1); v12g-2: Master Keys Lexicon L14.08 (JM's CD-124 fixes: 6 clues); v12g-1: KeyCubes: each word's best path; the Bot takes it more often at higher levels; results and Hints use it (JM CD-125: 2.1); v12f-1: KeyCubes typing takes the highest-scoring path (JM CD-123 add. 1.2); v12e-2: Master Keys Lexicon L14.07 (JM's CD-108 Copy Edits applied, KeyRing round 2 ACTIVE; G drafts + KeyRing round 3 I-P ON-DECK); v12e-1: KeyCubes v12e (JM CD-121, CD-122): Solo best rate (pts/sec) and timed bests, bigger standard pause button, green round bests, 2 and 4 rounds, Button Color in the Setup preview; white level-pill number in every game; v12d-1: KeyCubes v12d (JM CD-119): rivals per Challenge Level, CrossKeys-style score cards, gentler Bot, Enter twice, quicker swipes, results scroll fix, more Cube Colors; Button Colors Ruby / Emerald / Onyx and one Paused panel in every game; v12b-1: one Paused panel in every game (big drawn pause icon), KeyCubes 'Challenge Level', LockWord ENTER X corner to corner, KeyRing Drop numerals + results note (JM CD-115, CD-117; built after v12c, so it includes v12c); v12c-1: KeyCubes v12c (JM CD-112, CD-116): smoother swipes, Bonus cubes, Next cube Hint, Left line, Rotate, game-total score card, word colors, candy-drop cubes; "You WIN!" in every game; v12a-1: new coin rules (balances reset to 100), New Game everywhere, drawn NEW / pause icons, Apprentice, LockWord ENTER states and coin buttons, CrossKeys level pill + NEW, KeyRing fixed Ring / None / colors button / results (JM CD-111, CD-113); v12-1: KeyCubes, the letter-cube word hunt (keycubes.js, keycubes-words.js, icons/keycubes.svg; JM CD-103, CD-109); v11f-1: KeyRing 3-letter Rings fixed, corner text fit, Key grid below the switch, speed coins capped; LockWord Enter / space keys (JM CD-107, CD-110); v11e-3: Master Keys Lexicon L14.06 (KeyRing everyday words round 2: 335 ON-DECK rows D-H with drafts); v11e-2: Master Keys Lexicon L14.05 (JM's CD-104 Copy Edits applied, 315 KeyRing words ACTIVE, letter-F drafts); v11e-1: one 3D gold coin + new coin pill everywhere, Button Colors in every game, glass / 3D relief on every button, KeyRing polish (JM CD-102, CD-105); v11d-2: Master Keys Lexicon L14.04 (KeyRing everyday words round 1: 315 ON-DECK rows A-C with drafts); v11d-1: KeyRing v11d (JM CD-98, CD-100): corner-piece coin buttons (3 looks), Hint skips clue-less words, colors switch in the Key grid, bigger Pause panel; v11c-2: Master Keys Lexicon L14.03 (data-only: drafts round 3, 138 letter-E rows); v11c-1: KeyRing v11c (JM CD-97): everyday words (keyrings.js K03), Key / Bonus Words Quantity, timer flash, speed coins, bigger header icons; v11b-2: install fetches every file fresh (a stale v11a copy was cached as v11b-1); v11b-1: KeyRing v11b (JM CD-90, CD-95), keyrings.js K02, red muted speaker, Coins heading with the balance; v11a-1: one-row win report in every game (CD-93); v11-1: KeyRing, the word builder (keyring.js, keyrings.js, icons/keyring.svg); v10b-1: Hint marks a cell only (no tile picked); v10a-1: Alfa Slab One titles (fonts/alfa-slab-one.woff2), collapsible game cards, New Game fits, striped Hint cell; v10-1: the Lobby (one card per game), CrossKeys Setup screen, Master Keys settings, How To Play split; v09a-3: v09a-3: Master Keys Lexicon L14.02 (data-only: drafts round 2); v09a-2: L14.01; v09a: Night crossing-clue text, quicker tile drops + slow-drop recorder, new icons, code files renamed lockword.js / lockwords.js
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
  'keycubes-words.js',
  'keycubes.js',
  'engine.js',
  'app.js',
  'manifest.webmanifest',
  'icons/icon.svg',
  'icons/crosskeys.svg',
  'icons/lockword.svg',
  'icons/keyring.svg',
  'icons/keycubes.svg',
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
