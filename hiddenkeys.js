/* Master Keys — Hidden Keys (G3, v13; JM CD-130: 1.1.1): the clue word search.
   Words from our own Lexicon are hidden in a grid of letters, in straight lines. The Key list shows each word's CLUE and
   its length (Clues, the standard) or the words themselves (Words, the classic list). Drag (or tap the first and the last
   letter) across a word to claim it. One extra word, the 🗝 Master Key, is hidden too: it is never on the list, only its
   gold clue, and it scores ×3, but only until the last list word is claimed.
   - Duel (the main game): a named Bot rival per Challenge Level hunts the same grid at the same time. Each word goes to
     whoever finds it first (blue band = yours, red band = the Bot's). A match is 1–5 rounds (3 standard), each on a fresh
     grid, won on total points; the next round starts on a tap (or Enter twice); an unfinished match is saved and resumes.
   - Solo: no Bot, Untimed by default, 🏁 Done ends the round; best = your fastest clear for each grid size and Key list.
   - Challenge Level 1–10 (default 3): the Bot's pace, and how hard the words and clues are (both modes).
   - Timer 1, 2, 3 (default), 5 or 8 min; Untimed in Solo. The last 10 seconds flash yellow then red with ticks.
   - Scoring: 1 point per letter; the Master Key ×3. Speed coins when you win a round (or clear a timed Solo round with Paid
     Hints) before the clock runs out: 1 per second left, never more than 10 per minute of the clock.
   - 💡 Hint (🪙1 per letter, at most 3 per round in a Duel): stripes the FIRST letter of a word (the clue you picked, else
     one of the Bot's choosing): a signal, not a solve (CD-85). While that word is unfound, 💡 Next stripes its next letter (🪙1).
   - Coins: a round win 🪙10, a draw 🪙5, a match win 🪙20 more (as KeyCubes).
   - Typing (computers): in Clues mode, type the answer and press Enter (the app finds it in the grid); in Words mode the
     list already shows the words, so you drag (typing would skip the hunt).
   Built from the suite's own parts (KeyCubes' bar, score cards, Paused panel, results; CDUI rivals, coins, history, help).
   v13c (JM CD-136): a warning to agree to before Clues switch to Words (half points in a Duel); Solo speed (wpm / lps) live and
   in the results, Untimed speed bests, Timed best score per grid size + timer; History entries carry pts / res.
   v13b (JM CD-134): Auto word count / longest word follow the grid size AND the Challenge Level; a 📖 Clues / 🔤 Words toggle
   in the Key list heading during play.
   v13a (JM CD-132): Word count (min / max list words) and Word length (min / max letters) in More options, Auto by grid size;
   a too-short / too-long word gets a reminder of the lengths; How To Play explains both.
   Saved on this device: settings 'cd.hk.settings', stats 'cd.hk.stats', an unfinished match 'cd.hk.save'. */
