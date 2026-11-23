/* Master Keys — KeyCubes (v12; JM CD-103, CD-109): the letter-cube word hunt.
   Trace words through a 4×4 or 5×5 grid of letter cubes: join touching cubes across, down or diagonally, each cube once
   per word. Any ENABLE word counts (3 letters on 4×4 and 4 on 5×5 by default, CD-109: 3.1).
   - Duel (the main game, CD-103: 2.1a): the Bot hunts the same grid; its words stay hidden until the end (CD-109: 6.2) and a
     word both sides find scores for nobody. A match is 1, 3 (default) or 5 rounds, each on a fresh grid, won on total
     points (CD-109: 8.1); the next round starts on a tap (8.2); an unfinished match is saved and resumes (8.3).
   - Solo (CD-109: 9.1–9.2.1): no Bot, Untimed by default, 🏁 Done ends the round, best score per grid size; no coins.
     Solo Hints: Free or Paid, and 3 per round or no limit (two Setup choices).
   - Timer (CD-109: 2.1–2.3): 30 s Blitz, 1, 2 (default), 3, 4 or 5 min; Untimed in Solo only. The last 10 seconds flash
     yellow then red with ticks. No speed coins (a word hunt always runs the full clock).
   - Scoring (CD-109: 4.1–4.3, both as a Setup choice): letter points (from our Lexicon's letter counts, on each cube) + a length
     bonus, or word length only. Qu is one cube, two letters, Q's 10 points (5.2).
   - Cubes (CD-109: 5.1–5.3): our own sets (keycubes-words.js, tools/build-keycubes-words.ps1); thin grids are re-rolled quietly.
   - Challenge Level 1–10, default 3 (CD-109: 6.1): the Bot knows words up to a familiarity level (Lexicon level, else SCOWL's
     everyday-word tiers, else rare) and finds a share of them, spread over the round.
   - 💡 Hint (CD-109: 7.1–7.2, 7.1.1): 🪙1 per letter of the hinted word, at most 3 per round in a duel: the clue and length of a
     Lexicon word you have not found, and its first cube is striped (a signal, not a solve, CD-85). 🔄 Turn is free.
   - Coins (CD-109: 7.3): a round win 🪙10, a draw 🪙5, a match win 🪙20 more.
   - Results (CD-109: 1.3, 1.3.1): one-row win report; your words "of" every word in the grid; tabs Your words / Bot's words /
     All words; the path on a mini grid, letter points + length bonus = total (0 when shared), and the Lexicon clue.
   - Cube Colors (CD-109 add. 1): Cream (default), Inked, Inked Blue (from CrossKeys' Grid Colors), Steel, Navy & gold (from the
     Ring Button Colors). Button Colors (Steel first) for the coin buttons, as in every game.
   v12c (JM CD-112, CD-116): smoother swipes (a swipe may start anywhere on the grid, the points between finger readings are
   filled in, the cubes are measured once per swipe, a new swipe never joins a leftover cube); a typed word that fails
   clears; 💡 Hint again on the same word stripes its next cube (🪙1); a free "Left" line of unfound words by length;
   🔄 Rotate (was Turn); Bonus cubes 3W 2W 2L 3L (one each on 4×4; 1, 2, 2, 1 on 5×5; word bonuses only with Length-only
   scoring; On by default), new places every round; the game total is the big number, with this round's points under it;
   results: big game totals + a round table, a plain "You lead" banner until the last round, then the gold "You WIN!"
   with confetti; words only you found in green, shared words in red; Solo pays 🪙5 for a new best when Hints are Paid.
   Saved on this device: settings 'cd.kc.settings', stats 'cd.kc.stats', an unfinished match 'cd.kc.save'. */
