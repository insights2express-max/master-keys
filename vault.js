/* Clue Duel — Word Vault (v07c): a word-guessing mini-game (JM, CD-12: 4.2.1; CD-13: 4.x; CD-18: 7.1a; CD-21: 5.1–5.3).
   Guess the hidden word in a set number of tries. After each guess every letter is marked:
     blue  = right letter, right spot · gold = in the word, another spot · gray = not in the word.
   Own look and rules (not a copy of any other game): Clue Duel's colors and tiles, Challenge Level, word length 4–8,
   5–10 guesses, the main game's timer choices, two scoring modes, a renameable title and a choosable icon.
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
    const rec = [a.w].concat([...recent]).slice(0, 300);
    store.set('cd.vault.recent', rec);
    return a;
  }

  // ---------- Timer choices: the main game's list, worded for this game ----------
  const TIMERS = [['0', 'Untimed'], ['t30', 'Blitz · 30 s a guess'], ['t60', '1 min a guess'], ['t120', '2 min a guess'], ['t180', '3 min a guess'],
    ['t300', '5 min a guess'], ['g120', '2 min a word'], ['g180', '3 min a word'], ['g300', '5 min a word'], ['g600', '10 min a word'], ['g900', '15 min a word']];
  const timerOf = code => { const m = /^([tg])(\d+)$/.exec(code || ''); return m ? { kind: m[1] === 't' ? 'guess' : 'word', ms: +m[2] * 1000 } : { kind: 'none', ms: 0 }; };
  const VAL = E.VAL;
  const DESC = {
    classic: 'Solve to score the word\'s letter values plus 2 per letter, +5 for every guess you didn\'t need, and a time bonus in timed games. Each Reveal costs 3.',
    flat: 'Solve to score 2 per letter, +5 for every guess you didn\'t need, and a time bonus in timed games. Each Reveal costs 3.'
  };

  // ---------- Round state ----------
  let R = null; // { a, rows: [[{ch, st}]], cur, row, over, won, revealed:Set, tStart, left, tId, paused }
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

  // ---------- Setup panel ----------
  function fillSelect(sel, opts, val) {
    sel.innerHTML = opts.map(([v, t]) => `<option value="${v}">${esc(t)}</option>`).join('');
    sel.value = String(val);
  }
  function showSetup() {
    $('#vtSetup').hidden = false; $('#vtPlay').hidden = true; $('#vtClock').hidden = true;
    fillSelect($('#vtLevel'), Array.from({ length: 10 }, (_, i) => [i + 1, i === 0 ? '1 · Gentle' : i === 9 ? '10 · Ruthless' : String(i + 1)]), vs.level);
    fillSelect($('#vtLen'), [4, 5, 6, 7, 8].map(n => [n, n + ' letters']), vs.len);
    fillSelect($('#vtTries'), [5, 6, 7, 8, 9, 10].map(n => [n, n + ' guesses']), vs.tries);
    fillSelect($('#vtTimer'), TIMERS, vs.timer);
    $('#vtScoring').value = vs.scoring;
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
  for (const [id, k, num] of [['#vtLevel', 'level', 1], ['#vtLen', 'len', 1], ['#vtTries', 'tries', 1], ['#vtTimer', 'timer', 0], ['#vtScoring', 'scoring', 0]]) {
    $(id).addEventListener('change', e => { vs[k] = num ? +e.target.value : e.target.value; saveVs(); $('#vtDesc').textContent = DESC[vs.scoring]; });
  }

  // ---------- Round ----------
  function start() {
    const a = pickWord();
    R = { a, rows: [], cur: '', over: false, won: false, revealed: new Map(), reveals: 0, tStart: Date.now(), left: 0, tId: 0, len: vs.len, tries: vs.tries, timer: vs.timer, scoring: vs.scoring, level: vs.level };
    const tm = timerOf(R.timer);
    R.left = tm.ms;
    showPlay();
    startClock();
  }
  function showPlay() {
    $('#vtSetup').hidden = true; $('#vtPlay').hidden = false;
    $('#vtInfo').textContent = `Challenge Level ${R.level} · ${R.len} letters · ${R.tries} guesses · ${R.scoring === 'flat' ? 'Flat' : 'Classic'}`;
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
          const ch = R.cur[c] || '', rv = R.revealed.get(c);
          b.push(`<div class="vt-cell${ch ? ' typed' : ''}${!ch && rv ? ' hint' : ''}${c === R.cur.length ? ' caret' : ''}">${ch || (rv || '')}</div>`);
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
    $('#vtReveal').disabled = R.over || R.revealed.size >= R.len - 1;
    $('#vtQuit').disabled = R.over;
    renderClock();
  }

  function key(k) {
    if (!R || R.over || !$('#modal').hidden) return;
    if (k === 'Enter') return submit();
    if (k === 'Backspace') { R.cur = R.cur.slice(0, -1); return render(); }
    if (/^[A-Z]$/.test(k) && R.cur.length < R.len) { R.cur += k; render(); }
  }
  function shakeRow() {
    const start = R.rows.length * R.len, cells = $('#vtBoard').children;
    for (let i = start; i < start + R.len; i++) if (cells[i]) { cells[i].classList.remove('shake'); void cells[i].offsetWidth; cells[i].classList.add('shake'); }
  }
  function submit() {
    if (R.cur.length < R.len) { toast(`Use all ${R.len} letters`, 'bad'); shakeRow(); return; }
    words();
    if (!GUESS[R.len].has(R.cur)) { toast(`${R.cur} isn't in the word list`, 'bad'); shakeRow(); return; }
    addRow(R.cur);
  }
  function addRow(g) {
    const st = mark(g, R.a.w);
    R.rows.push({ g, st });
    R.cur = '';
    const tm = timerOf(R.timer);
    if (tm.kind === 'guess') R.left = tm.ms; // each guess gets a fresh clock
    if (g === R.a.w) return finish(true);
    if (R.rows.length >= R.tries) return finish(false);
    render();
  }
  // Reveal (−3): shows one letter of the answer in its spot (never all of them)
  $('#vtReveal').addEventListener('click', () => {
    if (!R || R.over) return;
    const known = new Set(); R.rows.forEach(r => r.st.forEach((s, i) => { if (s === 'ok') known.add(i); }));
    const opts = []; for (let i = 0; i < R.len; i++) if (!known.has(i) && !R.revealed.has(i)) opts.push(i);
    if (!opts.length || R.revealed.size >= R.len - 1) { toast('Nothing left to reveal'); return; }
    const i = opts[Math.floor(Math.random() * opts.length)];
    R.revealed.set(i, R.a.w[i]); R.reveals++;
    toast(`Letter ${i + 1} is ${R.a.w[i]} · −3`);
    render();
  });
  $('#vtQuit').addEventListener('click', async () => {
    if (!R || R.over) return;
    finish(false, true);
  });

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
        if (tm.kind === 'guess') { toast('Time\'s up for that guess', 'bad'); addRow(' '.repeat(R.len)); }
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
  function finish(won, gaveUp) {
    R.over = true; R.won = won;
    clearInterval(R.tId);
    const ms = Date.now() - R.tStart;
    const sc = score(won);
    stats.played++;
    if (won) {
      stats.won++; stats.streak++; stats.best = Math.max(stats.best, stats.streak);
      stats.dist[R.rows.length] = (stats.dist[R.rows.length] || 0) + 1;
      stats.points += sc.total; stats.top = Math.max(stats.top, sc.total);
      if (!stats.bestMs || ms < stats.bestMs) stats.bestMs = ms;
    } else { stats.streak = 0; stats.dist.X = (stats.dist.X || 0) + 1; }
    saveStats();
    render();
    setTimeout(() => showResult(won, gaveUp, sc, ms), won ? 700 : 400);
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
      <div class="row"><button class="btn" data-a="setup">Settings</button><button class="btn primary" data-a="again">Next word</button></div>`);
    $('#modal').onclick = e => { if (e.target === $('#modal')) closeModal(); };
    $('#sheet').onclick = e => {
      const b = e.target.closest('[data-a]'); if (!b) return;
      closeModal();
      if (b.dataset.a === 'again') start(); else showSetup();
    };
  }

  // ---------- Help ----------
  function help() {
    openModal(`<h2>How To Play: ${esc(title())}</h2>
      <ul class="vt-help">
        <li>Guess the hidden word. Type a word (on screen or your keyboard) and press <b>ENTER</b>. Every guess must be a real word of the right length.</li>
        <li>Each letter of your guess is then marked: <span class="vt-chip ok">blue</span> right letter in the right spot, <span class="vt-chip in">gold</span> in the word but in another spot, <span class="vt-chip no">gray</span> not in the word. The keyboard keeps the best mark for each letter.</li>
        <li><b>Challenge Level</b> (1–10) sets how hard the vocabulary is: everyday words at 1–3, rarer ones as it rises.</li>
        <li><b>Letters</b> (4–8) and <b>Guesses</b> (5–10) set the word's length and how many tries you get.</li>
        <li><b>Timer:</b> the main game's choices. "A guess" gives each guess its own clock (when it runs out, that guess is lost); "a word" times the whole round. The clock stops while a window is open or the app is hidden.</li>
        <li><b>Scoring</b> (only when you solve it): <b>Classic</b> scores the word's letter values (as in the main game) plus 2 per letter; <b>Flat</b> scores 2 per letter. Both add <b>+5</b> for every guess you didn't need and, in timed rounds, a time bonus (1 point per 5 seconds left, up to 30). Each <b>💡 Reveal</b> shows one letter in its spot and costs <b>3</b>.</li>
        <li><b>🏳️ Give up</b> shows the word and ends the round (it breaks your streak).</li>
        <li>Play as many words as you like. Your stats (played, solved %, streaks, best time, guesses needed) are kept on this device.</li>
        <li><b>Make it yours:</b> double-click the title to rename the game, and tap the icon beside it to choose another.</li>
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
  $('#vtMenu').addEventListener('click', () => {
    if (R && !R.over) clearInterval(R.tId); // the round waits; reopening the Vault resumes it
    document.title = `Clue Duel · ${UI.APP_VER}`;
    UI.goHome();
  });
  $('#vtKb').addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (b) key(b.dataset.k); });
  document.addEventListener('keydown', e => {
    if (!screenOn() || e.ctrlKey || e.metaKey || e.altKey || /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName || '')) return;
    const k = e.key === 'Enter' || e.key === 'Backspace' ? e.key : e.key.length === 1 ? e.key.toUpperCase() : '';
    if (k) { e.preventDefault(); key(k); }
  });
  window.WordVault = { open: () => { open(); if (R && !R.over) startClock(); } };
})();
