/* Clue Duel — game engine (v07d)
   Puzzle generator (arrow-word grid), tile bag, scoring modes, bonus squares and the computer opponent.
   No DOM code here: app.js handles everything the player sees. */
'use strict';
(function (global) {
  // ---------- Letter values (rarer letters are worth more) ----------
  const VAL = { A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 5, L: 1, M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10 };
  const SIZES = { S: [5, 6], M: [6, 7], L: [7, 11] }; // [columns, rows] of the playable area
  const RULES = { wrongPenalty: 2, hintCost: 3, fullHandBonus: 10, perLetterWordBonus: 2, plusCell: 5, plus2Cell: 2, passLimit: 3, timeCost: 5, timeAdd: 30000 };

  // ---------- Scoring modes (JM, CD-2: 2.1–2.5) ----------
  // tiles: what a placed tile scores · word: what finishing a word scores
  // 2x cells never score on their own: each 2x cell in a turn adds another (base x 2), where base = tiles + words (JM rule CD-3: 6.2).
  // v06 (JM, CD-11/CD-12): bonuses and penalties are the same in every mode (RULES): a +5 cell gives 5, Full Hand gives 10,
  // a Hint costs 3, and a Wrong Cell costs the tile's value in this mode or 2, whichever is larger (see penaltyOf).
  // The modes now differ only in how tiles and words score. plus/full stay on each mode for older code that reads them.
  const MODES = {
    classic: { name: 'Classic', tiles: 'val', word: 'sum', plus: RULES.plusCell, full: RULES.fullHandBonus,
      desc: 'Rare letters are worth more. Finishing a word scores its letters again, plus 2 per letter.' },
    flat: { name: 'Flat', tiles: 'one', word: 'len', plus: RULES.plusCell, full: RULES.fullHandBonus,
      desc: 'Every tile scores 1. Finishing a word adds 1 per letter.' },
    finisher: { name: 'Word Finisher', tiles: 'none', word: 'sq', plus: RULES.plusCell, full: RULES.fullHandBonus,
      desc: 'Tiles score nothing on their own. Finish a word to score its length × length (4 letters = 16).' },
    combo: { name: 'Combo Chain', tiles: 'chain', word: 'none', plus: RULES.plusCell, full: RULES.fullHandBonus,
      desc: 'Each correct tile in a turn is worth 1 more than the last: 1, 2, 3… A wrong cell restarts the chain.' },
    bounty: { name: 'Bounty', tiles: 'bounty', word: 'sum', plus: RULES.plusCell, full: RULES.fullHandBonus,
      desc: 'Letter values come from this grid: a letter that appears once is worth 6, a common one 1. Finishing a word scores its letters again, plus 2 per letter.' }
  };
  const modeOf = state => MODES[(state.settings && state.settings.scoring) || 'classic'] || MODES.classic;
  const showsValues = state => { const t = modeOf(state).tiles; return t === 'val' || t === 'bounty'; };
  // A tile's value in hand (used for the end-of-game subtraction and the tile labels)
  function tileVal(state, ch) {
    const t = modeOf(state).tiles;
    if (t === 'val') return VAL[ch];
    if (t === 'bounty') return (state.bv && state.bv[ch]) || 1;
    return 1;
  }
  // What one placed tile scores by itself (Combo Chain is handled in scoreMove)
  function letterPts(state, ch) {
    const t = modeOf(state).tiles;
    return t === 'none' || t === 'chain' ? 0 : t === 'one' ? 1 : tileVal(state, ch);
  }
  // Penalties (v06, JM CD-11/CD-12): the same in every mode. Hint: 3. Wrong Cell: the tile's value in this mode
  // or 2, whichever is larger (a wrong Q or Z in Classic costs 10). Without a letter, a Wrong Cell costs 2.
  function penaltyOf(state, kind, ch) {
    if (kind === 'hint') return RULES.hintCost;
    return Math.max(ch ? tileVal(state, ch) : 0, RULES.wrongPenalty);
  }
  // Bounty values: the rarer a letter is in this grid, the more it is worth
  function bountyValues(pz) {
    const n = {};
    for (const c of pz.cells) if (c.k === 'l') n[c.s] = (n[c.s] || 0) + 1;
    const bv = {};
    for (const ch of Object.keys(VAL)) { const k = n[ch] || 0; bv[ch] = k <= 1 ? 6 : k === 2 ? 4 : k === 3 ? 3 : k <= 5 ? 2 : 1; }
    return bv;
  }

  // ---------- Timer codes: '0' untimed · 't30' per turn (seconds) · 'g300' whole game (seconds) ----------
  function timerOf(code) {
    if (typeof code === 'number') return code > 0 ? { kind: 'turn', secs: code } : { kind: 'none', secs: 0 };
    const m = /^([tg])(\d+)$/.exec(String(code || ''));
    if (!m) return { kind: 'none', secs: 0 };
    return { kind: m[1] === 't' ? 'turn' : 'game', secs: +m[2] };
  }

  // ---------- Random numbers ----------
  function makeRng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function newSeed() {
    try { const u = new Uint32Array(1); crypto.getRandomValues(u); return u[0]; } catch (e) { return (Math.random() * 4294967296) >>> 0; }
  }
  function shuffle(a, rng) {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  // ---------- Lexicon ----------
  let WORDS = null;
  // v07a (JM, CD-18: 5.1): a word may appear more than once. The first line is its main clue set; each later line adds
  // an extra clue set (e.g. HE: "That man" and "Helium's symbol"), and one set is picked at random for each grid.
  // Optional 6th field: the Challenge Levels where that clue set may be used, "7" (7 and up) or "2-4" (2 to 4)
  // (JM, CD-13: 2.1–2.3). On a word's first line it also limits where the word itself appears.
  const skRange = s => { const m = /^\s*(\d+)\s*(?:-\s*(\d+))?\s*$/.exec(s || ''); return m ? [+m[1], m[2] ? +m[2] : 10] : [1, 10]; };
  const inSk = (r, skill) => !r || (skill >= r[0] && skill <= r[1]);
  let WBY = null;
  function lexicon() {
    if (WORDS) return WORDS;
    WORDS = [];
    WBY = {};
    for (const raw of String(global.LEXICON_DATA || '').split('\n')) {
      const line = raw.trim();
      if (!line || line[0] === '#') continue;
      const f = line.split('|');
      const w = (f[0] || '').trim().toUpperCase();
      if (!/^[A-Z]{2,11}$/.test(w)) continue;
      const set = {
        e: (f[1] || '').trim(),
        h: (f[2] || f[1] || '').trim(),
        l: Math.min(5, Math.max(1, parseInt(f[3], 10) || 1)),
        p: (f[4] || '').trim(),
        sk: skRange(f[5])
      };
      if (WBY[w]) {
        const en = WBY[w];
        (en.alts = en.alts || []).push(set);
        en.wsk = [Math.min(en.wsk[0], set.sk[0]), Math.max(en.wsk[1], set.sk[1])]; // the word appears wherever any set may
        continue;
      }
      const entry = Object.assign({ w, wsk: set.sk.slice() }, set);
      WBY[w] = entry;
      WORDS.push(entry);
    }
    const seen = new Set(Object.keys(WBY));
    // One-letter answers (v04): every letter A–Z, clued from LETTER_DATA (see letterClues)
    for (let k = 0; k < 26; k++) { const ch = String.fromCharCode(65 + k); if (!seen.has(ch)) { seen.add(ch); WORDS.push({ w: ch, e: ch, h: ch, l: 1, p: '' }); } }
    return WORDS;
  }
  // Clues for one-letter answers. Format per line: LETTER|clue|level 1-3|picture (optional)
  let LETTERS = null;
  function letterClues() {
    if (LETTERS) return LETTERS;
    LETTERS = {};
    for (const raw of String(global.LETTER_DATA || '').split('\n')) {
      const line = raw.trim();
      if (!line || line[0] === '#') continue;
      const f = line.split('|');
      const ch = (f[0] || '').trim().toUpperCase();
      if (!/^[A-Z]$/.test(ch) || !f[1]) continue;
      (LETTERS[ch] = LETTERS[ch] || []).push({ t: f[1].trim(), l: Math.min(3, Math.max(1, parseInt(f[2], 10) || 1)), p: (f[3] || '').trim() });
    }
    return LETTERS;
  }

  // ---------- CLUE PICS v02 and wordplay clues (Phase C) ----------
  // Lowest Challenge Level for each picture type, and how hard each type is (higher = harder)
  const PIC_MIN = { lit: 1, cat: 3, assoc: 4, rebus: 6, sound: 7, math: 8 };
  const PIC_RANK = { lit: 0, cat: 1, assoc: 2, rebus: 3, sound: 4, math: 5 };
  const PIC_RATE = { off: 0, some: 0.3, lots: 0.65 }; // Clue pics option: share of clues shown as pictures
  let PICS = null, WORDPLAY = null;
  function picIndex() {
    if (PICS) return PICS;
    PICS = {};
    const add = (w, t, p) => { (PICS[w] = PICS[w] || []).push({ t, p }); };
    for (const e of lexicon()) if (e.p) add(e.w, 'lit', e.p);
    for (const raw of String(global.CLUEPIC_DATA || '').split('\n')) {
      const line = raw.trim();
      if (!line || line[0] === '#') continue;
      const f = line.split('|');
      if (f.length < 3) continue;
      const w = f[0].trim().toUpperCase(), t = f[1].trim(), p = f.slice(2).join('|').trim();
      if (PIC_MIN[t] && p && !(PICS[w] || []).some(x => x.t === t && x.p === p)) add(w, t, p);
    }
    return PICS;
  }
  function wordplayIndex() {
    if (WORDPLAY) return WORDPLAY;
    WORDPLAY = {};
    for (const raw of String(global.WORDPLAY_DATA || '').split('\n')) {
      const line = raw.trim();
      if (!line || line[0] === '#') continue;
      const i = line.indexOf('|');
      if (i > 0) WORDPLAY[line.slice(0, i).trim().toUpperCase()] = line.slice(i + 1).trim();
    }
    return WORDPLAY;
  }

  // Bitset index: for each word length, position and letter, which words match.
  const indexCache = {};
  function getIndex(maxLevel, skill) {
    const ck = maxLevel + ':' + (skill || 0);
    if (indexCache[ck]) return indexCache[ck];
    const idx = {};
    for (const e of lexicon()) {
      if (e.l > maxLevel) continue;
      // v07a: a word enters the grid only at Challenge Levels where at least one of its clue sets may be used
      if (skill && !inSk(e.sk, skill) && !(e.alts || []).some(x => inSk(x.sk, skill))) continue;
      const L = e.w.length;
      (idx[L] = idx[L] || { list: [] }).list.push(e);
    }
    for (const L in idx) {
      const ix = idx[L];
      const n = ix.list.length, nw = (n + 31) >>> 5;
      ix.nw = nw;
      ix.pos = [];
      for (let p = 0; p < L; p++) { const arr = []; for (let k = 0; k < 26; k++) arr.push(new Uint32Array(nw)); ix.pos.push(arr); }
      ix.list.forEach((e, i) => { for (let p = 0; p < L; p++) ix.pos[p][e.w.charCodeAt(p) - 65][i >>> 5] |= (1 << (i & 31)); });
      ix.full = new Uint32Array(nw);
      for (let i = 0; i < n; i++) ix.full[i >>> 5] |= (1 << (i & 31));
      ix.avail = new Uint32Array(nw);
    }
    indexCache[ck] = idx;
    return idx;
  }
  function popcount(x) { x -= (x >>> 1) & 0x55555555; x = (x & 0x33333333) + ((x >>> 2) & 0x33333333); return (((x + (x >>> 4)) & 0x0F0F0F0F) * 0x01010101) >>> 24; }

  // ---------- Grid pattern (where clue cells go) ----------
  // Full grid = (H+1) rows x (W+1) cols. Row 0 and column 0 are the clue headers.
  // mode (JM, CD-7: 4.1.1):
  //   'double' every clue cell inside the grid holds two clues (across and down) — Small and Medium
  //   'edge'   the same, except clue cells in the last two rows or columns (where two clues can't fit) may hold one — Large
  //   'open'   any clue cell may hold one or two clues (the v02 style; used only as a last-resort fallback)
  //   'full'   v04 (JM, CD-9: 1.1, modeled on the reference game): EVERY clue cell holds a clue. The top row and left
  //            column hold one each; every clue cell inside the grid holds two (across on top, down below), except in
  //            the bottom row and right column, which hold one. No clue cell sits in the first row or column of letters,
  //            so every border cell has a word. Answers may be 1 or 2 letters long (at most maxOnes 1-letter answers).
  function makePattern(W, H, Lmax, density, rng, mode, maxOnes) {
    mode = mode || 'open';
    const FULL = mode === 'full';
    const R = H + 1, C = W + 1;
    const g = new Uint8Array(R * C);
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) if (r === 0 || c === 0) g[r * C + c] = 1;
    const isC = (r, c) => r < 0 || c < 0 || r >= R || c >= C || g[r * C + c] === 1;
    const runLen = (r, c, dr, dc) => {
      if (isC(r, c)) return 0;
      let n = 1, rr = r - dr, cc = c - dc;
      while (!isC(rr, cc)) { n++; rr -= dr; cc -= dc; }
      rr = r + dr; cc = c + dc;
      while (!isC(rr, cc)) { n++; rr += dr; cc += dc; }
      return n;
    };
    const covered = (r, c) => r < 0 || c < 0 || r >= R || c >= C || isC(r, c) || runLen(r, c, 0, 1) >= 2 || runLen(r, c, 1, 0) >= 2;
    const cluesA = (r, c) => !isC(r, c + 1) && runLen(r, c + 1, 0, 1) >= 2;
    const cluesD = (r, c) => !isC(r + 1, c) && runLen(r + 1, c, 1, 0) >= 2;
    const cluesSomething = (r, c) => cluesA(r, c) || cluesD(r, c);
    // Is this inner clue cell acceptable for the grid style?
    const nextA = (r, c) => c + 1 < C && !isC(r, c + 1);
    const nextD = (r, c) => r + 1 < R && !isC(r + 1, c);
    const okClue = (r, c) => {
      if (FULL) {
        if (r === R - 1 && c === C - 1) return false;
        if (r === R - 1) return nextA(r, c);
        if (c === C - 1) return nextD(r, c);
        return nextA(r, c) && nextD(r, c);
      }
      if (mode === 'open') return cluesSomething(r, c);
      if (cluesA(r, c) && cluesD(r, c)) return true;
      return mode === 'edge' && (c >= C - 2 || r >= R - 2) && cluesSomething(r, c);
    };
    const block2 = (r, c) => {
      for (const [a, b] of [[-1, -1], [-1, 0], [0, -1], [0, 0]]) {
        const r0 = r + a, c0 = c + b;
        if (r0 < 0 || c0 < 0 || r0 + 1 >= R || c0 + 1 >= C) continue;
        if (isC(r0, c0) && isC(r0 + 1, c0) && isC(r0, c0 + 1) && isC(r0 + 1, c0 + 1)) return true;
      }
      return false;
    };
    // 1-letter answers: a letter boxed in by clue cells (or the edge) in one direction
    const maxOnesN = maxOnes == null ? 99 : maxOnes;
    const countOnes = () => {
      let ones = 0;
      for (let r = 1; r < R; r++) for (let c = 1; c < C; c++) {
        if (isC(r, c)) continue;
        if (isC(r, c - 1) && isC(r, c + 1)) ones++;
        if (isC(r - 1, c) && isC(r + 1, c)) ones++;
      }
      return ones;
    };
    // the clue cell that starts the run passing through (r,c) in a direction
    const startClue = (r, c, dr, dc) => { while (!isC(r, c)) { r -= dr; c -= dc; } return [r, c]; };
    const tryPlace = (r, c) => {
      if (r < 1 || c < 1 || isC(r, c)) return false;
      if (FULL && (r < 2 || c < 2)) return false;
      if (r === R - 1 && c === C - 1) return false;
      g[r * C + c] = 1;
      let ok = !block2(r, c) && okClue(r, c);
      if (ok) for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) if (!covered(r + dr, c + dc)) { ok = false; break; }
      // the clue cells that start the runs to the left and above must still clue their words
      if (ok) { const [a, b] = isC(r, c - 1) ? [r, c - 1] : startClue(r, c - 1, 0, 1); if (a >= 1 && b >= 1 && !okClue(a, b)) ok = false; }
      if (ok) { const [a, b] = isC(r - 1, c) ? [r - 1, c] : startClue(r - 1, c, 1, 0); if (a >= 1 && b >= 1 && !okClue(a, b)) ok = false; }
      if (ok && FULL && countOnes() > maxOnesN) ok = false; // keep 1-letter answers rare
      if (!ok) g[r * C + c] = 0;
      return ok;
    };
    const longRuns = () => {
      const out = [];
      for (let r = FULL ? 2 : 1; r < R; r++) { let c = 1; while (c < C) { if (isC(r, c)) { c++; continue; } const s = c; while (c < C && !isC(r, c)) c++; if (c - s > Lmax) out.push({ h: true, r, s, len: c - s }); } }
      for (let c = FULL ? 2 : 1; c < C; c++) { let r = 1; while (r < R) { if (isC(r, c)) { r++; continue; } const s = r; while (r < R && !isC(r, c)) r++; if (r - s > Lmax) out.push({ h: false, c, s, len: r - s }); } }
      return out;
    };
    // Phase 1: break runs that are too long
    for (let guard = 0; guard < 200; guard++) {
      const runs = longRuns();
      if (!runs.length) break;
      const run = runs[Math.floor(rng() * runs.length)];
      // any cut position; ends included so cuts don't line up into a wall
      const ks = [];
      for (let k = 0; k < run.len; k++) ks.push(k);
      shuffle(ks, rng);
      let done = false;
      for (const k of ks) {
        const r = run.h ? run.r : run.s + k, c = run.h ? run.s + k : run.c;
        if (tryPlace(r, c)) { done = true; break; }
      }
      if (!done) { return null; }
    }
    if (longRuns().length) { return null; }
    // Phase 2: sprinkle clue cells up to the target density
    let count = 0;
    for (let r = 1; r < R; r++) for (let c = 1; c < C; c++) if (isC(r, c)) count++;
    const target = Math.round(W * H * density);
    for (let tries = 0; count < target && tries < 800; tries++) {
      const r = 1 + Math.floor(rng() * H), c = 1 + Math.floor(rng() * W);
      if (tryPlace(r, c)) count++;
    }
    // Final checks
    let letters = 0, first = -1;
    for (let r = 1; r < R; r++) for (let c = 1; c < C; c++) {
      if (isC(r, c)) { if (!okClue(r, c)) { return null; } continue; }
      if (!covered(r, c)) { return null; }
      letters++; if (first < 0) first = r * C + c;
    }
    // letter cells must be connected
    const seen = new Uint8Array(R * C), stack = [first]; seen[first] = 1; let reach = 0;
    while (stack.length) {
      const i = stack.pop(); reach++;
      const r = Math.floor(i / C), c = i % C;
      for (const [dr, dc] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
        const rr = r + dr, cc = c + dc;
        if (isC(rr, cc)) continue;
        const j = rr * C + cc;
        if (!seen[j]) { seen[j] = 1; stack.push(j); }
      }
    }
    if (reach !== letters) { return null; }
    if (FULL && countOnes() > maxOnesN) return null;
    return g;
  }

  function slotsOf(g, R, C, minLen) {
    minLen = minLen || 2;
    const slots = [];
    const isC = (r, c) => r >= R || c >= C || g[r * C + c] === 1;
    for (let r = 1; r < R; r++) {
      let c = 1;
      while (c < C) {
        if (isC(r, c)) { c++; continue; }
        const s = c, cells = [];
        while (c < C && !isC(r, c)) { cells.push(r * C + c); c++; }
        if (cells.length >= minLen) slots.push({ d: 'A', cells, clue: r * C + s - 1 });
      }
    }
    for (let c = 1; c < C; c++) {
      let r = 1;
      while (r < R) {
        if (isC(r, c)) { r++; continue; }
        const s = r, cells = [];
        while (r < R && !isC(r, c)) { cells.push(r * C + c); r++; }
        if (cells.length >= minLen) slots.push({ d: 'D', cells, clue: (s - 1) * C + c });
      }
    }
    return slots;
  }

  // ---------- Fill the pattern with words (backtracking search) ----------
  function fillSlots(slots, N, idx, rng, budget, prefLevel, boost) {
    const letters = new Int8Array(N).fill(-1);
    for (const L in idx) idx[L].avail.set(idx[L].full);
    const assign = new Array(slots.length).fill(-1);
    let nodes = 0;
    const cand = (s) => {
      const ix = idx[s.cells.length];
      const bs = ix.avail.slice();
      for (let p = 0; p < s.cells.length; p++) {
        const ch = letters[s.cells[p]];
        if (ch >= 0) { const m = ix.pos[p][ch]; for (let k = 0; k < bs.length; k++) bs[k] &= m[k]; }
      }
      return bs;
    };
    const count = (bs) => { let n = 0; for (let k = 0; k < bs.length; k++) if (bs[k]) n += popcount(bs[k]); return n; };
    function rec() {
      if (++nodes > budget) return false;
      let best = -1, bestBs = null, bestN = Infinity;
      for (let i = 0; i < slots.length; i++) {
        if (assign[i] >= 0) continue;
        const bs = cand(slots[i]);
        const n = count(bs);
        if (n === 0) return false;
        if (n < bestN) { bestN = n; best = i; bestBs = bs; if (n === 1) break; }
      }
      if (best < 0) return true;
      const s = slots[best], ix = idx[s.cells.length];
      const ids = [];
      for (let k = 0; k < bestBs.length; k++) { let w = bestBs[k]; while (w) { const b = w & -w; ids.push((k << 5) + (31 - Math.clz32(b))); w ^= b; } }
      const scored = ids.map(id => ({ id, k: rng() - Math.abs(ix.list[id].l - prefLevel) * 0.14 + (boost ? boost(ix.list[id]) : 0) }));
      scored.sort((a, b) => b.k - a.k);
      const lim = Math.min(scored.length, 6);
      for (let t = 0; t < lim; t++) {
        const id = scored[t].id, w = ix.list[id].w, set = [];
        for (let p = 0; p < w.length; p++) { const ci = s.cells[p]; if (letters[ci] < 0) { letters[ci] = w.charCodeAt(p) - 65; set.push(ci); } }
        if (w.length > 1) ix.avail[id >>> 5] &= ~(1 << (id & 31)); // 1-letter answers may repeat
        assign[best] = id;
        if (rec()) return true;
        assign[best] = -1;
        if (w.length > 1) ix.avail[id >>> 5] |= (1 << (id & 31));
        for (const ci of set) letters[ci] = -1;
        if (nodes > budget) return false;
      }
      return false;
    }
    return rec() ? { letters, assign } : null;
  }

  // ---------- Build a complete puzzle ----------
  function generate(opts) {
    const [W, H] = SIZES[opts.size] || SIZES.M;
    const skill = Math.min(10, Math.max(1, opts.skill | 0 || 1));
    const seed = opts.seed >>> 0 || newSeed();
    const rng = makeRng(seed);
    const k = (skill - 1) / 9;                       // 0 (easy) … 1 (hard)
    const Lmax = skill <= 3 ? 5 : skill <= 6 ? 6 : 7;  // longest word allowed
    const density = 0.27 - 0.09 * k;                   // share of inner cells that are clue cells
    const prefLevel = 1 + k * 3.2;                     // preferred vocabulary level
    let maxLevel = Math.min(5, 2 + Math.floor(skill / 3));
    const R = H + 1, C = W + 1, N = R * C;
    // Lean the word choice toward words that have picture clues (more so with "Lots"),
    // and, from level 5, toward words that have wordplay clues
    const picW = { off: 0, some: 0.12, lots: 0.4 }[opts.pics] || 0.12;
    const pics = picIndex(), wpl = wordplayIndex();
    const boost = e => {
      let b = 0;
      const ps = pics[e.w];
      if (ps && ps.some(x => skill >= PIC_MIN[x.t])) b += picW;
      if (skill >= 5 && wpl[e.w]) b += 0.6;
      return b;
    };
    // Grid style (JM, CD-7: 4.1.1): Small and Medium use double-clue cells throughout; Large allows single-clue
    // cells along its last two rows and columns. In a double-clue grid the last two columns and rows can't hold
    // clue cells, so their words run the full height / width of the grid (6 or 7 letters).
    // v04 (JM, CD-9: 1.1): every size uses the 'full' style, where every clue cell holds a clue. If a grid keeps
    // failing, the vocabulary widens and a few more 1-letter answers are allowed; it never falls back to blank cells.
    const style = opts.style || 'full';
    const ones = opts.maxOnes != null ? opts.maxOnes : ({ S: 2, M: 4, L: 6 })[opts.size] || 4;
    const plan = style === 'full' ? [['full', 240, ones], ['full', 240, ones + 2], ['full', 400, 99]]
      : style === 'open' ? [['open', 150]] : style === 'edge' ? [['edge', 200], ['open', 60]] : [['double', 220], ['edge', 60], ['open', 60]];
    let attempt = 0;
    for (const [mode, tries, maxOnes] of plan) {
      const L = mode === 'double' ? Math.min(7, Math.max(Lmax, W, H)) : Math.min(Lmax, 7);
      let lvl = maxLevel;
      const step = mode === 'open' ? 25 : 30; // widen the vocabulary if the grid keeps failing to fill
      for (let t = 0; t < tries; t++, attempt++) {
        if (t > 0 && t % step === 0) lvl = Math.min(5, lvl + 1);
        const idx = getIndex(lvl, skill);
        const g = makePattern(W, H, L, density, rng, mode, maxOnes);
        if (!g) continue;
        const slots = slotsOf(g, R, C, mode === 'full' ? 1 : 2);
        if (slots.some(s => !idx[s.cells.length])) continue;
        const res = fillSlots(slots, N, idx, rng, 2500, prefLevel, boost);
        if (!res) continue;
        return buildPuzzle({ W, H, R, C, N, g, slots, res, idx, rng, skill, k, seed, attempt, pics: opts.pics, mode });
      }
    }
    return null;
  }

  function buildPuzzle(o) {
    const { W, H, R, C, N, g, slots, res, idx, rng, skill, k } = o;
    const cells = [];
    for (let i = 0; i < N; i++) cells.push(g[i] ? { k: 'c', A: -1, D: -1 } : { k: 'l', s: String.fromCharCode(65 + res.letters[i]), b: '' });
    const pHard = Math.min(0.92, Math.max(0, (skill - 1.5) / 8));
    const pPic = PIC_RATE[o.pics] != null ? PIC_RATE[o.pics] : PIC_RATE.some;
    const cellSlots = Array.from({ length: N }, () => []);
    // 1-letter answers: a letter clue allowed at this level, never the same clue twice in a grid
    const LC = letterClues(), usedLC = new Set();
    const lcMax = skill <= 3 ? 1 : skill <= 6 ? 2 : 3;
    const letterClue = ch => {
      const all = (LC[ch] || []).filter(x => !usedLC.has(x.t));
      let opts = all.filter(x => x.l <= lcMax);
      if (!opts.length) opts = all.length ? all : [{ t: 'The letter ' + ch, l: 1, p: '' }];
      // harder levels lean toward the harder clues
      const pick = skill >= 7 && rng() < 0.6 ? opts.slice().sort((a, b) => b.l - a.l)[0] : opts[Math.floor(rng() * opts.length)];
      usedLC.add(pick.t);
      return pick.p && o.pics !== 'off' && rng() < (PIC_RATE[o.pics] != null ? PIC_RATE[o.pics] : PIC_RATE.some) + 0.2
        ? { t: pick.t, pic: pick.p, pt: 'lit', hard: false } : { t: pick.t, hard: pick.l >= 2 };
    };
    const outSlots = slots.map((s, si) => {
      const e = idx[s.cells.length].list[res.assign[si]];
      let clue;
      if (s.cells.length === 1) {
        clue = letterClue(e.w);
        cells[s.clue][s.d] = si;
        s.cells.forEach(ci => cellSlots[ci].push(si));
        return { d: s.d, cells: s.cells, clueCell: s.clue, word: e.w, lvl: 1, clue };
      }
      // pictures allowed at this Challenge Level, hardest type first (ties in random order)
      const pics = (picIndex()[e.w] || []).filter(x => skill >= PIC_MIN[x.t])
        .map(x => ({ x, r: PIC_RANK[x.t] + rng() * 0.5 })).sort((a, b) => b.r - a.r).map(o2 => o2.x);
      const wp = skill >= 5 ? wordplayIndex()[e.w] : '';
      // v07a: a word with extra clue sets picks one of the sets allowed at this Challenge Level at random. Pictures
      // and wordplay belong to the main meaning, so an extra set uses its own literal or indirect clue only.
      const sets = [e].concat(e.alts || []).filter(x => inSk(x.sk, skill));
      const cs = sets.length > 1 ? sets[Math.floor(rng() * sets.length)] : (sets[0] || e);
      if (cs !== e) {
        clue = rng() < pHard && cs.h && cs.h !== cs.e ? { t: cs.h, hard: true } : { t: cs.e, hard: false };
      } else if (pics.length && rng() < pPic) {
        const pick = rng() < 0.65 ? pics[0] : pics[Math.floor(rng() * pics.length)];
        clue = { t: e.e, pic: pick.p, pt: pick.t, hard: pick.t !== 'lit' };
      } else if (rng() < pHard && (wp || (e.h && e.h !== e.e))) clue = wp && rng() < 0.85 ? { t: wp, hard: true, wp: true } : { t: e.h && e.h !== e.e ? e.h : wp, hard: true };
      else clue = { t: e.e, hard: false };
      cells[s.clue][s.d] = si;
      s.cells.forEach(ci => cellSlots[ci].push(si));
      return { d: s.d, cells: s.cells, clueCell: s.clue, word: e.w, lvl: e.l, clue };
    });
    // Starter letters already on the board (more at easy levels)
    const letterCells = [];
    for (let i = 0; i < N; i++) if (cells[i].k === 'l') letterCells.push(i);
    const pre = new Set();
    const revealN = Math.round(letterCells.length * (0.26 - 0.13 * k));
    const order = shuffle(letterCells.slice(), rng);
    for (const ci of order) {
      if (pre.size >= revealN) break;
      // never pre-fill a whole word
      const ok = cellSlots[ci].every(si => outSlots[si].cells.some(cj => cj !== ci && !pre.has(cj)));
      if (ok) pre.add(ci);
    }
    // Bonus cells on the remaining (open) letter cells
    const open = shuffle(letterCells.filter(ci => !pre.has(ci)), rng);
    // v07a (JM, CD-13: 1.1, CD-18: 6.2): +2 cells exist only as fixed cells (Fixed and Both), about 6% of open cells
    const nx2 = Math.max(1, Math.round(open.length * 0.08)), np5 = Math.max(1, Math.round(open.length * 0.05)), np2 = Math.max(1, Math.round(open.length * 0.06));
    open.slice(0, nx2).forEach(ci => { cells[ci].b = 'x2'; });
    open.slice(nx2, nx2 + np5).forEach(ci => { cells[ci].b = 'p5'; });
    open.slice(nx2 + np5, nx2 + np5 + np2).forEach(ci => { cells[ci].b = 'p2'; });
    return { W, H, R, C, N, cells, slots: outSlots, cellSlots, pre: [...pre], skill, seed: o.seed, attempts: o.attempt + 1, mode: o.mode };
  }

  // ---------- Game state ----------
  function newGame(settings) {
    const pz = generate({ size: settings.size, skill: settings.skill, pics: settings.pics });
    if (!pz) return null;
    const rng = makeRng(pz.seed ^ 0x9E3779B9);
    const board = new Array(pz.N).fill('');
    const owner = new Array(pz.N).fill(-1);
    pz.pre.forEach(ci => { board[ci] = pz.cells[ci].s; owner[ci] = 2; });
    let nextId = 1;
    const bag = [];
    for (let i = 0; i < pz.N; i++) if (pz.cells[i].k === 'l' && !board[i]) bag.push({ id: nextId++, ch: pz.cells[i].s });
    shuffle(bag, rng);
    const hand = Math.min(8, Math.max(5, settings.hand | 0 || 6));
    const hands = [[], []];
    for (let n = 0; n < hand; n++) for (let p = 0; p < 2; p++) if (bag.length) hands[p].push(bag.pop());
    const scoring = MODES[settings.scoring] ? settings.scoring : 'classic';
    const bonus = ['fixed', 'floating', 'both', 'off'].includes(settings.bonus) ? settings.bonus : 'floating';
    // Fixed bonus cells only in "Fixed" and "Both"
    if (bonus === 'floating' || bonus === 'off') pz.cells.forEach(c => { if (c.k === 'l') c.b = ''; });
    const tm = timerOf(settings.timer);
    return {
      v: 4, settings: { ...settings, hand, scoring, bonus }, pz, board, owner, bag, hands, log: [], turnPen: [0, 0],
      turnItems: [[], []],                     // this turn's penalties, itemized for the turn report (CD-7 add'l 3)
      scores: [0, 0], turn: rng() < 0.5 ? 0 : 1, passes: 0, turnNo: 1, over: false,
      stats: { words: [0, 0], wrong: [0, 0], placed: [0, 0], hints: [0, 0], fullHands: [0, 0], places: [0, 0], time: [0, 0] },
      lastMove: null, result: null,
      fb: {},                                  // live floating bonuses: cell -> { b: 'x2' | 'p5', n: turn it appeared }
      ub: {},                                  // floating bonuses already used: cell -> 'x2' | 'p5'
      bv: bountyValues(pz),                    // Bounty letter values for this grid
      clock: tm.kind === 'game' ? tm.secs * 1000 : 0  // whole-game clock (ms left, yours only)
    };
  }

  // ---------- Bonus squares ----------
  // The bonus waiting on an empty cell: a fixed one, or a live floating one
  function bonusAt(state, ci) {
    if (state.board[ci]) return '';
    const c = state.pz.cells[ci];
    if (!c || c.k !== 'l') return '';
    return c.b || (state.fb && state.fb[ci] ? state.fb[ci].b : '');
  }
  // The bonus a filled cell carried (shown as a small badge)
  function bonusUsed(state, ci) {
    const c = state.pz.cells[ci];
    return (c && c.b) || (state.ub && state.ub[ci]) || '';
  }
  // Rolling pairs (JM, CD-3: 1.1): a new +5 / 2x pair at the start of every turn from turn 2,
  // so the player who moves second gets first crack at the first pair. Each pair lasts 2 turns.
  function rollBonuses(state) {
    const mode = state.settings.bonus;
    if (mode !== 'floating' && mode !== 'both') return;
    const fb = state.fb || (state.fb = {});
    for (const k of Object.keys(fb)) if (state.turnNo - fb[k].n >= 2 || state.board[k]) delete fb[k];
    if (state.turnNo < 2) return;
    const pz = state.pz, free = [];
    for (let i = 0; i < pz.N; i++) if (pz.cells[i].k === 'l' && !state.board[i] && !pz.cells[i].b && !fb[i]) free.push(i);
    shuffle(free, Math.random);
    if (free.length > 0) fb[free[0]] = { b: 'p5', n: state.turnNo };
    if (free.length > 1) fb[free[1]] = { b: 'x2', n: state.turnNo };
  }

  function wordValue(state, si) {
    const s = state.pz.slots[si], M = modeOf(state), L = s.cells.length;
    if (M.word === 'len') return L;
    if (M.word === 'sq') return L * L;
    if (M.word === 'none') return 0;
    let v = 0;
    for (const ci of s.cells) v += tileVal(state, state.pz.cells[ci].s);
    return v + RULES.perLetterWordBonus * L;
  }
  function fits(state, ci, ch) {
    const c = state.pz.cells[ci];
    return !!c && c.k === 'l' && !state.board[ci] && c.s === ch;
  }

  // Score a set of placements (not yet on the board), in the order they were placed.
  // A placement with reset:true came after a wrong cell (restarts a Combo Chain).
  function scoreMove(state, placements) {
    const pz = state.pz, M = modeOf(state);
    const set = new Set(placements.map(p => p.cell));
    let raw = 0, nx2 = 0, np5 = 0, np2 = 0, chain = 0;
    for (const p of placements) {
      if (M.tiles === 'chain') { if (p.reset) chain = 0; chain++; raw += chain; }
      else raw += letterPts(state, p.ch);
      const b = bonusAt(state, p.cell);
      if (b === 'x2') nx2++; else if (b === 'p5') np5++; else if (b === 'p2') np2++;
    }
    const touched = new Set();
    placements.forEach(p => pz.cellSlots[p.cell].forEach(si => touched.add(si)));
    const words = [];
    for (const si of touched) {
      const s = pz.slots[si];
      if (s.cells.every(ci => state.board[ci] || set.has(ci))) words.push({ si, w: s.word, v: wordValue(state, si) });
    }
    const wordPts = words.reduce((a, w) => a + w.v, 0);
    const base = raw + wordPts;
    const x2 = nx2 ? base * 2 * nx2 - base : 0;      // one 2x: base x 2 · two: x 4 · three: x 6 (no compounding)
    const p5 = np5 * M.plus;                          // added after doubling, never doubled
    const p2 = np2 * RULES.plus2Cell;                 // v07a: +2 cells, also added after doubling
    const full = placements.length > 0 && placements.length >= state.settings.hand;
    const fullPts = full ? M.full : 0;                // added after doubling, never doubled
    return { letters: raw, raw, base, nx2, x2, np5, p5, np2, p2, words, wordPts, full, fullPts, total: base + x2 + p5 + p2 + fullPts };
  }

  function commit(state, player, placements) {
    const sc = scoreMove(state, placements);
    const ids = new Set(placements.map(p => p.tileId));
    for (const p of placements) {
      if (state.fb && state.fb[p.cell]) { (state.ub || (state.ub = {}))[p.cell] = state.fb[p.cell].b; delete state.fb[p.cell]; }
      state.board[p.cell] = p.ch; state.owner[p.cell] = player;
    }
    state.hands[player] = state.hands[player].filter(t => !ids.has(t.id));
    state.scores[player] += sc.total;
    state.stats.words[player] += sc.words.length;
    state.stats.placed[player] += placements.length;
    if (sc.full) state.stats.fullHands[player]++;
    state.lastMove = { player, cells: placements.map(p => p.cell), score: sc };
    return sc;
  }

  // kind: 'wrong' (wrong cell) · 'hint' · 'place' (Place button, CD-7 add'l 1.1) · 'time' (+30s button, add'l 1.2)
  // ch: the letter involved (wrong cell, Place)
  function penalize(state, player, pts, kind, ch) {
    state.scores[player] -= pts;
    if (!state.turnPen) state.turnPen = [0, 0];
    state.turnPen[player] += pts;
    if (!state.turnItems) state.turnItems = [[], []];
    state.turnItems[player].push({ k: kind || 'wrong', v: pts, ch: ch || '' });
    const st = state.stats;
    if (kind === 'wrong') st.wrong[player]++;
    if (kind === 'hint') st.hints[player]++;
    if (kind === 'place') { st.places = st.places || [0, 0]; st.places[player]++; }
    if (kind === 'time') { st.time = st.time || [0, 0]; st.time[player]++; }
  }
  // The Place button (JM, CD-7 add'l 1.1): a random tile from the hand that fits a random open cell.
  // Costs that tile's value; the tile then scores like any other placement.
  function autoPlace(state, player, exclude) {
    const h = hint(state, player, exclude);
    if (!h) return null;
    const t = state.hands[player].find(x => x.id === h.tileId);
    return { cell: h.cell, tileId: h.tileId, ch: t.ch, cost: tileVal(state, t.ch) };
  }

  function refill(state, player) {
    const h = state.hands[player];
    while (h.length < state.settings.hand && state.bag.length) h.push(state.bag.pop());
  }

  function swapHand(state, player) {
    const h = state.hands[player];
    if (!state.bag.length) return false;
    const n = h.length;
    state.bag.push(...h);
    state.hands[player] = [];
    shuffle(state.bag, Math.random);
    for (let i = 0; i < n && state.bag.length; i++) state.hands[player].push(state.bag.pop());
    return true;
  }

  // Trade only the chosen tiles; new tiles take their places in the hand
  function swapSome(state, player, ids) {
    const pick = new Set(ids);
    const h = state.hands[player];
    const out = h.filter(t => pick.has(t.id));
    if (!out.length || !state.bag.length) return false;
    state.bag.push(...out);
    shuffle(state.bag, Math.random);
    state.hands[player] = h.map(t => (pick.has(t.id) ? state.bag.pop() : t)).filter(Boolean);
    return true;
  }

  function boardFull(state) {
    const pz = state.pz;
    for (let i = 0; i < pz.N; i++) if (pz.cells[i].k === 'l' && !state.board[i]) return false;
    return true;
  }

  // Ends the current player's turn. Returns true if the game is over.
  // kind: 'pass' (default when nothing was placed) or 'swap'. Every turn is logged for the scoresheet.
  // reason 'clock': the whole-game clock ran out, so the game ends after this turn.
  function endTurn(state, placedCount, kind, reason) {
    const p = state.turn;
    if (!state.log) state.log = [];
    if (!state.turnPen) state.turnPen = [0, 0];
    const sc = placedCount > 0 && state.lastMove && state.lastMove.player === p ? state.lastMove.score : null;
    const pen = state.turnPen[p];
    const e = { p, n: state.turnNo, r: Math.ceil(state.turnNo / 2), kind: sc ? 'play' : (kind || 'pass'), ltr: 0, wd: 0, bon: 0, pen, tot: -pen };
    if (sc) {
      e.ltr = sc.raw; e.wd = sc.wordPts; e.bon = sc.x2 + sc.p5 + (sc.p2 || 0) + sc.fullPts; e.tot = sc.total - pen;
      e.words = sc.words.map(w => w.w);
      // full breakdown for the turn report (CD-7 add'l 3.3)
      e.det = { n: state.lastMove.cells.length, wv: sc.words.map(w => [w.w, w.v]), nx2: sc.nx2, x2: sc.x2, np5: sc.np5, p5: sc.p5, np2: sc.np2, p2: sc.p2, full: sc.fullPts };
    }
    e.items = (state.turnItems && state.turnItems[p]) || [];
    state.log.push(e);
    state.turnPen[p] = 0;
    if (state.turnItems) state.turnItems[p] = [];
    state.passes = placedCount > 0 ? 0 : state.passes + 1;
    refill(state, p);
    if (reason === 'clock') { finish(state, 'clock'); return true; }
    if (boardFull(state) || state.passes >= RULES.passLimit) { finish(state); return true; }
    state.turn = 1 - p;
    state.turnNo++;
    rollBonuses(state);
    return false;
  }

  function finish(state, reason) {
    const left = [0, 1].map(p => state.hands[p].reduce((a, t) => a + tileVal(state, t.ch), 0));
    state.scores[0] -= left[0];
    state.scores[1] -= left[1];
    state.over = true;
    const d = state.scores[0] - state.scores[1];
    const complete = boardFull(state);
    state.result = { leftover: left, winner: d > 0 ? 0 : d < 0 ? 1 : -1, complete, reason: complete ? 'full' : reason || 'passes' };
  }

  // A cell where one of the player's tiles fits
  function hint(state, player, exclude) {
    const opts = [];
    for (const t of state.hands[player]) {
      if (exclude && exclude.tiles.has(t.id)) continue;
      for (let i = 0; i < state.pz.N; i++) if (fits(state, i, t.ch) && !(exclude && exclude.cells.has(i))) opts.push({ cell: i, tileId: t.id });
    }
    if (!opts.length) return null;
    return opts[Math.floor(Math.random() * opts.length)];
  }

  // ---------- Computer opponent ----------
  // v07b (JM, CD-20: 4.1.1): ONLY the rival's skill is softened at Challenge Levels 4–7. Levels 1–3 and 8–10 play
  // as before, and puzzle difficulty (words, clues, starter letters) is unchanged at every level. The curve is
  // flatter from 1 to 7, then jumps at 8, so 8–10 stand apart as the "Master" levels.
  const AI_SKILL = { 4: 3.4, 5: 3.8, 6: 4.2, 7: 4.6 };
  function aiSkill(skill) { return AI_SKILL[skill] || skill; }
  function aiParams(level) {
    const skill = aiSkill(level);
    const k = (skill - 1) / 9;
    return {
      miss: 0.5 * Math.pow(1 - k, 1.4),     // chance to overlook a possible placement
      noise: 10 * (1 - k),                  // random misjudgment of a move's value
      riskW: 0.15 + 0.85 * k,               // how much it fears setting you up
      hold: skill >= 4,                     // will deliberately hold tiles back
      plan: skill >= 3,                     // sees words it can finish itself this turn
      lazy: 0.4 * (1 - k),                  // chance to stop placing early
      wrong: 0.15 * Math.pow(1 - k, 1.5)    // chance to try a wrong cell (penalty)
    };
  }

  function aiPlan(state, rng) {
    rng = rng || Math.random;
    const me = state.turn, opp = 1 - me, pz = state.pz;
    const P = aiParams(state.settings.skill);
    const M = modeOf(state);
    if (M.tiles === 'chain') P.lazy *= 0.3;  // Combo Chain: long turns pay, so stop early less often
    const board = state.board.slice();
    let hand = state.hands[me].slice();
    const plan = [];
    const bagEmpty = state.bag.length === 0;
    const unseen = {};
    let unseenTotal = 0;
    for (let i = 0; i < pz.N; i++) if (pz.cells[i].k === 'l' && !board[i]) { const s = pz.cells[i].s; unseen[s] = (unseen[s] || 0) + 1; unseenTotal++; }
    for (const t of hand) { unseen[t.ch]--; unseenTotal--; }
    const oppN = state.hands[opp].length;
    const pOpp = ch => {
      const n = Math.max(0, unseen[ch] || 0);
      if (!n || unseenTotal <= 0 || !oppN) return 0;
      return 1 - Math.pow(1 - Math.min(1, n / unseenTotal), oppN);
    };
    // 3 PASSES Rule: one more pass ends the game, so play on if that would lose (tiles in hand count against you)
    const handVal = pl => state.hands[pl].reduce((a, t) => a + tileVal(state, t.ch), 0);
    const behind = state.scores[me] - handVal(me) <= state.scores[opp] - handVal(opp);
    const mustPlay = state.passes >= RULES.passLimit - 1 && behind;

    if (hand.length && rng() < P.wrong) {
      const t = hand[Math.floor(rng() * hand.length)];
      const wrongCells = [];
      for (let i = 0; i < pz.N; i++) if (pz.cells[i].k === 'l' && !board[i] && pz.cells[i].s !== t.ch) wrongCells.push(i);
      if (wrongCells.length) plan.push({ wrong: true, cell: wrongCells[Math.floor(rng() * wrongCells.length)], tileId: t.id, ch: t.ch });
    }
    let placed = 0, runBase = 0;
    for (;;) {
      let best = null;
      const triedLetters = new Set();
      for (const t of hand) {
        if (triedLetters.has(t.ch)) continue;
        triedLetters.add(t.ch);
        const rest = hand.filter(x => x !== t);
        for (let ci = 0; ci < pz.N; ci++) {
          if (pz.cells[ci].k !== 'l' || board[ci] || pz.cells[ci].s !== t.ch) continue;
          if (rng() < P.miss) continue;
          // what this tile scores by itself in the current mode
          let base = M.tiles === 'chain' ? placed + 1 : letterPts(state, t.ch);
          let gain = (bagEmpty ? tileVal(state, t.ch) : 0);
          const b = bonusAt(state, ci); // fixed or floating bonus waiting here
          if (b === 'p5') gain += M.plus;
          if (b === 'p2') gain += RULES.plus2Cell;
          if (b === 'x2') gain += 4 + runBase; // a 2x doubles everything else this turn
          let risk = 0;
          for (const si of pz.cellSlots[ci]) {
            const s = pz.slots[si];
            const empties = s.cells.filter(cj => cj !== ci && !board[cj]);
            const wv = wordValue(state, si);
            if (!empties.length) base += wv;
            else if (empties.length === 1) {
              const x = pz.cells[empties[0]].s;
              if (P.plan && rest.some(r => r.ch === x)) gain += wv * 0.8;
              else risk += wv * pOpp(x);
            }
          }
          const v = base + gain - P.riskW * risk + (rng() - 0.5) * P.noise;
          if (!best || v > best.v) best = { t, ci, v, base };
        }
      }
      if (!best) break;
      if (P.hold && best.v < 0 && !(mustPlay && placed === 0)) break;
      if (placed > 0 && rng() < P.lazy) break;
      board[best.ci] = best.t.ch;
      hand = hand.filter(x => x !== best.t);
      plan.push({ cell: best.ci, tileId: best.t.id, ch: best.t.ch });
      placed++;
      runBase += best.base;
    }
    return plan;
  }

  global.Engine = { VAL, SIZES, RULES, MODES, lexicon, generate, newGame, scoreMove, commit, penalize, autoPlace, refill, swapHand, swapSome, endTurn, finish, hint, fits, aiPlan, aiParams, wordValue, boardFull,
    modeOf, showsValues, tileVal, letterPts, penaltyOf, timerOf, bonusAt, bonusUsed, rollBonuses
  };
})(typeof self !== 'undefined' ? self : this);