'use strict';
(function () {
  const UI = window.CDUI, E = window.Engine, K = window.KR_DATA || {};
  if (!UI || !E || !document.getElementById('hiddenkeys')) return;
  const { $, esc, store, openModal, closeModal } = UI;
  const NM = Object.assign({ suite: 'Master Keys', hidden: 'Hidden Keys' }, window.MK_NAMES || {});
  const snd = n => { if (UI.sound) UI.sound.play(n); };
  const $$ = s => [...document.querySelectorAll(s)];
  const SEC = $('#hiddenkeys'), tray = $('#hkTray');
  const night = () => document.documentElement.dataset.screen === 'night';
  const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- settings and stats ----------
  const DEF = { mode: 'duel', n: 10, timer: 180, sTimer: 0, lv: 3, list: 'clue', dir: 'std', rounds: 3, bs: 'b', gs: 'cream', sHint: 'free', sCap: '3', qMin: 'auto', qMax: 'auto', lMin: 3, lMax: 'auto' };
  const hs = Object.assign({}, DEF, store.get('cd.hk.settings', {}));
  const saveHs = () => store.set('cd.hk.settings', hs);
  const blankSt = () => ({ matches: 0, won: 0, drawn: 0, rounds: 0, words: 0, keys: 0, soloN: 0, sb: {} });
  const st = Object.assign(blankSt(), store.get('cd.hk.stats', {}));
  const saveSt = () => store.set('cd.hk.stats', st);
  const SAVE_KEY = 'cd.hk.save';
  const TIMERS = [[60, '1 min'], [120, '2 min'], [180, '3 min'], [300, '5 min'], [480, '8 min'], [0, 'Untimed']];
  const timerName = t => (TIMERS.find(x => x[0] === +t) || TIMERS[2])[1];
  // v13a (JM CD-132 add. 1–2): Word count (min / max list words per grid) and Word length (shortest / longest), side by side
  // in More options. Auto = by grid size: 8×8 7–9 words of 3–6 letters; 10×10 10–12 words, 12×12 13–15 words, 3–8 letters.
  // (Our Lexicon's words are 3–8 letters, plus some 11-letter words, offered on 12×12 only.) Each round picks its count in the range.
  const AUTO_Q = { 8: [7, 9], 10: [10, 12], 12: [13, 15] }, Q_CAP = { 8: 12, 10: 18, 12: 24 }, AUTO_L = { 8: 6, 10: 8, 12: 8 };
  // v13b (JM CD-134: 1.4 N): Auto follows the grid size AND the Challenge Level. Count: level 3 = the table above; levels 1–2
  // one word fewer, then one more every two levels (level 10: +3). Longest word: 8×8 6 letters (7 from level 5); bigger grids 8
  // letters (7 at levels 1–2).
  const LV_Q = [-1, -1, 0, 0, 1, 1, 2, 2, 3, 3];
  const autoQ = (n, lv) => { const s = LV_Q[(lv || 3) - 1] || 0; return [Math.min(Q_CAP[n], AUTO_Q[n][0] + s), Math.min(Q_CAP[n], AUTO_Q[n][1] + s)]; };
  const autoL = (n, lv) => n <= 8 ? ((lv || 3) >= 5 ? 7 : 6) : ((lv || 3) <= 2 ? 7 : 8);
  const lenCap = n => n <= 8 ? 7 : n >= 12 ? 11 : 8;
  const lenOpts = n => [4, 5, 6, 7, 8].filter(L => L <= lenCap(n)).concat(n >= 12 ? [11] : []);
  function qRange(n, s) {
    let lo = s.qMin === 'auto' ? autoQ(n, s.lv)[0] : Math.min(+s.qMin, Q_CAP[n]), hi = s.qMax === 'auto' ? autoQ(n, s.lv)[1] : Math.min(+s.qMax, Q_CAP[n]);
    if (lo > hi) { if (s.qMax === 'auto') hi = lo; else lo = hi; }
    return [lo, hi];
  }
  function lRange(n, s) {
    const cap = lenCap(n);
    let lo = Math.min(+s.lMin || 3, 8, cap), hi = s.lMax === 'auto' ? autoL(n, s.lv) : Math.min(+s.lMax, cap);
    if (lo > hi) { if (s.lMax === 'auto') hi = lo; else lo = hi; }
    return [lo, hi];
  }
  const rangeTxt = (a, b) => a === b ? `${a}` : `${a}–${b}`;
  const view = () => (M && (M.view || M.list)) || 'clue'; // v13b: what the Key list shows now (the in-game toggle)
  const bestList = () => M && (M.list === 'word' || (R && R.sawW)) ? 'word' : 'clue'; // which Solo best this round counts for
  const lensOf = () => (M && M.l) || [M && M.n <= 8 ? 3 : 4, autoL((M && M.n) || 10, (M && M.lv) || 3)]; // a v13 save has no lengths
  const DIRS_ALL = [[0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1]]; // → ↓ ↘ ↗ ← ↑ ↖ ↙
  const DIR_SETS = { easy: 2, std: 4, hard: 8 };
  const DIR_NAMES = { easy: 'Easy: → ↓', std: 'Standard: → ↓ ↘ ↗', hard: 'Hard: all 8 ways, backwards too' };
  const GRID_LOOKS = [['cream', 'Cream'], ['ink', 'Inked'], ['blue', 'Inked Blue'], ['steel', 'Steel'], ['sky', 'Sky'], ['navy', 'Navy & gold'], ['onyx', 'Onyx (black & white)'], ['ruby', 'Ruby (red & white)']];
  const rival = lv => (UI.OPP && UI.OPP[(lv || 3) - 1]) || { n: 'The Bot', a: '🤖' };
  const botNm = () => rival(M.lv).n, botAv = () => rival(M.lv).a, botFirst = () => botNm().split(' ')[0];
  const LV_NAMES = { 1: '1 · Apprentice', 10: '10 · Master' };
  const HINT_CAP_DUEL = 3, WIN = 10, DRAW = 5, MATCH = 20, SOLO_BEST = 10, SPEED_PER_MIN = 10, MASTER_X = 3;
  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const plural = (n, w) => `${UI.fmtN(n)} ${w}${n === 1 ? '' : 's'}`;
  const timerOf = () => hs.mode === 'solo' ? hs.sTimer : hs.timer;
  const listName = l => l === 'word' ? 'Words' : 'Clues';
  const lastLine = () => `${hs.mode === 'solo' ? 'Solo' : 'Duel'} · Challenge Level ${hs.lv} · ${hs.n}×${hs.n} · ${listName(hs.list)} · ${timerName(timerOf())}${hs.mode === 'duel' ? ' · ' + plural(hs.rounds, 'round') : ''}`;
  // v13c (JM CD-136 add. 1): Solo bests. Untimed: the fastest clear (as before) and the best SPEED, words per minute (wpm) and
  // letters per second (lps), which count once a round has run 1 minute and found 5 words. Timed: the best score for each grid
  // size, timer and Key list ("Best 10×10 in 3m · Clues"), as KeyCubes does.
  const tShort = t => t < 60 ? `${t}s` : `${t / 60}m`;
  const sbKey = (n, l, t) => t ? `${n}_${t}_${l}` : `${n}_${l}`;
  const sbLab = (n, l, t) => t ? `Best ${n}×${n} in ${tShort(t)} · ${listName(l)}` : `Best ${n}×${n} · ${listName(l)}`;
  const sbVal = (n, l, t) => { const b = (st.sb || {})[sbKey(n, l, t)]; return b == null ? '–' : t ? UI.fmtN(b) : fmt(b); };
  const RATE_MIN_MS = 60000, RATE_MIN_W = 5;
  const srGet = (n, l) => (st.sr || {})[sbKey(n, l)] || {};
  const rateTxt = (w, l) => `${w == null ? '–' : w.toFixed(1)} wpm · ${l == null ? '–' : l.toFixed(2)} lps`;

  // ---------- words and clues (our Lexicon: every hidden word has a clue) ----------
  const BLOCK = new Set(String(K.block || '').split(' ').filter(Boolean));
  let POOL = null, WP = null;
  function pool() {
    if (POOL) return POOL;
    POOL = [];
    for (const e of E.lexicon()) if (/^[A-Z]{3,12}$/.test(e.w) && !BLOCK.has(e.w) && (e.e || e.h)) POOL.push(e);
    try { WP = E.wordplay ? E.wordplay() : {}; } catch (x) { WP = {}; }
    return POOL;
  }
  const LV_CAP = [1, 1, 2, 2, 2, 3, 3, 4, 4, 5]; // the hardest Lexicon word level at each Challenge Level
  const pick1 = t => { const a = String(t || '').split(';').map(s => s.trim()).filter(Boolean); return a.length ? a[Math.floor(Math.random() * a.length)] : ''; };
  // one clue for a word: a random clue set; from Challenge Level 6 up, the indirect clue half the time
  function clueFor(e, lv) {
    const sets = [e].concat(e.alts || []), s = sets[Math.floor(Math.random() * sets.length)];
    let c = (E.revClue && E.revClue(s, lv)) || (lv >= 6 && Math.random() < 0.5 ? pick1(s.h) || pick1(s.e) : pick1(s.e) || pick1(s.h)); // v13d: ⏪ clue at Challenge Levels 1–3
    if (!c) c = pick1(e.e) || pick1(e.h);
    const wp = WP && WP[e.w];
    if (wp && wp.split(';').map(x => x.trim()).includes(c) && !/\?$/.test(c)) c += '?'; // a wordplay clue keeps its "?"
    return c;
  }
  // the clue drawn: "___" as a bar and "_" as an orange "?" (the Lexicon convention, CD-62)
  const clueHtml = c => UI.clueIcons(esc(c)).replace(/_{2,}/g, '<span class="hk-bar"></span>').replace(/_/g, '<span class="hk-q">?</span>');
  const shuffled = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const rev = s => s.split('').reverse().join('');
  // filler letters, by how often they turn up in English (no Q, few rare letters)
  const FILL = 'EEEEEEEEEEEETTTTTTTTTAAAAAAAAOOOOOOOIIIIIIINNNNNNNSSSSSSRRRRRRHHHHHLLLLLDDDDCCCUUUMMMFFPPGGWWYYBBVKXJZ';

  // build a grid: n×n letters, the list words + the Master Key in straight lines, the rest filled
  // v13a: count = list words wanted; lens = [shortest, longest] (the Word length setting; Auto keeps words shorter than the
  // grid, so none fills a whole row); minC = the fewest list words accepted if the grid is too crowded for count
  function build(n, lv, dirKey, count, lens, minC) {
    count = count || autoQ(n, lv)[0]; lens = lens || [3, autoL(n, lv)]; minC = Math.min(count, minC || count);
    const P = pool(), cap = LV_CAP[lv - 1], [lo, maxL] = lens;
    const dirs = DIRS_ALL.slice(0, DIR_SETS[dirKey] || 4);
    const inLen = e => e.w.length >= lo && e.w.length <= maxL;
    let cand = P.filter(e => e.l <= cap && inLen(e));
    if (cand.length < Math.max(400, count * 12)) cand = P.filter(inLen);
    for (let attempt = 0; attempt < 40; attempt++) {
      const need = attempt < 20 ? count : Math.max(minC, count - 2);
      const grid = new Array(n * n).fill(''), placed = [], used = new Set(), dirUse = {};
      const fits = (w, r, c, d) => {
        let over = 0;
        for (let k = 0; k < w.length; k++) {
          const rr = r + d[0] * k, cc = c + d[1] * k;
          if (rr < 0 || cc < 0 || rr >= n || cc >= n) return -1;
          const g = grid[rr * n + cc];
          if (g && g !== w[k]) return -1;
          if (g) over++;
        }
        return over >= w.length - 1 ? -1 : over;
      };
      const place = (e, master) => {
        const w = e.w;
        if (used.has(w)) return false;
        for (const p of placed) if (p.w.includes(w) || w.includes(p.w) || rev(p.w).includes(w) || w.includes(rev(p.w))) return false;
        const opts = [];
        for (let t = 0; t < 160 && opts.length < 24; t++) {
          const d = dirs[Math.floor(Math.random() * dirs.length)], r = Math.floor(Math.random() * n), c = Math.floor(Math.random() * n);
          const o = fits(w, r, c, d); if (o >= 0 && o <= 1) opts.push({ r, c, d, o });
        }
        if (!opts.length) return false;
        // a crossing is welcome; a direction already used often is not (the words spread over every allowed way)
        for (const p of opts) p.s = p.o * 0.9 - (dirUse[p.d.join()] || 0) * 0.75 + Math.random() * 0.6;
        opts.sort((a, b) => b.s - a.s);
        const o = opts[0];
        dirUse[o.d.join()] = (dirUse[o.d.join()] || 0) + 1;
        const cells = [];
        for (let k = 0; k < w.length; k++) { const i = (o.r + o.d[0] * k) * n + (o.c + o.d[1] * k); grid[i] = w[k]; cells.push(i); }
        placed.push({ w, e, cells, m: !!master }); used.add(w);
        return true;
      };
      // the Master Key first (5–8 letters, an easier word), then the list: a spread of lengths, longest placed first
      // (the Master Key: 5–8 letters where the Word length allows, else the nearest lengths it allows)
      const mkLo = Math.max(lo, Math.min(5, maxL)), mkHi = Math.max(mkLo, Math.min(8, maxL));
      let mkC = cand.filter(e => e.w.length >= mkLo && e.w.length <= mkHi && e.l <= Math.max(2, cap));
      if (!mkC.length) mkC = cand.filter(e => e.w.length >= mkLo && e.w.length <= mkHi);
      const mk = shuffled(mkC);
      if (!mk.some(e => place(e, true))) continue;
      // a varied list: a fair share of each length; placed longest first
      const perLen = {}, pick = [], spare = [];
      for (const e of shuffled(cand)) {
        const L = e.w.length;
        if (e.w === placed[0].w) continue;
        if (pick.length < count + 2 && (perLen[L] || 0) < Math.ceil((count + 2) / Math.min(4, maxL - lo + 1))) { pick.push(e); perLen[L] = (perLen[L] || 0) + 1; }
        else if (spare.length < count * 4) spare.push(e);
        if (pick.length >= count + 2 && spare.length >= count * 4) break;
      }
      for (const e of pick.sort((a, b) => b.w.length - a.w.length).concat(spare)) {
        if (placed.length - 1 >= count) break;
        place(e, false);
      }
      if (placed.length - 1 < need) continue;
      // fill the gaps; a list word may not show up twice (any direction)
      let ok = false;
      for (let f = 0; f < 12 && !ok; f++) {
        const g = grid.map(x => x || FILL[Math.floor(Math.random() * FILL.length)]);
        ok = placed.every(p => occurrences(g, n, p.w) === 1);
        if (ok) for (let i = 0; i < n * n; i++) grid[i] = g[i];
      }
      if (!ok) continue;
      const words = placed.map(p => ({ w: p.w, clue: clueFor(p.e, lv), lv: p.e.l, cells: p.cells, m: p.m, by: null, t: 0 }));
      return { grid: grid.join(''), words };
    }
    return null;
  }
  function occurrences(g, n, w) {
    let c = 0;
    for (let r = 0; r < n; r++) for (let q = 0; q < n; q++) {
      if (g[r * n + q] !== w[0]) continue;
      for (const d of DIRS_ALL) {
        let k = 1;
        for (; k < w.length; k++) { const rr = r + d[0] * k, cc = q + d[1] * k; if (rr < 0 || cc < 0 || rr >= n || cc >= n || g[rr * n + cc] !== w[k]) break; }
        if (k === w.length) c++;
      }
    }
    return w.length === 1 ? c / 8 : (rev(w) === w ? c / 2 : c);
  }
  // v13c (JM CD-136: 2.4 N): in a Duel that started with Clues, a word you find while the list shows the words scores half
  // (rounded up); the Master Key is never shown as a word, so it keeps its ×3
  const ptsOf = x => { const p = x.w.length * (x.m ? MASTER_X : 1); return x.half ? Math.ceil(p / 2) : p; };

  // ---------- the match and the round ----------
  let M = null, R = null;
  (function load() {
    const s = store.get(SAVE_KEY, null);
    if (s && s.M && s.R && typeof s.R.grid === 'string' && Array.isArray(s.R.words)) { M = s.M; R = s.R; R.paused = false; }
  })();
  const unfinished = () => !!(M && !M.done);
  const listWords = () => R.words.filter(x => !x.m);
  const masterW = () => R.words.find(x => x.m);
  const myPts = () => R.words.reduce((a, x) => a + (x.by === 'me' ? ptsOf(x) : 0), 0);
  const botPts = () => R.words.reduce((a, x) => a + (x.by === 'bot' ? ptsOf(x) : 0), 0);
  const unfText = () => M.mode === 'solo' ? `Unfinished Solo round · ${plural(R.words.filter(x => x.by === 'me').length, 'word')}`
    : `Unfinished match · round ${M.no} of ${M.rounds} · You ${UI.fmtN(M.me + (R.over ? 0 : myPts()))} – ${esc(botFirst())} ${UI.fmtN(M.bot + (R.over ? 0 : botPts()))}`;
  function save() { if (!M || M.done) { store.set(SAVE_KEY, null); return; } store.set(SAVE_KEY, { M, R }); }
  function newMatch() {
    M = { mode: hs.mode, n: hs.n, timer: timerOf(), lv: hs.lv, list: hs.list, dir: hs.dir, rounds: hs.mode === 'solo' ? 1 : hs.rounds,
      sHint: hs.sHint, sCap: hs.sCap, q: qRange(hs.n, hs), l: lRange(hs.n, hs), no: 0, me: 0, bot: 0, list2: [], done: false, histT: 0, coins: 0 };
  }
  function newRound() {
    const q = M.q || autoQ(M.n, M.lv), count = q[0] + Math.floor(Math.random() * (q[1] - q[0] + 1));
    const b = build(M.n, M.lv, M.dir, count, lensOf(), q[0]) || build(M.n, M.lv, M.dir, Math.max(4, count - 3), lensOf(), 4)
      || build(M.n, M.lv, M.dir, autoQ(M.n, M.lv)[0], [3, autoL(M.n, M.lv)], 4); // a very crowded choice falls back to the Auto grid
    M.no++;
    R = { grid: b.grid, words: b.words, el: 0, hints: 0, hintCoins: 0, hint: -1, hintK: 0, hinted: {}, sel: -1, over: false, paused: false, started: false, botNext: 0 };
    if (M.mode === 'duel') R.botNext = botGap() * 0.8;
  }
  // the Bot (Challenge Level): words per minute on a 10×10 Words grid; slower on bigger grids, with Clues and harder directions
  const BOT_WPM = [0.8, 1.05, 1.3, 1.55, 1.8, 2.1, 2.5, 3, 3.6, 4.3];
  function botGap() {
    const base = 60 / BOT_WPM[M.lv - 1], g = { 8: 0.8, 10: 1, 12: 1.25 }[M.n] || 1, m = M.list === 'word' ? 1 : 1.45, d = { easy: 0.85, std: 1, hard: 1.2 }[M.dir] || 1;
    return base * g * m * d * (0.6 + Math.random() * 0.8);
  }
  function botFind() {
    const open = listWords().filter(x => !x.by);
    if (!open.length) return;
    const mk = masterW(), done = listWords().length - open.length;
    let x;
    // the Master Key: from level 5 up, once half the list is gone, now and then
    if (mk && !mk.by && M.lv >= 5 && done >= listWords().length / 2 && Math.random() < (M.lv - 4) / 10) x = mk;
    else { // longer words are easier to spot
      const wt = open.map(o => Math.pow(o.w.length, 1.5)); let s = wt.reduce((a, b) => a + b, 0) * Math.random();
      x = open[open.length - 1]; for (let i = 0; i < open.length; i++) { s -= wt[i]; if (s <= 0) { x = open[i]; break; } }
    }
    claim(x, 'bot');
  }

  // ---------- screens ----------
  const screenOn = () => !SEC.hidden;
  const playOn = () => screenOn() && !$('#hkPlay').hidden;
  const modalOpen = () => { const m = $('#modal'); return m && !m.hidden; };
  function setHead(sub) { $('#hkSub').textContent = sub; document.title = `${NM.hidden} · ${NM.suite} ${UI.APP_VER}`; }
  function part(id) { for (const p of ['hkSetup', 'hkPlay', 'hkRes']) $('#' + p).hidden = p !== id; }
  function showSetup() { UI.showScreen('hiddenkeys'); part('hkSetup'); setHead('Setup'); paintSetup(); $('#hkSetup').scrollTop = 0; }
  function showPlay() {
    if (!R) return;
    if (R.over) { showRes(); return; }
    UI.showScreen('hiddenkeys'); part('hkPlay');
    setHead(M.mode === 'solo' ? `Solo · ${M.n}×${M.n}` : `Round ${M.no} of ${M.rounds} · ${M.n}×${M.n}`);
    buildBoard(); paintGame(); tick(0);
    fit(); requestAnimationFrame(fit);
    if (!R.started) {
      R.started = true;
      msg(matchMedia('(pointer: coarse)').matches ? 'Swipe across a word, first letter to last'
        : view() === 'clue' ? 'Drag across a word, or type the answer to a clue' : 'Drag from the first letter of a word to its last', '', 3500);
    } else msg('');
  }
  function goLobby() { clearSel(); save(); document.title = `${NM.suite} · ${UI.APP_VER}`; UI.goHome(); }
  function start() {
    openModal('<div class="loading">Hiding the keys…</div>', '', { close: false });
    setTimeout(() => { closeModal(); newMatch(); newRound(); save(); UI.lobby(); showPlay(); }, 30);
  }
  function newGame() {
    if (!unfinished()) { start(); return; }
    openModal(`<h2>Start a new ${NM.hidden} game?</h2><p>Your unfinished ${M.mode === 'solo' ? 'Solo round' : 'match'} will end and count as played.</p>
      <div class="row"><button class="btn" data-a="no">Cancel</button><button class="btn primary" data-a="yes">Start new</button></div>`);
    $('#sheet').onclick = e => { const b = e.target.closest('[data-a]'); if (!b) return; closeModal(); if (b.dataset.a === 'yes') { abandon(); start(); } };
  }
  function abandon() {
    if (!unfinished()) return;
    if (M.mode === 'duel') st.matches++;
    M.done = true; saveSt(); store.set(SAVE_KEY, null);
  }

  // ---------- Setup ----------
  $('#hkLv').innerHTML = Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">${LV_NAMES[i + 1] || i + 1}</option>`).join('');
  $('#hkGs').innerHTML = GRID_LOOKS.map(([v, n]) => `<option value="${v}">${n}</option>`).join('');
  $('#hkDir').innerHTML = Object.keys(DIR_NAMES).map(k => `<option value="${k}">${DIR_NAMES[k]}${k === 'std' ? ' (default)' : ''}</option>`).join('');
  if (UI.btnOpts) $('#hkBs').innerHTML = UI.btnOpts();
  function paintLooks() {
    if (UI.setLook) UI.setLook(SEC, hs.bs);
    for (const [v] of GRID_LOOKS) SEC.classList.toggle('hk-gs-' + v, v === hs.gs);
  }
  // the Setup preview: a small grid in your Grid Colors with one of your bands, one of the Bot's and the gold Master Key
  function paintPreview() {
    const n = 6, g = Array.from({ length: n * n }, () => FILL[Math.floor(Math.random() * FILL.length)]);
    const put = (w, r, c, d) => { for (let k = 0; k < w.length; k++) g[(r + d[0] * k) * n + c + d[1] * k] = w[k]; return [r, c, r + d[0] * (w.length - 1), c + d[1] * (w.length - 1)]; };
    const a = put('KEYS', 1, 1, [0, 1]), b = put('HIDE', 2, 0, [1, 1]), m = put('LOCK', 2, 5, [1, 0]);
    const ln = (p, cls) => `<line class="${cls}" x1="${p[1] + 0.5}" y1="${p[0] + 0.5}" x2="${p[3] + 0.5}" y2="${p[2] + 0.5}"/>`;
    $('#hkPrev').innerHTML = `<div class="hk-board hk-pv" style="--n:${n}"><div class="hk-tiles">${g.map(() => '<i></i>').join('')}</div>
      <svg class="hk-bands" viewBox="0 0 ${n} ${n}" aria-hidden="true">${ln(b, 'bot')}${ln(a, 'me')}${ln(m, 'mk')}</svg>
      <div class="hk-lets">${g.map(c => `<b>${c}</b>`).join('')}</div></div>`;
  }
  function paintSetup() {
    const seg = (id, v) => { for (const b of document.querySelectorAll(`#${id} button`)) { const on = b.dataset.v === String(v); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); } };
    seg('hkMode', hs.mode); seg('hkN', hs.n); seg('hkList', hs.list);
    const duel = hs.mode === 'duel';
    $('#hkTm').innerHTML = TIMERS.filter(t => duel ? t[0] : true).map(([v, l]) => `<option value="${v}">${l}${(duel && v === 180) || (!duel && v === 0) ? ' (default)' : ''}</option>`).join('');
    $('#hkTm').value = String(timerOf());
    $('#hkSoloF').hidden = duel; $('#hkRdF').hidden = !duel;
    $('#hkLv').value = String(hs.lv); $('#hkRd').value = String(hs.rounds); $('#hkDir').value = hs.dir;
    $('#hkGs').value = hs.gs; $('#hkBs').value = hs.bs; $('#hkSh').value = hs.sHint; $('#hkScap').value = hs.sCap;
    // v13a: Word count and Word length (the lists depend on the grid size; Auto shows what it means for this grid)
    const n = hs.n, q = qRange(n, hs), l = lRange(n, hs), nums = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
    const opt = (v, t, on) => `<option value="${v}"${on ? ' selected' : ''}>${t}</option>`;
    $('#hkQmin').innerHTML = opt('auto', `Auto: ${autoQ(n, hs.lv)[0]}`, hs.qMin === 'auto') + nums(4, Q_CAP[n]).map(v => opt(v, v, hs.qMin !== 'auto' && v === q[0])).join('');
    $('#hkQmax').innerHTML = opt('auto', `Auto: ${autoQ(n, hs.lv)[1]}`, hs.qMax === 'auto') + nums(4, Q_CAP[n]).map(v => opt(v, v, hs.qMax !== 'auto' && v === q[1])).join('');
    $('#hkLmin').innerHTML = nums(3, Math.min(8, lenCap(n))).map(v => opt(v, `${v} letters`, v === l[0])).join('');
    $('#hkLmax').innerHTML = opt('auto', `Auto: ${autoL(n, hs.lv)} letters`, hs.lMax === 'auto') + lenOpts(n).map(v => opt(v, `${v} letters`, hs.lMax !== 'auto' && v === l[1])).join('');
    for (const b of document.querySelectorAll('#hkN button')) { const g = +b.dataset.v, r = qRange(g, hs); b.querySelector('small').textContent = `${rangeTxt(r[0], r[1])} words`; }
    paintPreview();
    const words = ['everyday words', 'everyday words', 'common words', 'common words', 'common words', 'a wider vocabulary', 'a wider vocabulary', 'harder words', 'harder words', 'any word in the Lexicon'][hs.lv - 1];
    const clues = hs.lv >= 6 ? ' Clues are often indirect (a link, not a definition).' : '';
    $('#hkDesc').textContent = duel
      ? `Challenge Level ${hs.lv}: ${rival(hs.lv).a} ${rival(hs.lv).n} races you for ${rangeTxt(q[0], q[1])} hidden words of ${rangeTxt(l[0], l[1])} letters (${words}), about one every ${Math.round(60 / BOT_WPM[hs.lv - 1] * ({ 8: 0.8, 10: 1, 12: 1.25 }[hs.n]) * (hs.list === 'word' ? 1 : 1.45))} seconds. Each word goes to whoever finds it first.${clues}`
      : `Solo: ${rangeTxt(q[0], q[1])} hidden words of ${rangeTxt(l[0], l[1])} letters (${words}), no Bot. Hints ${hs.sHint === 'free' ? 'are free' : 'cost 🪙1 per letter'}, ${hs.sCap === '3' ? '3 per round' : 'no limit'}. ${hs.sTimer ? `Beat your best score for ${hs.n}×${hs.n} in ${tShort(hs.sTimer)} with ${listName(hs.list)}` : `Beat your fastest clear and your best speed (words per minute and letters per second, shown live under your score) for ${hs.n}×${hs.n} with ${listName(hs.list)}`}${hs.sHint === 'free' ? '' : `: a new best pays 🪙${SOLO_BEST}`}.${clues}`;
    $('#hkOptsSum').textContent = `Words: ${rangeTxt(q[0], q[1])} · ${rangeTxt(l[0], l[1])} letters · Directions: ${DIR_NAMES[hs.dir].split(':')[0]} · ${duel ? plural(hs.rounds, 'round') + ' · ' : ''}Grid: ${(GRID_LOOKS.find(x => x[0] === hs.gs) || GRID_LOOKS[0])[1].replace(/ \(.*\)$/, '')} · Buttons: ${((UI.BTN_LOOKS || []).find(x => x[0] === hs.bs) || [0, 'Steel'])[1]}`;
    const unf = unfinished();
    $('#hkSetUnf').hidden = !unf; if (unf) $('#hkSetUnfTxt').textContent = unfText();
    $('#hkStart').textContent = unf ? '🆕 New Game' : `▶ Start ${NM.hidden}`;
    $('#hkStart').classList.toggle('primary', !unf);
    const pct = st.matches ? Math.round(100 * st.won / st.matches) + '%' : '–';
    $('#hkStats').innerHTML = st.matches || st.soloN
      ? [[UI.fmtN(st.matches), 'Matches'], [pct, 'Won'], [UI.fmtN(st.words), 'Words'], [UI.fmtN(st.keys), 'Master Keys'], [sbVal(hs.n, hs.list, hs.sTimer) + (hs.sTimer && sbVal(hs.n, hs.list, hs.sTimer) !== '–' ? ' pts' : ''), `Solo ${sbLab(hs.n, hs.list, hs.sTimer)}`]].concat(hs.sTimer ? [] : [[rateTxt(srGet(hs.n, hs.list).wpm, srGet(hs.n, hs.list).lps), 'Solo best speed']]).map(([v, l]) => `<div class="vt-st"><b>${v}</b><span>${l}</span></div>`).join('')
      : '<p class="vt-none">No games played yet. Pick your settings and start.</p>';
    paintLooks();
  }
  const segPick = (id, f) => $(id).addEventListener('click', e => { const b = e.target.closest('button[data-v]'); if (!b) return; f(b.dataset.v); saveHs(); paintSetup(); UI.lobby(); });
  segPick('#hkMode', v => { hs.mode = v; });
  segPick('#hkN', v => { hs.n = +v; });
  segPick('#hkList', v => { hs.list = v; });
  const onCh = (id, f) => $(id).addEventListener('change', e => { f(e.target.value); saveHs(); paintSetup(); UI.lobby(); });
  onCh('#hkTm', v => { if (hs.mode === 'solo') hs.sTimer = +v; else hs.timer = +v; });
  onCh('#hkLv', v => { hs.lv = +v; });
  onCh('#hkRd', v => { hs.rounds = +v; });
  onCh('#hkDir', v => { hs.dir = v; });
  onCh('#hkGs', v => { hs.gs = v; });
  onCh('#hkBs', v => { hs.bs = v; });
  onCh('#hkSh', v => { hs.sHint = v; });
  onCh('#hkScap', v => { hs.sCap = v; });
  // a min above the max (or a max below the min) moves the other one along, so the pair always makes sense
  const numOr = v => v === 'auto' ? v : +v;
  onCh('#hkQmin', v => { hs.qMin = numOr(v); if (hs.qMin !== 'auto' && hs.qMax !== 'auto' && hs.qMax < hs.qMin) hs.qMax = hs.qMin; });
  onCh('#hkQmax', v => { hs.qMax = numOr(v); if (hs.qMax !== 'auto' && hs.qMin !== 'auto' && hs.qMin > hs.qMax) hs.qMin = hs.qMax; });
  onCh('#hkLmin', v => { hs.lMin = +v; if (hs.lMax !== 'auto' && hs.lMax < hs.lMin) hs.lMax = hs.lMin; });
  onCh('#hkLmax', v => { hs.lMax = numOr(v); if (hs.lMax !== 'auto' && hs.lMin > hs.lMax) hs.lMin = hs.lMax; });
  $('#hkStart').addEventListener('click', newGame);
  $('#hkSetResume').addEventListener('click', () => { if (unfinished()) showPlay(); });
  paintLooks();

  // ---------- the board ----------
  // three layers in one square: the tiles, the bands (an SVG whose units are cells, so it scales by itself), the letters
  const board = () => $('#hkBoard');
  const cellRC = i => [Math.floor(i / M.n), i % M.n];
  const bandLine = (cells, cls, extra) => { const [r0, c0] = cellRC(cells[0]), [r1, c1] = cellRC(cells[cells.length - 1]); return `<line class="${cls}" ${extra || ''} x1="${c0 + 0.5}" y1="${r0 + 0.5}" x2="${c1 + 0.5}" y2="${r1 + 0.5}"/>`; };
  function boardHtml(id, res) {
    const n = M.n;
    return `<div class="hk-board" id="${id}" style="--n:${n}"><div class="hk-tiles">${Array.from({ length: n * n }, (_, i) => `<i data-i="${i}"></i>`).join('')}</div>
      <svg class="hk-bands" viewBox="0 0 ${n} ${n}" aria-hidden="true"><g class="done"></g><g class="cur"></g></svg>
      <div class="hk-lets">${R.grid.split('').map((c, i) => `<b data-i="${i}">${c}</b>`).join('')}</div></div>`;
  }
  let tiles = [], lets = [];
  function buildBoard() {
    tray.innerHTML = boardHtml('hkBoard');
    tray.style.setProperty('--n', M.n);
    tray.classList.remove('tf-y', 'tf-r', 'tf-a', 'tf-b');
    tiles = [...tray.querySelectorAll('.hk-tiles i')]; lets = [...tray.querySelectorAll('.hk-lets b')];
    paintBands(); paintHint(); paintSel();
  }
  function paintBands() {
    const g = tray.querySelector('.hk-bands .done'); if (!g) return;
    g.innerHTML = R.words.filter(x => x.by).map(x => bandLine(x.cells, (x.by === 'me' ? 'me' : 'bot') + (x.m ? ' mk' : ''))).join('');
    const own = {}; R.words.forEach(x => { if (x.by) x.cells.forEach(i => { own[i] = own[i] ? 'both' : x.by; }); });
    lets.forEach((b, i) => { b.className = own[i] ? 'f' : ''; });
  }
  // 💡 the hinted word's first R.hintK letters are striped and numbered
  function paintHint() {
    tiles.forEach(t => { if (t.classList.contains('hint')) { t.classList.remove('hint'); t.removeAttribute('data-hn'); } });
    const x = R.words[R.hint];
    if (!x || x.by) return;
    x.cells.slice(0, Math.max(1, R.hintK || 1)).forEach((i, k) => { const t = tiles[i]; if (t) { t.classList.add('hint'); t.dataset.hn = k + 1; } });
  }

  // ---------- the bar, the Key list ----------
  function paintGame() {
    const solo = M.mode === 'solo';
    $('#hkBot').classList.toggle('solo', solo);
    $('#hkBotAv').textContent = solo ? '🎯' : botAv();
    $('#hkBotNm').innerHTML = solo ? `<span class="t">${sbLab(M.n, bestList(), M.timer)}</span>` : `<span class="t">${esc(botNm())}</span><span class="lvl-pill" title="Challenge Level">${M.lv}</span>`;
    $('#hkBotNm').title = solo ? '' : `${botNm()}, Challenge Level ${M.lv}`;
    $('#hkMeAv').innerHTML = UI.meWin().av || '🙂';
    $('#hkMeNm').textContent = (UI.settings().name || '').trim() || 'You';
    $('#hkDone').hidden = !solo;
    paintScores(); paintKeys(); paintHintBtn(); paintPause();
  }
  // v13c (CD-136 add. 1): the speed "heartbeat": your running words per minute and letters per second (Untimed Solo, under
  // your score; it counts from 10 seconds in so the first word doesn't read as a huge rate)
  function speedNow() {
    const mine = R.words.filter(x => x.by === 'me'), s = (R.el || 0) / 1000;
    if (s < 10) return { wpm: null, lps: null, n: mine.length };
    return { wpm: mine.length / (s / 60), lps: mine.reduce((a, x) => a + x.w.length, 0) / s, n: mine.length };
  }
  const meterOn = () => M && M.mode === 'solo' && !M.timer;
  function paintMeter() { if (!meterOn() || !R || R.over) return; const s = speedNow(), el = $('#hkMeRd'); el.innerHTML = `<span class="hk-meter" title="Your running speed: words per minute and letters per second">${rateTxt(s.wpm, s.lps)}</span>`; }
  function paintScores() {
    const duel = M.mode === 'duel', my = myPts(), bp = botPts();
    $('#hkMeSc').textContent = UI.fmtN(duel ? M.me + my : my);
    $('#hkMeRd').textContent = duel && M.rounds > 1 ? `Rd ${M.no}: ${UI.fmtN(my)}` : '';
    paintMeter();
    $('#hkBotSc').textContent = duel ? UI.fmtN(M.bot + bp) : sbVal(M.n, bestList(), M.timer);
    $('#hkBotRd').textContent = duel && M.rounds > 1 ? `Rd ${M.no}: ${UI.fmtN(bp)}` : '';
    $('#hkMeRd').title = $('#hkBotRd').title = duel ? `Round ${M.no} of ${M.rounds}; the big number is the game total` : '';
    $('#hkBar').classList.toggle('multi', duel && M.rounds > 1);
    for (const el of [$('#hkMeRd'), $('#hkBotRd')]) {
      el.style.fontSize = '';
      if (el.textContent && el.clientWidth && el.scrollWidth > el.clientWidth) el.style.fontSize = Math.max(13, Math.floor(parseFloat(getComputedStyle(el).fontSize) * el.clientWidth / el.scrollWidth)) + 'px';
    }
    for (const el of [$('#hkMeSc'), $('#hkBotSc')]) {
      el.style.fontSize = '';
      const av = el.parentNode.querySelector('.av'), room = el.parentNode.clientWidth - 16 - (av ? av.offsetWidth + 6 : 0);
      if (room > 0 && el.offsetWidth > room) el.style.fontSize = Math.max(14, Math.floor(parseFloat(getComputedStyle(el).fontSize) * room / el.offsetWidth)) + 'px';
    }
  }
  const hd = x => !!(R && R.hinted && R.hinted[x.w]);
  // the order of the list: the Master Key first; Clues by length (so the order gives nothing away); Words A–Z
  function keyOrder() {
    const idx = R.words.map((x, i) => i);
    return idx.sort((a, b) => { const x = R.words[a], y = R.words[b]; return (y.m - x.m) || (view() === 'word' ? x.w.localeCompare(y.w) : x.w.length - y.w.length || x.clue.localeCompare(y.clue)); });
  }
  function keyRow(i, res) {
    const x = R.words[i], who = x.by === 'me' ? 'me' : x.by === 'bot' ? 'bot' : res ? 'miss' : '';
    const showW = x.by || res || (view() === 'word' && !x.m);
    const ans = showW ? `<span class="hk-ans">${hd(x) ? '<i class="hm" title="A Hint helped">💡</i>' : ''}${x.w}</span>` : `<span class="hk-ans blank" aria-label="${x.w.length} letters">${'<u></u>'.repeat(x.w.length)}</span>`;
    const tag = x.by === 'me' ? `<span class="hk-by">${UI.meWin().av || '🙂'}</span>` : x.by === 'bot' ? `<span class="hk-by">${botAv()}</span>` : '';
    const clue = view() === 'clue' || x.m || res ? `<span class="hk-cl">${x.m ? '<b class="hk-mkl">🗝 Master Key ×3</b> ' : ''}${clueHtml(x.clue)}</span>` : '';
    return `<button type="button" class="hk-key ${who}${x.m ? ' m' : ''}${i === (res ? resSel : R.sel) ? ' sel' : ''}${view() === 'word' && !x.m && !res ? ' wl' : ''}" data-k="${i}">
      <span class="hk-len">${x.w.length}</span>${clue}${ans}${x.by || res ? `<span class="hk-pts"${x.half ? ' title="Half points: found while the words were shown"' : ''}>${x.by ? '+' : ''}${ptsOf(x)}${x.half ? '<span class="hk-half">½</span>' : ''}</span>` : ''}${tag}</button>`;
  }
  function paintKeys() {
    const L = listWords(), mine = R.words.filter(x => x.by === 'me').length, left = L.filter(x => !x.by).length;
    const lr = lenRange();
    $('#hkKHead').innerHTML = `<span class="kl">Key list: </span>${UI.fmtN(left)} of ${UI.fmtN(L.length)} left · ${rangeTxt(lr[0], lr[1])} letters`;
    $('#hkKPts').textContent = `You ${plural(mine, 'word')} · ${UI.fmtN(myPts())} pts`;
    for (const b of $$('#hkView button')) { const on = b.dataset.v === view(); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); b.disabled = R.over; }
    $('#hkKeys').classList.toggle('words', view() === 'word');
    $('#hkKeys').innerHTML = keyOrder().map(i => keyRow(i)).join('');
  }
  $('#hkKeys').addEventListener('click', e => {
    const b = e.target.closest('.hk-key'); if (!b || !R || R.over) return;
    const i = +b.dataset.k, x = R.words[i];
    if (x.by) return;
    R.sel = R.sel === i ? -1 : i;
    for (const k of $$('#hkKeys .hk-key')) k.classList.toggle('sel', +k.dataset.k === R.sel);
    paintHintBtn(); msg('');
  });
  // v13b (JM CD-134 add. 1): Clues / Words toggle in the Key list heading, any time during play. It keeps for the rest of
  // the match (a new game starts with the Setup choice). The Bot's pace stays as set in Setup. A Solo round in which the
  // words were shown counts toward the Words best, not the Clues best.
  $('#hkView').addEventListener('click', e => {
    const b = e.target.closest('button[data-v]'); if (!b || !R || R.over || b.dataset.v === view()) return;
    const go = () => { M.view = b.dataset.v; if (M.view === 'word') R.sawW = true; typed = ''; snd('row'); paintGame(); msg(''); save(); };
    if (b.dataset.v !== 'word' || M.list === 'word') { go(); return; }
    // v13c (JM CD-136: 2.4.1): switching a Clues game to Words first shows a warning the Player must agree to (the clock waits)
    const duel = M.mode === 'duel';
    openModal(`<h2>⚠️ Show the words?</h2>
      <p>The Key list will show every hidden word instead of its clue, which makes them much easier to find.</p>
      <p>${duel ? `<b>In this Duel, each word you find while the words show scores half points</b> (rounded up). The 🗝 Master Key stays a clue and keeps its ×3. ${esc(botNm())} keeps its pace.`
        : `<b>This Solo round will then count toward your Words bests</b> (time, speed or score), not your Clues bests.`} You can switch back to Clues at any time.</p>
      <div class="row"><button class="btn" data-a="no">Keep clues</button><button class="btn primary" data-a="yes">I agree: show the words</button></div>`);
    $('#sheet').onclick = ev => { const a = ev.target.closest('[data-a]'); if (!a) return; closeModal(); if (a.dataset.a === 'yes') go(); };
  });

  // ---------- picking a word: swipe / drag / tap first + last / type ----------
  let trace = [], dragging = false, moved = false, typed = '', geo = null, startI = -1, tapStart = -1;
  function measure() { const r = board().getBoundingClientRect(); geo = { x: r.left, y: r.top, w: r.width, c: r.width / M.n }; }
  function cellAt(x, y, loose) {
    const n = M.n, cx = (x - geo.x) / geo.c, cy = (y - geo.y) / geo.c;
    if (!loose && (cx < -0.4 || cy < -0.4 || cx > n + 0.4 || cy > n + 0.4)) return -1;
    return Math.max(0, Math.min(n - 1, Math.floor(cy))) * n + Math.max(0, Math.min(n - 1, Math.floor(cx)));
  }
  // the straight line from cell a toward the point (x, y), snapped to the nearest of the 8 directions
  function lineTo(a, x, y) {
    const n = M.n, [r0, c0] = cellRC(a), px = geo.x + (c0 + 0.5) * geo.c, py = geo.y + (r0 + 0.5) * geo.c, dx = x - px, dy = y - py;
    if (Math.hypot(dx, dy) < geo.c * 0.42) return [a];
    const o = ((Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) % 8) + 8) % 8;
    const d = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]][o];
    const len = Math.hypot(d[0], d[1]), proj = (dx * d[1] + dy * d[0]) / len;
    let k = Math.max(0, Math.round(proj / (geo.c * len)));
    while (k > 0) { const r = r0 + d[0] * k, c = c0 + d[1] * k; if (r >= 0 && c >= 0 && r < n && c < n) break; k--; }
    const out = []; for (let j = 0; j <= k; j++) out.push((r0 + d[0] * j) * n + c0 + d[1] * j);
    return out;
  }
  const aligned = (a, b) => { const [r0, c0] = cellRC(a), [r1, c1] = cellRC(b); return r0 === r1 || c0 === c1 || Math.abs(r1 - r0) === Math.abs(c1 - c0); };
  function lineCells(a, b) {
    const [r0, c0] = cellRC(a), [r1, c1] = cellRC(b), k = Math.max(Math.abs(r1 - r0), Math.abs(c1 - c0)), dr = Math.sign(r1 - r0), dc = Math.sign(c1 - c0), out = [];
    for (let j = 0; j <= k; j++) out.push((r0 + dr * j) * M.n + c0 + dc * j);
    return out;
  }
  let litNow = [];
  function paintSel() {
    for (const i of litNow) if (!trace.includes(i) && lets[i]) lets[i].classList.remove('on');
    for (const i of trace) if (lets[i]) lets[i].classList.add('on');
    litNow = trace.slice();
    const g = tray.querySelector('.hk-bands .cur');
    if (g) g.innerHTML = trace.length ? bandLine(trace, 'sel') : '';
    if (trace.length) { const w = trace.map(i => R.grid[i]).join(''); $('#hkMsg').innerHTML = w.split('').map(c => `<span class="kc-wl">${c}</span>`).join('') + (w.length >= 2 ? `<span class="kc-wp">${w.length}</span>` : ''); }
  }
  function clearSel() { trace = []; tapStart = -1; typed = ''; if (R && M && !$('#hkPlay').hidden) paintSel(); }
  const canPlay = () => R && !R.over && !R.paused;
  tray.addEventListener('pointerdown', e => {
    if (!canPlay() || (e.pointerType === 'mouse' && e.button !== 0) || !board()) return;
    e.preventDefault(); try { tray.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ }
    measure();
    const i = cellAt(e.clientX, e.clientY);
    if (i < 0) return;
    dragging = true; moved = false; typed = ''; startI = i;
    if (tapStart >= 0 && i !== tapStart) { if (aligned(tapStart, i)) { trace = lineCells(tapStart, i); paintSel(); } return; } // a tap on the last letter (sent on release)
    trace = [i]; snd('key'); paintSel();
  });
  // 'pointerrawupdate' (where the browser has it) reports the finger as soon as it moves, so the band follows sooner
  tray.addEventListener('onpointerrawupdate' in window ? 'pointerrawupdate' : 'pointermove', e => {
    if (!dragging || !geo) return;
    if (tapStart >= 0 && startI !== tapStart) { // the finger moved after a tap-start: a fresh drag from here
      if (cellAt(e.clientX, e.clientY, true) !== startI) tapStart = -1;
      else return;
    }
    const t = lineTo(startI, e.clientX, e.clientY);
    if (t.length !== trace.length || t[t.length - 1] !== trace[trace.length - 1]) { if (t.length > trace.length) snd('key'); trace = t; moved = moved || t.length > 1; paintSel(); }
  });
  const up = () => {
    if (!dragging) return; dragging = false; geo = null;
    if (moved && trace.length >= 2) { tapStart = -1; submit(); return; }
    if (tapStart >= 0 && startI !== tapStart) { // second tap
      if (aligned(tapStart, startI)) { tapStart = -1; submit(); return; }
      tapStart = startI; trace = [startI]; paintSel(); return;
    }
    if (tapStart === startI) { clearSel(); msg(''); return; } // the same letter again: cancel
    tapStart = startI; trace = [startI]; paintSel(); // the first tap: now tap the last letter of the word
    msg('Now tap the last letter of the word', '', 1800);
  };
  tray.addEventListener('pointerup', up); tray.addEventListener('pointercancel', up);

  // ---------- claiming a word ----------
  function msg(html, kind, ms) {
    const m = $('#hkMsg');
    m.innerHTML = html ? `<span class="kc-mt ${kind || ''}">${html}</span>` : idleHtml();
    clearTimeout(msg.t);
    if (ms) msg.t = setTimeout(() => { if (!trace.length && !typed && R && !R.over) msg(''); }, ms);
  }
  function idleHtml() {
    if (!R || R.over) return '';
    const h = R.words[R.hint];
    if (h && !h.by) return `<span class="kc-mt clue">💡 ${h.w.length} letters: ${clueHtml(h.clue)}${(R.hintK || 1) > 1 ? ` <small>(${R.hintK} letters shown)</small>` : ''}</span>`;
    const s = R.words[R.sel];
    if (s && !s.by) return `<span class="kc-mt clue sel">${s.m ? '🗝 Master Key · ' : '📖 '}${s.w.length} letters${view() === 'clue' || s.m ? ': ' + clueHtml(s.clue) : ': ' + s.w}</span>`;
    return '';
  }
  // v13a (JM CD-132: 6.3.1.1.1): a word shorter or longer than this grid's hidden words gets a reminder of the lengths
  function lenRange() {
    const [a, b] = lensOf(), ls = R.words.map(x => x.w.length);
    return [Math.min(a, ...ls), Math.max(b, ...ls)];
  }
  function lenNudge(s) {
    const [a, b] = lenRange(), L = s.length;
    if (L >= a && L <= b) return false;
    const narrow = $('#hkMsg').clientWidth < 200; // v13b: Solo on a phone leaves the strip narrow: the same reminder, shorter
    nudge(narrow ? `${L < a ? 'Too short' : 'Too long'} (${L}): ${rangeTxt(a, b)} letters here` : `${L < a ? 'Too short' : 'Too long'} (${L} letters): the hidden words here are ${rangeTxt(a, b)} letters`, 2600);
    return true;
  }
  function nudge(t, ms) { msg(t, 'bad', ms || 1600); snd('bounce'); const m = $('#hkMsg'); m.classList.remove('shake'); void m.offsetWidth; m.classList.add('shake'); }
  function flashCells(cells, cls) { cells.forEach(i => { const b = lets[i]; if (b) { b.classList.remove(cls); void b.offsetWidth; b.classList.add(cls); } }); }
  function submit() {
    const path = trace.slice(); trace = []; tapStart = -1; typed = ''; paintSel();
    if (path.length < 2) { msg(''); return; }
    const s = path.map(i => R.grid[i]).join(''), r = rev(s);
    const x = R.words.find(o => o.w === s || o.w === r);
    if (!x && lenNudge(s)) return;
    if (!x) { nudge(`${s}: not a hidden word`); return; }
    if (x.by) { msg(`${x.w}: already found${x.by === 'bot' ? ' by ' + esc(botFirst()) : ''}`, 'dup', 1500); snd('draw'); flashCells(path, 'dup'); return; }
    x.cells = s === x.w ? path : path.slice().reverse(); // the band where you found it, read the right way
    claim(x, 'me');
  }
  function claim(x, who) {
    x.by = who; x.t = Math.round(R.el / 100) / 10;
    if (who === 'me' && M.mode === 'duel' && M.list === 'clue' && view() === 'word' && !x.m) x.half = true; // v13c (CD-136: 2.4)
    const i = R.words.indexOf(x);
    if (R.hint === i) { R.hint = -1; R.hintK = 0; }
    if (R.sel === i) R.sel = -1;
    const p = ptsOf(x);
    if (who === 'me') {
      msg(`${x.m ? '🗝 MASTER KEY! ' : ''}${x.w} +${p}${x.half ? ' (half: words shown)' : ''}`, 'good', 1600); snd('word'); flashCells(x.cells, 'ok');
      const pl = $('#hkMePlus'); pl.textContent = '+' + p; pl.classList.remove('go'); void pl.offsetWidth; pl.classList.add('go');
    } else {
      msg(`${botAv()} ${esc(botFirst())} found ${x.m ? 'the 🗝 Master Key: ' : ''}${x.w} (+${p})`, 'dup', 1800); snd('oppword'); flashCells(x.cells, 'botf');
      const pl = $('#hkBotPlus'); pl.textContent = '+' + p; pl.classList.remove('go'); void pl.offsetWidth; pl.classList.add('go');
    }
    paintBands(); paintHint(); paintScores(); paintKeys(); paintHintBtn(); save();
    if (listWords().every(o => o.by)) setTimeout(() => endRound(true), 700);
  }
  // typing (computers): Clues mode only, the answer to a clue
  function paintTyped() {
    if (!typed) { msg(''); return; }
    $('#hkMsg').innerHTML = typed.split('').map(c => `<span class="kc-wl">${c}</span>`).join('') + `<span class="kc-wp">${typed.length}</span>`;
  }
  function submitTyped() {
    const t = typed; typed = ''; if (!t) return;
    // the highest-scoring hidden word those letters spell (the Master Key ×3 before a list word)
    const hits = R.words.filter(o => o.w === t).sort((a, b) => ptsOf(b) - ptsOf(a));
    const x = hits.find(o => !o.by) || hits[0];
    if (!x && lenNudge(t)) return;
    if (!x) { nudge(`${t}: not a hidden word`); return; }
    if (x.by) { msg(`${x.w}: already found${x.by === 'bot' ? ' by ' + esc(botFirst()) : ''}`, 'dup', 1500); snd('draw'); return; }
    claim(x, 'me');
  }
  let enterT = 0, wordTypeT = 0;
  document.addEventListener('keydown', e => { // on the results, Enter twice = ▶ Next round (or 🆕 New Game after the last round)
    if (e.key !== 'Enter' || !screenOn() || $('#hkRes').hidden || modalOpen() || e.repeat) return;
    if (e.target && e.target.closest && e.target.closest('input, select, textarea')) return;
    e.preventDefault();
    if (Date.now() - enterT < 1500) { enterT = 0; $('#hkNext').click(); return; }
    enterT = Date.now();
    if (UI.toast) UI.toast(`Press Enter again for ${M && M.done ? 'a New Game' : 'the next round'}`, '', 1500);
  });
  document.addEventListener('keydown', e => {
    if (!playOn() || !R || R.over || modalOpen() || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target && e.target.closest && e.target.closest('input, select, textarea')) return;
    if (e.key === ' ') { e.preventDefault(); setPause(!R.paused); return; }
    if (R.paused) return;
    if (/^[a-z]$/i.test(e.key)) {
      e.preventDefault();
      if (view() !== 'clue') { if (Date.now() - wordTypeT > 4000) { wordTypeT = Date.now(); msg('Words list shown: drag across a word', 'dup', 2600); } return; }
      if (trace.length) { trace = []; tapStart = -1; paintSel(); }
      typed += e.key.toUpperCase(); snd('key'); paintTyped();
    }
    else if (e.key === 'Backspace') { e.preventDefault(); typed = typed.slice(0, -1); paintTyped(); }
    else if (e.key === 'Escape') { clearSel(); msg(''); }
    else if (e.key === 'Enter') { e.preventDefault(); if (typed) submitTyped(); else if (trace.length >= 2) submit(); }
  });

  // ---------- 💡 Hint / Next ----------
  const hintCap = () => M.mode === 'duel' ? HINT_CAP_DUEL : M.sCap === '3' ? 3 : Infinity;
  const hintFree = () => M.mode === 'solo' && M.sHint === 'free';
  const nextOn = () => { const x = R && R.words[R.hint]; return !!(x && !x.by && (R.hintK || 1) < x.w.length - 1); };
  function paintHintBtn() {
    const left = hintCap() - R.hints, b = $('#hkHint'), nx = nextOn();
    $('#hkHintNm').textContent = nx ? 'Next' : 'Hint';
    $('#hkHintCp').textContent = nx ? (hintFree() ? 'next letter · free' : '🪙1 · next letter')
      : hintFree() ? (left === Infinity ? 'free' : `free · ${left} left`) : `🪙1/letter${left === Infinity ? '' : ` · ${left} left`}`;
    b.title = nx ? 'Next: stripe the next letter of your hinted word' : 'Hint: stripe the first letter of a word (the clue you picked, if any)';
    b.disabled = (left <= 0 && !nx) || R.over;
  }
  function pickHint() {
    const s = R.words[R.sel];
    if (s && !s.by) return R.sel;
    const open = R.words.map((x, i) => i).filter(i => !R.words[i].by && !R.words[i].m);
    return open.length ? open[Math.floor(Math.random() * open.length)] : -1;
  }
  let hintArm = -1;
  $('#hkHint').addEventListener('click', () => {
    if (!canPlay()) return;
    const b = $('#hkHint');
    if (nextOn()) {
      if (hintFree()) { giveNext(0); return; }
      if (!b.classList.contains('armed')) {
        if (UI.coins && UI.coins.bal < 1) { UI.coins.spend(1, `${NM.hidden} Next letter`); return; }
        UI.armTap(b, 1); msg('💡 Stripe the next letter of your hinted word: tap again to buy (🪙1)', '', 2600); return;
      }
      UI.armTap(b, 0);
      if (UI.coins && !UI.coins.spend(1, `${NM.hidden} Next letter`)) return;
      giveNext(1); return;
    }
    if (R.hints >= hintCap()) { msg(`No Hints left this round (${hintCap()} per round)`, 'dup', 2000); return; }
    if (!b.classList.contains('armed')) {
      hintArm = pickHint();
      if (hintArm < 0) { msg('No words left to hint', 'dup', 2000); return; }
      const x = R.words[hintArm];
      if (hintFree()) { giveHint(hintArm, 0); return; }
      if (UI.coins && UI.coins.bal < x.w.length) { UI.coins.spend(x.w.length, `${NM.hidden} Hint`); return; }
      UI.armTap(b, x.w.length);
      msg(`💡 Stripe the first letter of ${R.sel === hintArm ? 'your clue' : 'a'} ${x.w.length}-letter word: tap again to buy (🪙${x.w.length})`, '', 2600);
      return;
    }
    UI.armTap(b, 0);
    const x = R.words[hintArm];
    if (!x || x.by) return;
    if (UI.coins && !UI.coins.spend(x.w.length, `${NM.hidden} Hint (${x.w.length} letters)`)) return;
    giveHint(hintArm, x.w.length);
  });
  function giveHint(i, price) {
    R.hints++; R.hintCoins += price; M.coins -= price;
    R.hint = i; R.hintK = 1; R.sel = i; R.hinted[R.words[i].w] = 1; // a 💡 mark on every word a Hint helped
    paintHint(); paintKeys(); msg(''); paintHintBtn(); save();
  }
  function giveNext(price) {
    R.hintK = (R.hintK || 1) + 1; R.hintCoins += price; M.coins -= price;
    paintHint(); snd('key'); msg(''); paintHintBtn(); save();
  }
  $('#hkDone').addEventListener('click', () => { if (R && !R.over && M.mode === 'solo') endRound(false); });

  // ---------- ⏸ Pause ----------
  function setPause(on) {
    if (!R || R.over) return;
    R.paused = !!on;
    if (on) { clearSel(); document.querySelectorAll('#hiddenkeys .btn.armed').forEach(b => UI.armTap(b, 0)); }
    paintPause(); msg('');
  }
  function paintPause() {
    const p = !!(R && R.paused);
    tray.classList.toggle('blur', p); $('#hkPz').hidden = !p;
    const b = $('#hkPause');
    b.textContent = p ? '▶️' : '⏸️';
    b.title = p ? 'Resume' : 'Pause: the clock stops and the letters are hidden'; b.setAttribute('aria-label', b.title);
  }
  $('#hkPause').addEventListener('click', () => setPause(!(R && R.paused)));
  $('#hkClock').addEventListener('click', () => setPause(!(R && R.paused)));
  $('#hkPz').addEventListener('click', () => setPause(false));

  // ---------- the clock; the Bot's finds ----------
  let lastT = performance.now(), lastSec = -1, flashSec = 0;
  function tick(dt) {
    if (!R || !M) return;
    if (dt && playOn() && !R.over && !R.paused && !modalOpen() && !document.hidden) R.el += dt;
    const sec = Math.floor(R.el / 1000), T = M.timer, rem = T ? Math.max(0, T - sec) : sec;
    if (!playOn()) return;
    $('#hkClk').textContent = fmt(rem);
    const c = $('#hkClock'); c.classList.toggle('y', !!T && rem <= 10 && rem > 5 && !R.over); c.classList.toggle('r', !!T && rem <= 5 && !R.over);
    if (M.mode === 'duel' && !R.over && !R.paused && R.botNext && R.el / 1000 >= R.botNext) { R.botNext = R.el / 1000 + botGap(); botFind(); }
    if (T && !R.over && rem !== lastSec && rem > 0 && rem <= 10 && dt && !R.paused) snd(rem <= 5 ? 'tock' : 'tick');
    setFlash(T && !R.over && !R.paused ? rem : 0);
    if (rem !== lastSec) paintMeter(); // v13c: the speed heartbeat, once a second
    lastSec = rem;
    if (T && rem <= 0 && !R.over) { setFlash(0); endRound(false); }
  }
  function setFlash(s) {
    if (s === flashSec) return;
    flashSec = s;
    tray.classList.remove('tf-y', 'tf-r', 'tf-a', 'tf-b');
    if (s >= 1 && s <= 10) { void tray.offsetWidth; tray.classList.add(s > 5 ? 'tf-y' : 'tf-r', s % 2 ? 'tf-a' : 'tf-b'); }
  }
  setInterval(() => { const now = performance.now(); tick(Math.min(1000, now - lastT)); lastT = now; }, 250);
  let saveT = 0;
  setInterval(() => { if (R && !R.over && playOn() && Date.now() - saveT > 4000) { saveT = Date.now(); save(); } }, 1000);
  document.addEventListener('visibilitychange', () => { if (document.hidden && unfinished()) save(); });

  // ---------- the end of a round ----------
  function endRound(cleared) {
    if (!R || R.over) return;
    R.over = true; R.paused = false; clearSel(); setFlash(0);
    document.querySelectorAll('#hiddenkeys .btn.armed').forEach(b => UI.armTap(b, 0));
    const duel = M.mode === 'duel', T = M.timer, sec = Math.floor(R.el / 1000), rem = T ? Math.max(0, T - sec) : 0;
    R.meTot = myPts(); R.botTot = duel ? botPts() : 0;
    const mine = R.words.filter(x => x.by === 'me'), mk = masterW();
    R.cleared = cleared && listWords().every(x => x.by);
    M.me += R.meTot; M.bot += R.botTot;
    M.list2.push({ me: R.meTot, bot: R.botTot, words: mine.length, botWords: R.words.filter(x => x.by === 'bot').length, all: listWords().length, mk: mk ? mk.by || '' : '' });
    R.earn = 0; R.speed = 0;
    // speed coins (the suite standard): a round won before the clock runs out pays 1 per second left, ≤ 10 per minute of the clock
    const speedCap = Math.floor(SPEED_PER_MIN * T / 60);
    if (duel) {
      R.earn = R.meTot > R.botTot ? WIN : R.meTot === R.botTot ? DRAW : 0;
      if (R.earn && UI.coins) UI.coins.add(R.earn, `${NM.hidden}: round ${R.earn === WIN ? 'won' : 'drawn'}`);
      if (T && R.cleared && rem > 0 && R.meTot > R.botTot) R.speed = Math.min(rem, speedCap);
    }
    if (M.no >= M.rounds) M.done = true;
    R.matchEarn = 0;
    if (duel && M.done && M.me > M.bot) { R.matchEarn = MATCH; if (UI.coins) UI.coins.add(MATCH, `${NM.hidden}: match won`); }
    // stats
    st.rounds++; st.words += mine.length; if (mk && mk.by === 'me') st.keys++;
    if (duel && M.done) { st.matches++; if (M.me > M.bot) st.won++; else if (M.me === M.bot) st.drawn++; }
    let newBest = false;
    // v13c (CD-136 add. 1): this round's speed (all Solo rounds show it; Untimed rounds keep the bests)
    const sp = speedNow(); R.wpm = sp.wpm; R.lps = sp.lps; R.newWpm = R.newLps = false;
    if (!duel) {
      st.soloN++; if (!st.sb) st.sb = {}; if (!st.sr) st.sr = {};
      const L = bestList();
      if (!T) { // Untimed: the fastest clear, and the best wpm / lps once the round has run 1 minute and found 5 words
        const k = sbKey(M.n, L), old = st.sb[k];
        if (R.cleared && (old == null || sec < old)) { st.sb[k] = sec; newBest = true; }
        R.rateOk = R.el >= RATE_MIN_MS && mine.length >= RATE_MIN_W;
        if (R.rateOk) {
          const o = Object.assign({}, st.sr[k]), w = Math.round(R.wpm * 10) / 10, l = Math.round(R.lps * 100) / 100;
          if (o.wpm == null || w > o.wpm) { o.wpm = w; R.newWpm = true; }
          if (o.lps == null || l > o.lps) { o.lps = l; R.newLps = true; }
          st.sr[k] = o;
        }
      } else { // Timed: the best score for this grid size, timer and Key list
        const k = sbKey(M.n, L, T), old = st.sb[k];
        if (R.meTot > 0 && (old == null || R.meTot > old)) { st.sb[k] = R.meTot; newBest = true; }
      }
      newBest = newBest || R.newWpm || R.newLps;
      if (M.sHint === 'paid') {
        if (newBest) { R.earn = SOLO_BEST; if (UI.coins) UI.coins.add(SOLO_BEST, `${NM.hidden}: Solo new best`); }
        if (T && R.cleared && rem > 0) R.speed = Math.min(rem, speedCap);
      }
    }
    if (R.speed && UI.coins) UI.coins.add(R.speed, `${NM.hidden}: speed (${rem} s left)`);
    R.newBest = newBest; R.time = sec;
    M.coins += R.earn + R.matchEarn + R.speed;
    saveSt(); history(); save(); UI.lobby();
    const won = duel ? (M.done ? M.me > M.bot : R.meTot > R.botTot) : R.cleared;
    if (duel && !M.done) snd('word');
    else snd(won ? 'win' : duel && M.me === M.bot ? 'draw' : 'lose');
    if (won && M.done && !night() && !reduceMotion()) confetti();
    resSel = -1;
    setTimeout(showRes, 450);
  }
  function confetti() {
    const c = document.createElement('div'); c.className = 'kr-confetti';
    c.innerHTML = Array.from({ length: 40 }, (_, k) => `<i style="left:${Math.random() * 100}%;background:${['#f5b300', '#2c6bd8', '#1e9e4a', '#e0457b', '#4fc3f7'][k % 5]};animation-delay:${(Math.random() * 0.5).toFixed(2)}s"></i>`).join('');
    document.body.appendChild(c); setTimeout(() => c.remove(), 2600);
  }
  const midMatch = () => M.mode === 'duel' && !M.done && M.rounds > 1;
  function leadHtml() {
    const a = M.me, b = M.bot, s = a >= b ? `${UI.fmtN(a)} – ${UI.fmtN(b)}` : `${UI.fmtN(b)} – ${UI.fmtN(a)}`;
    const t = a > b ? 'You lead' : a < b ? `${esc(botNm())} leads` : 'Tied';
    return `<span class="kc-lead" role="status"><span class="r">Round ${M.no} of ${M.rounds}</span><b>${t}: ${s}</b></span>`;
  }
  function winHtml() {
    if (midMatch()) return leadHtml();
    if (M.mode !== 'solo') return UI.winLine(winObj());
    const sc = R.cleared && !M.timer ? fmt(R.time) : `${UI.fmtN(R.meTot)} pts`; // v13c: Timed shows the points (its best)
    const big = R.newBest ? 'NEW BEST!' : R.cleared ? 'ALL FOUND!' : 'ROUND OVER';
    return `<span class="ob-h" role="status" aria-label="${big}, ${sc}"><span class="ob-line" aria-hidden="true"><span class="ob-av">${UI.meWin().av || ''}</span><b class="ob-v">${big}</b><span class="ob-sym">${R.newBest ? '🏆' : R.cleared ? '🗝' : '🎯'}</span><span class="ob-sc">${sc}</span></span></span>`;
  }
  function winObj() {
    const a = M.done && M.rounds > 1 ? [M.me, M.bot] : [R.meTot, R.botTot];
    if (a[0] === a[1]) return { draw: true, score: `${UI.fmtN(a[0])}–${UI.fmtN(a[1])}` };
    return a[0] > a[1] ? Object.assign(UI.meWin(), { score: `${UI.fmtN(a[0])}–${UI.fmtN(a[1])}` }) : { av: botAv(), who: esc(botNm()), score: `${UI.fmtN(a[1])}–${UI.fmtN(a[0])}` };
  }
  function history() {
    if (!UI.history) return;
    const duel = M.mode === 'duel', mk = masterW();
    const rows = M.list2.map((r, i) => `<tr><td>Round ${i + 1}</td><td>${UI.fmtN(r.me)}</td>${duel ? `<td>${UI.fmtN(r.bot)}</td>` : ''}<td>${r.words} of ${r.all}${r.mk === 'me' ? ' + 🗝' : ''}</td></tr>`).join('');
    const body = `<div class="${midMatch() ? 'kc-hist-over' : 'overbar kc-hist-over'}">${winHtml()}</div>
      <table class="score-table kc-hist-t"><tr><th></th><th>You</th>${duel ? `<th>${esc(botFirst())}</th>` : ''}<th>Your words</th></tr>${rows}
      ${duel && M.rounds > 1 ? `<tr class="total"><td>Match</td><td>${UI.fmtN(M.me)}</td><td>${UI.fmtN(M.bot)}</td><td></td></tr>` : ''}</table>
      <p class="help-note">Last round, your words: ${R.words.filter(x => x.by === 'me').map(x => `<b>${hd(x) ? '💡' : ''}${x.m ? '🗝' : ''}${x.w}</b> ${ptsOf(x)}`).join(' · ') || 'none'}${mk ? ` · Master Key: <b>${mk.w}</b> (${UI.clueIcons(esc(mk.clue))})` : ''}</p>`;
    const entry = {
      g: 'hidden', win: duel ? (M.done ? M.me > M.bot : M.me >= M.bot) : !!(R.cleared || R.newBest), // v13c: a Solo new best counts as a win
      title: `${NM.hidden} · ${duel ? (M.done ? (M.me > M.bot ? 'Match won' : M.me === M.bot ? 'Match drawn' : 'Match lost') : `Round ${M.no} of ${M.rounds}`) : 'Solo'} (${M.n}×${M.n})`,
      sub: [duel ? `vs ${botNm()} · Challenge Level ${M.lv}` : `Solo · Challenge Level ${M.lv}`, `${M.n}×${M.n}`, listName(M.list), timerName(M.timer)].concat(duel ? [plural(M.rounds, 'round')] : []).join(' · '),
      score: duel ? `${UI.fmtN(M.me)}–${UI.fmtN(M.bot)}` : (R.cleared && !M.timer ? `Cleared in ${fmt(R.time)}` : `${UI.fmtN(R.meTot)} pts`) + (!M.timer && R.wpm != null ? ` · ${R.wpm.toFixed(1)} wpm` : ''), coins: M.coins, html: body,
      pts: duel ? M.me : R.meTot, res: duel && M.done && M.me === M.bot ? 'tie' : undefined // v13c: for History's Sort and Filters
    };
    if (!M.histT || !UI.history.put) M.histT = UI.history.add(entry) || 0;
    else UI.history.put(M.histT, entry);
  }

  // ---------- results screen ----------
  let resSel = -1;
  function showRes() {
    if (!R || !R.over) return;
    UI.showScreen('hiddenkeys'); part('hkRes');
    SEC.classList.toggle('kc-wide', innerWidth >= 700 && innerWidth > innerHeight);
    const duel = M.mode === 'duel', L = listWords(), mine = R.words.filter(x => x.by === 'me').length, mk = masterW();
    setHead(duel ? `Round ${M.no} of ${M.rounds} · results` : `Solo · ${M.n}×${M.n} · results`);
    $('#hkWin').classList.toggle('overbar', !midMatch());
    $('#hkWin').innerHTML = winHtml();
    $('#hkScore').hidden = !duel; if (duel) $('#hkScore').innerHTML = scoreCard();
    const coinsTxt = [R.earn ? (duel ? `Round ${R.earn === WIN ? 'win' : 'draw'} +${R.earn}` : `New best +${R.earn}`) : duel ? 'No round coins' : '', R.speed ? `Speed +${R.speed}` : '', R.matchEarn ? `Match win +${R.matchEarn}` : '', R.hintCoins ? `Hints −${R.hintCoins}` : ''].filter(Boolean).join(' · ')
      || (M.sHint === 'paid' ? 'No coins this round' : 'Solo: no coins');
    $('#hkSum').innerHTML = `<span class="kc-pill"><span class="e">🙂</span> ${UI.fmtN(R.words.filter(x => x.by === 'me' && !x.m).length)} of ${UI.fmtN(L.length)} words</span>`
      + (duel ? `<span class="kc-pill"><span class="e">${botAv()}</span> ${plural(R.words.filter(x => x.by === 'bot' && !x.m).length, 'word')}</span>` : `<span class="kc-pill"><span class="e">⏱</span> ${R.cleared ? 'Cleared in ' + fmt(R.time) : 'Not cleared'}</span><span class="kc-pill${R.newBest && !(R.newWpm || R.newLps) ? ' mk' : ''}"><span class="e">🎯</span> ${sbLab(M.n, bestList(), M.timer)}: ${sbVal(M.n, bestList(), M.timer)}${M.timer ? ' pts' : ''}</span>`
        // v13c (CD-136 add. 1): your speed this round, and (Untimed) your best speed for this grid size and Key list
        + `<span class="kc-pill" title="Words per minute · letters per second"><span class="e">⚡</span> ${rateTxt(R.wpm, R.lps)}</span>`
        + (M.timer ? '' : `<span class="kc-pill${R.newWpm || R.newLps ? ' mk' : ''}" title="A round counts toward your best speed after 1 minute and ${RATE_MIN_W} words"><span class="e">🏆</span> Best speed: ${rateTxt(srGet(M.n, bestList()).wpm, srGet(M.n, bestList()).lps)}${R.rateOk ? '' : ` (counts after 1 min + ${RATE_MIN_W} words)`}</span>`))
      + `<span class="kc-pill mk"><span class="e">🗝</span> Master Key: ${mk && mk.by === 'me' ? 'yours! ×3' : mk && mk.by === 'bot' ? esc(botFirst()) + "'s" : 'not found'}</span>`
      + `<span class="kc-pill">🪙 ${coinsTxt}</span>`;
    $('#hkNext').textContent = M.done ? '🆕 New Game' : '▶ Next round';
    $('#hkRBoardW').innerHTML = boardHtml('hkRBoard', true);
    void mine;
    requestAnimationFrame(() => UI.fitOver($('#hkWin')));
    paintRes();
  }
  function scoreCard() {
    const multi = M.rounds > 1, me = multi ? M.me : R.meTot, bot = multi ? M.bot : R.botTot;
    const big = `<div class="kc-big"><div class="me"><span>You</span><b>${UI.fmtN(me)}</b></div><span class="lab">${multi ? (M.done ? 'Final game total' : 'Game total') : 'Final score'}</span><div class="them"><b>${UI.fmtN(bot)}</b><span>${esc(botFirst())}</span></div></div>`;
    if (!multi) return big;
    let a = 0, b = 0, rowsH = '';
    for (let k = 0; k < M.rounds; k++) {
      const r = M.list2[k], g = (x, y) => x > 0 && x >= y ? ' class="rb"' : '';
      if (r) { a += r.me; b += r.bot; rowsH += `<tr class="${k === M.list2.length - 1 ? 'now' : ''}"><td>Round ${k + 1}</td><td${g(r.me, r.bot)}>${UI.fmtN(r.me)}</td><td${g(r.bot, r.me)}>${UI.fmtN(r.bot)}</td><td>${UI.fmtN(a)}–${UI.fmtN(b)}</td></tr>`; }
      else rowsH += `<tr class="todo"><td>Round ${k + 1}</td><td>–</td><td>–</td><td></td></tr>`;
    }
    return big + `<table class="score-table kc-rtab"><tr><th>Round</th><th>You</th><th>${esc(botFirst())}</th><th>Running</th></tr>${rowsH}
      <tr class="total"><td>Game total</td><td${M.me > 0 && M.me >= M.bot ? ' class="rb"' : ''}>${UI.fmtN(M.me)}</td><td${M.bot > 0 && M.bot >= M.me ? ' class="rb"' : ''}>${UI.fmtN(M.bot)}</td><td></td></tr></table>`;
  }
  // the results board: your bands blue, the Bot's red, missed words dashed; the picked word stands out
  function paintRes() {
    const rb = $('#hkRBoard'); if (!rb) return;
    const g = rb.querySelector('.hk-bands .done');
    g.innerHTML = R.words.map((x, i) => bandLine(x.cells, (x.by === 'me' ? 'me' : x.by === 'bot' ? 'bot' : 'miss') + (x.m ? ' mk' : '') + (i === resSel ? ' pick' : ''))).join('');
    rb.classList.toggle('picking', resSel >= 0);
    const on = {}; if (resSel >= 0) R.words[resSel].cells.forEach(i => { on[i] = 1; });
    rb.querySelectorAll('.hk-lets b').forEach((b, i) => { b.className = on[i] ? 'on' : ''; });
    $('#hkRList').innerHTML = keyOrder().map(i => keyRow(i, true)).join('');
    const x = R.words[resSel];
    $('#hkRDet').innerHTML = x ? `<b>${hd(x) ? '💡' : ''}${x.m ? '🗝 ' : ''}${x.w}</b> · ${x.by === 'me' ? `You found it${x.t ? ' at ' + fmt(Math.floor(x.t)) : ''}` : x.by === 'bot' ? `${esc(botNm())} found it${x.t ? ' at ' + fmt(Math.floor(x.t)) : ''}` : 'Nobody found it'} · ${ptsOf(x)} pts${x.m ? ' (×3)' : ''}${x.half ? ' (half: found while the words were shown)' : ''}<br><span class="hk-dcl">📖 ${clueHtml(x.clue)}</span>`
      : '<span class="kc-empty">Tap a word to see where it was hidden.</span>';
  }
  $('#hkRList').addEventListener('click', e => { const b = e.target.closest('.hk-key'); if (!b) return; const i = +b.dataset.k; resSel = resSel === i ? -1 : i; paintRes(); });
  $('#hkNext').addEventListener('click', () => { if (M && !M.done) { newRound(); save(); showPlay(); } else start(); });
  $('#hkResLobby').addEventListener('click', goLobby);
  $('#hkResSetup').addEventListener('click', showSetup);

  // ---------- layout ----------
  function fit() {
    if (!screenOn()) return;
    const W = innerWidth, H = innerHeight, wide = W >= 700 && W > H;
    SEC.classList.toggle('kc-wide', wide);
    if (!$('#hkPlay').hidden && M) {
      const top = $('#hkPlay').getBoundingClientRect().top, bar = $('#hkBar').offsetHeight;
      let size;
      if (wide) size = Math.min(H - top - bar - 64, (Math.min(W, 1400) - 60) * 0.56); // room for the tray's edge and the key tips
      else size = Math.min(W - 20, H - top - bar - Math.max(52, $('#hkBtns').offsetHeight) - 190 - 34, 640); // room for about 4 clues below
      size = Math.max(220, Math.floor(size));
      tray.style.setProperty('--ts', size + 'px'); tray.parentNode.style.setProperty('--ts', size + 'px');
    }
    if (!$('#hkRes').hidden && R && R.over) UI.fitOver($('#hkWin'));
  }
  window.addEventListener('resize', fit);

  // ---------- header and Lobby ----------
  $('#hkMenu').addEventListener('click', goLobby);
  $('#hkNewG').addEventListener('click', newGame);
  $('#hkSet').addEventListener('click', () => { if (R && !R.over) R.paused = false; save(); showSetup(); });
  $('#hkHelp').addEventListener('click', help);
  $('#hkCard').addEventListener('click', e => { if (!e.target.closest('button')) showSetup(); });
  $('#hkResumeBtn').addEventListener('click', () => { if (unfinished()) showPlay(); });
  $('#hkNewBtn').addEventListener('click', newGame);
  $('#hkSetupBtn').addEventListener('click', showSetup);

  // ---------- How To Play ----------
  function help() {
    const sec = UI.helpSec;
    openModal(`<h2 class="mk-title">How To Play ${NM.hidden} <span class="chip">${UI.APP_VER}</span></h2>
      <p>Words from our Lexicon are hidden in a grid of letters. Read their <b>clues</b>, then find them before the clock (and, in a <b>Duel</b>, the Bot) does.</p>
      <p class="help-note">Tap a heading to open it.</p>
      ${sec('The Basics', `
        <li>Open ${NM.hidden} from its card in the ${NM.suite} Lobby: <b>🆕 New Game</b> starts at once with your last settings, <b>⚙ Setup</b> (or a tap on the card) shows the settings first, and <b>▶ Resume</b> appears while a match is unfinished.</li>
        <li>Each word sits in a <b>straight line</b> of touching letters: across, down or diagonally (Setup's <b>Word directions</b> says which ways; on <b>Hard</b> they can also run backwards). Words may cross and share a letter.</li>
        <li><b>Word length:</b> the hidden words are at least <b>3 letters</b>; the longest is set by the grid size and Challenge Level (Auto: 6 letters on 8×8, 7 from level 5; 8 letters on bigger grids, 7 at levels 1–2). <b>Word count:</b> at Challenge Level 3 each grid hides <b>7–9</b>, <b>10–12</b> or <b>13–15</b> list words; levels 1–2 hide one word fewer, and from level 5 there is one more every two levels (level 10: three more). Setup's <b>Word count</b> and <b>Word length</b> can change both ends. The Key list's heading shows this grid's lengths, and each clue shows its own length.</li>
        <li>${UI.clueIcons('⏪ ')}<b>Reverse clue</b> (Challenge Levels 1–3): a clue that starts with the orange <b>rewind</b> icon is the answer <b>spelled backward</b>, so ${UI.clueIcons('⏪ ')}POT means TOP.</li>
        <li>The <b>Key list</b> under the grid shows each word's <b>clue</b> and its number of letters (or, with <b>Words</b>, the words themselves). A found word fills in and gets a band on the grid: <b style="color:#2c6bd8">blue</b> = yours, <b style="color:#e01e1e">red</b> = the Bot's.</li>`)}
      ${sec('Find a Word', `
        <li><b>Swipe</b> (touch) or <b>drag</b> (mouse) from the first letter of a word to its last, then let go. The band snaps to the nearest straight line. Either end can come first.</li>
        <li>Or <b>tap</b> the first letter, then the last one. A tap on the same letter again cancels.</li>
        <li>On a computer, in <b>Clues</b> mode, you can also <b>type the answer</b> to a clue and press <b>Enter</b>: the app finds it in the grid (if the letters spell more than one hidden word, it takes the highest-scoring one, the 🗝 Master Key first). <b>⌫</b> takes a letter back, <b>Esc</b> clears, <b>Space</b> pauses. In <b>Words</b> mode the list already shows the words, so you drag.</li>
        <li>A swipe, drag or typed word that is <b>shorter or longer</b> than this grid's hidden words gets a red reminder of the lengths, e.g. "Too short (2 letters): the hidden words here are 3–8 letters".</li>
        <li><b>📖 Clues / 🔤 Words</b> in the Key list's heading switches the list between the clues and the words at any time; it keeps for the rest of the match (a new game starts with your Setup choice). The Bot's pace stays as set in Setup.</li>
        <li>In a game that started with <b>Clues</b>, switching to <b>Words</b> first shows a <b>warning</b> you must agree to (the clock waits). In a <b>Duel</b>, each word you find while the words show scores <b>half points</b> (rounded up, marked ½); the 🗝 Master Key stays a clue and keeps its ×3. In <b>Solo</b>, a round in which the words were shown counts toward your <b>Words</b> bests.</li>
        <li>Tap a clue in the Key list to pick it: it shows big above the grid, and 💡 Hint helps with that word.</li>
        <li>The strip above the grid shows your letters, then what happened: <b>green</b> = a new word and its points, <b>orange</b> = already found (or the Bot just found one), <b>red</b> = not a hidden word, <b>blue</b> = your clue or Hint.</li>`)}
      ${sec('The 🗝 Master Key', `
        <li>One extra word is hidden in every grid: the <b>Master Key</b>. It is never written in the list: only its <b>gold clue</b> (also in Words mode).</li>
        <li>It scores <b>×3</b>. But it can only be found while list words remain: once the last list word is claimed, the round ends and an unfound Master Key is lost.</li>`)}
      ${sec('Duel and Solo', `
        <li><b>⚔ Duel</b>: a Bot rival hunts the same grid at the same time. Each Challenge Level has its own rival (Benny Bear at 1 … Professor Hoot at 10, as in every ${NM.suite} game), shown with its level in a red pill. Each word goes to <b>whoever finds it first</b>.</li>
        <li>A round ends when every list word has been found, or when the clock runs out. A match is <b>1 to 5 rounds</b> (3 is the standard), each on a fresh grid; the higher <b>total</b> wins. Tap <b>▶ Next round</b> (or press <b>Enter twice</b>).</li>
        <li><b>Challenge Level</b> (1–10, default 3) sets how fast the Bot finds words, and how hard the words and clues are (in Solo too): everyday words at 1–2, a wider vocabulary from 6, and from 6 up the clues are often indirect (a link, not a definition). The Bot is slower with Clues, on bigger grids and with harder directions, as you are.</li>
        <li><b>🎯 Solo</b>: no Bot. Untimed (the clock counts up) or timed; <b>🏁 Done</b> ends the round. <b>Untimed</b>: beat your <b>fastest clear</b> (every list word found) and your best <b>speed</b>: <b>wpm</b> (words per minute) and <b>lps</b> (letters per second). Your running speed shows live under your score (from 10 seconds in), and a round counts toward the speed bests once it has run <b>1 minute</b> and found <b>5 words</b>. <b>Timed</b>: beat your best <b>score</b> for each grid size and timer ("Best 10×10 in 3m"). Every best is kept for each grid size and Key list.</li>`)}
      ${sec('Scoring', `
        <li>Every word scores <b>1 point per letter</b>; the 🗝 Master Key scores <b>×3</b>. In a Duel that started with Clues, a word found while the words show scores half (see Find a Word).</li>`)}
      ${sec('The Buttons', `
        <li><b>💡 Hint</b> stripes the <b>first letter</b> of a word (the clue you picked, or else any word still open): a signal, not a solve. It costs <b>🪙1 per letter</b> of that word (two taps: the first shows the price), at most <b>3 per round</b> in a Duel. In Solo, Hints are free or paid, 3 per round or no limit (Setup).</li>
        <li>While your hinted word is still unfound, the button reads <b>💡 Next</b>: each tap stripes its <b>next letter</b> (numbered 1, 2, 3…) for <b>🪙1</b>. It never shows the last letter, and it doesn't count toward the Hint limit.</li>
        <li>A word a Hint helped keeps a <b>💡 mark</b> in the list and the results.</li>
        <li><b>⏸ Pause</b> (or tap the clock) stops the clock (and the Bot) and hides the letters. Tap anywhere to resume play.</li>
        <li>In the last 10 seconds the grid flashes every second: <b>yellow</b> from 10 to 6, <b>red</b> from 5 to 1, with a tick each second.</li>`)}
      ${sec('Coins', `
        <li>In a Duel: a round won pays <b>🪙${WIN}</b>, a draw <b>🪙${DRAW}</b>, and a match won <b>🪙${MATCH}</b> more.</li>
        <li><b>Speed coins</b>: win a round by finding the last word before the clock runs out, and every second left pays <b>🪙1</b> (never more than ${SPEED_PER_MIN} per minute of the clock).</li>
        <li>Solo: with free Hints, no coins. With <b>Paid</b> Hints, any new best (a fastest clear, a speed best or a timed score) pays <b>🪙${SOLO_BEST}</b>, and a timed round cleared early pays speed coins.</li>`)}
      ${sec('Results', `
        <li>After rounds before the last: "<b>Round 1 of 3 · You lead: 48 – 31</b>". After the last round: the gold "<b>You WIN!</b>" row with the final game total.</li>
        <li>The score card shows the <b>game totals</b> big, then each round with the running total; the higher score of each round is <b style="color:#12a03c">green</b>.</li>
        <li>The grid shows every word: yours in blue, the Bot's in red, missed words dashed. Tap a word in the list to see where it was hidden, who found it and when, and its 📖 clue.</li>`)}
      ${sec('Setup', `
        <li><b>Play</b>: Duel or Solo. <b>Grid</b>: 8×8, 10×10 (standard) or 12×12; each button shows its word count. <b>Key list</b>: Clues or Words. <b>Timer</b>: 1, 2, 3 (standard), 5 or 8 min; Untimed in Solo. <b>Challenge Level</b> 1–10.</li>
        <li>Under <b>▸ More options</b>, first: <b>Word count</b>, min and max side by side (Auto follows the grid size and Challenge Level, as in The Basics, and shows its number; each round picks a number in your range), then <b>Word length</b>, min and max (min 3 letters standard; max Auto by grid size and Challenge Level; 12×12 also offers 11-letter words). A min set above the max moves the max along (and the other way round). Then <b>Word directions</b> (Easy → ↓, Standard → ↓ ↘ ↗, Hard: all 8 ways), Rounds per match, <b>Grid Colors</b> (Cream, Inked, Inked Blue, Steel, Sky, Navy &amp; gold, Onyx, Ruby), <b>Button Colors</b> (Steel, Sapphire, Navy &amp; gold, Ruby, Emerald, Onyx; the preview shows both) and, for Solo, Hints (free or paid, 3 per round or no limit).</li>
        <li>Every grid is made fresh from our Lexicon, so every hidden word has a clue.</li>`)}
      ${sec('Your Stats', `
        <li>Matches, the share won, words found, Master Keys found and your Solo bests (fastest clear, best speed, best timed scores) are kept on this device. Every match (and Solo round) also goes into <b>📜 Game History</b>, where you can sort and filter them.</li>`)}
      <div class="row"><button class="btn primary" data-a="close">OK</button></div>`);
    $('#sheet').onclick = e => { if (UI.helpClick && UI.helpClick(e)) return; if (e.target.closest('[data-a="close"]')) closeModal(); };
  }

  window.HiddenKeys = {
    setup: showSetup,
    newGame,
    help,
    lobby: () => ({
      played: st.matches, pct: st.matches ? Math.round(100 * st.won / st.matches) : 0, words: st.words, keys: st.keys,
      unf: unfinished() ? unfText() : '', last: lastLine(), fresh: !st.matches && !st.soloN
    }),
    _M: () => M, _R: () => R, _build: build // for checks only
  };
  if (UI.lobby) UI.lobby();
})();
