/* Master Keys — KeyRing (v11; JM CD-87: 1.1–1.6, CD-88: 1.1–7): a word builder. Spell words from the letters on a
   Ring to fill every slot. Solo; the slot list only.
   - Input: swipe (touch) or drag (mouse) across the tiles, sliding back one tile undoes it; or tap the tiles one by one
     and tap the last one again; or type the word and press Enter. Each tile once per word.
   - Slot words: Lexicon words (Status blank or ACTIVE, in ENABLE, 3+ letters) spelled from the Ring, picked by the
     Challenge Level. Seeds and tiers come from keyrings.js (tools/build-keyring-levels.ps1). Every Ring is fresh (CD-88: 3.1a).
   - Bonus words: any other ENABLE word (3–8 letters) from the Ring pays 🪙1, no cap (CD-88: 4.1a). Rude words never count.
   - Coins (CD-88: 5.1.1): a Ring is worth 100 coins, shared over its letter squares (100 ÷ letters = one letter's value).
     💡 Hint = one letter's value × the letters in the slot it clues (a random empty slot, or the one you picked);
     🔑 Key Drop = one letter (a single letter per drop); Ring cleared = one letter's value × the letters you filled
     yourself (Key Drop letters don't pay). So a Ring cleared with no help pays 100.
   - Layout (CD-88: 1.6.1–1.6.2): the Ring spans almost the full width of a phone; the BONUS tag, 💡 Hint and 🔑 Drop sit
     in the Ring's corners; Shuffle stays in the Ring's center. Hint is a signal, not a solve: it shows a clue only (CD-85).
   v11b (JM CD-90, CD-95): "Key words" (the words in the Key grid) and "Key grid" (their box); fewer bonus words (the Key grid
   takes in the everyday words a Ring spells, -S forms too) and a Key words setting (Auto / Few / Some / Many); Key words in
   candy colors (by word or by letter); rectangular 3D coin buttons; ⏱ +30s (🪙10) in the top-right corner, even after the
   Ring ends; ⏸ Pause (the button or the clock) blurs the Ring and the Key grid; 🆕 New Game in the header; Tab cycles the
   Ring buttons; purple BONUS; big colored message pills; layout Auto / Stacked / Side by side; Setup switch "Time's up pays
   for your letters"; a new result window (time beside the heading, Key / Bonus / Missed word groups, the balance beside Coins).
   v11c (JM CD-97): everyday words from SCOWL become Key words (Hint gives the first letter when there is no clue); Key Words
   Quantity adds Most (up to 20) and Bonus Words Quantity (Fewest / Some / Plenty / Any); Key word lengths follow the Challenge
   Level; stronger Pause hiding; a Word / Letter colors switch in play; the last 10 seconds flash; speed coins (1 per second left).
   v11d (JM CD-98, CD-100): corner-piece coin buttons and BONUS that follow the Ring (Button style: Sapphire / Steel / Navy & gold),
   gold coins, Hint skips Key words with no clue yet, Most 12–18 on tablets and computers, Bonus Words Quantity Fewest / Some / Many /
   - Any -, the Word / Letter switch in the Key grid's corner, a bigger Pause panel, no second coil on the Ring.
   v11e (JM CD-102, CD-105): Ring Button Colors (Steel first); clean Key Words steps, the same on every device; thicker corner
   pieces with appliqué text; the app-wide 3D gold coin; no pegs on the tiles; glass Pause panel; bigger switch on tablets.
   v11f (JM CD-107, CD-110): 3-letter Rings deal at every level again; corner-piece text shrinks to stay inside its piece; the
   Key grid stays below the colors switch; speed coins capped at 20 per minute on the clock.
   v12a (JM CD-111, CD-113): a cleared Ring pays 10; speed coins at most 10 per minute; Bonus Words Quantity None; one button cycles
   Word / Letter / No colors; the Ring has a fixed size per screen; smaller tiles on 7- and 8-letter Rings; less space around the
   Key grid; the result's word groups alphabetized, with hint-darkened words and Key Drop counts; New Game; Apprentice.
   Saved on this device: settings 'cd.kr.settings', stats 'cd.kr.stats', an unfinished Ring 'cd.kr.save', recent seeds 'cd.kr.recent'. */
