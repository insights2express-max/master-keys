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
  const DEF = { n: 6, lv: 3, timer: 0 };
  const ks = Object.assign({}, DEF, store.get('cd.kr.settings', {}));
  const saveKs = () => store.set('cd.kr.settings', ks);
  const blankStats = () => ({ played: 0, cleared: 0, streak: 0, best: 0, bonus: 0, fastest: {} });
  const st = Object.assign(blankStats(), store.get('cd.kr.stats', {}));
  const saveSt = () => store.set('cd.kr.stats', st);
  const TIMERS = [[0, 'Untimed'], [60, '1 min per Ring'], [120, '2 min per Ring'], [180, '3 min per Ring'], [300, '5 min per Ring']];
  const timerName = t => (TIMERS.find(x => x[0] === +t) || TIMERS[0])[1];
  const LV_NAMES = { 1: '1 · Gentle', 10: '10 · Master' };
  const N_DESC = { 3: 'A quick warm-up: 2 to 4 short words.', 4: '3 to 6 slots of 3–4 letters.', 5: '4 to 8 slots, up to 5 letters.', 6: '5 to 10 slots, up to 6 letters.', 7: '6 to 12 slots, up to 7 letters.', 8: '6 to 12 slots, up to 8 letters: the longest Rings.' };
  const N_DEMO = { 3: 'TEA', 4: 'LEAP', 5: 'PLATE', 6: 'GARDEN', 7: 'PAINTER', 8: 'KEYRINGS' };
  const lastLine = () => `${ks.n} letters · Level ${ks.lv} · ${timerName(ks.timer)}`;

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
  let LEX = null, LEXBY = null, EIGHT = null;
  function lex() {
    if (LEX) return LEX;
    LEX = []; LEXBY = {};
    for (const e of E.lexicon()) {
      const w = e.w;
      if (w.length < 3 || w.length > 7 || LEXBY[w] || !isWord(w)) continue;
      const x = { w, l: e.l || 1, e: e.e, h: e.h, wsk: e.wsk, cc: counts(w) };
      LEXBY[w] = x; LEX.push(x);
    }
    EIGHT = {};
    for (const line of String(window.VAULT_EIGHT || '').split('\n')) {
      const [w, l, c, ez, hd] = line.split('|');
      if (w && w.length === 8) EIGHT[w] = { w, l: +l || 1, c: (c || '').trim(), ez: (ez || '').trim(), hd: (hd || '').trim() };
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

  // ---------- dealing a Ring ----------
  // Challenge Level → the hardest Lexicon level allowed in the slots (Lexicon levels: 1 everyday … 5 obscure)
  const CAP = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5];
  const MIN = { 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 6 }, MAX = { 3: 4, 4: 6, 5: 8, 6: 10, 7: 12, 8: 12 };
  const seedsOf = n => String((D.seeds || {})[n] || '').split(' ').filter(Boolean).map(s => ({ w: s.slice(0, -1), t: +s.slice(-1) }));
  const shuffled = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function dealRing(n, lv) {
    lex();
    const cap = CAP[lv - 1] || 3, recent = new Set(store.get('cd.kr.recent', []));
    let pool = seedsOf(n).filter(s => s.t <= cap);
    if (!pool.length) pool = seedsOf(n);
    let fresh = pool.filter(s => !recent.has(s.w));
    if (!fresh.length) fresh = pool;
    // higher levels lean on seeds that need their level's words
    if (lv >= 4) { const hard = fresh.filter(s => s.t >= cap - 1); if (hard.length && Math.random() < 0.7) fresh = hard; }
    for (let tries = 0; tries < 80 && fresh.length; tries++) {
      const s = fresh[Math.floor(Math.random() * fresh.length)];
      const se = LEXBY[s.w];
      if (se && !inSk(se.wsk, lv)) continue;
      const sc = counts(s.w);
      const cands = LEX.filter(e => e.w !== s.w && e.w.length <= n && e.l <= cap && inSk(e.wsk, lv) && fits(e.cc, sc));
      if (cands.length + 1 < MIN[n]) continue;
      // keep up to MAX slots: a random mix that leans to longer words, and to rarer words at Challenge Levels 5–10
      const lean = lv >= 5 ? 0.22 : -0.22;
      const pick = cands.map(e => ({ e, k: Math.random() + lean * (e.l - 1) + 0.12 * (e.w.length - 3) }))
        .sort((a, b) => b.k - a.k).slice(0, MAX[n] - 1).map(x => x.e.w);
      const words = [s.w, ...pick].sort((a, b) => a.length - b.length || a.localeCompare(b));
      let letters;
      do { letters = shuffled([...s.w]); } while (n > 2 && letters.join('') === s.w);
      store.set('cd.kr.recent', [s.w, ...[...recent].filter(x => x !== s.w)].slice(0, 150));
      return { seed: s.w, words, clues: words.map(w => clueOf(w, lv)), letters };
    }
    return null;
  }

  // ---------- the Ring in play ----------
  let R = null;
  const SAVE_KEY = 'cd.kr.save';
  function newR(d) {
    const L = d.words.reduce((a, w) => a + w.length, 0);
    return {
      seed: d.seed, n: d.letters.length, lv: ks.lv, timer: +ks.timer, no: st.played + 1,
      words: d.words, clues: d.clues, L, v: 100 / L,
      tiles: d.letters.map((ch, i) => ({ ch, k: i, ang: -90 + i * 360 / d.letters.length })),
      found: new Set(), byDrop: new Set(), drop: d.words.map(() => new Set()), hinted: new Set(), bonus: [],
      el: 0, sel: -1, hints: 0, hintCoins: 0, drops: 0, dropCoins: 0, bonusCoins: 0, over: false, started: false
    };
  }
  function save() {
    if (!R || R.over) { store.set(SAVE_KEY, null); return; }
    store.set(SAVE_KEY, {
      seed: R.seed, lv: R.lv, timer: R.timer, no: R.no, words: R.words, clues: R.clues,
      letters: R.tiles.slice().sort((a, b) => a.k - b.k).map(t => t.ch),
      found: [...R.found], byDrop: [...R.byDrop], drop: R.drop.map(s => [...s]), hinted: [...R.hinted], bonus: R.bonus,
      el: Math.round(R.el), hints: R.hints, hintCoins: R.hintCoins, drops: R.drops, dropCoins: R.dropCoins, bonusCoins: R.bonusCoins
    });
  }
  function load() {
    const s = store.get(SAVE_KEY, null);
    if (!s || !Array.isArray(s.words) || !Array.isArray(s.letters)) return null;
    const keep = Object.assign({}, ks);
    ks.lv = s.lv; ks.timer = s.timer;
    const r = newR({ seed: s.seed, words: s.words, clues: s.clues || s.words.map(() => ''), letters: s.letters });
    Object.assign(ks, keep);
    r.no = s.no || r.no;
    r.found = new Set(s.found || []); r.byDrop = new Set(s.byDrop || []); r.hinted = new Set(s.hinted || []);
    r.drop = (s.drop || []).map(a => new Set(a)); while (r.drop.length < r.words.length) r.drop.push(new Set());
    r.bonus = s.bonus || []; r.el = s.el || 0;
    ['hints', 'hintCoins', 'drops', 'dropCoins', 'bonusCoins'].forEach(k => { r[k] = s[k] || 0; });
    r.started = true;
    return r;
  }
  R = load();
  const unfinished = () => !!(R && !R.over);
  const progressed = () => !!(R && (R.found.size || R.bonus.length || R.hints || R.drops));
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
    paintTag(); paintBtns(); tick(0);
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
  $('#krLv').addEventListener('change', e => { ks.lv = +e.target.value; saveKs(); UI.lobby(); });
  $('#krTm').addEventListener('change', e => { ks.timer = +e.target.value; saveKs(); UI.lobby(); });
  $('#krStart').addEventListener('click', () => newRing());
  $('#krSetResume').addEventListener('click', () => { if (unfinished()) showPlay(); });

  // a New Ring while one is unfinished asks first; with progress made, the old Ring counts as not cleared
  function newRing(confirmed) {
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
    const d = dealRing(ks.n, ks.lv);
    if (!d) { toast('Could not build a Ring. Please try again.', 'bad'); return; }
    R = newR(d);
    save();
    showPlay();
  }

  // ---------- sizes and layout ----------
  let cs = 40, rs = 300, ts = 60, cb = 52;
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
    return pack(C).length * c * 1.32 + 24;
  }
  function fit() {
    if (!R || !playOn()) return;
    const main = $('#krMain');
    const W0 = main.clientWidth, H0 = main.clientHeight;
    if (!W0 || !H0) return;
    const wide = W0 >= 900 && H0 >= 480;
    main.classList.toggle('wide', wide);
    const coarse = matchMedia('(pointer: coarse)').matches;
    const infoH = $('#krInfo').offsetHeight || 34, msgH = 46, tipH = coarse ? 0 : 22, gap = 8;
    if (wide) {
      const colW = (W0 - 44 - 26) / 2.1; // the right column (1 of 2.1 shares)
      const H = H0 - 24 - infoH - msgH - tipH - gap * 4;
      rs = Math.min(colW, H, 560);
    } else {
      const W = W0 - 24, H = H0 - 16 - infoH - msgH - tipH - gap * (coarse ? 3 : 4);
      rs = Math.min(W - 4, H - slotNeed(W, W < 500 ? 28 : 34), 560);
    }
    rs = Math.max(170, Math.floor(rs));
    const n = R.tiles.length;
    ts = Math.round(Math.min(rs * (n <= 4 ? 0.27 : n === 5 ? 0.25 : n === 6 ? 0.23 : n === 7 ? 0.21 : 0.19), 104));
    cb = Math.round(Math.min(66, Math.max(46, rs * 0.15)));
    // the stage holds the Ring and its corner buttons; when there is room beside the Ring, the buttons move out to the sides
    const availW = wide ? (W0 - 44 - 26) / 2.1 : W0 - 24;
    const sw = Math.floor(Math.min(availW, rs + 2 * (cb + 8)));
    main.style.setProperty('--rs', rs + 'px');
    main.style.setProperty('--sw', sw + 'px');
    main.style.setProperty('--ts', ts + 'px');
    main.style.setProperty('--cb', cb + 'px');
    $('#krLine').setAttribute('viewBox', `0 0 ${rs} ${rs}`);
    placeTiles();
    renderSlots(); // reading the panel's size makes the browser lay it out first, so no frame wait is needed
  }
  window.addEventListener('resize', () => { if (playOn()) fit(); });
  if (window.ResizeObserver) new ResizeObserver(() => { if (playOn()) fit(); }).observe($('#krMain'));

  // ---------- slots ----------
  function renderSlots(pops) {
    if (!R) return;
    const box = $('#krSlots'), W = box.clientWidth - 24, H = box.clientHeight - 20;
    if (W <= 0 || H <= 0) return;
    const ml = maxLen();
    let best = null;
    for (let C = ml; C <= ml * 2 + 2; C += 0.5) {
      const rows = pack(C), size = Math.min(W / (C * 1.1 + 0.6), H / (rows.length * 1.32), 56);
      if (!best || size > best.size + 0.5) best = { rows, size };
    }
    cs = Math.max(16, Math.floor(best.size));
    box.style.setProperty('--cs', cs + 'px'); box.style.setProperty('--rg', Math.round(cs * 0.22) + 'px');
    box.innerHTML = best.rows.map(r => `<div class="kr-row">${r.map(i => {
      const w = R.words[i], f = R.found.has(i);
      const cells = [...w].map((c, p) => {
        const d = R.drop[i].has(p);
        const cls = f ? (d ? 'd' : 'f') : d ? 'd' : '';
        const pop = pops && pops[i] && pops[i].has(p) ? ` pop" style="animation-delay:${[...pops[i]].indexOf(p) * 55}ms` : '';
        return `<span class="kr-c ${cls}${pop}">${f || d ? c : ''}</span>`;
      }).join('');
      const lbl = f ? `${w}, found` : `${w.length} letters${R.hinted.has(i) ? ', clue shown' : ''}`;
      return `<button type="button" class="kr-word${R.sel === i ? ' sel' : ''}${f ? ' done' : ''}" data-i="${i}" aria-label="${lbl}">${R.hinted.has(i) && !f ? '<span class="hm" aria-hidden="true">💡</span>' : ''}${cells}</button>`;
    }).join('')}</div>`).join('');
    $('#krProg').innerHTML = `<span class="e">🔑</span> ${R.found.size} / ${R.words.length} words`;
  }
  $('#krSlots').addEventListener('click', e => {
    const b = e.target.closest('.kr-word'); if (!b || !R || R.over) return;
    const i = +b.dataset.i;
    if (R.found.has(i)) { msg(`${R.words[i]}: ${esc(R.clues[i] || '')}`, 'clue', 3000); return; }
    R.sel = R.sel === i ? -1 : i;
    renderSlots(); paintBtns(); save();
    if (R.hinted.has(i)) msg(`💡 ${R.words[i].length} letters: ${esc(R.clues[i])}`, 'clue', 4500);
    else if (R.sel === i) msg(`Slot picked (${R.words[i].length} letters): 💡 Hint 🪙${hintCost(i)} shows its clue`, '', 2600);
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
    if (!R || R.over || spinning) return;
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

  // keyboard: type the word
  document.addEventListener('keydown', e => {
    if (!playOn() || !R || !$('#modal').hidden || e.ctrlKey || e.metaKey || e.altKey || /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName || '')) return;
    if (/^[a-z]$/i.test(e.key)) {
      e.preventDefault();
      if (R.over || spinning) return;
      const c = e.key.toUpperCase(), i = R.tiles.findIndex((t, j) => t.ch === c && !trace.includes(j));
      if (i < 0) { nudge(`No free ${c} on the Ring`); return; }
      tapMode = true; keyed = true; add(i);
    } else if (e.key === 'Enter') { e.preventDefault(); if (trace.length) submit(); }
    else if (e.key === 'Backspace') { e.preventDefault(); pop(); if (!trace.length) tapMode = false; }
    else if (e.key === 'Escape') { clearTrace(); msg(''); }
    else if (e.key === ' ') { e.preventDefault(); shuffle(); }
  });

  // ---------- messages ----------
  let msgT = 0;
  function msg(t, kind, ms) {
    clearTimeout(msgT);
    const m = $('#krMsg'); m.className = 'kr-msg';
    m.innerHTML = t ? `<span class="mt ${kind || ''}">${t}</span>` : '';
    if (t && ms) msgT = setTimeout(() => { if (!trace.length) msg(''); }, ms);
  }
  function nudge(t) { msg(t, 'bad', 1700); snd('bounce'); const m = $('#krMsg'); m.classList.remove('shake'); void m.offsetWidth; m.classList.add('shake'); }

  // ---------- submit a word ----------
  function submit() {
    const w = trace.map(i => R.tiles[i].ch).join('');
    clearTrace();
    if (!R || R.over) return;
    if (w.length < 3) { msg('Words need 3 letters or more', '', 1500); return; }
    const i = R.words.indexOf(w);
    if (i >= 0) {
      if (R.found.has(i)) { msg(`${w} is already in a slot`, 'dup', 1800); snd('draw'); flashRow(i); return; }
      fill(i); return;
    }
    if (isWord(w)) {
      if (R.bonus.includes(w)) { msg(`${w}: bonus word already found`, 'dup', 1800); snd('draw'); return; }
      R.bonus.push(w); R.bonusCoins++; st.bonus++; saveSt();
      if (UI.coins) UI.coins.add(1, `${NM.ring} bonus word ${w}`);
      msg(`★ Bonus word ${w} · 🪙+1`, 'good', 1800); paintTag(true); save(); return;
    }
    nudge(`${w} isn't in the word list`);
  }
  function fill(i) {
    R.found.add(i);
    const pops = { [i]: new Set([...R.words[i]].map((c, p) => p).filter(p => !R.drop[i].has(p))) };
    if (R.sel === i) R.sel = -1;
    renderSlots(pops); paintBtns();
    msg(`✓ ${R.words[i]}`, 'good', 1400);
    snd('word');
    save();
    checkDone();
  }
  function flashRow(i) { const el = document.querySelector(`#krSlots .kr-word[data-i="${i}"]`); if (el) { el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); } }
  function paintTag(bump) {
    $('#krTagN').textContent = R ? R.bonus.length : 0;
    if (bump && !reduceMotion()) {
      const t = $('#krTag'); t.classList.remove('bump'); void t.offsetWidth; t.classList.add('bump');
      const p = document.createElement('span'); p.className = 'plus'; p.textContent = '+1'; t.appendChild(p); setTimeout(() => p.remove(), 1000);
    }
  }
  $('#krTag').addEventListener('click', () => {
    if (!R) return;
    openModal(`<h2 class="mk-title">★ Bonus words</h2><p class="help-note">Real words spelled from this Ring that are not in a slot. Each new one pays 🪙1.</p>
      <div class="kr-chips">${R.bonus.length ? R.bonus.map(w => `<span class="bon">${w}</span>`).join('') : '<span>None yet. Keep spelling!</span>'}</div>
      <p class="help-note">This Ring: ${R.bonus.length} found · 🪙+${R.bonusCoins}. All Rings: ${st.bonus}.</p>
      <div class="row"><button class="btn primary" data-a="ok">Close</button></div>`);
    $('#sheet').onclick = e => { if (e.target.closest('[data-a]')) closeModal(); };
  });

  // ---------- coin buttons: two taps to buy (as in the other games) ----------
  // the price line under each button: Hint's depends on the slot (the one you picked, or the range over the empty slots)
  function hintPool() { return R.words.map((w, i) => i).filter(i => !R.found.has(i) && !R.hinted.has(i)); }
  function paintBtns() {
    if (!R) return;
    const pool = hintPool();
    let hp = '–';
    if (R.sel >= 0 && pool.includes(R.sel)) hp = '🪙' + hintCost(R.sel);
    else if (pool.length) { const c = pool.map(hintCost), lo = Math.min(...c), hi = Math.max(...c); hp = '🪙' + (lo === hi ? lo : `${lo}–${hi}`); }
    $('#krHintCp').textContent = hp;
    $('#krDropCp').textContent = '🪙' + dropCost();
    $('#krHint').title = `Hint: show a slot's clue (${hp})`;
    $('#krDrop').title = `Key Drop: drop one letter into a slot (🪙${dropCost()})`;
  }
  function arm(btn, price) {
    if (!UI.armTap) return true;
    const go = UI.armTap(btn, price);
    if (!go) btn.dataset.arm = `Tap\nagain\n🪙${price}`; // three short lines fit the round button
    return go;
  }
  $('#krHint').addEventListener('click', () => {
    if (!R || R.over) return;
    const btn = $('#krHint');
    if (!btn.classList.contains('armed')) {
      const pool = hintPool();
      if (!pool.length) { msg('Every empty slot already shows its clue: tap a 💡 slot to read it again', '', 3000); return; }
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
    msg(`💡 ${R.words[i].length} letters: ${esc(R.clues[i] || 'no clue for this word')}`, 'clue', 6000);
  });
  $('#krDrop').addEventListener('click', () => {
    if (!R || R.over) return;
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

  // ---------- clock ----------
  let lastT = performance.now(), lastSec = -1;
  function tick(dt) {
    if (!R) return;
    if (dt && playOn() && !R.over && $('#modal').hidden && !document.hidden) R.el += dt;
    const sec = Math.floor(R.el / 1000), rem = R.timer ? Math.max(0, R.timer - sec) : sec;
    $('#krClk').textContent = fmt(rem);
    $('#krClock').classList.toggle('low', !!R.timer && rem <= 10 && !R.over);
    if (R.timer && !R.over && rem !== lastSec && rem > 0 && rem <= 10 && dt) snd(rem <= 5 ? 'tock' : 'tick');
    lastSec = rem;
    if (R.timer && rem <= 0 && !R.over) timeUp();
  }
  setInterval(() => { const now = performance.now(); tick(now - lastT); lastT = now; }, 250);
  let saveT = 0;
  setInterval(() => { if (R && !R.over && playOn() && Date.now() - saveT > 4000) { saveT = Date.now(); save(); } }, 1000);
  document.addEventListener('visibilitychange', () => { if (document.hidden && R && !R.over) save(); });

  // ---------- the end of a Ring ----------
  function checkDone() { if (R.found.size === R.words.length && !R.over) { R.over = true; clearTrace(); setTimeout(() => endRing('clear'), 650); } }
  function endRing(how) {
    if (!R) return;
    const cleared = how === 'clear';
    R.over = true;
    const mine = R.L - R.drops;
    const earn = cleared ? Math.round(R.v * mine) : 0;
    if (earn && UI.coins) UI.coins.add(earn, `${NM.ring}: Ring cleared`);
    st.played++;
    if (cleared) {
      st.cleared++; st.streak++; st.best = Math.max(st.best, st.streak);
      const k = R.n + (R.timer ? 't' : '');
      if (!R.timer && (!st.fastest[k] || R.el < st.fastest[k])) st.fastest[k] = Math.round(R.el);
    } else st.streak = 0;
    saveSt();
    store.set(SAVE_KEY, null);
    const net = earn + R.bonusCoins - R.hintCoins - R.dropCoins;
    const sec = Math.floor(R.el / 1000);
    const [face, head] = cleared ? ['🔑', 'Ring cleared!'] : how === 'time' ? ['⏱', "Time's up"] : ['🏳️', 'Ring not cleared'];
    const sub = `${R.found.size} of ${R.words.length} words · ${R.bonus.length} bonus word${R.bonus.length === 1 ? '' : 's'} · ${R.timer ? (cleared ? 'time left ' + fmt(Math.max(0, R.timer - sec)) : timerName(R.timer)) : 'time ' + fmt(sec)}`;
    const chips = R.words.map((w, i) => `<span class="${R.found.has(i) ? (R.byDrop.has(i) ? 'drp' : '') : 'miss'}">${w}</span>`).join('') + R.bonus.map(w => `<span class="bon">${w}</span>`).join('');
    const row = (l, v) => `<tr><td>${l}</td><td class="${v < 0 ? 'neg' : 'pos'}">${v < 0 ? '−' + -v : '+' + v}</td></tr>`;
    const coinTbl = `<h3 class="res-h">🪙 Coins</h3><table class="score-table kr-coins">`
      + (cleared ? row(`🔑 Ring cleared: ${mine} of ${R.L} letters yours, at 🪙${(Math.round(R.v * 100) / 100)} each`, earn) : '')
      + row(`★ Bonus words (${R.bonus.length})`, R.bonusCoins)
      + (R.hints ? row(`💡 Hint × ${R.hints}`, -R.hintCoins) : '')
      + (R.drops ? row(`🔑 Key Drop × ${R.drops}`, -R.dropCoins) : '')
      + `<tr class="total"><td>This Ring ${net < 0 ? '−' + -net : '+' + net} · Balance</td><td data-coins>${UI.coins ? UI.coins.bal : ''}</td></tr></table>`;
    const pct = st.played ? Math.round(100 * st.cleared / st.played) : 0;
    const stats = `<h3 class="res-h">📊 Your stats</h3><div class="vt-res-stats">
      <div><b>${st.played}</b><span>Rings</span></div><div><b>${pct}%</b><span>Cleared</span></div><div><b>${st.streak}</b><span>Streak</span></div>
      <div><b>${st.best}</b><span>Best streak</span></div><div><b>${st.bonus}</b><span>Bonus words</span></div><div><b>${st.fastest[R.n] ? fmt(Math.floor(st.fastest[R.n] / 1000)) : '–'}</b><span>Fastest ${R.n}-letter</span></div></div>`;
    const body = `<div class="res-top"><span class="res-face">${face}</span><span class="res-title">${head}</span></div>
      <p class="res-sub">${sub}</p>
      <div class="kr-chips">${chips}</div>
      ${how !== 'clear' ? '<p class="help-note kr-note">Red = the words you missed. Your bonus coins are yours to keep.</p>' : R.byDrop.size ? '<p class="help-note kr-note">Light blue = filled by Key Drop.</p>' : ''}
      <div class="res-cols"><section>${coinTbl}</section><section>${stats}</section></div>`;
    if (UI.history) {
      UI.history.add({
        g: 'ring', win: cleared, title: `${NM.ring} · ${cleared ? 'Ring cleared' : how === 'time' ? "Time's up" : 'Not cleared'} (${R.seed.length} letters)`,
        sub: [`Level ${R.lv}`, `${R.n} letters`, timerName(R.timer)].join(' · '), score: `${R.found.size}/${R.words.length} words`, coins: net, html: body
      });
    }
    R.resHtml = body;
    UI.lobby();
    if (how === 'quit') return;
    snd(cleared ? 'win' : 'lose');
    if (cleared && !night() && !reduceMotion()) confetti();
    openResult();
  }
  function timeUp() { clearTrace(); endRing('time'); }
  function openResult() {
    if (!R || !R.resHtml) return;
    openModal(`${R.resHtml}<div class="row res-bar"><button class="btn" data-a="setup">⚙ Setup</button><button class="btn" data-a="menu">☰ Lobby</button><button class="btn primary" data-a="next">▶ Next Ring</button></div>`, 'res', { close: () => { if (playOn()) msg('Ring over: tap the 🔑 words counter for the result', '', 5000); } });
    $('#sheet').onclick = e => {
      const b = e.target.closest('[data-a]'); if (!b) return;
      closeModal();
      if (b.dataset.a === 'next') newRing(true);
      else if (b.dataset.a === 'setup') showSetup();
      else goLobby();
    };
  }
  $('#krProg').addEventListener('click', () => { if (R && R.over) openResult(); });
  function confetti() {
    const c = document.createElement('div'); c.className = 'kr-confetti';
    c.innerHTML = Array.from({ length: 40 }, (_, k) => `<i style="left:${Math.random() * 100}%;background:${['#f5b300', '#2c6bd8', '#1e9e4a', '#e0457b', '#4fc3f7'][k % 5]};animation-delay:${(Math.random() * 0.5).toFixed(2)}s"></i>`).join('');
    document.body.appendChild(c); setTimeout(() => c.remove(), 2600);
  }

  // ---------- How To Play ----------
  function help() {
    const sec = UI.helpSec;
    openModal(`<h2 class="mk-title">How To Play ${NM.ring} <span class="chip">${UI.APP_VER}</span></h2>
      <p>Spell words from the letters on the Ring to fill every slot. A Ring is cleared when every slot is full.</p>
      <p class="help-note">Tap a heading to open it.</p>
      ${sec('The Basics', `
        <li>Open ${NM.ring} from its card in the ${NM.suite} Lobby: <b>🆕 New Game</b> deals a Ring at once with your last settings, <b>⚙ Setup</b> (or a tap on the card) shows the settings first, and <b>▶ Resume</b> appears while a Ring is unfinished. <b>☰</b> goes back to the Lobby; an unfinished Ring waits, with its clock stopped.</li>
        <li>Each slot holds one word, and its squares show how long the word is. Shortest words come first.</li>
        <li>Each letter on the Ring can be used <b>once per word</b>, but in as many words as you like.</li>`)}
      ${sec('Spell a Word', `
        <li><b>Swipe</b> (touch) or <b>drag</b> (mouse) across the letters, then let go. Slide back one letter to undo it.</li>
        <li>Or <b>tap</b> the letters one by one, then tap the last one again (or tap the letters above the Ring).</li>
        <li>Or <b>type</b> it on a keyboard and press <b>Enter</b>: <b>⌫</b> takes a letter back, <b>Esc</b> clears, <b>Space</b> shuffles.</li>
        <li>The strip above the Ring shows the word you're spelling, then what happened: green = a slot filled or a bonus word, gold = already found, red = not a word, blue = a clue.</li>`)}
      ${sec('Bonus Words', `
        <li>Any other real word you spell from the Ring (at least 3 letters) is a <b>bonus word</b>. Each new one pays <b>🪙1</b>, with no limit. The gold <b>BONUS</b> tag in the Ring's top corner counts them and swings when you find one; tap it to see the list.</li>`)}
      ${sec('The Buttons', `
        <li><b>Shuffle</b> is the steel hub in the middle of the Ring: the letters spin to new places. Free.</li>
        <li><b>💡 Hint</b> (bottom-left corner) shows the clue for one empty slot: the slot you picked (tap a slot; it glows blue), or else a random one, which lights up when you tap Hint. It's a signal, not a solve: no letters are given. The slot keeps a 💡 mark; tap it to read the clue again, free.</li>
        <li><b>🔑 Key Drop</b> (bottom-right corner) drops <b>one letter</b> into an empty square: in the slot you picked, or anywhere. Dropped letters are light blue. A slot it completes counts as filled.</li>
        <li>Coin buttons are blue and take <b>two taps</b>: the first lights the button and shows its price, the second buys.</li>`)}
      ${sec('Coins', `
        <li>Each Ring is worth <b>100 coins</b>, shared over its letter squares: one letter is worth 100 ÷ the Ring's letters (with 50 letters, 🪙2 each).</li>
        <li><b>💡 Hint</b> costs one letter's worth for each letter in its slot (a 5-letter slot at 🪙2 a letter = 🪙10). <b>🔑 Key Drop</b> costs one letter's worth.</li>
        <li><b>Ring cleared:</b> one letter's worth for every letter you filled yourself, so a Ring cleared with no Key Drop pays 🪙100. Hints don't lower it (they cost coins already).</li>
        <li><b>Bonus words:</b> 🪙1 each. When time runs out, you keep your bonus coins, but the Ring pays nothing.</li>
        <li>Coins are shared by every ${NM.suite} game; tap your balance for the details.</li>`)}
      ${sec('Setup', `
        <li><b>Letters on the Ring</b>: 3 to 8. More letters give more and longer slots.</li>
        <li><b>Challenge Level</b> (1–10) picks the slot words: everyday words at 1–3, rarer ones as it rises. From level 6 the clues turn figurative. Bonus words can be any real word at every level.</li>
        <li><b>Timer</b>: Untimed (the clock counts up), or 1, 2, 3 or 5 minutes per Ring (it counts down, and turns red in the last 10 seconds).</li>
        <li>Every Ring is new: the app deals a fresh set of letters each time and avoids the Rings you played recently.</li>`)}
      ${sec('Your Stats', `
        <li>Rings played, the share cleared, your streak (Rings cleared in a row), your best streak, bonus words and your fastest untimed Ring for each size are kept on this device. Every Ring also goes into <b>📜 Game History</b> in the Lobby.</li>
        <li>Starting a new Ring after you've found a word (or used a coin button) in an unfinished one counts that Ring as not cleared.</li>`)}
      ${sec('Sound', `
        <li>Sound effects are <b>off</b> until you tap <b>🔇</b> in the header (it becomes <b>🔊</b>). You'll hear a click for each letter, a chime for each slot, a thunk for a word that isn't in the list, a clink for coins, ticks in the last 10 seconds, and a fanfare when the Ring is cleared.</li>`)}
      <div class="row"><button class="btn primary" data-a="ok">Close</button></div>`);
    $('#sheet').onclick = e => { if (UI.helpClick(e)) return; if (e.target.closest('[data-a]')) closeModal(); };
  }

  // ---------- wiring ----------
  { const cp = document.querySelector('[data-kr-coins]'); if (cp && UI.coinPill) cp.outerHTML = UI.coinPill(); } // the shared coin balance (tap for details)
  $('#krMenu').addEventListener('click', goLobby);
  $('#krHelp').addEventListener('click', help);
  $('#krSet').addEventListener('click', () => { clearTrace(); save(); showSetup(); });
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
    _R: () => R // for checks only
  };
  if (UI.lobby) UI.lobby(); // the Lobby was drawn before this file loaded: fill in the KeyRing card
})();
