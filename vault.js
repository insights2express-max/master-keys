/* Clue Duel — Word Vault (v08c): a word-guessing mini-game (JM, CD-12: 4.2.1; CD-13: 4.x; CD-18: 7.1a; CD-21: 5.1–5.3; CD-23; CD-24; CD-25; CD-26).
   v08 (CD-26): coins (the Hint costs 5 coins; solved words pay coins); the Hint's difficulty follows the Challenge Level;
   a 25% bolder and brighter >; every timer says "per"; the Space bar jumps to the next open square; a grab bar makes the keys taller.
   v08b (CD-27): Reveal costs coins (40 ÷ letters); keys auto-fit (tallest by default, ⇕ handle in the button row); ␣ key on
   touch screens; orange ⌫; GUESS / WORD in capitals; every New Game shows the word that ended; tricky hints at levels 8–10.
   v08c (CD-30, CD-32): button groups (gold coin buttons | gray round game buttons); New Game and Give up ask first; coin buttons
   take two taps; finished words go into the shared Game History; levels 8–10 get SHORT hints (one to three words).
   v08d (CD-34: 1.1–1.2): coin buttons are blue, each icon on a white circle.
   v08e (CD-36: 1.1, 5.1, 5.3): icons on a navy circle; the result window matches Clue Duel's (one-line heading, tables side
   by side on wide screens, a pinned button bar; the Guesses-needed note opens from ⓘ).
   v08f (CD-37): result buttons ⚙ Settings · ☰ Menu · Next word; ✕ / tap outside closes it and shows a game-over bar;
   How To Play in collapsible sections; the clock is a gray pill like Clue Duel's.
   v07f (CD-25): no embossed text; played letters are black on green, yellow or red; typed (tentative) letters turn their key
   black on white; empty squares are dark glass "candy drops" in the slots of a glassy grid panel; a large > marks the
   active row, so the grid sits centered between it and the ✕; "Blitz · 30s per guess".
   v07e (CD-24): ⏸️ Pause on the (larger) clock, with a blurred grid and tap-anywhere to resume; yellow/red countdown borders;
   squares sized to the keyboard's width; ✕ clears the guess row; 🔎 Hint (−5) shows the word's clue over the grid;
   embossed letters; after New Game the unsolved word is shown until a tap; more icons and your own picture.
   Guess the hidden word in a set number of tries. After each guess every letter is marked:
     green = right letter, right spot · yellow = in the word, another spot · red = not in the word (JM, CD-23: 1.1.1.1–3).
   v07d (CD-23): squares are selected by tap or arrow keys (steady light-blue glow); right-spot letters carry into the next
   guess and typing jumps to the first open square; a New Game button; a 2-second celebration on a solve; settings can be
   changed during play (⚙ or the info line).
   Answers: real words (in ENABLE) from the main word list (4–7 letters, with their vocabulary level) plus a curated
   8-letter list; any ENABLE word of the right length is a valid guess. Unlimited play: a new word every round. */