'use strict';
(function () {
  const UI = window.CDUI, E = window.Engine, D = window.KR_DATA;
  if (!UI || !E || !D) return;
  const { $, esc, store, toast, openModal, closeModal } = UI;
  const NM = Object.assign({ suite: 'Master Keys', ring: 'KeyRing' }, window.MK_NAMES || {});
  const snd = (n, d) => { if (UI.sound) UI.sound.play(n, d); };
  const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const night = () => document.documentElement.dataset.screen === 'night';

  // ---------- settings and stats ----------
  // v11b: kw = Key words (auto / few / some / many), colors = Key word colors (word / letter), layout (auto / stack / side),
  // timePay = a timed-out Ring pays for the letters you filled (CD-95: 2.1–2.2, off at first)
  const DEF = { n: 6, lv: 3, timer: 0, kw: 'auto', bw: 'fewest', colors: 'word', layout: 'auto', timePay: false, bs: 'b' }; // v11d: bs = Ring Button Colors (v11e, CD-105: 1.2: Steel first) // v11c: bw = Bonus Words Quantity
  const ks = Object.assign({}, DEF, store.get('cd.kr.settings', {}));
  if (ks.bw === 'plenty') ks.bw = 'many'; // v11d: renamed
  if (!ks.bsPicked) ks.bs = 'b'; // v11e: Steel is the default until the Player picks a look
  const saveKs = () => store.set('cd.kr.settings', ks);
  const blankStats = () => ({ played: 0, cleared: 0, streak: 0, best: 0, bonus: 0, fastest: {} });
  const st = Object.assign(blankStats(), store.get('cd.kr.stats', {}));
  const saveSt = () => store.set('cd.kr.stats', st);
  const TIMERS = [[0, 'Untimed'], [60, '1 min per Ring'], [120, '2 min per Ring'], [180, '3 min per Ring'], [300, '5 min per Ring']];
  const timerName = t => (TIMERS.find(x => x[0] === +t) || TIMERS[0])[1];
  const LV_NAMES = { 1: '1 · Apprentice', 10: '10 · Master' }; // v12a (CD-113: 2.1a)
  const N_DESC = { 3: 'A quick warm-up: short Key words.', 4: 'Key words of 3–4 letters.', 5: 'Key words up to 5 letters.', 6: 'Key words up to 6 letters.', 7: 'Key words up to 7 letters.', 8: 'Key words up to 8 letters: the longest Rings.' };
  const N_DEMO = { 3: 'TEA', 4: 'LEAP', 5: 'PLATE', 6: 'GARDEN', 7: 'PAINTER', 8: 'KEYRINGS' };
  const lastLine = () => `${ks.n} letters · Level ${ks.lv} · ${timerName(ks.timer)}`;
  const TIME_COST = 10, TIME_ADD = 30; // ⏱ +30s (CD-90: 4.1.4.1)
  const RING_PAY = 10, SPEED_PER_MIN = 10; // v12a (CD-113: 1.1.1; CD-111: 1.4.1): a cleared Ring pays 10; speed coins at most 10 per minute
  // v11d (CD-98 add. 2.3): the coin drawn in the suite's gold (as the coin pill), for the corner pieces and the result window.
  // Its gradient (#krCoinG) lives in the page's hidden SVG defs.
  const COIN = '🪙'; // v11e: app.js swaps every 🪙 on the page for the app-wide 3D gold coin

  // ---------- words ----------
  // bonus words: ENABLE, 3 letters from keyrings.js, 4–8 from LockWord's lockwords.js (sorted, fixed-length strings)
  const GUESS = window.VAULT_GUESS || {};
  const BLOCK = new Set(String(D.block || '').split(' ').filter(Boolean));
  function inPacked(s, n, w) {
    let lo = 0, hi = Math.floor(s.length / n) - 1;
    while (lo <= hi) { const mid = (lo + hi) >> 1, x = s.substr(mid * n, n); if (x === w) return true; if (x < w) lo = mid + 1; else hi = mid - 1; }
    return false;
  }
  function isWord(w) {
    const n = w.length;
    if (n < 3 || n > 8 || BLOCK.has(w)) return false;
    return inPacked(n === 3 ? String(D.three || '') : String(GUESS[n] || ''), n, w);
  }
  const counts = w => { const c = new Array(26).fill(0); for (let i = 0; i < w.length; i++) c[w.charCodeAt(i) - 65]++; return c; };
  const fits = (wc, sc) => { for (let i = 0; i < 26; i++) if (wc[i] > sc[i]) return false; return true; };
  const maskOf = w => { let m = 0; for (let i = 0; i < w.length; i++) m |= 1 << (w.charCodeAt(i) - 65); return m; };
  let LEX = null, LEXBY = null, EIGHT = null, POOL = null;
  function lex() {
    if (LEX) return LEX;
    LEX = []; LEXBY = {};
    for (const e of E.lexicon()) {
      const w = e.w;
      if (w.length < 3 || w.length > 7 || LEXBY[w] || !isWord(w)) continue;
      const x = { w, l: e.l || 1, e: e.e, h: e.h, wsk: e.wsk, cc: counts(w), m: maskOf(w) };
      LEXBY[w] = x; LEX.push(x);
    }
    EIGHT = {};
    for (const line of String(window.VAULT_EIGHT || '').split('\n')) {
      const [w, l, c, ez, hd] = line.split('|');
      if (w && w.length === 8) EIGHT[w] = { w, l: +l || 1, c: (c || '').trim(), ez: (ez || '').trim(), hd: (hd || '').trim() };
    }
    // v11c (JM CD-97: 1.4.1): the Key word pool: Lexicon words and LockWord's 8-letter words (both with clues), then the
    // everyday words from SCOWL's common-word lists (keyrings.js 'every', tiers 1–3: 1 = the most common)
    POOL = LEX.slice();
    const seen = new Set(LEX.map(e => e.w));
    for (const w in EIGHT) if (!seen.has(w) && !BLOCK.has(w) && isWord(w)) { seen.add(w); POOL.push({ w, l: EIGHT[w].l, cc: counts(w), m: maskOf(w) }); }
    for (const tier of [1, 2, 3]) {
      for (const w of String((D.every || {})[tier] || '').split(' ')) {
        if (!w || seen.has(w) || BLOCK.has(w)) continue;
        seen.add(w); POOL.push({ w, l: tier === 3 ? 4 : tier, cc: counts(w), m: maskOf(w), ev: 1 }); // tier 3 (SCOWL size 35) = word level 4
      }
    }
    return LEX;
  }
  const inSk = (r, lv) => !r || (lv >= r[0] && lv <= r[1]);
  const pickOne = t => { const a = String(t || '').split(';').map(s => s.trim()).filter(Boolean); return a.length ? a[Math.floor(Math.random() * a.length)] : ''; };
  // the clue a Hint shows: plain (Literal) clues at Challenge Levels 1–5, figurative (Indirect) ones at 6–10
  function clueOf(w, lv) {
    const x = LEXBY[w];
    if (x) return (lv >= 6 && pickOne(x.h)) || pickOne(x.e) || pickOne(x.h);
    const y = EIGHT[w];
    if (y) return (lv <= 3 ? y.ez || y.c : lv <= 7 ? y.c || y.ez : y.hd || y.c) || '';
    return '';
  }
  // an everyday word with no clue of its own: if it is a Lexicon word plus an ending (CATS, BAKED, JUMPING), its clue is the
  // Lexicon word's clue with the ending to add (CD-97: 1.3 Y)
  const SUFS = ['ING', 'ES', 'ED', 'ER', 'LY', 'S', 'D', 'R'];
  function derBase(w) {
    for (const suf of SUFS) if (w.length - suf.length >= 3 && w.endsWith(suf) && LEXBY[w.slice(0, -suf.length)]) return { base: w.slice(0, -suf.length), suf };
    return null;
  }
  function clueFor(w, lv) {
    const c = clueOf(w, lv); if (c) return c;
    const d = derBase(w); if (!d) return '';
    const b = clueOf(d.base, lv);
    return b ? `Add ${d.suf} to the answer for: ${b}` : '';
  }
  // no clue at all (an everyday word that isn't a Lexicon word plus an ending): Hint shows its first letter instead
  const clueLess = e => { if (e.cl == null) e.cl = !!e.ev && !derBase(e.w); return e.cl; };

  // ---------- dealing a Ring ----------
  // Challenge Level → the hardest word level allowed among the Key words (1 everyday … 5 obscure; everyday words are 1–3)
  const CAP = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5];
  // v11c (JM CD-97: 1.2.1–1.2.1.1.3): Key Words Quantity, by letters on the Ring: [fewest, most]. "Auto" follows the
  // Challenge Level (1–3 Few, 4–6 Some, 7–8 Many, 9–10 Most). Most reaches 20 on the bigger Rings.
  // v11e (JM CD-105: 2.2a): Key Words Quantity in clean steps that don't overlap, the same on every device (Most ends at 18 so
  // the Ring keeps a good size on phones): [fewest, most] by letters on the Ring.
  const KW = {
    3: { few: [2, 2], some: [3, 3], many: [4, 4], most: [5, 6] }, 4: { few: [3, 4], some: [5, 6], many: [7, 9], most: [10, 12] },
    5: { few: [4, 5], some: [6, 8], many: [9, 11], most: [12, 14] }, 6: { few: [5, 7], some: [8, 10], many: [11, 13], most: [14, 17] },
    7: { few: [6, 8], some: [9, 11], many: [12, 14], most: [15, 18] }, 8: { few: [6, 8], some: [9, 11], many: [12, 14], most: [15, 18] }
  };  const KW_NAMES = { auto: 'Auto', few: 'Few', some: 'Some', many: 'Many', most: 'Most' }; // Auto follows the Challenge Level
  const kwOf = (kw, lv) => KW[3][kw] ? kw : lv <= 3 ? 'few' : lv <= 6 ? 'some' : lv <= 8 ? 'many' : 'most';
  // v11c (JM CD-97: 1.1.1): Bonus Words Quantity: how many words a Ring leaves outside the Key grid
  const BW_NAMES = { none: 'None', fewest: 'Fewest', some: 'Some', many: 'Many', any: '- Any -' }; // v12a (CD-113: 3.1): None = bonus words switched off // v11d (CD-100: 2.3.1): Plenty is now Many
  // a seed: 'PLATE3.21.2' = PLATE, tier 3, 21 other real words its letters spell, 2 other full-length everyday words (K03)
  const seedsOf = n => String((D.seeds || {})[n] || '').split(' ').filter(Boolean).map(s => {
    const m = /^([A-Z]+)(\d)(?:\.(\d+))?(?:\.(\d+))?$/.exec(s);
    return m ? { w: m[1], t: +m[2], e: m[3] != null ? +m[3] : -1, a: m[4] != null ? +m[4] : 0 } : { w: s.slice(0, -1), t: +s.slice(-1), e: -1, a: 0 };
  });
  const shuffled = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  // every pool word the seed's letters spell (any level; the seed itself not counted)
  function spelled(s, n) {
    const sc = counts(s.w), sm = maskOf(s.w), out = [];
    for (const e of POOL) if (e.w.length <= n && !(e.m & ~sm) && e.w !== s.w && fits(e.cc, sc)) out.push(e);
    return out;
  }
  // v11c (JM CD-97: 1.2.1.2): the Key words follow the Challenge Level. Vocabulary: only words up to the level's cap.
  // Length: Key words that use every letter on the Ring: levels 1–3 only the Ring's own word, 4–7 at most two, 8–10 three or
  // more when the letters allow; one letter shorter: at most 3 (levels 1–3) or 5 (4–7). Everyday words first (words with a
  // clue before words without); at levels 5–10 up to a third of the grid goes to the level's rarer words.
  function choose(all, n, lv, cap, hi) {
    const cands = all.filter(e => e.l <= cap && inSk(e.wsk, lv));
    const rank = e => e.l + (clueLess(e) ? 0.5 : 0) + Math.random() * 0.9;
    const byRank = a => a.map(e => ({ e, k: rank(e) })).sort((x, y) => x.k - y.k).map(x => x.e);
    const fullMax = n <= 3 ? 99 : lv <= 3 ? 0 : lv <= 7 ? 1 : 99; // v11f (CD-107 add. 3.1): a 3-letter Ring's Key words all use every letter
    const full = byRank(cands.filter(e => e.w.length === n)).slice(0, Math.min(fullMax, hi - 1));
    const nm1Max = n >= 5 ? (lv <= 3 ? 3 : lv <= 7 ? 5 : 99) : 99;
    const nm1 = new Set(byRank(cands.filter(e => e.w.length === n - 1)).slice(0, nm1Max));
    let rest = cands.filter(e => e.w.length < n && (e.w.length !== n - 1 || nm1.has(e)));
    const room = hi - 1 - full.length;
    const rare = lv >= 5 ? shuffled(rest.filter(e => e.l >= cap - 1)).slice(0, Math.ceil(room / 3)) : [];
    rest = byRank(rest.filter(e => !rare.includes(e)));
    return full.concat(rare, rest).slice(0, hi - 1);
  }
  function dealRing(n, lv, kwSet, bwSet) {
    lex();
    const cap = CAP[lv - 1] || 3, recent = new Set(store.get('cd.kr.recent', []));
    const [lo, hi] = KW[n][kwOf(kwSet, lv)];
    const bw = BW_NAMES[bwSet] ? bwSet : 'fewest';
    let pool = seedsOf(n).filter(s => s.t <= cap);
    if (!pool.length) pool = seedsOf(n);
    let fresh = pool.filter(s => !recent.has(s.w));
    if (!fresh.length) fresh = pool;
    // higher levels lean on seeds that need their level's words
    if (lv >= 4) { const hard = fresh.filter(s => s.t >= cap - 1); if (hard.length && Math.random() < 0.7) fresh = hard; }
    // levels 8–10: Rings whose letters spell three or more full-length words, when there are any
    if (lv >= 8) { const three = fresh.filter(s => s.a >= 2); if (three.length) fresh = three; else { const two = fresh.filter(s => s.a >= 1); if (two.length) fresh = two; } }
    // try up to 60 seeds and score how many words each leaves outside the Key grid (everyday ones count fully, rare ones a
    // quarter); Bonus Words Quantity says whether that should be as few as possible, some, plenty, or doesn't matter.
    // Then one of the best few is picked at random, so Rings stay varied.
    const tried = [];
    for (const s of shuffled(fresh).slice(0, 60)) {
      const se = LEXBY[s.w];
      if (se && !inSk(se.wsk, lv)) continue;
      const all = spelled(s, n);
      const pick = choose(all, n, lv, cap, hi);
      const keys = pick.length + 1;
      if (keys < Math.min(lo, MINK[n])) continue;
      const got = new Set(pick.map(e => e.w));
      const leftE = all.filter(e => e.l <= 3 && !got.has(e.w)).length;
      const leftR = Math.max(0, (s.e >= 0 ? s.e : all.length) - all.length) + all.filter(e => e.l > 3 && !got.has(e.w)).length;
      const bonus = leftE + 0.25 * leftR, share = bonus / (bonus + keys);
      let score = bw === 'fewest' || bw === 'none' ? share : bw === 'some' ? Math.abs(share - 0.4) : bw === 'many' ? -share : 0;
      score += Math.max(0, lo - keys) * 0.12; // fewer Key words than asked for
      if (lv >= 8) score += Math.max(0, 3 - 1 - pick.filter(e => e.w.length === n).length) * 0.15;
      tried.push({ s, pick, score });
    }
    if (!tried.length) return null;
    tried.sort((a, b) => a.score - b.score);
    const { s, pick } = tried[Math.floor(Math.random() * Math.min(bw === 'any' ? tried.length : 5, tried.length))];
    const words = [s.w, ...pick.map(e => e.w)].sort((a, b) => a.length - b.length || a.localeCompare(b));
    let letters;
    do { letters = shuffled([...s.w]); } while (n > 2 && letters.join('') === s.w);
    store.set('cd.kr.recent', [s.w, ...[...recent].filter(x => x !== s.w)].slice(0, 150));
    return { seed: s.w, words, clues: words.map(w => clueFor(w, lv)), letters };
  }
  const MINK = { 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 6 }; // the fewest Key words any Ring may have (the seed included)
  // ---------- the Ring in play ----------
  let R = null;
  const SAVE_KEY = 'cd.kr.save';
  // v11b (CD-90 add. 3): Key word colors, glass candy drops in our own palette: [light, deep, edge]; black letters
  const PAL = [
    ['#ff8a8a', '#f0545c', '#b9333b'], ['#ffc078', '#ff922b', '#c4620e'], ['#ffe36e', '#fcc419', '#c29200'], ['#8ce99a', '#40c057', '#2b8a3e'],
    ['#7ae6da', '#20c4b4', '#0f8a7e'], ['#a5c8ff', '#5c95f5', '#2f62c4'], ['#d0b8ff', '#9775fa', '#6741d9'], ['#ffa8cf', '#f06595', '#c2255c']
  ];
  // the counts kept with a Ring (v11b: paid = Ring coins paid so far, time / timeCoins = ⏱ +30s bought, ended = the Ring
  // has been settled once, statClr = counted as cleared, streak0 = the streak before it, histT = its Game History entry)
  const NUMS = ['hints', 'hintCoins', 'drops', 'dropCoins', 'bonusCoins', 'paid', 'ext', 'timeCoins', 'streak0', 'histT', 'speedCoins'];
  function newR(d) {
    const L = d.words.reduce((a, w) => a + w.length, 0);
    const r = {
      seed: d.seed, n: d.letters.length, lv: ks.lv, timer: +ks.timer, timer0: +ks.timer, timePay: !!ks.timePay, noBonus: ks.bw === 'none', no: st.played + 1,
      words: d.words, clues: d.clues, L, v: 100 / L,
      tiles: d.letters.map((ch, i) => ({ ch, k: i, ang: -90 + i * 360 / d.letters.length })),
      found: new Set(), byDrop: new Set(), drop: d.words.map(() => new Set()), hinted: new Set(), bonus: [],
      el: 0, sel: -1, over: false, started: false, ended: false, statClr: false, paused: false,
      pal: d.pal || shuffled([...Array(PAL.length).keys()]) // this Ring's color order (CD-90 add. 3)
    };
    NUMS.forEach(k => { r[k] = 0; });
    return r;
  }
  function save() {
    if (!R || R.over) { store.set(SAVE_KEY, null); return; }
    const s = {
      seed: R.seed, lv: R.lv, timer: R.timer, timer0: R.timer0, timePay: R.timePay, noBonus: R.noBonus, no: R.no, words: R.words, clues: R.clues,
      letters: R.tiles.slice().sort((a, b) => a.k - b.k).map(t => t.ch), pal: R.pal, ended: R.ended, statClr: R.statClr,
      found: [...R.found], byDrop: [...R.byDrop], drop: R.drop.map(s => [...s]), hinted: [...R.hinted], bonus: R.bonus,
      el: Math.round(R.el)
    };
    NUMS.forEach(k => { s[k] = R[k]; });
    store.set(SAVE_KEY, s);
  }
  function load() {
    const s = store.get(SAVE_KEY, null);
    if (!s || !Array.isArray(s.words) || !Array.isArray(s.letters)) return null;
    const keep = Object.assign({}, ks);
    ks.lv = s.lv; ks.timer = s.timer; ks.timePay = !!s.timePay;
    const r = newR({ seed: s.seed, words: s.words, clues: s.clues || s.words.map(() => ''), letters: s.letters, pal: Array.isArray(s.pal) && s.pal.length === PAL.length ? s.pal : null });
    Object.assign(ks, keep);
    r.no = s.no || r.no;
    r.timer0 = s.timer0 != null ? s.timer0 : s.timer;
    r.ended = !!s.ended; r.statClr = !!s.statClr; r.noBonus = !!s.noBonus;
    r.found = new Set(s.found || []); r.byDrop = new Set(s.byDrop || []); r.hinted = new Set(s.hinted || []);
    r.drop = (s.drop || []).map(a => new Set(a)); while (r.drop.length < r.words.length) r.drop.push(new Set());
    r.bonus = s.bonus || []; r.el = s.el || 0;
    NUMS.forEach(k => { r[k] = s[k] || 0; });
    r.started = true;
    return r;
  }
  R = load();
  const unfinished = () => !!(R && !R.over);
  const progressed = () => !!(R && !R.ended && (R.found.size || R.bonus.length || R.hints || R.drops || R.ext));
  const hintCost = i => Math.max(1, Math.round(R.v * R.words[i].length));
  const dropCost = () => Math.max(1, Math.round(R.v));
  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // ---------- screens ----------
  const screenOn = () => !$('#keyring').hidden;
  const playOn = () => screenOn() && !$('#krPlay').hidden;
  function setHead(sub) {
    $('#krSub').textContent = sub;
    document.title = `${NM.ring} · ${NM.suite} ${UI.APP_VER}`;
  }
  function showSetup() {
    UI.showScreen('keyring');
    $('#krSetup').hidden = false; $('#krPlay').hidden = true;
    setHead('Setup');
    paintSetup();
    $('#krSetup').scrollTop = 0;
  }
  function showPlay() {
    UI.showScreen('keyring');
    $('#krSetup').hidden = true; $('#krPlay').hidden = false;
    setHead(`Ring ${R.no} · ${R.n} letters`);
    buildRing();
    setKf(-1); paintPause();
    paintTag(); paintBtns(); tick(0);
    paintOver(); // v11a (CD-93)
    fit(); requestAnimationFrame(fit);
    if (!R.started) {
      R.started = true;
      msg(matchMedia('(pointer: coarse)').matches ? 'Swipe across the letters to spell a word' : 'Drag across the letters, or type a word', '', 4000);
    } else msg('');
  }
  function goLobby() {
    clearTrace();
    save();
    document.title = `${NM.suite} · ${UI.APP_VER}`;
    UI.goHome();
  }

  // ---------- Setup ----------
  function paintSetup() {
    for (const b of document.querySelectorAll('#krNSeg button')) { const on = +b.dataset.n === ks.n; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); }
    $('#krPrev').innerHTML = [...N_DEMO[ks.n]].sort().map(c => `<span>${c}</span>`).join('');
    $('#krNDesc').textContent = N_DESC[ks.n];
    $('#krLv').value = String(ks.lv);
    $('#krTm').value = String(ks.timer);
    // v11b: Key words (the counts depend on the letters), colors, layout, and the time's-up pay switch
    $('#krKw').innerHTML = ['auto', 'few', 'some', 'many', 'most'].map(k => {
      const r = KW[ks.n][kwOf(k, ks.lv)];
      return `<option value="${k}">${KW_NAMES[k]}: ${r[0] === r[1] ? r[0] : r[0] + '–' + r[1]}</option>`;
    }).join('');
    $('#krKw').value = ks.kw;
    $('#krBw').value = BW_NAMES[ks.bw] ? ks.bw : 'fewest';
    const seg = (id, v) => { for (const b of document.querySelectorAll(`#${id} button`)) { const on = b.dataset.v === String(v); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); } };
    seg('krCol', ks.colors); seg('krLay', ks.layout); seg('krTp', ks.timePay ? 'on' : 'off'); $('#krBs').value = ks.bs;
    paintBs();
    $('#krOptsSum').textContent = `Time's up pays: ${ks.timePay ? 'On' : 'Off'} · Colors: by ${ks.colors === 'letter' ? 'letter' : 'word'} · Layout: ${ks.layout === 'stack' ? 'Stacked' : ks.layout === 'side' ? 'Side by side' : 'Auto'} · Ring buttons: ${{ a: 'Sapphire', b: 'Steel', c: 'Navy & gold' }[ks.bs] || 'Steel'}`;
    const unf = unfinished();
    $('#krSetUnf').hidden = !unf;
    if (unf) $('#krSetUnfTxt').textContent = unfText();
    $('#krStart').textContent = unf ? '🆕 New Ring' : `▶ Start ${NM.ring}`;
    $('#krStart').classList.toggle('primary', !unf);
    const pct = st.played ? Math.round(100 * st.cleared / st.played) + '%' : '–';
    $('#krStats').innerHTML = st.played
      ? [[st.played, 'Rings'], [pct, 'Cleared'], [st.streak, 'Streak'], [st.best, 'Best streak'], [st.bonus, 'Bonus words']].map(([v, l]) => `<div class="vt-st"><b>${v}</b><span>${l}</span></div>`).join('')
      : '<p class="vt-none">No Rings played yet. Pick your settings and start.</p>';
  }
  const unfText = () => `Unfinished Ring · ${R.found.size} of ${R.words.length} words`;
  $('#krLv').innerHTML = Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">${LV_NAMES[i + 1] || i + 1}</option>`).join('');
  $('#krTm').innerHTML = TIMERS.map(([v, l]) => `<option value="${v}">${l}</option>`).join('');
  $('#krNSeg').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; ks.n = +b.dataset.n; saveKs(); paintSetup(); UI.lobby(); });
  $('#krLv').addEventListener('change', e => { ks.lv = +e.target.value; saveKs(); paintSetup(); UI.lobby(); });
  $('#krTm').addEventListener('change', e => { ks.timer = +e.target.value; saveKs(); UI.lobby(); });
  $('#krKw').addEventListener('change', e => { ks.kw = e.target.value; saveKs(); });
  $('#krBw').addEventListener('change', e => { ks.bw = e.target.value; saveKs(); });
  const segPick = (id, f) => $(id).addEventListener('click', e => { const b = e.target.closest('button[data-v]'); if (!b) return; f(b.dataset.v); saveKs(); paintSetup(); });
  segPick('#krCol', v => { ks.colors = v; });
  segPick('#krLay', v => { ks.layout = v; });
  segPick('#krTp', v => { ks.timePay = v === 'on'; });
  $('#krBs').addEventListener('change', e => { ks.bs = e.target.value; ks.bsPicked = true; saveKs(); paintBs(); paintSetup(); });
  // v11d (CD-98 add. 2.4; CD-100: 2.1.1): the coin-button redesign in three looks to try in play: A Sapphire, B Steel, C Navy & gold
  function paintBs() { if (UI.setLook) UI.setLook($('#keyring'), ks.bs); }
  paintBs();
  $('#krStart').addEventListener('click', () => newRing());
  $('#krSetResume').addEventListener('click', () => { if (unfinished()) showPlay(); });

  // a New Ring while one is unfinished asks first; with progress made, the old Ring counts as not cleared
  function newRing(confirmed) {
    // a Ring that already ended once and is in ⏱ extra time: settle it again quietly, then deal
    if (unfinished() && R.ended) { clearTrace(); endRing('quit'); confirmed = true; }
    if (unfinished() && progressed() && !confirmed) {
      openModal(`<h2>Start a new Ring?</h2><p>Your unfinished Ring (${R.found.size} of ${R.words.length} words) will count as not cleared, and your streak starts again.</p>
        <div class="row"><button class="btn" data-a="new">🆕 New Ring</button><button class="btn primary" data-a="keep">Keep playing</button></div>`, '', { close: false });
      $('#sheet').onclick = e => {
        const b = e.target.closest('[data-a]'); if (!b) return;
        closeModal();
        if (b.dataset.a === 'new') { endRing('quit'); newRing(true); } else showPlay();
      };
      return;
    }
    const d = dealRing(ks.n, ks.lv, ks.kw, ks.bw);
    if (!d) { toast('Could not build a Ring. Please try again.', 'bad'); return; }
    R = newR(d);
    save();
    showPlay();
  }

  // ---------- sizes and layout ----------
  let cs = 40, rs = 300, ts = 60, wide = false;
  function pack(C) {
    const rows = []; let row = [], used = 0;
    R.words.forEach((w, i) => {
      const need = used ? used + 0.8 + w.length : w.length;
      if (row.length && need > C) { rows.push(row); row = []; used = 0; }
      used = used ? used + 0.8 + w.length : w.length; row.push(i);
    });
    if (row.length) rows.push(row);
    return rows;
  }
  const maxLen = () => R.words.reduce((m, w) => Math.max(m, w.length), 0);
  // how tall the slot panel must be for squares of at least `c` pixels, at a panel width W
  function slotNeed(W, c) {
    const C = Math.max(maxLen(), Math.floor(((W - 24) / c - 0.6) / 1.1));
    const r = pack(C).length; return r * (c * 1.22 + 6) + (r - 1) * c * 0.22 + (W >= 676 ? 62 : 50); // v11f: rows as drawn + the box's padding (switch row)
  }
  function fit() {
    if (!R || !playOn()) return;
    const main = $('#krMain');
    const W0 = main.clientWidth, H0 = main.clientHeight;
    if (!W0 || !H0) return;
    const coarse = matchMedia('(pointer: coarse)').matches;
    const big = W0 >= 700 && H0 >= 560; // tablets and computers: bigger message pills
    const sideOk = W0 >= 640 && H0 >= 400; // side by side is possible (the layout pill shows)
    $('#krLayP').hidden = !sideOk; // before the info row is measured
    paintColP(); // v11d (CD-100: 3.4.1b): the colors switch sits in the Key grid's top-right corner on every screen
    const infoH = $('#krInfo').offsetHeight || 34, msgH = big ? 56 : 44, gap = 6; // v12a (CD-111: 2.4.3.2): a slimmer message row
    main.style.setProperty('--mh', msgH + 'px');
    // v11a (CD-93): once the Ring is over, the win report takes the tip's row (so the Ring leaves room for it)
    const ob = $('#krOver'), tipH = !ob.hidden ? ob.offsetHeight : coarse ? 0 : 22, tipRow = !ob.hidden || !coarse;
    // v11b (CD-90: 4.1.5; CD-95: 6.2b, 6.2.1): stacked (the Key grid above the Ring) or side by side. Auto picks the one that
    // gives the bigger Ring (side by side only wins on wide, short screens); Setup or the layout pill can force either.
    const Ws = W0 - 24, Hs = H0 - 16 - infoH - msgH - tipH - gap * (tipRow ? 4 : 3);
    // the Key grid's squares stay at least 28 px on phones (24 px on short phones, so the Ring keeps its room), 34 px on tablets
    // v11f: with 13+ Key words on a phone, the squares may go down to 22 px so the Ring keeps a playable size
    // v12a (CD-111: 2.4.1; CD-113: 4.1): the Ring's size depends on the screen only, never on the number of Key words; the
    // Key grid keeps at least a third of the height and its words fit into whatever the Ring leaves
    const rsStack = Math.min(Ws - 4, 640, Hs - Math.max(150, Math.round(Hs * 0.33)));
    const colW = (W0 - 44 - 26) / 2.1; // side by side: the Ring's column (1 of 2.1 shares)
    const rsSide = sideOk ? Math.min(colW, H0 - 24 - infoH - msgH - tipH - gap * 4, 640) : 0;
    const lay = ks.layout;
    wide = sideOk && (lay === 'side' || (lay !== 'stack' && rsSide > rsStack + 12));
    main.classList.toggle('wide', wide);
    $('#krLayP').innerHTML = `<span class="e">${wide ? '⇆' : '⇅'}</span> ${lay === 'auto' ? 'Auto' : lay === 'side' ? 'Side by side' : 'Stacked'}`;
    rs = Math.max(170, Math.floor(wide ? rsSide : rsStack));
    const n = R.tiles.length;
    const tsFull = Math.round(Math.min(rs * (n <= 4 ? 0.27 : n === 5 ? 0.25 : n === 6 ? 0.23 : n === 7 ? 0.21 : 0.19), 104));
    ts = n >= 7 ? Math.round(tsFull * (n === 7 ? 0.88 : 0.84)) : tsFull; // v12a (CD-111: 2.4.2.1): smaller tiles, the same letters
    main.style.setProperty('--tf', Math.round(tsFull * 0.56) + 'px');
    // the stage holds the Ring and its corner pieces; when there is room beside the Ring, the stage widens (CD-90: 4.1.6)
    const availW = wide ? colW : W0 - 24;
    const sw = Math.floor(Math.min(availW, rs + 2 * Math.round(Math.min(110, Math.max(0, rs * 0.11)))));
    main.style.setProperty('--rs', rs + 'px');
    main.style.setProperty('--sw', sw + 'px');
    main.style.setProperty('--ts', ts + 'px');
    paintCorners(sw);
    fitCornerText();    $('#krLine').setAttribute('viewBox', `0 0 ${Math.max(1, rs)} ${Math.max(1, rs)}`); // v12b: never a negative size while the screen is hidden
    placeTiles();
    renderSlots(); // reading the panel's size makes the browser lay it out first, so no frame wait is needed
  }
  // v11d (CD-98 add. 2.1–2.4; CD-100: 2.1.2–2.1.3): the four corner pieces (BONUS, ⏱ +30s, 💡 Hint, 🔑 Drop). Each fills a
  // corner of the stage; its inner edge is an arc that follows the Ring at a small gap, its two outer edges are the stage's.
  // Drawn as SVG paths (body, gloss, rim), so only the shape itself takes taps. The look comes from the Button style.
  function cornerPath(s, cx, cy, rho, rad, fx, fy) {
    const X = x => (fx ? s - x : x).toFixed(1), Y = y => (fy ? s - y : y).toFixed(1), P = (x, y) => `${X(x)} ${Y(y)}`;
    let d = `M ${P(0, rad)} Q ${P(0, 0)} ${P(rad, 0)}`;
    const yA = cx - s < rho ? cy - Math.sqrt(rho * rho - (cx - s) ** 2) : s + 1; // where the arc meets the box's inner side edge
    if (yA >= s) return d + ` L ${P(s, 0)} L ${P(s, s)} L ${P(0, s)} Z`; // the Ring doesn't reach this box: a plain square
    if (yA > 0) d += ` L ${P(s, 0)} L ${P(s, yA)}`;
    else d += ` L ${P(cx - Math.sqrt(rho * rho - cy * cy), 0)}`;
    const sweep = fx !== fy ? 1 : 0, A = `A ${rho.toFixed(1)} ${rho.toFixed(1)} 0 0 ${sweep}`;
    const xB = cy - s < rho ? cx - Math.sqrt(rho * rho - (cy - s) ** 2) : -1; // where it meets the box's inner bottom edge
    if (xB > 0) d += ` ${A} ${P(xB, s)} L ${P(0, s)}`;
    else d += ` ${A} ${P(0, cy - Math.sqrt(rho * rho - cx * cx))}`;
    return d + ' Z';
  }
  const CORNERS = [['#krTag', 0, 0], ['#krTime', 1, 0], ['#krHint', 0, 1], ['#krDrop', 1, 1]];
  function paintCorners(sw) {
    const cx = sw / 2, cy = rs / 2, rho = rs / 2 + Math.max(5, rs * 0.018);
    const q = Math.min(cx, cy) - rho / Math.SQRT2; // the corner square that lies wholly outside the Ring
    const s = Math.round(q + rs * 0.14), rad = Math.max(10, s * 0.14);
    $('#krMain').style.setProperty('--cps', s + 'px');
    geo = { cx, cy, rho };
    for (const [sel, fx, fy] of CORNERS) {
      const d = cornerPath(s, cx, cy, rho, rad, fx, fy);
      const svg = document.querySelector(sel + ' .kr-cps');
      svg.setAttribute('viewBox', `0 0 ${Math.max(1, s)} ${Math.max(1, s)}`);
      const depth = Math.max(3, Math.round(s * 0.045)); // v11e (CD-102: 1.1.3): a thick edge under each piece, so it reads as a real button
      svg.innerHTML = `<path class="e" d="${d}" transform="translate(0 ${depth})"/><path class="b" d="${d}"/><path class="g" d="${d}"/><path class="r" d="${d}"/>`;
    }
  }
  // v11f (CD-107: 3.1.1): each text row in a corner piece (name, price, BONUS count) must stay outside the curve that follows
  // the Ring; a row that crosses it (a long Hint price on iPad) shrinks a step at a time until it fits
  let geo = null;
  function fitCornerText() {
    if (!geo) return;
    const st = document.querySelector('#krRing').parentNode.getBoundingClientRect();
    for (const [sel] of CORNERS) {
      for (const el of document.querySelectorAll(sel + ' .kr-cpc > *')) {
        el.style.fontSize = '';
        for (let k = 0; k < 8; k++) {
          const r = el.getBoundingClientRect(); if (!r.width) break;
          const x0 = r.left - st.left, x1 = r.right - st.left, y0 = r.top - st.top, y1 = r.bottom - st.top;
          const nx = Math.max(x0, Math.min(geo.cx, x1)), ny = Math.max(y0, Math.min(geo.cy, y1)); // the row's point nearest the Ring
          if (Math.hypot(nx - geo.cx, ny - geo.cy) >= geo.rho + 2) break;
          el.style.fontSize = (parseFloat(getComputedStyle(el).fontSize) * 0.9).toFixed(1) + 'px';
        }
      }
    }
  }
  window.addEventListener('resize', () => { if (playOn()) fit(); });
  if (window.ResizeObserver) new ResizeObserver(() => { if (playOn()) fit(); }).observe($('#krMain'));

  // ---------- slots ----------
  function renderSlots(pops) {
    if (!R) return;
    const box = $('#krSlots'), bs = getComputedStyle(box), W = box.clientWidth - parseFloat(bs.paddingLeft) - parseFloat(bs.paddingRight) - 8;
    const H = box.clientHeight - parseFloat(bs.paddingTop) - parseFloat(bs.paddingBottom) - 4; // v11f (CD-107: 3.3.1): the box's real padding (the colors switch row)
    if (W <= 0 || H <= 0) return;
    const ml = maxLen();
    let best = null;
    // v11c: rows may hold as many letters as the width allows (as fit() plans), not just about two words' worth
    for (let C = ml; C <= Math.max(ml * 2 + 2, Math.floor((W / 20 - 0.6) / 1.1)); C += 0.5) {
      const rows = pack(C), size = Math.min(W / (C * 1.1 + 0.6), (H - 6 * rows.length) / (rows.length * 1.22 + (rows.length - 1) * 0.22), 62); // v11f: each row is cs + 6 px of padding, rows are 0.22 cs apart
      if (!best || size > best.size + 0.5) best = { rows, size };
    }
    cs = Math.max(16, Math.floor(best.size));
    box.style.setProperty('--cs', cs + 'px'); box.style.setProperty('--rg', Math.round(cs * 0.22) + 'px');
    const col = colorize(best.rows);
    box.innerHTML = best.rows.map(r => `<div class="kr-row">${r.map(i => {
      const w = R.words[i], f = R.found.has(i);
      const cells = [...w].map((c, p) => {
        const d = R.drop[i].has(p);
        const cls = f ? 'f' : d ? 'd' : '';
        const k = PAL[col[i][p]];
        const sty = [f && ks.colors !== 'none' ? `--c1:${k[0]};--c2:${k[1]};--ce:${k[2]}` : '', pops && pops[i] && pops[i].has(p) ? `animation-delay:${[...pops[i]].indexOf(p) * 55}ms` : ''].filter(Boolean).join(';');
        const pop = pops && pops[i] && pops[i].has(p) ? ' pop' : '';
        return `<span class="kr-c ${cls}${pop}"${sty ? ` style="${sty}"` : ''}>${f || d ? c : ''}</span>`;
      }).join('');
      const lbl = f ? `${w}, found` : `${w.length} letters${R.hinted.has(i) ? ', clue shown' : ''}`;
      return `<button type="button" class="kr-word${R.sel === i ? ' sel' : ''}${f ? ' done' : ''}" data-i="${i}" aria-label="${lbl}">${R.hinted.has(i) && !f ? '<span class="hm" aria-hidden="true">💡</span>' : ''}${cells}</button>`;
    }).join('')}</div>`).join('');
    $('#krProg').innerHTML = `<span class="e">🔑</span> ${R.found.size}/${R.words.length} Key words`;
  }
  // v11b (CD-90 add. 3; CD-95: 5.1c): each Key word's colors, from this Ring's palette order. By word: one color per word, never
  // the same as the word beside it or a word touching it in the row above. By letter: every tile differs from the tile beside it
  // and the tile above it. Worked out on the rows as drawn, so neighbors are real neighbors.
  function colorize(rows) {
    const out = R.words.map(w => new Array(w.length).fill(0));
    const byLetter = ks.colors === 'letter';
    let prev = []; // the row above: [{ x, c }] tile centers (in tile widths) and colors
    rows.forEach((row, ri) => {
      const width = row.reduce((a, i) => a + R.words[i].length * 1.1, 0) + (row.length - 1) * 0.7;
      let x = -width / 2;
      const cur = [];
      let leftC = -1;
      row.forEach((i, j) => {
        const w = R.words[i], x0 = x;
        const xs = [...w].map((c, p) => x0 + p * 1.1 + 0.5);
        const pickFrom = (avoid, salt) => {
          for (let k = 0; k < PAL.length; k++) { const c = R.pal[(salt + k) % PAL.length]; if (!avoid.has(c)) return c; }
          return R.pal[salt % PAL.length];
        };
        if (byLetter) {
          xs.forEach((cx, p) => {
            const avoid = new Set(prev.filter(t => Math.abs(t.x - cx) < 1.05).map(t => t.c));
            if (p > 0) avoid.add(out[i][p - 1]);
            const c = pickFrom(avoid, i * 3 + p * 5 + ri);
            out[i][p] = c; cur.push({ x: cx, c });
          });
        } else {
          const lo = xs[0] - 0.6, hi = xs[xs.length - 1] + 0.6;
          const avoid = new Set(prev.filter(t => t.x > lo && t.x < hi).map(t => t.c));
          if (j > 0) avoid.add(leftC);
          const c = pickFrom(avoid, i * 3 + ri);
          out[i].fill(c); xs.forEach(cx => cur.push({ x: cx, c }));
          leftC = c;
        }
        x += w.length * 1.1 + 0.7;
      });
      prev = cur;
    });
    return out;
  }
  $('#krSlots').addEventListener('click', e => {
    const b = e.target.closest('.kr-word'); if (!b || !R || R.over || R.paused) return;
    const i = +b.dataset.i;
    if (R.found.has(i)) { msg(R.clues[i] ? `${R.words[i]}: ${esc(R.clues[i])}` : R.words[i], 'clue', 3000); return; }
    R.sel = R.sel === i ? -1 : i;
    renderSlots(); paintBtns(); save();
    if (R.hinted.has(i)) msg(hintText(i), 'clue', 4500);
    else if (R.sel === i) msg(R.clues[i] ? `Slot picked (${R.words[i].length} letters): 💡 Hint 🪙${hintCost(i)} shows its clue` : `Slot picked (${R.words[i].length} letters): no clue for this word yet`, '', 2600);
    else msg('');
  });

  // ---------- the Ring ----------
  function buildRing() {
    for (const t of document.querySelectorAll('#krRing .kr-t')) t.remove();
    R.tiles.forEach((t, i) => {
      const el = document.createElement('div');
      el.className = 'kr-t'; el.textContent = t.ch; el.dataset.i = i;
      t.el = el; $('#krRing').appendChild(el);
    });
    trace = []; tapMode = false; drawLine();
  }
  const pos = t => { const a = t.ang * Math.PI / 180, r = rs * 0.38; return [rs / 2 + r * Math.cos(a), rs / 2 + r * Math.sin(a)]; };
  function placeTiles() { if (!R) return; R.tiles.forEach(t => { if (!t.el) return; const [x, y] = pos(t); t.el.style.left = x + 'px'; t.el.style.top = y + 'px'; }); }
  let spinning = 0;
  function shuffle() {
    if (!R || R.over || spinning) return;
    clearTrace(); msg('');
    const n = R.tiles.length; let order;
    do { order = shuffled([...Array(n).keys()]); } while (n > 1 && order.every((k, i) => k === R.tiles[i].k));
    const from = R.tiles.map(t => t.ang), to = R.tiles.map((t, i) => { const tgt = -90 + order[i] * 360 / n; const d = ((tgt - t.ang) % 360 + 360) % 360; return t.ang + d + 360; });
    R.tiles.forEach((t, i) => { t.k = order[i]; });
    snd('row');
    const t0 = performance.now(), dur = reduceMotion() ? 1 : 650;
    spinning = 1;
    (function step(now) {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      R.tiles.forEach((t, i) => { t.ang = from[i] + (to[i] - from[i]) * e; });
      placeTiles();
      if (p < 1) requestAnimationFrame(step);
      else { R.tiles.forEach(t => { t.ang = ((t.ang + 90) % 360 + 360) % 360 - 90; }); spinning = 0; save(); }
    })(t0);
  }
  $('#krHub').addEventListener('pointerdown', e => e.stopPropagation());
  $('#krHub').addEventListener('click', e => { e.stopPropagation(); shuffle(); });

  // tracing: swipe / drag across the tiles, tap them one by one, or type
  let trace = [], tapMode = false, dragging = false, ptr = null, keyed = false; // keyed: the letters came from a keyboard
  function hit(x, y) {
    let best = null, bd = 1e9;
    R.tiles.forEach((t, i) => { const [tx, ty] = pos(t), d = Math.hypot(tx - x, ty - y); if (d < bd) { bd = d; best = i; } });
    return bd < ts * 0.62 ? best : null;
  }
  const ring = $('#krRing');
  function local(e) { const r = ring.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
  function add(i) { trace.push(i); R.tiles[i].el.classList.add('on'); snd('key'); drawLine(); showWord(); }
  function pop() { const i = trace.pop(); if (i != null && R.tiles[i]) R.tiles[i].el.classList.remove('on'); drawLine(); showWord(); }
  function clearTrace() {
    trace.forEach(i => { if (R && R.tiles[i] && R.tiles[i].el) R.tiles[i].el.classList.remove('on'); });
    trace = []; tapMode = false; ptr = null; dragging = false; keyed = false; drawLine();
  }
  function drawLine() {
    const pl = document.querySelector('#krLine polyline'); if (!pl || !R) return;
    const pts = trace.map(i => pos(R.tiles[i]));
    if (dragging && ptr && trace.length) pts.push(ptr);
    pl.setAttribute('points', pts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' '));
  }
  function showWord() {
    if (!trace.length) { msg(''); return; }
    clearTimeout(msgT);
    const m = $('#krMsg'); m.className = 'kr-msg';
    m.innerHTML = trace.map(i => `<span class="wl">${R.tiles[i].ch}</span>`).join('') + (tapMode && !dragging ? `<span class="mt sm">${keyed ? 'Enter to submit' : 'tap the last letter again'}</span>` : '');
  }
  ring.addEventListener('pointerdown', e => {
    if (!R || R.over || spinning || R.paused) return;
    const [x, y] = local(e), i = hit(x, y);
    if (i == null) { if (trace.length) { clearTrace(); msg(''); } return; }
    e.preventDefault();
    try { ring.setPointerCapture(e.pointerId); } catch (err) { /* a synthetic pointer */ }
    if (tapMode && trace.length) {
      if (i === trace[trace.length - 1]) { submit(); return; }
      if (!trace.includes(i)) add(i);
    } else { clearTrace(); add(i); }
    keyed = false;
    dragging = true; ptr = [x, y];
  });
  ring.addEventListener('pointermove', e => {
    if (!dragging || !R) return;
    ptr = local(e);
    const i = hit(ptr[0], ptr[1]);
    if (i != null && i !== trace[trace.length - 1]) {
      if (trace.length > 1 && i === trace[trace.length - 2]) pop();
      else if (!trace.includes(i)) add(i);
    }
    drawLine();
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false; ptr = null;
    if (tapMode) { drawLine(); showWord(); return; }
    if (trace.length >= 2) submit();
    else { tapMode = true; drawLine(); showWord(); }
  }
  ring.addEventListener('pointerup', endDrag);
  ring.addEventListener('pointercancel', () => { clearTrace(); msg(''); });
  $('#krMsg').addEventListener('click', () => { if (tapMode && trace.length) submit(); });

  // keyboard: type the word. v11b (CD-90: 1.3.1.1; CD-95: 1.1): Tab / Shift+Tab move an outline around the Ring's buttons
  // (BONUS → 💡 Hint → 🔑 Drop → ⏱ +30s → back to BONUS); Enter presses the outlined button when no letters are typed.
  const CYC = ['#krTag', '#krHint', '#krDrop', '#krTime'];
  let kf = -1;
  function setKf(i) {
    document.querySelectorAll('#keyring .kr-kf').forEach(b => b.classList.remove('kr-kf'));
    kf = i;
    if (i >= 0) $(CYC[i]).classList.add('kr-kf');
  }
  document.addEventListener('pointerdown', () => { if (kf >= 0) setKf(-1); }, true);
  document.addEventListener('keydown', e => {
    if (!playOn() || !R || !$('#modal').hidden || e.ctrlKey || e.metaKey || e.altKey || /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName || '')) return;
    if (e.key === 'Tab') {
      e.preventDefault();
      if (R.paused) return;
      let nk = kf; for (let k = 0; k < CYC.length; k++) { nk = nk < 0 ? (e.shiftKey ? CYC.length - 1 : 0) : (nk + (e.shiftKey ? -1 : 1) + CYC.length) % CYC.length; if (!$(CYC[nk]).hidden) break; }
      setKf(nk);
      return;
    }
    if (/^[a-z]$/i.test(e.key)) {
      e.preventDefault();
      if (R.over || spinning || R.paused) return;
      const c = e.key.toUpperCase(), i = R.tiles.findIndex((t, j) => t.ch === c && !trace.includes(j));
      if (i < 0) { nudge(`No free ${c} on the Ring`); return; }
      tapMode = true; keyed = true; add(i);
    } else if (e.key === 'Enter') { e.preventDefault(); if (trace.length) submit(); else if (kf >= 0) $(CYC[kf]).click(); }
    else if (e.key === 'Backspace') { e.preventDefault(); pop(); if (!trace.length) tapMode = false; }
    else if (e.key === 'Escape') { clearTrace(); setKf(-1); msg(''); }
    else if (e.key === ' ') { e.preventDefault(); if (!R.paused) shuffle(); }
  });

  // ---------- messages ----------
  // v11b (CD-90: 4.1.8): big pills, as wide as the text needs but never wider than the Ring; colors by what happened:
  // key = a new Key word (bright green), dup = already found (bright orange), bad = not a word (bright red),
  // bon = a bonus word (purple, like the BONUS tag), clue = a clue (blue)
  let msgT = 0;
  function msg(t, kind, ms) {
    clearTimeout(msgT);
    const m = $('#krMsg'); m.className = 'kr-msg';
    m.innerHTML = t ? `<span class="mt ${kind || ''}">${t}</span>` : '';
    fitMsg();
    if (t && ms) msgT = setTimeout(() => { if (!trace.length) msg(''); }, ms);
  }
  function fitMsg() {
    const m = $('#krMsg'), t = m.querySelector('.mt:not(.sm)'); if (!t) return;
    const maxW = Math.max(120, Math.min(rs, m.clientWidth || rs));
    const mh = parseFloat(getComputedStyle($('#krMain')).getPropertyValue('--mh')) || 44;
    let f = Math.round(Math.min(34, mh * 0.56, Math.max(17, rs * 0.072)));
    t.style.maxWidth = maxW + 'px'; t.style.whiteSpace = 'nowrap'; t.style.fontSize = f + 'px';
    if (t.scrollWidth > maxW) { f = Math.max(15, Math.floor(f * maxW / t.scrollWidth)); t.style.fontSize = f + 'px'; }
    if (t.scrollWidth > maxW) t.style.whiteSpace = 'normal'; // a long clue: two lines
  }
  function nudge(t) { msg(t, 'bad', 1700); snd('bounce'); const m = $('#krMsg'); m.classList.remove('shake'); void m.offsetWidth; m.classList.add('shake'); }

  // ---------- submit a word ----------
  function submit() {
    const w = trace.map(i => R.tiles[i].ch).join('');
    clearTrace();
    if (!R || R.over || R.paused) return;
    if (w.length < 3) { msg('Words need 3 letters or more', '', 1500); return; }
    const i = R.words.indexOf(w);
    if (i >= 0) {
      if (R.found.has(i)) { msg(`${w}: Key word already found`, 'dup', 1800); snd('draw'); flashRow(i); return; }
      fill(i); return;
    }
    if (isWord(w) && R.noBonus) { msg(`${w}: not a Key word`, '', 1600); return; } // v12a: bonus words are off
    if (isWord(w)) {
      if (R.bonus.includes(w)) { msg(`${w}: bonus word already found`, 'dup', 1800); snd('draw'); return; }
      R.bonus.push(w); R.bonusCoins++; st.bonus++; saveSt();
      if (UI.coins) UI.coins.add(1, `${NM.ring} bonus word ${w}`);
      msg(`★ Bonus word ${w} · 🪙+1`, 'bon', 1800); paintTag(true); save(); return;
    }
    nudge(`${w} isn't in the word list`);
  }
  function fill(i) {
    R.found.add(i);
    const pops = { [i]: new Set([...R.words[i]].map((c, p) => p).filter(p => !R.drop[i].has(p))) };
    if (R.sel === i) R.sel = -1;
    renderSlots(pops); paintBtns();
    msg(`✓ Key word ${R.words[i]}`, 'key', 1400);
    snd('word');
    save();
    checkDone();
  }
  function flashRow(i) { const el = document.querySelector(`#krSlots .kr-word[data-i="${i}"]`); if (el) { el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); } }
  function paintTag(bump) {
    $('#krTag').hidden = !!(R && R.noBonus);
    $('#krTagN').textContent = R ? R.bonus.length : 0;
    if (bump && !reduceMotion()) {
      const t = $('#krTag'); t.classList.remove('bump'); void t.offsetWidth; t.classList.add('bump');
      const p = document.createElement('span'); p.className = 'kr-plus'; p.textContent = '+1'; t.parentNode.appendChild(p); setTimeout(() => p.remove(), 1000);
    }
  }
  $('#krTag').addEventListener('click', () => {
    if (!R || R.paused) return;
    openModal(`<h2 class="mk-title">★ Bonus words</h2><p class="help-note">Real words spelled from this Ring that are not Key words. Each new one pays 🪙1.</p>
      <div class="kr-chips">${R.bonus.length ? [...R.bonus].sort().map(w => `<span class="bon">${w}</span>`).join('') : '<span>None yet. Keep spelling!</span>'}</div>
      <p class="help-note">This Ring: ${R.bonus.length} found · 🪙+${R.bonusCoins}. All Rings: ${st.bonus}.</p>
      <div class="row"><button class="btn primary" data-a="ok">Close</button></div>`);
    $('#sheet').onclick = e => { if (e.target.closest('[data-a]')) closeModal(); };
  });

  // ---------- coin buttons: two taps to buy (as in the other games) ----------
  // the price line under each button: Hint's depends on the slot (the one you picked, or the range over the empty slots)
  // v11c: a Key word with no clue (an everyday word) gets its first letter instead
  // v11d (CD-100: 1.2a): a Key word with no clue yet is never a Hint target
  const hintText = i => R.clues[i] ? `💡 ${R.words[i].length} letters: ${esc(R.clues[i])}` : 'No clue for this word yet';
  function hintPool() { return R.words.map((w, i) => i).filter(i => !R.found.has(i) && !R.hinted.has(i) && R.clues[i]); }
  function paintBtns() {
    if (!R) return;
    const pool = hintPool();
    let hp = '–';
    if (R.sel >= 0 && !R.found.has(R.sel) && !R.clues[R.sel]) hp = '–';
    else if (R.sel >= 0 && pool.includes(R.sel)) hp = '' + hintCost(R.sel);
    else if (pool.length) { const c = pool.map(hintCost), lo = Math.min(...c), hi = Math.max(...c); hp = '' + (lo === hi ? lo : `${lo}–${hi}`); }
    $('#krHintCp').textContent = hp;
    $('#krHint').classList.toggle('long', hp.length > 3);
    fitCornerText();
    $('#krDropCp').textContent = dropCost();
    $('#krHint').title = `Hint: show a slot's clue (🪙${hp})`;
    $('#krDrop').title = `Key Drop: drop one letter into a slot (🪙${dropCost()})`;
    $('#krTimeCp').textContent = TIME_COST;
    $('#krTime').title = `+30s: 30 more seconds on the clock (🪙${TIME_COST}); after the Ring ends, 30 seconds more to hunt bonus words`;
  }
  function arm(btn, price) {
    if (!UI.armTap) return true;
    return UI.armTap(btn, price); // v11e: app.js puts the "Tap again / 🪙N" label in the piece (styled per corner in style.css)
  }
  $('#krHint').addEventListener('click', () => {
    if (!R || R.over || R.paused) return;
    const btn = $('#krHint');
    if (!btn.classList.contains('armed')) {
      const pool = hintPool();
      if (R.sel >= 0 && !R.found.has(R.sel) && !R.clues[R.sel]) { msg('No clue for this word yet', 'clue', 2600); return; }
      if (!pool.length) { msg('Every empty slot with a clue already shows it: tap a 💡 slot to read it again', '', 3000); return; }
      // the slot you picked, or a random empty one: chosen now, so the price you see is the price you pay
      R.hintArm = R.sel >= 0 && pool.includes(R.sel) ? R.sel : pool[Math.floor(Math.random() * pool.length)];
      const price = hintCost(R.hintArm);
      if (UI.coins && UI.coins.bal < price) { UI.coins.spend(price, `${NM.ring} Hint`); return; }
      R.sel = R.hintArm; renderSlots();
      arm(btn, price);
      msg(`💡 Hint for this ${R.words[R.hintArm].length}-letter slot: tap again to buy (🪙${price})`, '', 3000);
      return;
    }
    arm(btn, 0); // the second tap: disarm, then buy
    const i = R.hintArm;
    if (i == null || R.found.has(i) || R.hinted.has(i)) return;
    const price = hintCost(i);
    if (UI.coins && !UI.coins.spend(price, `${NM.ring} Hint (${R.words[i].length} letters)`)) return;
    R.hinted.add(i); R.hints++; R.hintCoins += price; R.sel = i; R.hintArm = null;
    renderSlots(); paintBtns(); save();
    msg(hintText(i), 'clue', 6000);
  });
  $('#krDrop').addEventListener('click', () => {
    if (!R || R.over || R.paused) return;
    const btn = $('#krDrop'), price = dropCost();
    if (!btn.classList.contains('armed')) {
      if (UI.coins && UI.coins.bal < price) { UI.coins.spend(price, `${NM.ring} Key Drop`); return; }
      arm(btn, price);
      return;
    }
    arm(btn, 0);
    // one letter: into the slot you picked, or a random empty square
    let open = [];
    const slots = R.sel >= 0 && !R.found.has(R.sel) ? [R.sel] : R.words.map((w, i) => i).filter(i => !R.found.has(i));
    slots.forEach(i => { [...R.words[i]].forEach((c, p) => { if (!R.drop[i].has(p)) open.push([i, p]); }); });
    if (!open.length) return;
    if (UI.coins && !UI.coins.spend(price, `${NM.ring} Key Drop`)) return;
    const [i, p] = open[Math.floor(Math.random() * open.length)];
    R.drop[i].add(p); R.drops++; R.dropCoins += price;
    let done = false;
    if (R.drop[i].size === R.words[i].length) { R.found.add(i); R.byDrop.add(i); done = true; if (R.sel === i) R.sel = -1; }
    renderSlots({ [i]: new Set([p]) }); paintBtns(); save();
    msg(`🔑 Key Drop: ${R.words[i][p]} dropped in${done ? ` · ${R.words[i]} filled` : ''}`, '', 2200);
    if (done) snd('word');
    checkDone();
  });

  // ---------- ⏱ +30s (CD-90: 4.1.4; CD-95: 6.5.1, 6.6) ----------
  // Always shown. In a timed Ring it adds 30 seconds. Once any Ring has ended (cleared or out of time, timed or untimed), it
  // opens the Ring again for 30 seconds more (plus any time left) to hunt bonus words, or to finish it: a Ring finished in
  // extra time counts as cleared. Two taps, 🪙10 each time.
  $('#krTime').addEventListener('click', () => {
    if (!R || R.paused) return;
    if (!R.over && !R.timer) { msg(`Untimed Ring: no clock to add to. Once the Ring ends, ⏱ +30s gives you 30 seconds more to hunt bonus words`, 'clue', 5000); return; }
    const btn = $('#krTime');
    if (!btn.classList.contains('armed')) {
      if (UI.coins && UI.coins.bal < TIME_COST) { UI.coins.spend(TIME_COST, `${NM.ring} +30s`); return; }
      arm(btn, TIME_COST);
      return;
    }
    arm(btn, 0);
    buyTime();
  });
  function buyTime() {
    if (UI.coins && !UI.coins.spend(TIME_COST, `${NM.ring} +30s`)) return false;
    R.ext++; R.timeCoins += TIME_COST;
    const sec = Math.floor(R.el / 1000);
    if (R.over) {
      // the Ring opens again: a countdown of 30 seconds, plus whatever was left on a timed clock
      R.timer = !R.timer || sec >= R.timer ? sec + TIME_ADD : R.timer + TIME_ADD;
      R.over = false;
      if (!$('#modal').hidden) closeModal();
      paintOver(); fit();
      msg(R.found.size === R.words.length ? '⏱ +30s: hunt for more bonus words' : '⏱ +30s: keep going', 'clue', 2600);
    } else {
      R.timer += TIME_ADD;
      msg('⏱ +30s on the clock', 'clue', 1600);
    }
    lastSec = -1; tick(0); paintBtns(); paintPause(); save();
    return true;
  }

  // ---------- ⏸ Pause (CD-90: 4.1.9; CD-95: 6.7–6.7.1): the button or the clock; the Ring and the Key grid blur ----------
  function setPause(on) {
    if (!R || (on && R.over)) return;
    R.paused = !!on;
    if (on) { clearTrace(); setKf(-1); document.querySelectorAll('#keyring .btn.armed').forEach(b => { if (UI.armTap) UI.armTap(b, 0); }); }
    paintPause();
    msg(''); // the ⏸ Paused panel says it all
  }
  function paintPause() {
    const p = !!(R && R.paused);
    $('#krMain').classList.toggle('paused', p);
    $('#krPz').hidden = !p;
    const b = $('#krPause');
    b.textContent = p ? '▶️' : '⏸️'; // v12a (CD-111 add. 1.3.2): app.js draws them as the blue pause / play square
    b.title = p ? 'Resume' : 'Pause: the clock stops and the letters are hidden';
    b.setAttribute('aria-label', b.title);
    b.disabled = !!(R && R.over);
  }
  $('#krPause').addEventListener('click', () => { if (R && !R.over) setPause(!R.paused); });
  $('#krClock').addEventListener('click', () => { if (R && !R.over) setPause(!R.paused); });
  $('#krPz').addEventListener('click', () => setPause(false));
  // v11c (JM CD-97: 2.8.1): a slider switch beside the layout pill: Key word colors by word or by letter, during play
  // v12a (CD-113: 3.2a): one small button cycles the Key word colors: Word -> Letter -> No colors
  const COL_NAMES = { word: 'Word', letter: 'Letter', none: 'No colors' };
  function paintColP() {
    const b = $('#krColP'), v = COL_NAMES[ks.colors] ? ks.colors : 'word';
    $('#krColT').textContent = COL_NAMES[v];
    b.dataset.v = v;
    b.title = `Key word colors: ${COL_NAMES[v]} (tap for ${COL_NAMES[{ word: 'letter', letter: 'none', none: 'word' }[v]]})`;
    b.setAttribute('aria-label', b.title);
  }
  $('#krColP').addEventListener('click', () => {
    ks.colors = { word: 'letter', letter: 'none', none: 'word' }[ks.colors] || 'letter'; saveKs(); paintColP(); renderSlots();
    msg(`Key word colors: ${COL_NAMES[ks.colors]}`, '', 1400);
  });
  // the layout pill (tablets and computers): Auto → Stacked → Side by side (CD-95: 6.2.1)
  $('#krLayP').addEventListener('click', () => {
    ks.layout = ks.layout === 'auto' ? 'stack' : ks.layout === 'stack' ? 'side' : 'auto'; saveKs();
    fit();
    msg(`Layout: ${ks.layout === 'auto' ? 'Auto (the bigger Ring)' : ks.layout === 'stack' ? 'Stacked' : 'Side by side'}`, '', 1600);
  });

  // ---------- clock ----------
  let lastT = performance.now(), lastSec = -1;
  function tick(dt) {
    if (!R) return;
    if (dt && playOn() && !R.over && !R.paused && $('#modal').hidden && !document.hidden) R.el += dt;
    const sec = Math.floor(R.el / 1000), rem = R.timer ? Math.max(0, R.timer - sec) : sec;
    $('#krClk').textContent = fmt(rem);
    $('#krClock').classList.toggle('low', !!R.timer && rem <= 10 && !R.over);
    if (R.timer && !R.over && rem !== lastSec && rem > 0 && rem <= 10 && dt) snd(rem <= 5 ? 'tock' : 'tick');
    setFlash(R.timer && !R.over && !R.paused ? rem : 0);
    lastSec = rem;
    if (R.timer && rem <= 0 && !R.over) timeUp();
  }
  // v11c (JM CD-97 add. 2): as in CrossKeys and LockWord, the last 10 seconds flash once a second: yellow for 10–6, red for 5–1
  let flashSec = 0;
  function setFlash(s) {
    if (s === flashSec) return;
    flashSec = s;
    const b = document.querySelector('#krRing .kr-plat'); if (!b) return;
    b.classList.remove('tf-y', 'tf-r', 'tf-a', 'tf-b');
    if (s >= 1 && s <= 10) b.classList.add(s > 5 ? 'tf-y' : 'tf-r', s % 2 ? 'tf-a' : 'tf-b');
  }
  setInterval(() => { const now = performance.now(); tick(now - lastT); lastT = now; }, 250);
  let saveT = 0;
  setInterval(() => { if (R && !R.over && playOn() && Date.now() - saveT > 4000) { saveT = Date.now(); save(); } }, 1000);
  document.addEventListener('visibilitychange', () => { if (document.hidden && R && !R.over) save(); });

  // ---------- the end of a Ring ----------
  function checkDone() { if (R.found.size === R.words.length && !R.over) { R.over = true; clearTrace(); setTimeout(() => endRing('clear'), 650); } }
  // A Ring is settled when it ends. With ⏱ +30s it can open and end again: each end pays only what is new (the Ring's coins
  // are paid once), counts the Ring once in your stats (as cleared if it is cleared in extra time: CD-95: 6.6) and updates
  // its one Game History entry.
  function endRing(how) {
    if (!R) return;
    const first = !R.ended, newlyCleared = R.found.size === R.words.length && !R.statClr;
    R.ended = true; R.over = true; R.paused = false;
    const cleared = R.found.size === R.words.length;
    // the letters the Player filled (Key Drop letters don't count)
    const mine = R.words.reduce((a, w, i) => a + (R.found.has(i) ? w.length - R.drop[i].size : 0), 0);
    const timePaid = !cleared && how === 'time' && R.timePay; // CD-95: 2.1 (the Setup switch)
    const due = cleared || timePaid ? Math.round(RING_PAY * mine / R.L) : 0; // v12a (CD-113: 1.1.1): a Ring pays 10 (its costs stay on the 100 scale)
    const pay = Math.max(0, due - R.paid);
    if (pay && UI.coins) UI.coins.add(pay, `${NM.ring}: ${cleared ? 'Ring cleared' : "time's up, your letters"}`);
    R.paid += pay;
    // v11c (JM CD-97 add. 3): a timed Ring cleared before its clock ran out pays 1 coin per second left on the ORIGINAL clock
    // (seconds bought with ⏱ +30s never pay); untimed Rings pay no speed coins
    if (newlyCleared && R.timer0) {
      const speed = Math.min(Math.round(SPEED_PER_MIN * R.timer0 / 60), Math.max(0, Math.floor(R.timer0 - R.el / 1000))); // v12a (CD-111: 1.4.1): capped at 10 per minute on the clock
      if (speed) { R.speedCoins += speed; if (UI.coins) UI.coins.add(speed, `${NM.ring}: speed (${speed} s left)`); }
    }
    if (first) { R.streak0 = st.streak; st.played++; }
    if (newlyCleared) {
      R.statClr = true; st.cleared++; st.streak = R.streak0 + 1; st.best = Math.max(st.best, st.streak);
      if (!R.timer0 && !R.ext && (!st.fastest[R.n] || R.el < st.fastest[R.n])) st.fastest[R.n] = Math.round(R.el);
    } else if (first && !cleared) st.streak = 0;
    saveSt();
    store.set(SAVE_KEY, null);
    const net = R.paid + R.speedCoins + R.bonusCoins - R.hintCoins - R.dropCoins - R.timeCoins;
    const sec = Math.floor(R.el / 1000);
    const [face, head] = cleared ? ['🔑', 'Ring cleared!'] : how === 'time' ? ['⏱', "Time's up"] : ['🏳️', 'Ring not cleared'];
    // CD-90: 4.2.1; CD-95: 7.1a: beside the heading, the time left (timed Rings) or the time taken (untimed)
    const tShow = R.timer0 || R.ext ? `${fmt(Math.max(0, R.timer - sec))}<small> left</small>` : fmt(sec);
    // CD-90: 4.2.2–4.2.3: Key words, Bonus words and Missed words, each in its own box, its count first
    const grp = (c, n, name, chips, note) => `<div class="kr-grp ${c}"><div class="kr-gh"><b>${n}</b> ${name}${n === 1 ? '' : 's'}<span class="kr-gnote">[ Note: darkened words = HINT used; numbers = DROPS used ]</span></div>
      <div class="kr-chips">${chips || '<span class="none">None</span>'}</div>${note ? `<p class="kr-gn">${note}</p>` : ''}</div>`;
    const abc = (a, b) => R.words[a].localeCompare(R.words[b]);
    const keyW = R.words.map((w, i) => i).filter(i => R.found.has(i)).sort(abc);
    const missW = R.words.map((w, i) => i).filter(i => !R.found.has(i)).sort(abc);
    const chip = i => `<span class="${R.hinted.has(i) ? 'hd' : ''}">${R.words[i]}${R.drop[i].size ? ` <i class="dn">${R.drop[i].size}</i>` : ''}</span>`;
    const groups = grp('kr-kw', keyW.length, 'Key word', keyW.map(chip).join(''))
      + (R.noBonus ? '' : grp('kr-bw', R.bonus.length, 'Bonus word', [...R.bonus].sort().map(w => `<span>${w}</span>`).join('')))
      + (missW.length ? grp('kr-mw', missW.length, 'Missed word', missW.map(chip).join('')) : '');
    const row = (l, v) => `<tr><td>${l}</td><td class="${v < 0 ? 'neg' : 'pos'}">${v < 0 ? '−' + UI.fmtN(-v) : '+' + UI.fmtN(v)}</td></tr>`;
    const per = Math.round(R.v * 100) / 100;
    const coinTbl = UI.coinHead() + `<table class="score-table coin-tbl kr-coins">`
      + (R.paid ? row(`🔑 ${mine} of ${R.L} Key Word letters played`, R.paid) : '')
      + (R.speedCoins ? row(`⏱ Speed: 1 coin per unused second (limit: ${Math.round(SPEED_PER_MIN * R.timer0 / 60)})`, R.speedCoins) : '')
      + (R.noBonus ? '' : row(`★ Bonus words: ${R.bonus.length} (1 coin / each)`, R.bonusCoins))
      + (R.hints ? row(`💡 Hint × ${R.hints}`, -R.hintCoins) : '')
      + (R.drops ? row(`🔑 Key Drop × ${R.drops}`, -R.dropCoins) : '')
      + (R.ext ? row(`⏱ +30s × ${R.ext}`, -R.timeCoins) : '')
      + UI.coinTotal("This ring's total earned coins:", net) + '</table>';
    const pct = st.played ? Math.round(100 * st.cleared / st.played) : 0;
    const stats = `<h3 class="res-h">📊 Your stats</h3><div class="vt-res-stats">
      <div><b>${UI.fmtN(st.played)}</b><span>Rings</span></div><div><b>${pct}%</b><span>Cleared</span></div><div><b>${st.streak}</b><span>Streak</span></div>
      <div><b>${st.best}</b><span>Best streak</span></div><div><b>${UI.fmtN(st.bonus)}</b><span>Bonus words</span></div><div><b>${st.fastest[R.n] ? fmt(Math.floor(st.fastest[R.n] / 1000)) : '–'}</b><span>Fastest ${R.n}-letter</span></div></div>`;
    const body = `<div class="res-top kr-rtop"><span class="res-face">${face}</span><span class="res-title">${head}</span><span class="kr-rtime">${tShow}</span></div>
      ${groups}
      ${!cleared ? '<p class="help-note kr-note">Your bonus coins are yours to keep. ⏱ +30s opens the Ring again.</p>' : ''}
      <div class="res-cols"><section>${coinTbl}</section><section>${stats}</section></div>`;
    if (UI.history) {
      const entry = {
        g: 'ring', win: cleared, title: `${NM.ring} · ${cleared ? 'Ring cleared' : how === 'time' ? "Time's up" : 'Not cleared'} (${R.seed.length} letters)`,
        sub: [`Level ${R.lv}`, `${R.n} letters`, timerName(R.timer0)].join(' · '), score: `${R.found.size}/${R.words.length} Key words`, coins: net, html: body
      };
      if (first || !R.histT || !UI.history.put) R.histT = UI.history.add(entry) || 0;
      else UI.history.put(R.histT, entry);
    }
    R.resHtml = body;
    // v11a (JM CD-93: 2.1 N): the same one-row win report as the other games, under the Ring
    const sc = `${R.found.size}/${R.words.length} Key words`;
    R.resWin = cleared ? Object.assign(UI.meWin(), { score: sc }) : { av: UI.gimg('ring', 'ob-gi'), who: 'The Ring', score: sc };
    setKf(-1); paintPause(); paintBtns();
    paintOver(); fit();
    UI.lobby();
    if (how === 'quit') return;
    snd(cleared ? 'win' : 'lose');
    if (newlyCleared && !night() && !reduceMotion()) confetti();
    openResult();
  }
  function timeUp() { clearTrace(); setFlash(0); endRing('time'); }
  function openResult() {
    if (!R || !R.resHtml) return;
    openModal(`${R.resHtml}<div class="row res-bar kr-resbar"><button class="btn" data-a="setup">⚙ Setup</button><button class="btn" data-a="menu">☰ Lobby</button>`
      + `<button class="btn coinbtn kr-more" data-a="more" title="30 seconds more on this Ring (🪙${TIME_COST})"><b>⏱</b> +30s 🪙${TIME_COST}</button>`
      + `<button class="btn primary" data-a="next">🆕 New Game</button></div>`, 'res', { close: () => { if (playOn()) msg('Ring over: 📊 Results reopens the result', '', 5000); } });
    $('#sheet').onclick = e => {
      const b = e.target.closest('[data-a]'); if (!b) return;
      if (b.dataset.a === 'more') {
        // two taps, like every coin button; the second buys and opens the Ring again
        if (!b.classList.contains('armed') && UI.coins && UI.coins.bal < TIME_COST) { UI.coins.spend(TIME_COST, `${NM.ring} +30s`); return; }
        if (!arm(b, TIME_COST)) return;
        closeModal(); buyTime();
        return;
      }
      closeModal();
      if (b.dataset.a === 'next') newRing(true);
      else if (b.dataset.a === 'setup') showSetup();
      else goLobby();
    };
  }
  $('#krProg').addEventListener('click', () => { if (R && R.over) openResult(); });
  function paintOver() {
    const bar = $('#krOver'), over = !!(R && R.over && R.resWin);
    $('#krMain').classList.toggle('is-over', over);
    bar.hidden = !over;
    bar.innerHTML = over ? `${UI.winLine(R.resWin)}<span class="ob-btns"><button class="btn" type="button" data-ob="res">📊 Results</button><button class="btn" type="button" data-ob="menu">☰ Lobby</button><button class="btn primary" type="button" data-ob="next">🆕 New Game</button></span>` : '';
    if (over) UI.fitOver(bar);
  }
  $('#krOver').addEventListener('click', e => {
    const b = e.target.closest('[data-ob]'); if (!b) return;
    if (b.dataset.ob === 'res') openResult(); else if (b.dataset.ob === 'next') newRing(true); else goLobby();
  });
  function confetti() {
    const c = document.createElement('div'); c.className = 'kr-confetti';
    c.innerHTML = Array.from({ length: 40 }, (_, k) => `<i style="left:${Math.random() * 100}%;background:${['#f5b300', '#2c6bd8', '#1e9e4a', '#e0457b', '#4fc3f7'][k % 5]};animation-delay:${(Math.random() * 0.5).toFixed(2)}s"></i>`).join('');
    document.body.appendChild(c); setTimeout(() => c.remove(), 2600);
  }

  // ---------- How To Play ----------
  function help() {
    const sec = UI.helpSec;
    openModal(`<h2 class="mk-title">How To Play ${NM.ring} <span class="chip">${UI.APP_VER}</span></h2>
      <p>Spell words from the letters on the Ring to fill the <b>Key grid</b> with its <b>Key words</b>. A Ring is cleared when every Key word is found.</p>
      <p class="help-note">Tap a heading to open it.</p>
      ${sec('The Basics', `
        <li>Open ${NM.ring} from its card in the ${NM.suite} Lobby: <b>🆕 New Game</b> deals a Ring at once with your last settings, <b>⚙ Setup</b> (or a tap on the card) shows the settings first, and <b>▶ Resume</b> appears while a Ring is unfinished. In the game, <b>🆕</b> in the header deals a new Ring, <b>⚙</b> opens Setup (your Ring waits) and <b>☰</b> goes back to the Lobby; an unfinished Ring waits, with its clock stopped.</li>
        <li>The <b>Key grid</b> holds one slot for each Key word; its squares show how long the word is. Shortest words come first. Found Key words light up in candy colors.</li>
        <li>Each letter on the Ring can be used <b>once per word</b>, but in as many words as you like.</li>`)}
      ${sec('Spell a Word', `
        <li><b>Swipe</b> (touch) or <b>drag</b> (mouse) across the letters, then let go. Slide back one letter to undo it.</li>
        <li>Or <b>tap</b> the letters one by one, then tap the last one again (or tap the letters above the Ring).</li>
        <li>Or <b>type</b> it on a keyboard and press <b>Enter</b>: <b>⌫</b> takes a letter back, <b>Esc</b> clears, <b>Space</b> shuffles, and <b>Tab</b> moves an outline around the Ring's buttons (BONUS, 💡 Hint, 🔑 Drop, ⏱ +30s, then round again; <b>Shift+Tab</b> goes back); <b>Enter</b> presses the outlined button when no letters are typed.</li>
        <li>The pill above the Ring shows the word you're spelling, then what happened: <b>bright green</b> = a new Key word, <b>purple</b> = a bonus word, <b>bright orange</b> = already found, <b>bright red</b> = not a word, <b>blue</b> = a clue.</li>`)}
      ${sec('Bonus Words', `
        <li>Any other real word you spell from the Ring (at least 3 letters) is a <b>bonus word</b>. Each new one pays <b>🪙1</b>, with no limit. The purple <b>BONUS</b> piece in the Ring's top-left corner counts them and pulses when you find one; tap it to see the list.</li>
        <li>The Key grid takes in the everyday words a Ring spells (from the Lexicon and a list of common English words), so bonus words are mostly the rarer ones. <b>Bonus Words Quantity</b> in Setup sets how many a Ring leaves: <b>Fewest</b>, <b>Some</b>, <b>Many</b> (for bonus hunters) or <b>- Any -</b>.</li>`)}
      ${sec('The Buttons', `
        <li><b>Shuffle</b> is the steel hub in the middle of the Ring: the letters spin to new places. Free.</li>
        <li><b>💡 Hint</b> (bottom-left corner) shows the clue for one empty slot: the slot you picked (tap a slot; it glows blue), or else a random one, which lights up when you tap Hint. It's a signal, not a solve: no letters are given (a word like JUMPING shows the clue for JUMP, with the ending to add; an everyday word with no clue yet is never a Hint target). The slot keeps a 💡 mark; tap it to read the clue again, free.</li>
        <li><b>🔑 Key Drop</b> (bottom-right corner) drops <b>one letter</b> into an empty square: in the slot you picked, or anywhere. Dropped letters are light blue. A slot it completes counts as found.</li>
        <li><b>⏱ +30s</b> (top-right corner, 🪙${TIME_COST}) adds 30 seconds to a timed Ring. Once any Ring ends (cleared or out of time, timed or not), it opens the Ring again for 30 seconds more, to hunt bonus words or to finish it; a Ring finished in extra time counts as cleared. It's in the result window too.</li>
        <li><b>⏸ Pause</b> (beside the clock, or tap the clock) stops the clock and hides the Ring and the Key grid; tap <b>▶</b> or the clock to go on.</li>
        <li>In the last 10 seconds of a timed Ring, the Ring flashes every second: <b>yellow</b> from 10 to 6, <b>red</b> from 5 to 1, with a tick each second.</li>
        <li>The coin buttons sit in the Ring's corners, shaped to follow it. They take <b>two taps</b>: the first darkens the button and shows its price, the second buys. <b>Ring Button Colors</b> (⚙ Setup › More options) picks their look: Steel (the default), Sapphire or Navy &amp; gold.</li>`)}
      ${sec('Coins', `
        <li>Help is priced by the Ring's size: one letter's worth is 100 ÷ the Ring's letters (with 50 letters, 🪙2).</li>
        <li><b>💡 Hint</b> costs one letter's worth for each letter in its slot (a 5-letter slot at 🪙2 a letter = 🪙10). <b>🔑 Key Drop</b> costs one letter's worth. <b>⏱ +30s</b> costs 🪙${TIME_COST}.</li>
        <li><b>Ring cleared:</b> up to <b>🪙10</b>, shared over the Key Word letters you played yourself (Key Drop letters don't pay). Hints don't lower it (they cost coins already).</li>
        <li><b>Speed:</b> a timed Ring cleared before the clock runs out pays <b>🪙1 for every second left</b> on its own clock, up to <b>🪙10 per minute</b> on that clock (1 min: 10; 2 min: 20; 3 min: 30; 5 min: 50). Seconds bought with ⏱ +30s don't pay; untimed Rings pay no speed coins.</li>
        <li><b>Bonus words:</b> 🪙1 each. When time runs out, you keep your bonus coins; the Ring itself pays nothing, unless <b>Time's up pays for your letters</b> is on in Setup (then one letter's worth for each letter you filled).</li>
        <li>The result window shows your balance beside <b>Coins</b>, and the Ring's total at the bottom. Coins are shared by every ${NM.suite} game; tap your balance for the details.</li>`)}
      ${sec('Setup', `
        <li><b>Letters on the Ring</b>: 3 to 8. More letters give more and longer Key words.</li>
        <li><b>Challenge Level</b> (1–10) picks the Key words: everyday words at 1–3, rarer ones as it rises. From level 6 the clues turn figurative. Bonus words can be any real word at every level.</li>
        <li><b>Key Words Quantity</b>: how many words the Key grid holds: <b>Few</b>, <b>Some</b>, <b>Many</b> or <b>Most</b> (the counts depend on the letters: with 7 letters, Few 6–8, Some 9–11, Many 12–14, Most 15–18), or <b>Auto</b>, which follows the Challenge Level (1–3 Few, 4–6 Some, 7–8 Many, 9–10 Most). <b>Bonus Words Quantity</b>: how many other real words the Ring spells: None (bonus words switched off: other words don't count, and the BONUS piece hides), Fewest, Some, Many or - Any -.</li>
        <li>The Challenge Level also sets how long the Key words run: at levels 1–3 only the Ring's own word uses every letter, at 4–7 at most two words do, and at 8–10 three or more do when the letters allow. Higher levels also bring rarer words.</li>
        <li><b>Timer</b>: Untimed (the clock counts up), or 1, 2, 3 or 5 minutes per Ring (it counts down, and turns red in the last 10 seconds). <b>Time's up pays for your letters</b>: Off (as standard) or On.</li>
        <li><b>Key word colors</b>: <b>By word</b> (each word one color), <b>By letter</b> (every tile its own color) or <b>No colors</b>. No two neighbors match. The small button in the Key grid's top-right corner cycles them during play.</li>
        <li><b>Layout</b>: <b>Auto</b> picks whichever gives the bigger Ring, <b>Stacked</b> puts the Key grid above the Ring, <b>Side by side</b> puts them next to each other (tablets and computers). On those screens the layout pill beside the clock switches it during play, and the <b>Word / Letter</b> switch in the Key grid's top-right corner (every screen) changes the Key word colors.</li>
        <li>Time's up pays, Key word colors and Layout sit under <b>▸ More options</b>.</li>
        <li>Every Ring is new: the app deals a fresh set of letters each time and avoids the Rings you played recently.</li>`)}
      ${sec('Your Stats', `
        <li>Rings played, the share cleared, your streak (Rings cleared in a row), your best streak, bonus words and your fastest untimed Ring for each size (without extra time) are kept on this device. Every Ring also goes into <b>📜 Game History</b> in the Lobby.</li>
        <li>Starting a new Ring after you've found a word (or used a coin button) in an unfinished one counts that Ring as not cleared.</li>`)}
      ${sec('Sound', `
        <li>Sound effects are <b>off</b> until you tap the speaker in the header (red with a ✕ while muted). You'll hear a click for each letter, a chime for each Key word, a thunk for a word that isn't in the list, a clink for coins, ticks in the last 10 seconds, and a fanfare when the Ring is cleared.</li>`)}
      <div class="row"><button class="btn primary" data-a="ok">Close</button></div>`);
    $('#sheet').onclick = e => { if (UI.helpClick(e)) return; if (e.target.closest('[data-a]')) closeModal(); };
  }

  // ---------- wiring ----------
  { const cp = document.querySelector('[data-kr-coins]'); if (cp && UI.coinPill) cp.outerHTML = UI.coinPill(); } // the shared coin balance (tap for details)
  $('#krMenu').addEventListener('click', goLobby);
  $('#krHelp').addEventListener('click', help);
  $('#krSet').addEventListener('click', () => { clearTrace(); save(); showSetup(); });
  $('#krNewG').addEventListener('click', () => { clearTrace(); newRing(!!(R && R.over)); }); // v11b (CD-90 add. 1; CD-95: 3.1)
  // the Lobby card: tap the name for Setup; the chevron (app.js) shows the details
  const goOpen = () => { if (unfinished()) showPlay(); else showSetup(); };
  $('#krCard').addEventListener('click', e => { if (!e.target.closest('button')) showSetup(); });
  $('#krResumeBtn').addEventListener('click', () => { if (unfinished()) showPlay(); });
  $('#krNewBtn').addEventListener('click', () => newRing());
  $('#krSetupBtn').addEventListener('click', showSetup);
  window.KeyRing = {
    open: goOpen,
    setup: showSetup,
    newGame: () => newRing(),
    help: () => help(),
    lobby: () => ({
      played: st.played, pct: st.played ? Math.round(100 * st.cleared / st.played) : 0, bonus: st.bonus, streak: st.streak,
      unf: unfinished() ? unfText() : '', last: lastLine()
    }),
    _R: () => R, // for checks only
    _deal: (n, lv, kw, bw) => dealRing(n, lv, kw, bw) // for checks only (it does mark the seed as recently played)
  };
  if (UI.lobby) UI.lobby(); // the Lobby was drawn before this file loaded: fill in the KeyRing card
})();
