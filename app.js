/* Clue Duel — user interface (v07f) */
'use strict';
(() => {
  const APP_VER = 'v07f'; // Project CP: shown as a pill beside the title and in the browser tab
  const E = window.Engine;
  const $ = (s, el = document) => el.querySelector(s);
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduceMotion = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Fictional opponents, one per skill level
  const OPP = [
    { n: 'Benny Bear', a: '🐻', b: 'Just here for the snacks. Places tiles wherever they fit.' },
    { n: 'Dotty Duckling', a: '🐥', b: 'Still learning. Misses plenty of chances.' },
    { n: 'Pip Penguin', a: '🐧', b: 'Waddles through the easy words first.' },
    { n: 'Rosie Rabbit', a: '🐰', b: 'Quick, and starting to hold tiles back. Easygoing: rivals at levels 4–7 play gentler than their puzzles.' },
    { n: 'Rusty Fox', a: '🦊', b: 'Sly. Hates leaving you an easy finish. Easygoing: rivals at levels 4–7 play gentler than their puzzles.' },
    { n: 'Kiko Koala', a: '🐨', b: 'Calm and steady. Rarely wastes a tile. Easygoing: rivals at levels 4–7 play gentler than their puzzles.' },
    { n: 'Luna Cat', a: '🐱', b: 'Waits patiently, then pounces on big words. Easygoing: rivals at levels 4–7 play gentler than their puzzles.' },
    { n: 'Otto Octopus', a: '🐙', b: 'Master level. Eight arms, almost no wasted moves.' },
    { n: 'Duchess Dragon', a: '🐉', b: 'Master level. Hoards letters like treasure.' },
    { n: 'Professor Hoot', a: '🦉', b: 'Master level. Knows every word. Misses nothing.' }
  ];
  // Avatars the player can pick (none of the opponents' animals)
  const AVATARS = ['🙂', '😎', '🤓', '🧐', '🤠', '🥳', '😇', '🤖', '👽', '👻', '🐶', '🐼', '🐯', '🦁', '🐸', '🐵', '🦄', '🐢', '🐬', '🦋',
    '🐞', '🐝', '🦖', '🐳', '🌻', '🌵', '🍀', '🍄', '🍎', '🍕', '🧁', '☕', '⚽', '🏀', '🎾', '🎲', '🎯', '🎸', '🎨', '📚',
    '🚀', '🛸', '⛵', '🚲', '🌈', '⭐', '🌙', '🔥', '💎', '👑', '🎩', '🧙'];

  const PASS_RULE = 'Three passes in a row (by either player) end the game, and every tile still in a hand is subtracted from its owner\'s score.';

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage full or blocked */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } }
  };
  const settings = Object.assign({ skill: 3, size: 'M', hand: 6, timer: '0', scoring: 'classic', bonus: 'floating', pics: 'some', name: '', avatar: '🙂' }, store.get('cd.settings', {}));
  if (typeof settings.timer === 'number') settings.timer = settings.timer > 0 ? 't' + settings.timer : '0'; // v01 settings
  let G = null; // engine state of the current game
  const ui = {
    pending: [], selTile: null, selSlot: -1, selCell: -1, busy: false, hintCell: -1, timerId: 0, cell: 40, token: 0,
    aiPending: null, flash: null, pop: -1, dragging: false, noClickUntil: 0, sheetOpen: false, layoutKey: '',
    left: 0, lastTick: 0, paused: false, chainBroken: false, sortK: -1
  };
  document.title = `Clue Duel · ${APP_VER}`;
  $('#verPill').textContent = APP_VER;

  const opp = () => OPP[(G ? G.settings.skill : settings.skill) - 1];
  const myName = () => (settings.name || '').trim() || 'You';
  const myTurn = () => G && !G.over && G.turn === 0 && !ui.busy && !ui.paused && !repsOn();
  const suppressClick = () => { ui.noClickUntil = Date.now() + 400; };
  const clickSuppressed = () => Date.now() < ui.noClickUntil;

  // =====================================================================
  // Home screen
  // =====================================================================
  function renderHome() {
    const o = OPP[settings.skill - 1];
    $('#skillSel').value = String(settings.skill);
    $('#oppFace').textContent = o.a;
    $('#oppName').textContent = o.n;
    const rec = store.get('cd.stats', {})[settings.skill];
    $('#oppRec').textContent = rec ? `Record: ${rec.w} won · ${rec.l} lost${rec.d ? ` · ${rec.d} drawn` : ''}` : 'Not played yet';
    $('.opp-card').title = o.b; // the character line now shows on hover only
    for (const b of $('#sizeSeg').children) b.classList.toggle('on', b.dataset.v === settings.size);
    $('#handSel').value = String(settings.hand);
    $('#bonusSel').value = settings.bonus;
    $('#picsSel').value = settings.pics;
    $('#timerSel').value = String(settings.timer);
    if ($('#timerSel').selectedIndex < 0) $('#timerSel').value = '0';
    $('#scoringSel').value = settings.scoring;
    $('#scoringDesc').textContent = (E.MODES[settings.scoring] || E.MODES.classic).desc;
    $('#myAv').textContent = settings.avatar;
    if (document.activeElement !== $('#myName')) $('#myName').value = settings.name || '';
    const saved = store.get('cd.save', null);
    $('#resumeBtn').hidden = !(saved && !saved.over);
  }
  function saveSettings() { store.set('cd.settings', settings); renderHome(); }

  $('#skillSel').addEventListener('change', e => { settings.skill = +e.target.value; saveSettings(); });
  $('#sizeSeg').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { settings.size = b.dataset.v; saveSettings(); } });
  $('#handSel').addEventListener('change', e => { settings.hand = +e.target.value; saveSettings(); });
  $('#bonusSel').addEventListener('change', e => { settings.bonus = e.target.value; saveSettings(); });
  $('#picsSel').addEventListener('change', e => { settings.pics = e.target.value; saveSettings(); });
  $('#timerSel').addEventListener('change', e => { settings.timer = e.target.value; saveSettings(); });
  $('#scoringSel').addEventListener('change', e => { settings.scoring = e.target.value; saveSettings(); });
  $('#myName').addEventListener('input', e => { settings.name = e.target.value.slice(0, 14); store.set('cd.settings', settings); });
  $('#myName').addEventListener('keydown', e => { if (e.key === 'Enter') e.target.blur(); });
  $('#myAv').addEventListener('click', pickAvatar);
  $('#howBtn').addEventListener('click', showHelp);
  $('#startBtn').addEventListener('click', startNewGame);
  $('#resumeBtn').addEventListener('click', resumeGame);

  function pickAvatar() {
    openModal(`<h2>Choose your avatar</h2>
      <div class="av-grid">${AVATARS.map(a => `<button type="button" data-av="${a}" class="${a === settings.avatar ? 'on' : ''}">${a}</button>`).join('')}</div>
      <div class="row"><button class="btn" data-a="close">Cancel</button></div>`);
    $('#sheet').onclick = e => {
      const b = e.target.closest('[data-av],[data-a]');
      if (!b) return;
      $('#sheet').onclick = null;
      if (b.dataset.av) { settings.avatar = b.dataset.av; saveSettings(); }
      closeModal();
    };
  }

  function showScreen(id) {
    $('#home').hidden = id !== 'home';
    $('#game').hidden = id !== 'game';
    $('#vault').hidden = id !== 'vault'; // v07c: Word Vault
    if (id === 'home') { const vs = store.get('cd.vault.settings', {}); $('#vaultBtnName').textContent = (vs.name || '').trim() || 'Word Vault'; const ico = $('#vaultBtnIco'); if (vs.icon === 'custom' && vs.custom) ico.innerHTML = `<img src="${vs.custom}" alt="">`; else ico.textContent = vs.icon || '🔐'; }
  }

  async function startNewGame() {
    const saved = store.get('cd.save', null);
    if (saved && !saved.over) {
      const ok = await confirmBox('Start a new game?', 'Your unfinished game will be lost.', 'Start new', 'Cancel');
      if (!ok) return;
    }
    openModal('<div class="loading">Building your puzzle…</div>');
    await sleep(30); // let the message paint
    const g = E.newGame({ skill: settings.skill, size: settings.size, hand: settings.hand, timer: settings.timer, scoring: settings.scoring, bonus: settings.bonus, pics: settings.pics });
    closeModal();
    if (!g) { toast('Could not build a puzzle. Please try again.', 'bad'); return; }
    G = g;
    store.set('cd.save', G);
    enterGame(true);
  }

  function resumeGame() {
    const saved = store.get('cd.save', null);
    if (!saved || saved.over) { renderHome(); return; }
    G = saved;
    // games saved by older versions
    if (!G.log) G.log = [];
    if (!G.turnPen) G.turnPen = [0, 0];
    if (!G.settings.scoring) G.settings.scoring = 'classic';
    if (!G.settings.bonus) G.settings.bonus = 'fixed';
    if (typeof G.settings.timer === 'number') G.settings.timer = G.settings.timer > 0 ? 't' + G.settings.timer : '0';
    if (!G.fb) G.fb = {};
    if (!G.ub) G.ub = {};
    if (!G.turnItems) G.turnItems = [[], []];
    enterGame(false);
  }

  // ---------- Picture safety check (v04, JM CD-9: 10.2) ----------
  // Older phones may lack some newer pictures and would show an empty box. Each picture is drawn once, off screen;
  // if the device draws nothing (or the "missing" box), that clue shows its word instead.
  const picOKCache = new Map();
  let picCtx = null, tofuSig = null;
  function glyphSig(s) {
    picCtx.clearRect(0, 0, 48, 48);
    picCtx.fillText(s, 4, 38);
    const d = picCtx.getImageData(0, 0, 48, 48).data;
    let h = 0, ink = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i + 3]) { ink++; h = (h * 31 + d[i] * 7 + d[i + 1] * 3 + d[i + 2] + i) | 0; }
    return ink ? h : 0;
  }
  function picOK(pic) {
    if (picOKCache.has(pic)) return picOKCache.get(pic);
    let ok = true;
    try {
      if (!picCtx) {
        const cv = document.createElement('canvas'); cv.width = cv.height = 48;
        picCtx = cv.getContext('2d', { willReadFrequently: true });
        picCtx.font = '34px ' + (getComputedStyle(document.documentElement).getPropertyValue('--emoji') || 'sans-serif');
        tofuSig = glyphSig('\u{10FFFD}');
      }
      const parts = window.Intl && Intl.Segmenter ? [...new Intl.Segmenter().segment(pic)].map(x => x.segment) : [pic];
      for (const g of parts) {
        if (/^[\x00-\x7F−\s]+$/.test(g)) continue; // letters, spaces, + − =
        const sig = glyphSig(g);
        if (!sig || sig === tofuSig) { ok = false; break; }
      }
    } catch (e) { ok = true; }
    picOKCache.set(pic, ok);
    return ok;
  }
  function checkPics() {
    if (!G) return;
    for (const s of G.pz.slots) if (s.clue && s.clue.pic && !picOK(s.clue.pic)) s.clue = { t: s.clue.t, hard: false };
  }

  function enterGame(fresh) {
    ui.token++;
    checkPics();
    Object.assign(ui, { pending: [], selTile: null, selSlot: -1, selCell: -1, busy: false, hintCell: -1, aiPending: null, flash: null, pop: -1, layoutKey: '', chainBroken: false });
    setPaused(false);
    showScreen('game');
    clearReports();
    $('#oppNm').textContent = opp().n;
    $('#oppAv').textContent = opp().a;
    $('#myNm').textContent = myName();
    $('#myAvTop').textContent = settings.avatar;
    setSheetOpen(false);
    setMore(false);
    render();
    fitDock();
    layout();
    renderBoard();
    if (G.turn === 1) {
      if (fresh) toast(`${opp().n} goes first`, 'opp');
      runAiTurn();
    } else {
      if (fresh) toast('You go first', 'you');
      startHumanTurn();
    }
  }

  function leaveGame() {
    ui.token++;
    stopTimer();
    closeZoom(true); cancelDrag();
    setPaused(false);
    if (G && !G.over) save();
    ui.busy = false;
    clearReports(); setTimerFlash(0);
    showScreen('home');
    renderHome();
  }

  // =====================================================================
  // Layout: the grid always fits its area (re-measured whenever anything around it changes size)
  // =====================================================================
  function layout() {
    if (!G) return false;
    const wrap = $('#boardwrap');
    const cs = getComputedStyle(wrap);
    const w = wrap.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const h = wrap.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    const R = G.pz.R, C = G.pz.C, frame = 4; // 2px border on each side + 1px lines between cells
    // v04: the cap is 120 px (was 76), so the grid fills big monitors too (JM, CD-8: 2.1.1)
    const cell = Math.max(18, Math.floor(Math.min((w - frame - (C - 1)) / C, (h - frame - (R - 1)) / R, 120)));
    const key = `${cell}:${C}`;
    if (key === ui.layoutKey) return false;
    ui.layoutKey = key;
    ui.cell = cell;
    document.documentElement.style.setProperty('--cell', cell + 'px');
    $('#board').style.gridTemplateColumns = `repeat(${C}, ${cell}px)`;
    return true;
  }
  const relayout = () => { if (G && !$('#game').hidden && layout()) { closeZoom(true); renderBoard(); } };
  if (window.ResizeObserver) new ResizeObserver(relayout).observe($('#boardwrap'));
  let resizeT = 0;
  window.addEventListener('resize', () => { clearTimeout(resizeT); closeZoom(true); resizeT = setTimeout(() => { fitDock(); relayout(); renderReports(); }, 80); });

  // ---------- Bottom row (JM, CD-8: 2.1.1.1; CD-9: 2.1) ----------
  // Hand and buttons always share one row. If that would squeeze the tiles below 40 px (phones), the row becomes
  // tiles + Done + ⋯ More, and the other buttons open from More; your clock then shows under your score.
  function fitDock() {
    if (!G || $('#game').hidden) return;
    const dock = $('#dock');
    dock.classList.remove('compact');
    const n = G.settings.hand, cs = getComputedStyle(dock);
    // (40 px spare: "Pass" grows to "Done +13" during a turn)
    const avail = dock.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - $('#actions').offsetWidth - 40;
    const compact = (avail - 6 * (n - 1)) / n < 40;
    dock.classList.toggle('compact', compact);
    $('#game').classList.toggle('compact', compact);
    if (!compact) setMore(false);
    $('#clkTop').hidden = !compact || E.timerOf(G.settings.timer).kind === 'none';
    // v06c (JM, CD-18: 1.1): when tiles are narrow (under 48 px, on any device) and they show point values,
    // tiles grow taller and the value sits centered under the letter instead of crowding its corner
    const rack = $('#rack');
    const tw = (rack.clientWidth - 6 * (n - 1)) / n;
    const tall = tw < 48 && E.showsValues(G);
    rack.classList.toggle('tall', tall);
    rack.style.setProperty('--tw', Math.max(20, tw).toFixed(1) + 'px');
  }
  function setMore(open) {
    $('#dock').classList.toggle('more-open', !!open);
    $('#moreBtn').setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  $('#moreBtn').addEventListener('click', () => setMore(!$('#dock').classList.contains('more-open')));
  // a button in the pop-up closes it after doing its job; so does a tap anywhere else
  $('#morePop').addEventListener('click', e => { if (e.target.closest('button')) setTimeout(() => setMore(false), 0); });
  document.addEventListener('pointerdown', e => { if ($('#dock').classList.contains('more-open') && !e.target.closest('#morePop, #moreBtn')) setMore(false); });

  // v06c (JM, CD-18: 4.2): clue text is MEASURED, not guessed. The size starts from the usual look and shrinks
  // until every word fits on a line (no mid-word breaks) and all lines fit the cell's height (nothing cut off).
  const fitCache = new Map();
  let fitCtx = null;
  const CLUE_FONT = '"Arial Narrow", "Roboto Condensed", "Helvetica Neue", Arial, sans-serif';
  function clueFont(text, split, d) {
    const cell = ui.cell;
    const key = `${cell}|${split ? 1 : 0}|${d}|${text}`;
    if (fitCache.has(key)) return fitCache.get(key);
    const n = text.length;
    let f = cell * (split ? 0.165 : 0.2);
    if (n > 9) f *= 0.9;
    if (n > 14) f *= 0.88;
    if (n > 20) f *= 0.86;
    // the text box inside the clue: cell padding (2 px each side, 1 px top and bottom) and the arrow's strip
    const W = (cell - 4 - (d === 'A' ? cell * 0.18 : 0)) * 0.95;
    const H = ((split ? (cell - 1) / 2 : cell) - 2 - (d === 'D' ? cell * 0.17 : 0)) * 0.97;
    if (!fitCtx) fitCtx = document.createElement('canvas').getContext('2d');
    const words = text.toUpperCase().split(/\s+/).filter(Boolean);
    const fits = size => {
      fitCtx.font = `700 ${size}px ${CLUE_FONT}`;
      const sp = size * -0.01; // letter-spacing -.01em
      const wd = w => fitCtx.measureText(w).width + sp * w.length;
      const space = wd(' ');
      let lines = 1, lineW = 0;
      for (const w of words) {
        const ww = wd(w);
        if (ww > W) return false;              // a word wider than the box would break mid-word
        if (lineW && lineW + space + ww > W) { lines++; lineW = ww; } else lineW += (lineW ? space : 0) + ww;
      }
      return lines * size * 1.02 <= H;         // line-height 1.02
    };
    // 5.5 px is the floor (about 11 screen pixels on a phone): at 54 px cells only ~1% of clues would need less
    while (f > 5.5 && !fits(f)) f *= 0.94;
    const out = Math.max(5.5, f).toFixed(1);
    if (fitCache.size > 4000) fitCache.clear();
    fitCache.set(key, out);
    return out;
  }

  // CLUE PICS v02: labels for the harder picture types (shown in the clue bar and the zoom)
  const PIC_TAG = { cat: 'group word', assoc: 'goes with', rebus: 'add them up', sound: 'sounds like', math: 'letter math' };
  // Type labels help only at Challenge Levels 1–5; from level 6 the tricky pictures stay tricky (JM, CD-7: 5.1.1)
  const picTag = s => (s.clue.pic && G && G.settings.skill < 6 && PIC_TAG[s.clue.pt]) || '';
  // How wide a picture clue is, in "emoji widths" (letters and + − signs count less)
  function picUnits(pic) {
    const parts = window.Intl && Intl.Segmenter ? [...new Intl.Segmenter().segment(pic)].map(x => x.segment) : Array.from(pic.replace(/️/g, ''));
    let u = 0;
    for (const s of parts) u += /^\s$/.test(s) ? 0.15 : /^[A-Za-z+−-]$/.test(s) ? 0.55 : 1;
    return Math.max(1, u);
  }
  // In-cell picture size: as big as fits (CD-3: 4.1), smaller for multi-part pictures
  function picFont(pic, split) {
    const max = ui.cell * (split ? 0.37 : 0.74);
    const u = picUnits(pic);
    return Math.max(7, u <= 1 ? max : Math.min(max, (ui.cell * 0.88) / u)).toFixed(1);
  }

  function slotDone(s) { return s.cells.every(ci => G.board[ci]); }

  // The second clue shown in the clue bar: the crossing word of the chosen cell,
  // or the other clue in the same CLUE CELL.
  function altSlot() {
    if (ui.selSlot < 0) return -1;
    if (ui.selCell >= 0) {
      const o = G.pz.cellSlots[ui.selCell].find(x => x !== ui.selSlot);
      return o == null ? -1 : o;
    }
    const s = G.pz.slots[ui.selSlot];
    const c = G.pz.cells[s.clueCell];
    if (c && c.k === 'c') { const o = s.d === 'A' ? c.D : c.A; return o >= 0 ? o : -1; }
    return -1;
  }

  // =====================================================================
  // Rendering
  // =====================================================================
  function clueCellHTML(i, c) {
    const parts = [];
    if (c.A >= 0) parts.push(['A', c.A]);
    if (c.D >= 0) parts.push(['D', c.D]);
    // The top-left corner can't clue anything (as in the reference game): it carries the game's logo instead
    if (!parts.length && i === 0) { const src = ($('.brand .logo') || {}).src || ''; return `<div class="cell clue corner" data-i="${i}">${src ? `<img src="${src}" alt="">` : ''}</div>`; }
    if (!parts.length) return `<div class="cell clue empty" data-i="${i}"></div>`;
    const split = parts.length === 2;
    const inner = parts.map(([d, si]) => {
      const s = G.pz.slots[si];
      const body = s.clue.pic
        ? `<span class="pic" style="font-size:${picFont(s.clue.pic, split)}px">${s.clue.pic}</span>`
        : `<span class="ct" style="font-size:${clueFont(s.clue.t, split, d)}px">${esc(s.clue.t)}</span>`;
      const cls = ['cl', 'cl-' + d];
      if (slotDone(s)) cls.push('solved');
      if (ui.selSlot === si) cls.push('on');
      return `<div class="${cls.join(' ')}" data-s="${si}">${body}</div>`;
    }).join('');
    return `<div class="cell clue${split ? ' split' : ''}" data-i="${i}">${inner}</div>`;
  }

  function renderBoard() {
    const pz = G.pz;
    const pend = new Map(ui.pending.map(p => [p.cell, p]));
    const hl = new Set(ui.selSlot >= 0 ? pz.slots[ui.selSlot].cells : []);
    const last = new Set(G.lastMove ? G.lastMove.cells : []);
    let html = '';
    const vals = E.showsValues(G);
    const plusTxt = '+' + E.RULES.plusCell;
    const bTxt = b => (b === 'x2' ? '2×' : b === 'p2' ? '+' + E.RULES.plus2Cell : plusTxt); // v07a: +2 cells
    for (let i = 0; i < pz.N; i++) {
      const c = pz.cells[i];
      if (c.k === 'c') { html += clueCellHTML(i, c); continue; }
      const cls = ['cell', 'let'];
      let inner = '';
      const ch = G.board[i];
      // the bonus on this cell: waiting (fixed or floating), or already used
      const b = ch ? E.bonusUsed(G, i) : E.bonusAt(G, i);
      const fl = !ch && G.fb && G.fb[i];
      if (ch) {
        cls.push('filled', G.owner[i] === 0 ? 'mine' : G.owner[i] === 1 ? 'theirs' : 'pre');
        if (last.has(i)) cls.push('last');
        inner = `<span class="ch">${ch}</span>`;
      } else if (pend.has(i)) {
        const p = pend.get(i);
        cls.push('pending');
        inner = `<span class="ch">${p.ch}</span>${vals ? `<span class="pv">${E.tileVal(G, p.ch)}</span>` : ''}`;
      } else if (ui.aiPending && ui.aiPending.has(i)) {
        cls.push('aipend');
        inner = `<span class="ch">${ui.aiPending.get(i)}</span>`;
      } else if (ui.flash && ui.flash.cell === i) {
        cls.push('wrongflash', 'shake');
        inner = `<span class="ch">${ui.flash.ch}</span>`;
      } else if (G.over) {
        cls.push('reveal');
        inner = `<span class="ch">${c.s}</span>`;
      } else if (b) {
        cls.push('b-' + b);
        inner = `<span class="bn">${bTxt(b)}</span>`;
      }
      if (b) { // bonus cells pulse before and after a tile lands
        cls.push('bz-' + b);
        if (fl && fl.n < G.turnNo) cls.push('fl-old');
        if (inner && !inner.includes('class="bn"')) inner += `<span class="bdg">${bTxt(b)}</span>`;
        inner += '<i class="glow"></i>';
      }
      if (hl.has(i)) cls.push('hl');
      if (i === ui.hintCell) cls.push('hint');
      if (i === ui.pop) cls.push('popin');
      html += `<div class="${cls.join(' ')}" data-i="${i}">${inner}</div>`;
    }
    $('#board').innerHTML = html;
    ui.pop = -1;
  }

  function renderRack() {
    const rack = $('#rack');
    const hand = G.hands[0];
    const used = new Set(ui.pending.map(p => p.tileId));
    const n = G.settings.hand;
    rack.style.setProperty('--n', n); $('#dock').style.setProperty('--n', n);
    let html = '';
    for (const t of hand) {
      if (used.has(t.id)) { html += '<div class="tile gap"></div>'; continue; }
      html += `<div class="tile${ui.selTile === t.id ? ' sel' : ''}" data-id="${t.id}">${tileInner(t.ch)}</div>`;
    }
    for (let k = hand.length; k < n; k++) html += '<div class="tile gap"></div>';
    rack.innerHTML = html;
    rack.classList.toggle('off', !myTurn());
  }

  // A tile's face: letter, plus its value in modes where tiles have values
  function tileInner(ch) {
    return `<span class="ch">${ch}</span>${E.showsValues(G) ? `<span class="pv">${E.tileVal(G, ch)}</span>` : ''}`;
  }

  function renderTop() {
    $('#scYou').textContent = G.scores[0];
    $('#scOpp').textContent = G.scores[1];
    $('#myNm').textContent = myName();
    $('#plYou').classList.toggle('active', !G.over && G.turn === 0);
    $('#plOpp').classList.toggle('active', !G.over && G.turn === 1);
    renderInfo();
    renderClock();
  }

  // Round · Bag · mode (JM, CD-5: 1.2)
  function timerLabel() {
    const t = E.timerOf(G.settings.timer);
    if (t.kind === 'turn') return t.secs === 30 ? 'Blitz 30 s' : `${t.secs / 60} min per turn`;
    if (t.kind === 'game') return `${t.secs / 60} min game`;
    return 'Untimed';
  }
  function renderInfo() {
    const r = Math.ceil(G.turnNo / 2), M = E.modeOf(G);
    const bonusName = { fixed: 'Fixed bonuses', floating: 'Floating bonuses', both: 'Fixed + floating bonuses', off: 'No bonuses' }[G.settings.bonus] || '';
    $('#infoBar').textContent = `Round ${r} · Bag ${G.bag.length} · ${M.name}`;
    $('#infoSide').innerHTML = `<b>Round ${r}</b> · Bag ${G.bag.length}<br>${esc(M.name)} · ${esc(bonusName)}<br>${esc(timerLabel())}`;
  }

  // The clock shown on the Pause button
  function fmtClock(ms) { const s = Math.ceil(Math.max(0, ms) / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; }
  function renderClock() {
    const btn = $('#pauseBtn'), t = $('#timerTxt');
    const tm = E.timerOf(G.settings.timer);
    let txt, low = false;
    if (ui.paused) txt = 'Resume';
    else if (G.over) txt = 'Done';
    else if (tm.kind === 'game') { txt = fmtClock(G.clock); low = G.turn === 0 && G.clock <= 15000; }
    else if (tm.kind === 'turn') { txt = G.turn === 0 && !ui.busy ? fmtClock(ui.left) : '–'; low = G.turn === 0 && ui.left <= 10000; }
    else txt = 'Pause';
    t.textContent = txt;
    if (tm.kind !== 'none') { const ck = $('#clkTop'); ck.textContent = '⏱ ' + txt; ck.classList.toggle('low', low && !ui.paused); }
    btn.classList.toggle('low', low && !ui.paused);
    btn.classList.toggle('on', ui.paused);
    $('#pauseIco').textContent = ui.paused ? '▶️' : '⏸️';
    btn.disabled = !G || G.over;
    let fs = 0;
    if (!ui.paused && !G.over && G.turn === 0 && !ui.busy && !repsOn() && tm.kind !== 'none') {
      const ms = tm.kind === 'game' ? G.clock : ui.left;
      if (ms > 0 && ms <= 10000) fs = Math.ceil(ms / 1000);
    }
    setTimerFlash(fs);
  }
  // Last 10 seconds of a timed turn or game: the grid's border flashes once a second,
  // bright yellow for 10–6 and bright red for 5–1 (JM, CD-7 add'l 4)
  let flashSec = 0;
  function setTimerFlash(s) {
    if (s === flashSec) return;
    flashSec = s;
    const b = $('#board');
    b.classList.remove('tf-y', 'tf-r', 'tf-a', 'tf-b');
    if (s >= 1 && s <= 10) b.classList.add(s > 5 ? 'tf-y' : 'tf-r', s % 2 ? 'tf-a' : 'tf-b');
  }

  // Points of the solved letters in the current mode (JM, CD-3: 4.3)
  function solvedPts(s, letters) {
    const M = E.modeOf(G);
    if (M.word === 'sq') return { v: s.cells.length * s.cells.length, t: 'pts when finished' };
    if (M.tiles === 'chain') return null;
    const v = letters.reduce((a, ch) => a + E.letterPts(G, ch), 0);
    return { v, t: v === 1 ? 'pt' : 'pts' };
  }

  // One clue line: arrow · CLUE WORD or CLUE PIC · [ SOLVED STATUS ] · solved / total · points of solved letters
  function clueLine(si, primary) {
    const s = G.pz.slots[si];
    const pend = new Map(ui.pending.map(p => [p.cell, p.ch]));
    const got = [];
    const letters = s.cells.map(ci => {
      const ch = G.board[ci] || pend.get(ci) || '';
      if (ch) { got.push(ch); return `<i>${ch}</i>`; }
      if (G.over) return `<i class="rv">${G.pz.cells[ci].s.toLowerCase()}</i>`;
      return '<i class="bl">_</i>';
    }).join('');
    const sp = solvedPts(s, got);
    const tag = picTag(s) ? `<span class="cb-tag">${picTag(s)}</span>` : '';
    const clue = s.clue.pic ? `<span class="cb-pic">${s.clue.pic}</span>${tag}` : `<span class="cb-word">${esc(s.clue.t)}</span>`;
    return `<div class="cb-line${primary ? ' on' : ''}" data-s="${si}"><span class="cb-dir">${s.d === 'A' ? '→' : '↓'}</span>${clue}`
      + `<span class="cb-stat"><span class="cb-pat">[${letters}]</span><span class="cb-n">${got.length} / ${s.cells.length}</span>${sp ? `<span class="cb-pts">${sp.v} ${sp.t}</span>` : ''}</span></div>`;
  }

  function renderClueBar() {
    const bar = $('#cluebar');
    if (ui.selSlot >= 0) {
      const alt = altSlot();
      const both = [ui.selSlot, alt].filter(x => x >= 0);
      both.sort((a, b) => (G.pz.slots[a].d === 'A' ? 0 : 1) - (G.pz.slots[b].d === 'A' ? 0 : 1)); // across line first
      bar.innerHTML = both.map(si => clueLine(si, si === ui.selSlot)).join('');
      return;
    }
    let msg;
    if (G.over) msg = 'Game over. Tap any clue to review the words.';
    else if (G.turn === 1) msg = `${opp().n} is thinking…`;
    else if (repsOn()) msg = 'Click or tap anywhere to start your turn. Your clock waits.';
    else if (ui.pending.length) msg = 'Tap DONE to bank your points. Drag a placed tile to move it, or tap it to take it back.';
    else if (!G.hands[0].length) msg = 'No tiles left. Tap Pass.';
    else msg = 'Your turn. Drag a tile onto the grid, or tap a tile then a cell. Tap a clue to read it; point at (or press and hold) a clue to zoom.';
    bar.innerHTML = `<div class="cb-status">${esc(msg)}</div>`;
  }

  function renderActions() {
    const mine = myTurn();
    $('#hintTxt').textContent = `Hint (−${E.penaltyOf(G, 'hint')})`;
    $('#hintBtn').disabled = !mine || !G.hands[0].length;
    $('#placeBtn').disabled = !mine || G.hands[0].length <= ui.pending.length;
    // +30s only exists in timed games (JM, CD-7 add'l 1.2)
    $('#timeBtn').hidden = E.timerOf(G.settings.timer).kind === 'none';
    $('#timeBtn').disabled = !mine;
    $('#swapBtn').disabled = !mine || !G.bag.length || !!ui.pending.length || !G.hands[0].length;
    $('#mixBtn').disabled = !G || G.over || G.hands[0].length < 2;
    $('#doneBtn').disabled = !mine;
    if (ui.pending.length) {
      const sc = E.scoreMove(G, ui.pending);
      $('#doneTxt').textContent = `Done +${sc.total}`;
      $('#doneBtn').title = '';
    } else {
      $('#doneTxt').textContent = 'Pass';
      $('#doneBtn').title = 'Pass. ' + PASS_RULE;
    }
    $('#swapBtn').title = 'Swap some or all of your tiles. Ends your turn and counts as a pass.';
  }

  // ---------- 3 PASSES Rule warning ----------
  function renderPassWarn() {
    const n = G && !G.over ? (G.passes || 0) : 0;
    let html = '';
    if (n === 1) html = `<span class="pw-h">PASS 1 of 3</span>${PASS_RULE}`;
    else if (n >= 2) html = `<span class="pw-h">PASS 2 of 3 · LAST CHANCE</span>The next turn must place a tile, or the game ends. ${PASS_RULE}`;
    for (const id of ['#passWarnBar', '#passWarnSide']) {
      const el = $(id);
      el.hidden = !n;
      el.classList.toggle('yellow', n === 1);
      el.classList.toggle('red', n >= 2);
      el.innerHTML = html;
    }
  }

  // ---------- Running Scoreboard (renamed from Scoresheet, CD-7 add'l 3.2.1) ----------
  function roundWinners() {
    const by = new Map();
    for (const e of G.log || []) { const r = by.get(e.r) || []; r[e.p] = e.tot; by.set(e.r, r); }
    const win = new Map();
    for (const [r, t] of by) if (t[0] != null && t[1] != null && t[0] !== t[1]) win.set(r, t[0] > t[1] ? 0 : 1);
    return win;
  }
  const signed = v => (v > 0 ? '+' + v : v < 0 ? '−' + Math.abs(v) : '0');
  function sheetHTML(p) {
    const win = roundWinners();
    const name = p === 0 ? myName() : opp().n, av = p === 0 ? settings.avatar : opp().a;
    const rows = (G.log || []).filter(e => e.p === p);
    let h = `<div class="ss-head"><span class="av">${av}</span><span class="nm">${esc(name)}</span><span class="tt">${G.scores[p]}</span></div>`;
    h += '<table class="ss"><thead><tr><th title="Round">Rd</th><th title="Letter points">Ltr</th><th title="Word points">Wd</th><th title="Bonuses: 2×, +5, +2, Full Hand">Bon</th><th title="Penalties: Wrong Cells, Hints, Place, +30s">Pen</th><th title="Turn subtotal">Turn</th></tr></thead><tbody>';
    for (const e of rows) {
      const cls = win.get(e.r) === p ? ' class="win"' : '';
      const pen = e.pen ? '−' + e.pen : '';
      if (e.kind !== 'play') h += `<tr${cls}><td>${e.r}</td><td colspan="3" class="k">${e.kind === 'swap' ? 'swap' : 'pass'}</td><td>${pen}</td><td class="t">${signed(e.tot)}</td></tr>`;
      else h += `<tr${cls}><td>${e.r}</td><td>${e.ltr}</td><td>${e.wd || ''}</td><td>${e.bon ? '+' + e.bon : ''}</td><td>${pen}</td><td class="t">${signed(e.tot)}</td></tr>`;
    }
    if (G.over && G.result) h += `<tr class="end"><td colspan="5">Tiles left in hand</td><td class="t">−${G.result.leftover[p]}</td></tr>`;
    h += '</tbody></table>';
    if (!rows.length) h += '<div class="ss-empty">No turns yet</div>';
    return h;
  }
  function renderSheets() {
    const a = sheetHTML(0), b = sheetHTML(1);
    for (const [id, html] of [['#sheetYou', a], ['#sheetOpp', b]]) { const el = $(id); el.innerHTML = html; el.scrollTop = el.scrollHeight; }
    if (ui.sheetOpen) { const pn = $('#sheetPanel'); pn.innerHTML = `<div class="sheetbox">${a}</div><div class="sheetbox">${b}</div>`; }
  }
  function setSheetOpen(open) {
    ui.sheetOpen = open;
    $('#sheetPanel').hidden = !open;
    $('#sheetCec').textContent = open ? '▾' : '▸';
    $('#sheetToggle').setAttribute('aria-expanded', String(open));
    if (open && G) renderSheets();
  }
  $('#sheetToggle').addEventListener('click', () => setSheetOpen(!ui.sheetOpen));

  function render() {
    if (!G) return;
    // Everything around the grid first, then measure the space that is left, then draw the grid
    renderTop();
    renderRack();
    renderClueBar();
    renderActions();
    renderPassWarn();
    renderSheets();
    if (!$('#game').hidden) layout();
    renderBoard();
  }

  // =====================================================================
  // Toasts & modal
  // =====================================================================
  function toast(msg, kind = '', ms = 2200) {
    const box = $('#toasts');
    const el = document.createElement('div');
    el.className = 'toast ' + kind;
    el.textContent = msg;
    box.appendChild(el);
    while (box.children.length > 3) box.firstChild.remove();
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 320); }, ms);
  }
  // ---------- Turn reports (JM, CD-7 add'l 3) ----------
  // Each player's report sits at the bottom of their Scoreboard column (on phones: over the bottom of the grid),
  // and stays until you click or tap (v04, JM CD-8: 3.1.2). While a report is on screen the game waits: your clock
  // stops the moment the opponent finishes, and nothing can be played until you tap (CD-9: 3.1a, 3.1.1).
  // Row 1 is the turn TOTAL; then one row per word, bonus and penalty. The Scoreboard stays as the lasting record.
  const reps = { html: [null, null], key: [0, 0], swallowUntil: 0 };
  const repsOn = () => !!(reps.html[0] || reps.html[1]);
  const lastLog = () => G.log[G.log.length - 1];
  function reportHTML(e) {
    const M = E.modeOf(G);
    const rows = [];
    const add = (label, v) => rows.push(`<div class="tr-row"><span class="l">${label}</span><span class="v${v < 0 ? ' neg' : ''}">${v < 0 ? '−' + Math.abs(v) : '+' + v}</span></div>`);
    const xn = n => (n > 1 ? ' ×' + n : '');
    if (e.kind === 'play') {
      const d = e.det;
      if (d) {
        if (e.ltr) add(M.tiles === 'chain' ? `${d.n}-tile chain` : `${d.n} tile${d.n > 1 ? 's' : ''}`, e.ltr);
        for (const [w, v] of d.wv) if (v) add(esc(w), v);
        if (d.nx2) add('2× bonus' + xn(d.nx2), d.x2);
        if (d.np5) add('+5 bonus' + xn(d.np5), d.p5);
        if (d.np2) add('+2 bonus' + xn(d.np2), d.p2);
        if (d.full) add('Full Hand', d.full);
      } else { // turns saved by v02
        if (e.ltr) add('Letters', e.ltr);
        if (e.wd) add('Words', e.wd);
        if (e.bon) add('Bonuses', e.bon);
      }
    } else rows.push(`<div class="tr-row"><span class="l">${e.kind === 'swap' ? 'Swapped' : 'Passed'}</span><span class="v">0</span></div>`);
    const items = e.items || [];
    const grp = (k, label) => {
      const xs = items.filter(x => x.k === k);
      if (xs.length) add(label(xs), -xs.reduce((a, x) => a + x.v, 0));
    };
    // v06: a Wrong Cell's cost depends on the tile, so the row names the letters (older saves have none)
    grp('wrong', xs => (xs.length > 1 ? 'Wrong Cells' : 'Wrong Cell') + (xs.some(x => x.ch) ? ' ' + xs.map(x => x.ch).filter(Boolean).join(', ') : ''));
    grp('hint', xs => 'Hint' + xn(xs.length));
    grp('place', xs => 'Place ' + xs.map(x => x.ch).join(', '));
    grp('time', xs => '+30s' + xn(xs.length));
    if (!items.length && e.pen) add('Penalties', -e.pen);
    const name = e.p === 0 ? myName() : opp().n, av = e.p === 0 ? settings.avatar : opp().a;
    return `<div class="tr-head"><span class="av">${av}</span><span class="nm">${esc(name)}</span><span class="rd">Round ${e.r}</span></div>`
      + `<div class="tr-row tot"><span class="l">TOTAL</span><span class="v">${signed(e.tot)}</span></div>${rows.join('')}`
      + (e.p === 1 && !G.over ? '<div class="tr-tap">Click or tap anywhere to play</div>' : '');
  }
  function showReport(e) {
    if (!e) return;
    reps.html[e.p] = reportHTML(e);
    reps.key[e.p]++;
    renderReports();
  }
  function renderReports() {
    const wide = getComputedStyle($('#sideYou')).display !== 'none';
    [['#repYou', '#repYouN'], ['#repOpp', '#repOppN']].forEach(([w, n], p) => {
      const h = reps.html[p];
      const on = wide ? $(w) : $(n), off = wide ? $(n) : $(w);
      off.hidden = true;
      on.hidden = !h;
      if (h && on.dataset.k !== String(reps.key[p])) { on.innerHTML = h; on.dataset.k = String(reps.key[p]); }
    });
    $('#repOv').hidden = wide || !(reps.html[0] || reps.html[1]);
    if (wide) for (const id of ['#sheetYou', '#sheetOpp']) { const s = $(id); s.scrollTop = s.scrollHeight; } // keep the latest rows in view
  }
  function clearReports() {
    if (!repsOn()) return;
    reps.html = [null, null];
    for (const id of ['#repYou', '#repYouN', '#repOpp', '#repOppN']) $(id).dataset.k = '';
    renderReports();
    // the game carries on: time spent reading never counts
    ui.lastTick = Date.now();
    if (G && !$('#game').hidden) render();
  }
  // A click or tap closes the reports and does nothing else (it never lands on a tile, cell or button underneath).
  // With the result screen open, the click goes through to it as usual.
  window.addEventListener('pointerdown', e => {
    if (!repsOn() || !G || $('#game').hidden) return;
    const modal = !$('#modal').hidden;
    clearReports();
    if (modal) return;
    reps.swallowUntil = Date.now() + 700;
    e.stopPropagation(); e.preventDefault();
  }, true);
  window.addEventListener('click', e => {
    if (Date.now() < reps.swallowUntil) { reps.swallowUntil = 0; e.stopPropagation(); e.preventDefault(); }
  }, true);

  function openModal(html) { $('#sheet').innerHTML = html; $('#modal').hidden = false; }
  function closeModal() { $('#modal').hidden = true; $('#modal').onclick = null; $('#sheet').innerHTML = ''; $('#sheet').onclick = null; $('#sheet').onpointerdown = null; }
  function confirmBox(title, text, yes, no) {
    return new Promise(res => {
      openModal(`<h2>${esc(title)}</h2><p>${esc(text)}</p><div class="row"><button class="btn" data-a="no">${esc(no)}</button><button class="btn primary" data-a="yes">${esc(yes)}</button></div>`);
      $('#sheet').onclick = e => { const b = e.target.closest('[data-a]'); if (!b) return; closeModal(); res(b.dataset.a === 'yes'); };
    });
  }

  // How To Play (v04, JM CD-8: 9.1): every section starts closed; tap a header to open it, and the section
  // that was open closes. The chevron on the right turns as it opens.
  // v05 (JM, CD-10: 6.1.1): every feature labeled in the menu has its own section, in menu order, then the play sections.
  // v06 (JM, CD-11): title-case headings; every cross-reference is a link that opens its section (closing the others)
  // and scrolls to it; a Clue Bar section; Scoring lists the shared rules, then one part per mode with an example.
  function showHelp() {
    const st = G && !G.over ? G : { settings };
    const cur = (st.settings && st.settings.scoring) || 'classic';
    const R = E.RULES;
    const hintC = R.hintCost, wrongMin = R.wrongPenalty;
    const idOf = title => title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const sec = (title, body) => { return `<section class="help-sec" data-sec="${idOf(title)}"><button class="help-h" type="button" aria-expanded="false">${title}<span class="hc" aria-hidden="true">▸</span></button><div class="help-b"><div><ul>${body}</ul></div></div></section>`; };
    // a link to another section: opens it (closing the others) and scrolls to it
    const go = (title, label) => `<a class="help-link" href="#" data-go="${idOf(title)}">${label || title}</a>`;
    const chip = k => (k === cur ? ' <span class="chip">this game</span>' : '');
    const modeH = (k, extra) => `<li class="help-sub"><b>${esc(E.MODES[k].name)}</b>${chip(k)}${extra || ''}</li>`;
    openModal(`
      <h2>How To Play <span class="chip">${APP_VER}</span></h2>
      <p>You and a computer rival take turns filling the same crossword with letter tiles. Every tile you place correctly scores, finishing words scores more, and the highest score wins.</p>
      <p class="help-note">The first sections follow the menu, top to bottom. Tap a heading to open it. Underlined names open their section.</p>
      ${sec('You', `
        <li>Tap the face to choose your avatar.</li>
        <li>Type your name in the box beside it. It shows above your score and on the Scoreboard. Left empty, you're "You".</li>`)}
      ${sec('Opponent', `
        <li>Each ${go('Challenge Level')} has its own computer rival, from Benny Bear 🐻 at level 1 to Professor Hoot 🦉 at level 10. Change the level and your rival changes with it.</li>
        <li>Rivals at levels 4–7 are <b>easygoing</b>: they play gentler than their puzzles, so the climb from 1 to 7 is gradual. Levels 8–10 are the <b>Master</b> levels, with a big step up in the rival's skill.</li>
        <li>Under the rival's name is your <b>won–lost record</b> against them.</li>
        <li>Point at the card with the mouse (or press and hold it on a touch screen) to read the rival's personality: how they like to play.</li>`)}
      ${sec('Challenge Level', `
        <li>Runs from <b>1 · Gentle</b> to <b>10 · Ruthless</b>. It sets two things at once: your rival's skill and the puzzle's difficulty.</li>
        <li>The rival's skill rises gently from 1 to 7, then jumps at 8: levels 8–10 are the <b>Master</b> levels (see ${go('Opponent')}). The puzzle's difficulty rises steadily at every level.</li>
        <li>As the level rises: words get longer and harder, the grid starts with fewer starter letters, and word and picture clues get trickier.</li>
        <li>Picture clues: at levels 1–5 the ${go('Clue Bar', 'clue bar')} names the kind of picture clue (see ${go('Clue Pics')}); from level 6 you work it out yourself.</li>
        <li>From level 5, word clues turn punny: double meanings and wordplay. A "?" means don't take it literally.</li>`)}
      ${sec('Grid Size', `
        <li><b>Small</b> (5 × 6), <b>Medium</b> (6 × 7) or <b>Large</b> (7 × 11). Bigger grids mean more words, longer games and bigger scores.</li>`)}
      ${sec('Letters in Hand', `
        <li>How many tiles each player holds: 5 to 8. Your hand refills from the bag after every turn.</li>
        <li>More tiles give you more choices each turn. Fewer tiles make the <b>Full Hand</b> bonus easier to earn: place as many tiles in one turn as this setting (all 5 of 5, for example). See ${go('Bonuses')}.</li>`)}
      ${sec('Bonus Squares', `
        <li><b>Fixed</b>: the bonus cells (2×, +5 and +2) are placed when the game starts and stay put.</li>
        <li><b>Floating</b>: a new +5 and 2× pair appears every turn from turn 2 and lasts 2 turns; last turn's pair is dimmed. +2 cells are never floating: they come only with Fixed or Both.</li>
        <li><b>Both</b>: fixed cells plus the floating pairs.</li>
        <li><b>Off</b>: no bonus cells.</li>
        <li>What the cells are worth is in ${go('Bonuses')}.</li>`)}
      ${sec('Clue Pics', `
        <li>A <b>CLUE PIC</b> is a clue made of one or more pictures (emoji) instead of words.</li>
        <li>The setting chooses how many clues are pictures: <b>Off</b> (none), <b>Some</b>, or <b>Lots</b>.</li>
        <li>They come in six kinds. The trickier kinds start at higher ${go('Challenge Level', 'Challenge Levels')}:
          <ul>
            <li>A <b>plain picture</b> (🐟 = FISH), from level 1.</li>
            <li><b>Group word</b> (🍎🍌🍇 = FRUIT), from level 3.</li>
            <li><b>Goes with</b> (🔒 = KEY), from level 4.</li>
            <li><b>Add them up</b> (🐄 + 👦 = COWBOY), from level 6.</li>
            <li><b>Sounds like</b> (🌻 = FLOUR), from level 7.</li>
            <li><b>Letter math</b> (🐻 − B + P = PEAR), from level 8.</li>
          </ul></li>
        <li>At levels 1–5 the ${go('Clue Bar', 'clue bar')} names the kind; from level 6 you're on your own.</li>`)}
      ${sec('Scoring', `
        <li>Pick one of five scoring modes. The modes differ only in how tiles and words score. Everything else is the same in every mode:</li>
        <li class="help-sub"><b>In every mode</b></li>
        <li><span class="chip p5">+${R.plusCell}</span> cells add <b>${R.plusCell}</b> points.</li>
        <li><span class="chip p5">+${R.plus2Cell}</span> cells add <b>${R.plus2Cell}</b> points.</li>
        <li><span class="chip x2">2×</span> cells double the turn's points from tiles and words (see ${go('Bonuses')}).</li>
        <li><b>Full Hand</b>: <b>+${R.fullHandBonus}</b> points.</li>
        <li><b>Wrong Cell</b>: costs <b>${wrongMin} points</b>, or the tile's value if that is more. In Classic a wrong Q or Z costs 10 and a wrong E costs 2.</li>
        <li><b>Hint</b>: costs <b>${hintC} points</b> (see ${go('The Buttons')}).</li>
        <li>When the game ends, the tiles still in each hand are taken off that player's score (see ${go('The End')}).</li>
        ${modeH('classic')}
        <li>Each tile scores its letter value, shown on the tile: common letters like E and T are worth 1; Q and Z are worth 10.</li>
        <li>Finishing a word scores all its letters again, plus 2 per letter.</li>
        <li><i>Example:</i> C and A of CAT are already on the grid, and you place the T. The T scores 1. CAT is finished: C 3 + A 1 + T 1 = 5, plus 2 × 3 letters = 6, so the word scores 11. Your turn: <b>12</b>.</li>
        ${modeH('flat')}
        <li>Every tile scores 1. Finishing a word adds 1 per letter.</li>
        <li><i>Example:</i> you place the T that finishes CAT: 1 for the tile + 3 for the word = <b>4</b>.</li>
        ${modeH('finisher')}
        <li>Tiles score nothing on their own. Finishing a word scores its length × length.</li>
        <li><i>Example:</i> you place the T that finishes CAT: 3 × 3 = <b>9</b>. Finishing a 5-letter word scores 25.</li>
        ${modeH('combo')}
        <li>Each correct tile in a turn is worth 1 more than the one before: 1, 2, 3… Words score nothing extra. A wrong cell restarts the chain at 1.</li>
        <li><i>Example:</i> 4 tiles in one turn: 1 + 2 + 3 + 4 = <b>10</b>. Two tiles, a wrong cell, then two more: 1 + 2 + 1 + 2 = 6, minus the Wrong Cell.</li>
        ${modeH('bounty')}
        <li>Like Classic, but each letter's value is set by how often it appears in <b>this</b> grid (counting the starter letters), so the values change every game. They are shown on your tiles.</li>
        <li>A letter that appears once is worth <b>6</b>; twice, <b>4</b>; 3 times, <b>3</b>; 4 or 5 times, <b>2</b>; 6 times or more, <b>1</b>.</li>
        <li>Each tile scores its value. Finishing a word scores all its letters' values again, plus 2 per letter.</li>
        <li><i>Example:</i> in this grid J appears once (6), E appears 7 times (1) and T appears 4 times (2). E and T of JET are on the grid, and you place the rare J. The J scores 6. JET is finished: 6 + 1 + 2 = 9, plus 2 × 3 letters = 6, so the word scores 15. Your turn: <b>21</b>.</li>
        <li>If J and T were already there and you placed the common E instead, the word still scores 15, but the E adds only 1: <b>16</b>.</li>
        <li>Rare letters cut both ways: a J left in your hand at the end costs you 6, and a J in a wrong cell costs 6.</li>`)}
      ${sec('Timer', `
        <li><b>Untimed</b>: take as long as you like.</li>
        <li><b>Per turn</b> (Blitz 30 s, or 1 to 5 minutes a turn): when it runs out, your turn ends and the tiles you placed still score.</li>
        <li><b>Whole game</b> (2 to 15 minutes): your clock runs only on your turns; when it reaches zero, the game ends.</li>
        <li>Clocks never run while a ${go('Turn Reports and The Scoreboard', 'turn report')} is waiting for your tap, or while the game is paused.</li>
        <li>In the last 10 seconds the grid's border flashes every second: <b>yellow</b> from 10 to 6, <b>red</b> from 5 to 1.</li>`)}
      ${sec('Resume Game', `
        <li><b>New Game</b> starts a fresh puzzle with the settings above.</li>
        <li><b>Resume Game</b> appears when you have an unfinished game. Your game is saved after every turn and whenever you leave it (☰ in the upper-left corner of the game).</li>`)}
      ${sec('Clue Bar', `
        <li>The clue bar sits at the top of the game, between the two scores (on a phone, on its own row just below them).</li>
        <li>Tap a clue in the grid to show it in the bar. Tap a white cell to show the word it belongs to; tap the same cell again to switch between its across and down words.</li>
        <li>When a cell sits in two words, or a clue cell holds two clues, the bar shows both on two lines: across (→) on top, down (↓) below. The word you are working on is highlighted; tap the other line to switch to it.</li>
        <li>Each line shows the clue, then the letters found so far with blanks for the rest, like [C _ T _], how many are found (2 / 4), and what the found letters are worth in this game's ${go('Scoring', 'scoring mode')}. In Word Finisher it shows what the word will score when finished; Combo Chain shows no points here.</li>
        <li>At ${go('Challenge Level', 'Challenge Levels')} 1–5, a tricky picture clue also shows its kind, like "sounds like" (see ${go('Clue Pics')}). From level 6 there are no labels.</li>
        <li>With no clue chosen, the bar shows whose turn it is and what to do next.</li>`)}
      ${sec('The Grid', `
        <li>Gray CLUE CELLS hold the clues, and every one of them holds at least one. The orange arrow points to where the answer starts: ▶ runs right, ▼ runs down.</li>
        <li>The <b>top row</b> holds one clue per cell, for the word below it (▼). The <b>left column</b> holds one clue per cell, for the word to its right (▶).</li>
        <li>Every clue cell <b>inside</b> the grid holds two clues: the across clue on top (▶) and the down clue below (▼). Only clue cells in the <b>bottom row</b> (across only) or the <b>right column</b> (down only) hold one.</li>
        <li>Some answers are just 1 or 2 letters. A 1-letter clue may be a fill-in like ZEBR_ (A), a Roman numeral, a compass point or a T-shirt size.</li>
        <li>Tap a clue or a white cell to read it at the top: see ${go('Clue Bar')}.</li>
        <li>Point at a clue with the mouse, or press and hold it on a touch screen, to see it enlarged across the grid.</li>
        <li>Some clues are pictures: see ${go('Clue Pics')}.</li>`)}
      ${sec('Your Turn', `
        <li>Drag tiles from your hand onto the cells where they belong, or tap a tile and then a cell. Place as many as you like. This turn's tiles are bright orange with a blue frame.</li>
        <li>A tile only stays in its correct cell. A wrong cell costs ${wrongMin} points (or the tile's value, if that is more) and the tile returns to your hand.</li>
        <li>Drag a tile you placed this turn to another cell, or back to your hand. Tapping it also takes it back.</li>
        <li>Drag tiles inside your hand to sort them your way. A gold space shows where the tile will land.</li>
        <li>Your hand refills from the bag after every turn as long as more tiles exist in the bag. Near the end of a game, your opponent may hold more tiles than you, requiring you to PASS until all tiles have been played (or three passes in a row have occurred to end the game).</li>`)}
      ${sec('The Buttons', `
        <li>Your hand and the buttons share the bottom row. On a phone, ✓ Done stays on the row and the other buttons open from <b>⋯ More</b>; in timed games your clock then shows under your score.</li>
        <li><b>💡 Hint (−${hintC})</b>: shows a cell where one of your tiles fits.</li>
        <li><b>🎯 Place (−?)</b>: puts one random tile from your hand into a cell where it fits. It costs that tile's value (shown on the tile; 1 in modes without tile values), then scores like any tile you place.</li>
        <li><b>🔄 Swap</b>: trade some or all of your tiles for new ones from the bag. It ends your turn and counts as a pass.</li>
        <li><b>🔀 Shuffle</b>: mixes the order of your hand.</li>
        <li><b>⏸️ Pause</b> (or the P key) shows your clock in timed games. It stops every clock and hides the grid, clues and hand; tap the PLAY PAUSED panel, ▶️, or P to resume. The game also pauses when you switch to another tab or app.</li>
        <li><b>⏱️ +30s (−${R.timeCost})</b> (timed games only): adds 30 seconds to your clock for ${R.timeCost} points. Use it as often as you like.</li>
        <li><b>✓ Done</b> banks this turn's points (it shows how many). With nothing placed it reads <b>Pass</b>.</li>`)}
      ${sec('Bonuses', `
        <li><span class="chip x2">2×</span> doubles your turn's points from tiles and words. Each extra 2× in the same turn adds another double: 10 → 20 → 40 → 60.</li>
        <li><span class="chip p5">+${R.plusCell}</span> cells add ${R.plusCell} points, and <span class="chip p5">+${R.plus2Cell}</span> cells add ${R.plus2Cell} points. Both are added after doubling and are never doubled. +${R.plus2Cell} cells appear only with the Fixed or Both setting (see ${go('Bonus Squares')}).</li>
        <li><b>Full Hand</b>: place as many tiles in one turn as your ${go('Letters in Hand', '"Letters in Hand"')} setting (all 7 of 7, for example) to earn a +${R.fullHandBonus} point bonus. A tile put down with 🎯 Place counts. A Full Hand bonus is added after doubling and is never doubled. Near the end of the game, when the bag is empty and your hand holds fewer tiles than the setting, it can't be earned.</li>
        <li>Bonus cells glow green and pulse at three speeds: +${R.plus2Cell} slowest, +${R.plusCell} slowly, 2× quickly. The bigger the bonus, the faster the pulse.</li>
        <li>Where bonus cells appear is set by ${go('Bonus Squares')}.</li>`)}
      ${sec('Turn Reports and The Scoreboard', `
        <li>After each turn, a report shows that player's TOTAL first, then a row for every word, bonus and penalty (+ added, − taken away). On wide screens it sits at the bottom of that player's Scoreboard column; on phones, at the bottom of the grid.</li>
        <li>While a report is on screen the game waits: your clock stops the moment your rival finishes, and nothing can be played. <b>Click or tap anywhere</b> to close the reports and start your turn. That click does nothing else.</li>
        <li>The <b>Scoreboard</b> keeps every turn by round: letter points, word points, bonuses, penalties and the turn's total. Green marks the higher score in each round. On phones, tap ▸ Scoreboard to open it.</li>`)}
      ${sec('The End', `
        <li>The game ends when the grid is full, by the <b>3 PASSES Rule</b> (${esc(PASS_RULE)}), or when a whole-game clock runs out.</li>
        <li>A yellow box warns you after the 1st pass; a red box after the 2nd.</li>
        <li>The result screen shows both players' stats and your record against this opponent.</li>`)}
      ${sec('Word Vault', `
        <li><b>Word Vault</b> is a word-guessing mini-game, opened from its own button on the menu. Guess the hidden word in a set number of tries.</li>
        <li>After each guess every letter is marked: <b>green</b> right letter in the right spot, <b>yellow</b> in the word but in another spot, <b>red</b> not in the word. Green letters carry into your next guess.</li>
        <li>You choose the Challenge Level (vocabulary), the word's length (4–8 letters), the number of guesses (5–10), a timer and a scoring mode, and you can change them during play (⚙). Extras: 🔎 Hint (−5) shows a clue, 💡 Reveal (−3) places a letter, ✕ clears a guess, and tapping the clock pauses. Tap its <b>?</b> for the full rules.</li>
        <li>Make it yours: double-click its title to rename it, and tap the icon beside the title to change it or upload your own picture.</li>`)}
      ${sec('Strategy', `
        <li>Don't rush. A word left with only one empty cell is a gift to your rival. Sometimes it pays to <b>hold</b> a tile until you can finish the word yourself.</li>
        <li>It is often smart to save 2× squares for big turns because they double everything else you score that turn. Beware: your opponent can "steal" the bonus squares in the early rounds to keep you from scoring big.</li>`)}
      <div class="row"><button class="btn primary" data-a="ok">Got it</button></div>`);
    const sheet = $('#sheet');
    // v07b (JM, CD-20: 3.3.1): a tap anywhere outside the How To Play panel closes it, like "Got it"
    $('#modal').onclick = e => { if (e.target === $('#modal')) closeModal(); };
    const openSec = (s, open) => {
      sheet.querySelectorAll('.help-sec.open').forEach(x => { x.classList.remove('open'); x.querySelector('.help-h').setAttribute('aria-expanded', 'false'); });
      if (open) { s.classList.add('open'); s.querySelector('.help-h').setAttribute('aria-expanded', 'true'); }
    };
    sheet.onclick = e => {
      const lk = e.target.closest('.help-link');
      if (lk) {
        e.preventDefault();
        const s = sheet.querySelector(`.help-sec[data-sec="${lk.dataset.go}"]`);
        if (!s) return;
        // jump without the open/close animation, so the heading lands exactly at the top of the panel,
        // then flash the heading so the eye finds it
        sheet.classList.add('help-jump');
        openSec(s, true);
        sheet.scrollTop = s.getBoundingClientRect().top - sheet.getBoundingClientRect().top + sheet.scrollTop - 4;
        void sheet.offsetHeight;
        sheet.classList.remove('help-jump');
        s.classList.remove('flash'); void s.offsetWidth; s.classList.add('flash');
        setTimeout(() => s.classList.remove('flash'), 1300);
        return;
      }
      const h = e.target.closest('.help-h');
      if (h) { const s = h.parentElement; openSec(s, !s.classList.contains('open')); return; }
      if (e.target.closest('[data-a]')) closeModal();
    };
  }
  $('#helpBtn').addEventListener('click', () => { if (G && !G.over && E.timerOf(G.settings.timer).kind !== 'none') setPaused(true); showHelp(); });
  // v06c (CD-18: 3.1a): the phone copies of ☰ and ? in the Scoreboard row do exactly what the top-bar buttons do
  $('#helpBtn2').addEventListener('click', () => $('#helpBtn').click());
  $('#menuBtn2').addEventListener('click', () => $('#menuBtn').click());

  $('#menuBtn').addEventListener('click', async () => {
    if (G && G.over) { leaveGame(); return; }
    const ok = await confirmBox('Leave this game?', 'Your game is saved. You can resume it from the menu.', 'Leave', 'Keep playing');
    if (ok) leaveGame();
  });

  // =====================================================================
  // Turn flow
  // =====================================================================
  function save() { if (G) store.set('cd.save', G); }

  function startHumanTurn() {
    ui.pending = [];
    ui.selTile = null;
    ui.hintCell = -1; cancelDrag();
    ui.busy = false;
    ui.chainBroken = false;
    stopTimer();
    const tm = E.timerOf(G.settings.timer);
    if (tm.kind !== 'none') {
      if (tm.kind === 'turn') ui.left = tm.secs * 1000;
      ui.lastTick = Date.now();
      ui.timerId = setInterval(tick, 250);
    }
    render();
  }
  // Clocks only run on your turn and never while paused
  function tick() {
    const now = Date.now(), dt = now - ui.lastTick;
    ui.lastTick = now;
    if (!G || G.over || ui.paused || G.turn !== 0 || ui.busy || repsOn()) return;
    const tm = E.timerOf(G.settings.timer);
    if (tm.kind === 'turn') ui.left = Math.max(0, ui.left - dt);
    else if (tm.kind === 'game') G.clock = Math.max(0, G.clock - dt);
    renderClock();
    if (tm.kind === 'turn' && ui.left <= 0) { stopTimer(); toast('Time\'s up!', 'bad'); onDone(); }
    if (tm.kind === 'game' && G.clock <= 0) { stopTimer(); clockOut(); }
  }
  function stopTimer() { clearInterval(ui.timerId); ui.timerId = 0; }

  // Whole-game clock reached zero: tiles you placed this turn still score, then the game ends
  function clockOut() {
    if (!G || G.over || G.turn !== 0) return;
    closeZoom(true); cancelDrag();
    const placements = ui.pending.slice();
    Object.assign(ui, { pending: [], selTile: null, hintCell: -1, selSlot: -1, selCell: -1 });
    if (placements.length) E.commit(G, 0, placements);
    E.endTurn(G, placements.length, 'pass', 'clock');
    showReport(lastLog());
    toast('Your clock ran out. Game over.', 'bad', 3000);
    afterTurn(true);
  }

  // ---------- Pause (JM, CD-4 add'l 2; CD-5: 4.1a–4.3) ----------
  function setPaused(on) {
    on = !!on && !!G && !G.over && !$('#game').hidden;
    if (on === ui.paused) return;
    ui.paused = on;
    ui.lastTick = Date.now(); // paused time never counts
    $('#game').classList.toggle('paused', on);
    $('#pauseOv').hidden = !on;
    if (on) { closeZoom(true); cancelDrag(); ui.selTile = null; save(); }
    if (G) { renderClock(); renderRack(); }
  }
  $('#pauseBtn').addEventListener('click', () => setPaused(!ui.paused));
  $('#pauseOv').addEventListener('click', () => setPaused(false));
  document.addEventListener('keydown', e => {
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    if ((e.key === 'p' || e.key === 'P') && G && !$('#game').hidden && $('#modal').hidden && !/^(INPUT|SELECT|TEXTAREA)$/.test((e.target.tagName || ''))) {
      e.preventDefault();
      setPaused(!ui.paused);
    }
  });
  // Pause automatically when you switch to another tab or app
  document.addEventListener('visibilitychange', () => { if (document.hidden && G && !G.over && !$('#game').hidden) setPaused(true); });
  // Waits that respect Pause (used by the opponent's turn)
  async function nap(ms) { await sleep(ms); while (ui.paused) await sleep(150); }

  function passToast(who, kind) {
    const n = G.passes;
    toast(`${who} ${kind === 'swap' ? 'swapped tiles' : 'passed'}${n ? ` · pass ${n} of ${E.RULES.passLimit}` : ''}`, n >= 2 ? 'bad' : '', 2600);
  }

  function afterTurn(over) {
    save();
    if (over) { render(); gameOver(); return; }
    ui.busy = true;
    render();
    runAiTurn();
  }

  function onDone() {
    if (!G || G.over || G.turn !== 0 || ui.busy || ui.paused) return;
    stopTimer();
    closeZoom(true); cancelDrag();
    const placements = ui.pending.slice();
    Object.assign(ui, { pending: [], selTile: null, hintCell: -1, selSlot: -1, selCell: -1 });
    if (placements.length) E.commit(G, 0, placements);
    const over = E.endTurn(G, placements.length);
    showReport(lastLog());
    if (!placements.length && !over) passToast(myName(), 'pass');
    afterTurn(over);
  }
  $('#doneBtn').addEventListener('click', onDone);

  async function runAiTurn() {
    const token = ui.token;
    ui.busy = true;
    ui.selSlot = -1; ui.selCell = -1; cancelDrag();
    render();
    await nap(650 + Math.random() * 650);
    if (token !== ui.token) return;
    const plan = E.aiPlan(G);
    const real = [];
    ui.aiPending = new Map();
    let reset = false;
    for (const step of plan) {
      if (step.wrong) {
        const pen = E.penaltyOf(G, 'wrong', step.ch);
        E.penalize(G, 1, pen, 'wrong', step.ch);
        reset = true;
        ui.flash = { cell: step.cell, ch: step.ch };
        render();
        toast(`${opp().n} tried ${step.ch} in a wrong cell · −${pen}`, 'opp');
        await nap(750);
        if (token !== ui.token) return;
        ui.flash = null;
        continue;
      }
      ui.aiPending.set(step.cell, step.ch);
      ui.pop = step.cell;
      real.push(Object.assign({ reset }, step));
      reset = false;
      render();
      await nap(430);
      if (token !== ui.token) return;
    }
    ui.aiPending = null;
    if (real.length) E.commit(G, 1, real);
    const over = E.endTurn(G, real.length);
    showReport(lastLog());
    if (!real.length && !over) passToast(opp().n, 'pass');
    save();
    ui.busy = false;
    if (over) { render(); gameOver(); return; }
    startHumanTurn();
  }

  // Place one of your tiles on a cell
  function placeTile(tileId, ci) {
    if (!myTurn()) return;
    const t = G.hands[0].find(x => x.id === tileId);
    const c = G.pz.cells[ci];
    if (!t || !c || c.k !== 'l' || G.board[ci] || ui.pending.some(p => p.cell === ci) || ui.pending.some(p => p.tileId === tileId)) {
      ui.selTile = null; render(); return;
    }
    if (c.s !== t.ch) {
      const pen = E.penaltyOf(G, 'wrong', t.ch);
      E.penalize(G, 0, pen, 'wrong', t.ch);
      ui.chainBroken = true; // Combo Chain restarts after a wrong cell
      ui.selTile = null;
      ui.flash = { cell: ci, ch: t.ch };
      render();
      setTimeout(() => { if (ui.flash && ui.flash.cell === ci) { ui.flash = null; render(); } }, 650);
      toast(`${t.ch} doesn't go there · −${pen}`, 'bad');
      if (navigator.vibrate) try { navigator.vibrate(60); } catch (e) { /* ignore */ }
      save();
      return;
    }
    ui.pending.push({ cell: ci, tileId, ch: t.ch, reset: ui.chainBroken });
    ui.chainBroken = false;
    ui.selTile = null;
    if (ui.hintCell === ci) ui.hintCell = -1;
    if (ui.selSlot < 0 || !G.pz.slots[ui.selSlot].cells.includes(ci)) ui.selSlot = G.pz.cellSlots[ci][0];
    ui.selCell = ci;
    ui.pop = ci;
    render();
  }

  // Move a tile placed this turn: to another cell (checked like any placement) or back to the hand
  function movePending(ci, target) {
    const idx = ui.pending.findIndex(p => p.cell === ci);
    if (idx < 0 || !target) { render(); return; }
    if (target.closest('#rack')) { ui.pending.splice(idx, 1); render(); return; }
    const ni = +target.dataset.i;
    if (ni === ci || G.board[ni] || ui.pending.some(p => p.cell === ni)) { render(); return; }
    const p = ui.pending.splice(idx, 1)[0];
    if (p.reset) ui.chainBroken = true; // keep a broken chain broken
    placeTile(p.tileId, ni);
  }

  // Board taps
  $('#board').addEventListener('click', e => {
    if (!G || clickSuppressed()) return;
    const cl = e.target.closest('.cl');
    if (cl) { const si = +cl.dataset.s; ui.selSlot = ui.selSlot === si && ui.selCell < 0 ? -1 : si; ui.selCell = -1; render(); return; }
    const el = e.target.closest('.cell.let');
    if (!el) return;
    const i = +el.dataset.i;
    const pIdx = ui.pending.findIndex(p => p.cell === i);
    if (pIdx >= 0 && myTurn()) { ui.pending.splice(pIdx, 1); render(); return; }
    if (ui.selTile != null && !G.board[i] && myTurn()) { placeTile(ui.selTile, i); return; }
    const ss = G.pz.cellSlots[i];
    if (!ss.length) return;
    if (ui.selCell === i) ui.selSlot = ss[(ss.indexOf(ui.selSlot) + 1) % ss.length];
    else ui.selSlot = ss.includes(ui.selSlot) ? ui.selSlot : ss[0];
    ui.selCell = i;
    render();
  });
  $('#board').addEventListener('contextmenu', e => e.preventDefault());

  // Clue bar: tap a line to make it the active clue
  $('#cluebar').addEventListener('click', e => {
    const ln = e.target.closest('.cb-line');
    if (!ln || !G) return;
    const si = +ln.dataset.s;
    if (si !== ui.selSlot) { ui.selSlot = si; render(); }
  });

  // =====================================================================
  // Drag-and-drop (shared by the hand, placed tiles and the Swap popup)
  // =====================================================================
  // Only one drag at a time. cancelDrag() drops it cleanly (used when a turn ends mid-drag:
  // time-out, pause, leaving the game), so no tile is ever left stuck on screen (CD-6: 6.1.1).
  let activeDrag = null;
  function cancelDrag() {
    if (activeDrag) activeDrag.abort();
    activeDrag = null;
    document.querySelectorAll('.ghost').forEach(g => g.remove());
    document.querySelectorAll('.drop').forEach(d => d.classList.remove('drop'));
    ui.dragging = false;
  }
  function drag(e, el, find, onDrop, onTap, onMove) {
    e.preventDefault();
    cancelDrag();
    const sx = e.clientX, sy = e.clientY, pid = e.pointerId;
    const lift = e.pointerType === 'touch' ? 46 : 0;
    let ghost = null, over = null;
    try { el.setPointerCapture(pid); } catch (err) { /* ignore */ }
    const at = (x, y) => { const t = document.elementFromPoint(x, y - lift); return t ? find(t) : null; };
    const place = (x, y, up2) => { ghost.style.transform = `translate(${x - 29}px, ${y - 29 - lift - (up2 || 0)}px)`; };
    const move = ev => {
      if (ev.pointerId !== pid) return;
      if (!ghost && Math.hypot(ev.clientX - sx, ev.clientY - sy) > 8) {
        ghost = el.cloneNode(true);
        ghost.className = 'tile ghost';
        ghost.removeAttribute('style');
        place(ev.clientX, ev.clientY); // positioned before it appears, so it never flies in from a corner (CD-6: 9.1)
        document.body.appendChild(ghost);
        el.classList.add('dragging');
        ui.dragging = true;
        closeZoom(true);
      }
      if (!ghost) return;
      const t = at(ev.clientX, ev.clientY);
      if (t !== over) { if (over) over.classList.remove('drop'); over = t; if (over && over.id !== 'rack') over.classList.add('drop'); }
      // onMove may return an extra upward offset (sorting lifts the tile so the landing space shows underneath)
      place(ev.clientX, ev.clientY, onMove && onMove(ev.clientX, ev.clientY - lift, over));
    };
    const detach = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      if (over) over.classList.remove('drop');
      if (ghost) ghost.remove();
      el.classList.remove('dragging', 'placeholder');
      if (activeDrag === me) activeDrag = null;
    };
    const up = ev => {
      if (ev.pointerId !== pid) return;
      const dragged = !!ghost;
      detach();
      if (dragged) {
        ui.dragging = false;
        suppressClick();
        // the tile may have gone away (e.g. the turn ended); then just redraw
        if (!el.isConnected || !G || G.over) { if (G) render(); return; }
        onDrop(ev.type === 'pointerup' ? at(ev.clientX, ev.clientY) : null);
      } else if (ev.type === 'pointerup' && onTap && el.isConnected) onTap();
    };
    const me = { abort: detach };
    activeDrag = me;
    // listen on the window, so the release is caught even if the tile was redrawn mid-drag
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  }

  // Hand: tap to select, drag onto the grid to place, drag within the hand to sort
  $('#rack').addEventListener('pointerdown', e => {
    const el = e.target.closest('.tile[data-id]');
    if (!el || !G || G.over || ui.paused) return;
    const id = +el.dataset.id;
    ui.sortK = -1;
    drag(e, el,
      t => t.closest('.cell.let') || t.closest('#rack'),
      t => {
        clearSortPreview();
        if (!t) { render(); return; }
        if (t.classList.contains('let')) { placeTile(id, +t.dataset.i); return; }
        reorderHand(id, ui.sortK);
      },
      () => { if (myTurn()) { ui.selTile = ui.selTile === id ? null : id; render(); } },
      (x, y, over) => sortPreview(id, el, x, over));
  });

  // While sorting: the other tiles slide apart and a gold space marks where the tile will land (JM, CD-5: 2.1a)
  function sortPreview(id, el, x, over) {
    const rack = $('#rack');
    const kids = [...rack.children].slice(0, G.hands[0].length);
    if (!over || over.id !== 'rack') { clearSortPreview(); el.classList.add('dragging'); return 0; }
    const from = kids.indexOf(el);
    // slot positions from the layout (offsetLeft ignores the slide offsets)
    const left0 = rack.getBoundingClientRect().left + kids[0].offsetLeft, w = kids[0].offsetWidth;
    const pitch = kids.length > 1 ? kids[1].offsetLeft - kids[0].offsetLeft : w;
    let k = Math.round((x - left0 - w / 2) / pitch);
    k = Math.max(0, Math.min(kids.length - 1, k));
    ui.sortK = k;
    const order = kids.filter(c => c !== el);
    order.splice(k, 0, el);
    kids.forEach((c, j) => { const dx = (order.indexOf(c) - j) * pitch; c.style.transform = dx ? `translateX(${dx}px)` : ''; });
    el.classList.remove('dragging');
    el.classList.add('placeholder');
    if (from < 0) { clearSortPreview(); return 0; }
    return Math.round(w * 0.75); // float the dragged tile above its landing space
  }
  function clearSortPreview() {
    for (const c of $('#rack').children) { c.style.transform = ''; c.classList.remove('placeholder'); }
  }
  function reorderHand(id, to) {
    const h = G.hands[0];
    const from = h.findIndex(t => t.id === id);
    if (from < 0 || to < 0) { render(); return; }
    to = Math.min(to, h.length - 1);
    const [t] = h.splice(from, 1);
    h.splice(to, 0, t);
    save();
    render();
  }

  // Placed (pending) tiles: drag to another open cell or back to the hand
  $('#board').addEventListener('pointerdown', e => {
    const el = e.target.closest('.cell.pending');
    if (!el || !myTurn()) return;
    const ci = +el.dataset.i;
    drag(e, el, t => t.closest('.cell.let') || t.closest('#rack'), t => movePending(ci, t), null);
  });

  $('#mixBtn').addEventListener('click', () => {
    if (!G || G.over) return;
    const h = G.hands[0];
    for (let i = h.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [h[i], h[j]] = [h[j], h[i]]; }
    save();
    render();
  });

  $('#hintBtn').addEventListener('click', () => {
    if (!myTurn()) return;
    const h = E.hint(G, 0, { tiles: new Set(ui.pending.map(p => p.tileId)), cells: new Set(ui.pending.map(p => p.cell)) });
    if (!h) { toast('No hint available'); return; }
    const cost = E.penaltyOf(G, 'hint');
    E.penalize(G, 0, cost, 'hint');
    ui.hintCell = h.cell;
    ui.selTile = h.tileId;
    ui.selSlot = G.pz.cellSlots[h.cell][0];
    ui.selCell = h.cell;
    toast(`Hint · −${cost}. Tap the glowing cell to place it.`);
    save();
    render();
  });

  // Place (JM, CD-7 add'l 1.1): one random tile from your hand goes into a cell where it fits; costs that tile's value
  $('#placeBtn').addEventListener('click', () => {
    if (!myTurn()) return;
    const a = E.autoPlace(G, 0, { tiles: new Set(ui.pending.map(p => p.tileId)), cells: new Set(ui.pending.map(p => p.cell)) });
    if (!a) { toast('None of your tiles fits an open cell'); return; }
    E.penalize(G, 0, a.cost, 'place', a.ch);
    ui.hintCell = -1;
    placeTile(a.tileId, a.cell);
    toast(`Placed ${a.ch} · −${a.cost}`);
    save();
  });

  // +30s (JM, CD-7 add'l 1.2): timed games only; 30 more seconds on your clock for 5 points, as often as you like
  $('#timeBtn').addEventListener('click', () => {
    if (!myTurn()) return;
    const tm = E.timerOf(G.settings.timer);
    if (tm.kind === 'none') return;
    E.penalize(G, 0, E.RULES.timeCost, 'time');
    if (tm.kind === 'turn') ui.left += E.RULES.timeAdd; else G.clock += E.RULES.timeAdd;
    toast(`+30 s · −${E.RULES.timeCost}`);
    save();
    render();
  });

  // =====================================================================
  // Swap popup: choose which tiles to trade
  // =====================================================================
  $('#swapBtn').addEventListener('click', () => {
    if (!myTurn() || !G.bag.length || ui.pending.length) return;
    const hand = G.hands[0].slice();
    const picked = new Set();
    let lastTap = { id: -1, t: 0 };
    const tileH = t => `<div class="tile sw-t" data-id="${t.id}">${tileInner(t.ch)}</div>`;
    const draw = () => {
      const sel = hand.filter(t => picked.has(t.id));
      $('#swHand').innerHTML = hand.map(t => (picked.has(t.id) ? '<div class="tile gap"></div>' : tileH(t))).join('');
      let slots = '';
      for (let k = 0; k < hand.length; k++) slots += sel[k] ? tileH(sel[k]) : '<div class="tile gap"></div>';
      $('#swSlots').innerHTML = slots;
      const go = $('#swGo');
      go.disabled = !sel.length;
      go.textContent = sel.length ? `Swap ${sel.length} · end turn` : 'Swap';
      $('#swAll').textContent = sel.length === hand.length ? 'Clear' : 'All';
    };
    const toggle = id => {
      const now = Date.now();
      if (lastTap.id === id && now - lastTap.t < 450) return; // a double-click counts as one move
      lastTap = { id, t: now };
      if (picked.has(id)) picked.delete(id); else picked.add(id);
      draw();
    };
    openModal(`<h2>Swap tiles</h2>
      <p>Tap, double-click or drag the tiles you want to trade into the empty spaces below. Swapping ends your turn and counts as a pass (3 PASSES Rule).</p>
      <div class="sw-lbl">Your hand</div><div class="sw-row" id="swHand" data-z="hand" style="--n:${hand.length}"></div>
      <div class="sw-lbl">Swap these</div><div class="sw-row sw-target" id="swSlots" data-z="swap" style="--n:${hand.length}"></div>
      <div class="row"><button class="btn" data-a="all" id="swAll">All</button><button class="btn" data-a="no">Cancel</button><button class="btn primary" data-a="go" id="swGo">Swap</button></div>`);
    draw();
    const sheet = $('#sheet');
    sheet.onpointerdown = e => {
      const el = e.target.closest('.sw-t');
      if (!el) return;
      const id = +el.dataset.id;
      drag(e, el, t => t.closest('.sw-row'), z => {
        if (z) { if (z.dataset.z === 'swap') picked.add(id); else picked.delete(id); }
        draw();
      }, null);
    };
    sheet.onclick = e => {
      if (clickSuppressed()) return;
      const t = e.target.closest('.sw-t');
      if (t) { toggle(+t.dataset.id); return; }
      const b = e.target.closest('[data-a]');
      if (!b) return;
      if (b.dataset.a === 'all') { if (picked.size === hand.length) picked.clear(); else hand.forEach(x => picked.add(x.id)); draw(); return; }
      const ids = [...picked];
      sheet.onpointerdown = null;
      closeModal();
      if (b.dataset.a !== 'go' || !ids.length || !myTurn()) return;
      stopTimer();
      closeZoom(true);
      ui.pending = []; ui.selTile = null; ui.selSlot = -1; ui.selCell = -1;
      E.swapSome(G, 0, ids);
      const over = E.endTurn(G, 0, 'swap');
      showReport(lastLog());
      if (!over) passToast(myName(), 'swap');
      afterTurn(over);
    };
  });

  // =====================================================================
  // Hover-zoom: enlarged CLUE WORD / CLUE PIC at the grid's center,
  // with a trace line from its CLUE CELL (and back again on close)
  // =====================================================================
  const zoom = { si: -1, wait: -1, timer: 0, open: false, geo: null, gen: 0, held: false };
  function clEl(si) { return $(`#board .cl[data-s="${si}"]`); }
  function stopAnims(el) { if (el.getAnimations) el.getAnimations().forEach(a => a.cancel()); }

  function openZoom(si) {
    const el = clEl(si);
    if (!el || ui.dragging || !G) return;
    const s = G.pz.slots[si];
    const z = $('#zoom'), ln = $('#traceLine');
    const br = $('#board').getBoundingClientRect(), cr = el.getBoundingClientRect();
    const cx = br.left + br.width / 2;
    let cy = br.top + br.height / 2;
    const fx = cr.left + cr.width / 2, fy = cr.top + cr.height / 2;
    // The card spans the full width of the grid (JM, CD-7: 6.1), and never leaves the window
    const cardW = Math.min(innerWidth - 16, Math.max(br.width, 260));
    const inner = cardW - 36; // card padding
    let body;
    if (s.clue.pic) body = `<div class="z-pic" style="font-size:${Math.round(Math.min(170, Math.max(br.height * 0.42, 90), (inner * 0.85) / picUnits(s.clue.pic)))}px">${s.clue.pic}</div>`;
    else {
      const longest = Math.max(...s.clue.t.split(/\s+/).map(w => w.length));
      const f = Math.max(18, Math.min(84, inner / (longest * 0.64), Math.max(br.height * 0.2, 40)));
      body = `<div class="z-word" style="font-size:${Math.round(f)}px">${esc(s.clue.t)}</div>`;
    }
    const ztag = picTag(s) ? picTag(s) + ' · ' : '';
    // Caption: a taller band with larger, pure-white text (JM, CD-7: 6.2)
    z.innerHTML = body + `<div class="z-sub">${ztag}${s.d === 'A' ? '→ across' : '↓ down'} · ${s.cells.length} letters</div>`;
    z.style.maxWidth = 'none';
    z.style.width = Math.round(cardW) + 'px';
    stopAnims(z); stopAnims(ln);
    z.hidden = false;
    // v06c (JM, CD-18: 2.1–2.2): the card keeps clear of the finger (or mouse pointer). A clue in the lower half of
    // the grid puts the card at the top of the grid, one in the upper half puts it at the bottom; if the card is tall,
    // it moves further (past the grid's edge if needed, never off screen) so it never covers the clue being held.
    const zh = z.offsetHeight, gap = 8;
    if (fy > cy) cy = Math.max(gap + zh / 2, Math.min(br.top + zh / 2, cr.top - gap - zh / 2));
    else cy = Math.min(innerHeight - gap - zh / 2, Math.max(br.bottom - zh / 2, cr.bottom + gap + zh / 2));
    z.style.left = cx + 'px';
    z.style.top = cy + 'px';
    const len = Math.max(1, Math.hypot(cx - fx, cy - fy));
    ln.setAttribute('x1', fx); ln.setAttribute('y1', fy); ln.setAttribute('x2', cx); ln.setAttribute('y2', cy);
    ln.style.strokeDasharray = `${len} ${len}`;
    const k = reduceMotion() ? 0 : 1;
    const away = `translate(-50%, -50%) translate(${fx - cx}px, ${fy - cy}px) scale(.12)`;
    if (ln.animate) {
      ln.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: 240 * k, fill: 'forwards', easing: 'ease-out' });
      z.animate([{ transform: away, opacity: 0 }, { transform: 'translate(-50%, -50%)', opacity: 1 }], { duration: 300 * k, delay: 110 * k, fill: 'both', easing: 'cubic-bezier(.2,.8,.2,1)' });
    } else ln.style.strokeDashoffset = 0;
    Object.assign(zoom, { open: true, si, geo: { away, len } });
    zoom.gen++;
  }

  function closeZoom(instant) {
    clearTimeout(zoom.timer); zoom.timer = 0; zoom.wait = -1;
    if (!zoom.open) return;
    zoom.open = false; zoom.si = -1;
    const z = $('#zoom'), ln = $('#traceLine');
    const { away, len } = zoom.geo;
    const my = ++zoom.gen;
    const k = instant || reduceMotion() ? 0 : 1;
    if (!z.animate || !k) { stopAnims(z); stopAnims(ln); z.hidden = true; ln.style.strokeDasharray = '0 100000'; return; }
    const a = z.animate([{ transform: 'translate(-50%, -50%)', opacity: 1 }, { transform: away, opacity: 0 }], { duration: 230, fill: 'forwards', easing: 'ease-in' });
    ln.animate([{ strokeDashoffset: 0 }, { strokeDashoffset: len }], { duration: 230, delay: 130, fill: 'forwards', easing: 'ease-in' });
    a.onfinish = () => { if (zoom.gen === my) z.hidden = true; };
  }

  // Mouse: point at a clue for ~0.4 s
  $('#board').addEventListener('pointerover', e => {
    if (e.pointerType !== 'mouse' || !G) return;
    const cl = e.target.closest('.cl');
    const si = cl ? +cl.dataset.s : -1;
    if (si === (zoom.open ? zoom.si : zoom.wait)) return;
    closeZoom();
    if (si >= 0 && !ui.dragging) {
      zoom.wait = si;
      zoom.timer = setTimeout(() => { zoom.timer = 0; zoom.wait = -1; openZoom(si); }, 400);
    }
  });
  $('#board').addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') closeZoom(); });

  // Touch: press and hold a clue
  $('#board').addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse' || !G) return;
    const cl = e.target.closest('.cl');
    if (!cl) return;
    const si = +cl.dataset.s, sx = e.clientX, sy = e.clientY;
    closeZoom(true);
    zoom.held = false;
    zoom.timer = setTimeout(() => { zoom.timer = 0; zoom.held = true; openZoom(si); if (navigator.vibrate) try { navigator.vibrate(15); } catch (err) { /* ignore */ } }, 450);
    const end = ev => {
      if (ev.type === 'pointermove' && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 12) return;
      window.removeEventListener('pointermove', end);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
      clearTimeout(zoom.timer); zoom.timer = 0;
      if (zoom.held) { zoom.held = false; suppressClick(); closeZoom(); }
    };
    window.addEventListener('pointermove', end);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
  });

  // =====================================================================
  // Game over
  // =====================================================================
  function gameOver() {
    stopTimer(); setTimerFlash(0);
    closeZoom(true); cancelDrag();
    store.del('cd.save');
    const r = G.result;
    const stats = store.get('cd.stats', {});
    const rec = stats[G.settings.skill] || { w: 0, l: 0, d: 0 };
    if (r.winner === 0) rec.w++; else if (r.winner === 1) rec.l++; else rec.d++;
    stats[G.settings.skill] = rec;
    store.set('cd.stats', stats);
    const o = opp();
    const face = r.winner === 0 ? '🏆' : r.winner === 1 ? o.a : '🤝';
    const title = r.winner === 0 ? `${myName() === 'You' ? 'You win' : myName() + ' wins'}!` : r.winner === 1 ? `${o.n} wins` : 'It\'s a draw';
    const st = G.stats;
    const ended = r.complete ? 'The grid is complete.' : r.reason === 'clock' ? 'Your whole-game clock ran out.' : 'Three passes in a row ended the game (3 PASSES Rule).';
    setTimeout(() => {
      openModal(`
        <div class="result-face">${face}</div>
        <div class="result-title">${esc(title)}</div>
        <p style="text-align:center;margin-top:0">${ended}</p>
        <table class="score-table">
          <tr><th></th><th>${esc(myName())}</th><th>${esc(o.n)}</th></tr>
          <tr><td>Words finished</td><td>${st.words[0]}</td><td>${st.words[1]}</td></tr>
          <tr><td>Tiles placed</td><td>${st.placed[0]}</td><td>${st.placed[1]}</td></tr>
          <tr><td>Full Hand bonuses</td><td>${st.fullHands[0]}</td><td>${st.fullHands[1]}</td></tr>
          <tr><td>Wrong cells</td><td>${st.wrong[0]}</td><td>${st.wrong[1]}</td></tr>
          <tr><td>Hints used</td><td>${st.hints[0]}</td><td>${st.hints[1]}</td></tr>
          ${(st.places && st.places[0]) ? `<tr><td>Place used</td><td>${st.places[0]}</td><td>–</td></tr>` : ''}
          ${(st.time && st.time[0]) ? `<tr><td>+30s used</td><td>${st.time[0]}</td><td>–</td></tr>` : ''}
          <tr><td>Tiles left (subtracted)</td><td>−${r.leftover[0]}</td><td>−${r.leftover[1]}</td></tr>
          <tr class="total"><td>Final score</td><td>${G.scores[0]}</td><td>${G.scores[1]}</td></tr>
        </table>
        <p class="rec-line"><span class="rl-a">Record vs ${esc(o.n)}:</span><span class="rl-b">${rec.w} won · ${rec.l} lost${rec.d ? ` · ${rec.d} drawn` : ''}</span></p>
        <div class="row"><button class="btn" data-a="board">See grid</button><button class="btn" data-a="menu">Menu</button><button class="btn primary" data-a="again">Rematch</button></div>`);
      $('#sheet').onclick = e => {
        const b = e.target.closest('[data-a]');
        if (!b) return;
        closeModal();
        if (b.dataset.a === 'again') {
          const s = G.settings;
          Object.assign(settings, { skill: s.skill, size: s.size, hand: s.hand, timer: s.timer, scoring: s.scoring || 'classic', bonus: s.bonus || 'floating', pics: s.pics || 'some' });
          startNewGame();
        }
        else if (b.dataset.a === 'menu') leaveGame();
        else render();
      };
    }, 700);
  }

  // =====================================================================
  // Boot
  // =====================================================================
  // v07c: the Word Vault mini-game (vault.js) shares the menu's modal, toasts, storage and avatar list
  window.CDUI = {
    $, esc, store, toast, openModal, closeModal, APP_VER, AVATARS,
    showScreen, goHome: () => { showScreen('home'); renderHome(); },
    settings: () => settings
  };
  $('#vaultBtn').addEventListener('click', () => { if (window.WordVault) window.WordVault.open(); });

  renderHome();
  showScreen('home');
  if ('serviceWorker' in navigator && location.protocol.startsWith('http') && !/[?&]nosw\b/.test(location.search)) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').then(reg => { try { reg.update(); } catch (e) { /* ignore */ } }).catch(() => { /* offline install not available */ });
    });
    // v07c (JM, CD-21: 4.1): when a newer version has just installed itself, offer it at once instead of on the next open
    if (navigator.serviceWorker.controller) {
      let shown = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (shown) return;
        shown = true;
        const bar = document.createElement('button');
        bar.type = 'button'; bar.className = 'update-bar';
        bar.textContent = '✨ New version ready · tap to update';
        bar.addEventListener('click', () => { if (G && !G.over) save(); location.reload(); });
        document.body.appendChild(bar);
      });
    }
  }
})();