'use strict';
(function () {
  const UI = window.CDUI, E = window.Engine;
  if (!UI || !E) return;
  const { $, esc, store, toast, openModal, closeModal } = UI;

  // ---------- Settings, stats and words ----------
  const DEF = { level: 3, len: 5, tries: 6, timer: '0', scoring: 'classic', name: '', icon: '🔐' };
  const vs = Object.assign({}, DEF, store.get('cd.vault.settings', {}));
  const saveVs = () => store.set('cd.vault.settings', vs);
  const blankStats = () => ({ played: 0, won: 0, streak: 0, best: 0, dist: {}, points: 0, top: 0, bestMs: 0 });
  const stats = Object.assign(blankStats(), store.get('cd.vault.stats', {}));
  const saveStats = () => store.set('cd.vault.stats', stats);
  const title = () => (vs.name || '').trim() || 'Word Vault';

  let GUESS = null, ANS = null;
  function words() {
    if (GUESS) return;
    GUESS = {}; ANS = {};
    const G = window.VAULT_GUESS || {};
    for (const n of [4, 5, 6, 7, 8]) {
      const s = G[n] || '', set = new Set();
      for (let i = 0; i + n <= s.length; i += n) set.add(s.slice(i, i + n));
      GUESS[n] = set; ANS[n] = [];
    }
    for (const e of E.lexicon()) {
      const n = e.w.length;
      if (n >= 4 && n <= 7 && GUESS[n].has(e.w)) ANS[n].push({ w: e.w, l: e.l, c: e.e, h: e.h });
    }
    // 8-letter answers: WORD|level|clue|easy clue|hard clue|status (v08; status v08b: only blank or ACTIVE answers play)
    for (const line of String(window.VAULT_EIGHT || '').split('\n')) {
      const [w, l, c, ez, hd, st] = line.split('|');
      const s = (st || '').trim().toUpperCase();
      if (w && w.length === 8 && (!s || s === 'ACTIVE')) ANS[8].push({ w, l: +l || 1, c: (c || '').trim(), ez: (ez || '').trim(), hd: (hd || '').trim() });
    }
    // v08b (JM CD-27: 3.5.1, 4.2): tricky hints written for the 4- to 7-letter answers
    for (const line of String(window.VAULT_HARD || '').split('\n')) {
      const i = line.indexOf('|');
      if (i > 0) HARD[line.slice(0, i)] = line.slice(i + 1).trim();
    }
    // v08c (JM CD-30: 2.7.1; CD-32: 2.1a): short hints (one to three words, one angle), only at levels 8–10
    for (const line of String(window.VAULT_SHORT || '').split('\n')) {
      const i = line.indexOf('|');
      if (i > 0) SHORT[line.slice(0, i)] = line.slice(i + 1).trim();
    }
  }
  const HARD = {}, SHORT = {};
  // Hint difficulty follows the Challenge Level (v08, JM CD-26). Every answer has three hints:
  //   direct  = literal and simple, mostly one word  (4–7 letters: the main game's literal clue; 8 letters: the easy clue)
  //   middle  = 4–7 letters: the indirect clue; 8 letters: the plain definition (several words)
  //   tricky  = indirect, metaphorical or a pun, several words fine (4–7 letters: the tricky hint written in v08b, else
  //             the wordplay clue, else the indirect clue; 8 letters: the hard clue)
  // Levels 1–3 always get the direct hint and 8–10 the tricky one; 4–7 draw from a mix that tilts toward tricky as the level rises.
  // v08b (CD-27: 3.5.1, more contrast): 4–5 lean direct, 6–7 lean tricky, so the middle levels step up instead of blending.
  const HINT_MIX = { 4: [60, 35, 5], 5: [35, 45, 20], 6: [10, 40, 50], 7: [0, 25, 75] };
  // v08c (CD-32: 2.1a) THREE STEPS: levels 1–3 direct · 4–7 the mix above (up to the tricky hint) · 8–10 only the SHORT hint
  // (tier 3; a word without one falls back to its tricky hint).
  function hintTiers(a) {
    if (a.w.length === 8) return [a.ez || a.c, a.c, a.hd || a.c, SHORT[a.w] || a.hd || a.c];
    const wp = (E.wordplay && E.wordplay()[a.w]) || '';
    const tricky = HARD[a.w] || wp || a.h || a.c;
    return [a.c, a.h || a.c, tricky, SHORT[a.w] || tricky];
  }
  function hintText(a, level) {
    const t = hintTiers(a);
    let k = level <= 3 ? 0 : level >= 8 ? 3 : -1;
    if (k < 0) { const m = HINT_MIX[level], r = Math.random() * 100; k = r < m[0] ? 0 : r < m[0] + m[1] ? 1 : 2; }
    const pick = s => (E.oneClue ? E.oneClue(s) : s); // L09: one of the ";"-separated alternatives
    return pick(t[k]) || pick(t[0]) || `It starts with ${a.w[0]} and ends with ${a.w[a.w.length - 1]}.`;
  }
  // Hint (JM, CD-24: 1.1.5): the word's clue, plus a clue picture when the main game has one allowed at this Challenge Level
  // (the easiest kind first: a hint should help). v08: the clue is chosen once per word, by hintText.
  function clueOf(a, level) {
    let pic = '';
    try {
      const P = (E.pics && E.pics()[a.w]) || [], MIN = E.PIC_MIN || {}, RANK = ['lit', 'cat', 'assoc', 'rebus', 'sound', 'math'];
      const ok = P.filter(x => (MIN[x.t] || 1) <= level).sort((x, y) => RANK.indexOf(x.t) - RANK.indexOf(y.t));
      if (ok.length) pic = ok[0].p;
    } catch (e) { /* no picture */ }
    return { t: hintText(a, level), pic };
  }
  // Challenge Level (1–10) sets the vocabulary: the target word level, and the highest level allowed
  const TARGET = [1, 1, 1, 2, 2, 3, 3, 4, 5, 5];
  function pickWord() {
    words();
    const t = TARGET[vs.level - 1], all = ANS[vs.len];
    const recent = new Set(store.get('cd.vault.recent', []));
    const fresh = all.filter(a => !recent.has(a.w));
    const pool = fresh.length > 20 ? fresh : all;
    const exact = pool.filter(a => a.l === t), upTo = pool.filter(a => a.l <= t);
    const from = exact.length && Math.random() < 0.6 ? exact : (upTo.length ? upTo : pool);
    const a = from[Math.floor(Math.random() * from.length)];
    store.set('cd.vault.recent', [a.w].concat([...recent]).slice(0, 300));
    return a;
  }

  // ---------- Setting choices ----------
  // v08 (JM, CD-26: 2.1): every timer says "per"; v08b (CD-27: 3.3.1): GUESS and WORD in capitals, so they stand apart
  const TIMERS = [['0', 'Untimed'], ['t30', 'Blitz · 30s per GUESS'], ['t60', '1 min per GUESS'], ['t120', '2 min per GUESS'], ['t180', '3 min per GUESS'],
    ['t300', '5 min per GUESS'], ['g120', '2 min per WORD'], ['g180', '3 min per WORD'], ['g300', '5 min per WORD'], ['g600', '10 min per WORD'], ['g900', '15 min per WORD']];
  const OPTS = {
    level: Array.from({ length: 10 }, (_, i) => [i + 1, i === 0 ? '1 · Gentle' : i === 9 ? '10 · Ruthless' : String(i + 1)]),
    len: [4, 5, 6, 7, 8].map(n => [n, n + ' letters']),
    tries: [5, 6, 7, 8, 9, 10].map(n => [n, n + ' guesses']),
    timer: TIMERS,
    scoring: [['classic', 'Classic'], ['flat', 'Flat']]
  };
  const LABEL = { level: 'Challenge Level', len: 'Letters', tries: 'Guesses', timer: 'Timer', scoring: 'Scoring' };
  const timerOf = code => { const m = /^([tg])(\d+)$/.exec(code || ''); return m ? { kind: m[1] === 't' ? 'guess' : 'word', ms: +m[2] * 1000 } : { kind: 'none', ms: 0 }; };
  const VAL = E.VAL;
  const DESC = {
    classic: 'Solve to score the word\'s letter values plus 2 per letter, +5 for every guess you didn\'t need, and a time bonus in timed games. Hint and Reveal cost coins, not points.',
    flat: 'Solve to score 2 per letter, +5 for every guess you didn\'t need, and a time bonus in timed games. Hint and Reveal cost coins, not points.'
  };
  const fillSelect = (sel, opts, val) => { sel.innerHTML = opts.map(([v, t]) => `<option value="${v}">${esc(t)}</option>`).join(''); sel.value = String(val); };
  const setFrom = (k, v) => { vs[k] = k === 'timer' || k === 'scoring' ? v : +v; saveVs(); };

  // ---------- Round state ----------
  // R = { a, rows: [{ g, st }], cells: [{ ch, lock }], sel, over, won, revealed: Map, reveals, tStart, left, tId, len, tries, timer, scoring, level }
  let R = null;
  const screenOn = () => !$('#vault').hidden;

  function open() {
    UI.showScreen('vault');
    renderHead();
    if (R && !R.over) showPlay(); else showSetup();
  }
  function renderHead() {
    $('#vtTitle').textContent = title();
    $('#vtAv').innerHTML = iconHTML();
    document.title = `${title()} · Clue Duel ${UI.APP_VER}`;
  }

  // ---------- Setup panel (first visit, or after a round) ----------
  function showSetup() {
    $('#vtSetup').hidden = false; $('#vtPlay').hidden = true; $('#vtClock').hidden = true;
    fillSelect($('#vtLevel'), OPTS.level, vs.level);
    fillSelect($('#vtLen'), OPTS.len, vs.len);
    fillSelect($('#vtTries'), OPTS.tries, vs.tries);
    fillSelect($('#vtTimer'), OPTS.timer, vs.timer);
    fillSelect($('#vtScoring'), OPTS.scoring, vs.scoring);
    $('#vtDesc').textContent = DESC[vs.scoring];
    renderStats();
  }
  function renderStats() {
    const pct = stats.played ? Math.round(100 * stats.won / stats.played) : 0;
    $('#vtStats').innerHTML = stats.played
      ? `<div class="vt-st"><b>${stats.played}</b><span>Played</span></div><div class="vt-st"><b>${pct}%</b><span>Solved</span></div>`
        + `<div class="vt-st"><b>${stats.streak}</b><span>Streak</span></div><div class="vt-st"><b>${stats.best}</b><span>Best streak</span></div>`
        + `<div class="vt-st"><b>${stats.top}</b><span>Top score</span></div>`
      : '<p class="vt-none">No rounds played yet. Pick your settings and open the Vault.</p>';
  }
  for (const [id, k] of [['#vtLevel', 'level'], ['#vtLen', 'len'], ['#vtTries', 'tries'], ['#vtTimer', 'timer'], ['#vtScoring', 'scoring']]) {
    $(id).addEventListener('change', e => { setFrom(k, e.target.value); $('#vtDesc').textContent = DESC[vs.scoring]; });
  }

  // ---------- Settings during play (JM, CD-23: 1.2.1): ⚙ in the header, or tap the info line ----------
  function openSettings() {
    const busy = R && !R.over && R.rows.length > 0;
    openModal(`<h2>⚙ ${esc(title())} settings</h2>
      <div class="vt-grid">${Object.keys(OPTS).map(k => `<label class="field"><span class="lbl">${LABEL[k]}</span><select data-k="${k}"></select></label>`).join('')}</div>
      <p class="opt-desc" id="vtSetDesc">${esc(DESC[vs.scoring])}</p>
      <p class="help-note">${R && !R.over ? 'Changes apply from the next word.' : ''}${busy ? ' Starting a new word now counts this one as not solved.' : ''}</p>
      <div class="row"><button class="btn" data-a="close">Close</button><button class="btn primary" data-a="new">New word with these</button></div>`);
    document.querySelectorAll('#sheet select[data-k]').forEach(s => {
      fillSelect(s, OPTS[s.dataset.k], vs[s.dataset.k]);
      s.addEventListener('change', () => { setFrom(s.dataset.k, s.value); $('#vtSetDesc').textContent = DESC[vs.scoring]; });
    });
    $('#modal').onclick = e => { if (e.target === $('#modal')) closeModal(); };
    $('#sheet').onclick = e => {
      const b = e.target.closest('[data-a]'); if (!b) return;
      closeModal();
      if (b.dataset.a === 'new') newWord(true);
      else if (!R || R.over) showSetup();
    };
  }
  // New Game (JM, CD-23: 1.1.1.5): a fresh word with the current settings. Abandoning a word you've already guessed at
  // counts it as not solved (as Give up does), so streaks stay honest.
  // v08c (JM CD-30: 4.3): New Game and Give up ask first whenever the word isn't finished. The safe choice,
  // "Keep playing", is the main (blue) button; tapping outside the window also keeps playing.
  function askSure(head, text, go, onGo) {
    openModal(`<h2>${head}</h2><p>${text}</p>
      <div class="row"><button class="btn" data-a="yes">${go}</button><button class="btn primary" data-a="no">Keep playing</button></div>`);
    $('#modal').onclick = e => { if (e.target === $('#modal')) closeModal(); };
    $('#sheet').onclick = e => { const b = e.target.closest('[data-a]'); if (!b) return; closeModal(); if (b.dataset.a === 'yes') onGo(); };
  }
  const counts = () => R.rows.length || R.hints || R.reveals; // a word you've worked on counts as not solved if you leave it
  function newWord(confirmed) {
    if (R && !R.over && !confirmed) {
      askSure('Start a new word?', counts() ? 'This word will count as not solved.' : 'You\'ll skip this word.', '🆕 New word', () => newWord(true));
      return;
    }
    // v08b (JM CD-27 add'l 6): EVERY New Game shows the word that just ended, until a click or tap anywhere
    let prev = null;
    if (R) {
      prev = { w: R.a.w, hint: R.hint, won: R.over && R.won };
      if (!R.over && counts()) {
        R.over = true; recordLoss();
        addHistory(`Left unsolved: ${R.a.w}`, '—', `<div class="vt-res-h">🆕 Left for a new word</div><div class="vt-res-w">${R.a.w.split('').map(ch => `<span>${ch}</span>`).join('')}</div>${R.hint && R.hint.t ? `<p class="vt-res-c">Clue: ${esc(R.hint.t)}</p>` : ''}${coinTable(null)}`);
      }
      clearInterval(R.tId);
    }
    start(prev);
  }

  // ---------- Round ----------
  // prev: the word that just ended (New Game). It is shown over the new, blank grid until a tap, and the clock waits (CD-24: 1.3.1).
  function start(prev) {
    hideOv();
    const a = pickWord();
    R = { a, rows: [], cells: [], sel: 0, over: false, won: false, revealed: new Map(), reveals: 0, hints: 0, used: 0, left: timerOf(vs.timer).ms, tId: 0,
      paused: false, gate: false, ov: null, len: vs.len, tries: vs.tries, timer: vs.timer, scoring: vs.scoring, level: vs.level, lastLeft: 0 };
    R.hint = clueOf(a, R.level); // v08: this word's hint, at this Challenge Level's difficulty, fixed for the round
    $('#vtPlay').classList.remove('paused');
    newRow();
    showPlay();
    if (prev && prev.w) {
      R.gate = true;
      showOv('gate', `<div class="vt-ov-h">${prev.won ? '🔓 Solved. The last word was:' : '🔒 Not solved. The word was:'}</div>
        <div class="vt-res-w">${prev.w.split('').map(ch => `<span>${ch}</span>`).join('')}</div>
        <p class="vt-ov-t small">Clue: ${esc(prev.hint ? prev.hint.t : '')}</p>
        <div class="vt-ov-s">Tap anywhere to start your new word${timerOf(R.timer).kind !== 'none' ? ' (its clock starts then)' : ''}</div>`);
    }
    startClock();
  }
  // The next guess row: right-spot letters found so far (and revealed letters) are filled in and locked (CD-23: 1.1.1.6)
  function newRow() {
    const known = new Map();
    for (const row of R.rows) row.st.forEach((s, i) => { if (s === 'ok') known.set(i, row.g[i]); });
    for (const [i, ch] of R.revealed) known.set(i, ch);
    R.cells = Array.from({ length: R.len }, (_, i) => (known.has(i) ? { ch: known.get(i), lock: true } : { ch: '', lock: false }));
    R.sel = firstOpen(0);
  }
  const editable = i => i >= 0 && i < R.len && !R.cells[i].lock;
  // the first empty, unlocked square at or after i (wrapping to the left), else -1
  function firstOpen(i) {
    for (let k = 0; k < R.len; k++) { const j = (i + k) % R.len; if (editable(j) && !R.cells[j].ch) return j; }
    return -1;
  }
  function showPlay() {
    $('#vtSetup').hidden = true; $('#vtPlay').hidden = false;
    $('#vtInfo').innerHTML = `<button type="button" class="vt-infobtn" id="vtInfoBtn" title="Change settings">Level ${R.level} · ${R.len} letters · ${R.tries} guesses · ${R.scoring === 'flat' ? 'Flat' : 'Classic'} ⚙</button>${UI.coinPill ? ' ' + UI.coinPill() : ''}`;
    render();
    sizeBoard();
  }
  // Squares fill the keyboard's width, edge to edge (JM, CD-24: 1.1.3): fewer letters = bigger squares. They stay square
  // while the guesses fit on screen; when height runs short they become wider-than-tall rectangles instead.
  function sizeBoard() {
    if (!R) return;
    const keys = document.querySelectorAll('#vtKb .vt-kr:first-child .vt-k');
    const main = $('.vt-main');
    let W = keys.length ? keys[keys.length - 1].getBoundingClientRect().right - keys[0].getBoundingClientRect().left : Math.min(main.clientWidth - 24, 500);
    if (!(W > 100)) W = Math.min(main.clientWidth - 24, 500);
    // v07f (CD-25: 1.5.2.3–4): the glass panel spans the keyboard's width; inside it, the > column (left) and the ✕ column
    // (right) are equal, so the squares sit centered.
    const g = R.len >= 7 ? 5 : 6, P = 8; // P: the glass panel's padding
    const inner = W - 2 * P;
    const x0 = Math.round(Math.max(20, Math.min(36, W * 0.06)));
    const cw = Math.floor((inner - 2 * x0 - (R.len + 1) * g) / R.len);
    const xw = Math.floor((inner - R.len * cw - (R.len + 1) * g) / 2); // both side columns share the leftover pixels
    // v08: the board is sized for the keyboard at its normal height, so a taller keyboard (grab handle) only fills the
    // free space between the buttons and the keyboard and never shrinks the squares
    const kbNormal = $('#vtKb').offsetHeight - 3 * (kbNow - KB_MIN);
    const used = $('#vtInfo').offsetHeight + $('.vt-acts').offsetHeight + kbNormal + 3 * 10 + 20 + 2 * P;
    const avail = main.clientHeight - used;
    const ch = Math.max(26, Math.min(cw, Math.floor((avail - (R.tries - 1) * g) / R.tries)));
    const b = $('#vtBoard');
    b.style.setProperty('--vw', cw + 'px'); b.style.setProperty('--vh', ch + 'px'); b.style.setProperty('--xw', xw + 'px');
    b.style.setProperty('--vf', Math.round(Math.min(cw, ch * 1.15) * 0.55) + 'px');
    b.style.gap = g + 'px';
    b.style.padding = P + 'px';
    b.style.width = Math.round(W) + 'px';
    b.style.gridTemplateColumns = `var(--xw) repeat(${R.len}, var(--vw)) var(--xw)`;
    fitKb();
  }
  window.addEventListener('resize', () => { if (screenOn() && R) sizeBoard(); });

  // ---------- Keyboard height (v08, JM CD-26; v08b, CD-27: 3.4.1–3.4.2) ----------
  // AUTO-FIT: by default the keys are as tall as the screen allows, so the keyboard reaches up to the action buttons;
  // fewer guesses (a shorter grid) = taller keys, more guesses = shorter keys, never below normal (48 px) or above
  // twice normal (100 px). The ⇕ handle at the right end of the button row lowers them (drag down) or raises them back
  // (drag up); double-click or double-tap = tallest again. The choice is kept as a share of the free space (vs.kbFit,
  // 1 = tallest), so it follows the grid when the number of guesses changes. Remembered on this device.
  const KB_MIN = 48, KB_CAP = 100;                     // normal and tallest key heights (px)
  let kbNow = KB_MIN;                                  // the key height on screen now
  const kbFit = () => { const f = vs.kbFit; return typeof f === 'number' && f >= 0 && f <= 1 ? f : 1; };
  // the tallest keys that still fit: the keyboard may grow into the gap between the buttons and itself
  // (measured with the keys at normal height, so a keyboard left too tall by a bigger grid can't hide the overflow)
  function kbMax() {
    const acts = $('.vt-acts'), kb = $('#vtKb');
    if (!acts || !kb || $('#vtPlay').hidden) return kbNow;
    const cur = kbNow;
    applyKb(KB_MIN);
    const gap = kb.getBoundingClientRect().top - acts.getBoundingClientRect().bottom - 10; // 10 = the row gap that always stays
    applyKb(cur);
    return Math.min(KB_CAP, Math.max(KB_MIN, KB_MIN + Math.floor(gap / 3)));
  }
  function applyKb(h) {
    kbNow = h;
    const kb = $('#vtKb');
    kb.style.setProperty('--kh', h + 'px');
    kb.style.setProperty('--kf', Math.round(17 + (h - KB_MIN) * 0.18) + 'px'); // letters grow a little with the keys
  }
  function fitKb() { const max = kbMax(); applyKb(Math.round(KB_MIN + kbFit() * (max - KB_MIN))); }
  (function gripWiring() {
    const g = $('#vtGrip');
    let drag = null;
    g.addEventListener('pointerdown', e => {
      if (!R) return;
      e.preventDefault();
      drag = { y: e.clientY, h: kbNow, max: kbMax() };
      try { g.setPointerCapture(e.pointerId); } catch (err) { /* capture is a nicety */ }
      g.classList.add('on');
    });
    g.addEventListener('pointermove', e => {
      if (!drag) return;
      // drag down = shorter keys, up = taller; 3 rows share the change
      const h = Math.max(KB_MIN, Math.min(drag.max, Math.round(drag.h + (drag.y - e.clientY) / 3)));
      applyKb(h);
      if (drag.max > KB_MIN) vs.kbFit = Math.round(100 * (h - KB_MIN) / (drag.max - KB_MIN)) / 100;
    });
    const end = () => { if (!drag) return; drag = null; g.classList.remove('on'); saveVs(); };
    g.addEventListener('pointerup', end);
    g.addEventListener('pointercancel', end);
    g.addEventListener('dblclick', () => { vs.kbFit = 1; saveVs(); fitKb(); });
  })();

  // Mark a guess: 'ok' right spot, 'in' elsewhere in the word, 'no' not in the word (repeated letters counted properly)
  function mark(guess, ans) {
    const st = Array(guess.length).fill('no'), left = {};
    for (let i = 0; i < ans.length; i++) if (guess[i] === ans[i]) st[i] = 'ok'; else left[ans[i]] = (left[ans[i]] || 0) + 1;
    for (let i = 0; i < guess.length; i++) if (st[i] !== 'ok' && left[guess[i]]) { st[i] = 'in'; left[guess[i]]--; }
    return st;
  }
  function render() {
    const b = [];
    const CHEV = '<div class="vt-chev" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 3l10 9-10 9" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>'; // v08: 25% bolder (stroke 4 → 5)
    for (let r = 0; r < R.tries; r++) {
      const row = R.rows[r];
      // a large > marks the active guess row; it balances the ✕ on the right, so the grid sits centered (CD-25: 1.5.2.3)
      b.push(r === R.rows.length && !R.over ? CHEV : '<div class="vt-clr-sp"></div>');
      for (let c = 0; c < R.len; c++) {
        if (row) b.push(`<div class="vt-cell ${row.st[c]}">${row.g[c] === ' ' ? '' : row.g[c]}</div>`);
        else if (r === R.rows.length && !R.over) {
          const cell = R.cells[c], cls = ['vt-cell', 'cur'];
          if (cell.lock) cls.push('ok', 'pre'); else if (cell.ch) cls.push('typed'); else cls.push('empty');
          if (c === R.sel) cls.push('sel');
          b.push(`<div class="${cls.join(' ')}" data-c="${c}">${cell.ch}</div>`);
        } else b.push('<div class="vt-cell empty"></div>');
      }
      // ✕ at the end of the row being typed clears it (CD-24: 1.1.4); handy on phones, which have no Backspace key
      b.push(r === R.rows.length && !R.over
        ? `<button type="button" class="vt-clr" data-clr="1" aria-label="Clear this guess" title="Clear this guess"${R.cells.some(x => !x.lock && x.ch) ? '' : ' disabled'}>✕</button>`
        : '<div class="vt-clr-sp"></div>');
    }
    $('#vtBoard').innerHTML = b.join('');
    // keyboard: the best mark each letter has earned so far
    const best = {}, rank = { ok: 3, in: 2, no: 1 };
    for (const row of R.rows) row.g.split('').forEach((ch, i) => { if (ch !== ' ' && (rank[row.st[i]] || 0) > (rank[best[ch]] || 0)) best[ch] = row.st[i]; });
    // TENTATIVE LETTERS (typed, not yet entered) turn an UNPLAYED key black-on-white until Enter or removal (CD-25: 1.5.2.2.1)
    const tent = new Set(R.over ? [] : R.cells.filter(x => !x.lock && x.ch).map(x => x.ch));
    // v08b (CD-27: 4.1.1): on touch screens row 2 gets a ␣ key (the Space jump) in its one free slot, so all 3 rows keep
    // their key size; (4.1.2) ⌫ is orange with a larger black icon
    const rows = ['QWERTYUIOP', 'ASDFGHJKL_', '+ZXCVBNM-'];
    $('#vtKb').innerHTML = rows.map(r => `<div class="vt-kr">${r.split('').map(k => k === '+' ? '<button type="button" class="vt-k wide" data-k="Enter">ENTER</button>'
      : k === '-' ? '<button type="button" class="vt-k wide bksp" data-k="Backspace" aria-label="Delete">⌫</button>'
        : k === '_' ? '<button type="button" class="vt-k spc" data-k=" " aria-label="Next open square" title="Next open square">␣</button>'
          : `<button type="button" class="vt-k ${best[k] || (tent.has(k) ? 'tent' : '')}" data-k="${k}">${k}</button>`).join('')}</div>`).join('');
    $('#vtReveal').disabled = R.over || !R.cells.some(c => !c.lock);
    const rc = revealCost();
    $('#vtReveal span').innerHTML = `Reveal <span class="frac">${FRAC(R.len)}</span> 🪙${rc}`;
    $('#vtReveal').title = `Reveal one letter: 1/${R.len} of the word, for ${rc} coins (${REVEAL_WORD} coins ÷ ${R.len} letters, rounded up)`;
    $('#vtReveal').classList.toggle('poor', UI.coins && UI.coins.bal < rc);
    $('#vtQuit').disabled = R.over;
    $('#vtHint').disabled = R.over;
    // v08f (CD-37: 2.1.1): once the word is over, the button row becomes the game-over bar (same as Clue Duel's)
    const over = !!(R.over && R.resHtml);
    $('#vtPlay').classList.toggle('is-over', over);
    $('#vtOver').hidden = !over;
    $('#vtOver').innerHTML = over ? `<span class="ob-h">🏁 ${esc(R.resHead)}</span>
      <span class="ob-btns"><button class="btn" type="button" data-ob="res">📊 Results</button><button class="btn" type="button" data-ob="menu">☰ Menu</button><button class="btn primary" type="button" data-ob="again">Next word</button></span>` : '';
    $('#vtHint span').textContent = R.hints ? 'Hint ✓' : `Hint 🪙${HINT_COINS}`;
    $('#vtHint').title = R.hints ? 'Show the clue again (free)' : `Show a clue for the word (${HINT_COINS} coins)`;
    $('#vtHint').classList.toggle('poor', !R.hints && UI.coins && UI.coins.bal < HINT_COINS);
    renderClock();
  }

  // ---------- Overlay over the grid: PLAY PAUSED, the Hint, or the word you just left (CD-24) ----------
  function showOv(kind, html) {
    if (R) R.ov = kind;
    const o = $('#vtOv');
    o.className = 'vt-ov ' + kind;
    o.innerHTML = `<div class="vt-ovcard">${html}</div>`;
    o.hidden = false;
  }
  function hideOv() { if (R) R.ov = null; $('#vtOv').hidden = true; }
  function dismissOv() {
    if (!R || !R.ov) return;
    if (R.ov === 'pause') return setPaused(false);
    if (R.ov === 'gate') { R.gate = false; hideOv(); renderClock(); return; }
    hideOv();
  }
  // While an overlay is up, a tap or click anywhere (in or outside the grid) closes it and does nothing else
  document.addEventListener('click', e => {
    if (!R || !R.ov || !screenOn() || !$('#modal').hidden) return;
    e.preventDefault(); e.stopPropagation();
    dismissOv();
  }, true);

  // ---------- Pause (CD-24: 1.1.1.1): the button is the clock ----------
  function setPaused(on) {
    if (!R || R.over || R.gate || on === R.paused) return;
    R.paused = on;
    $('#vtPlay').classList.toggle('paused', on);
    if (on) showOv('pause', '<div class="vt-ov-big">PLAY PAUSED</div><div class="vt-ov-s">Tap anywhere to resume</div>');
    else hideOv();
    renderClock();
  }
  $('#vtClock').addEventListener('click', () => { if (R && !R.over) setPaused(!R.paused); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && R && !R.over && screenOn()) setPaused(true); });

  // ---------- Hint: the word's clue over the grid; seeing it again is free (CD-24: 1.1.5).
  // v08 (CD-26: 3.1): it costs 5 coins instead of 5 points ----------
  const HINT_COINS = 5;
  $('#vtHint').addEventListener('click', () => {
    if (!R || R.over) return;
    if (!R.hints) {
      if (UI.armTap && UI.coins && UI.coins.bal >= HINT_COINS && !UI.armTap($('#vtHint'), HINT_COINS)) return; // v08c: second tap buys
      if (UI.coins && !UI.coins.spend(HINT_COINS, `${title()} Hint`)) return;
      R.hints = 1; toast(`Hint · 🪙−${HINT_COINS}`);
    }
    const c = R.hint;
    showOv('hint', `<div class="vt-ov-h">🔎 Hint</div>${c.pic ? `<div class="vt-ov-pic">${esc(c.pic)}</div>` : ''}<div class="vt-ov-t">${esc(c.t)}</div>
      <div class="vt-ov-s">Tap anywhere to close · Hint ✓ shows it again for free</div>`);
    render();
  });
  function clearRow() {
    if (!R || R.over) return;
    R.cells.forEach(c => { if (!c.lock) c.ch = ''; });
    R.sel = firstOpen(0);
    render();
  }

  // ---------- Typing and selecting squares (JM, CD-23: 1.1.1.4–6) ----------
  function key(k) {
    if (!R || R.over || R.paused || R.gate || !$('#modal').hidden) return;
    if (k === 'Enter') return submit();
    // Space bar (v08, JM CD-26): the next open square to the right in the active row, wrapping from the last back to
    // the first. "Open" = not a locked (carried-forward green or revealed) letter, so typed letters can be revisited.
    if (k === ' ') {
      for (let n = 1; n <= R.len; n++) { const j = ((R.sel < 0 ? -1 : R.sel) + n) % R.len; if (editable(j)) { R.sel = j; break; } }
      return render();
    }
    if (k === 'ArrowLeft' || k === 'ArrowRight') {
      const d = k === 'ArrowLeft' ? -1 : 1;
      for (let i = R.sel + d; i >= 0 && i < R.len; i += d) if (editable(i)) { R.sel = i; break; }
      if (R.sel < 0) R.sel = firstOpen(0);
      return render();
    }
    if (k === 'Backspace') {
      if (editable(R.sel) && R.cells[R.sel].ch) R.cells[R.sel].ch = '';
      else { for (let i = (R.sel < 0 ? R.len : R.sel) - 1; i >= 0; i--) if (editable(i)) { R.sel = i; R.cells[i].ch = ''; break; } }
      return render();
    }
    if (/^[A-Z]$/.test(k)) {
      if (!editable(R.sel)) R.sel = firstOpen(0);
      if (R.sel < 0) return;
      R.cells[R.sel].ch = k;
      const nx = firstOpen(R.sel + 1);
      if (nx >= 0) R.sel = nx; // otherwise stay on the square just typed
      render();
    }
  }
  $('#vtBoard').addEventListener('click', e => {
    if (e.target.closest('[data-clr]')) return clearRow();
    const c = e.target.closest('.vt-cell.cur');
    if (!c || !R || R.over) return;
    const i = +c.dataset.c;
    if (editable(i)) { R.sel = i; render(); }
  });
  function shakeRow() {
    document.querySelectorAll('#vtBoard .vt-cell.cur').forEach(c => { c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake'); });
  }
  function submit() {
    const g = R.cells.map(c => c.ch).join('');
    if (g.length < R.len) { toast(`Fill all ${R.len} squares`, 'bad'); shakeRow(); return; }
    words();
    if (!GUESS[R.len].has(g)) { toast(`${g} isn't in the word list`, 'bad'); shakeRow(); return; }
    addRow(g);
  }
  function addRow(g) {
    const st = mark(g, R.a.w);
    R.rows.push({ g, st });
    const tm = timerOf(R.timer);
    R.lastLeft = R.left; // v08: the time left when this guess went in (the time bonus and speed coins use it)
    if (tm.kind === 'guess') R.left = tm.ms; // each guess gets a fresh clock
    if (g === R.a.w) return finish(true);
    if (R.rows.length >= R.tries) return finish(false);
    newRow();
    render();
  }
  // Reveal: one more letter, placed and locked in its spot.
  // v08b (JM CD-27: 1.7b, 1.7.1): it costs coins, priced by how much of the word one letter gives away. The WHOLE word is
  // worth 40 coins, so each letter costs its share: 40 ÷ letters, rounded up. The button shows the share and the price:
  // ¹⁄₄ 🪙10 · ¹⁄₅ 🪙8 · ¹⁄₆ 🪙7 · ¹⁄₇ 🪙6 · ¹⁄₈ 🪙5. (A letter of a 4-letter word gives away twice as much as one of an 8-letter word.)
  const REVEAL_WORD = 40;
  const revealCost = () => Math.ceil(REVEAL_WORD / (R ? R.len : 5));
  const SUB = '₀₁₂₃₄₅₆₇₈₉';
  const FRAC = n => '¹⁄' + String(n).split('').map(d => SUB[+d]).join('');
  $('#vtReveal').addEventListener('click', () => {
    if (!R || R.over) return;
    const opts = []; for (let i = 0; i < R.len; i++) if (!R.cells[i].lock) opts.push(i);
    if (opts.length <= 1 && R.cells.filter(c => !c.lock).length <= 1) { toast('Nothing left to reveal'); return; }
    const cost = revealCost();
    if (UI.armTap && UI.coins && UI.coins.bal >= cost && !UI.armTap($('#vtReveal'), cost)) return; // v08c: second tap buys
    if (UI.coins && !UI.coins.spend(cost, `${title()} Reveal (1/${R.len})`)) return;
    const i = opts[Math.floor(Math.random() * opts.length)];
    R.revealed.set(i, R.a.w[i]); R.reveals++; R.revealCoins = (R.revealCoins || 0) + cost;
    R.cells[i] = { ch: R.a.w[i], lock: true };
    if (R.sel === i || R.sel < 0) R.sel = firstOpen(i);
    toast(`Letter ${i + 1} is ${R.a.w[i]} · 🪙−${cost}`);
    render();
  });
  $('#vtNew').addEventListener('click', () => newWord(false));
  $('#vtQuit').addEventListener('click', () => {
    if (R && !R.over) askSure('Give up this word?', 'It counts as not solved, and the word is shown.', '🏳️ Give up', () => { if (R && !R.over) finish(false, true); });
  });

  // ---------- Clock: counts down in timed games and up in untimed ones. It stops while paused, while a window is open,
  // while the app is hidden, and until the word-you-left window is tapped away. ----------
  const running = () => R && !R.over && !R.paused && !R.gate && !document.hidden && screenOn() && $('#modal').hidden;
  function startClock() {
    clearInterval(R.tId);
    const tm = timerOf(R.timer);
    $('#vtClock').hidden = false;
    renderClock();
    let last = Date.now();
    R.tId = setInterval(() => {
      const now = Date.now(), dt = now - last; last = now;
      if (!running()) return;
      R.used += dt;
      if (tm.kind !== 'none') R.left = Math.max(0, R.left - dt);
      renderClock();
      if (tm.kind !== 'none' && R.left <= 0) {
        if (tm.kind === 'guess') { toast('Time\'s up for that guess', 'bad'); addRow(R.cells.map(c => c.ch || ' ').join('')); }
        else { toast('Time\'s up!', 'bad'); finish(false); }
      }
    }, 250);
  }
  function renderClock() {
    const c = $('#vtClock');
    if (!R || c.hidden) return;
    const timed = timerOf(R.timer).kind !== 'none';
    const s = timed ? Math.ceil(R.left / 1000) : Math.floor(R.used / 1000);
    $('#vtClockTxt').textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    $('#vtPauseIco').textContent = R.paused ? '▶️' : '⏸️';
    c.title = R.paused ? 'Resume' : 'Pause';
    c.setAttribute('aria-label', c.title);
    c.classList.toggle('on', R.paused);
    c.disabled = R.over;
    const live = timed && !R.over && !R.paused && !R.gate;
    c.classList.toggle('low', live && s <= 10);
    setFlash(live && R.left > 0 && s <= 10 ? s : 0);
  }
  // Last 10 seconds: the grid's border flashes once a second, yellow for 10–6 and red for 5–1, as in the main game (CD-24: 1.1.1.2)
  let flashSec = 0;
  function setFlash(s) {
    if (s === flashSec) return;
    flashSec = s;
    const b = $('#vtBoard');
    b.classList.remove('tf-y', 'tf-r', 'tf-a', 'tf-b');
    if (s >= 1 && s <= 10) b.classList.add(s > 5 ? 'tf-y' : 'tf-r', s % 2 ? 'tf-a' : 'tf-b');
  }

  // ---------- Scoring and the result ----------
  function score(won) {
    if (!won) return { total: 0, rows: [] };
    const w = R.a.w, rows = [];
    const word = R.scoring === 'flat' ? 2 * w.length : w.split('').reduce((a, ch) => a + VAL[ch], 0) + 2 * w.length;
    rows.push([R.scoring === 'flat' ? `${w} (2 per letter)` : `${w} (letters + 2 per letter)`, word]);
    const spare = R.tries - R.rows.length;
    if (spare) rows.push([`Guesses to spare ×${spare}`, 5 * spare]);
    const tm = timerOf(R.timer);
    // v08: the time left when the winning guess went in (with a per-guess clock, R.left has already been reset)
    if (tm.kind !== 'none') { const tb = Math.min(30, Math.floor(R.lastLeft / 5000)); if (tb) rows.push(['Time bonus (1 per 5 s left)', tb]); }
    // v08b: Reveal costs coins now, not points
    return { total: Math.max(0, rows.reduce((a, r) => a + r[1], 0)), rows };
  }
  // Coins for a solved word (v08, CD-26: 3.1): 2 per letter + 2 per guess to spare; timed rounds add speed coins,
  // 1 per second left on the clock when the word was solved (up to 20 per letter). Untimed rounds pay no speed coins.
  function coinsFor() {
    const C = UI.COIN || { vaultLetter: 2, vaultSpare: 2, perTile: 20 };
    const rows = [[`${R.len} letters`, C.vaultLetter * R.len]];
    const spare = R.tries - R.rows.length;
    if (spare) rows.push([`${spare} guess${spare > 1 ? 'es' : ''} to spare`, C.vaultSpare * spare]);
    if (timerOf(R.timer).kind !== 'none') { const sp = Math.min(C.perTile * R.len, Math.floor(R.lastLeft / 1000)); if (sp) rows.push(['Speed', sp]); }
    return { total: rows.reduce((a, r) => a + r[1], 0), rows };
  }
  function recordLoss() { stats.played++; stats.streak = 0; stats.dist.X = (stats.dist.X || 0) + 1; saveStats(); }
  function finish(won, gaveUp) {
    R.over = true; R.won = won;
    clearInterval(R.tId);
    hideOv(); setFlash(0);
    const ms = R.used;
    const sc = score(won);
    sc.coins = won ? coinsFor() : null;
    if (sc.coins && UI.coins) UI.coins.add(sc.coins.total, `${title()}: ${R.a.w}`);
    R.coinsEarned = sc.coins ? sc.coins.total : 0; // v08c: for the Game History
    if (won) {
      stats.played++; stats.won++; stats.streak++; stats.best = Math.max(stats.best, stats.streak);
      stats.dist[R.rows.length] = (stats.dist[R.rows.length] || 0) + 1;
      stats.points += sc.total; stats.top = Math.max(stats.top, sc.total);
      if (!stats.bestMs || ms < stats.bestMs) stats.bestMs = ms;
      saveStats();
    } else recordLoss();
    render();
    if (won) { celebrate(); setTimeout(() => showResult(won, gaveUp, sc, ms), 2100); }
    else setTimeout(() => showResult(won, gaveUp, sc, ms), 400);
  }
  // 2-second celebration (JM, CD-23: 1.1.1.7): a cheer and confetti
  const CHEERS = ['Congratulations!', 'You did it!', 'Vault cracked!', 'Brilliant!', 'Nailed it!', 'Superb!', 'Word wizard!', 'Bravo!'];
  function celebrate() {
    const ov = document.createElement('div');
    ov.className = 'vt-party';
    const colors = ['#00C853', '#FFFF00', '#2c6bd8', '#ff7a00', '#e91e63', '#ffffff'];
    let bits = '';
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) for (let i = 0; i < 90; i++) {
      const x = Math.random() * 100, dx = (Math.random() - 0.5) * 40, d = 1.2 + Math.random() * 0.8, delay = Math.random() * 0.35, r = Math.random() * 720 - 360;
      bits += `<i style="left:${x}vw;background:${colors[i % colors.length]};--dx:${dx}vw;--r:${r}deg;animation-duration:${d}s;animation-delay:${delay}s"></i>`;
    }
    ov.innerHTML = `<div class="vt-cheer">${CHEERS[Math.floor(Math.random() * CHEERS.length)]}</div>${bits}`;
    document.body.appendChild(ov);
    setTimeout(() => ov.remove(), 2000);
  }
  const fmt = ms => { const s = Math.round(ms / 1000); return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${s % 60}s`; };
  // v08b (CD-27: 2.4.1): coins on the result get their own table: earned rows, then spent rows, then the balance
  function coinTable(earned) {
    const rows = (earned ? earned.rows.map(r => [r[0], r[1]]) : []);
    if (R.hints) rows.push(['Hint', -HINT_COINS]);
    if (R.reveals) rows.push([`Reveal ×${R.reveals}`, -(R.revealCoins || 0)]);
    if (!rows.length) return '';
    const net = rows.reduce((a, r) => a + r[1], 0);
    return `<h3 class="res-h">🪙 Coins</h3><table class="score-table coin-tbl">${rows.map(r => `<tr><td>${esc(r[0])}</td><td class="${r[1] < 0 ? 'neg' : 'pos'}">${r[1] < 0 ? '−' + -r[1] : '+' + r[1]}</td></tr>`).join('')}`
      + `<tr class="total"><td>This word ${net < 0 ? '−' + -net : '+' + net} · Balance</td><td data-coins>${UI.coins ? UI.coins.bal : ''}</td></tr></table>`;
  }
  // v08c (JM CD-30: 4.5): every finished word goes into the shared Game History (with a copy of its result window)
  function addHistory(head, score, body) {
    if (!UI.history || !R || R.histSaved) return;
    R.histSaved = true;
    const coins = (R.won && R.coinsEarned ? R.coinsEarned : 0) - (R.hints ? HINT_COINS : 0) - (R.revealCoins || 0);
    const tl = (TIMERS.find(t => t[0] === R.timer) || [0, ''])[1];
    UI.history.add({ g: 'vault', win: !!R.won, title: `${title()} · ${head}`,
      sub: [`Level ${R.level || vs.level}`, `${R.len} letters × ${R.tries}`, tl].filter(Boolean).join(' · '), score, coins, html: body });
  }
  function showResult(won, gaveUp, sc, ms) {
    const w = R.a.w, pct = stats.played ? Math.round(100 * stats.won / stats.played) : 0;
    const keys = []; for (let i = 1; i <= 10; i++) if (stats.dist[i]) keys.push(String(i)); if (stats.dist.X) keys.push('X');
    const maxN = Math.max(1, ...keys.map(k => stats.dist[k]));
    // Guesses needed (CD-24: 1.2.1): one row per number of guesses; the bar's number = words solved in that many guesses
    const tip = k => { const n = stats.dist[k], wd = n === 1 ? 'word' : 'words'; return k === 'X' ? `Not solved: ${n} ${wd}` : `Solved in ${k} ${+k === 1 ? 'guess' : 'guesses'}: ${n} ${wd}`; };
    const bars = keys.map(k => `<div class="vt-bar" title="${tip(k)}"><span class="k">${k === 'X' ? '✗' : k}</span><span class="b${(won && +k === R.rows.length) || (!won && k === 'X') ? ' me' : ''}${k === 'X' ? ' x' : ''}" style="width:${Math.max(8, Math.round(100 * stats.dist[k] / maxN))}%">${stats.dist[k]}</span></div>`).join('');
    // v08e (JM CD-36: 5.3, 5.3.1): the same layout as Clue Duel's result: a one-line heading (big emoji + title), pairs of
    // tables side by side on wide screens, the Guesses-needed note behind ⓘ, and a button bar pinned to the bottom
    const sec = s => s ? `<section>${s}</section>` : '';
    const pts = won ? `<h3 class="res-h">🏅 Points</h3><table class="score-table vt-sc">${sc.rows.map(r => `<tr><td>${esc(r[0])}</td><td>${r[1] < 0 ? '−' + Math.abs(r[1]) : '+' + r[1]}</td></tr>`).join('')}<tr class="total"><td>Score</td><td>${sc.total}</td></tr></table>` : '';
    const [face, head] = won ? ['🔓', 'Vault cracked!'] : gaveUp ? ['🏳️', 'You gave up'] : ['🔒', 'The Vault stays shut'];
    const body = `
      <div class="res-top"><span class="res-face">${face}</span><span class="res-title">${head}</span></div>
      <div class="vt-res-w">${w.split('').map(ch => `<span>${ch}</span>`).join('')}</div>
      ${R.hint && R.hint.t ? `<p class="res-sub">Clue: ${esc(R.hint.t)}</p>` : ''}
      <div class="res-cols">${sec(pts)}${sec(coinTable(sc.coins))}</div>
      <div class="res-cols"><section>
      <h3 class="res-h">📊 Your stats</h3>
      <div class="vt-res-stats">
        <div><b>${fmt(ms)}</b><span>Time</span></div><div><b>${stats.bestMs ? fmt(stats.bestMs) : '–'}</b><span>Best time</span></div>
        <div><b>${stats.played}</b><span>Played</span></div><div><b>${pct}%</b><span>Solved</span></div>
        <div><b>${stats.streak}</b><span>Streak</span></div><div><b>${stats.best}</b><span>Best streak</span></div>
      </div></section>
      ${bars ? `<section><h3 class="res-h">🎯 Guesses needed</h3><div class="vt-dist">${bars}</div>
        <details class="res-info"><summary>ⓘ What do the bars mean?</summary><p class="vt-dist-note">Each row is a number of guesses (✗ = not solved). Its bar shows how many words you've solved in that many guesses, so a longer bar means it happens more often. The highlighted bar is this word.</p></details></section>` : ''}</div>`;
    addHistory(won ? `Solved ${w} in ${R.rows.length}/${R.tries}` : `${gaveUp ? 'Gave up' : 'Not solved'}: ${w}`, won ? `${sc.total} pts` : '—', body);
    R.resHtml = body;
    R.resHead = `${face} ${head} · ${w}`;
    render(); // the game-over bar replaces the button row
    openResult();
  }
  // v08f (JM CD-37: 2.1, 3.1): the same three buttons as Clue Duel's result: ⚙ Settings · ☰ Menu · Next word.
  // ✕ or a tap outside closes it and shows the finished grid with its game-over bar (📊 Results reopens it).
  function openResult() {
    if (!R || !R.over || !R.resHtml) return;
    openModal(`${R.resHtml}
      <div class="row res-bar"><button class="btn" data-a="setup">⚙ Settings</button><button class="btn" data-a="menu">☰ Menu</button><button class="btn primary" data-a="again">Next word</button></div>`, 'res', { close: render });
    $('#sheet').onclick = e => {
      const b = e.target.closest('[data-a]'); if (!b) return;
      closeModal();
      overAction(b.dataset.a);
    };
  }
  function overAction(a) {
    if (a === 'again') start();
    else if (a === 'menu') $('#vtMenu').click();
    else if (a === 'res') openResult();
    else openSettings();
  }
  $('#vtOver').addEventListener('click', e => { const b = e.target.closest('[data-ob]'); if (b) overAction(b.dataset.ob); });

  // ---------- Help ----------
  function help() {
    // v08f (JM CD-37: 5.1): the same collapsible sections (▸/▾, one open at a time) as Clue Duel's How To Play
    const sec = UI.helpSec;
    openModal(`<h2>How To Play: ${esc(title())}</h2>
      <p class="help-note">Tap a heading to open it.</p>
      <div class="vt-help">
      ${sec('The Basics', `
        <li>Guess the hidden word. Type a word (on screen or your keyboard) and press <b>ENTER</b>. Every guess must be a real word of the right length.</li>
        <li>Each letter of your guess is then marked: <span class="vt-chip ok">green</span> right letter in the right spot, <span class="vt-chip in">yellow</span> in the word but in another spot, <span class="vt-chip no">red</span> not in the word. The keyboard keeps the best mark for each letter.</li>
        <li>Green letters carry into your next guess automatically, and typing starts at the first open square.</li>
        <li>When the word is over, the result window opens. Close it (✕, or tap outside it) to see the finished grid; the bar under it has <b>📊 Results</b>, <b>☰ Menu</b> and <b>Next word</b>.</li>`)}
      ${sec('Typing and the Keys', `
        <li>Tap a square (or use the ← → arrow keys) to choose where the next letter goes; the chosen square glows blue. The <b>Space bar</b> (on phones and tablets, the <b>␣</b> key at the end of the middle row) jumps to the next open square to the right (after the last one, back to the first). The orange <b>⌫</b> clears a letter, and <b>✕</b> at the end of the row clears the whole guess.</li>
        <li><b>Key size:</b> the keys grow on their own to fill the space below the buttons, so fewer guesses (a shorter grid) give taller keys, up to twice the normal height. To make them shorter, drag the <b>⇕</b> handle at the right end of the button row down (drag up to raise them again); double-click (or double-tap) it for the tallest keys. Your choice is remembered on this device and follows the grid's size.</li>`)}
      ${sec('The Buttons', `
        <li>The buttons come in two groups: the <b>blue coin buttons</b> (🔎 Hint, 💡 Reveal) on the left, and the <b>gray round game buttons</b> (🆕 New Game, 🏳️ Give up) on the right. A coin button takes <b>two taps</b>: the first lights it up and shows "Tap again · 🪙N" for 3 seconds; the second tap buys. (Seeing a Hint again is free and needs one tap.)</li>
        <li><b>💡 Reveal</b> places one letter in its spot. Its price is that letter's share of the word: the whole word is worth <b>40 coins</b>, so one letter costs 40 ÷ the number of letters (rounded up). The button shows both, like <b>Reveal ¹⁄₅ 🪙8</b> for a 5-letter word: ¹⁄₄ 🪙10 · ¹⁄₅ 🪙8 · ¹⁄₆ 🪙7 · ¹⁄₇ 🪙6 · ¹⁄₈ 🪙5. A letter of a short word gives away more, so it costs more.</li>
        <li><b>🔎 Hint (🪙${HINT_COINS})</b> shows a clue for the word (sometimes with a picture) over the grid; tap anywhere to close it. It costs ${HINT_COINS} <b>coins</b>, not points. Once paid for, <b>Hint ✓</b> shows it again for free.</li>
        <li>The Hint follows the <b>Challenge Level</b>: at 1–3 it is direct and simple (mostly one word, like "Froth" for FOAM); at 4–7 you get a mix that grows trickier as the level rises; at 8–10 it is a <b>short, sly</b> hint of one to three words, like "Tree-hanger" for UNAU or "River horse"-style nicknames.</li>
        <li><b>🆕 New Game</b> starts a fresh word. <b>🏳️ Give up</b> shows the word. Both ask first while the word is unfinished ("Keep playing" is the main button). Either one, once you've made a guess or used a Hint or Reveal, counts that word as not solved and breaks your streak. After every New Game, the word that just ended is shown over the new grid until you click or tap anywhere; the new word's clock starts then.</li>
        <li><b>⏸️ Pause:</b> tap the clock. The grid is hidden until you tap anywhere. The clock counts down in timed games and counts up in untimed ones. In the last 10 seconds the grid's border flashes yellow, then red.</li>`)}
      ${sec('Coins', `
        <li><b>🪙 Coins</b> (one currency with Clue Duel; your balance shows beside the line above the grid): every word you solve pays <b>2 per letter</b> and <b>2 per guess to spare</b>. Timed rounds add <b>speed coins</b>: 1 for every second left on the clock when you solve it, up to 20 per letter. Untimed rounds pay no speed coins.</li>`)}
      ${sec('Settings', `
        <li><b>Challenge Level</b> (1–10) sets how hard the vocabulary is: everyday words at 1–3, rarer ones as it rises.</li>
        <li><b>Letters</b> (4–8) and <b>Guesses</b> (5–10) set the word's length and how many tries you get.</li>
        <li><b>Timer:</b> the main game's choices. "Per GUESS" gives each guess its own clock (when it runs out, that guess is used up); "per WORD" times the whole round. The clock stops while a window is open or the app is hidden.</li>
        <li><b>Scoring</b> (only when you solve it): <b>Classic</b> scores the word's letter values (as in the main game) plus 2 per letter; <b>Flat</b> scores 2 per letter. Both add <b>+5</b> for every guess you didn't need and, in timed rounds, a time bonus (1 point per 5 seconds left, up to 30). (Hint and Reveal cost coins, not points.)</li>
        <li><b>⚙ Settings</b> (in the header, or tap the line above the grid) change the game at any time; changes apply from the next word.</li>`)}
      ${sec('Your Stats', `
        <li>Your stats (played, solved %, streaks, best time, guesses needed) are kept on this device. Every finished word also goes into <b>📜 Game History</b> on the menu, where you can reopen its full result.</li>
        <li><b>Guesses needed</b> (on the result window): one row for each number of guesses, from 1 up, plus ✗ for words not solved. The bar and its number show how many words you've solved in that many guesses, so your longest bar is your usual result. The highlighted bar is the word just played. On a computer, point at a row to see it in words. Tap <b>ⓘ</b> under the bars to read this there.</li>`)}
      ${sec('Make It Yours', `
        <li>Double-click (or double-tap) the title to rename the game, and tap the icon beside it to choose another or to upload your own picture. Both are remembered on this device.</li>`)}
      </div>
      <div class="row"><button class="btn primary" data-a="ok">Close</button></div>`);
    $('#sheet').onclick = e => { if (UI.helpClick(e)) return; if (e.target.closest('[data-a]')) closeModal(); };
  }

  // ---------- Name and icon ----------
  $('#vtTitle').addEventListener('dblclick', () => {
    const h = $('#vtTitle');
    if (h.querySelector('input')) return;
    h.innerHTML = `<input type="text" maxlength="20" value="${esc(title())}" aria-label="Game name">`;
    const inp = h.querySelector('input');
    inp.focus(); inp.select();
    let saved = false;
    const done = () => { if (saved) return; saved = true; vs.name = inp.value.trim().slice(0, 20); saveVs(); renderHead(); };
    inp.addEventListener('blur', done);
    inp.addEventListener('keydown', e => { if (e.key === 'Escape') inp.value = title(); if (e.key === 'Enter' || e.key === 'Escape') done(); e.stopPropagation(); });
  });
  // Icons (CD-24 other edits 1.1–1.2): a longer list, plus your own picture (shrunk to fit, kept on this device)
  const MORE_ICONS = ['🛡️', '🏆', '🥇', '🪙', '💵', '🎖️', '🔮', '🧭', '🗺️', '🏰', '⚔️', '🕵️', '🦉', '🐉', '🦊', '🐺', '🦅', '🐙', '🐧', '🐨',
    '🧠', '✨', '⚡', '🌟', '🎓', '📜', '✏️', '🖋️', '🔍', '🧪', '🎹', '🎮', '🕹️', '🏝️', '🌋', '⛰️', '🍩', '🍓', '🍉', '🎃'];
  const ICONS = [...new Set(['🔐', '🔒', '🗝️', '🔑', '💰', '💎', '🏦', '🧩', '🎁', '📦'].concat(MORE_ICONS, UI.AVATARS))];
  function iconHTML() { return vs.icon === 'custom' && vs.custom ? `<img src="${vs.custom}" alt="">` : esc(vs.icon || '🔐'); }
  function shrinkPicture(file, done) {
    const rd = new FileReader();
    rd.onload = () => {
      const img = new Image();
      img.onload = () => {
        const S = 128, cv = document.createElement('canvas'); cv.width = cv.height = S;
        const k = Math.max(S / img.width, S / img.height), w = img.width * k, h = img.height * k; // fill the square, cropping the middle
        cv.getContext('2d').drawImage(img, (S - w) / 2, (S - h) / 2, w, h);
        let url = cv.toDataURL('image/png');
        if (url.length > 60000) url = cv.toDataURL('image/jpeg', 0.85);
        done(url);
      };
      img.onerror = () => toast('That picture could not be opened', 'bad');
      img.src = rd.result;
    };
    rd.readAsDataURL(file);
  }
  $('#vtAv').addEventListener('click', () => {
    openModal(`<h2>Choose an icon</h2>
      <div class="vt-upl"><button type="button" class="btn" data-a="upload">📷 Upload your own picture</button>
        ${vs.custom ? `<button type="button" data-av="custom" class="vt-mine ${vs.icon === 'custom' ? 'on' : ''}" title="Your picture"><img src="${vs.custom}" alt="Your picture"></button>` : ''}
        <input type="file" id="vtFile" accept="image/*" hidden></div>
      <div class="av-grid">${ICONS.map(a => `<button type="button" data-av="${a}" class="${a === vs.icon ? 'on' : ''}">${a}</button>`).join('')}</div>
      <div class="row"><button class="btn" data-a="close">Cancel</button></div>`);
    $('#modal').onclick = e => { if (e.target === $('#modal')) closeModal(); };
    $('#vtFile').addEventListener('change', e => {
      const f = e.target.files && e.target.files[0]; if (!f) return;
      shrinkPicture(f, url => {
        const old = { icon: vs.icon, custom: vs.custom };
        vs.custom = url; vs.icon = 'custom';
        try { localStorage.setItem('cd.vault.settings', JSON.stringify(vs)); } catch (err) { Object.assign(vs, old); toast('Not enough room to save that picture', 'bad'); return; }
        renderHead(); closeModal(); toast('Your picture is set');
      });
    });
    $('#sheet').onclick = e => {
      const b = e.target.closest('[data-av],[data-a]'); if (!b) return;
      if (b.dataset.a === 'upload') { $('#vtFile').click(); return; }
      if (b.dataset.av) { vs.icon = b.dataset.av; saveVs(); renderHead(); }
      closeModal();
    };
  });

  // ---------- Wiring ----------
  $('#vtStart').addEventListener('click', start);
  $('#vtHelp').addEventListener('click', help);
  $('#vtSet').addEventListener('click', openSettings);
  $('#vtInfo').addEventListener('click', e => { if (e.target.closest('#vtInfoBtn')) openSettings(); });
  $('#vtMenu').addEventListener('click', () => {
    if (R && !R.over) { setPaused(true); clearInterval(R.tId); } // the round waits, paused; reopening the Vault shows PLAY PAUSED
    document.title = `Clue Duel · ${UI.APP_VER}`;
    UI.goHome();
  });
  $('#vtKb').addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (b) key(b.dataset.k); });
  document.addEventListener('keydown', e => {
    if (!screenOn() || e.ctrlKey || e.metaKey || e.altKey || /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName || '')) return;
    // an open overlay: any key closes it (PLAY PAUSED and the word-you-left window swallow that key; the Hint lets it through)
    if (R && R.ov && $('#modal').hidden) {
      if (R.ov !== 'hint') { e.preventDefault(); dismissOv(); return; }
      hideOv();
    }
    const k = ['Enter', 'Backspace', 'ArrowLeft', 'ArrowRight'].includes(e.key) ? e.key : e.key.length === 1 ? e.key.toUpperCase() : '';
    if (k) { e.preventDefault(); key(k); }
  });
  window.WordVault = { open: () => { open(); if (R && !R.over) startClock(); } };
})();