'use strict';
(function () {
  const UI = window.CDUI, E = window.Engine, D = window.KC_DATA, K = window.KR_DATA;
  if (!UI || !E || !D || !K || !document.getElementById('keycubes')) return;
  const { $, esc, store, openModal, closeModal } = UI;
  const NM = Object.assign({ suite: 'Master Keys', cubes: 'KeyCubes' }, window.MK_NAMES || {});
  const snd = n => { if (UI.sound) UI.sound.play(n); };
  const $$ = s => [...document.querySelectorAll(s)];
  const SEC = $('#keycubes'), tray = $('#kcTray');
  const night = () => document.documentElement.dataset.screen === 'night';
  const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- settings and stats ----------
  const DEF = { mode: 'duel', n: 4, timer: 120, lv: 3, min: 'auto', rounds: 3, sc: 'lp', bs: 'b', cs: 'cream', sHint: 'free', sCap: '3', sTimer: 0, bonus: 'on' };
  const ks = Object.assign({}, DEF, store.get('cd.kc.settings', {}));
  const saveKs = () => store.set('cd.kc.settings', ks);
  const blankSt = () => ({ matches: 0, won: 0, drawn: 0, rounds: 0, words: 0, best: null, solo: {}, soloN: 0 });
  const st = Object.assign(blankSt(), store.get('cd.kc.stats', {}));
  const saveSt = () => store.set('cd.kc.stats', st);
  const SAVE_KEY = 'cd.kc.save';
  const TIMERS = [[30, '30 s Blitz'], [60, '1 min'], [120, '2 min'], [180, '3 min'], [240, '4 min'], [300, '5 min'], [0, 'Untimed']];
  const timerName = t => (TIMERS.find(x => x[0] === +t) || TIMERS[2])[1];
  const CUBE_LOOKS = [['cream', 'Cream'], ['ink', 'Inked'], ['blue', 'Inked Blue'], ['steel', 'Steel'], ['navy', 'Navy & gold']];
  const LV_NAMES = { 1: '1 · Apprentice', 10: '10 · Master' }; // v12a (CD-113: 2.1a)
  const HINT_CAP_DUEL = 3, WIN = 10, DRAW = 5, MATCH = 20, SOLO_BEST = 5; // SOLO_BEST: CD-112: 3.3 (Paid Hints only)
  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const plural = (n, w) => `${UI.fmtN(n)} ${w}${n === 1 ? '' : 's'}`;
  const timerOf = () => ks.mode === 'solo' ? ks.sTimer : ks.timer;
  const lastLine = () => `${ks.mode === 'solo' ? 'Solo' : 'Duel · Challenge Level ' + ks.lv} · ${ks.n}×${ks.n} · ${timerName(timerOf())}${ks.mode === 'duel' ? ' · ' + plural(ks.rounds, 'round') : ''}`;

  // ---------- words: ENABLE (3 letters in keyrings.js, 4–8 in lockwords.js, 9–16 in keycubes-words.js) ----------
  const BLOCK = new Set(String(K.block || '').split(' ').filter(Boolean));
  let PACK = null;
  function packs() {
    if (PACK) return PACK;
    const G = window.VAULT_GUESS || {};
    PACK = { 3: String(K.three || '') };
    for (let n = 4; n <= 8; n++) PACK[n] = String(G[n] || '');
    const L = {}, s = String(D.long || '');
    let prev = '', i = 0;
    while (i < s.length) {
      const k = parseInt(s[i], 16); i++;
      let j = i; while (j < s.length && s.charCodeAt(j) >= 65 && s.charCodeAt(j) <= 90) j++;
      const w = prev.slice(0, k) + s.slice(i, j); i = j; prev = w;
      (L[w.length] = L[w.length] || []).push(w);
    }
    for (const n in L) PACK[n] = L[n].join('');
    return PACK;
  }
  // the first word (of length n) whose first p.length letters are >= p
  function lb(s, n, p) {
    let lo = 0, hi = s.length / n;
    while (lo < hi) { const m = (lo + hi) >> 1; if (s.substr(m * n, p.length) < p) lo = m + 1; else hi = m; }
    return lo;
  }
  // every word in a grid, with the path of cubes that first spells it (cells: 'A'…'Z' or 'QU')
  function solve(cells, n) {
    const P = packs(), memo = new Map(), out = new Map(), N = n * n, used = new Uint8Array(N), path = [];
    const nb = []; for (let i = 0; i < N; i++) { nb[i] = []; for (let j = 0; j < N; j++) if (adjN(i, j, n)) nb[i].push(j); }
    const info = p => { // 1 = a word, 2 = longer words start with it
      let v = memo.get(p); if (v !== undefined) return v;
      v = 0; const L = p.length;
      if (L >= 3 && P[L]) { const s = P[L], i = lb(s, L, p); if (i * L < s.length && s.substr(i * L, L) === p && !BLOCK.has(p)) v |= 1; }
      for (let m = Math.max(3, L + 1); m <= 16; m++) { const s = P[m]; if (!s) continue; const i = lb(s, m, p); if (i * m < s.length && s.substr(i * m, L) === p) { v |= 2; break; } }
      memo.set(p, v); return v;
    };
    const dfs = (i, p) => {
      const q = p + cells[i], v = info(q); if (!v) return;
      used[i] = 1; path.push(i);
      if ((v & 1) && !out.has(q)) out.set(q, path.slice());
      if (v & 2) for (const j of nb[i]) if (!used[j]) dfs(j, q);
      used[i] = 0; path.pop();
    };
    for (let i = 0; i < N; i++) dfs(i, '');
    return out;
  }
  const adjN = (a, b, n) => a !== b && Math.abs(a % n - b % n) <= 1 && Math.abs(Math.floor(a / n) - Math.floor(b / n)) <= 1;
  const shuffled = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function roll(n) { return shuffled(String(D.cubes[n] || '').split(' ')).map(c => { const f = c[Math.floor(Math.random() * c.length)]; return f === 'Q' ? 'QU' : f; }); }
  // CD-109: 5.3: a grid with too few words is re-rolled quietly (the best of up to 25 rolls is kept)
  const THIN = { 4: { 3: 60, 4: 35 }, 5: { 3: 150, 4: 110 } };
  function deal(n, mn) {
    let best = null;
    for (let t = 0; t < 25; t++) {
      const cells = roll(n), W = solve(cells, n), words = {};
      let c = 0; W.forEach((p, w) => { if (w.length >= mn) { words[w] = p; c++; } });
      if (!best || c > best.c) best = { cells, words, c };
      if (c >= THIN[n][Math.min(4, mn)]) break;
    }
    return best;
  }

  // ---------- familiarity (for the Bot) and clues (for Hint and the results) ----------
  let LEXBY = null, EVERY = null;
  function lexby() {
    if (LEXBY) return LEXBY;
    LEXBY = {}; EVERY = {};
    for (const e of E.lexicon()) if (e.w.length >= 3 && !LEXBY[e.w]) LEXBY[e.w] = e;
    for (const t of [1, 2, 3]) for (const w of String((K.every || {})[t] || '').split(' ')) if (w && !EVERY[w]) EVERY[w] = t;
    return LEXBY;
  }
  const famOf = w => { const L = lexby(); return L[w] ? (L[w].l || 1) : EVERY[w] || 6; };
  const firstChoice = t => String(t || '').split(';').map(s => s.trim()).filter(Boolean)[0] || '';
  const SUFS = ['ING', 'ES', 'ED', 'ER', 'LY', 'S', 'D', 'R'];
  function clueOf(w) {
    const L = lexby();
    if (L[w]) return firstChoice(L[w].e) || firstChoice(L[w].h);
    for (const suf of SUFS) {
      const b = w.slice(0, -suf.length);
      if (w.length - suf.length >= 3 && w.endsWith(suf) && L[b]) { const c = firstChoice(L[b].e) || firstChoice(L[b].h); if (c) return `Add ${suf} to the answer for: ${c}`; }
    }
    return '';
  }

  // ---------- scoring (CD-109: 4.1–4.3) ----------
  const ptOf = c => D.pts[c[0]] || 1; // the Qu cube scores as Q
  const lenBonus = L => L <= 3 ? 0 : L === 4 ? 2 : L === 5 ? 4 : L === 6 ? 7 : L === 7 ? 11 : 16 + (L - 8) * 5;
  const lenOnly = L => L <= 3 ? 1 : L === 4 ? 2 : L === 5 ? 3 : L === 6 ? 5 : L === 7 ? 8 : 12 + (L - 8) * 4;
  // v12c (CD-112 add. 2.3; CD-116: 3.1a–3.3): Bonus cubes. 2L / 3L multiply that cube's letter points; 2W / 3W multiply the
  // whole word (two word bonuses in one word multiply each other). Length-only scoring has no letter points: word bonuses only.
  const BONUS_SET = { 4: ['3W', '2W', '2L', '3L'], 5: ['3W', '2W', '2W', '2L', '2L', '3L'] };
  const BMUL = { '2L': 2, '3L': 3, '2W': 2, '3W': 3 };
  function placeBonus(n, sc) {
    const set = BONUS_SET[n].filter(b => sc !== 'len' || b.endsWith('W')), cells = shuffled([...Array(n * n).keys()]), out = {};
    set.forEach((b, k) => { out[cells[k]] = b; });
    return out;
  }
  function score(w, path, cells, sc, bon) {
    bon = bon || {};
    let wm = 1, lm = false;
    for (const i of path) { const b = bon[i]; if (b && b.endsWith('W')) wm *= BMUL[b]; }
    if (sc === 'len') { const base = lenOnly(w.length); return { lp: 0, lb: base, wm, lm, t: base * wm }; }
    const lp = path.reduce((a, i) => { const b = bon[i]; if (b && b.endsWith('L')) lm = true; return a + ptOf(cells[i]) * (b && b.endsWith('L') ? BMUL[b] : 1); }, 0), lb2 = lenBonus(w.length);
    return { lp, lb: lb2, wm, lm, t: (lp + lb2) * wm };
  }
  const scoreOf = (w, p) => score(w, p || R.words[w], R.cells, M.sc, R.bon);

  // ---------- the match and the round ----------
  let M = null, R = null;
  (function load() {
    const s = store.get(SAVE_KEY, null);
    if (s && s.M && s.R && Array.isArray(s.R.cells) && s.R.words) { M = s.M; R = s.R; R.paused = false; }
  })();
  const unfinished = () => !!(M && !M.done);
  const unfText = () => M.mode === 'solo' ? `Unfinished Solo round · ${plural(R.mine.length, 'word')}`
    : `Unfinished match · round ${M.no} of ${M.rounds} · You ${UI.fmtN(M.me + (R.over ? 0 : 0))} – Bot ${UI.fmtN(M.bot)}`;
  function save() {
    if (!M || M.done) { store.set(SAVE_KEY, null); return; }
    store.set(SAVE_KEY, { M, R });
  }
  function newMatch() {
    M = {
      mode: ks.mode, n: ks.n, timer: timerOf(), lv: ks.lv, min: ks.min === 'auto' ? ks.n - 1 : +ks.min,
      rounds: ks.mode === 'solo' ? 1 : ks.rounds, sc: ks.sc, sHint: ks.sHint, sCap: ks.sCap, bonus: ks.bonus,
      no: 0, me: 0, bot: 0, list: [], done: false, histT: 0, coins: 0
    };
  }
  function newRound() {
    const d = deal(M.n, M.min);
    M.no++;
    R = { cells: d.cells, words: d.words, all: d.c, mine: [], found: {}, bot: [], botSet: {}, botN: 0, el: 0, rot: 0,
      hints: 0, hintCoins: 0, hint: null, hintK: 0, over: false, paused: false, started: false,
      bon: M.bonus === 'off' ? {} : placeBonus(M.n, M.sc) };
    if (M.mode === 'duel') planBot();
  }
  // CD-109: 6.1: level L knows words up to a familiarity cap and finds a share of them, spread over the round
  function planBot() {
    const L = M.lv, cap = [1, 1, 2, 2, 3, 3, 4, 4, 5, 6][L - 1], share = 0.22 + 0.06 * L, T = M.timer || 120;
    const pool = Object.keys(R.words).filter(w => famOf(w) <= cap && Math.random() < share);
    R.bot = shuffled(pool).map(w => ({ w, t: Math.round((Math.min(4, T * 0.1) + Math.random() * (T * 0.94 - Math.min(4, T * 0.1))) * 10) / 10 })).sort((a, b) => a.t - b.t);
    R.botSet = {}; R.bot.forEach(b => { R.botSet[b.w] = 1; });
  }
  const myPts = () => R.mine.reduce((a, m) => a + m.s.t, 0);
  // v12c: free "Left" line (CD-116: 1.2): your unfound words by length; the longest lengths share one group
  function leftLine() {
    const c = {}, top = M.min + 3;
    for (const w in R.words) if (!R.found[w]) { const L = Math.min(top, w.length); c[L] = (c[L] || 0) + 1; }
    const parts = [];
    for (let L = M.min; L <= top; L++) if (c[L]) parts.push(`<span><b>${L}${L === top ? '+' : ''}</b> letters ${UI.fmtN(c[L])}</span>`);
    return parts.length ? `Left: ${parts.join(' · ')}` : 'Left: none. You found every word!';
  }

  // ---------- screens ----------
  const screenOn = () => !SEC.hidden;
  const playOn = () => screenOn() && !$('#kcPlay').hidden;
  const modalOpen = () => { const m = $('#modal'); return m && !m.hidden; };
  function setHead(sub) { $('#kcSub').textContent = sub; document.title = `${NM.cubes} · ${NM.suite} ${UI.APP_VER}`; }
  function part(id) { for (const p of ['kcSetup', 'kcPlay', 'kcRes']) $('#' + p).hidden = p !== id; }
  function showSetup() { UI.showScreen('keycubes'); part('kcSetup'); setHead('Setup'); paintSetup(); $('#kcSetup').scrollTop = 0; }
  function showPlay() {
    if (!R) return;
    if (R.over) { showRes(); return; }
    UI.showScreen('keycubes'); part('kcPlay');
    setHead(M.mode === 'solo' ? `Solo · ${M.n}×${M.n}` : `Round ${M.no} of ${M.rounds} · ${M.n}×${M.n}`);
    buildTray(); paintGame(); tick(0);
    fit(); requestAnimationFrame(fit);
    if (!R.started) { R.started = true; msg(matchMedia('(pointer: coarse)').matches ? 'Swipe across touching cubes to spell a word' : 'Drag across touching cubes, or type a word', '', 3500); }
    else msg('');
  }
  function goLobby() { clearTrace(); save(); document.title = `${NM.suite} · ${UI.APP_VER}`; UI.goHome(); }
  function start() { newMatch(); newRound(); save(); UI.lobby(); showPlay(); }
  function newGame() {
    if (!unfinished()) { start(); return; }
    openModal(`<h2>Start a new ${NM.cubes} game?</h2><p>Your unfinished ${M.mode === 'solo' ? 'Solo round' : 'match'} will end and count as played.</p>
      <div class="row"><button class="btn" data-a="no">Cancel</button><button class="btn primary" data-a="yes">Start new</button></div>`);
    $('#sheet').onclick = e => { const b = e.target.closest('[data-a]'); if (!b) return; closeModal(); if (b.dataset.a === 'yes') { abandon(); start(); } };
  }
  function abandon() { // an unfinished match ends as a loss (Duel) or just ends (Solo); no coins
    if (!unfinished()) return;
    if (M.mode === 'duel') st.matches++;
    M.done = true; saveSt(); store.set(SAVE_KEY, null);
  }

  // ---------- Setup ----------
  $('#kcLv').innerHTML = Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">${LV_NAMES[i + 1] || i + 1}</option>`).join('');
  $('#kcCs').innerHTML = CUBE_LOOKS.map(([v, n]) => `<option value="${v}">${n}</option>`).join('');
  if (UI.btnOpts) $('#kcBs').innerHTML = UI.btnOpts();
  function paintLooks() {
    if (UI.setLook) UI.setLook(SEC, ks.bs);
    for (const [v] of CUBE_LOOKS) SEC.classList.toggle('kc-cs-' + v, v === ks.cs);
  }
  function paintSetup() {
    const seg = (id, v) => { for (const b of document.querySelectorAll(`#${id} button`)) { const on = b.dataset.v === String(v); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); } };
    seg('kcMode', ks.mode); seg('kcN', ks.n);
    const duel = ks.mode === 'duel';
    $('#kcTm').innerHTML = TIMERS.filter(t => duel ? t[0] : true).map(([v, l]) => `<option value="${v}">${l}${v === 120 && duel ? ' (default)' : v === 0 ? ' (default)' : ''}</option>`).join('');
    $('#kcTm').value = String(timerOf());
    $('#kcLvF').hidden = !duel; $('#kcSoloF').hidden = duel; $('#kcRdF').hidden = !duel;
    $('#kcLv').value = String(ks.lv); $('#kcMin').value = ks.min; $('#kcRd').value = String(ks.rounds); $('#kcSc').value = ks.sc;
    $('#kcCs').value = ks.cs; $('#kcBs').value = ks.bs; $('#kcSh').value = ks.sHint; $('#kcScap').value = ks.sCap; $('#kcBon').value = ks.bonus;
    const pv = $('#kcPrev'), g = roll(ks.n);
    pv.style.gridTemplateColumns = `repeat(${ks.n}, 28px)`;
    pv.innerHTML = g.map(c => `<span>${c === 'QU' ? 'Qu' : c}</span>`).join('');
    const caps = ['everyday words only', 'everyday words only', 'common words', 'common words', 'a wider vocabulary', 'a wider vocabulary', 'harder words', 'harder words', 'almost any word', 'any word'];
    $('#kcDesc').textContent = duel
      ? `Challenge Level ${ks.lv}: the Bot knows ${caps[ks.lv - 1]} and finds about ${Math.round((0.22 + 0.06 * ks.lv) * 100)}% of them in a round. A word you both find scores for nobody.`
      : `Solo: no Bot. Hints ${ks.sHint === 'free' ? 'are free' : 'cost 🪙1 per letter'}, ${ks.sCap === '3' ? '3 per round' : 'no limit'}. Beat your best score for each grid size${ks.sHint === 'free' ? '' : `: a new best pays 🪙${SOLO_BEST}`}.`;
    $('#kcOptsSum').textContent = `Shortest word: ${ks.min === 'auto' ? 'Auto' : ks.min} · ${duel ? plural(ks.rounds, 'round') + ' · ' : ''}${ks.sc === 'lp' ? 'Letters + length' : 'Length only'} · Bonus cubes ${ks.bonus === 'off' ? 'off' : 'on'} · Cubes: ${(CUBE_LOOKS.find(x => x[0] === ks.cs) || CUBE_LOOKS[0])[1]} · Buttons: ${{ a: 'Sapphire', b: 'Steel', c: 'Navy & gold' }[ks.bs] || 'Steel'}`;
    const unf = unfinished();
    $('#kcSetUnf').hidden = !unf; if (unf) $('#kcSetUnfTxt').textContent = unfText();
    $('#kcStart').textContent = unf ? '🆕 New Game' : `▶ Start ${NM.cubes}`;
    $('#kcStart').classList.toggle('primary', !unf);
    const pct = st.matches ? Math.round(100 * st.won / st.matches) + '%' : '–';
    $('#kcStats').innerHTML = st.matches || st.soloN
      ? [[UI.fmtN(st.matches), 'Matches'], [pct, 'Won'], [UI.fmtN(st.words), 'Words'], [st.best ? st.best.w : '–', 'Best word'], [st.solo[ks.n] ? UI.fmtN(st.solo[ks.n]) : '–', `Solo best ${ks.n}×${ks.n}`]].map(([v, l]) => `<div class="vt-st"><b>${v}</b><span>${l}</span></div>`).join('')
      : '<p class="vt-none">No games played yet. Pick your settings and start.</p>';
    paintLooks();
  }
  const segPick = (id, f) => $(id).addEventListener('click', e => { const b = e.target.closest('button[data-v]'); if (!b) return; f(b.dataset.v); saveKs(); paintSetup(); UI.lobby(); });
  segPick('#kcMode', v => { ks.mode = v; });
  segPick('#kcN', v => { ks.n = +v; });
  const onCh = (id, f) => $(id).addEventListener('change', e => { f(e.target.value); saveKs(); paintSetup(); UI.lobby(); });
  onCh('#kcTm', v => { if (ks.mode === 'solo') ks.sTimer = +v; else ks.timer = +v; });
  onCh('#kcLv', v => { ks.lv = +v; });
  onCh('#kcMin', v => { ks.min = v; });
  onCh('#kcRd', v => { ks.rounds = +v; });
  onCh('#kcSc', v => { ks.sc = v; });
  onCh('#kcCs', v => { ks.cs = v; });
  onCh('#kcBs', v => { ks.bs = v; });
  onCh('#kcSh', v => { ks.sHint = v; });
  onCh('#kcScap', v => { ks.sCap = v; });
  onCh('#kcBon', v => { ks.bonus = v; });
  $('#kcStart').addEventListener('click', newGame);
  $('#kcSetResume').addEventListener('click', () => { if (unfinished()) showPlay(); });
  paintLooks();

  // ---------- the tray ----------
  // Turn: the cubes keep their neighbors; only the view turns, and each cube is redrawn upright in its new place
  function dispOrder() {
    const n = M.n, k = ((R.rot || 0) % 4 + 4) % 4, at = new Array(n * n);
    for (let i = 0; i < n * n; i++) { let r = Math.floor(i / n), c = i % n; for (let t = 0; t < k; t++) [r, c] = [c, n - 1 - r]; at[r * n + c] = i; }
    return at;
  }
  const cubeEl = i => tray.querySelector(`.kc-cube[data-i="${i}"]`);
  function buildTray() {
    tray.style.setProperty('--n', M.n); tray.style.setProperty('--rot', '0deg');
    tray.classList.remove('turning', 'tf-y', 'tf-r', 'tf-a', 'tf-b');
    const bon = R.bon || {};
    tray.innerHTML = dispOrder().map(i => { const c = R.cells[i], b = bon[i]; return `<div class="kc-cell"><div class="kc-cube${b ? ' bon b' + b : ''}" data-i="${i}"><div class="kc-face"><b class="${c === 'QU' ? 'qu' : ''}">${c === 'QU' ? 'Qu' : c}</b>${M.sc === 'lp' ? `<i>${ptOf(c)}</i>` : ''}${b ? `<em class="kc-bn b${b}">${b}</em>` : ''}</div></div></div>`; }).join('')
      + '<svg class="kc-line" aria-hidden="true"><polyline class="g" points=""/><polyline points=""/></svg>';
    paintHint(); paintTrace();
  }
  // the hinted word's first R.hintK cubes are striped and numbered (CD-109: 7.1; CD-116: 1.1 Next cube)
  function paintHint() {
    tray.querySelectorAll('.kc-cube.hint').forEach(c => { c.classList.remove('hint'); c.removeAttribute('data-hn'); });
    if (!R.hint || R.found[R.hint] || !R.words[R.hint]) return;
    R.words[R.hint].slice(0, Math.max(1, R.hintK || 1)).forEach((i, k) => { const c = cubeEl(i); if (c) { c.classList.add('hint'); c.dataset.hn = k + 1; } });
  }
  function paintGame() {
    const solo = M.mode === 'solo';
    $('#kcBot').classList.toggle('solo', solo);
    $('#kcBotAv').textContent = solo ? '🎯' : '🤖';
    $('#kcBotNm').textContent = solo ? `Best ${M.n}×${M.n}` : `Bot · L${M.lv}`;
    $('#kcMeAv').innerHTML = UI.meWin().av || '🙂';
    $('#kcMeNm').textContent = (UI.settings().name || '').trim() || 'You';
    $('#kcDone').hidden = !solo;
    paintScores(); paintChips(); paintHintBtn(); paintPause();
  }
  // v12c (CD-112 add. 2.1): in a match of 3 or 5 rounds the big number is the GAME total, with this round under it.
  // The Bot's points stay hidden until the round ends (CD-109: 6.2), so its round line counts words.
  function paintScores() {
    const multi = M.mode === 'duel' && M.rounds > 1, my = myPts();
    $('#kcMeSc').innerHTML = `${UI.fmtN(multi ? M.me + my : my)}<small>pts</small>`;
    $('#kcMeRd').textContent = multi ? `Rd ${M.no}: ${UI.fmtN(my)} pts` : '';
    $('#kcBotSc').innerHTML = M.mode === 'solo' ? `${st.solo[M.n] ? UI.fmtN(st.solo[M.n]) : '–'}<small>pts</small>`
      : multi ? `${UI.fmtN(M.bot)}<small>pts</small>` : `${R.botN}<small>${R.botN === 1 ? 'word' : 'words'}</small>`;
    $('#kcBotRd').textContent = multi ? `Rd ${M.no}: ${R.botN} wds` : '';
    $('#kcMeRd').title = $('#kcBotRd').title = multi ? `Round ${M.no} of ${M.rounds}; the big number is the game total` : '';
    $('#kcBar').classList.toggle('multi', multi);
  }
  function paintChips(newW) {
    $('#kcFHead').textContent = `Your words: ${R.mine.length} of ${UI.fmtN(R.all)}`;
    $('#kcFPts').textContent = UI.fmtN(myPts()) + ' pts';
    $('#kcChips').innerHTML = R.mine.length ? R.mine.slice().reverse().map(m => `<span class="kc-chip${m.w === newW ? ' new' : ''}">${m.w}<small>${m.s.t}</small></span>`).join('')
      : '<span class="kc-empty">Words you find go here. Join touching cubes: across, down or diagonally, each cube once.</span>';
    $('#kcLeft').innerHTML = leftLine();
  }

  // ---------- tracing: swipe / drag / tap / type ----------
  // v12c (CD-112: 1.2.1, laggy swipes on phones): the cubes are measured once per swipe (geo); a swipe may start in a gap;
  // the points between two finger readings are filled in, so a fast finger never skips a cube; and a swipe that starts
  // beside a leftover tapped cube starts a new word instead of joining it.
  let trace = [], tapMode = false, dragging = false, moved = false, typed = '';
  let geo = null, G = null, lastXY = null;
  const adj = (a, b) => adjN(a, b, M.n);
  function measure() {
    geo = [...tray.querySelectorAll('.kc-cube')].map(el => { const r = el.getBoundingClientRect(); return { i: +el.dataset.i, x: r.left + r.width / 2, y: r.top + r.height / 2, rad: r.width * 0.44, w: r.width }; });
  }
  function hit(x, y) {
    if (!geo) measure();
    let best = -1, bd = 1e9;
    for (const g of geo) { const d = Math.hypot(x - g.x, y - g.y); if (d < g.rad && d < bd) { bd = d; best = g.i; } }
    return best;
  }
  function paintTrace() {
    tray.querySelectorAll('.kc-cube.on').forEach(el => el.classList.remove('on'));
    trace.forEach(i => { const c = cubeEl(i); if (c) c.classList.add('on'); });
    const pts = trace.map(i => { const c = cubeEl(i); if (!c) return ''; const cell = c.parentElement; return (cell.offsetLeft + cell.offsetWidth / 2) + ',' + (cell.offsetTop + cell.offsetHeight * 0.47); }).join(' ');
    tray.querySelectorAll('.kc-line polyline').forEach(pl => pl.setAttribute('points', pts));
    if (trace.length) { const w = trace.map(i => R.cells[i]).join(''); $('#kcMsg').innerHTML = trace.map(i => `<span class="kc-wl">${R.cells[i] === 'QU' ? 'Qu' : R.cells[i]}</span>`).join('') + (w.length >= 2 ? `<span class="kc-wp">${w.length}</span>` : ''); }
  }
  function clearTrace() { trace = []; tapMode = false; typed = ''; if (R && M && !$('#kcPlay').hidden) paintTrace(); }
  function add(i) { trace.push(i); snd('key'); paintTrace(); }
  function back() { trace.pop(); paintTrace(); if (!trace.length) msg(''); }
  const canPlay = () => R && !R.over && !R.paused && !tray.classList.contains('turning');
  // one cube reached while the finger moves
  function reach(i) {
    if (i < 0) return;
    if (G.tap >= 0 && i !== G.tap) { trace = [G.tap]; G.tap = -1; G.join = -1; } // a swipe from the last tapped cube: a new word from it
    if (G.join >= 0 && i !== trace[trace.length - 1]) { trace = trace.slice(G.join); G.join = -1; paintTrace(); } // a swipe next to a leftover cube: a new word
    if (!trace.length) { add(i); moved = true; return; }
    const last = trace[trace.length - 1];
    if (i === last) return;
    if (i === trace[trace.length - 2]) { back(); moved = true; return; }
    if (adj(last, i) && !trace.includes(i)) { add(i); moved = true; }
  }
  tray.addEventListener('pointerdown', e => {
    if (!canPlay() || (e.pointerType === 'mouse' && e.button !== 0)) return;
    e.preventDefault(); try { tray.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ }
    measure();
    dragging = true; moved = false; typed = ''; lastXY = [e.clientX, e.clientY];
    G = { tap: -1, prev: false, join: -1 };
    const i = hit(e.clientX, e.clientY);
    if (i < 0) { if (!tapMode) { trace = []; paintTrace(); } return; } // started in a gap: the first cube reached starts the word
    if (tapMode && trace.length) {
      const last = trace[trace.length - 1];
      if (i === last) { G.tap = i; return; }                                   // a tap on it sends the word (on release)
      if (i === trace[trace.length - 2]) { G.tap = i; G.prev = true; return; } // a tap on the one before takes a cube back
      if (adj(last, i) && !trace.includes(i)) { G.join = trace.length; add(i); return; }
    }
    trace = []; tapMode = false; add(i);
  });
  tray.addEventListener('pointermove', e => {
    if (!dragging || !geo) return;
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [];
    for (const ev of (evs.length ? evs : [e])) {
      const x = ev.clientX, y = ev.clientY, [x0, y0] = lastXY, d = Math.hypot(x - x0, y - y0), step = Math.max(4, geo[0].w / 5), k = Math.ceil(d / step);
      for (let s = 1; s <= k; s++) reach(hit(x0 + (x - x0) * s / k, y0 + (y - y0) * s / k));
      lastXY = [x, y];
    }
  });
  const up = () => {
    if (!dragging) return; dragging = false;
    const g = G; G = null; geo = null;
    if (moved) { if (trace.length >= 2) submit(); else tapMode = true; return; }
    if (g && g.tap >= 0) { if (g.prev) back(); else submit(); return; }
    tapMode = trace.length > 0;
  };
  tray.addEventListener('pointerup', up); tray.addEventListener('pointercancel', up);
  // typing: the app finds a path that spells what you type (Q types the Qu cube with or without the U)
  function findPath(word) {
    const N = R.cells.length;
    const dfs = (i, k, used, path) => {
      const c = R.cells[i]; let len = c.length;
      if (word.substr(k, len) !== c) { if (c === 'QU' && word[k] === 'Q') len = 1; else return null; }
      const k2 = k + len; path.push(i); used[i] = 1;
      if (k2 === word.length) return path.slice();
      for (let j = 0; j < N; j++) if (!used[j] && adj(i, j)) { const r = dfs(j, k2, used, path); if (r) return r; }
      path.pop(); used[i] = 0; return null;
    };
    for (let i = 0; i < N; i++) { const r = dfs(i, 0, {}, []); if (r) return r; }
    return null;
  }
  function paintTyped() {
    if (!typed) { clearTrace(); msg(''); return; }
    const p = findPath(typed);
    if (p) { trace = p; tapMode = true; paintTrace(); }
    else { trace = []; paintTrace(); $('#kcMsg').innerHTML = typed.split('').map(c => `<span class="kc-wl no">${c}</span>`).join('') + '<span class="kc-wp">not on the grid</span>'; }
  }
  document.addEventListener('keydown', e => {
    if (!playOn() || !R || R.over || modalOpen() || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target && e.target.closest && e.target.closest('input, select, textarea')) return;
    if (e.key === ' ') { e.preventDefault(); setPause(!R.paused); return; }
    if (R.paused) return;
    if (/^[a-z]$/i.test(e.key)) { typed += e.key.toUpperCase(); snd('key'); paintTyped(); e.preventDefault(); }
    else if (e.key === 'Backspace') { typed = typed.slice(0, -1); paintTyped(); e.preventDefault(); }
    else if (e.key === 'Escape') { clearTrace(); msg(''); }
    else if (e.key === 'Enter') { e.preventDefault(); if (trace.length) submit(); else if (typed) { const t = typed; typed = ''; nudge(`${t}: not on the grid`); } } // CD-112: 1.3.1: a failed word clears
  });

  // ---------- words found ----------
  function msg(html, kind, ms) {
    const m = $('#kcMsg');
    m.innerHTML = html ? `<span class="kc-mt ${kind || ''}">${html}</span>` : hintHtml();
    clearTimeout(msg.t);
    if (ms) msg.t = setTimeout(() => { if (!trace.length && R && !R.over) msg(''); }, ms);
  }
  function nudge(t) { msg(t, 'bad', 1600); snd('bounce'); const m = $('#kcMsg'); m.classList.remove('shake'); void m.offsetWidth; m.classList.add('shake'); }
  function flash(path, cls) { path.forEach(i => { const c = cubeEl(i); if (c) { c.classList.remove(cls); void c.offsetWidth; c.classList.add(cls); } }); }
  function submit() {
    const path = trace.slice(), w = path.map(i => R.cells[i]).join('');
    trace = []; tapMode = false; typed = ''; paintTrace();
    if (!path.length) return;
    if (w.length < M.min) { nudge(`Too short: ${M.min}+ letters`); return; }
    if (R.found[w]) { msg(`${w}: already found`, 'dup', 1500); snd('draw'); flash(path, 'dupc'); return; }
    if (!R.words[w]) { nudge(`${w}: not a word`); return; }
    const s = scoreOf(w, path);
    R.mine.push({ w, p: path, s }); R.found[w] = 1;
    if (R.hint === w) { R.hint = null; R.hintK = 0; paintHint(); }
    msg(`${w} +${s.t}${s.wm > 1 ? ` (×${s.wm} word bonus)` : ''}`, 'good', 1400); snd('word'); flash(path, 'ok');
    const p = $('#kcMePlus'); p.textContent = '+' + s.t; p.classList.remove('go'); void p.offsetWidth; p.classList.add('go');
    paintScores(); paintChips(w); paintHintBtn(); save();
  }

  // ---------- 💡 Hint (CD-109: 7.1–7.2; 9.2.1) and 🔄 Turn ----------
  const hintCap = () => M.mode === 'duel' ? HINT_CAP_DUEL : M.sCap === '3' ? 3 : Infinity;
  const hintFree = () => M.mode === 'solo' && M.sHint === 'free';
  function hintHtml() { return R && R.hint && !R.found[R.hint] && !R.over ? `<span class="kc-mt clue">💡 ${R.hint.length} letters: ${esc(clueOf(R.hint))}${(R.hintK || 1) > 1 ? ` <small>(${R.hintK} cubes shown)</small>` : ''}</span>` : ''; }
  // CD-116: 1.1: while a hinted word is unfound, 💡 stripes its next cube (🪙1; never the last cube; not counted in the limit)
  const nextOn = () => !!(R && R.hint && !R.found[R.hint] && R.words[R.hint] && (R.hintK || 1) < R.words[R.hint].length - 1);
  function paintHintBtn() {
    const left = hintCap() - R.hints, b = $('#kcHint'), nx = nextOn();
    $('#kcHintNm').textContent = nx ? 'Next' : 'Hint';
    $('#kcHintCp').textContent = nx ? (hintFree() ? 'next cube · free' : '🪙1 · next cube')
      : hintFree() ? (left === Infinity ? 'free' : `free · ${left} left`) : `🪙1/letter${left === Infinity ? '' : ` · ${left} left`}`;
    b.title = nx ? 'Next cube: stripe the next cube of your hinted word' : 'Hint: the clue for a word you have not found';
    b.disabled = (left <= 0 && !nx) || R.over;
  }
  function pickHint() {
    const cand = Object.keys(R.words).filter(w => !R.found[w] && w !== R.hint && clueOf(w)).sort((a, b) => famOf(a) - famOf(b) || a.length - b.length);
    return cand.length ? cand[Math.floor(Math.random() * Math.min(6, cand.length))] : null;
  }
  let hintArm = null;
  $('#kcHint').addEventListener('click', () => {
    if (!canPlay()) return;
    const b = $('#kcHint');
    if (nextOn()) { // Next cube
      if (hintFree()) { giveNext(0); return; }
      if (!b.classList.contains('armed')) {
        if (UI.coins && UI.coins.bal < 1) { UI.coins.spend(1, `${NM.cubes} Next cube`); return; }
        UI.armTap(b, 1); msg('💡 Stripe the next cube of your hinted word: tap again to buy (🪙1)', '', 2600); return;
      }
      UI.armTap(b, 0);
      if (UI.coins && !UI.coins.spend(1, `${NM.cubes} Next cube`)) return;
      giveNext(1); return;
    }
    if (R.hints >= hintCap()) { msg(`No Hints left this round (${hintCap()} per round)`, 'dup', 2000); return; }
    if (!b.classList.contains('armed')) {
      hintArm = pickHint();
      if (!hintArm) { msg('No more words with a clue to hint', 'dup', 2000); return; }
      if (hintFree()) { giveHint(hintArm, 0); return; }
      const price = hintArm.length;
      if (UI.coins && UI.coins.bal < price) { UI.coins.spend(price, `${NM.cubes} Hint`); return; }
      UI.armTap(b, price);
      msg(`💡 A Hint for a ${hintArm.length}-letter word: tap again to buy (🪙${price})`, '', 2600);
      return;
    }
    UI.armTap(b, 0); // the second tap: disarm, then buy
    if (!hintArm || R.found[hintArm]) return;
    if (UI.coins && !UI.coins.spend(hintArm.length, `${NM.cubes} Hint (${hintArm.length} letters)`)) return;
    giveHint(hintArm, hintArm.length);
  });
  function giveHint(w, price) {
    R.hints++; R.hintCoins += price; M.coins -= price;
    R.hint = w; R.hintK = 1;
    paintHint(); msg(''); paintHintBtn(); save();
  }
  function giveNext(price) {
    R.hintK = (R.hintK || 1) + 1; R.hintCoins += price; M.coins -= price;
    paintHint(); snd('key'); msg(''); paintHintBtn(); save();
  }
  $('#kcTurn').addEventListener('click', () => { // 🔄 Rotate (CD-116: 2.1a; the button keeps its old id)
    if (!canPlay()) return;
    clearTrace(); snd('row');
    tray.classList.add('turning'); tray.style.setProperty('--rot', '90deg');
    setTimeout(() => { R.rot = (R.rot + 1) % 4; tray.classList.add('snap'); buildTray(); void tray.offsetWidth; tray.classList.remove('snap'); save(); }, reduceMotion() ? 0 : 470);
  });
  $('#kcDone').addEventListener('click', () => { if (R && !R.over && M.mode === 'solo') endRound(); });

  // ---------- ⏸ Pause: the button or the clock ----------
  function setPause(on) {
    if (!R || R.over) return;
    R.paused = !!on;
    if (on) { clearTrace(); document.querySelectorAll('#keycubes .btn.armed').forEach(b => UI.armTap(b, 0)); }
    paintPause(); msg('');
  }
  function paintPause() {
    const p = !!(R && R.paused);
    tray.classList.toggle('blur', p); $('#kcPz').hidden = !p;
    const b = $('#kcPause');
    b.innerHTML = p ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z" fill="currentColor"/></svg>' : '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5.5" y="4" width="4.6" height="16" rx="1.2" fill="currentColor"/><rect x="13.9" y="4" width="4.6" height="16" rx="1.2" fill="currentColor"/></svg>';
    b.title = p ? 'Resume' : 'Pause: the clock stops and the cubes are hidden'; b.setAttribute('aria-label', b.title);
  }
  $('#kcPause').addEventListener('click', () => setPause(!(R && R.paused)));
  $('#kcClock').addEventListener('click', () => setPause(!(R && R.paused)));
  $('#kcPz').addEventListener('click', () => setPause(false));

  // ---------- the clock; the Bot's finds ----------
  let lastT = performance.now(), lastSec = -1, flashSec = 0;
  function tick(dt) {
    if (!R || !M) return;
    if (dt && playOn() && !R.over && !R.paused && !modalOpen() && !document.hidden) R.el += dt;
    const sec = Math.floor(R.el / 1000), T = M.timer, rem = T ? Math.max(0, T - sec) : sec;
    if (!playOn()) return;
    $('#kcClk').textContent = fmt(rem);
    const c = $('#kcClock'); c.classList.toggle('y', !!T && rem <= 10 && rem > 5 && !R.over); c.classList.toggle('r', !!T && rem <= 5 && !R.over);
    if (M.mode === 'duel' && !R.over) {
      let got = false;
      while (R.botN < R.bot.length && R.bot[R.botN].t * 1000 <= R.el) { R.botN++; got = true; }
      if (got) { paintScores(); const p = $('#kcBotPlus'); p.classList.remove('go'); void p.offsetWidth; p.classList.add('go'); }
    }
    if (T && !R.over && rem !== lastSec && rem > 0 && rem <= 10 && dt && !R.paused) snd(rem <= 5 ? 'tock' : 'tick');
    setFlash(T && !R.over && !R.paused ? rem : 0);
    lastSec = rem;
    if (T && rem <= 0 && !R.over) { setFlash(0); endRound(); }
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
  function endRound() {
    if (!R || R.over) return;
    R.over = true; R.paused = false; clearTrace(); setFlash(0);
    document.querySelectorAll('#keycubes .btn.armed').forEach(b => UI.armTap(b, 0));
    const duel = M.mode === 'duel';
    R.botN = R.bot.length;
    R.meTot = R.mine.reduce((a, m) => a + (R.botSet[m.w] ? 0 : m.s.t), 0);
    R.botTot = duel ? R.bot.reduce((a, b) => a + (R.found[b.w] ? 0 : scoreOf(b.w).t), 0) : 0;
    R.shared = R.mine.filter(m => R.botSet[m.w]).length;
    M.me += R.meTot; M.bot += R.botTot;
    M.list.push({ me: R.meTot, bot: R.botTot, words: R.mine.length, botWords: R.bot.length, all: R.all });
    // coins (CD-109: 7.3): a round win 10, a draw 5; the match winner 20 more
    R.earn = 0;
    if (duel) {
      R.earn = R.meTot > R.botTot ? WIN : R.meTot === R.botTot ? DRAW : 0;
      if (R.earn && UI.coins) UI.coins.add(R.earn, `${NM.cubes}: round ${R.earn === WIN ? 'won' : 'drawn'}`);
    }
    if (M.no >= M.rounds) M.done = true;
    R.matchEarn = 0;
    if (duel && M.done && M.me > M.bot) { R.matchEarn = MATCH; if (UI.coins) UI.coins.add(MATCH, `${NM.cubes}: match won`); }
    M.coins += R.earn + R.matchEarn;
    // stats
    st.rounds++; st.words += R.mine.length;
    for (const m of R.mine) if (!st.best || m.s.t > st.best.p) st.best = { w: m.w, p: m.s.t };
    if (duel && M.done) { st.matches++; if (M.me > M.bot) st.won++; else if (M.me === M.bot) st.drawn++; }
    let newBest = false;
    if (!duel) { st.soloN++; if (R.meTot > (st.solo[M.n] || 0)) { st.solo[M.n] = R.meTot; newBest = true; } }
    R.newBest = newBest;
    // CD-112: 3.3: with Paid Hints, a new Solo best pays 🪙5
    if (!duel && newBest && M.sHint === 'paid') { R.earn = SOLO_BEST; M.coins += SOLO_BEST; if (UI.coins) UI.coins.add(SOLO_BEST, `${NM.cubes}: Solo new best`); }
    saveSt();
    history();
    save(); UI.lobby();
    // CD-112 add. 2.1: the fanfare (win sound + confetti) only when the game is over; a round before the last gets a soft chime
    const won = duel ? (M.done ? M.me > M.bot : R.meTot > R.botTot) : newBest || R.mine.length > 0;
    if (duel && !M.done) snd('word');
    else snd(won ? 'win' : duel && M.me === M.bot ? 'draw' : 'lose');
    if (won && M.done && !night() && !reduceMotion()) confetti();
    resTab = R.mine.length || !duel ? 'me' : 'bot'; resSel = null;
    setTimeout(showRes, 450);
  }
  function confetti() {
    const c = document.createElement('div'); c.className = 'kr-confetti';
    c.innerHTML = Array.from({ length: 40 }, (_, k) => `<i style="left:${Math.random() * 100}%;background:${['#f5b300', '#2c6bd8', '#1e9e4a', '#e0457b', '#4fc3f7'][k % 5]};animation-delay:${(Math.random() * 0.5).toFixed(2)}s"></i>`).join('');
    document.body.appendChild(c); setTimeout(() => c.remove(), 2600);
  }
  // the win report: the round's result, or the match's after its last round
  // Solo has no winner: the row reads "NEW BEST! 🏆 42 pts" or "ROUND OVER 🎯 42 pts", in the same gold frame
  // v12c (CD-112 add. 2.1; CD-116: 4.1): before the last round of a match, a plain banner ("ROUND 1 of 3 · You lead 48–31");
  // the gold "You WIN!" row only once the game is over
  const midMatch = () => M.mode === 'duel' && !M.done && M.rounds > 1;
  function leadHtml() {
    const a = M.me, b = M.bot, s = a >= b ? `${UI.fmtN(a)}–${UI.fmtN(b)}` : `${UI.fmtN(b)}–${UI.fmtN(a)}`;
    const t = a > b ? 'You lead' : a < b ? 'The Bot leads' : 'Tied';
    return `<span class="kc-lead" role="status"><span class="r">Round ${M.no} of ${M.rounds}</span><b>${t} ${s}</b></span>`;
  }
  function winHtml() {
    if (midMatch()) return leadHtml();
    if (M.mode !== 'solo') return UI.winLine(winObj());
    const lab = `${R.newBest ? 'New best' : 'Round over'}, ${R.meTot} points`;
    return `<span class="ob-h" role="status" aria-label="${lab}"><span class="ob-line" aria-hidden="true"><span class="ob-av">${UI.meWin().av || ''}</span><b class="ob-v">${R.newBest ? 'NEW BEST!' : 'ROUND OVER'}</b><span class="ob-sym">${R.newBest ? '🏆' : '🎯'}</span><span class="ob-sc">${UI.fmtN(R.meTot)} pts</span></span></span>`;
  }
  function winObj() {
    const a = M.done && M.rounds > 1 ? [M.me, M.bot] : [R.meTot, R.botTot];
    if (a[0] === a[1]) return { draw: true, score: `${UI.fmtN(a[0])}–${UI.fmtN(a[1])}` };
    return a[0] > a[1] ? Object.assign(UI.meWin(), { score: `${UI.fmtN(a[0])}–${UI.fmtN(a[1])}` }) : { av: '🤖', who: 'The Bot', score: `${UI.fmtN(a[1])}–${UI.fmtN(a[0])}` };
  }
  function history() {
    if (!UI.history) return;
    const duel = M.mode === 'duel';
    const rows = M.list.map((r, i) => `<tr><td>Round ${i + 1}</td><td>${UI.fmtN(r.me)}</td>${duel ? `<td>${UI.fmtN(r.bot)}</td>` : ''}<td>${r.words} of ${r.all}</td></tr>`).join('');
    const body = `<div class="${midMatch() ? 'kc-hist-over' : 'overbar kc-hist-over'}">${winHtml()}</div>
      <table class="score-table kc-hist-t"><tr><th></th><th>You</th>${duel ? '<th>Bot</th>' : ''}<th>Your words</th></tr>${rows}
      ${duel && M.rounds > 1 ? `<tr class="total"><td>Match</td><td>${UI.fmtN(M.me)}</td><td>${UI.fmtN(M.bot)}</td><td></td></tr>` : ''}</table>
      <p class="help-note">Last round, your words: ${R.mine.map(m => `<b>${m.w}</b> ${m.s.t}`).join(' · ') || 'none'}</p>`;
    const entry = {
      g: 'cubes', win: duel ? (M.done ? M.me > M.bot : M.me >= M.bot) : R.newBest,
      title: `${NM.cubes} · ${duel ? (M.done ? (M.me > M.bot ? 'Match won' : M.me === M.bot ? 'Match drawn' : 'Match lost') : `Round ${M.no} of ${M.rounds}`) : 'Solo'} (${M.n}×${M.n})`,
      sub: [duel ? `Challenge Level ${M.lv}` : 'Solo', `${M.n}×${M.n}`, timerName(M.timer)].concat(duel ? [plural(M.rounds, 'round')] : []).join(' · '),
      score: duel ? `${UI.fmtN(M.me)}–${UI.fmtN(M.bot)}` : `${UI.fmtN(R.meTot)} pts`, coins: M.coins, html: body
    };
    if (!M.histT || !UI.history.put) M.histT = UI.history.add(entry) || 0;
    else UI.history.put(M.histT, entry);
  }

  // ---------- results screen ----------
  let resTab = 'me', resSel = null;
  function showRes() {
    if (!R || !R.over) return;
    UI.showScreen('keycubes'); part('kcRes');
    SEC.classList.toggle('kc-wide', innerWidth >= 700 && innerWidth > innerHeight); // v12c: the wide layout also when the results open first (Resume)
    const duel = M.mode === 'duel';
    setHead(duel ? `Round ${M.no} of ${M.rounds} · results` : `Solo · ${M.n}×${M.n} · results`);
    $('#kcWin').classList.toggle('overbar', !midMatch());
    $('#kcWin').innerHTML = winHtml();
    $('#kcScore').hidden = !duel; if (duel) $('#kcScore').innerHTML = scoreCard();
    const all = R.all, pct = Math.round(100 * R.mine.length / Math.max(1, all));
    const coinsTxt = duel ? [R.earn ? `Round ${R.earn === WIN ? 'win' : 'draw'} +${R.earn}` : 'No round coins', R.matchEarn ? `Match win +${R.matchEarn}` : '', R.hintCoins ? `Hints −${R.hintCoins}` : ''].filter(Boolean).join(' · ')
      : [R.earn ? `New best +${R.earn}` : '', R.hintCoins ? `Hints −${R.hintCoins}` : ''].filter(Boolean).join(' · ') || (M.sHint === 'paid' ? 'No coins this round' : 'Solo: no coins');
    $('#kcSum').innerHTML = `<span class="kc-pill"><span class="e">🙂</span> ${UI.fmtN(R.mine.length)} of ${UI.fmtN(all)} words (${pct}%)</span>`
      + (duel ? `<span class="kc-pill"><span class="e">🤖</span> ${plural(R.bot.length, 'word')}</span><span class="kc-pill shared">✕ ${R.shared} shared: 0 pts</span>` : `<span class="kc-pill"><span class="e">🎯</span> Best ${M.n}×${M.n}: ${st.solo[M.n] ? UI.fmtN(st.solo[M.n]) : '–'} pts</span>`)
      + `<span class="kc-pill">🪙 ${coinsTxt}</span>`;
    const tabs = duel ? [['me', `Your words (${R.mine.length})`], ['bot', `Bot's words (${R.bot.length})`], ['all', `All words (${UI.fmtN(all)})`]]
      : [['me', `Words found (${R.mine.length})`], ['all', `All words (${UI.fmtN(all)})`]];
    $('#kcTabs').innerHTML = tabs.map(([k, t]) => `<button type="button" data-t="${k}" class="${k === resTab ? 'on' : ''}">${t}</button>`).join('');
    $('#kcNext').textContent = M.done ? '🆕 New Game' : '▶ Next round'; // the suite standard (CD-113)
    requestAnimationFrame(() => UI.fitOver($('#kcWin')));
    paintList();
  }
  // the score card (CD-112 add. 2.1; CD-116: 4.1): the game totals, big, as in CrossKeys; then one row per round with the
  // running total; rounds still to play show "–"
  function scoreCard() {
    const multi = M.rounds > 1, me = multi ? M.me : R.meTot, bot = multi ? M.bot : R.botTot;
    const big = `<div class="kc-big"><div class="me"><span>You</span><b>${UI.fmtN(me)}</b></div><span class="lab">${multi ? (M.done ? 'Final game total' : 'Game total') : 'Final score'}</span><div class="them"><b>${UI.fmtN(bot)}</b><span>Bot</span></div></div>`;
    if (!multi) return big;
    let a = 0, b = 0, rowsH = '';
    for (let k = 0; k < M.rounds; k++) {
      const r = M.list[k];
      if (r) { a += r.me; b += r.bot; rowsH += `<tr class="${k === M.list.length - 1 ? 'now' : ''}"><td>Round ${k + 1}</td><td>${UI.fmtN(r.me)}</td><td>${UI.fmtN(r.bot)}</td><td>${UI.fmtN(a)}–${UI.fmtN(b)}</td></tr>`; }
      else rowsH += `<tr class="todo"><td>Round ${k + 1}</td><td>–</td><td>–</td><td></td></tr>`;
    }
    return big + `<table class="score-table kc-rtab"><tr><th>Round</th><th>You</th><th>Bot</th><th>Running</th></tr>${rowsH}
      <tr class="total"><td>Game total</td><td>${UI.fmtN(M.me)}</td><td>${UI.fmtN(M.bot)}</td><td></td></tr></table>`;
  }
  function rows() {
    const tag = w => { const m = !!R.found[w], b = !!R.botSet[w]; return m && b ? 'both' : m ? 'me' : b ? 'bot' : 'miss'; };
    let L;
    if (resTab === 'me') L = R.mine.map(m => ({ w: m.w, p: m.p, s: m.s }));
    else if (resTab === 'bot') L = R.bot.map(b => ({ w: b.w, p: R.words[b.w], s: scoreOf(b.w) }));
    else L = Object.keys(R.words).map(w => { const m = R.mine.find(x => x.w === w); return m ? { w, p: m.p, s: m.s } : { w, p: R.words[w], s: scoreOf(w) }; });
    L.forEach(r => { r.tag = tag(r.w); });
    return L.sort((a, b) => b.s.t - a.s.t || a.w.localeCompare(b.w));
  }
  function paintList() {
    const L = rows();
    if (!resSel || !L.some(r => r.w === resSel)) resSel = L.length ? L[0].w : null;
    const lab = { me: M.mode === 'solo' ? 'Found' : 'You', bot: 'Bot', both: 'Both', miss: 'Missed' };
    $('#kcList').innerHTML = L.length ? L.map(r => `<button type="button" class="kc-row ${r.tag}${r.w === resSel ? ' sel' : ''}" data-w="${r.w}"><span class="p">${r.s.t}</span><span class="w">${r.w}</span><span class="tg ${r.tag}">${lab[r.tag]}</span><span class="bk">${clueOf(r.w) ? '📖' : ''}</span></button>`).join('')
      : '<p class="kc-empty" style="padding:12px">No words this round.</p>';
    paintDet(L.find(r => r.w === resSel));
  }
  function paintDet(r) {
    const d = $('#kcDet');
    if (!r) { d.innerHTML = '<p class="kc-empty">Pick a word in the list.</p>'; return; }
    const n = M.n, ms = SEC.classList.contains('kc-wide') ? 46 : (n === 4 ? 30 : 24);
    const pos = {}; r.p.forEach((i, k) => { pos[i] = k + 1; });
    const order = dispOrder(), dp = {}; order.forEach((li, k) => { dp[li] = k; });
    const bon = R.bon || {};
    const cells = order.map(i => { const c = R.cells[i], b = bon[i]; return `<span class="${pos[i] ? 'lit' + (pos[i] === 1 ? ' st' : '') : ''}">${pos[i] ? `<sup>${pos[i]}</sup>` : ''}${c === 'QU' ? 'Qu' : c}${b ? `<em class="kc-bn b${b}">${b}</em>` : ''}</span>`; }).join('');
    const step = ms + 3, xy = i => [5 + (dp[i] % n) * step + ms / 2, 5 + Math.floor(dp[i] / n) * step + ms / 2];
    const both = r.tag === 'both', c = clueOf(r.w);
    const by = { me: M.mode === 'solo' ? 'You found it.' : 'Only you found it.', bot: 'Only the Bot found it.', both: 'You both found it, so it scores for nobody.', miss: 'Nobody found it.' }[r.tag];
    const used = r.p.map(i => bon[i]).filter(Boolean), lb = used.filter(b => b.endsWith('L')), wb = used.filter(b => b.endsWith('W'));
    const tb = (M.sc === 'len' ? `<tr><td>Word length (${r.w.length} letters)</td><td>${r.s.lb}</td></tr>` : `<tr><td>Letter points${lb.length ? ` (with ${lb.join(', ')})` : ''}</td><td>${r.s.lp}</td></tr><tr><td>Length bonus (${r.w.length} letters)</td><td>+${r.s.lb}</td></tr>`)
      + (r.s.wm > 1 ? `<tr><td>Word bonus (${wb.join(' × ')})</td><td>×${r.s.wm}</td></tr>` : '');
    d.innerHTML = `<div class="kc-mini" style="--ms:${ms}px;grid-template-columns:repeat(${n}, ${ms}px)">${cells}<svg aria-hidden="true"><polyline points="${r.p.map(i => xy(i).join(',')).join(' ')}"/></svg></div>
      <div class="kc-bd"><h3>${r.w}</h3><table>${tb}<tr class="tot${both ? ' zero' : ''}"><td>${both ? 'Shared word' : 'Total'}</td><td>${both ? 0 : r.s.t}</td></tr></table>
      <p class="kc-who">${by}</p>${c ? `<div class="kc-clue">📖 Clue: ${esc(c)}</div>` : '<div class="kc-clue none">Not in the Lexicon yet: no clue to show.</div>'}</div>`;
  }
  $('#kcTabs').addEventListener('click', e => { const b = e.target.closest('button[data-t]'); if (!b) return; resTab = b.dataset.t; resSel = null; for (const x of $$('#kcTabs button')) x.classList.toggle('on', x === b); paintList(); });
  $('#kcList').addEventListener('click', e => { const r = e.target.closest('.kc-row'); if (!r) return; resSel = r.dataset.w; for (const x of $$('#kcList .kc-row')) x.classList.toggle('sel', x === r); paintDet(rows().find(x => x.w === resSel)); });
  $('#kcNext').addEventListener('click', () => { if (M && !M.done) { newRound(); save(); showPlay(); } else start(); });
  $('#kcResLobby').addEventListener('click', goLobby);
  $('#kcResSetup').addEventListener('click', showSetup);

  // ---------- layout ----------
  function fit() {
    if (!screenOn()) return;
    const W = innerWidth, H = innerHeight, wide = W >= 700 && W > H;
    SEC.classList.toggle('kc-wide', wide);
    if (!$('#kcPlay').hidden && M) {
      const top = $('#kcPlay').getBoundingClientRect().top, bar = $('#kcBar').offsetHeight;
      let size;
      if (wide) size = Math.min(H - top - bar - 84, (Math.min(W, 1400) - 80) * 0.55); // room for the tray's 3D edge and the key tips
      else size = Math.min(W - 24, H - top - bar - 46 - $('#kcBtns').offsetHeight - 110 - 40, 640);
      size = Math.max(200, Math.floor(size));
      tray.style.setProperty('--ts', size + 'px'); tray.style.setProperty('--cs', (size * 0.93 / M.n) + 'px');
      paintTrace();
    }
    if (!$('#kcRes').hidden && R && R.over) { UI.fitOver($('#kcWin')); paintList(); }
  }
  window.addEventListener('resize', fit);

  // ---------- header and Lobby ----------
  $('#kcMenu').addEventListener('click', goLobby);
  $('#kcNewG').addEventListener('click', newGame);
  $('#kcSet').addEventListener('click', () => { if (R && !R.over) R.paused = false; save(); showSetup(); });
  $('#kcHelp').addEventListener('click', help);
  $('#kcCard').addEventListener('click', e => { if (!e.target.closest('button')) showSetup(); });
  $('#kcResumeBtn').addEventListener('click', () => { if (unfinished()) showPlay(); });
  $('#kcNewBtn').addEventListener('click', newGame);
  $('#kcSetupBtn').addEventListener('click', showSetup);

  // ---------- How To Play ----------
  function help() {
    const sec = UI.helpSec;
    openModal(`<h2 class="mk-title">How To Play ${NM.cubes} <span class="chip">${UI.APP_VER}</span></h2>
      <p>Find as many words as you can in a grid of letter cubes before the clock runs out. In a <b>Duel</b>, the Bot hunts the same grid.</p>
      <p class="help-note">Tap a heading to open it.</p>
      ${sec('The Basics', `
        <li>Open ${NM.cubes} from its card in the ${NM.suite} Lobby: <b>🆕 New Game</b> starts at once with your last settings, <b>⚙ Setup</b> (or a tap on the card) shows the settings first, and <b>▶ Resume</b> appears while a match is unfinished.</li>
        <li>A word joins <b>touching cubes</b>: across, down or diagonally. Each cube is used <b>once per word</b>, but in as many words as you like.</li>
        <li>Any real English word counts (the ENABLE word list): at least <b>3 letters on 4×4</b> and <b>4 letters on 5×5</b> (Setup can change it). <b>Qu</b> is one cube that spells two letters.</li>`)}
      ${sec('Spell a Word', `
        <li><b>Swipe</b> (touch) or <b>drag</b> (mouse) across the cubes, then let go. You can start in the gap beside a cube. Slide back one cube to undo it. Every new swipe starts a new word.</li>
        <li>Or <b>tap</b> the cubes one by one, then tap the last one again.</li>
        <li>Or <b>type</b> the word and press <b>Enter</b> (the app finds the cubes): <b>⌫</b> takes a letter back, <b>Esc</b> clears, <b>Space</b> pauses. A word that fails clears, so your next letter starts a new word.</li>
        <li>The strip above the grid shows your word, then what happened: <b>green</b> = a new word and its points, <b>orange</b> = already found, <b>red</b> = not a word, too short, or not on the grid, <b>blue</b> = your Hint.</li>`)}
      ${sec('Duel and Solo', `
        <li><b>⚔ Duel</b>: the Bot hunts the same grid at the same time. Its word count shows beside the clock; its words stay hidden until the end. A word you <b>both</b> find scores for <b>nobody</b>.</li>
        <li>A match is <b>1, 3 or 5 rounds</b>, each on a fresh grid. The higher <b>total</b> over the rounds wins the match. The next round starts when you tap <b>▶ Next round</b>.</li>
        <li><b>Challenge Level</b> (1–10, default 3): at low levels the Bot knows only everyday words; at 9–10 it knows rare ones too, and it finds more of the words it knows as the level rises.</li>
        <li><b>🎯 Solo</b>: no Bot. Untimed (the clock counts up) or timed; <b>🏁 Done</b> ends the round. Beat your best score for each grid size.</li>`)}
      ${sec('Scoring', `
        <li><b>Letter points + length bonus</b> (the standard): each cube shows its letter's points (common letters 1, rare ones up to 10; Qu 10), and longer words add a bonus: 4 letters +2, 5 +4, 6 +7, 7 +11, 8 +16, then +5 for each letter more.</li>
        <li><b>Word length only</b> (a Setup choice): 3 letters 1, 4 = 2, 5 = 3, 6 = 5, 7 = 8, 8 = 12, then +4 for each letter more.</li>
        <li><b>Bonus cubes</b> (On unless you turn them off in Setup) carry a badge and move to new cubes every round: <b>2L</b> / <b>3L</b> double / triple that cube's letter points; <b>2W</b> / <b>3W</b> double / triple the whole word (two word bonuses in one word multiply). 4×4 has one of each; 5×5 has one 3W, two 2W, two 2L and one 3L. With Word length only, there are only 2W and 3W. They count for the Bot too.</li>`)}
      ${sec('The Buttons', `
        <li><b>💡 Hint</b> shows the clue and the length of a word you haven't found, and stripes its first cube: a signal, not a solve. It costs <b>🪙1 per letter</b> of that word (two taps: the first shows the price), at most <b>3 per round</b> in a Duel. In Solo, Hints are free or paid, 3 per round or no limit (Setup).</li>
        <li>While your hinted word is still unfound, the button reads <b>💡 Next</b>: each tap stripes its <b>next cube</b> (numbered 1, 2, 3…) for <b>🪙1</b> (free with free Solo Hints). It never shows the last cube, and it doesn't count toward the Hint limit.</li>
        <li><b>Left</b>, under your words, counts the words you haven't found yet, by length. Free.</li>
        <li><b>🔄 Rotate</b> gives the grid a quarter turn, which helps you see new words. Free.</li>
        <li><b>⏸ Pause</b> (or tap the clock) stops the clock (and the Bot) and hides the cubes.</li>
        <li>In the last 10 seconds the grid flashes every second: <b>yellow</b> from 10 to 6, <b>red</b> from 5 to 1, with a tick each second.</li>`)}
      ${sec('Coins', `
        <li>In a Duel: a round won pays <b>🪙${WIN}</b>, a draw <b>🪙${DRAW}</b>, and a match won <b>🪙${MATCH}</b> more. Hints cost 🪙1 per letter; Next cube 🪙1.</li>
        <li>Solo: with free Hints, no coins. With <b>Paid</b> Hints, a new best score pays <b>🪙${SOLO_BEST}</b>.</li>
        <li>A word hunt always runs the full clock, so ${NM.cubes} has no speed coins.</li>`)}
      ${sec('Results', `
        <li>During a match, the big number in your box (and the Bot's) is the <b>game total</b>; the line under yours is this round. The Bot's words, and so its round points, stay hidden until the round ends.</li>
        <li>After rounds before the last: "<b>Round 1 of 3 · You lead 48–31</b>". After the last round: the gold "<b>You WIN!</b>" row with the final game total.</li>
        <li>The score card shows the <b>game totals</b> big, then each round with the running total. Below it: your words out of every word in the grid, the shared words and your coins.</li>
        <li>Tabs: <b>Your words</b>, <b>Bot's words</b> and <b>All words</b> (every word in the grid, found or missed). Words <b>only you</b> found are <b style="color:#12a03c">green</b>; <b>shared</b> words are <b style="color:#e01e1e">red</b> and score 0. Tap a word to see its path on a small grid (blue = the first cube), how its points add up (with any bonus), and its <b>📖 clue</b> when it's a Lexicon word.</li>`)}
      ${sec('Setup', `
        <li><b>Play</b>: Duel or Solo. <b>Grid</b>: 4×4 or 5×5. <b>Timer</b>: 30 s Blitz, 1, 2 (standard), 3, 4 or 5 min; Untimed in Solo. <b>Challenge Level</b> 1–10.</li>
        <li>Under <b>▸ More options</b>: Shortest word, Rounds per match, Scoring, <b>Bonus cubes</b> (On / Off), <b>Cube Colors</b> (Cream, Inked, Inked Blue, Steel, Navy &amp; gold), <b>Button Colors</b> (Steel, Sapphire, Navy &amp; gold) and, for Solo, Hints (free or paid, 3 per round or no limit).</li>
        <li>Every grid is rolled fresh from ${NM.cubes}' own cubes; a grid with too few words is rolled again.</li>`)}
      ${sec('Your Stats', `
        <li>Matches, the share won, words found, your best-scoring word and your best Solo score for each grid size are kept on this device. Every match (and Solo round) also goes into <b>📜 Game History</b>.</li>`)}
      <div class="row"><button class="btn primary" data-a="close">OK</button></div>`);
    $('#sheet').onclick = e => { if (UI.helpClick && UI.helpClick(e)) return; if (e.target.closest('[data-a="close"]')) closeModal(); };
  }

  window.KeyCubes = {
    setup: showSetup,
    newGame,
    help,
    lobby: () => ({
      played: st.matches, pct: st.matches ? Math.round(100 * st.won / st.matches) : 0, best: st.best ? st.best.w : '–',
      unf: unfinished() ? unfText() : '', last: lastLine(), fresh: !st.matches && !st.soloN
    }),
    _M: () => M, _R: () => R, _solve: solve, _deal: deal // for checks only
  };
  if (UI.lobby) UI.lobby();
})();
