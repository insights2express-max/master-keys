/* Clue Duel — Word Vault (v07d): a word-guessing mini-game (JM, CD-12: 4.2.1; CD-13: 4.x; CD-18: 7.1a; CD-21: 5.1–5.3; CD-23).
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
      if (n >= 4 && n <= 7 && GUESS[n].has(e.w)) ANS[n].push({ w: e.w, l: e.l, c: e.e });
    }
    for (const line of String(window.VAULT_EIGHT || '').split('\n')) {
      const [w, l] = line.split('|');
      if (w && w.length === 8) ANS[8].push({ w, l: +l || 1, c: '' });
    }
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
  const TIMERS = [['0', 'Untimed'], ['t30', 'Blitz · 30 s a guess'], ['t60', '1 min a guess'], ['t120', '2 min a guess'], ['t180', '3 min a guess'],
    ['t300', '5 min a guess'], ['g120', '2 min a word'], ['g180', '3 min a word'], ['g300', '5 min a word'], ['g600', '10 min a word'], ['g900', '15 min a word']];
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
    classic: 'Solve to score the word\'s letter values plus 2 per letter, +5 for every guess you didn\'t need, and a time bonus in timed games. Each Reveal costs 3.',
    flat: 'Solve to score 2 per letter, +5 for every guess you didn\'t need, and a time bonus in timed games. Each Reveal costs 3.'
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
    $('#vtAv').textContent = vs.icon;
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
      <div class="row"><button class="btn" data-a="close">Done</button><button class="btn primary" data-a="new">New word with these</button></div>`);
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
  function newWord(confirmed) {
    if (R && !R.over && R.rows.length && !confirmed) {
      openModal(`<h2>Start a new word?</h2><p>This word will count as not solved.</p>
        <div class="row"><button class="btn" data-a="no">Keep playing</button><button class="btn primary" data-a="yes">New word</button></div>`);
      $('#modal').onclick = e => { if (e.target === $('#modal')) closeModal(); };
      $('#sheet').onclick = e => { const b = e.target.closest('[data-a]'); if (!b) return; closeModal(); if (b.dataset.a === 'yes') newWord(true); };
      return;
    }
    if (R && !R.over && R.rows.length) { R.over = true; clearInterval(R.tId); recordLoss(); }
    if (R) clearInterval(R.tId);
    start();
  }

  // ---------- Round ----------
  function start() {
    const a = pickWord();
    R = { a, rows: [], cells: [], sel: 0, over: false, won: false, revealed: new Map(), reveals: 0, tStart: Date.now(), left: timerOf(vs.timer).ms, tId: 0,
      len: vs.len, tries: vs.tries, timer: vs.timer, scoring: vs.scoring, level: vs.level };
    newRow();
    showPlay();
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
    $('#vtInfo').innerHTML = `<button type="button" class="vt-infobtn" id="vtInfoBtn" title="Change settings">Level ${R.level} · ${R.len} letters · ${R.tries} guesses · ${R.scoring === 'flat' ? 'Flat' : 'Classic'} ⚙</button>`;
    sizeBoard();
    render();
  }
  function sizeBoard() {
    if (!R) return;
    const main = $('.vt-main'), kbH = 3 * 52 + 70;
    const w = Math.min(main.clientWidth - 24, 460), h = main.clientHeight - kbH - 60;
    const cell = Math.max(26, Math.min(64, Math.floor((w - (R.len - 1) * 6) / R.len), Math.floor((h - (R.tries - 1) * 6) / R.tries)));
    $('#vtBoard').style.setProperty('--vc', cell + 'px');
    $('#vtBoard').style.gridTemplateColumns = `repeat(${R.len}, var(--vc))`;
  }
  window.addEventListener('resize', () => { if (screenOn() && R) sizeBoard(); });

  // Mark a guess: 'ok' right spot, 'in' elsewhere in the word, 'no' not in the word (repeated letters counted properly)
  function mark(guess, ans) {
    const st = Array(guess.length).fill('no'), left = {};
    for (let i = 0; i < ans.length; i++) if (guess[i] === ans[i]) st[i] = 'ok'; else left[ans[i]] = (left[ans[i]] || 0) + 1;
    for (let i = 0; i < guess.length; i++) if (st[i] !== 'ok' && left[guess[i]]) { st[i] = 'in'; left[guess[i]]--; }
    return st;
  }
  function render() {
    const b = [];
    for (let r = 0; r < R.tries; r++) {
      const row = R.rows[r];
      for (let c = 0; c < R.len; c++) {
        if (row) b.push(`<div class="vt-cell ${row.st[c]}">${row.g[c] === ' ' ? '' : row.g[c]}</div>`);
        else if (r === R.rows.length && !R.over) {
          const cell = R.cells[c], cls = ['vt-cell', 'cur'];
          if (cell.lock) cls.push('ok', 'pre'); else if (cell.ch) cls.push('typed');
          if (c === R.sel) cls.push('sel');
          b.push(`<div class="${cls.join(' ')}" data-c="${c}">${cell.ch}</div>`);
        } else b.push('<div class="vt-cell empty"></div>');
      }
    }
    $('#vtBoard').innerHTML = b.join('');
    // keyboard: the best mark each letter has earned so far
    const best = {}, rank = { ok: 3, in: 2, no: 1 };
    for (const row of R.rows) row.g.split('').forEach((ch, i) => { if (ch !== ' ' && (rank[row.st[i]] || 0) > (rank[best[ch]] || 0)) best[ch] = row.st[i]; });
    const rows = ['QWERTYUIOP', 'ASDFGHJKL', '+ZXCVBNM-'];
    $('#vtKb').innerHTML = rows.map(r => `<div class="vt-kr">${r.split('').map(k => k === '+' ? '<button type="button" class="vt-k wide" data-k="Enter">ENTER</button>'
      : k === '-' ? '<button type="button" class="vt-k wide" data-k="Backspace" aria-label="Delete">⌫</button>'
        : `<button type="button" class="vt-k ${best[k] || ''}" data-k="${k}">${k}</button>`).join('')}</div>`).join('');
    $('#vtReveal').disabled = R.over || !R.cells.some(c => !c.lock);
    $('#vtQuit').disabled = R.over;
    renderClock();
  }

  // ---------- Typing and selecting squares (JM, CD-23: 1.1.1.4–6) ----------
  function key(k) {
    if (!R || R.over || !$('#modal').hidden) return;
    if (k === 'Enter') return submit();
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
    if (tm.kind === 'guess') R.left = tm.ms; // each guess gets a fresh clock
    if (g === R.a.w) return finish(true);
    if (R.rows.length >= R.tries) return finish(false);
    newRow();
    render();
  }
  // Reveal (−3): one more letter, placed and locked in its spot
  $('#vtReveal').addEventListener('click', () => {
    if (!R || R.over) return;
    const opts = []; for (let i = 0; i < R.len; i++) if (!R.cells[i].lock) opts.push(i);
    if (opts.length <= 1 && R.cells.filter(c => !c.lock).length <= 1) { toast('Nothing left to reveal'); return; }
    const i = opts[Math.floor(Math.random() * opts.length)];
    R.revealed.set(i, R.a.w[i]); R.reveals++;
    R.cells[i] = { ch: R.a.w[i], lock: true };
    if (R.sel === i || R.sel < 0) R.sel = firstOpen(i);
    toast(`Letter ${i + 1} is ${R.a.w[i]} · −3`);
    render();
  });
  $('#vtNew').addEventListener('click', () => newWord(false));
  $('#vtQuit').addEventListener('click', () => { if (R && !R.over) finish(false, true); });

  // ---------- Clock (pauses while the app is hidden or a window is open) ----------
  function startClock() {
    clearInterval(R.tId);
    const tm = timerOf(R.timer);
    $('#vtClock').hidden = tm.kind === 'none';
    if (tm.kind === 'none') return;
    let last = Date.now();
    R.tId = setInterval(() => {
      const now = Date.now(), dt = now - last; last = now;
      if (!R || R.over || document.hidden || !screenOn() || !$('#modal').hidden) return;
      R.left = Math.max(0, R.left - dt);
      renderClock();
      if (R.left <= 0) {
        if (tm.kind === 'guess') { toast('Time\'s up for that guess', 'bad'); addRow(R.cells.map(c => c.ch || ' ').join('')); }
        else { toast('Time\'s up!', 'bad'); finish(false); }
      }
    }, 250);
  }
  function renderClock() {
    const c = $('#vtClock');
    if (!R || c.hidden) return;
    const s = Math.ceil(R.left / 1000);
    c.textContent = `⏱ ${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    c.classList.toggle('low', s <= 10);
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
    if (tm.kind !== 'none') { const tb = Math.min(30, Math.floor(R.left / 5000)); if (tb) rows.push(['Time bonus (1 per 5 s left)', tb]); }
    if (R.reveals) rows.push([`Reveal ×${R.reveals}`, -3 * R.reveals]);
    return { total: Math.max(0, rows.reduce((a, r) => a + r[1], 0)), rows };
  }
  function recordLoss() { stats.played++; stats.streak = 0; stats.dist.X = (stats.dist.X || 0) + 1; saveStats(); }
  function finish(won, gaveUp) {
    R.over = true; R.won = won;
    clearInterval(R.tId);
    const ms = Date.now() - R.tStart;
    const sc = score(won);
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
  function showResult(won, gaveUp, sc, ms) {
    const w = R.a.w, pct = stats.played ? Math.round(100 * stats.won / stats.played) : 0;
    const keys = []; for (let i = 1; i <= 10; i++) if (stats.dist[i]) keys.push(String(i)); if (stats.dist.X) keys.push('X');
    const maxN = Math.max(1, ...keys.map(k => stats.dist[k]));
    const bars = keys.map(k => `<div class="vt-bar"><span class="k">${k === 'X' ? '✗' : k}</span><span class="b${(won && +k === R.rows.length) ? ' me' : ''}" style="width:${Math.max(8, Math.round(100 * stats.dist[k] / maxN))}%">${stats.dist[k]}</span></div>`).join('');
    openModal(`
      <div class="vt-res-h">${won ? '🔓 Vault cracked!' : gaveUp ? '🏳️ You gave up' : '🔒 The Vault stays shut'}</div>
      <div class="vt-res-w">${w.split('').map(ch => `<span>${ch}</span>`).join('')}</div>
      ${R.a.c ? `<p class="vt-res-c">Clue: ${esc(R.a.c)}</p>` : ''}
      ${won ? `<table class="score-table vt-sc">${sc.rows.map(r => `<tr><td>${esc(r[0])}</td><td>${r[1] < 0 ? '−' + Math.abs(r[1]) : '+' + r[1]}</td></tr>`).join('')}<tr class="total"><td>Score</td><td>${sc.total}</td></tr></table>` : ''}
      <div class="vt-res-stats">
        <div><b>${fmt(ms)}</b><span>Time</span></div><div><b>${stats.bestMs ? fmt(stats.bestMs) : '–'}</b><span>Best time</span></div>
        <div><b>${stats.played}</b><span>Played</span></div><div><b>${pct}%</b><span>Solved</span></div>
        <div><b>${stats.streak}</b><span>Streak</span></div><div><b>${stats.best}</b><span>Best streak</span></div>
      </div>
      ${bars ? `<h3>Guesses needed</h3><div class="vt-dist">${bars}</div>` : ''}
      <div class="row"><button class="btn" data-a="setup">⚙ Settings</button><button class="btn primary" data-a="again">Next word</button></div>`);
    $('#modal').onclick = e => { if (e.target === $('#modal')) closeModal(); };
    $('#sheet').onclick = e => {
      const b = e.target.closest('[data-a]'); if (!b) return;
      closeModal();
      if (b.dataset.a === 'again') start(); else openSettings();
    };
  }

  // ---------- Help ----------
  function help() {
    openModal(`<h2>How To Play: ${esc(title())}</h2>
      <ul class="vt-help">
        <li>Guess the hidden word. Type a word (on screen or your keyboard) and press <b>ENTER</b>. Every guess must be a real word of the right length.</li>
        <li>Each letter of your guess is then marked: <span class="vt-chip ok">green</span> right letter in the right spot, <span class="vt-chip in">yellow</span> in the word but in another spot, <span class="vt-chip no">red</span> not in the word. The keyboard keeps the best mark for each letter.</li>
        <li>Green letters carry into your next guess automatically, and typing starts at the first open square.</li>
        <li>Tap a square (or use the ← → arrow keys) to choose where the next letter goes; the chosen square glows light blue. ⌫ clears it.</li>
        <li><b>Challenge Level</b> (1–10) sets how hard the vocabulary is: everyday words at 1–3, rarer ones as it rises.</li>
        <li><b>Letters</b> (4–8) and <b>Guesses</b> (5–10) set the word's length and how many tries you get.</li>
        <li><b>Timer:</b> the main game's choices. "A guess" gives each guess its own clock (when it runs out, that guess is used up); "a word" times the whole round. The clock stops while a window is open or the app is hidden.</li>
        <li><b>Scoring</b> (only when you solve it): <b>Classic</b> scores the word's letter values (as in the main game) plus 2 per letter; <b>Flat</b> scores 2 per letter. Both add <b>+5</b> for every guess you didn't need and, in timed rounds, a time bonus (1 point per 5 seconds left, up to 30). Each <b>💡 Reveal</b> places one letter in its spot and costs <b>3</b>.</li>
        <li><b>⚙ Settings</b> (in the header, or tap the line above the grid) change the game at any time; changes apply from the next word.</li>
        <li><b>🆕 New Game</b> starts a fresh word. <b>🏳️ Give up</b> shows the word. Either one, once you've made a guess, counts that word as not solved and breaks your streak.</li>
        <li>Your stats (played, solved %, streaks, best time, guesses needed) are kept on this device.</li>
        <li><b>Make it yours:</b> double-click (or double-tap) the title to rename the game, and tap the icon beside it to choose another.</li>
      </ul>
      <div class="row"><button class="btn primary" data-a="ok">Got it</button></div>`);
    $('#modal').onclick = e => { if (e.target === $('#modal')) closeModal(); };
    $('#sheet').onclick = e => { if (e.target.closest('[data-a]')) closeModal(); };
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
  const ICONS = ['🔐', '🔒', '🗝️', '🔑', '💰', '💎', '🏦', '🧩', '🎁', '📦'].concat(UI.AVATARS);
  $('#vtAv').addEventListener('click', () => {
    openModal(`<h2>Choose an icon</h2><div class="av-grid">${ICONS.map(a => `<button type="button" data-av="${a}" class="${a === vs.icon ? 'on' : ''}">${a}</button>`).join('')}</div>
      <div class="row"><button class="btn" data-a="close">Cancel</button></div>`);
    $('#modal').onclick = e => { if (e.target === $('#modal')) closeModal(); };
    $('#sheet').onclick = e => {
      const b = e.target.closest('[data-av],[data-a]'); if (!b) return;
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
    if (R && !R.over) clearInterval(R.tId); // the round waits; reopening the Vault resumes it
    document.title = `Clue Duel · ${UI.APP_VER}`;
    UI.goHome();
  });
  $('#vtKb').addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (b) key(b.dataset.k); });
  document.addEventListener('keydown', e => {
    if (!screenOn() || e.ctrlKey || e.metaKey || e.altKey || /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName || '')) return;
    const k = ['Enter', 'Backspace', 'ArrowLeft', 'ArrowRight'].includes(e.key) ? e.key : e.key.length === 1 ? e.key.toUpperCase() : '';
    if (k) { e.preventDefault(); key(k); }
  });
  window.WordVault = { open: () => { open(); if (R && !R.over) startClock(); } };
})();
