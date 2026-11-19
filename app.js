/* Master Keys — user interface: the Lobby and CrossKeys, fka Clue Duel (v10: the Lobby with one card per game (🆕 New Game / ▶ Resume / ⚙ Setup), CrossKeys Setup screen, ⚙ Master Keys settings (Screen), ☰ back to the Lobby, How To Play split into the suite and each game; v09a: Night crossing-clue text, tile drawn in its cell at once + slow-drop recorder, game icons, code files renamed lockword.js / lockwords.js; v09: renamed Master Keys / CrossKeys / LockWord, names in names.js, LockWord Night look;
   v08r: mirrored top boxes (the Bot gets a per-TURN clock, names centered), long settings line wraps;
   v08q: Screen setting with Night (Charcoal), ⚙ "Changes now" / "From your next game", Letters in Hand 4–8 and changeable mid-game (next round), Full Hand +2 per tile, bigger hub, DONE under the hand on upright tablets, word progress on the clue card, drawn pictures, 1-letter picture captions;
   v08p: new top band (no clue bar; clocks by the scores, hub of buttons), floating turn messages, tap a clue for its card, orange ? and bars for missing letters and words, the Bot waits for your tap after red marks, the Bot's 2-second finish after your clock runs out, wide screens: names over avatars, wings for the buttons, big DONE under the grid;
   v08o: the Bot's own whole-game clock, the other side plays on alone when a clock runs out,
   "N min each (whole game)";
   v08n: the 3D look (candy-drop tiles, wells, clue plaques, floating penciled tiles that settle
   at Done, keycap buttons), arrow keys and Esc for zoom, "the Bot" in the game's wording;
   v08m: grid zoom (pinch, Ctrl + wheel, 🔍 focus, arrows, mini-map), reports wait for the red marks,
   no "didn't fit" notices, gold win frame, hatched Scan cells, ⚙ New game fixed;
   v08L: ⏭ pass chip + held 2nd-pass notice, 🔦 Scan, pale crossing clues, Results after the
   wrong-tile bounce, notices away from the wrong word, bigger bonus badge, ⚙ fits phones, clue popup fits, Space pauses;
   v08k: faster on phones, wrong tiles shown WordGrams-style until tapped, held clock-out notice,
   no row / column highlight, only open bonus cells pulse, lighter slots + darker rival red, louder countdown;
   v08j: grid colors, final-play view, clock-out final turn, menu defaults, phone two-finger drag) */
'use strict';
(() => {
  const APP_VER = 'v10'; // Project CP: shown as a pill beside the title and in the browser tab
  const NM = window.MK_NAMES || { suite: 'Master Keys', cross: 'CrossKeys', lock: 'LockWord' }; // v09: the game names (names.js)
  // v09a (JM CD-71: 1.2c, 1.3b): the two games' own icons, shown wherever the 🧩 / 🔐 emoji stood
  const GI = { cross: 'icons/crosskeys.svg', lock: 'icons/lockword.svg' };
  const gimg = (k, cls = 'gi') => `<img class="${cls}" src="${GI[k]}" alt="">`;
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
    { n: 'Rosie Rabbit', a: '🐰', b: 'Quick, and starting to hold tiles back. Easygoing: Bots at levels 4–7 play gentler than their puzzles.' },
    { n: 'Rusty Fox', a: '🦊', b: 'Sly. Hates leaving you an easy finish. Easygoing: Bots at levels 4–7 play gentler than their puzzles.' },
    { n: 'Kiko Koala', a: '🐨', b: 'Calm and steady. Rarely wastes a tile. Easygoing: Bots at levels 4–7 play gentler than their puzzles.' },
    { n: 'Luna Cat', a: '🐱', b: 'Waits patiently, then pounces on big words. Easygoing: Bots at levels 4–7 play gentler than their puzzles.' },
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

  // ---------- Sound effects (v08h; JM CD-39: 3.1; CD-41: 1.4, 1.4.1) ----------
  // Made in code with Web Audio (no sound files, so nothing to download and nothing to license). OFF by default:
  // the 🔇 / 🔊 button (menu, both games' headers) turns them on or off, remembered on this device ('cd.sound').
  // Soft, short sounds: tile lands, wrong tile thunk, word chime, coin clink, last-10-second ticks, PASS banner,
  // win and lose. Shared with LockWord through CDUI.sound.
  const sound = (() => {
    let on = store.get('cd.sound', false), ac = null, out = null, nbuf = null;
    function ctx() {
      if (!ac) {
        const A = window.AudioContext || window.webkitAudioContext;
        if (!A) return null;
        try { ac = new A(); } catch (e) { return null; }
        out = ac.createGain(); out.gain.value = 0.32; out.connect(ac.destination);
      }
      if (ac.state === 'suspended') { try { ac.resume(); } catch (e) { /* needs a tap first */ } }
      return ac;
    }
    // one note: frequency f (sliding to f2), starting at t, lasting d seconds, at volume v
    function tone(f, t, d, type, v, f2) {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = type || 'sine';
      o.frequency.setValueAtTime(f, t);
      if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(v, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g); g.connect(out);
      o.start(t); o.stop(t + d + 0.03);
    }
    // a short burst of filtered noise: the "click" of a wooden tile
    function knock(t, d, v, freq) {
      if (!nbuf) { nbuf = ac.createBuffer(1, Math.round(ac.sampleRate * 0.2), ac.sampleRate); const ch = nbuf.getChannelData(0); for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1; }
      const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
      s.buffer = nbuf; f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 1.2;
      g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      s.connect(f); f.connect(g); g.connect(out);
      s.start(t); s.stop(t + d + 0.02);
    }
    const arp = (t, notes, gap, d, type, v) => notes.forEach((f, i) => tone(f, t + i * gap, d, type, v));
    // v08i (JM CD-42: 1.5.2): a brass voice: two slightly detuned sawtooth waves through a filter that opens as the
    // note swells (a trumpet), or that opens and closes on each note (a muted "wah" trombone). vib = vibrato depth.
    function horn(f, t, d, v, o) {
      o = o || {};
      const g = ac.createGain(), flt = ac.createBiquadFilter();
      flt.type = 'lowpass'; flt.Q.value = o.q || 1;
      const lo = o.lo || 500, hi = o.hi || 2600, att = o.att || 0.03;
      flt.frequency.setValueAtTime(lo, t);
      if (o.wah) { flt.frequency.exponentialRampToValueAtTime(hi, t + Math.min(0.16, d * 0.4)); flt.frequency.exponentialRampToValueAtTime(lo, t + d); }
      else flt.frequency.exponentialRampToValueAtTime(hi, t + Math.min(0.25, d * 0.5));
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(v, t + att);
      g.gain.setValueAtTime(v, t + Math.max(att, d - 0.35));
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      flt.connect(g); g.connect(out);
      [0, 7].forEach(cents => {
        const os = ac.createOscillator();
        os.type = 'sawtooth'; os.frequency.setValueAtTime(f, t); os.detune.value = cents;
        if (o.vib) {
          const lfo = ac.createOscillator(), lg = ac.createGain();
          lfo.frequency.value = o.vibHz || 5.5; lg.gain.setValueAtTime(0, t); lg.gain.linearRampToValueAtTime(f * o.vib, t + Math.min(0.5, d * 0.6));
          lfo.connect(lg); lg.connect(os.frequency); lfo.start(t); lfo.stop(t + d + 0.05);
        }
        os.connect(flt); os.start(t); os.stop(t + d + 0.05);
      });
    }
    // faint applause: many small claps (short bursts of filtered noise) that swell and fade over d seconds
    function applause(t, d, v) {
      for (let i = 0; i < 90; i++) {
        const at = t + Math.random() * d, k = Math.sin(Math.PI * (at - t) / d); // louder in the middle
        knock(at, 0.025 + Math.random() * 0.03, v * (0.35 + 0.65 * k) * (0.5 + Math.random() * 0.5), 900 + Math.random() * 1800);
      }
    }
    const FX = {
      key: t => knock(t, 0.035, 0.35, 2600),                                         // a typed letter (LockWord)
      // v08i (JM CD-42: 1.5.3): 5 semitones lower than v08h (× 0.749)
      land: t => { knock(t, 0.05, 0.6, 1124); tone(194.8, t, 0.08, 'sine', 0.28, 127.4); }, // your tile lands in a cell
      opp: t => { knock(t, 0.045, 0.35, 1100); tone(200, t, 0.06, 'sine', 0.15, 140); }, // the rival pencils a tile in
      bounce: t => { tone(150, t, 0.16, 'triangle', 0.4, 95); tone(120, t + 0.12, 0.18, 'triangle', 0.3, 80); }, // wrong tile / not a word
      word: t => arp(t, [523.25, 659.25, 783.99, 1046.5], 0.075, 0.45, 'sine', 0.22),   // you finished a word
      oppword: t => arp(t, [392, 493.88], 0.09, 0.35, 'sine', 0.13),                    // the rival finished a word
      row: t => arp(t, [440, 554.37], 0.06, 0.18, 'triangle', 0.15),                    // a LockWord guess goes in
      coin: t => { tone(1318.5, t, 0.07, 'square', 0.05); tone(1975.5, t + 0.06, 0.28, 'square', 0.05); }, // coins earned
      spend: t => { tone(987.8, t, 0.06, 'triangle', 0.18); tone(659.3, t + 0.06, 0.14, 'triangle', 0.16); }, // coins spent
      // v08i (JM CD-42: 1.5.4): both 25 % louder; 10–6 s keeps its pitch; 5–1 s is a quick "tick-tock" pair each
      // second: a new, higher tick, then the 10–6 s tone
      // v08k (JM CD-46: 1.1; CD-47: 1.1b): the pair's first, higher note ("tick") ×2; its second note ("tock") and the
      // 10–6 s click (the same note) ×1.5
      tick: t => tone(1050, t, 0.03, 'square', 0.140625),                             // last 10–6 seconds
      tock: t => { tone(1575, t, 0.035, 'square', 0.3); tone(1050, t + 0.13, 0.03, 'square', 0.140625); }, // last 5–1 seconds
      pass: t => { tone(440, t, 0.2, 'triangle', 0.25); tone(349.2, t + 0.17, 0.3, 'triangle', 0.25); }, // PASS banner
      // v08i (JM CD-42: 1.5.2): win = brass "Ta-DAAAH" (2.5 s) over faint applause
      win: t => {
        [392, 493.88, 587.33].forEach(f => horn(f, t, 0.17, 0.07, { lo: 700, hi: 2400 }));                       // "Ta"
        [261.63, 523.25, 659.25, 783.99].forEach(f => horn(f, t + 0.2, 2.3, 0.065, { lo: 600, hi: 3000, att: 0.06, vib: 0.006 })); // "DAAAH"
        applause(t + 0.25, 2.25, 0.09);
      },
      // loss = muted trombone "wah-wah-wah-waaah": three short falling notes, then a long wobbling one
      lose: t => {
        [[233.08, 0, 0.36], [220, 0.4, 0.36], [207.65, 0.8, 0.36]].forEach(([f, s, d]) => horn(f, t + s, d, 0.12, { wah: 1, lo: 320, hi: 1300, q: 4 }));
        horn(196, t + 1.2, 1.3, 0.12, { wah: 1, lo: 300, hi: 1200, q: 4, vib: 0.025, vibHz: 6 });
      },
      draw: t => arp(t, [440, 440], 0.16, 0.3, 'sine', 0.15),
      on: t => arp(t, [659.25, 987.8], 0.07, 0.15, 'sine', 0.18)                       // sound just turned on
    };
    const last = {};
    function play(name, delay) {
      if (!on || document.hidden || !FX[name]) return;
      const now = Date.now();
      if (last[name] && now - last[name] < 45) return; // never stack the same sound
      last[name] = now;
      const a = ctx(); if (!a) return;
      try { FX[name](a.currentTime + 0.01 + (delay || 0)); } catch (e) { /* ignore */ }
    }
    function paint() {
      document.querySelectorAll('[data-snd]').forEach(b => {
        b.textContent = on ? '🔊' : '🔇';
        b.title = on ? 'Sound is on: tap to mute' : 'Sound is off: tap to turn it on';
        b.setAttribute('aria-label', b.title);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }
    function set(v) { on = !!v; store.set('cd.sound', on); paint(); if (on) { ctx(); play('on'); } }
    // browsers start audio only after a tap: wake it on the first tap when sound is on
    document.addEventListener('pointerdown', () => { if (on) ctx(); }, true);
    document.addEventListener('click', e => {
      const b = e.target && e.target.closest && e.target.closest('[data-snd]');
      if (!b) return;
      set(!on);
      toast(on ? '🔊 Sound on' : '🔇 Sound off', '', 1400);
    });
    return { play, set, paint, get on() { return on; } };
  })();

  // ---------- Coins (v08; JM CD-13: 5a, 5.3.1; CD-18: 8.1; CD-26: 3.1): ONE currency for both games ----------
  // Spent on: Hint, Place and +30s in CrossKeys (instead of points), and LockWord's Hint.
  // Earned by: speed (1 coin per second left on a timed clock, on turns that place tiles; never in untimed games),
  // winning a CrossKeys game, and solving a LockWord word. Kept on this device (localStorage 'cd.coins').
  const COIN = { start: 100, win: 10, perTile: 20, vaultLetter: 2, vaultSpare: 2 };
  const SCAN_PER_TILE = 2; // v08L (JM CD-50: 7.2.1): 🔦 Scan costs 🪙2 per tile still in your hand
  const coinData = Object.assign({ bal: COIN.start, earned: 0, spent: 0, log: [] }, store.get('cd.coins', {}));
  const coins = {
    get bal() { return coinData.bal; },
    // n > 0 earns, n < 0 spends; why = a short label for the coin history
    add(n, why) {
      n = Math.round(n || 0);
      if (!n) return 0;
      coinData.bal += n;
      if (n > 0) coinData.earned += n; else coinData.spent -= n;
      coinData.log.unshift([Date.now(), n, String(why || '')]);
      if (coinData.log.length > 12) coinData.log.length = 12;
      store.set('cd.coins', coinData);
      renderCoins();
      sound.play(n > 0 ? 'coin' : 'spend'); // v08h
      return n;
    },
    // true when paid; otherwise a toast explains and nothing is spent
    spend(n, why) {
      if (coinData.bal < n) { toast(`Not enough coins: ${why} costs 🪙${n}, you have 🪙${coinData.bal}`, 'bad', 2800); return false; }
      coins.add(-n, why);
      return true;
    }
  };
  const coinPill = () => `<button type="button" class="coin-pill" data-coinbtn title="Your coins: tap for details"><span aria-hidden="true">🪙</span><b data-coins>${coinData.bal}</b></button>`;
  function renderCoins() { document.querySelectorAll('[data-coins]').forEach(el => { el.textContent = coinData.bal; }); }
  function coinWindow() {
    const when = t => { const m = Math.round((Date.now() - t) / 60000); return m < 1 ? 'just now' : m < 60 ? m + ' min ago' : m < 1440 ? Math.round(m / 60) + ' h ago' : Math.round(m / 1440) + ' d ago'; };
    openModal(`<h2>🪙 Coins: ${coinData.bal}</h2>
      <p class="help-note">One currency for ${NM.cross} and ${NM.lock}. Earned ${coinData.earned} · spent ${coinData.spent} on this device.</p>
      <ul class="coin-how">
        <li><b>Spend:</b> 💡 Hint ${E.RULES.hintCost}, 🔦 Scan ${SCAN_PER_TILE} per tile, 🎯 Place = the tile's value, ☑️ Check ${E.RULES.checkBase} + ${E.RULES.checkPerWrong} per wrong tile, ⏱️ +30s ${E.RULES.timeCost} (${NM.cross}); 🔎 Hint 5, 💡 Reveal 40 ÷ letters (${NM.lock}).</li>
        <li><b>Speed coins:</b> in timed games, 1 coin for every second left on your clock when you end a turn that placed tiles. Up to ${COIN.perTile} per tile placed, with no cap when you place every tile in your hand. Untimed games pay no speed coins; time bought with +30s doesn't count.</li>
        <li><b>Whole-game clocks</b> pay at the end: your clock is shared evenly among your turns, and each turn pays the seconds it saved from its share, by the rule above.</li>
        <li><b>Win a ${NM.cross} game:</b> +${COIN.win}.</li>
        <li><b>Solve a ${NM.lock} word:</b> ${COIN.vaultLetter} per letter, ${COIN.vaultSpare} per guess to spare, plus speed coins in timed rounds (up to ${COIN.perTile} per letter).</li>
      </ul>
      ${coinData.log.length ? `<h3>Latest</h3><table class="score-table coin-log">${coinData.log.map(([t, n, w]) => `<tr><td>${esc(w)}<small> · ${when(t)}</small></td><td class="${n < 0 ? 'neg' : 'pos'}">${n < 0 ? '−' + -n : '+' + n}</td></tr>`).join('')}</table>` : ''}
      <div class="row"><button class="btn primary" data-a="ok">Close</button></div>`);
    $('#sheet').onclick = e => { if (e.target.closest('[data-a]')) closeModal(); };
  }
  document.addEventListener('click', e => {
    if (!(e.target && e.target.closest && e.target.closest('[data-coinbtn]'))) return;
    if (G && !G.over && !$('#game').hidden && E.timerOf(G.settings.timer).kind !== 'none') setPaused(true);
    coinWindow();
  });
  // v08j (JM CD-44: 2.1; CD-45: 2.1a): GRID COLORS, five schemes (a CSS class on #board; looks only, never the rules)
  const GRID_SCHEMES = [['a', 'Board'], ['a2', 'Inked'], ['a3', 'Inked Blue'], ['a4', 'Painted'], ['b', 'Bold']];
  function gridCls(g) {
    if (!GRID_SCHEMES.some(s => s[0] === g)) g = 'a';
    return `board gs-${g}${g[0] === 'a' ? ' gs-slots' : ''}${g === 'a2' || g === 'a3' ? ' gs-ink' : ''}`;
  }
  const gridOpts = () => GRID_SCHEMES.map(([v, n]) => `<option value="${v}">${n}</option>`).join('');
  // a five-cell sample: starter · yours · rival's · empty · this turn's tile
  const gridSample = g => `<span class="${gridCls(g)} gs-sample" aria-hidden="true"><span class="cell let filled pre"><span class="ch">T</span></span><span class="cell let filled mine"><span class="ch">E</span></span><span class="cell let filled theirs"><span class="ch">A</span></span><span class="cell let"></span><span class="cell let pending"><span class="ch">L</span></span></span>`;

  // v08q (JM CD-58 discussion 2; CD-59: 2.1c, 2.2, 2.3b): SCREEN = Auto (follows the device) / Light / Dark / Night.
  // The style sheet's light/dark rules are written as "prefers-color-scheme" blocks; Light and Dark switch those
  // blocks on or off from here, and Night is Dark plus the Charcoal colors (html[data-screen="night"] in style.css).
  const SCREENS = ['auto', 'light', 'dark', 'night'];
  let schemeRules = null;
  function applyScreen(v) {
    if (!SCREENS.includes(v)) v = 'auto';
    if (!schemeRules) {
      schemeRules = [];
      const walk = rules => { for (const r of rules) { if (r.media && /prefers-color-scheme/.test(r.media.mediaText)) schemeRules.push([r, r.media.mediaText]); else if (r.cssRules) walk(r.cssRules); } };
      for (const sh of document.styleSheets) { try { walk(sh.cssRules); } catch (e) { /* another site's sheet */ } }
    }
    const dark = v === 'dark' || v === 'night';
    for (const [r, txt] of schemeRules) {
      let t = txt;
      if (v !== 'auto') t = txt.replace(/\(\s*prefers-color-scheme:\s*dark\s*\)/g, dark ? '(min-width: 0px)' : '(max-width: 0px)')
        .replace(/\(\s*prefers-color-scheme:\s*light\s*\)/g, dark ? '(max-width: 0px)' : '(min-width: 0px)');
      if (r.media.mediaText !== t) { try { r.media.mediaText = t; } catch (e) { /* old browser: Auto only */ } }
    }
    document.documentElement.dataset.screen = v;
    const m = document.querySelector('meta[name="theme-color"]');
    if (m) m.content = v === 'night' ? '#121212' : '#2b3a4a';
  }

  // v08j (JM CD-44 discussion 1; CD-45: 4.1c): MENU DEFAULTS in three layers.
  //  1. FACTORY: built into the app.
  //  2. OWNER: defaults.json beside the app (JM edits it on GitHub's website). New players start with it; it is fetched
  //     on every visit, kept on the device (cd.ownerDefaults) and checked value by value (a typo is simply ignored).
  //  3. MINE: ⭐ Save as my defaults (cd.myDefaults). ↺ Defaults brings back yours, or the app's if you never saved any.
  // The menu still remembers your last choices (cd.settings), as before.
  const FACTORY = { skill: 3, size: 'M', hand: 6, timer: '0', scoring: 'classic', bonus: 'floating', pics: 'some', grid: 'a', screen: 'auto' };
  const DEF_KEYS = Object.keys(FACTORY);
  function cleanDefaults(o) {
    const out = {};
    if (!o || typeof o !== 'object') return out;
    const vals = id => { const s = document.querySelector(id); return s ? [...s.options].map(x => x.value) : []; };
    const ok = { skill: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], size: ['S', 'M', 'L'], hand: [4, 5, 6, 7, 8], timer: vals('#timerSel'), scoring: vals('#scoringSel'),
      bonus: vals('#bonusSel'), pics: vals('#picsSel'), grid: GRID_SCHEMES.map(s => s[0]), screen: SCREENS };
    for (const k of DEF_KEYS) {
      if (!(k in o)) continue;
      const v = k === 'skill' || k === 'hand' ? +o[k] : String(o[k]).trim();
      if (ok[k].includes(v)) out[k] = v;
    }
    return out;
  }
  const ownerDefaults = () => cleanDefaults(store.get('cd.ownerDefaults', {}));
  const settings = Object.assign({}, FACTORY, ownerDefaults(), { name: '', avatar: '🙂' }, store.get('cd.settings', {}));
  if (typeof settings.timer === 'number') settings.timer = settings.timer > 0 ? 't' + settings.timer : '0'; // v01 settings
  applyScreen(settings.screen); // v08q
  let G = null; // engine state of the current game
  const ui = {
    pending: [], selTile: null, selSlot: -1, selCell: -1, busy: false, hintCell: -1, timerId: 0, cell: 40, token: 0,
    aiPending: null, flash: null, pop: -1, dragging: false, noClickUntil: 0, sheetOpen: false, layoutKey: '',
    left: 0, lastTick: 0, paused: false, chainBroken: false, sortK: -1,
    passHold: 0, passSeen: 0 // v08d: the PASS banner holds the game until tapped (passSeen = the pass count it last held for)
  };
  document.title = `${NM.suite} · ${APP_VER}`;
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
    $('#gridSel').value = GRID_SCHEMES.some(s => s[0] === settings.grid) ? settings.grid : 'a';
    $('#gridSample').innerHTML = gridSample($('#gridSel').value);
    // v08h (JM CD-41: 1.1): the folded Options row shows its five choices in one line
    const txt = id => { const s = $(id); return s.selectedIndex >= 0 ? s.options[s.selectedIndex].text : ''; };
    const tmr = txt('#timerSel').replace(/^Blitz · /, '').replace(/ per TURN$/, '/turn').replace(/ min each \(whole game\)$/, ' min each');
    // v08i (JM CD-42: 1.1.2): two full rows of boxes, one box per option
    const no = (s, w) => (s === 'Off' ? 'No ' : s + ' ') + w;
    const box = s => `<span class="ob">${esc(s)}</span>`;
    $('#optsSum').innerHTML = `<span class="ob-row">${[txt('#handSel'), no(txt('#picsSel'), 'pics'), tmr].map(box).join('')}</span>` +
      `<span class="ob-row">${[no(txt('#bonusSel'), 'bonus'), txt('#scoringSel')].map(box).join('')}</span>`;
    $('#optsBox').open = !!settings.optsOpen;
    fitOpts();
    $('#myAv').innerHTML = myAv();
    if (document.activeElement !== $('#myName')) $('#myName').value = settings.name || '';
    renderLobby(store.get('cd.save', null));
    if (!$('#homeCoins').firstChild) $('#homeCoins').innerHTML = coinPill(); // v08
    renderCoins();
  }
  // v10 (JM CD-76: 3.2; CD-79: 1.2.1): the Lobby's game cards and the CrossKeys Setup stats row.
  // Played / Won come from the all-time record (cd.stats); streaks and the top score from Game History (last 100).
  function ckRecord() {
    const st = store.get('cd.stats', {});
    let n = 0, w = 0;
    for (const k in st) { const r = st[k] || {}; w += r.w || 0; n += (r.w || 0) + (r.l || 0) + (r.d || 0); }
    let streak = 0, best = 0, run = 0, cur = true, top = 0;
    for (const h of hist.list()) {
      if (h.g !== 'duel') continue;
      if (h.win) { run++; best = Math.max(best, run); if (cur) streak++; } else { run = 0; cur = false; }
      const s = parseInt(String(h.score || ''), 10);
      if (s > top) top = s;
    }
    return { n, w, pct: n ? Math.round(100 * w / n) : 0, streak, best, top };
  }
  const recBoxes = a => a.map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`).join('');
  const statBoxes = a => a.map(([v, l]) => `<div class="vt-st"><b>${v}</b><span>${l}</span></div>`).join('');
  function renderLobby(saved) {
    const unf = !!(saved && !saved.over && saved.settings);
    const r = ckRecord();
    $('#ckRec').innerHTML = recBoxes([[r.n, 'Played'], [r.n ? r.pct + '%' : '–', 'Won'], [r.top || '–', 'Top score']]);
    $('#ckStats').innerHTML = r.n ? statBoxes([[r.n, 'Played'], [r.pct + '%', 'Won'], [r.streak, 'Streak'], [r.best, 'Best streak'], [r.top || '–', 'Top score']])
      : '<p class="vt-none">No games played yet. Pick your settings and start.</p>';
    let ut = '';
    if (unf) { const so = OPP[(saved.settings.skill || 1) - 1] || OPP[0]; const sc = saved.scores || [0, 0]; ut = `Unfinished game vs ${so.n} [${saved.settings.skill}] · You ${sc[0]} – ${sc[1]}`; }
    $('#resumeBtn').hidden = !unf; $('#ckUnf').hidden = !unf; $('#ckUnf').textContent = ut;
    $('#ckSetUnf').hidden = !unf; $('#ckSetUnfTxt').textContent = ut;
    $('#ckNewBtn').classList.toggle('primary', !unf);
    $('#startBtn').textContent = unf ? '🆕 New game' : `▶ Start ${NM.cross}`;
    const o = OPP[settings.skill - 1], sz = { S: 'Small', M: 'Medium', L: 'Large' }[settings.size] || '';
    $('#ckLast').textContent = `🆕 New Game uses your last settings: ${o.n} [${settings.skill}] · ${sz} grid`;
    const L = window.WordVault && window.WordVault.lobby ? window.WordVault.lobby() : null;
    if (L) {
      $('#lwRec').innerHTML = recBoxes([[L.played, 'Played'], [L.played ? L.pct + '%' : '–', 'Solved'], [L.streak, 'Streak']]);
      $('#lwResumeBtn').hidden = !L.unf; $('#lwUnf').hidden = !L.unf; $('#lwUnf').textContent = L.unf;
      $('#lwNewBtn').classList.toggle('primary', !L.unf);
      $('#lwLast').textContent = `🆕 New Game uses your last settings: ${L.last}`;
    }
  }
  // v08i: the option boxes use the full size (+50 %) where they fit, and shrink only as much as a narrow phone needs
  function fitOpts() {
    const sum = $('#optsSum');
    if (!sum || $('#ckSetup').hidden || $('#optsBox').open) return;
    let fs = 18.75;
    sum.style.fontSize = fs + 'px';
    const over = () => [...sum.children].some(r => r.scrollWidth > r.clientWidth + 1);
    while (fs > 12 && over()) { fs -= 0.5; sum.style.fontSize = fs + 'px'; }
  }
  window.addEventListener('resize', fitOpts);
  function saveSettings() { store.set('cd.settings', settings); renderHome(); }

  $('#skillSel').addEventListener('change', e => { settings.skill = +e.target.value; saveSettings(); });
  $('#sizeSeg').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { settings.size = b.dataset.v; saveSettings(); } });
  $('#handSel').addEventListener('change', e => { settings.hand = +e.target.value; saveSettings(); });
  $('#bonusSel').addEventListener('change', e => { settings.bonus = e.target.value; saveSettings(); });
  $('#picsSel').addEventListener('change', e => { settings.pics = e.target.value; saveSettings(); });
  $('#timerSel').addEventListener('change', e => { settings.timer = e.target.value; saveSettings(); });
  $('#scoringSel').addEventListener('change', e => { settings.scoring = e.target.value; saveSettings(); });
  // v08j: grid colors and the defaults buttons, at the foot of the open Options panel
  $('#gridSel').innerHTML = gridOpts();
  $('#gridSel').addEventListener('change', e => { settings.grid = e.target.value; saveSettings(); });
  // v10 (JM CD-79: 1.3): Screen lives in ⚙ Master Keys settings in the Lobby (it changes every game); ⚙ in CrossKeys keeps a copy
  const SCREEN_OPTS = '<option value="auto">Auto (follows your device)</option><option value="light">Light</option><option value="dark">Dark</option><option value="night">Night (dimmest)</option>';
  function suiteSettings() {
    openModal(`<h2>⚙ ${NM.suite} settings</h2>
      <label class="field"><span class="lbl">Screen</span><select id="mkScreen">${SCREEN_OPTS}</select></label>
      <p class="help-note"><b>Auto</b> follows your device's light or dark setting; <b>Light</b> and <b>Dark</b> stay put; <b>Night</b> is the dimmest look, for playing in the dark. It changes every game at once.</p>
      <div class="row"><button class="btn primary" data-a="close">Close</button></div>`);
    const s = $('#mkScreen');
    s.value = SCREENS.includes(settings.screen) ? settings.screen : 'auto';
    s.addEventListener('change', () => { settings.screen = s.value; saveSettings(); applyScreen(settings.screen); });
    $('#sheet').onclick = e => { if (e.target.closest('[data-a]')) closeModal(); };
  }
  $('#mkSetBtn').addEventListener('click', suiteSettings);
  $('#saveDefBtn').addEventListener('click', () => {
    const d = {};
    for (const k of DEF_KEYS) d[k] = settings[k];
    store.set('cd.myDefaults', d);
    toast('⭐ Saved as your defaults: ↺ Defaults brings them back', 'you', 2800);
  });
  $('#resetDefBtn').addEventListener('click', () => {
    const mine = store.get('cd.myDefaults', null);
    Object.assign(settings, FACTORY, ownerDefaults(), cleanDefaults(mine || {}));
    saveSettings();
    toast(mine ? '↺ Your defaults are back' : '↺ The app\'s defaults are back (you haven\'t saved your own yet)', '', 2800);
  });
  // the owner's defaults file (see FACTORY above); a brand-new player who hasn't changed anything starts with it at once
  if (location.protocol.startsWith('http')) {
    fetch('defaults.json?t=' + Date.now(), { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : null))
      .then(o => {
        if (!o) return;
        const d = cleanDefaults(o);
        store.set('cd.ownerDefaults', d);
        if (!store.get('cd.settings', null)) { Object.assign(settings, d); renderHome(); }
      })
      .catch(() => { /* offline: keep the copy from the last visit */ });
  }
  $('#myName').addEventListener('input', e => { settings.name = e.target.value.slice(0, 14); store.set('cd.settings', settings); });
  $('#myName').addEventListener('keydown', e => { if (e.key === 'Enter') e.target.blur(); });
  $('#myAv').addEventListener('click', pickAvatar);
  $('#optsBox').addEventListener('toggle', e => { if (!!settings.optsOpen !== e.target.open) { settings.optsOpen = e.target.open; store.set('cd.settings', settings); } fitOpts(); }); // v08h: remembered
  $('#howBtn').addEventListener('click', () => showHelp('suite')); // v10: the Lobby's ? = How To Play Master Keys
  $('#histBtn').addEventListener('click', () => showHistory()); // v08c (CD-30: 4.5)
  $('#startBtn').addEventListener('click', startNewGame);
  $('#resumeBtn').addEventListener('click', resumeGame);
  // v10: the Lobby's CrossKeys card, and the CrossKeys Setup screen
  function openCkSetup() { showScreen('cksetup'); renderHome(); $('#ckSetup').scrollTop = 0; fitOpts(); }
  $('#ckNewBtn').addEventListener('click', startNewGame);
  $('#ckSetupBtn').addEventListener('click', openCkSetup);
  $('#ckSetResume').addEventListener('click', resumeGame);
  $('#ckMenu').addEventListener('click', () => { showScreen('home'); renderHome(); });
  $('#ckHelp').addEventListener('click', () => showHelp('cross'));
  // tapping a card anywhere outside its buttons opens that game's Setup screen
  $('#ckCard').addEventListener('click', e => { if (!e.target.closest('button')) openCkSetup(); });
  $('#lwCard').addEventListener('click', e => { if (!e.target.closest('button') && window.WordVault) window.WordVault.setup(); });
  $('#lwResumeBtn').addEventListener('click', () => { if (window.WordVault) window.WordVault.open(); });
  $('#lwNewBtn').addEventListener('click', () => { if (window.WordVault) window.WordVault.newGame(); });

  // v08i (JM CD-42 add'l 1): LockWord's longer icon list plus your own picture (shrunk to a 128 px square, kept on
  // this device). The rivals' animals stay out, so you never look like your opponent.
  const AV_MORE = ['🛡️', '🏆', '🥇', '🎖️', '🔮', '🧭', '🗺️', '🏰', '⚔️', '🕵️', '🐺', '🦅', '🐧', '🧠', '✨', '⚡', '🌟', '🎓', '✏️', '🖋️',
    '🔍', '🧪', '🎹', '🎮', '🕹️', '🏝️', '🌋', '⛰️', '🍩', '🍓', '🍉', '🎃', '🔑', '🗝️', '🧩', '🎁'];
  const AV_LIB = [...new Set(AVATARS.concat(AV_MORE))].filter(a => !OPP.some(o => o.a === a));
  function myAv() { return settings.avatar === 'custom' && settings.avPic ? `<img class="av-img" src="${settings.avPic}" alt="">` : esc(settings.avatar); }
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
  function pickAvatar() {
    openModal(`<h2>Choose your avatar</h2>
      <div class="vt-upl"><button type="button" class="btn" data-a="upload">📷 Upload your own picture</button>
        ${settings.avPic ? `<button type="button" data-av="custom" class="vt-mine ${settings.avatar === 'custom' ? 'on' : ''}" title="Your picture"><img src="${settings.avPic}" alt="Your picture"></button>` : ''}
        <input type="file" id="avFile" accept="image/*" hidden></div>
      <div class="av-grid">${AV_LIB.map(a => `<button type="button" data-av="${a}" class="${a === settings.avatar ? 'on' : ''}">${a}</button>`).join('')}</div>
      <div class="row"><button class="btn" data-a="close">Cancel</button></div>`);
    $('#avFile').addEventListener('change', e => {
      const f = e.target.files && e.target.files[0]; if (!f) return;
      shrinkPicture(f, url => {
        const old = { avatar: settings.avatar, avPic: settings.avPic };
        settings.avPic = url; settings.avatar = 'custom';
        try { localStorage.setItem('cd.settings', JSON.stringify(settings)); } catch (err) { Object.assign(settings, old); toast('Not enough room to save that picture', 'bad'); return; }
        $('#sheet').onclick = null;
        renderHome(); closeModal(); toast('Your picture is set');
      });
    });
    $('#sheet').onclick = e => {
      const b = e.target.closest('[data-av],[data-a]');
      if (!b) return;
      if (b.dataset.a === 'upload') { $('#avFile').click(); return; }
      $('#sheet').onclick = null;
      if (b.dataset.av) { settings.avatar = b.dataset.av; saveSettings(); }
      closeModal();
    };
  }

  function showScreen(id) {
    $('#home').hidden = id !== 'home'; // v10: 'home' = the Lobby
    $('#ckSetup').hidden = id !== 'cksetup'; // v10: CrossKeys Setup
    $('#game').hidden = id !== 'game';
    $('#vault').hidden = id !== 'vault'; // v07c: LockWord
    if (id === 'home') { const vs = store.get('cd.vault.settings', {}); { const n = (vs.name || '').trim(); $('#vaultBtnName').textContent = n && n !== 'Word Vault' ? n : NM.lock; } const ico = $('#vaultBtnIco'); if (vs.icon === 'custom' && vs.custom) ico.innerHTML = `<img src="${vs.custom}" alt="">`; else { const ic = vs.icon && !(vs.icon === '🔐' && !vs.lwIco) ? vs.icon : 'lw'; if (ic === 'lw') ico.innerHTML = gimg('lock', ''); else ico.textContent = ic; } /* v09a: the LockWord icon is the default (the old default 🔐 moves to it once) */ fitOpts(); }
  }

  async function startNewGame() {
    const saved = store.get('cd.save', null);
    if (saved && !saved.over) {
      const ok = await confirmBox('Start a new game?', 'Your unfinished game will be lost.', 'Start new', 'Cancel');
      if (!ok) return;
    }
    openModal('<div class="loading">Building your puzzle…</div>', '', { close: false });
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
    resetZoom(); // v08m: every game starts with the whole grid
    checkPics();
    Object.assign(ui, { pending: [], selTile: null, selSlot: -1, selCell: -1, busy: false, hintCell: -1, repAt: 0, aiPending: null, flash: null, wrong: null, pop: -1, layoutKey: '', chainBroken: false, passHold: 0, passSeen: G.passes || 0 });
    setPaused(false);
    showScreen('game');
    clearReports();
    $('#oppNm').textContent = `${opp().n} [${G.settings.skill}]`; // v08b (JM CD-27 add'l 1): the rival's Challenge Level
    $('#oppAv').textContent = opp().a;
    $('#myNm').textContent = myName();
    $('#myAvTop').innerHTML = myAv();
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
    const base = Math.max(18, Math.floor(Math.min((w - frame - (C - 1)) / C, (h - frame - (R - 1)) / R, 120)));
    // v08p (JM iPad 1.5.1): on wide screens the grid area is only as tall as a width-limited grid needs, so the hand
    // sits right under the grid and the two are centered together (the spare height goes above and below them)
    const bw = Math.max(18, Math.floor(Math.min((w - frame - (C - 1)) / C, 120)));
    const mh = getComputedStyle($('#sideYou')).display !== 'none' ? Math.ceil(bw * R + frame + (R - 1) + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)) + 'px' : '';
    if (wrap.style.maxHeight !== mh) wrap.style.maxHeight = mh;
    ui.baseCell = base;
    // v08m: zoomed, the cells are drawn bigger (crisp, not a scaled picture) and the grid scrolls inside #zoomer
    const zf = Math.min(zm.z, zMax());
    const cell = zf > 1 ? Math.round(base * zf) : base;
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

  // =====================================================================
  // v08m (JM CD-49 add'l 1; CD-50: 6.1c, 6.2; CD-52: 1.1): grid zoom, CrossKeys only.
  // Free zoom: pinch (phones) or Ctrl + mouse wheel / trackpad pinch (computers); the point under your fingers (or
  // the pointer) stays put. Zoomed, drag the grid to slide it. Focus zoom: 🔍 (or Z), then tap the part of the grid to
  // zoom into. 🔍 while zoomed shows the whole grid again; 🔍 🔍 brings back your last view. Zoomed, edge arrows
  // slide the view and a mini-map shows where you are (tap or drag on it to jump). The cells are redrawn bigger, so
  // text stays crisp. + and − keys zoom in and out.
  // =====================================================================
  const ZOOM_CELL = 110; // the largest zoomed cell (px): big enough to read two clues in one clue cell
  const zm = { z: 1, last: null, pick: false, fadeT: 0, wheelT: 0, wz: 0, wa: null, sel: '' };
  const zoomer = $('#zoomer');
  const zoomBtnEl = $('#zoomBtn'); // kept by reference: the clue bar redraws its contents and re-adds it
  const zMax = () => Math.max(1, Math.min(3, ZOOM_CELL / (ui.baseCell || ZOOM_CELL)));
  const inGame = () => !!G && !$('#game').hidden;
  const zoomable = () => inGame() && zMax() >= 1.25; // also after the game, to review the words
  const clamp01 = v => Math.max(0, Math.min(1, v));
  // the part of the grid you can see (all of it unless zoomed)
  function visBoardRect() {
    const br = $('#board').getBoundingClientRect();
    if (zm.z <= 1) return br;
    const zr = zoomer.getBoundingClientRect();
    const left = Math.max(br.left, zr.left), top = Math.max(br.top, zr.top), right = Math.min(br.right, zr.right), bottom = Math.min(br.bottom, zr.bottom);
    return { left, top, right, bottom, width: right - left, height: bottom - top };
  }
  // where on the grid (0–1 across and down) the middle of the view is
  function viewFrac() {
    const zr = zoomer.getBoundingClientRect(), br = $('#board').getBoundingClientRect();
    return { cx: clamp01((zr.left + zr.width / 2 - br.left) / br.width), cy: clamp01((zr.top + zr.height / 2 - br.top) / br.height) };
  }
  // zoom to z, putting grid point (fx, fy) at screen point (ax, ay) (default: the middle of the view)
  function setZoom(z, fx, fy, ax, ay) {
    if (!inGame()) return;
    z = Math.max(1, Math.min(zMax(), z));
    if (z < 1.05) z = 1;
    const zr = zoomer.getBoundingClientRect();
    if (fx == null) { const v = viewFrac(); fx = v.cx; fy = v.cy; }
    if (ax == null) { ax = zr.left + zr.width / 2; ay = zr.top + zr.height / 2; }
    zm.z = z;
    zoomer.classList.toggle('on', z > 1);
    ui.layoutKey = '';
    closeZoom(true);
    layout();
    renderBoard();
    const br = $('#board').getBoundingClientRect();
    zoomer.scrollLeft += br.left + fx * br.width - ax;
    zoomer.scrollTop += br.top + fy * br.height - ay;
    zoomChrome(true);
  }
  function centerOn(fx, fy, smooth) {
    const zr = zoomer.getBoundingClientRect(), br = $('#board').getBoundingClientRect();
    zoomer.scrollTo({ left: zoomer.scrollLeft + br.left + fx * br.width - (zr.left + zr.width / 2), top: zoomer.scrollTop + br.top + fy * br.height - (zr.top + zr.height / 2), behavior: smooth && !reduceMotion() ? 'smooth' : 'auto' });
  }
  function resetZoom() {
    Object.assign(zm, { z: 1, pick: false, sel: '' });
    zoomer.classList.remove('on', 'picking');
    zoomer.scrollLeft = 0; zoomer.scrollTop = 0;
    $('#board').style.transform = '';
  }
  // 🔍: whole grid ⇄ zoomed. From the whole grid, the next tap on the grid picks where to zoom (🔍 again: your last view).
  function zoomBtn() {
    if (!inGame()) return;
    if (zm.z > 1) { zoomOut(); return; }
    if (!zoomable()) return;
    if (zm.pick) {
      zm.pick = false;
      if (zm.last) { setZoom(zm.last.z, 0.5, 0.5); centerOn(zm.last.cx, zm.last.cy); zoomChrome(true); } else zoomChrome();
      return;
    }
    zm.pick = true;
    zoomChrome();
  }
  // the 🔍 button, the edge arrows, the "tap where to zoom" note and the mini-map follow the zoom
  function zoomChrome(wake) {
    const on = zm.z > 1 && inGame();
    const b = zoomBtnEl;
    b.hidden = !(on || zoomable());
    b.classList.toggle('on', on || zm.pick);
    $('#cluebar').classList.toggle('has-z', !b.hidden);
    b.title = on ? 'Show the whole grid (Z)' : zm.pick ? 'Tap the grid where you want to zoom in (🔍 again: your last view)' : 'Zoom in: then tap the part of the grid you want (Z). Or pinch / Ctrl + mouse wheel.';
    zoomer.classList.toggle('picking', zm.pick && !on);
    $('#zoomPick').hidden = !(zm.pick && !on);
    const L = zoomer.scrollLeft, T = zoomer.scrollTop;
    const mx = zoomer.scrollWidth - zoomer.clientWidth, my = zoomer.scrollHeight - zoomer.clientHeight;
    for (const a of document.querySelectorAll('.zarrow')) {
      const d = a.dataset.d;
      a.hidden = !on || (d === 'l' ? L < 2 : d === 'r' ? L > mx - 2 : d === 'u' ? T < 2 : T > my - 2);
    }
    drawMini(on, wake);
  }
  function drawMini(on, wake) {
    const cv = $('#miniMap');
    if (!on || !G) { cv.hidden = true; return; }
    const R = G.pz.R, C = G.pz.C;
    const k = Math.max(3, Math.floor((innerWidth < 700 ? 84 : 120) / Math.max(R, C)));
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    const W = C * k, H = R * k;
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); cv.style.width = W + 'px'; cv.style.height = H + 'px'; }
    const g = cv.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = '#1c2630'; g.fillRect(0, 0, W, H);
    const kids = $('#board').children;
    for (let i = 0; i < R * C; i++) {
      const el = kids[i];
      if (!el) continue;
      const c = el.classList;
      g.fillStyle = c.contains('clue') ? '#3a4552' : c.contains('pending') ? '#4f8df5' : c.contains('aipend') ? '#ff8a3d'
        : c.contains('filled') || el.querySelector('.ch') ? '#efe2b8' : '#8c96a1';
      g.fillRect((i % C) * k + 0.5, Math.floor(i / C) * k + 0.5, k - 1, k - 1);
    }
    const zr = zoomer.getBoundingClientRect(), br = $('#board').getBoundingClientRect();
    const x0 = clamp01((zr.left - br.left) / br.width) * W, x1 = clamp01((zr.right - br.left) / br.width) * W;
    const y0 = clamp01((zr.top - br.top) / br.height) * H, y1 = clamp01((zr.bottom - br.top) / br.height) * H;
    g.lineWidth = 2; g.strokeStyle = '#ffd60a';
    g.strokeRect(x0 + 1, y0 + 1, Math.max(4, x1 - x0 - 2), Math.max(4, y1 - y0 - 2));
    cv.hidden = false;
    if (wake) {
      cv.classList.remove('fade');
      clearTimeout(zm.fadeT);
      zm.fadeT = setTimeout(() => cv.classList.add('fade'), 2500);
    }
  }
  zoomBtnEl.addEventListener('click', e => { e.stopPropagation(); zoomBtn(); });
  zoomer.addEventListener('scroll', () => zoomChrome(true), { passive: true });
  for (const a of document.querySelectorAll('.zarrow')) a.addEventListener('click', e => {
    e.stopPropagation();
    const d = a.dataset.d, sx = zoomer.clientWidth * 0.7, sy = zoomer.clientHeight * 0.7;
    zoomer.scrollBy({ left: d === 'l' ? -sx : d === 'r' ? sx : 0, top: d === 'u' ? -sy : d === 'd' ? sy : 0, behavior: reduceMotion() ? 'auto' : 'smooth' });
  });
  // the mini-map: tap or drag on it to move the view there
  $('#miniMap').addEventListener('pointerdown', e => {
    e.stopPropagation(); e.preventDefault();
    const cv = $('#miniMap');
    const go = ev => { const r = cv.getBoundingClientRect(); centerOn(clamp01((ev.clientX - r.left) / r.width), clamp01((ev.clientY - r.top) / r.height)); };
    go(e);
    const mv = ev => go(ev);
    const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); suppressClick(); };
    window.addEventListener('pointermove', mv);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  });
  // pinch, drag-to-slide and the focus tap
  const zpts = new Map();
  let zpan = null, zpinch = null;
  zoomer.addEventListener('pointerdown', e => {
    if (!inGame()) return;
    if (zm.pick) {
      e.stopPropagation(); e.preventDefault();
      const br = $('#board').getBoundingClientRect();
      zm.pick = false;
      const z = zm.last ? zm.last.z : Math.min(zMax(), 2.2);
      setZoom(z, clamp01((e.clientX - br.left) / br.width), clamp01((e.clientY - br.top) / br.height));
      suppressClick();
      return;
    }
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.target.closest('.cell.pending') || ui.dragging) return; // penciled tiles drag as before
    zpts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (zpts.size === 2 && e.pointerType === 'touch' && (zm.z > 1 || zoomable())) {
      const [p, q] = [...zpts.values()];
      const m = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
      const br = $('#board').getBoundingClientRect();
      zpinch = { z0: zm.z, d0: Math.max(20, Math.hypot(p.x - q.x, p.y - q.y)), m0: m, m, zNow: zm.z, fx: (m.x - br.left) / br.width, fy: (m.y - br.top) / br.height, ox: m.x - br.left, oy: m.y - br.top };
      zpan = null;
      clearTimeout(zoom.timer); zoom.timer = 0; closeZoom(true);
      return;
    }
    if (zpts.size === 1 && zm.z > 1) zpan = { id: e.pointerId, x0: e.clientX, y0: e.clientY, L0: zoomer.scrollLeft, T0: zoomer.scrollTop, moved: false };
  }, true);
  window.addEventListener('pointermove', e => {
    if (zpts.has(e.pointerId)) zpts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (zpinch && zpts.size >= 2) {
      const [p, q] = [...zpts.values()];
      const m = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 };
      const z = Math.max(1, Math.min(zMax(), zpinch.z0 * Math.hypot(p.x - q.x, p.y - q.y) / zpinch.d0));
      zpinch.zNow = z; zpinch.m = m;
      const bd = $('#board');
      bd.style.transformOrigin = `${zpinch.ox}px ${zpinch.oy}px`;
      bd.style.transform = `translate(${m.x - zpinch.m0.x}px, ${m.y - zpinch.m0.y}px) scale(${z / zpinch.z0})`;
      return;
    }
    if (zpan && e.pointerId === zpan.id) {
      const dx = e.clientX - zpan.x0, dy = e.clientY - zpan.y0;
      if (!zpan.moved && Math.hypot(dx, dy) < 8) return;
      if (!zpan.moved) { zpan.moved = true; clearTimeout(zoom.timer); zoom.timer = 0; closeZoom(true); }
      zoomer.scrollLeft = zpan.L0 - dx; zoomer.scrollTop = zpan.T0 - dy;
    }
    // dragging a tile near the edge of a zoomed grid slides the view
    if (ui.dragging && zm.z > 1) {
      const zr = zoomer.getBoundingClientRect(), E2 = 30, sp = 10;
      if (e.clientX > zr.left - 20 && e.clientX < zr.right + 20 && e.clientY > zr.top - 20 && e.clientY < zr.bottom + 20) {
        const dx = e.clientX < zr.left + E2 ? -sp : e.clientX > zr.right - E2 ? sp : 0;
        const dy = e.clientY < zr.top + E2 ? -sp : e.clientY > zr.bottom - E2 ? sp : 0;
        if (dx || dy) zoomer.scrollBy(dx, dy);
      }
    }
  });
  const zEnd = e => {
    zpts.delete(e.pointerId);
    if (zpinch && zpts.size < 2) {
      const p = zpinch; zpinch = null;
      $('#board').style.transform = '';
      if (Math.abs(p.zNow - p.z0) > 0.02 || Math.hypot(p.m.x - p.m0.x, p.m.y - p.m0.y) > 4) setZoom(p.zNow, p.fx, p.fy, p.m.x, p.m.y);
      suppressClick();
      zpts.clear();
    }
    if (zpan && e.pointerId === zpan.id) { if (zpan.moved) suppressClick(); zpan = null; }
  };
  window.addEventListener('pointerup', zEnd);
  window.addEventListener('pointercancel', zEnd);
  // Ctrl + mouse wheel (and a trackpad pinch, which arrives as one) zooms at the pointer; the plain wheel scrolls
  zoomer.addEventListener('wheel', e => {
    if (!e.ctrlKey || !inGame()) return;
    e.preventDefault();
    if (zm.z <= 1 && !zoomable()) return;
    zm.pick = false;
    const f = Math.exp(-e.deltaY * (e.deltaMode ? 0.06 : 0.0025));
    zm.wz = Math.max(1, Math.min(zMax(), (zm.wz || zm.z) * f));
    zm.wa = { x: e.clientX, y: e.clientY };
    if (!zm.wheelT) zm.wheelT = setTimeout(() => {
      zm.wheelT = 0;
      const br = $('#board').getBoundingClientRect(), a = zm.wa;
      const z = zm.wz; zm.wz = 0;
      setZoom(z, clamp01((a.x - br.left) / br.width), clamp01((a.y - br.top) / br.height), a.x, a.y);
    }, 60);
  }, { passive: false });
  // keys: Z = 🔍, + and − (or ↑ and ↓) zoom in and out, ← and → slide a zoomed grid sideways, Esc leaves zoom
  // (v08n, JM CD-53: 1.2.1.1–1.2.1.2: the arrow keys and Esc)
  function zoomOut() { const v = viewFrac(); zm.last = { z: zm.z, cx: v.cx, cy: v.cy }; zm.pick = false; setZoom(1, 0.5, 0.5); }
  document.addEventListener('keydown', e => {
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || !inGame() || !$('#modal').hidden || /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName || '')) return;
    if (e.key === 'z' || e.key === 'Z') { e.preventDefault(); zoomBtn(); }
    else if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && e.shiftKey) { // v08n (CD-54: 1.2): Shift + ↑ / ↓ slide a zoomed grid up and down
      e.preventDefault();
      if (zm.z > 1) zoomer.scrollBy({ top: (e.key === 'ArrowUp' ? -1 : 1) * zoomer.clientHeight * 0.35, behavior: reduceMotion() ? 'auto' : 'smooth' });
    }
    else if (e.key === '+' || e.key === '=' || e.key === 'ArrowUp') { e.preventDefault(); zm.pick = false; if (zoomable() || zm.z > 1) setZoom(zm.z * 1.3); }
    else if (e.key === '-' || e.key === '_' || e.key === 'ArrowDown') { e.preventDefault(); if (zm.z > 1) setZoom(zm.z / 1.3); }
    else if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && zm.z > 1) {
      e.preventDefault();
      zoomer.scrollBy({ left: (e.key === 'ArrowLeft' ? -1 : 1) * zoomer.clientWidth * 0.35, behavior: reduceMotion() ? 'auto' : 'smooth' });
    }
    else if (e.key === 'Escape' && (zm.pick || zm.z > 1)) { e.preventDefault(); if (zm.z > 1) zoomOut(); else { zm.pick = false; zoomChrome(); } }
  });
  // zoomed: a newly chosen cell is slid into view
  function zoomFollow() {
    if (zm.z <= 1 || !G) return;
    const key = ui.selCell + ':' + ui.selSlot;
    if (key === zm.sel) return;
    zm.sel = key;
    const ci = ui.selCell >= 0 ? ui.selCell : ui.selSlot >= 0 ? G.pz.slots[ui.selSlot].cells[0] : -1;
    const el = ci >= 0 ? $('#board').children[ci] : null;
    if (el) el.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: reduceMotion() ? 'auto' : 'smooth' });
  }


  // ---------- Bottom row (JM, CD-8: 2.1.1.1; CD-9: 2.1) ----------
  // Hand and buttons always share one row. If that would squeeze the tiles below 40 px (phones), the row becomes
  // tiles + Done + ⋯ More, and the other buttons open from More; your clock then shows under your score.
  // v08p (JM iPad 1.5.3; CD-57: 4.4a): on wide screens (tablets, computers) Swap / Shuffle / Pause stack at the foot of
  // the left wing and the coin buttons at the foot of the right wing; the hand and a big DONE stay under the grid.
  // On phones they go back into the ⋯ More pop-up.
  const CTL_ORDER = ['hintBtn', 'scanBtn', 'placeBtn', 'checkBtn', 'timeBtn', 'swapBtn', 'mixBtn', 'pauseBtn'];
  function placeControls() {
    const wide = getComputedStyle($('#sideYou')).display !== 'none', pop = $('#morePop');
    for (const id of CTL_ORDER) {
      const b = $('#' + id);
      const dest = !wide ? pop : b.classList.contains('coinbtn') ? $('#wingR') : $('#wingL');
      if (b.parentNode !== dest) dest.appendChild(b);
    }
    $('#game').classList.toggle('wide', wide);
  }
  // v08p (CD-57: 1.2): on phones, tap either score for the Scoreboard
  for (const id of ['#plYou', '#plOpp']) $(id).addEventListener('click', e => { if (!G || e.target.closest('#clkTop') || isWide()) return; setSheetOpen(!ui.sheetOpen); });
  // v08q (JM CD-58 add'l 2): the hub's buttons as large as the room between the two scoreboards allows, with a clear
  // gap on each side (never touching a score or clock): 30–44 px on phones, up to 48 px on tablets and computers
  function fitHub() {
    const tb = $('.topbar'), hub = $('#hub'), you = $('#plYou'), op = $('#plOpp');
    if (!tb || !hub || !you || !op) return;
    const wide = getComputedStyle($('#sideYou')).display !== 'none';
    const cs = getComputedStyle(tb);
    const room = tb.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - you.offsetWidth - op.offsetWidth
      - 2 * (wide ? 30 : 12) - (wide ? 36 : 0);
    hub.style.setProperty('--hb', Math.max(28, Math.min(wide ? 48 : 44, room / 5.8)).toFixed(1) + 'px');
  }
  function fitDock() {
    if (!G || $('#game').hidden) return;
    placeControls(); // v08p
    const dock = $('#dock');
    dock.classList.remove('compact');
    const n = G.settings.hand, cs = getComputedStyle(dock);
    // (40 px spare: "Pass" grows to "Done · 3" during a turn)
    // v08q (CD-59: 1.4a): on upright tablets DONE sits under the hand, so the hand gets the full width, tiles up to grid size
    const below = cs.flexDirection === 'column';
    const cel = $('#board .cell');
    dock.style.setProperty('--tcell', Math.max(40, (cel && cel.offsetWidth) || ui.cell) + 'px');
    const avail = dock.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - (below ? 0 : $('#actions').offsetWidth + 40);
    const compact = (avail - 6 * (n - 1)) / n < 40;
    dock.classList.toggle('compact', compact);
    $('#game').classList.toggle('compact', compact);
    if (!compact) setMore(false);
    const tk = E.timerOf(G.settings.timer).kind;
    $('#clkTop').hidden = tk === 'none'; // v08p (JM CD-56 add'l 1.1.1, iPad 1.1.1): your clock always shows beside your score in a timed game
    renderOppClock();
    fitHub(); // v08q: after the clocks are shown or hidden
    // v06c (JM, CD-18: 1.1): when tiles are narrow (under 48 px, on any device) and they show point values,
    // tiles grow taller and the value sits centered under the letter instead of crowding its corner
    const rack = $('#rack');
    const tw = (rack.clientWidth - (parseFloat(getComputedStyle(rack).columnGap) || 6) * (n - 1)) / n;
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
  // v08c: except a coin button's first (arming) tap, so the second tap can land
  $('#morePop').addEventListener('click', e => { const b = e.target.closest('button'); if (b && !b.classList.contains('armed')) setTimeout(() => setMore(false), 0); });
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
    // v08t: a spaced missing-letter word ("SAND _ ICH") is one word: it shrinks to fit rather than break across lines
    const words = tightBlanks(text).toUpperCase().split(/[ \t\r\n]+/).filter(Boolean);
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
  // v08q (JM CD-59/CD-60: 2.5a): drawn pictures, for things no emoji shows. The Lexicon names them "@name".
  const PIC_ART = {
    '@iceberg': '<svg class="art" viewBox="0 0 64 64" role="img" aria-label="iceberg"><rect x="0" y="25" width="64" height="39" rx="3" fill="#2f7fc1" opacity=".55"/>'
      + '<polygon points="9,25 55,25 61,41 49,58 25,61 5,47" fill="#bfe3f7" opacity=".85"/>'
      + '<polygon points="19,25 29,9 35,15 41,5 50,25" fill="#f4fbff" stroke="#8cc6e8" stroke-width="1.2"/>'
      + '<path d="M0 25h64" stroke="#e8f6ff" stroke-width="2"/><path d="M4 33q4-3 8 0t8 0M44 31q4-3 8 0t8 0" stroke="#e8f6ff" stroke-width="1.4" fill="none" opacity=".8"/></svg>'
  };
  const picHTML = p => PIC_ART[p] || p;
  // v08q (CD-59 comment, CD-60: 2.6): a picture for a 1-letter fill-in ("_OMATO" + 🍅) keeps its fill-in under it
  const capHTML = (s, px) => s.clue.cap ? `<span class="pcap" style="font-size:${px}px">${clueMarks(s.clue.t)}</span>` : '';
  // How wide a picture clue is, in "emoji widths" (letters and + − signs count less)
  const unitCache = new Map(); // v08k: measured once per picture
  function picUnits(pic) {
    if (PIC_ART[pic]) return 1;
    if (unitCache.has(pic)) return unitCache.get(pic);
    const u = picUnits0(pic);
    unitCache.set(pic, u);
    return u;
  }
  function picUnits0(pic) {
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
    // v08L (CD-50: 1.1a): while passes are running, this corner shows the ⏭ 1/3 counter instead of the logo (no room
    // in a phone's top bar, and the grid never moves)
    if (!parts.length && i === 0 && passChip()) return `<div class="cell clue corner pcorner" data-i="${i}">${passChip()}</div>`;
    if (!parts.length && i === 0) { const src = GI.cross; /* v09a (JM CD-71: 1.4 Y): the CrossKeys icon */ return `<div class="cell clue corner" data-i="${i}">${src ? `<img src="${src}" alt="">` : ''}</div>`; }
    if (!parts.length) return `<div class="cell clue empty" data-i="${i}"></div>`;
    const split = parts.length === 2;
    const inner = parts.map(([d, si]) => {
      const s = G.pz.slots[si];
      const body = s.clue.pic
        ? (s.clue.cap ? `<span class="pic" style="font-size:${(picFont(s.clue.pic, split) * 0.6).toFixed(1)}px">${picHTML(s.clue.pic)}</span>${capHTML(s, Math.min(ui.cell * (split ? 0.16 : 0.2), clueFont(s.clue.t, split, d) * 0.9).toFixed(1))}`
          : `<span class="pic" style="font-size:${picFont(s.clue.pic, split)}px">${picHTML(s.clue.pic)}</span>`)
        : `<span class="ct" style="font-size:${clueFont(s.clue.t, split, d)}px">${clueMarks(s.clue.t)}</span>`;
      const cls = ['cl', 'cl-' + d];
      if (slotDone(s)) cls.push('solved');
      if (ui.lit && ui.lit.on.has(si)) cls.push('on'); // v08L (CD-50: 3.1b): bright, or pale for crossing words
      else if (ui.lit && ui.lit.pale.has(si)) cls.push('pale');
      return `<div class="${cls.join(' ')}" data-s="${si}">${body}</div>`;
    }).join('');
    return `<div class="cell clue${split ? ' split' : ''}" data-i="${i}">${inner}</div>`;
  }

  // v08L (JM CD-49: 2.4; CD-50: 3.1b): which clue cells light up. Bright: the word you chose, the word your penciled
  // tiles line up in, and both words of a lone tile on a crossing. Pale: the words crossing a lined-up word at a
  // penciled tile (each also gets that letter).
  function litSlots() {
    const on = new Set(), pale = new Set();
    if (ui.selSlot >= 0) on.add(ui.selSlot);
    if (G.turn !== 0 || G.over || !ui.pending.length) return { on, pale };
    const pc = new Set(ui.pending.map(p => p.cell));
    for (const p of ui.pending) {
      const ss = G.pz.cellSlots[p.cell] || [];
      const lined = ss.filter(si => G.pz.slots[si].cells.some(c => c !== p.cell && pc.has(c)));
      if (!lined.length) ss.forEach(si => on.add(si));
      else ss.forEach(si => (lined.includes(si) ? on : pale).add(si));
    }
    for (const si of on) pale.delete(si);
    return { on, pale };
  }
  // v08p (JM CD-56 add'l 1.2; CD-57: 2.1c, 2.2.1): a missing letter ("_") shows as a bold orange "?"; a missing word
  // ("___") as a thick orange bar. On a lit (yellow) clue cell both turn deep orange so they don't wash out (2.2.2.1).
  // v08t (JM CD-67: 3.4a): a 1-letter clue such as "SAND _ ICH" or "C _ _ KIE" is spaced for legibility; non-breaking
  // spaces keep it on one line in the cell (only for all-capital letter patterns, so "Grin and ___ it" still wraps)
  function tightBlanks(t) { return /^[A-Z]+(?: +(?:_|[A-Z]+))+$|^(?:_ +)+[A-Z]/.test(t) && t.includes('_') ? t.replace(/ +/g, ' ') : t; }
  function clueMarks(t) {
    t = tightBlanks(t);
    return esc(t).replace(/_{2,}/g, '<span class="mw" aria-label="missing word"></span>').replace(/_/g, '<span class="ml" aria-label="missing letter">?</span>');
  }
  function renderBoard() {
    const pz = G.pz;
    ui.lit = litSlots(); // v08L
    const scan = G.scan && G.scan.t === G.turnNo && G.turn === 0 && !G.over ? new Set(G.scan.cells) : null;
    const pend = new Map(ui.pending.map(p => [p.cell, p]));
    // v08k (JM CD-46 add'l 2): placing a tile or choosing a word no longer tints the word's empty cells; only its
    // clue cell lights up (clueCellHTML 'on'), so bonus squares and empty slots always look the same
    const wr = ui.wrong; // v08k: your wrong tiles (WordGrams-style, see showWrong)
    const last = new Set(G.lastMove ? G.lastMove.cells : []);
    // v08j (JM CD-44 add'l 1; CD-45: 3.1a): once the game is over, the last play's tiles and the words they made glow
    // until you open Results, so the final play can be seen properly
    const fin = new Set();
    if (G.over && !ui.resSeen && G.lastMove) {
      for (const c of G.lastMove.cells) fin.add(c);
      for (const w of (G.lastMove.score && G.lastMove.score.words) || []) for (const c of pz.slots[w.si].cells) fin.add(c);
    }
    const parts = [];
    const vals = E.showsValues(G);
    const plusTxt = '+' + E.RULES.plusCell;
    const bTxt = b => (b === 'x2' ? '2×' : b === 'p2' ? '+' + E.RULES.plus2Cell : plusTxt); // v07a: +2 cells
    for (let i = 0; i < pz.N; i++) {
      const c = pz.cells[i];
      if (c.k === 'c') { parts.push(clueCellHTML(i, c)); continue; }
      const cls = ['cell', 'let'];
      let inner = '';
      const ch = ui.hide && ui.hide.has(i) ? '' : G.board[i]; // v08p: the Bot's speed-run tiles appear one by one
      // the bonus on this cell: waiting (fixed or floating), or already used
      const b = ch ? E.bonusUsed(G, i) : E.bonusAt(G, i);
      const fl = !ch && G.fb && G.fb[i];
      if (ch) {
        cls.push('filled', G.owner[i] === 0 ? 'mine' : G.owner[i] === 1 ? 'theirs' : 'pre');
        if (last.has(i)) cls.push('last');
        if (ui.settle && ui.settle.has(i)) cls.push('settle'); // v08n (CD-52: 6.2.1.1): a confirmed tile settles into its well
        inner = `<span class="ch">${ch}</span>`;
      } else if (pend.has(i)) {
        const p = pend.get(i);
        cls.push('pending');
        if (p.ok) cls.push('chk'); // v08d: known to fit (☑️ Check or 🎯 Place)
        if (ui.dragCells && ui.dragCells.has(i)) cls.push('dragging'); // v08g: still being dragged by a finger
        inner = `<span class="ch">${p.ch}</span>${vals ? `<span class="pv">${E.tileVal(G, p.ch)}</span>` : ''}${p.ok ? '<span class="okm">✓</span>' : ''}`;
      } else if (ui.aiPending && ui.aiPending.has(i)) {
        cls.push('aipend');
        inner = `<span class="ch">${ui.aiPending.get(i)}</span>`;
      } else if (wr && wr.cells.has(i)) {
        // v08k (JM CD-47: 2.1.1.1): your wrong tile glows red and trembles in the cell (0.5 s), then flies back to your
        // hand; the empty cell stays red, outlined and pulsing, until you tap
        if (wr.phase === 'tremble') { cls.push('wrongtile'); inner = `<span class="ch">${wr.cells.get(i)}</span>`; }
        else cls.push('wrongcell');
      } else if (ui.flash && ui.flash.has(i)) { // v08d: the rival's wrong tiles shake as they bounce back (a Map: cell → letter)
        cls.push('wrongflash', 'shake');
        inner = `<span class="ch">${ui.flash.get(i)}</span>`;
      } else if (G.over) {
        cls.push('reveal');
        inner = `<span class="ch">${c.s}</span>`;
      } else if (b) {
        cls.push('b-' + b);
        inner = `<span class="bn">${bTxt(b)}</span>`;
      }
      // v08k (JM CD-46 add'l 3): only bonus cells still open pulse (empty, or holding a tile penciled in this turn);
      // once a tile is played there, only the corner number is left
      if (b && ch) inner += `<span class="bdg">${bTxt(b)}</span>`;
      else if (b && !(wr && wr.cells.has(i))) {
        cls.push('bz-' + b);
        if (fl && fl.n < G.turnNo) cls.push('fl-old');
        if (inner && !inner.includes('class="bn"')) inner += `<span class="bdg">${bTxt(b)}</span>`;
        inner += '<i class="glow"></i>';
      }
      if (i === ui.hintCell || (scan && scan.has(i) && !pend.has(i))) cls.push(i === ui.hintCell ? 'hint' : 'scan'); // v08m (CD-52: 4.1a): 🔦 Scan cells are hatched, not pulsing
      if (i === ui.pop) cls.push('popin');
      if (fin.has(i)) cls.push('fin');
      parts.push(`<div class="${cls.join(' ')}" data-i="${i}">${inner}</div>`);
    }
    // v08k (JM CD-46 add'l 1): only the cells that changed are redrawn. Rebuilding the whole grid on every tap was the
    // biggest cost on phones (a Large grid with its clue pictures); it also restarted every pulse.
    const board = $('#board');
    if (ui.bPz !== pz || board.children.length !== parts.length) {
      board.innerHTML = parts.join('');
      ui.bPz = pz;
    } else {
      const kids = board.children;
      for (let i = 0; i < parts.length; i++) if (ui.bHtml[i] !== parts[i]) kids[i].outerHTML = parts[i];
    }
    ui.bHtml = parts;
    // v08j: the chosen grid colors (v08k: kept with the countdown's border flash, and only set when it changes)
    const want = [gridCls(settings.screen === 'night' ? 'a' : settings.grid), // v08q (CD-59: 2.3b): Night has one fixed grid look
      ...[...board.classList].filter(k => k.startsWith('tf-'))].join(' ');
    if (board.className !== want) board.className = want;
    ui.pop = -1;
    sharpWords();
    zoomChrome(); zoomFollow(); // v08m
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
      // v08k: a tile that didn't fit keeps a red letter until you tap (hidden while it flies back from the grid)
      const wr = ui.wrong && ui.wrong.tiles.has(t.id) ? (ui.wrong.flying.has(t.id) ? ' wrong flying' : ' wrong') : '';
      html += `<div class="tile${ui.selTile === t.id ? ' sel' : ''}${ui.dragTiles && ui.dragTiles.has(t.id) ? ' dragging' : ''}${wr}" data-id="${t.id}">${tileInner(t.ch)}</div>`;
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
    if (t.kind === 'turn') return t.secs === 30 ? 'Blitz · 30 s per TURN' : `${t.secs / 60} min per TURN`; // v08b: always "per"
    if (t.kind === 'game') return `${t.secs / 60} min each (whole game)`; // v08o (CD-52: 5.3)
    return 'Untimed';
  }
  function renderInfo() {
    const r = Math.ceil(G.turnNo / 2), M = E.modeOf(G);
    const bonusName = { fixed: 'Fixed bonuses', floating: 'Floating bonuses', both: 'Fixed + floating bonuses', off: 'No bonuses' }[G.settings.bonus] || '';
    // v08: the coin balance leads the line, so a narrow screen trims the mode name, not the coins
    // v08h: two short lines (round · bag, then scoring), so the row also fits the 🔇 / 🔊 button on phones
    // v08i (JM CD-43: 1.2a): "Round N" over "N in bag" on phones (the scoring name stays in ⚙ and on bigger screens)
    $('#infoBar').innerHTML = `${coinPill()}<span class="ib-t"><span>Round ${r}</span><span>${G.bag.length} in bag</span></span>`;
    $('#infoBar').title = `Round ${r} · ${G.bag.length} tiles not dealt yet · ${M.name}`;
    $('#infoSide').innerHTML = `<div class="info-coins">${coinPill()}</div><b>Round ${r}</b> · ${G.bag.length} in bag<br>${esc(M.name)} · ${esc(bonusName)}<br>${esc(timerLabel())}`;
    $('#hubSet').textContent = `${M.name} · ${bonusName} · ${timerLabel().replace(/ \(whole game\)$/, '')}`; // v08p (CD-57: 4.3): this game's settings, wide screens
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
    // v08p: the clock by your score always shows time (never "Resume" or "Done")
    // v08r (CD-63: 1.1a): in per-TURN games, a side's clock not running shows its full turn time, dimmed (both sides alike)
    const myRun = G.turn === 0 && !ui.busy && !G.over && !repsOn();
    const ctxt = tm.kind === 'game' ? fmtClock(G.clock) : tm.kind === 'turn' ? fmtClock(myRun ? ui.left : tm.secs * 1000) : '';
    if (tm.kind !== 'none') { const ck = $('#clkTop'); ck.textContent = '⏱ ' + ctxt; ck.classList.toggle('low', low && !ui.paused); ck.classList.toggle('idle', tm.kind === 'turn' && !myRun); }
    btn.classList.toggle('low', low && !ui.paused);
    btn.classList.toggle('on', ui.paused);
    $('#pauseIco').textContent = ui.paused ? '▶️' : '⏸️';
    btn.disabled = !G || G.over;
    let fs = 0;
    if (!ui.paused && !G.over && G.turn === 0 && !ui.busy && !repsOn() && tm.kind !== 'none') {
      const ms = tm.kind === 'game' ? G.clock : ui.left;
      if (ms > 0 && ms <= 10000) fs = Math.ceil(ms / 1000);
    }
    renderOppClock(); // v08o
    setTimerFlash(fs);
  }
  // Last 10 seconds of a timed turn or game: the grid's border flashes once a second,
  // bright yellow for 10–6 and bright red for 5–1 (JM, CD-7 add'l 4)
  let flashSec = 0;
  function setTimerFlash(s) {
    if (s === flashSec) return;
    flashSec = s;
    if (s >= 1 && s <= 10) sound.play(s > 5 ? 'tick' : 'tock'); // v08h: one tick a second in the last 10
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
    const clue = s.clue.pic ? `<span class="cb-pic">${picHTML(s.clue.pic)}</span>${tag}` : `<span class="cb-word">${esc(s.clue.t)}</span>`;
    return `<div class="cb-line${primary ? ' on' : ''}" data-s="${si}"><span class="cb-dir">${s.d === 'A' ? '→' : '↓'}</span>${clue}`
      + `<span class="cb-stat"><span class="cb-pat">[${letters}]</span><span class="cb-n">${got.length} / ${s.cells.length}</span>${sp ? `<span class="cb-pts">${sp.v} ${sp.t}</span>` : ''}</span></div>`;
  }

  // v08q (JM CD-58: 2.2 YwC, 2.2.1): the word's progress, always at the foot of the clue card: [C ? T ?] 2 / 4 · 4 pts
  function zoomProg(s) {
    const pend = new Map(ui.pending.map(p => [p.cell, p.ch]));
    const got = [];
    const letters = s.cells.map(ci => {
      const ch = G.board[ci] || pend.get(ci) || '';
      if (ch) { got.push(ch); return `<i>${ch}</i>`; }
      if (G.over) return `<i class="rv">${G.pz.cells[ci].s}</i>`;
      return '<i class="bl">?</i>';
    }).join(' ');
    const sp = solvedPts(s, got);
    return `<div class="z-prog"><span class="zp-pat">[${letters}]</span> <span>${got.length} / ${s.cells.length}</span>${sp ? ` · <span>${sp.v} ${sp.t}</span>` : ''}</div>`;
  }

  // v08p: 🔍 sits in the hub's button row (it used to sit at the end of the clue bar)
  function renderClueBar() {
    renderClueBar0();
    const slot = $('#zoomSlot'), zb = zoomBtnEl;
    if (zb.parentNode !== slot) slot.appendChild(zb);
  }
  // v08p (CD-57: 1.3a): the floating message ("pill") at the top of #toasts
  const msgS = { t: '', timer: 0, seen: new Set() };
  function showMsg(t, hold, key) {
    let el = $('#msgPill');
    if (!el) { el = document.createElement('div'); el.id = 'msgPill'; el.className = 'toast msg gone'; $('#toasts').prepend(el); }
    if (el.parentNode.firstChild !== el) el.parentNode.prepend(el);
    if (key && msgS.seen.has(key) && msgS.t !== t) return; // a tip already shown (and faded) stays gone
    if (t === msgS.t) return;
    msgS.t = t; clearTimeout(msgS.timer);
    if (key) msgS.seen.add(key);
    if (!t) { el.classList.add('out'); msgS.timer = setTimeout(() => el.classList.add('gone'), 320); return; }
    el.textContent = t;
    el.classList.remove('out', 'gone');
    el.classList.toggle('hold', !!hold);
    el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
    placeToasts();
    if (!hold) msgS.timer = setTimeout(() => { el.classList.add('out'); msgS.timer = setTimeout(() => el.classList.add('gone'), 320); }, 4000);
  }
  function renderClueBar0() {
    const bar = $('#cluebar');
    if (ui.selSlot >= 0) {
      const alt = altSlot();
      const both = [ui.selSlot, alt].filter(x => x >= 0);
      both.sort((a, b) => (G.pz.slots[a].d === 'A' ? 0 : 1) - (G.pz.slots[b].d === 'A' ? 0 : 1)); // across line first
      bar.innerHTML = both.map(si => clueLine(si, si === ui.selSlot)).join('');
      return;
    }
    // v08p (JM CD-57: 1.3a, 1.5): no clue bar. The message floats over the grid, in the half away from any red marks.
    // Most fade after 4 s; the ones you must act on (hold) stay while they apply. Tips show once (turn / game).
    let msg = '', hold = false, key = '';
    if (G.over) msg = 'Game over. Tap any clue to review the words.';
    else if (ui.passHold) { msg = 'LAST CHANCE: read the red notice, then tap anywhere to continue.'; hold = true; }
    else if (ui.wrong && (ui.botWait || repsHeld())) { msg = 'Red marks: tiles that didn\x27t fit. Tap anywhere to continue.'; hold = true; } // v08p (CD-57: 3.1)
    else if (G.turn === 1) msg = G.clockOut === 0 ? `Your clock ran out: ${opp().n} places the rest of its tiles.` : `${opp().n} is thinking…`; // v08o
    else if (repsOn()) msg = 'Tap anywhere to start your turn. Your clock waits.';
    else if (ui.pending.length) { msg = 'Penciled in until DONE. Drag a tile to move it, or tap it to take it back.'; key = 'pend:' + ui.token; }
    else if (!G.hands[0].length) { msg = 'No tiles left. Tap Pass.'; hold = true; }
    else if (G.clockOut === 1) { msg = `${opp().n}'s clock ran out: you play on alone (your clock keeps running).`; key = 'solo:' + ui.token; } // v08o
    else if (G.finalTurn === 0) { msg = `FINAL TURN: ${opp().n} has played every tile. Play all you can.`; hold = true; }
    else { msg = 'Your turn.'; key = 'turn:' + ui.token + ':' + G.turnNo; }
    showMsg(msg, hold, key);
  }

  function renderActions() {
    const mine = myTurn();
    // v08: Hint, Place and +30s cost coins; a button you can't afford is dimmed (a tap says why)
    const hc = E.RULES.hintCost;
    $('#hintTxt').textContent = `Hint 🪙${hc}`;
    $('#hintBtn').disabled = !mine || !G.hands[0].length;
    $('#hintBtn').classList.toggle('poor', coins.bal < hc);
    // v08L: 🔦 Scan, 🪙2 per tile still in your hand, once per turn
    const sn = Math.max(0, scanTiles()), sp = Math.max(1, sn) * SCAN_PER_TILE;
    $('#scanTxt').textContent = `Scan 🪙${sp}`;
    $('#scanBtn').disabled = !mine || !sn || scanUsed();
    $('#scanBtn').classList.toggle('poor', coins.bal < sp);
    $('#scanBtn').title = scanUsed() ? 'Scan: already used this turn (once per turn)' : `Scan: light one cell for each of the ${sn} tile${sn === 1 ? '' : 's'} in your hand (🪙${SCAN_PER_TILE} each). Once per turn.`;
    $('#placeBtn').disabled = !mine || G.hands[0].length <= ui.pending.length;
    $('#placeBtn').classList.toggle('poor', coins.bal < 1);
    $('#timeBtn').classList.toggle('poor', coins.bal < E.RULES.timeCost);
    // +30s only exists in timed games (JM, CD-7 add'l 1.2)
    $('#timeBtn').hidden = E.timerOf(G.settings.timer).kind === 'none';
    $('#morePop').style.setProperty('--mc', $('#timeBtn').hidden ? 4 : 5); // v08d: coin buttons on the pop-up's top row (v08L: + Scan)
    $('#timeBtn').disabled = !mine;
    $('#swapBtn').disabled = !mine || !G.bag.length || !!ui.pending.length || !G.hands[0].length;
    $('#mixBtn').disabled = !G || G.over || G.hands[0].length < 2;
    // v08d (JM CD-34: 4.1c): ☑️ Check tests your penciled tiles now. It costs 5, plus 5 for each wrong tile.
    // v08e (CD-36: 3.1): it needs only 🪙10 to start ("Check as far as you can pay")
    const unk = ui.pending.filter(p => !p.ok).length;
    $('#checkBtn').disabled = !mine || !unk;
    $('#checkBtn').classList.toggle('poor', coins.bal < checkNeed());
    $('#doneBtn').disabled = !mine;
    $('#doneBtn').classList.toggle('pass', !ui.pending.length); // v08e (CD-36: 2.1): orange while it says Pass
    $('#doneIco').textContent = ui.pending.length ? '✓' : '⏭'; // v08f (CD-37: 4.3)
    // v08f (CD-37: 2.1.1): once the game is over, the hand's row becomes the game-over bar
    const over = !!(G && G.over && G.result);
    $('#dock').classList.toggle('is-over', over);
    $('#game').classList.toggle('is-over', over); // v08p: the wing buttons hide too
    $('#overBar').hidden = !over;
    if (over) $('#overBar').style.setProperty('--gw', Math.round(Math.min($('#board').getBoundingClientRect().width, $('#boardwrap').clientWidth - 8)) + 'px'); // v08m (CD-51 add'l 1): the win report is as wide as the grid
    const obKey = over ? (ui.resSeen ? 'seen' : 'new') : ''; // v08j: the bar is redrawn once Results has been seen
    if (over && $('#overBar').dataset.on !== obKey) {
      const r = G.result, o = opp();
      const head = r.winner === 0 ? `🏆 ${myName() === 'You' ? 'You win' : esc(myName()) + ' wins'}` : r.winner === 1 ? `${o.a} ${esc(o.n)} wins` : '🤝 A draw';
      $('#overBar').innerHTML = `<span class="ob-h">🏁 Game over · ${head} · ${G.scores[0]}–${G.scores[1]}</span>
        <span class="ob-btns">${ui.resSeen ? '<button class="btn" type="button" data-ob="res">📊 Results</button>' : '<button class="btn primary see-res" type="button" data-ob="res" title="Open the Results (Enter)">📊 See results ▸</button>'}<button class="btn" type="button" data-ob="menu">☰ Lobby</button><button class="btn${ui.resSeen ? ' primary' : ''}" type="button" data-ob="again">Rematch</button></span>`;
      $('#overBar').dataset.on = obKey;
    }
    if (!over) { $('#overBar').innerHTML = ''; delete $('#overBar').dataset.on; }
    if (ui.pending.length) {
      // v08d (CD-34: 4.4): a tile count, not points (points would tell you which tiles are right)
      $('#doneTxt').textContent = `Done · ${ui.pending.length}`;
      $('#doneBtn').title = `Check and bank your ${ui.pending.length} penciled tile${ui.pending.length > 1 ? 's' : ''}. Wrong ones bounce back to your hand and cost the Wrong Cell penalty.`;
    } else {
      $('#doneTxt').textContent = 'Pass';
      $('#doneBtn').title = 'Pass. ' + PASS_RULE;
    }
    $('#swapBtn').title = 'Swap some or all of your tiles. Ends your turn and counts as a pass.';
  }
  const checkNeed = () => E.RULES.checkBase + E.RULES.checkPerWrong; // v08e: the base plus one wrong tile

  // ---------- 3 PASSES Rule warning ----------
  // v08d (JM CD-33 add'l 1; CD-34: 3.1–3.3): no pass pill. A new pass holds the game until you tap (the opponent
  // waits and your clock stops); after the tap the banner shrinks to its heading while the streak lasts.
  // Pills (toasts) move below the banner so they never cover it.
  // v08L (JM CD-49: 1.3.1, 1.6.1.2; CD-50: 1.1a): no banner, so the grid never moves. A ⏭ 1/3 counter in the
  // grid's top-left corner (in place of the logo) counts passes in a row (yellow after the 1st, red after the 2nd). Only the 2nd pass shows a
  // notice: it floats over the grid, says what caused it, and holds the game until you tap (as the banner did).
  function passWho() {
    const e = G.log && G.log[G.log.length - 1];
    if (!e || e.kind === 'play') return '';
    const me = e.p === 0, nm = me ? 'You' : opp().n;
    if (e.kind === 'swap') return `${nm} swapped`;
    if ((e.items || []).some(x => x.k === 'wrong')) return me ? 'Every tile bounced' : `Every tile ${nm} placed bounced`;
    if (me && G.clockOut === 0) return 'Your clock ran out';
    if (!me && G.clockOut === 1) return `${nm}'s clock ran out`; // v08o
    return `${nm} passed`;
  }
  function passChip() {
    const n = G && !G.over ? (G.passes || 0) : 0;
    if (!n) return '';
    return `<span class="pchip p${Math.min(n, 2)}" title="Passes in a row: ${n} of 3. ${esc(PASS_RULE)}"><b>⏭</b><b>${n}/3</b></span>`;
  }
  function renderPassWarn() {
    const n = G && !G.over ? (G.passes || 0) : 0;
    if (Date.now() < (ui.repAt || 0)) return; // v08L: wait until your wrong tiles have bounced back
    if (n > ui.passSeen) {
      ui.passSeen = n;
      sound.play('pass', 0.15);
      if (n >= 2) {
        ui.passHold = n;
        const who = passWho();
        const what = /passed$/.test(who) ? 'PASS 2 of 3' : 'counts as PASS 2 of 3';
        toast(`${who ? who + ': ' + what : 'PASS 2 of 3'} · LAST CHANCE. The next turn must place a tile, or the game ends.`, 'bad pass2', 0);
      }
    } else if (n < ui.passSeen) { ui.passSeen = n; ui.passHold = 0; }
    if (!n) ui.passHold = 0;
    for (const id of ['#passWarnBar', '#passWarnSide']) $(id).hidden = true; // v08L: the old banner is never shown
  }
  // v08L (JM CD-49: 1.7.1; CD-50: 2.2): notices sit at the end of the grid farther from your wrong word (stacked above
  // the turn report when both are at the bottom), so they never cover that word or its clue
  function wrongHalf() {
    const w = ui.wrong;
    if (!w || !G) return '';
    const board = $('#board'), br = visBoardRect(); // v08m
    let top = Infinity, bot = -Infinity;
    for (const si of w.words) {
      const s = G.pz.slots[si];
      for (const ci of [...s.cells, s.clueCell]) {
        const el = board.children[ci];
        if (!el) continue;
        const r = el.getBoundingClientRect();
        top = Math.min(top, r.top); bot = Math.max(bot, r.bottom);
      }
    }
    if (top === Infinity) return '';
    return (top + bot) / 2 < br.top + br.height / 2 ? 'top' : 'bottom';
  }
  function placeToasts() {
    const box = $('#toasts'), ov = $('#repOv');
    const half = !$('#game').hidden ? wrongHalf() : '';
    // the turn report on phones: at the top of the grid when the wrong word is in the lower half
    ov.classList.toggle('top', half === 'bottom');
    box.classList.toggle('low', half === 'top');
    if (half === 'top') {
      const rr = !ov.hidden && !ov.classList.contains('top') ? [...ov.children].filter(c => !c.hidden).map(c => c.getBoundingClientRect()) : [];
      const limit = rr.length ? Math.min(...rr.map(r => r.top)) : $('#boardwrap').getBoundingClientRect().bottom;
      box.style.top = ''; box.style.bottom = Math.max(8, Math.round(innerHeight - limit + 6)) + 'px';
    } else if (half === 'bottom') {
      box.style.bottom = '';
      const rr = !ov.hidden ? [...ov.children].filter(c => !c.hidden).map(c => c.getBoundingClientRect()) : [];
      box.style.top = rr.length ? Math.round(Math.max(...rr.map(r => r.bottom)) + 6) + 'px' : '';
    } else { box.style.bottom = ''; box.style.top = !$('#game').hidden ? Math.round($('#boardwrap').getBoundingClientRect().top + 8) + 'px' : ''; } // v08p: just inside the top of the grid
  }
  window.addEventListener('resize', () => { if (G && !$('#game').hidden) placeToasts(); });

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
    const name = p === 0 ? myName() : opp().n, av = p === 0 ? myAv() : opp().a;
    const rows = (G.log || []).filter(e => e.p === p);
    let h = `<div class="ss-head"><span class="av">${av}</span><span class="nm">${esc(name)}</span><span class="tt">${G.scores[p]}</span></div>`;
    h += '<table class="ss"><thead><tr><th title="Round">Rd</th><th title="Letter points">Ltr</th><th title="Word points">Wd</th><th title="Bonuses: 2×, +5, +2, Full Hand">Bon</th><th title="Penalties: Wrong Cells (Hint, Place and +30s cost coins, not points)">Pen</th><th title="Turn subtotal">Turn</th></tr></thead><tbody>';
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
    const r0 = performance.now(); // v09a: timed for the slow-drop recorder
    // v08q: a Letters in Hand change made in ⚙ has just started (at the top of a round)
    if (G.handChanged) { const h = G.handChanged; delete G.handChanged; toast(`✋ Round ${h.r}: both hands now hold ${h.to} letters (were ${h.from}).`, '', 3200); }
    // Everything around the grid first, then measure the space that is left, then draw the grid
    renderTop();
    renderRack();
    renderClueBar();
    renderActions();
    renderPassWarn();
    renderSheets();
    if (!$('#game').hidden) layout();
    renderBoard();
    veil();
    placeToasts(); // v08L
    ui.lastRenderMs = performance.now() - r0;
  }
  // v08i (JM CD-42 add'l 7; CD-43: 4.1a): in TIMED games the grid, clue bar and hand blur whenever your clock is
  // stopped by a turn report or the PASS banner, so the grid can't be studied off the clock. The rival's tiles
  // landing stay sharp (you watch its moves); untimed games never blur.
  function veil() {
    const on = !!G && !G.over && E.timerOf(G.settings.timer).kind !== 'none' && repsOn() && (G.turn === 0 || !!ui.passHold);
    $('#game').classList.toggle('veiled', on);
    $('#game').classList.toggle('wrongs', !!ui.wrong); // v08L (CD-50: 2.1a): your hand stays sharp while the red marks show
    sharpWords(); // v08k
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
    while (box.querySelectorAll('.toast:not(.msg)').length > 3) box.querySelector('.toast:not(.msg)').remove(); // v08p: the message pill stays
    // v08k (JM CD-46: 1.8.1): ms = 0 holds the notice until the tap that closes the reports (with the PASS banner)
    if (!ms) { el.classList.add('held'); return; }
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 320); }, ms);
  }
  function dropHeld() {
    document.querySelectorAll('#toasts .toast.held').forEach(el => { el.classList.remove('held'); el.classList.add('out'); setTimeout(() => el.remove(), 320); });
  }
  // ---------- Turn reports (JM, CD-7 add'l 3) ----------
  // Each player's report sits at the bottom of their Scoreboard column (on phones: over the bottom of the grid),
  // and stays until you click or tap (v04, JM CD-8: 3.1.2). While a report is on screen the game waits: your clock
  // stops the moment the opponent finishes, and nothing can be played until you tap (CD-9: 3.1a, 3.1.1).
  // Row 1 is the turn TOTAL; then one row per word, bonus and penalty. The Scoreboard stays as the lasting record.
  const reps = { html: [null, null], key: [0, 0], swallowUntil: 0 };
  // v08d: a held PASS banner counts as a report: the game waits, and one tap closes both
  const repsOn = () => !!(reps.html[0] || reps.html[1] || ui.passHold);
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
    } else rows.push(`<div class="tr-row"><span class="l">${e.kind === 'swap' ? 'Swapped' : (e.items || []).some(x => x.k === 'wrong') ? 'No tile fit · counts as a pass' : 'Passed'}</span><span class="v">0</span></div>`); // v08m (CD-52: 2.3a)
    const items = e.items || [];
    // point rows: only items that cost points (v08: Hint, Place and +30s cost coins; older saves still show their points)
    const grp = (k, label) => {
      const xs = items.filter(x => x.k === k && x.v);
      if (xs.length) add(label(xs), -xs.reduce((a, x) => a + x.v, 0));
    };
    // v06: a Wrong Cell's cost depends on the tile, so the row names the letters (older saves have none)
    grp('wrong', xs => '✗ ' + (xs.length > 1 ? 'Wrong Cells' : 'Wrong Cell') + (xs.some(x => x.ch) ? ' ' + xs.map(x => x.ch).filter(Boolean).join(', ') : ''));
    grp('hint', xs => 'Hint' + xn(xs.length));
    grp('place', xs => 'Place ' + xs.map(x => x.ch).join(', '));
    grp('time', xs => '+30s' + xn(xs.length));
    if (!items.length && e.pen) add('Penalties', -e.pen);
    // v08: coins spent and earned this turn, on their own line under the points (they never change the score)
    const LBL = { hint: 'Hint', scan: 'Scan', place: 'Place', check: 'Check', time: '+30s', speed: 'Speed' };
    const cs = {};
    for (const x of items) if (x.c) cs[x.k] = (cs[x.k] || 0) + x.c;
    const coinTxt = Object.keys(cs).map(k => `${LBL[k] || k} ${cs[k] < 0 ? '−' + -cs[k] : '+' + cs[k]}`).join(' · ');
    const name = e.p === 0 ? myName() : opp().n, av = e.p === 0 ? myAv() : opp().a;
    return `<div class="tr-head"><span class="av">${av}</span><span class="nm">${esc(name)}</span><span class="rd">Round ${e.r}</span></div>`
      + `<div class="tr-row tot"><span class="l">TOTAL</span><span class="v">${signed(e.tot)}</span></div>${rows.join('')}`
      + (coinTxt ? `<div class="tr-coin">🪙 ${coinTxt}</div>` : '')
      + (e.p === 1 && !G.over ? '<div class="tr-tap">Click or tap anywhere to play</div>' : '');
  }
  function showReport(e) {
    if (!e) return;
    reps.html[e.p] = reportHTML(e);
    reps.key[e.p]++;
    if (e.words && e.words.length) sound.play(e.p === 0 ? 'word' : 'oppword', 0.2); // v08h: a finished word chimes
    renderReports();
  }
  const isWide = () => getComputedStyle($('#sideYou')).display !== 'none';
  // v08m (JM CD-52: 2.2b): on phones the turn reports wait while red wrong-tile marks are up, so they never cover the
  // wrong word: the 1st tap clears the marks and shows the reports, the 2nd closes them. (Wide screens show the
  // reports beside the grid, so one tap still does both there.)
  const repsHeld = () => !!ui.wrong && !isWide();
  function renderReports() {
    const wide = isWide(), hold = !wide && !!ui.wrong;
    [['#repYou', '#repYouN'], ['#repOpp', '#repOppN']].forEach(([w, n], p) => {
      const h = reps.html[p];
      const on = wide ? $(w) : $(n), off = wide ? $(n) : $(w);
      off.hidden = true;
      on.hidden = !h || hold;
      if (h && on.dataset.k !== String(reps.key[p])) { on.innerHTML = h; on.dataset.k = String(reps.key[p]); }
    });
    $('#repOv').hidden = wide || hold || !(reps.html[0] || reps.html[1]);
    if (wide) for (const id of ['#sheetYou', '#sheetOpp']) { const s = $(id); s.scrollTop = s.scrollHeight; } // keep the latest rows in view
    veil();
    placeToasts(); // v08L
    setTimeout(placeToasts, 350); // again once the reports have slid in
  }
  function clearReports() {
    const marks = clearWrong(); // v08k: red wrong-tile marks and held notices go with the same tap
    if (ui.botWait) { // v08p: the tap that clears your red marks lets the Bot play
      const bw = ui.botWait; ui.botWait = null;
      if (bw.tok === ui.token && G) { render(); showReport(lastLog()); afterTurn(bw.over); }
      return;
    }
    // v08m (CD-52: 2.2b): a phone's 1st tap only clears the marks; the reports that waited for them now show
    if (marks && reps.html.some(Boolean) && !isWide()) { renderReports(); if (G && !$('#game').hidden) render(); return; }
    if (!repsOn()) { if (marks && G && !$('#game').hidden) render(); return; }
    reps.html = [null, null];
    ui.passHold = 0;
    for (const id of ['#repYou', '#repYouN', '#repOpp', '#repOppN']) $(id).dataset.k = '';
    renderReports();
    // the game carries on: time spent reading never counts
    ui.lastTick = Date.now();
    if (G && !$('#game').hidden) render();
  }
  // A click or tap closes the reports and does nothing else (it never lands on a tile, cell or button underneath).
  // With the result screen open, the click goes through to it as usual.
  window.addEventListener('pointerdown', e => {
    if (!G || $('#game').hidden) return;
    // v08L: while your wrong tiles are still bouncing back (about 1 s), a tap does nothing
    if (Date.now() < (ui.repAt || 0) && $('#modal').hidden) { reps.swallowUntil = Date.now() + 700; e.stopPropagation(); e.preventDefault(); return; }
    // v08k: red wrong-tile marks or a held notice with no report up: this tap clears them and does nothing else
    if (!repsOn()) {
      if (!ui.wrong && !document.querySelector('#toasts .toast.held')) return;
      clearReports();
      if (!$('#modal').hidden) return;
      reps.swallowUntil = Date.now() + 700;
      e.stopPropagation(); e.preventDefault();
      return;
    }

    const modal = !$('#modal').hidden;
    clearReports();
    if (modal) return;
    reps.swallowUntil = Date.now() + 700;
    e.stopPropagation(); e.preventDefault();
  }, true);
  window.addEventListener('click', e => {
    if (Date.now() < reps.swallowUntil) { reps.swallowUntil = 0; e.stopPropagation(); e.preventDefault(); }
  }, true);

  // v08e: an optional class for the window (e.g. 'res' = a result window: wider on big screens, pinned button bar)
  // v08f (JM CD-37: 2.1): every info window has a ✕ in its top-right corner and also closes on a tap outside it.
  // opt.close: false = a question or a busy screen (no ✕, no outside tap); a function = runs after the window closes
  // (e.g. a result window shows the finished grid and its game-over bar).
  function openModal(html, cls, opt) {
    opt = opt || {};
    const can = opt.close !== false, sh = $('#sheet');
    sh.className = 'sheet' + (cls ? ' ' + cls : '');
    sh.innerHTML = (can ? '<button type="button" class="sheet-x" aria-label="Close" title="Close">✕</button>' : '') + html;
    sh.scrollTop = 0;
    const shut = () => { closeModal(); if (typeof opt.close === 'function') opt.close(); };
    $('#modal').onclick = can ? (e => { if (e.target === $('#modal')) shut(); }) : null;
    if (can) sh.querySelector('.sheet-x').addEventListener('click', e => { e.stopPropagation(); shut(); });
    $('#modal').hidden = false;
  }
  function closeModal() { $('#sheet').className = 'sheet'; $('#modal').hidden = true; $('#modal').onclick = null; $('#sheet').innerHTML = ''; $('#sheet').onclick = null; $('#sheet').onpointerdown = null; }
  // v08c (JM CD-30: 4.4): coin buttons take TWO taps. The first tap "arms" the button: it turns gold and reads
  // "Tap again · 🪙N" for 3 seconds; a second tap in that time buys. Anything else (time running out, another tap
  // elsewhere) disarms it. The label is drawn over the button (CSS ::after), so re-renders don't disturb it.
  // Returns true when the tap should go ahead and spend.
  const ARM_MS = 3000;
  function disarm(b) { if (!b) return; b.classList.remove('armed'); clearTimeout(b._armT); b._armT = 0; }
  function armTap(btn, price) {
    if (btn.classList.contains('armed')) { disarm(btn); return true; }
    document.querySelectorAll('.btn.armed').forEach(disarm);
    btn.dataset.arm = `Tap again\n🪙${price}`; // two lines, so it fits narrow buttons
    btn.classList.add('armed');
    btn._armT = setTimeout(() => disarm(btn), ARM_MS);
    return false;
  }
  document.addEventListener('pointerdown', e => {
    document.querySelectorAll('.btn.armed').forEach(b => { if (!b.contains(e.target)) disarm(b); });
  }, true);

  // v08c (JM CD-30: 4.5): GAME HISTORY. The last 100 results from both games, newest first, kept on this device.
  // Each entry keeps a copy of its result window, so tapping it shows the full result again.
  const HIST_KEY = 'cd.history', HIST_MAX = 100;
  const hist = {
    list() { return store.get(HIST_KEY, []); },
    add(e) {
      const a = hist.list();
      a.unshift(Object.assign({ t: Date.now() }, e));
      if (a.length > HIST_MAX) a.length = HIST_MAX;
      // if storage is full, keep fewer old results rather than lose the new one
      for (let n = a.length; n > 0; n = Math.floor(n * 0.7)) {
        try { localStorage.setItem(HIST_KEY, JSON.stringify(a.slice(0, n))); return; } catch (x) { /* too big: trim */ }
      }
    },
    show: showHistory
  };
  const when = t => new Date(t).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  function showHistory(filter) {
    const f = filter || 'all', all = hist.list();
    const rows = all.map((e, i) => ({ e, i })).filter(x => f === 'all' || x.e.g === f);
    const tab = (v, l) => `<button type="button" data-f="${v}" class="${f === v ? 'on' : ''}">${l}</button>`;
    openModal(`<h2>📜 Game History</h2>
      <div class="seg one hist-seg">${tab('all', 'All')}${tab('duel', gimg('cross') + ' ' + NM.cross)}${tab('vault', gimg('lock') + ' ' + NM.lock)}</div>
      ${rows.length ? `<ul class="hist-list">${rows.map(({ e, i }) => `<li><button type="button" class="hist-it ${e.win ? 'won' : 'lost'}" data-i="${i}">
          <span class="hi-ico">${gimg(e.g === 'duel' ? 'cross' : 'lock')}</span>
          <span class="hi-main"><b>${esc(e.title)}</b><small>${esc(e.sub || '')}</small><small>${when(e.t)}</small></span>
          <span class="hi-side"><b>${esc(e.score || '')}</b><small>🪙${signed(e.coins)}</small></span></button></li>`).join('')}</ul>`
        : `<p class="hist-none">No ${f === 'duel' ? NM.cross + ' ' : f === 'vault' ? NM.lock + ' ' : ''}results yet. Finished games show up here.</p>`}
      <p class="hist-note">The last ${HIST_MAX} results, kept on this device. Tap one to see its full result.</p>
      <div class="row"><button class="btn primary" data-a="close">Close</button></div>`);
    $('#modal').onclick = e => { if (e.target === $('#modal')) closeModal(); };
    $('#sheet').onclick = e => {
      const t = e.target.closest('[data-f]'); if (t) return showHistory(t.dataset.f);
      const it = e.target.closest('[data-i]');
      if (it) {
        const h = all[+it.dataset.i]; if (!h) return;
        openModal(`<div class="hist-when">📜 ${when(h.t)}</div><div class="hist-res">${h.html || ''}</div>
          <div class="row res-bar"><button class="btn" data-a="back">◂ History</button><button class="btn primary" data-a="close">Close</button></div>`, 'res');
        $('#sheet').onclick = ev => { const b = ev.target.closest('[data-a]'); if (!b) return; if (b.dataset.a === 'back') showHistory(f); else closeModal(); };
        return;
      }
      if (e.target.closest('[data-a="close"]')) closeModal();
    };
  }

  function confirmBox(title, text, yes, no) {
    return new Promise(res => {
      openModal(`<h2>${esc(title)}</h2><p>${esc(text)}</p><div class="row"><button class="btn" data-a="no">${esc(no)}</button><button class="btn primary" data-a="yes">${esc(yes)}</button></div>`, '', { close: false });
      $('#sheet').onclick = e => { const b = e.target.closest('[data-a]'); if (!b) return; closeModal(); res(b.dataset.a === 'yes'); };
    });
  }

  // How To Play (v04, JM CD-8: 9.1): every section starts closed; tap a header to open it, and the section
  // that was open closes. The chevron on the right turns as it opens.
  // v05 (JM, CD-10: 6.1.1): every feature labeled in the menu has its own section, in menu order, then the play sections.
  // v06 (JM, CD-11): title-case headings; every cross-reference is a link that opens its section (closing the others)
  // and scrolls to it; a Clue Bar section; Scoring lists the shared rules, then one part per mode with an example.
  // v10 (JM CD-76: 3.2): How To Play splits in two. The Lobby's ? = How To Play Master Keys (the Lobby, You, the game
  // cards, settings, coins, History, sound, offline), with a button for each game's own How To Play.
  function showSuiteHelp() {
    const sec = helpSec, go = (t, l) => `<a class="help-link" href="#" data-go="${helpId(t)}">${l || t}</a>`;
    openModal(`
      <h2>How To Play ${NM.suite} <span class="chip">${APP_VER}</span></h2>
      <p>${NM.suite} is a set of word games. <b>${gimg('cross')} ${NM.cross}</b>: you and the Bot (a computer player) take turns filling the same crossword with letter tiles. <b>${gimg('lock')} ${NM.lock}</b>: crack a hidden word in a few guesses. Each game has its own How To Play: tap a button here, or the <b>?</b> inside the game.</p>
      <div class="row help-games"><button class="btn" type="button" data-h="cross">${gimg('cross')} How To Play ${NM.cross}</button><button class="btn" type="button" data-h="lock">${gimg('lock')} How To Play ${NM.lock}</button></div>
      <p class="help-note">Tap a heading to open it. Underlined names open their section.</p>
      ${sec('The Lobby', `
        <li>The Lobby is the first screen: the ${NM.suite} title, ${go('You')}, your ${go('Coins', 'coins')}, and one card per game.</li>
        <li>The small buttons in the top corner: 🔇 ${go('Sound')}, 📜 ${go('Game History')}, ⚙ ${go(NM.suite + ' Settings')} and ? (this window).</li>
        <li><b>☰</b> in every game takes you back to the Lobby. An unfinished game is kept, ready to resume.</li>`)}
      ${sec('You', `
        <li>Tap the face to choose your avatar from the icon list, or to upload your own picture (kept on this device).</li>
        <li>Type your name in the box beside it. It shows in the games and on the Scoreboard. Left empty, you're "You".</li>`)}
      ${sec('The Game Cards', `
        <li>Each game has its own card: its icon, name and a line about it, then your record (games played, the share you won or solved, and a top score or streak).</li>
        <li><b>🆕 New Game</b> starts a game at once with your last settings for that game (the line under the buttons says which). It's the quickest way to play your favorite setup again.</li>
        <li><b>⚙ Setup</b>, or a tap anywhere else on the card, opens that game's <b>Setup screen</b>, where you choose its settings before you start.</li>
        <li><b>▶ Resume</b> appears, with a line saying where you left off, when a game is unfinished. 🆕 New Game then asks first, because the unfinished game would be lost.</li>
        <li>The dashed card holds the place of the games still to come.</li>`)}
      ${sec(NM.suite + ' Settings', `
        <li><b>⚙</b> in the Lobby's top corner holds the settings that change every game.</li>
        <li><b>Screen</b>: <b>Auto</b> follows your device's light or dark setting; <b>Light</b> and <b>Dark</b> stay put; <b>Night</b> is the dimmest look (charcoal grays) for playing in the dark. ⚙ inside ${NM.cross} changes it too.</li>
        <li>Each game's own settings are on its Setup screen and in the ⚙ inside the game.</li>`)}
      ${sec('Coins', `
        <li><b>🪙 Coins</b> are one currency shared by every game. You start with <b>${COIN.start}</b>. Your balance shows in the Lobby and inside each game; tap it for details and your latest coins.</li>
        <li>You earn coins by playing well (finishing turns quickly in timed ${NM.cross} games, winning, solving ${NM.lock} words) and spend them on help like hints. Coin buttons are <b>blue</b> and take <b>two taps</b>, so you never spend by accident. Each game's How To Play has the details.</li>`)}
      ${sec('Game History', `
        <li><b>📜 Game History</b> (top corner of the Lobby) lists your last 100 results from every game, newest first: the date, the settings, the score and the coins won or spent. A green edge marks a win, a red edge a loss.</li>
        <li>Filter it by game (All, ${gimg('cross')} ${NM.cross}, ${gimg('lock')} ${NM.lock}), and tap any result to see its full result window again; ◂ History goes back to the list.</li>
        <li>It's kept on this device only, like your stats and coins.</li>`)}
      ${sec('Sound', `
        <li>Sound effects are <b>off</b> until you turn them on. Tap <b>🔇</b> (in the Lobby and in every game's header) to turn them on; it becomes <b>🔊</b>. Tap again to mute. One switch covers every game, and it's remembered on this device.</li>`)}
      ${sec('Offline', `
        <li>Once it has loaded, ${NM.suite} plays offline: no connection needed. Your games, stats, coins and settings stay on this device.</li>`)}
      <div class="row"><button class="btn primary" data-a="ok">Close</button></div>`);
    $('#sheet').onclick = e => {
      if (helpClick(e)) return;
      const h = e.target.closest('[data-h]');
      if (h) { if (h.dataset.h === 'cross') showHelp('cross'); else if (window.WordVault) window.WordVault.help(); return; }
      if (e.target.closest('[data-a]')) closeModal();
    };
  }
  function showHelp(which) {
    if (which === 'suite') { showSuiteHelp(); return; }
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
      <h2>How To Play ${gimg('cross')} ${NM.cross} <span class="chip">${APP_VER}</span></h2>
      <p>In ${NM.cross}, you and the Bot (a computer player) take turns filling the same crossword with letter tiles. Every tile you place correctly scores, finishing words scores more, and the highest score wins.</p>
      <p class="help-note">The first sections follow the ${NM.cross} Setup screen, top to bottom. Tap a heading to open it. Underlined names open their section. The Lobby, You, Game History, Sound and Offline are in How To Play ${NM.suite} (the ? in the Lobby).</p>
      ${sec('Bot', `
        <li>Each ${go('Challenge Level')} has its own Bot (a computer player), from Benny Bear 🐻 at level 1 to Professor Hoot 🦉 at level 10. Change the level and the Bot changes with it.</li>
        <li>Bots at levels 4–7 are <b>easygoing</b>: they play gentler than their puzzles, so the climb from 1 to 7 is gradual. Levels 8–10 are the <b>Master</b> levels, with a big step up in the Bot's skill.</li>
        <li>Under the Bot's name is your <b>won–lost record</b> against them.</li>
        <li>Point at the card with the mouse (or press and hold it on a touch screen) to read the Bot's personality: how they like to play.</li>`)}
      ${sec('Challenge Level', `
        <li>Runs from <b>1 · Gentle</b> to <b>10 · Ruthless</b>. It sets two things at once: the Bot's skill and the puzzle's difficulty.</li>
        <li>The Bot's skill rises gently from 1 to 7, then jumps at 8: levels 8–10 are the <b>Master</b> levels (see ${go('Bot')}). The puzzle's difficulty rises steadily at every level.</li>
        <li>As the level rises: words get longer and harder, and word and picture clues get trickier.</li>
        <li>Starter letters (gray, already on the grid) help new players: about a quarter of the letters at level 1, fewer at level 2, just 1–3 at level 3, and none from level 4. With fewer starters there are more tiles to play, so games run longer.</li>
        <li>Picture clues: at levels 1–5 the ${go('Clue Cards', 'clue card')} names the kind of picture clue (see ${go('Clue Pics')}); from level 6 you work it out yourself.</li>
        <li>From level 5, word clues turn punny: double meanings and wordplay. A "?" means don't take it literally.</li>`)}
      ${sec('Grid Size', `
        <li><b>Small</b> (5 × 6), <b>Medium</b> (6 × 7) or <b>Large</b> (7 × 11). Bigger grids mean more words, longer games and bigger scores.</li>`)}
      ${sec('Options', `
        <li>The five options you change least (${go('Letters in Hand')}, ${go('Bonus Squares')}, ${go('Clue Pics')}, ${go('Scoring')} and ${go('Timer')}) fold into one <b>▸ Options</b> row, so the Setup screen fits on one screen. The row shows your choices in one line, like "6 letters · Floating bonus · Some pics · Classic · Untimed".</li>
        <li>Tap it to open (▾) or close (▸) it. It stays the way you left it. ⚙ Settings in the game changes the same options.</li>
        <li><b>Grid Colors</b> (at the foot of Options, and in ⚙): five looks for the grid. <b>Board</b> (the default): empty cells are dark slots and played tiles are cream, with a colored bar for whose they are. <b>Inked</b>: no bars; your letters are blue, the Bot's red, starter letters black. <b>Inked Blue</b>: Inked, with this turn's tiles blue. <b>Painted</b>: solid blue and red tiles with white letters, light-gray starters. <b>Bold</b>: white empty cells and solid tiles. The change shows at once.</li>
        <li><b>Screen</b> (in ⚙ ${NM.suite} settings in the Lobby, and in ⚙ in the game; it changes every game): <b>Auto</b> follows your device's light or dark setting; <b>Light</b> and <b>Dark</b> stay put; <b>Night</b> is the dimmest look (charcoal grays, color only in the owner bars and clocks) for playing in the dark, with one fixed grid look.</li>
        <li>The Setup screen remembers your last choices. <b>⭐ Save as my defaults</b> keeps the Challenge Level, Grid Size and all the Options as your own defaults; <b>↺ Defaults</b> brings them back after you try something different (or the app's defaults, if you haven't saved any).</li>`)}
      ${sec('Letters in Hand', `
        <li>How many tiles each player holds: 4 to 8. Your hand refills from the bag after every turn.</li>
        <li>You can change it during a game in ⚙ (under "Changes now"). The new size starts with the next full round, for both hands: a smaller hand sends random tiles back into the bag, a bigger one draws more.</li>
        <li>More tiles give you more choices each turn. Fewer tiles make the <b>Full Hand</b> bonus easier to earn but smaller: it is worth 2 points for each tile in this setting (all 4 of 4 = +8, all 8 of 8 = +16). See ${go('Bonuses')}.</li>`)}
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
        <li>At levels 1–5 the ${go('Clue Cards', 'clue card')} names the kind; from level 6 you're on your own.</li>`)}
      ${sec('Scoring', `
        <li>Pick one of five scoring modes. The modes differ only in how tiles and words score. Everything else is the same in every mode:</li>
        <li class="help-sub"><b>In every mode</b></li>
        <li><span class="chip p5">+${R.plusCell}</span> cells add <b>${R.plusCell}</b> points.</li>
        <li><span class="chip p5">+${R.plus2Cell}</span> cells add <b>${R.plus2Cell}</b> points.</li>
        <li><span class="chip x2">2×</span> cells double the turn's points from tiles and words (see ${go('Bonuses')}).</li>
        <li><b>Full Hand</b>: <b>+${R.fullHandPerTile}</b> points per tile in your Letters in Hand setting (4 letters = +8 … 8 letters = +16).</li>
        <li><b>Wrong Cell</b>: each tile still in a wrong cell when you tap Done costs <b>${wrongMin} points</b>, or the tile's value if that is more. In Classic a wrong Q or Z costs 10 and a wrong E costs 2.</li>
        <li><b>Hint</b>, <b>Place</b>, <b>Check</b> and <b>+30s</b> cost <b>coins</b>, not points (see ${go('Coins')}).</li>
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
        <li>Each correct tile in a turn is worth 1 more than the one before: 1, 2, 3… Words score nothing extra. A wrong tile doesn't break the chain; it only costs its Wrong Cell penalty.</li>
        <li><i>Example:</i> 4 right tiles in one turn: 1 + 2 + 3 + 4 = <b>10</b>. 4 right tiles and 1 wrong one: still 10, minus the Wrong Cell.</li>
        ${modeH('bounty')}
        <li>Like Classic, but each letter's value is set by how often it appears in <b>this</b> grid (counting the starter letters), so the values change every game. They are shown on your tiles.</li>
        <li>A letter that appears once is worth <b>6</b>; twice, <b>4</b>; 3 times, <b>3</b>; 4 or 5 times, <b>2</b>; 6 times or more, <b>1</b>.</li>
        <li>Each tile scores its value. Finishing a word scores all its letters' values again, plus 2 per letter.</li>
        <li><i>Example:</i> in this grid J appears once (6), E appears 7 times (1) and T appears 4 times (2). E and T of JET are on the grid, and you place the rare J. The J scores 6. JET is finished: 6 + 1 + 2 = 9, plus 2 × 3 letters = 6, so the word scores 15. Your turn: <b>21</b>.</li>
        <li>If J and T were already there and you placed the common E instead, the word still scores 15, but the E adds only 1: <b>16</b>.</li>
        <li>Rare letters cut both ways: a J left in your hand at the end costs you 6, and a J in a wrong cell costs 6.</li>`)}
      ${sec('Timer', `
        <li><b>Untimed</b>: take as long as you like.</li>
        <li><b>Per turn</b> (Blitz · 30 s per TURN, or 1 to 5 min per TURN): when it runs out, your turn ends and the tiles you penciled in are checked, as if you had tapped Done.</li>
        <li><b>Whole game</b> (2 to 15 min <b>each</b>): you and the Bot each have your own clock of the same length, and each runs only on its own turns. The Bot's clock (beside its name) counts down while it plays: higher levels think faster, and at lower levels it sometimes runs out.</li>
        <li>When a side's clock reaches zero, tiles it hasn't confirmed with <b>Done</b> don't count, and it <b>stops</b>, and tiles left in its hand count against it. If <b>your</b> clock runs out, the Bot places all the tiles it can (from its hand and the bag) in <b>one quick 2-second sweep</b>, and the game ends. If <b>the Bot's</b> clock runs out, you <b>play on alone</b>, turn after turn, until your hand and the bag are empty, the grid is full, you pass 3 times in a row, or your own clock runs out. The red notice stays until you tap.</li>
        <li>Clocks never run while a ${go('Turn Reports and The Scoreboard', 'turn report')} is waiting for your tap, or while the game is paused.</li>
        <li>In the last 10 seconds the grid's border flashes every second: <b>yellow</b> from 10 to 6, <b>red</b> from 5 to 1.</li>`)}
      ${sec('Start and Resume', `
        <li><b>▶ Start ${NM.cross}</b>, at the foot of the Setup screen, starts a fresh puzzle with the settings above. In the Lobby, <b>🆕 New Game</b> on the ${NM.cross} card does the same in one tap, with your last settings.</li>
        <li><b>▶ Resume</b> appears (on the card, and at the top of the Setup screen) when you have an unfinished game. Your game is saved after every turn and whenever you leave it (☰, between the two scores, takes you straight back to the Lobby). Starting a new game then asks first.</li>
        <li>Under the Start button, your stats: games played, the share you won, your current and best winning streaks, and your top score (streaks and the top score count your last 100 games, from 📜 Game History).</li>
        <li><b>⚙</b> (among the buttons between the two scores) shows this game's settings in two parts. <b>Changes now</b>: Grid Colors and Screen change at once; Letters in Hand changes for both hands from the next round. <b>From your next game</b>: everything else. <b>New game with these</b> starts one now.</li>`)}
      ${sec('Clue Cards', `
        <li>Tap a clue in the grid (or point at it with a mouse) to see it enlarged on a clue card, with how many letters it has. Tap it again, or anywhere else, to close the card. Press and hold a clue to see the card only while you hold.</li>
        <li>In a clue, an orange <b style="color:#ff7a00">?</b> stands for a missing letter (like ?IRAFFE), and a thick orange bar for a missing word (like "Band-▬").</li>
        <li>At ${go('Challenge Level', 'Challenge Levels')} 1–5, a tricky picture clue's card also shows its kind, like "sounds like" (see ${go('Clue Pics')}). From level 6 there are no labels.</li>
        <li>Short messages (whose turn it is, red marks, clocks) appear for a few seconds just inside the top of the grid. The ones you must act on stay until they no longer apply.</li>`)}
      ${sec('The Grid', `
        <li>Gray CLUE CELLS hold the clues, and every one of them holds at least one. The orange arrow points to where the answer starts: ▶ runs right, ▼ runs down.</li>
        <li>The <b>top row</b> holds one clue per cell, for the word below it (▼). The <b>left column</b> holds one clue per cell, for the word to its right (▶).</li>
        <li>Every clue cell <b>inside</b> the grid holds two clues: the across clue on top (▶) and the down clue below (▼). Only clue cells in the <b>bottom row</b> (across only) or the <b>right column</b> (down only) hold one.</li>
        <li>Some answers are just 1 or 2 letters. A 1-letter clue may be a fill-in like ZEBR_ (A), a Roman numeral, a compass point or a T-shirt size.</li>
        <li>Tap a clue to read it on its card: see ${go('Clue Cards')}.</li>
        <li>Point at a clue with the mouse, or press and hold it on a touch screen, to see it enlarged across the grid.</li>
        <li>Some clues are pictures: see ${go('Clue Pics')}.</li>`)}
      ${sec('Your Turn', `
        <li>Drag tiles from your hand onto the cells where they belong, or tap a tile and then a cell. Place as many as you like. This turn's tiles are bright orange with a blue frame.</li> 
        <li>On a touch screen you can drag <b>two tiles at once</b>, one with each finger (handy on a tablet held in both hands).</li>
        <li><b>Tiles are only penciled in</b> until you tap ✓ Done, so a slip of the finger costs nothing: drag a tile you placed this turn to another cell, or back to your hand. Tapping it also takes it back.</li>
        <li>When you tap <b>Done</b>, every penciled tile is checked. Tiles in their correct cells lock in and score. Each tile in a wrong cell glows red and trembles, then bounces back to your hand and costs ${wrongMin} points (or the tile's value, if that is more). That check is final. Until you tap, its letter stays red in your hand and the wrong cell stays red and pulsing, so you can see the mistake (in a timed game that word stays sharp while the grid is blurred, and so does your hand). On a phone, your turn report waits until you tap away the red marks, so it never covers them (tap again to close it); on a wide screen it sits beside the grid. The report also says when the turn counts as a pass.</li>
        <li>Not sure? <b>☑️ Check</b> (see ${go('The Buttons')}) tests your penciled tiles before Done, for coins instead of points.</li>
        <li>A turn in which every tile bounces places nothing, so it counts as a pass. The Bot plays by the same rules.</li>
        <li>Drag tiles inside your hand to sort them your way. A gold space shows where the tile will land.</li>
        <li>Your hand refills from the bag after every turn as long as more tiles exist in the bag. Near the end of a game, the Bot may hold more tiles than you, requiring you to PASS until all tiles have been played (or three passes in a row have occurred to end the game).</li>`)}
      ${sec('The Buttons', `
        <li>Your hand and the buttons share the bottom row. On a phone, ✓ Done stays on the row and the other buttons open from <b>⋯ More</b>; in timed games your clock then shows under your score.</li>
        <li><b>💡 Hint (🪙${hintC})</b>: shows a cell where one of your tiles fits. It costs ${hintC} ${go('Coins', 'coins')}.</li>
        <li><b>🔦 Scan (🪙${SCAN_PER_TILE} per tile)</b>: stripes one empty cell for <b>each</b> tile still in your hand (tiles you have already penciled in don't count), so 5 tiles cost 🪙${5 * SCAN_PER_TILE}: cheaper than a Hint per tile. Only the cells are striped; you work out which tile goes where. Once per turn.</li>
        <li><b>🎯 Place (🪙?)</b>: puts one random tile from your hand into a cell where it fits. It costs that tile's value in coins (shown on the tile; 1 in modes without tile values), then scores like any tile you place. It's marked ✓ (known to fit).</li>
        <li><b>☑️ Check (🪙${R.checkBase}+)</b>: tests the tiles you've penciled in this turn. It costs ${R.checkBase} coins, plus ${R.checkPerWrong} for each wrong tile it finds. Wrong tiles go back to your hand with <b>no point penalty</b>; right ones get a ✓ (move one and it's unchecked again). Check needs <b>🪙${R.checkBase + R.checkPerWrong}</b> to start, then checks your tiles in the order you placed them. If it finds more wrong tiles than you can pay for, it takes your last coins for that tile and stops; any later tiles stay penciled in, unchecked.</li>
        <li>The coin buttons (💡 Hint, 🎯 Place, ☑️ Check, ⏱️ +30s) are <b>blue</b> (each icon on a navy circle) and sit together; on a phone they're the top row of ⋯ More.</li>
        <li>The game buttons (🔄 Swap, 🔀 Shuffle and the ⏸️ clock) are <b>gray and rounded</b>, as in ${NM.lock}.</li>
        <li><b>🔄 Swap</b>: trade some or all of your tiles for new ones from the bag. It ends your turn and counts as a pass.</li>
        <li><b>🔀 Shuffle</b>: mixes the order of your hand.</li>
        <li><b>⏸️ Pause</b> (or the P key) shows your clock in timed games. On a phone, tapping the clock under your score also pauses (and resumes) the game. It stops every clock and hides the grid, clues and hand; tap the PLAY PAUSED panel, ▶️, or P to resume. The game also pauses when you switch to another tab or app.</li>
        <li><b>⏱️ +30s (🪙${R.timeCost})</b> (timed games only): adds 30 seconds to your clock for ${R.timeCost} coins. Use it as often as you like. Bought time never pays speed coins.</li>
        <li><b>✓ Done</b> (green) checks and banks this turn's tiles. It shows how many are penciled in, like <b>Done · 3</b> (not the points, which would give away which tiles are right). With nothing placed it turns <b>orange</b> and reads <b>⏭ Pass</b>: orange means "think first", since a pass is sometimes needed but never a gain.</li>
        <li><b>Keyboard</b> (computers): <b>Enter</b> is ✓ Done. With nothing placed, press Enter <b>twice</b> within 3 seconds to pass (the button reads "Enter again to pass"). Enter also closes a waiting turn report or LAST CHANCE notice. <b>P</b> or <b>Space</b> pauses (press again to resume). <b>Z</b> is 🔍 zoom; <b>+</b> or <b>↑</b> zooms in, <b>−</b> or <b>↓</b> zooms out, <b>←</b> and <b>→</b> (or <b>Shift + ↑</b> and <b>Shift + ↓</b>) slide a zoomed grid, and <b>Esc</b> shows the whole grid again.</li>
        <li><b>🔍 Zoom</b> (among the buttons between the two scores): tap it, then tap the part of the grid you want; it fills the view. Tap 🔍 again for the whole grid, and twice more to go back to your last view. You can also pinch the grid (phones) or hold Ctrl and roll the mouse wheel (computers). Zoomed, drag the grid to slide it, use the arrows at its edges, or tap the small map in the corner to jump.</li>`)}
      ${sec('Bonuses', `
        <li><span class="chip x2">2×</span> doubles your turn's points from tiles and words. Each extra 2× in the same turn adds another double: 10 → 20 → 40 → 60.</li>
        <li><span class="chip p5">+${R.plusCell}</span> cells add ${R.plusCell} points, and <span class="chip p5">+${R.plus2Cell}</span> cells add ${R.plus2Cell} points. Both are added after doubling and are never doubled. +${R.plus2Cell} cells appear only with the Fixed or Both setting (see ${go('Bonus Squares')}).</li>
        <li><b>Full Hand</b>: place as many tiles in one turn as your ${go('Letters in Hand', '"Letters in Hand"')} setting (all 7 of 7, for example) to earn a bonus of ${R.fullHandPerTile} points per tile in that setting (+14 for 7 of 7, +8 for 4 of 4). A tile put down with 🎯 Place counts. A Full Hand bonus is added after doubling and is never doubled. Near the end of the game, when the bag is empty and your hand holds fewer tiles than the setting, it can't be earned.</li>
        <li>Bonus cells still open glow and pulse at three speeds: +${R.plus2Cell} slowest, +${R.plusCell} slowly, 2× quickly. The bigger the bonus, the faster the pulse. Once a tile is played there, the pulse stops and a small number in the corner shows the bonus it earned.</li>
        <li>Where bonus cells appear is set by ${go('Bonus Squares')}.</li>`)}
      ${sec('Turn Reports and The Scoreboard', `
        <li>After each turn, a report shows that player's TOTAL first, then a row for every word, bonus and penalty (+ added, − taken away). Coins spent or earned that turn show on a 🪙 line at the bottom; they never change the score. On wide screens it sits at the bottom of that player's Scoreboard column; on phones, at the bottom of the grid.</li>
        <li>While a report is on screen the game waits: your clock stops the moment the Bot finishes, and nothing can be played. <b>Click or tap anywhere</b> to close the reports and start your turn. That click does nothing else.</li>
        <li>The <b>Scoreboard</b> keeps every turn by round: letter points, word points, bonuses, penalties and the turn's total. Green marks the higher score in each round. On phones, tap ▸ Scoreboard to open it.</li>`)}
      ${sec('The End', `
        <li><b>Final turn:</b> once the bag is empty and either player places their last tile, the other player gets <b>one final turn</b> to play what they can. Then the game ends, and any tile still in a hand is subtracted from its owner's score.</li>
        <li>The game also ends when the grid is full, by the <b>3 PASSES Rule</b> (${esc(PASS_RULE)}), or after a whole-game clock runs out and the other side has finished.</li>
        <li>A <b>⏭ 1/3</b> counter in the grid's top-left corner (where the logo sits) counts passes in a row: yellow after the 1st pass, red after the 2nd. A pass is a ⏭ Pass, a 🔄 Swap, a turn where every tile bounced, or a turn clock that ran out. The 2nd pass also shows a red <b>LAST CHANCE</b> notice that says what caused it and <b>holds the game until you tap</b> (the Bot waits and your clock stops). The counter goes away (and the logo comes back) once someone places a tile.</li>
        <li>When the game ends, the grid stays on screen and the last play's tiles and words glow, so you can see the final play. <b>📊 See results</b> (or Enter) opens the result window.</li>
        <li>The result window shows both scores, your record against this Bot, both sides' play and your coins. Its buttons: <b>🔍 Grid</b> (look at the grid again), <b>⚙ Settings</b>, <b>☰ Lobby</b> and <b>Rematch</b>.</li>
        <li>Close it (✕, or tap outside it) to look at the finished grid. Your hand's row then becomes a <b>game-over bar</b> with <b>📊 Results</b> (opens the window again), <b>☰ Lobby</b> and <b>Rematch</b>.</li>
        <li>Every window closes the same way: ✕ in its top-right corner, a tap outside it, or its <b>Close</b> button.</li>`)}
      ${sec('Coins', `
        <li><b>🪙 Coins</b> are one currency shared by ${NM.cross} and ${NM.lock}. You start with <b>${COIN.start}</b>. Your balance shows in the Lobby, in the game's info line and above the ${NM.lock} grid; tap it for details and your latest coins.</li>
        <li><b>Spend them on</b> 💡 Hint (${hintC}), 🔦 Scan (${SCAN_PER_TILE} per tile), 🎯 Place (the tile's value), ☑️ Check (${R.checkBase} + ${R.checkPerWrong} per wrong tile) and ⏱️ +30s (${R.timeCost}) in ${NM.cross}, and 🔎 Hint (5) and 💡 Reveal (40 ÷ the word's letters, like ¹⁄₅ 🪙8) in ${NM.lock}. These cost coins, not points. Coin buttons are <b>blue</b>. Without enough coins the button is dimmed, and a tap tells you what it costs.</li>
        <li><b>Two taps to buy:</b> the first tap on a coin button lights it up and shows "Tap again · 🪙N" (for Place, the price of the tile it found; for Check, 🪙5+) for 3 seconds; the second tap buys. Tapping anywhere else, or waiting, cancels it. This stops accidental spending.</li>
        <li><b>Speed coins</b> (timed games only): end a turn that placed tiles and earn <b>1 coin for every second left</b> on your clock. A 1-minute turn finished in 35 seconds pays 25. The most a turn can pay is ${COIN.perTile} per tile placed, but there's <b>no cap</b> when you place every tile in your hand. Time bought with +30s doesn't count.</li>
        <li>With a <b>whole-game</b> clock, speed coins are paid once, when the game ends. Your clock is <b>shared evenly among your turns</b>: a 5-minute game in which you took 6 turns gives each turn 50 seconds. Each turn then pays like a per-turn game: the seconds it saved from its 50, up to ${COIN.perTile} per tile it placed (no cap if it emptied your hand); passes and swaps pay nothing. The total is never more than the time left on your clock, and nothing is paid if your clock runs out. <i>Example:</i> a turn that took 20 seconds and placed 2 tiles saved 30 seconds and pays 30 (its cap is 40).</li>
        <li><b>Untimed games</b> pay no speed coins.</li>
        <li><b>Winning</b> a game pays <b>+${COIN.win}</b>.</li>
        <li><b>${NM.lock}</b> pays coins for every word you solve: see its <b>?</b>.</li>
        <li>Each turn report shows that turn's coins on a 🪙 line, and the result screen totals the game's coins.</li>`)}
      ${sec('Sound', `
        <li>Sound effects are <b>off</b> until you turn them on. Tap <b>🔇</b> (top corner of the Lobby, and in every game's header) to turn them on; it becomes <b>🔊</b>. Tap again to mute. Your choice is remembered on this device.</li>
        <li>The sounds are short and soft: a click when a tile lands, a thunk when one doesn't fit, a chime when a word is finished, a clink for coins, a tick each second in the last 10, a two-note tone for a PASS, and a short tune when the game ends. Your device's own volume still applies.</li>`)}
      ${sec('Strategy', `
        <li>Don't rush. A word left with only one empty cell is a gift to the Bot. Sometimes it pays to <b>hold</b> a tile until you can finish the word yourself.</li>
        <li>It is often smart to save 2× squares for big turns because they double everything else you score that turn. Beware: the Bot can "steal" the bonus squares in the early rounds to keep you from scoring big.</li>`)}
      <div class="row"><button class="btn primary" data-a="ok">Close</button></div>`);
    // v07b (JM, CD-20: 3.3.1): a tap anywhere outside the How To Play panel closes it (v08f: openModal does this)
    const sheet = $('#sheet');
    sheet.onclick = e => { if (helpClick(e)) return; if (e.target.closest('[data-a]')) closeModal(); };
  }
  // v08f (JM CD-37: 5.1): How To Play sections, shared with LockWord. helpSec() draws one closed section;
  // helpClick() opens a tapped heading (closing the others) or follows a link to a section. Returns true if it acted.
  const helpId = title => title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const helpSec = (title, body) => `<section class="help-sec" data-sec="${helpId(title)}"><button class="help-h" type="button" aria-expanded="false">${title}<span class="hc" aria-hidden="true">▸</span></button><div class="help-b"><div><ul>${body}</ul></div></div></section>`;
  function helpClick(e) {
    const sheet = $('#sheet');
    const openSec = (s, open) => {
      sheet.querySelectorAll('.help-sec.open').forEach(x => { x.classList.remove('open'); x.querySelector('.help-h').setAttribute('aria-expanded', 'false'); });
      if (open) { s.classList.add('open'); s.querySelector('.help-h').setAttribute('aria-expanded', 'true'); }
    };
    const lk = e.target.closest('.help-link');
    if (lk) {
      e.preventDefault();
      const s = sheet.querySelector(`.help-sec[data-sec="${lk.dataset.go}"]`);
      if (!s) return true;
      // jump without the open/close animation, so the heading lands exactly at the top of the panel,
      // then flash the heading so the eye finds it
      sheet.classList.add('help-jump');
      openSec(s, true);
      sheet.scrollTop = s.getBoundingClientRect().top - sheet.getBoundingClientRect().top + sheet.scrollTop - 4;
      void sheet.offsetHeight;
      sheet.classList.remove('help-jump');
      s.classList.remove('flash'); void s.offsetWidth; s.classList.add('flash');
      setTimeout(() => s.classList.remove('flash'), 1300);
      return true;
    }
    const h = e.target.closest('.help-h');
    if (h) { const s = h.parentElement; openSec(s, !s.classList.contains('open')); return true; }
    return false;
  }
  $('#helpBtn').addEventListener('click', () => { if (G && !G.over && E.timerOf(G.settings.timer).kind !== 'none') setPaused(true); showHelp(); });
  // v06c (CD-18: 3.1a): the phone copies of ☰ and ? in the Scoreboard row do exactly what the top-bar buttons do
  $('#helpBtn2').addEventListener('click', () => $('#helpBtn').click());
  $('#menuBtn2').addEventListener('click', () => $('#menuBtn').click());

  // v08f (JM CD-37: 2.3): ☰ leaves at once, as in LockWord. The game is saved; Resume Game picks it up again.
  $('#menuBtn').addEventListener('click', () => leaveGame());

  // ⚙ CrossKeys settings (v08f, JM CD-37: 3.1, 4.1), like LockWord's: in the game's header and on the result window.
  // It opens with this game's settings. Changes become your settings for the next game (the menu shows them too);
  // "New game with these" starts one now (asking first if a game is unfinished).
  function gameSettings() {
    if (G && !G.over && E.timerOf(G.settings.timer).kind !== 'none') setPaused(true);
    const cur = Object.assign({}, settings, G ? G.settings : {}, { grid: settings.grid }); // v08j: grid colors are yours, not the game's
    const sizes = [...$('#sizeSeg').children].map(b => `<option value="${b.dataset.v}">${esc(b.textContent.trim())}</option>`).join('');
    // v08q (JM CD-58 add'l 3; CD-59: 1.2 YwC, 1.2.1): one window, two sections. "Changes now": Grid Colors and Screen
    // at once; Letters in Hand from the next full round of THIS game (and for your next games). "From your next game": the rest.
    const F = [['skill', 'Challenge Level', $('#skillSel').innerHTML], ['size', 'Grid Size', sizes],
      ['bonus', 'Bonus Squares', $('#bonusSel').innerHTML], ['pics', 'Clue Pics', $('#picsSel').innerHTML], ['scoring', 'Scoring', $('#scoringSel').innerHTML],
      ['timer', 'Timer', $('#timerSel').innerHTML]]; // v08j (CD-45: 2.2a)
    const live = G && !G.over;
    cur.hand = live ? (G.handNext != null ? G.handNext : G.settings.hand) : settings.hand;
    cur.screen = settings.screen || 'auto';
    openModal(`<h2>⚙ ${NM.cross} settings</h2>
      <h3 class="cd-sec">Changes now</h3>
      <label class="field cd-gridpick"><span class="lbl">Grid Colors</span><span class="gs-pick"><select data-k="grid">${gridOpts()}</select><span id="cdGridSample">${gridSample(settings.grid)}</span></span></label>
      <div class="vt-grid cd-set">
        <label class="field"><span class="lbl">Screen</span><select data-k="screen">${SCREEN_OPTS}</select></label>
        <label class="field"><span class="lbl">Letters in Hand${live ? ' <i>(next round)</i>' : ''}</span><select data-k="hand">${$('#handSel').innerHTML}</select></label>
      </div>
      <p class="help-note" id="cdHandNote"></p>
      <h3 class="cd-sec">From your next game</h3>
      <div class="vt-grid cd-set">${F.map(([k, l, o]) => `<label class="field"><span class="lbl">${l}</span><select data-k="${k}">${o}</select></label>`).join('')}</div>
      <p class="opt-desc" id="cdSetDesc"></p>
      <p class="help-note">${live ? '"New game with these" starts a new game now (this game is lost).' : '"New game with these" starts one now.'}</p>
      <div class="row"><button class="btn" data-a="close">Close</button><button class="btn primary" data-a="new">New game with these</button></div>
      ${slowDropRow()}`);
    const sels = [...document.querySelectorAll('#sheet select[data-k]')];
    for (const s of sels) { s.value = String(cur[s.dataset.k]); if (s.selectedIndex < 0) s.selectedIndex = 0; }
    const desc = () => { const v = sels.find(s => s.dataset.k === 'scoring').value; $('#cdSetDesc').textContent = (E.MODES[v] || E.MODES.classic).desc; };
    const handNote = () => {
      const n = $('#cdHandNote'); if (!n) return;
      n.textContent = live && G.handNext != null
        ? `Both hands become ${G.handNext} letters at the start of Round ${Math.ceil(G.turnNo / 2) + 1}; extra tiles go back into the bag at random.`
        : live ? `Both hands hold ${G.settings.hand} letters in this game.` : '';
    };
    const keep = () => {
      for (const s of sels) settings[s.dataset.k] = /^(skill|hand)$/.test(s.dataset.k) ? +s.value : s.value;
      saveSettings(); applyScreen(settings.screen);
      if (live) { E.setHandNext(G, settings.hand); save(); }
      if (G && !$('#game').hidden) { renderBoard(); render(); }
      const smp = $('#cdGridSample'); if (smp) smp.innerHTML = gridSample(settings.grid);
      handNote();
    };
    desc(); handNote();
    for (const s of sels) s.addEventListener('change', () => { keep(); desc(); });
    $('#sheet').onclick = e => {
      const b = e.target.closest('[data-a]'); if (!b) return;
      if (b.dataset.a === 'sdcopy') { copyText(slowDropText()); return; } // v09a: the slow-drop recorder
      if (b.dataset.a === 'sdclear') { store.set('cd.slowdrops', []); const r = $('#sdRow'); if (r) r.outerHTML = slowDropRow(); return; }
      // v08m (JM CD-51 strategic 3): save the choices BEFORE the window closes (v08L refreshed the gone sample first and stopped)
      if (b.dataset.a === 'new') keep();
      closeModal();
      if (b.dataset.a === 'new') startNewGame();
    };
  }
  $('#setBtn').addEventListener('click', gameSettings);
  $('#setBtn2').addEventListener('click', gameSettings);

  // =====================================================================
  // Turn flow
  // =====================================================================
  function save() { if (G) store.set('cd.save', G); }

  function startHumanTurn() {
    ui.bTurn0 = 0; // v08r: the Bot's per-TURN clock stops (renderOppClock clears its ticker)
    ui.pending = [];
    ui.selTile = null;
    ui.hintCell = -1; cancelDrag();
    ui.busy = false;
    ui.chainBroken = false;
    stopTimer();
    const tm = E.timerOf(G.settings.timer);
    ui.bought = 0; // v08: +30s time bought this turn (it never pays speed coins)
    ui.clk0 = G.clock; // v08b: the whole-game clock when this turn began (for the turn-split speed coins)
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

  // Whole-game clock reached zero. v08j (JM CD-45: 5.1a): tiles you penciled in but never confirmed with DONE don't
  // count (they go back to your hand). v08o (CD-52: 5.2): you stop, and the Bot plays on alone until it finishes. (Before v08j they scored
  // and the game ended at once, so running the clock down was a way to deny the rival its answer.)
  function clockOut() {
    if (!G || G.over || G.turn !== 0) return;
    closeZoom(true); cancelDrag();
    const back = ui.pending.length;
    Object.assign(ui, { pending: [], selTile: null, hintCell: -1, selSlot: -1, selCell: -1 });
    logMyTurn(0);
    const over = E.endTurn(G, 0, 'pass', 'clock');
    showReport(lastLog());
    // v08k (JM CD-46: 1.8.1): the notice stays until you tap, together with the PASS banner
    if (!over) toast(`Your clock ran out.${back ? ` Your ${back} unconfirmed tile${back > 1 ? 's' : ''} went back to your hand.` : ''} ${opp().n} now places all the tiles it can in one quick sweep; tiles left in your hand count against you.`, 'bad', 0); // v08o (CD-52: 5.2)
    else toast('Your clock ran out. Game over.', 'bad', 0);
    afterTurn(over);
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
  // v08b (JM CD-27 add'l 4): on phones, tapping the countdown clock under your score pauses (and resumes) the game
  $('#clkTop').addEventListener('click', () => setPaused(!ui.paused));
  $('#clkTop').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); setPaused(!ui.paused); } });
  $('#pauseOv').addEventListener('click', () => setPaused(false));
  document.addEventListener('keydown', e => {
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    // v08L (JM CD-49 add'l 2.6): Space pauses and resumes too (computers)
    if ((e.key === 'p' || e.key === 'P' || e.key === ' ') && G && !$('#game').hidden && $('#modal').hidden && !/^(INPUT|SELECT|TEXTAREA)$/.test((e.target.tagName || ''))) {
      e.preventDefault();
      setPaused(!ui.paused);
    }
    // v08g (JM CD-38 add'l 2; CD-39: 1.1–1.3): Enter plays the game from the keyboard. It closes a waiting turn report
    // or PASS banner; on your turn it is ✓ Done (tiles penciled in), and with nothing placed it takes TWO Enters within
    // 3 seconds to pass (the button reads "Enter again to pass"). Enter never re-clicks the last button you used.
    if (e.key === 'Enter' && G && !$('#game').hidden && $('#modal').hidden && e.target !== $('#clkTop')
      && !/^(INPUT|SELECT|TEXTAREA)$/.test((e.target.tagName || ''))) {
      e.preventDefault();
      if (document.activeElement && document.activeElement !== document.body && document.activeElement.blur) document.activeElement.blur();
      // v08j (CD-45: 3.1a): after the game, Enter closes the last report, then opens Results
      if (G.over) { if (repsOn()) clearReports(); else if ($('#modal').hidden) showResults(); return; }
      if (ui.paused || Date.now() < (ui.repAt || 0)) return;
      if (repsOn() || ui.wrong) { clearReports(); return; }
      if (!myTurn()) return;
      const db = $('#doneBtn');
      if (ui.pending.length) { disarm(db); onDone(); return; }
      if (db.classList.contains('armed')) { disarm(db); onDone(); return; }
      document.querySelectorAll('.btn.armed').forEach(disarm);
      db.dataset.arm = 'Enter again\nto pass';
      db.classList.add('armed');
      db._armT = setTimeout(() => disarm(db), ARM_MS);
    }
  });
  // Pause automatically when you switch to another tab or app
  document.addEventListener('visibilitychange', () => { if (document.hidden && G && !G.over && !$('#game').hidden) setPaused(true); });
  // Waits that respect Pause (used by the opponent's turn)
  // (v08d: and while a PASS banner holds the game)
  async function nap(ms) { await sleep(ms); while (ui.paused || ui.passHold) await sleep(150); }

  // v08d (JM CD-34: 4.1c): your penciled tiles are checked when the turn ends. Right ones score; wrong ones shake,
  // go back to your hand and each costs the Wrong Cell penalty. Returns how many tiles stayed on the board.
  // v08n (JM CD-52: 6.2.1.1; CD-54: 2.1): penciled tiles float above the grid; at Done the right ones settle into their
  // wells (a short drop, about 0.35 s) so you can see which tiles are now confirmed
  function settleTiles(cells) {
    if (!cells.length || reduceMotion()) return;
    const s = new Set(cells);
    ui.settle = s;
    setTimeout(() => { if (ui.settle === s) { ui.settle = null; if (G && !$('#game').hidden) renderBoard(); } }, 450);
  }
  function judgeMine(placements) {
    if (!placements.length) return 0;
    const r = E.judge(G, 0, placements);
    if (r.wrong.length) {
      showWrong(r.wrong, placements);
      // v08m (JM CD-51 add'l 2; CD-52: 2.3a): no "didn't fit" notice: the turn report says it (and "counts as a pass")
      if (navigator.vibrate) try { navigator.vibrate(60); } catch (e) { /* ignore */ }
    }
    return r.right.length;
  }
  // v08k (JM CD-46 add'l 4; CD-47: 2.1.1.1, WordGrams-style): a wrong tile glows red, its letter turns red and it
  // trembles in the cell for 0.5 s; then it bounces back to its place in your hand (about 1 s in all). Until you tap
  // anywhere, its letter stays red in your hand and the cell stays red inside, outlined and pulsing.
  // ui.wrong = { cells: cell → letter, tile: cell → tileId, tiles, words (shown sharp above a timed game's blur), phase }
  function showWrong(list, placements) {
    const pcs = new Set(placements.map(p => p.cell)), words = new Set();
    for (const p of list) {
      const ss = G.pz.cellSlots[p.cell] || [];
      // the word your tiles were building; a lone tile on a crossing shows both of its words (CD-47: 2.2.1)
      const lined = ss.filter(si => G.pz.slots[si].cells.some(c => c !== p.cell && pcs.has(c)));
      (lined.length ? lined : ss).forEach(si => words.add(si));
    }
    const w = ui.wrong = {
      cells: new Map(list.map(p => [p.cell, p.ch])), tile: new Map(list.map(p => [p.cell, p.tileId])),
      tiles: new Set(list.map(p => p.tileId)), words, phase: 'tremble', flying: new Set(reduceMotion() ? [] : list.map(p => p.tileId)) // hidden in the hand until it lands
    };
    sound.play('bounce'); // v08h
    setTimeout(() => flyBack(w), reduceMotion() ? 0 : 500);
  }
  function flyBack(w) {
    if (ui.wrong !== w || !G) return;
    const board = $('#board');
    const from = new Map([...w.cells.keys()].map(ci => [ci, board.children[ci] && board.children[ci].getBoundingClientRect()]));
    w.phase = 'gone';
    if ($('#game').hidden) w.flying.clear();
    render();
    if (!w.flying.size) return;
    for (const [ci, r0] of from) {
      const id = w.tile.get(ci), tEl = $(`#rack .tile[data-id="${id}"]`);
      if (!r0 || !tEl) { w.flying.delete(id); continue; }
      const r1 = tEl.getBoundingClientRect();
      const g = document.createElement('div');
      g.className = 'tile flyback';
      g.innerHTML = `<span class="ch">${w.cells.get(ci)}</span>`;
      Object.assign(g.style, { width: r1.width + 'px', height: r1.height + 'px', fontSize: getComputedStyle(tEl).fontSize });
      document.body.appendChild(g);
      // from the cell to the tile's place in the hand (transform-origin: top left)
      const a = `translate(${r0.left}px, ${r0.top}px) scale(${r0.width / r1.width}, ${r0.height / r1.height})`;
      const b = `translate(${r1.left}px, ${r1.top}px) scale(1, 1)`;
      const done = () => { g.remove(); w.flying.delete(id); if (ui.wrong === w && G) renderRack(); };
      if (g.animate) {
        const an = g.animate([{ transform: a }, { transform: b }], { duration: 480, easing: 'cubic-bezier(.34, 1.45, .64, 1)', fill: 'forwards' });
        an.onfinish = done; an.oncancel = done;
      } else { g.style.transform = b; setTimeout(done, 480); }
      setTimeout(() => { if (g.isConnected) done(); }, 1500); // never leave a copy behind
    }
    if (!w.flying.size) renderRack();
  }
  // the tap that closes the reports also clears the red marks (and the held notices)
  function clearWrong() {
    dropHeld();
    if (!ui.wrong) return false;
    ui.wrong = null;
    document.querySelectorAll('.flyback').forEach(g => g.remove());
    return true;
  }
  // v08k (CD-47: 2.2a, 2.2.1): in a timed game the grid blurs while a report is up (CD-43: 4.1a). The word(s) holding
  // a wrong cell, with their clue cells, are copied sharp on top of the blur until you tap.
  function sharpWords() {
    let ov = $('#sharpOv');
    const w = ui.wrong;
    const on = !!(w && G && !$('#game').hidden && $('#game').classList.contains('veiled'));
    if (!on) { if (ov) { ov.hidden = true; ov.innerHTML = ''; } return; }
    if (!ov) { ov = document.createElement('div'); ov.id = 'sharpOv'; ov.className = 'sharp-ov'; $('#game').appendChild(ov); } // under the reports (z 15) and banners
    const board = $('#board'), cells = new Set();
    for (const si of w.words) { const s = G.pz.slots[si]; s.cells.forEach(c => cells.add(c)); cells.add(s.clueCell); }
    const inner = document.createElement('div');
    inner.className = [...board.classList].filter(k => !k.startsWith('tf-')).join(' ');
    for (const ci of cells) {
      const src = board.children[ci];
      if (!src) continue;
      const r = src.getBoundingClientRect(), cp = src.cloneNode(true);
      if (zm.z > 1) { const zr = zoomer.getBoundingClientRect(); if (r.right < zr.left || r.left > zr.right || r.bottom < zr.top || r.top > zr.bottom) continue; } // v08m: off-view cells stay hidden
      Object.assign(cp.style, { position: 'fixed', left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', margin: 0 });
      inner.appendChild(cp);
    }
    ov.innerHTML = '';
    ov.appendChild(inner);
    ov.hidden = false;
  }
  // Wrong tiles shake in their cells for a moment, then the cells clear
  function bounce(list, ms = 900) {
    const m = new Map(list.map(p => [p.cell, p.ch]));
    ui.flash = m;
    sound.play('bounce'); // v08h
    setTimeout(() => { if (ui.flash === m) { ui.flash = null; if (G) render(); } }, ms);
  }

  function afterTurn(over) {
    save();
    if (over) { render(); gameOver(); return; }
    if (G.finalTurn === 1 && G.clockOut == null) toast(`You played every tile! ${opp().n} gets one final turn.`, '', 3200); // v08i
    if (G.turn === 0) { startHumanTurn(); return; } // v08o: the Bot's clock ran out, so you play on alone
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
    const n = judgeMine(placements);
    settleTiles(placements.filter(p => G.owner[p.cell] === 0).map(p => p.cell)); // v08n
    if (n) speedCoins(n);
    logMyTurn(n);
    const over = E.endTurn(G, n);
    // v08L (JM CD-49: 1.6.1.3): with wrong tiles, the turn report (and the timed blur) waits about 1 s, until they
    // have trembled and bounced back to your hand, so the whole routine can be seen
    const wait = ui.wrong && !reduceMotion() ? 1000 : 0;
    // v08p (JM CD-56 add'l 1.3.1; CD-57: 3.1): with red marks up, the Bot waits. Your tap clears them; only then does the
    // Bot play (its tiles animate), and the turn reports follow as usual. No clock runs meanwhile.
    const go = () => {
      if (ui.wrong) { ui.botWait = { over, tok: ui.token }; ui.busy = true; save(); render(); return; }
      showReport(lastLog()); afterTurn(over);
    };
    if (!wait) { go(); return; }
    ui.repAt = Date.now() + wait;
    ui.busy = true;
    save();
    render();
    const tok = ui.token;
    setTimeout(() => {
      ui.repAt = 0;
      if (tok !== ui.token || !G) return;
      go();
    }, wait);
  }
  $('#doneBtn').addEventListener('click', onDone);

  // ---------- Coins in the game (v08) ----------
  // Every coin spent or earned on a turn is also noted on that turn's report (item.c; item.v = 0, so no points change)
  function coinItem(kind, c, ch) {
    E.penalize(G, 0, 0, kind, ch);
    const its = G.turnItems[0];
    its[its.length - 1].c = c;
    if (c > 0) G.coinsIn = (G.coinsIn || 0) + c; else G.coinsOut = (G.coinsOut || 0) - c;
  }
  // Speed coins (CD-13: 5.3.1; CD-18: 8.1): per-turn clocks only, on a turn that placed tiles. 1 coin per whole second
  // left, not counting time bought with +30s. Capped at 20 per tile placed, with no cap when the hand was emptied.
  function speedCoins(n) {
    if (E.timerOf(G.settings.timer).kind !== 'turn') return;
    let c = Math.floor(Math.max(0, ui.left - (ui.bought || 0)) / 1000);
    if (G.hands[0].length) c = Math.min(c, COIN.perTile * n);
    if (c <= 0) return;
    coinItem('speed', c);
    coins.add(c, `Speed coins (${n} tile${n > 1 ? 's' : ''})`);
    toast(`🪙 +${c} speed coins`, 'you');
  }
  // v08b (JM CD-27: 2.3.1): whole-game clocks keep a record of each of your turns (time used, tiles, hand emptied),
  // so the end-of-game speed coins can be worked out turn by turn (see gameSpeedCoins)
  function logMyTurn(n) {
    if (E.timerOf(G.settings.timer).kind !== 'game') return;
    const used = Math.max(0, (ui.clk0 != null ? ui.clk0 : G.clock) + (ui.bought || 0) - G.clock);
    (G.myTurns = G.myTurns || []).push({ u: used, n, e: n > 0 && !G.hands[0].length });
  }
  // Whole-game speed coins: the TURN-SPLIT cap (v08b). Your clock is shared evenly among the turns you took
  // (5 min over 6 turns = 50 s each). Each turn then pays like a per-turn game: the seconds it saved from its share,
  // up to 20 per tile it placed, with no cap when it emptied your hand; a pass or swap pays nothing. The total can never
  // exceed the seconds actually left on your clock (bought time excluded). So the pay follows how you played this game:
  // a long clock used for few, quick, big turns pays well; a long clock with many small turns pays little.
  function gameSpeedCoins() {
    const T = E.timerOf(G.settings.timer).secs * 1000, turns = G.myTurns || [];
    const left = Math.floor(Math.max(0, G.clock - (G.boughtMs || 0)) / 1000);
    if (!turns.length) return { total: Math.min(left, COIN.perTile * G.stats.placed[0]), share: 0, turns: 0 }; // games saved by v08
    const share = T / turns.length;
    let total = 0;
    for (const t of turns) {
      if (!t.n) continue;
      let c = Math.floor(Math.max(0, share - t.u) / 1000);
      if (!t.e) c = Math.min(c, COIN.perTile * t.n);
      total += c;
    }
    return { total: Math.min(total, left), share: Math.round(share / 1000), turns: turns.length };
  }

  // =====================================================================
  // v08o (JM CD-51 strategic 1; CD-52: 5.1–5.3): the Bot's own whole-game clock
  // Same length as yours. Each Bot turn spends "thinking time" from it, on paper (nobody waits): a share of the clock
  // per tile it places, times its level's pace and a little chance. Higher levels think faster; at levels 1–7 the
  // clock runs out now and then (simulated: about 1 game in 7 at level 1, 1 in 10 at 2–3, a few in 100 at 4–7, almost
  // never at 8–10).
  // =====================================================================
  const BOT_PACE = [0.86, 0.84, 0.81, 0.77, 0.75, 0.73, 0.71, 0.55, 0.5, 0.45]; // share of its clock it expects to use, by level
  const gauss = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const botTimed = () => !!G && E.timerOf(G.settings.timer).kind === 'game';
  function botThinkMs(tiles) {
    const T = E.timerOf(G.settings.timer).secs * 1000;
    if (!G.bt) { // set once per game: the clock's share per tile (the Bot places about half the open cells) and its mood
      let open = 0;
      for (let i = 0; i < G.pz.N; i++) if (G.pz.cells[i].k !== 'c' && !G.board[i]) open++;
      G.bt = { tile: T / Math.max(4, (open + tiles) / 2), mood: Math.max(0.8, Math.min(1.2, 1 + gauss() * 0.08)) };
    }
    const pace = BOT_PACE[Math.max(1, Math.min(10, G.settings.skill)) - 1];
    const luck = Math.exp(gauss() * 0.33 - 0.054); // averages 1
    return Math.round(G.bt.tile * Math.max(0.6, tiles) * pace * G.bt.mood * luck);
  }
  // Spends this turn's thinking time; the clock beside the Bot's name counts down while it plays. True if it ran out.
  function botClockTurn(tiles) {
    if (!botTimed() || G.clockOut === 1) return false;
    if (G.bclock == null) G.bclock = E.timerOf(G.settings.timer).secs * 1000;
    const from = G.bclock, to = Math.max(0, from - botThinkMs(tiles));
    G.bclock = to;
    ui.bAnim = { from, to, t0: Date.now(), dur: 400 + tiles * 430 };
    clearInterval(ui.bAnimT);
    ui.bAnimT = setInterval(() => { renderOppClock(); if (!ui.bAnim || Date.now() - ui.bAnim.t0 > ui.bAnim.dur) { ui.bAnim = null; clearInterval(ui.bAnimT); renderOppClock(); } }, 200);
    return to <= 0;
  }
  function renderOppClock() {
    const el = $('#clkOpp');
    // v08r (JM CD-62: 1.2.1; CD-63: 1.1a): per-TURN games give the Bot a matching clock too (mirrored top boxes): its full
    // turn time, dimmed while waiting, counting down during its thinking pause
    const tk = G ? E.timerOf(G.settings.timer) : null;
    if (G && tk.kind === 'turn') {
      el.hidden = false;
      const run = G.turn === 1 && !G.over && !!ui.bTurn0;
      el.textContent = '⏱ ' + fmtClock(run ? Math.max(0, tk.secs * 1000 - (Date.now() - ui.bTurn0)) : tk.secs * 1000);
      el.classList.toggle('idle', !run); el.classList.remove('out');
      if (!run && ui.bTurnT) { clearInterval(ui.bTurnT); ui.bTurnT = 0; }
      return;
    }
    el.classList.remove('idle');
    if (!G || !botTimed()) { el.hidden = true; return; }
    el.hidden = false;
    const a = ui.bAnim, ms = a ? a.from - (a.from - a.to) * Math.min(1, (Date.now() - a.t0) / a.dur) : (G.bclock != null ? G.bclock : E.timerOf(G.settings.timer).secs * 1000);
    el.textContent = G.clockOut === 1 ? '⏱ 0:00' : '⏱ ' + fmtClock(ms);
    el.classList.toggle('out', G.clockOut === 1);
  }
  // The Bot's clock reached zero during its turn: its penciled tiles don't count, and you play on alone
  function botClockOut(n) {
    G.bclock = 0;
    const over = E.endTurn(G, 0, 'pass', 'clock');
    showReport(lastLog());
    save();
    ui.busy = false;
    sound.play('bounce');
    if (!over) toast(`${opp().n}'s clock ran out.${n ? ` Its ${n} penciled tile${n > 1 ? 's' : ''} didn't count.` : ''} You play on alone until you finish (your clock keeps running).`, 'opp', 0);
    else toast(`${opp().n}'s clock ran out. Game over.`, 'opp', 0);
    if (over) { render(); gameOver(); return; }
    startHumanTurn();
  }

  // v08p (JM CD-57 add'l 1): once your whole-game clock has run out, the Bot no longer plays on turn by turn. All of its
  // remaining turns are worked out at once (hand and bag tiles, same rules), then its new tiles appear across the grid
  // in one 2-second sweep and the game ends. Its own clock is not charged for this.
  async function botSpeedRun() {
    const token = ui.token;
    ui.busy = true;
    ui.selSlot = -1; ui.selCell = -1; cancelDrag();
    render();
    await nap(700);
    if (token !== ui.token || !G) return;
    const before = G.board.slice();
    let over = false, guard = 0;
    while (!over && G.turn === 1 && guard++ < 300) {
      const plan = E.aiPlan(G);
      const r = E.judge(G, 1, plan.map(s => ({ cell: s.cell, tileId: s.tileId, ch: s.ch })));
      over = E.endTurn(G, r.right.length);
    }
    const fresh = [];
    for (let i = 0; i < G.board.length; i++) if (G.board[i] && !before[i]) fresh.push(i);
    save();
    // reveal row by row, top-left to bottom-right, over 2 s in all
    ui.hide = new Set(fresh);
    render();
    const step = fresh.length ? 2000 / fresh.length : 0;
    let lastSnd = 0;
    for (const ci of fresh) {
      await nap(step);
      if (token !== ui.token || !G) { ui.hide = null; return; }
      ui.hide.delete(ci);
      ui.pop = ci;
      if (Date.now() - lastSnd > 90) { sound.play('opp'); lastSnd = Date.now(); }
      render();
    }
    ui.hide = null;
    settleTiles(fresh);
    ui.busy = false;
    if (over || G.over) { render(); gameOver(); return; }
    if (G.turn === 0) { startHumanTurn(); return; }
    render(); gameOver();
  }
  async function runAiTurn() {
    const token = ui.token;
    if (G.clockOut === 0) { botSpeedRun(); return; } // v08p: your clock ran out: the Bot finishes in one 2 s sweep
    ui.busy = true;
    // v08r: the Bot's per-TURN clock runs while it thinks
    if (E.timerOf(G.settings.timer).kind === 'turn') { ui.bTurn0 = Date.now(); clearInterval(ui.bTurnT); ui.bTurnT = setInterval(renderOppClock, 250); }
    ui.selSlot = -1; ui.selCell = -1; cancelDrag();
    render();
    await nap(650 + Math.random() * 650);
    if (token !== ui.token) return;
    const plan = E.aiPlan(G);
    // v08o (JM CD-52: 5.1): with a whole-game clock the Bot spends "thinking time" from its own clock (on paper: nobody
    // waits). If this turn would use more than it has left, its clock runs out: the tiles it pencils in don't count.
    const bOut = botClockTurn(plan.length);
    // v08d: the opponent pencils its tiles in too (a careless one may slip a tile into a wrong cell);
    // they are checked at its DONE, by the same rule as yours
    const steps = [];
    ui.aiPending = new Map();
    for (const step of plan) {
      ui.aiPending.set(step.cell, step.ch);
      ui.pop = step.cell;
      steps.push({ cell: step.cell, tileId: step.tileId, ch: step.ch });
      sound.play('opp'); // v08h
      render();
      await nap(430);
      if (token !== ui.token) return;
    }
    ui.aiPending = null;
    if (bOut) { botClockOut(steps.length); return; }
    const r = E.judge(G, 1, steps);
    settleTiles(r.right.map(p => p.cell)); // v08n: the Bot's right tiles settle too
    if (r.wrong.length) {
      bounce(r.wrong); // v08m (CD-52: 2.3a): no "didn't fit" notice; the Bot's turn report lists them
    }
    const over = E.endTurn(G, r.right.length);
    showReport(lastLog());
    save();
    ui.busy = false;
    if (over) { render(); gameOver(); return; }
    if (G.finalTurn === 0) toast(`${opp().n} played every tile. Your FINAL TURN: play all you can.`, 'opp', 3600); // v08i
    if (G.turn === 1) { runAiTurn(); return; } // v08o: your clock ran out, so the Bot plays on alone
    startHumanTurn();
  }

  // Place one of your tiles on a cell
  // v08d (JM CD-34: 4.1c): no instant check. The tile is penciled in and can be moved or taken back until DONE
  // (ok = already known to fit: placed by 🎯 Place, or passed a ☑️ Check)
  function placeTile(tileId, ci, ok, quick) {
    if (!myTurn()) { if (quick) render(); return; }
    const t = G.hands[0].find(x => x.id === tileId);
    const c = G.pz.cells[ci];
    if (!t || !c || c.k !== 'l' || G.board[ci] || ui.pending.some(p => p.cell === ci) || ui.pending.some(p => p.tileId === tileId)) {
      ui.selTile = null; render(); return;
    }
    ui.pending.push({ cell: ci, tileId, ch: t.ch, ok: !!ok });
    ui.selTile = null;
    if (ui.hintCell === ci) ui.hintCell = -1;
    ui.selSlot = pickSlot(ci);
    ui.selCell = ci;
    ui.pop = ci;
    sound.play('land'); // v08h
    if (quick && quickPaint(ci, t.ch)) { renderSoon(); return; }
    render();
  }

  // v09a (JM CD-70: 2.2.1; CD-71: 2.1b, seen on iPad): a dropped tile sometimes hung just short of its cell for up to
  // ~3 s. The whole screen (hand, grid, clue bar, scores) was redrawn before the device showed anything new, so the
  // last picture, with the tile still in mid-air, stayed up while that ran. Now the tile is drawn in its cell at once,
  // and the full redraw follows right after that picture is on screen.
  function quickPaint(ci, ch) {
    const el = $(`#board .cell[data-i="${ci}"]`);
    if (!el || !el.classList.contains('let')) return false;
    el.classList.add('pending', 'popin');
    el.innerHTML = tileInner(ch);
    return true;
  }
  let soonT = 0;
  function renderSoon() {
    if (soonT) return;
    soonT = requestAnimationFrame(() => setTimeout(() => { soonT = 0; render(); }, 0)); // after the next picture
  }

  // v09a (JM CD-71: 2.2 Y): the slow-drop recorder. Any tile drop that takes longer than a third of a second to show
  // (from the finger lifting to the finished redraw) is noted on this device, newest first (up to 40), with what was
  // slow: waiting for the device to pass on the finger lifting, drawing the tile, or the full redraw. ⚙ CrossKeys
  // settings shows the count, with Copy (a list to paste to Claude) and Clear.
  const SLOW_MS = 333;
  function timeDrop(ev) {
    const now = performance.now();
    const ts = ev && ev.timeStamp > 0 && now - ev.timeStamp < 60000 ? ev.timeStamp : now; // when the finger lifted
    const wait = now - ts;
    return () => {
      const drawn = performance.now() - ts;
      // after the full redraw (queued just before this) and the picture after it
      requestAnimationFrame(() => setTimeout(() => requestAnimationFrame(() => {
        const total = performance.now() - ts;
        if (total < SLOW_MS) return;
        const list = store.get('cd.slowdrops', []);
        list.unshift({ at: new Date().toISOString().slice(0, 19).replace('T', ' ') + ' UT', ms: Math.round(total),
          wait: Math.round(wait), drawn: Math.round(drawn), redraw: Math.round(ui.lastRenderMs || 0),
          grid: G ? G.pz.C + '×' + G.pz.R : '', tiles: ui.pending.length, screen: document.documentElement.dataset.screen || '',
          dev: (navigator.userAgent.match(/iPad|iPhone|Android|Windows|Macintosh/) || ['?'])[0] + ' ' + innerWidth + '×' + innerHeight });
        store.set('cd.slowdrops', list.slice(0, 40));
      }), 0));
    };
  }
  function slowDropRow() {
    const n = store.get('cd.slowdrops', []).length;
    return `<p class="sd-row" id="sdRow">🐢 Slow tile drops recorded on this device: <b>${n}</b>${n ? ' <button class="btn mini" data-a="sdcopy" type="button">📋 Copy for Claude</button> <button class="btn mini" data-a="sdclear" type="button">Clear</button>' : ''}</p>`;
  }
  function slowDropText() {
    const list = store.get('cd.slowdrops', []);
    return `${NM.cross} slow tile drops (${APP_VER}), newest first. ms = finger lift to finished redraw; wait = before the game heard the lift; drawn = tile shown; redraw = full redraw time.\n` +
      list.map(d => `${d.at} · ${d.ms} ms (wait ${d.wait}, drawn ${d.drawn}, redraw ${d.redraw}) · grid ${d.grid} · ${d.tiles} penciled · ${d.screen} · ${d.dev}`).join('\n');
  }
  function copyText(s) {
    const done = () => toast('📋 Copied: paste it into your reply to Claude.');
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(s).then(done, () => copyOld(s, done));
    else copyOld(s, done);
  }
  function copyOld(s, done) {
    const ta = document.createElement('textarea'); ta.value = s; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (err) { toast('Copy did not work on this device.'); } ta.remove();
  }

  // v08k (JM CD-46 add'l 2.2): which word's clue lights up when a tile lands on cell ci. Before, it was always the
  // Across word, so a Down clue never lit. Now: the word your penciled tiles line up in; then the word you had chosen;
  // then the word closer to complete (Across on a tie).
  function pickSlot(ci) {
    const ss = G.pz.cellSlots[ci] || [];
    if (ss.length < 2) return ss.length ? ss[0] : -1;
    const pc = new Set(ui.pending.map(p => p.cell).filter(c => c !== ci));
    const lined = ss.map(si => G.pz.slots[si].cells.filter(c => pc.has(c)).length);
    if (lined[0] !== lined[1]) return ss[lined[0] > lined[1] ? 0 : 1];
    if (ss.includes(ui.selSlot)) return ui.selSlot;
    const full = ss.map(si => { const cs = G.pz.slots[si].cells; return cs.filter(c => G.board[c] || pc.has(c)).length / cs.length; });
    return ss[full[1] > full[0] ? 1 : 0];
  }

  // Move a tile penciled in this turn: to another cell (it is unchecked again there) or back to the hand
  function movePending(ci, target) {
    const idx = ui.pending.findIndex(p => p.cell === ci);
    if (idx < 0 || !target) { render(); return; }
    if (target.closest('#rack')) { ui.pending.splice(idx, 1); render(); return; }
    const ni = +target.dataset.i;
    if (ni === ci || G.board[ni] || ui.pending.some(p => p.cell === ni)) { render(); return; }
    const p = ui.pending.splice(idx, 1)[0];
    placeTile(p.tileId, ni);
  }

  // Board taps
  $('#board').addEventListener('click', e => {
    if (!G || clickSuppressed()) return;
    const cl = e.target.closest('.cl');
    if (cl) {
      const si = +cl.dataset.s;
      ui.selSlot = ui.selSlot === si && ui.selCell < 0 ? -1 : si; ui.selCell = -1; render();
      // v08p (CD-57: 1.4): a tap opens the clue's enlarged card (a 2nd tap on it, or a tap elsewhere, closes it).
      // With a mouse, pointing already opened it: the click leaves it open.
      const was = zoom.tapSi; zoom.tapSi = -1;
      if (zoom.open && zoom.si === si && !zoom.tap) return;
      if (was === si) { closeZoom(); return; }
      openZoom(si); zoom.tap = true; zoom.tapSi = -1;
      return;
    }
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
  // cancelDrag() drops every drag cleanly (used when a turn ends mid-drag: time-out, pause, leaving the game),
  // so no tile is ever left stuck on screen (CD-6: 6.1.1).
  // v08g (JM CD-38 add'l 3, CD-39: 2.1–2.2a): on touch screens two fingers can each drag a tile at the same time
  // (opts.multi: hand and penciled tiles). Each drag follows its own finger (pointerId). A tile being dragged stays
  // dimmed even if the hand or grid is redrawn (ui.dragTiles / ui.dragCells), and its drop still counts.
  const drags = new Map(); // pointerId -> { abort, multi }
  const MAX_DRAGS = 2;
  ui.dragTiles = new Set(); ui.dragCells = new Set();
  function cancelDrag() {
    for (const d of [...drags.values()]) d.abort();
    drags.clear();
    document.querySelectorAll('.ghost').forEach(g => g.remove());
    document.querySelectorAll('.drop').forEach(d => d.classList.remove('drop'));
    ui.dragTiles.clear(); ui.dragCells.clear();
    ui.dragging = false;
  }
  function drag(e, el, find, onDrop, onTap, onMove, opts) {
    opts = opts || {};
    e.preventDefault();
    if (!opts.multi || [...drags.values()].some(d => !d.multi)) cancelDrag();
    else {
      if (drags.has(e.pointerId)) drags.get(e.pointerId).abort();
      if (drags.size >= MAX_DRAGS) return;
    }
    const sx = e.clientX, sy = e.clientY, pid = e.pointerId;
    const lift = e.pointerType === 'touch' ? 46 : 0;
    let ghost = null, over = null;
    try { el.setPointerCapture(pid); } catch (err) { /* ignore */ }
    const at = (x, y) => { const t = document.elementFromPoint(x, y - lift); return t ? find(t) : null; };
    const place = (x, y, up2) => { ghost.style.transform = `translate(${x - 29}px, ${y - 29 - lift - (up2 || 0)}px)`; };
    // v08k (JM CD-46 add'l 1): phones send up to 120 finger moves a second; the cell under the finger is now looked up
    // once per screen refresh (the latest position wins), not on every move
    let raf = 0, tmo = 0, lastEv = null;
    const unsched = () => { if (raf) cancelAnimationFrame(raf); if (tmo) clearTimeout(tmo); raf = tmo = 0; };
    const move = ev => {
      if (ev.pointerId !== pid) return;
      lastEv = ev;
      if (!raf) { raf = requestAnimationFrame(step); tmo = setTimeout(step, 60); } // (the timer only if no refresh comes)
    };
    const step = () => {
      unsched();
      const ev = lastEv;
      if (!ev || drags.get(pid) !== me) return;
      if (!ghost && Math.hypot(ev.clientX - sx, ev.clientY - sy) > 8) {
        ghost = el.cloneNode(true);
        ghost.className = 'tile ghost';
        ghost.removeAttribute('style');
        place(ev.clientX, ev.clientY); // positioned before it appears, so it never flies in from a corner (CD-6: 9.1)
        document.body.appendChild(ghost);
        el.classList.add('dragging');
        if (opts.tileId != null) ui.dragTiles.add(opts.tileId);
        if (opts.cell != null) ui.dragCells.add(opts.cell);
        me.moving = true;
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
      unsched();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      if (over) over.classList.remove('drop');
      if (ghost) ghost.remove();
      el.classList.remove('dragging', 'placeholder');
      if (opts.tileId != null) ui.dragTiles.delete(opts.tileId);
      if (opts.cell != null) ui.dragCells.delete(opts.cell);
      if (drags.get(pid) === me) drags.delete(pid);
      ui.dragging = [...drags.values()].some(d => d.moving);
    };
    const up = ev => {
      if (ev.pointerId !== pid) return;
      if (raf) step(); // a quick flick: catch up on the last move first
      const dragged = !!ghost;
      const fin = dragged ? timeDrop(ev) : null; // v09a: the slow-drop recorder
      detach();
      if (dragged) {
        suppressClick();
        // the tile may have gone away (e.g. the turn ended); then just redraw. A two-finger drag's tile may have
        // been redrawn by the other finger's drop: its drop still counts (the drop handlers check the tile by id)
        if ((!opts.multi && !el.isConnected) || !G || G.over) { if (G) render(); return; }
        onDrop(ev.type === 'pointerup' ? at(ev.clientX, ev.clientY) : null);
        fin();
      } else if (ev.type === 'pointerup' && onTap && el.isConnected) onTap();
    };
    const me = { abort: detach, multi: !!opts.multi, moving: false };
    drags.set(pid, me);
    // listen on the window, so the release is caught even if the tile was redrawn mid-drag
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  }

  // v08i (JM CD-42 add'l 3): a two-finger drag could leave a tile stuck half in a cell (a leftover drag copy, or the
  // hand's slide-apart offsets) until Pause redrew the screen. Now, once the last finger lifts, anything left over from
  // a drag is swept away and the hand and grid are redrawn, just as Pause did.
  function sweepDrags() {
    if (drags.size) cancelDrag();
    const left = document.querySelectorAll('.ghost, .tile.dragging, .tile.placeholder, .cell.drop');
    const shifted = [...$('#rack').children].some(c => c.style.transform);
    if (!left.length && !shifted) return;
    document.querySelectorAll('.ghost').forEach(g => g.remove());
    document.querySelectorAll('.cell.drop').forEach(d => d.classList.remove('drop'));
    clearSortPreview();
    ui.dragTiles.clear(); ui.dragCells.clear(); ui.dragging = false;
    if (G) render();
  }
  const touchesDone = e => { if (!e.touches.length) setTimeout(sweepDrags, 80); }; // no finger is down: no drag can still be alive
  document.addEventListener('touchend', touchesDone, { passive: true });
  document.addEventListener('touchcancel', touchesDone, { passive: true });

  // v08j (JM CD-44: 1.12.1; CD-45: 1.1c Android + Chrome, 1.2 Y): on phones one of two dragged tiles "fell off" its
  // finger. Phone browsers take a finger away from the page (pointercancel, so the tile drops back) when they decide it
  // is starting a browser gesture: a long press (Android's press-and-hold menu, which the hand never blocked; only the
  // grid did), a pinch-zoom or a scroll. Now, while any tile is being dragged, those gestures are blocked for every finger.
  const dragLive = () => drags.size > 0;
  // v08k (JM CD-46 add'l 1): these two blocking touch listeners now sit only on the hand and the grid, where tiles are
  // dragged (and nothing scrolls anyway). In v08j they sat on the whole page, so Chrome made every tap and swipe
  // anywhere wait for the game first (part of the lag).
  // (a second finger only: blocking the first finger's touchstart would also cancel ordinary taps)
  const tStart = e => { if (dragLive() && e.touches.length > 1 && e.cancelable) e.preventDefault(); };
  const tMove = e => { if (dragLive() && e.cancelable) e.preventDefault(); };
  for (const el of [$('#rack'), $('#board')]) {
    el.addEventListener('touchstart', tStart, { passive: false });
    el.addEventListener('touchmove', tMove, { passive: false });
  }
  document.addEventListener('contextmenu', e => { if (dragLive() || e.target.closest('#rack, #board, .ghost')) e.preventDefault(); });
  document.addEventListener('gesturestart', e => { if (dragLive()) e.preventDefault(); }); // iPhone / iPad pinch

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
        // v09a: the tile is drawn in its cell at once (and leaves the hand at once); the full redraw follows
        if (t.classList.contains('let')) { el.style.visibility = 'hidden'; placeTile(id, +t.dataset.i, false, true); return; }
        reorderHand(id, ui.sortK);
      },
      () => { if (myTurn()) { ui.selTile = ui.selTile === id ? null : id; render(); } },
      (x, y, over) => sortPreview(id, el, x, over),
      { multi: e.pointerType === 'touch', tileId: id });
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
    drag(e, el, t => t.closest('.cell.let') || t.closest('#rack'), t => movePending(ci, t), null, null, { multi: e.pointerType === 'touch', cell: ci });
  });

  $('#mixBtn').addEventListener('click', () => {
    if (!G || G.over) return;
    const h = G.hands[0];
    for (let i = h.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [h[i], h[j]] = [h[j], h[i]]; }
    save();
    render();
  });

  // v08L (JM CD-49 add'l 2.7; CD-50: 7.1a, 7.2.1, 7.3, 7.4a): 🔦 Scan lights one cell for EACH tile still in your hand
  // (not the ones already penciled in), for 🪙2 per tile: a cheaper shortcut than a 💡 Hint per tile. Once per turn.
  // Only the cells glow; you still work out which tile goes where. A tile that fits in more than one cell gets one of
  // them at random, and no two tiles share a cell.
  function scanPlan() {
    const pc = new Set(ui.pending.map(p => p.cell)), used = new Set(ui.pending.map(p => p.tileId));
    const tiles = G.hands[0].filter(t => !used.has(t.id));
    for (let i = tiles.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [tiles[i], tiles[j]] = [tiles[j], tiles[i]]; }
    const cells = new Set();
    for (const t of tiles) {
      const opts = [];
      for (let i = 0; i < G.pz.N; i++) { const c = G.pz.cells[i]; if (c.k === 'l' && !G.board[i] && c.s === t.ch && !pc.has(i) && !cells.has(i)) opts.push(i); }
      if (opts.length) cells.add(opts[Math.floor(Math.random() * opts.length)]);
    }
    return { tiles: tiles.length, cells };
  }
  function scanUsed() { return !!(G && G.scan && G.scan.t === G.turnNo); }
  function scanTiles() { return G ? G.hands[0].length - ui.pending.length : 0; }
  $('#scanBtn').addEventListener('click', () => {
    if (!myTurn()) return;
    if (scanUsed()) { toast('🔦 Scan is once per turn'); return; }
    const n = scanTiles();
    if (n <= 0) { toast('All your tiles are already on the grid'); return; }
    const price = n * SCAN_PER_TILE;
    if (coins.bal >= price && !armTap($('#scanBtn'), price)) return; // two taps buy, as with every coin button
    const plan = scanPlan();
    if (!plan.cells.size) { toast('No cells to show'); return; }
    const cost = plan.cells.size * SCAN_PER_TILE; // you only pay for cells it shows
    if (!coins.spend(cost, 'Scan')) return;
    coinItem('scan', -cost);
    G.scan = { t: G.turnNo, cells: [...plan.cells] }; // kept in the save, so a reload keeps the glow
    toast(`🔦 Scan · 🪙−${cost}. ${plan.cells.size} striped cell${plan.cells.size > 1 ? 's' : ''}: one for each tile in your hand.`, '', 3200);
    save();
    render();
  });

  $('#hintBtn').addEventListener('click', () => {
    if (!myTurn()) return;
    const h = E.hint(G, 0, { tiles: new Set(ui.pending.map(p => p.tileId)), cells: new Set(ui.pending.map(p => p.cell)) });
    if (!h) { toast('No hint available'); return; }
    const cost = E.RULES.hintCost; // v08: coins, not points
    if (coins.bal >= cost && !armTap($('#hintBtn'), cost)) return; // v08c: second tap buys
    if (!coins.spend(cost, 'Hint')) return;
    coinItem('hint', -cost);
    ui.hintCell = h.cell;
    ui.selTile = h.tileId;
    ui.selSlot = pickSlot(h.cell);
    ui.selCell = h.cell;
    toast(`Hint · 🪙−${cost}. Tap the glowing cell to place it.`);
    save();
    render();
  });

  // Place (JM, CD-7 add'l 1.1): one random tile from your hand goes into a cell where it fits; costs that tile's value
  $('#placeBtn').addEventListener('click', () => {
    if (!myTurn()) return;
    const a = E.autoPlace(G, 0, { tiles: new Set(ui.pending.map(p => p.tileId)), cells: new Set(ui.pending.map(p => p.cell)) });
    if (!a) { toast('None of your tiles fits an open cell'); return; }
    const cost = Math.max(1, a.cost); // v08: coins, not points (the tile's value; 1 in modes without values)
    // v08c: second tap buys. The tile is picked at random on each tap, so the armed price is the one that tap found;
    // the buying tap keeps that same tile (ui.armPlace) so the price you saw is the price you pay.
    if (coins.bal >= cost) {
      if (!$('#placeBtn').classList.contains('armed')) { ui.armPlace = a; armTap($('#placeBtn'), cost); return; }
      armTap($('#placeBtn'), cost);
    }
    if (ui.armPlace && G.hands[0].some(t => t.id === ui.armPlace.tileId) && !ui.pending.some(p => p.cell === ui.armPlace.cell)) Object.assign(a, ui.armPlace);
    ui.armPlace = null;
    const paid = Math.max(1, a.cost);
    if (!coins.spend(paid, `Place ${a.ch}`)) return;
    coinItem('place', -paid, a.ch);
    ui.hintCell = -1;
    placeTile(a.tileId, a.cell, true);
    toast(`Placed ${a.ch} · 🪙−${paid}`);
    save();
  });

  // ☑️ Check (v08d, JM CD-34: 4.1c, 4.1.1): tests your penciled tiles now, before DONE. Costs 5, plus a 5-coin
  // "work fee" for each wrong tile it finds. Wrong tiles go back to your hand with no point penalty; right ones
  // get a ✓ and stay penciled in (moving one makes it unchecked again).
  // v08e (JM CD-36: 3.1): "Check as far as you can pay". It needs 🪙10 to start (the base + one wrong tile) and checks
  // tiles in the order you placed them. A wrong tile it can't fully pay for takes your last coins, and Check stops
  // there: later tiles stay penciled in, unchecked.
  $('#checkBtn').addEventListener('click', () => {
    if (!myTurn()) return;
    const unk = ui.pending.filter(p => !p.ok);
    if (!unk.length) { toast('Nothing to check: pencil in a tile first'); return; }
    const need = checkNeed();
    if (coins.bal < need) {
      toast(`Not enough coins: Check needs 🪙${need} to start, you have 🪙${coins.bal}`, 'bad', 3200);
      return;
    }
    if (!armTap($('#checkBtn'), `${E.RULES.checkBase}+`)) return; // second tap buys
    const per = E.RULES.checkPerWrong;
    let left = coins.bal - E.RULES.checkBase, cost = E.RULES.checkBase, n = 0;
    const wrong = [], right = [];
    for (; n < unk.length; n++) {
      const p = unk[n];
      if (E.fits(G, p.cell, p.ch)) { right.push(p); continue; }
      const fee = Math.min(per, left);
      wrong.push(p); cost += fee; left -= fee;
      if (fee < per) { n++; break; } // out of coins: stop after this tile
    }
    const skipped = unk.length - n;
    if (!coins.spend(cost, 'Check')) return;
    coinItem('check', -cost);
    for (const p of right) p.ok = true;
    if (wrong.length) {
      ui.pending = ui.pending.filter(p => !wrong.includes(p));
      bounce(wrong);
    }
    const okN = right.length;
    const stop = skipped ? ` · out of coins: ${skipped} tile${skipped > 1 ? 's' : ''} left unchecked` : '';
    toast((wrong.length
      ? `☑️ ${wrong.map(p => p.ch).join(', ')} didn't fit (back in your hand)${okN ? ` · ${okN} OK` : ''} · 🪙−${cost}`
      : `☑️ All ${okN} fit · 🪙−${cost}`) + stop, wrong.length ? 'bad' : 'you', skipped ? 4200 : 3000);
    save();
    render();
  });

  // +30s (JM, CD-7 add'l 1.2): timed games only; 30 more seconds on your clock for 5 points, as often as you like
  $('#timeBtn').addEventListener('click', () => {
    if (!myTurn()) return;
    const tm = E.timerOf(G.settings.timer);
    if (tm.kind === 'none') return;
    if (coins.bal >= E.RULES.timeCost && !armTap($('#timeBtn'), E.RULES.timeCost)) return; // v08c: second tap buys
    if (!coins.spend(E.RULES.timeCost, '+30s')) return; // v08: coins, not points
    coinItem('time', -E.RULES.timeCost);
    if (tm.kind === 'turn') { ui.left += E.RULES.timeAdd; ui.bought = (ui.bought || 0) + E.RULES.timeAdd; }
    else { G.clock += E.RULES.timeAdd; G.boughtMs = (G.boughtMs || 0) + E.RULES.timeAdd; }
    toast(`+30 s · 🪙−${E.RULES.timeCost}`);
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
      logMyTurn(0);
      const over = E.endTurn(G, 0, 'swap');
      showReport(lastLog());
      // v08d: no pass pill; the PASS banner reports the swap
      afterTurn(over);
    };
  });

  // =====================================================================
  // Hover-zoom: enlarged CLUE WORD / CLUE PIC at the grid's center,
  // with a trace line from its CLUE CELL (and back again on close)
  // =====================================================================
  const zoom = { si: -1, wait: -1, timer: 0, open: false, geo: null, gen: 0, held: false, tap: false, tapSi: -1 };
  // v08p: a card opened by a tap closes at the next tap anywhere outside the grid's clue cells
  window.addEventListener('pointerdown', e => { if (zoom.open && zoom.tap && !e.target.closest('#board .cl')) closeZoom(); }, true);
  function clEl(si) { return $(`#board .cl[data-s="${si}"]`); }
  function stopAnims(el) { if (el.getAnimations) el.getAnimations().forEach(a => a.cancel()); }

  function openZoom(si) {
    const el = clEl(si);
    if (!el || ui.dragging || !G) return;
    const s = G.pz.slots[si];
    const z = $('#zoom'), ln = $('#traceLine');
    const br = visBoardRect(), cr = el.getBoundingClientRect(); // v08m: the part of the grid on screen
    let cx = br.left + br.width / 2;
    let cy = br.top + br.height / 2;
    const fx = cr.left + cr.width / 2, fy = cr.top + cr.height / 2;
    // The card spans the full width of the grid (JM, CD-7: 6.1), and never leaves the window
    const cardW = Math.min(innerWidth - 16, Math.max(br.width, 260));
    const inner = cardW - 36; // card padding
    let body;
    if (s.clue.pic) body = `<div class="z-pic" style="font-size:${Math.round(Math.min(170, Math.max(br.height * 0.42, 90), (inner * 0.85) / picUnits(s.clue.pic)))}px">${picHTML(s.clue.pic)}</div>`
      + (s.clue.cap ? `<div class="z-word" style="font-size:40px">${clueMarks(s.clue.t)}</div>` : '');
    else {
      const longest = Math.max(...s.clue.t.split(/\s+/).map(w => w.length));
      const f = Math.max(18, Math.min(84, inner / (longest * 0.64), Math.max(br.height * 0.2, 40)));
      body = `<div class="z-word" style="font-size:${Math.round(f)}px">${clueMarks(s.clue.t)}</div>`;
    }
    const ztag = picTag(s) ? picTag(s) + ' · ' : '';
    // Caption: a taller band with larger, pure-white text (JM, CD-7: 6.2)
    z.innerHTML = body + `<div class="z-sub">${ztag}${s.d === 'A' ? '→ across' : '↓ down'} · ${s.cells.length} letters</div>` + zoomProg(s);
    z.style.maxWidth = 'none';
    z.style.width = Math.round(cardW) + 'px';
    stopAnims(z); stopAnims(ln);
    z.hidden = false;
    // v08L (JM CD-49 add'l 2.5): the size above is a guess for a narrow typeface that phones may not have. Measure the
    // word now and shrink it until the longest word fits, so it is never clipped (an overflowing line also looked
    // left-aligned)
    const zw = z.querySelector('.z-word');
    if (zw) { let f = parseFloat(zw.style.fontSize); for (let k = 0; k < 30 && zw.scrollWidth > zw.clientWidth + 0.5 && f > 12; k++) { f = Math.max(12, f * 0.93); zw.style.fontSize = f.toFixed(1) + 'px'; } }
    // v06c (JM, CD-18: 2.1–2.2): the card keeps clear of the finger (or mouse pointer). A clue in the lower half of
    // the grid puts the card at the top of the grid, one in the upper half puts it at the bottom; if the card is tall,
    // it moves further (past the grid's edge if needed, never off screen) so it never covers the clue being held.
    const zh = z.offsetHeight, gap = 8;
    cx = Math.min(innerWidth - cardW / 2 - gap, Math.max(cardW / 2 + gap, cx)); // v08L: the whole card stays on screen
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
    Object.assign(zoom, { open: true, si, geo: { away, len }, tap: false });
    zoom.gen++;
  }

  function closeZoom(instant) {
    clearTimeout(zoom.timer); zoom.timer = 0; zoom.wait = -1;
    if (!zoom.open) return;
    zoom.open = false; zoom.si = -1; zoom.tap = false;
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
    zoom.tapSi = zoom.open && zoom.tap ? zoom.si : -1; // v08p: a 2nd tap on the same clue closes its card
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
    resetZoom(); ui.layoutKey = ''; layout(); // v08m: the whole grid at the end
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
    sound.play(r.winner === 0 ? 'win' : r.winner === 1 ? 'lose' : 'draw', 0.5); // v08h
    const title = r.winner === 0 ? `${myName() === 'You' ? 'You win' : myName() + ' wins'}!` : r.winner === 1 ? `${o.n} wins` : 'It\'s a draw';
    const st = G.stats;
    const ended = r.complete ? 'The grid is complete.' : r.reason === 'clock' ? (G.clock <= 0 && G.bclock === 0 ? 'Both whole-game clocks ran out.' : G.clockOut === 0 ? `Your whole-game clock ran out, and ${o.n} placed the rest of its tiles in one sweep.` : `${o.n}'s whole-game clock ran out, and you played on alone to the end.`)
      : r.reason === 'out' ? `${G.outBy === 0 ? 'You' : o.n} played every tile, and ${G.outBy === 0 ? o.n : 'you'} had one final turn.`
      : 'Three passes in a row ended the game (3 PASSES Rule).';
    // v08 coins at the end: whole-game clocks pay their speed coins once, here; a win pays +10.
    // v08b (CD-27: 2.3.1): the whole-game pay uses the turn-split cap (gameSpeedCoins); nothing if the clock ran out.
    const endCoins = [];
    if (!G.coinsPaid) {
      G.coinsPaid = true;
      if (E.timerOf(G.settings.timer).kind === 'game' && st.placed[0] > 0 && r.reason !== 'clock') {
        const gs = gameSpeedCoins();
        if (gs.total > 0) { coins.add(gs.total, 'Speed coins (game clock)'); endCoins.push([gs.turns ? `Speed, game clock (${gs.share} s per turn × ${gs.turns})` : 'Speed, game clock', gs.total]); }
      }
      if (r.winner === 0) { coins.add(COIN.win, NM.cross + ' win'); endCoins.push(['Win', COIN.win]); }
    }
    // v08b (CD-27: 2.4.1): the result is grouped: the two scores, then Play, Help used, Coins and your Record
    const cs = {};
    for (const e of G.log || []) if (e.p === 0) for (const x of e.items || []) if (x.c) cs[x.k] = (cs[x.k] || 0) + x.c;
    const coinRows = [];
    if (cs.speed) coinRows.push(['Speed, turn by turn', cs.speed]);
    for (const x of endCoins) coinRows.push(x);
    if (cs.hint) coinRows.push([`Hint ×${st.hints[0]}`, cs.hint]);
    if (cs.scan) coinRows.push([`Scan ×${(G.log || []).reduce((a, e) => a + (e.p === 0 ? (e.items || []).filter(x => x.k === 'scan' && x.c).length : 0), 0)}`, cs.scan]); // v08L
    if (cs.place) coinRows.push([`Place ×${(st.places || [0])[0]}`, cs.place]);
    if (cs.time) coinRows.push([`+30s ×${(st.time || [0])[0]}`, cs.time]);
    // v08e: ☑️ Check was missing from this table (and from "This game"); its count comes from the turn log
    if (cs.check) coinRows.push([`Check ×${(G.log || []).reduce((a, e) => a + (e.p === 0 ? (e.items || []).filter(x => x.k === 'check' && x.c).length : 0), 0)}`, cs.check]);
    const net = coinRows.reduce((a, x) => a + x[1], 0);
    const sg = v => (v < 0 ? '−' + -v : '+' + v);
    const coinTbl = `<h3 class="res-h">🪙 Coins</h3><table class="score-table coin-tbl">`
      + (coinRows.length ? coinRows.map(x => `<tr><td>${esc(x[0])}</td><td class="${x[1] < 0 ? 'neg' : 'pos'}">${sg(x[1])}</td></tr>`).join('') : '<tr><td>No coins earned or spent</td><td>0</td></tr>')
      + `<tr class="total"><td>This game ${sg(net)} · Balance</td><td data-coins>${coins.bal}</td></tr></table>`;
    // v08e (JM CD-36: 5.2, 5.3.1): the same layout as LockWord's result. One-line heading; the Record right under the
    // scores; no "Help you used" table (the Coins table already lists Hint ×N, Place ×N…); Play and Coins side by side
    // on wide screens; the buttons on a bar pinned to the bottom of the window.
    const resBody = `
        <div class="res-top"><span class="res-face">${face}</span><span class="res-title">${esc(title)}</span></div>
        <p class="res-sub">${ended}</p>
        <div class="res-big"><div class="me"><span>${esc(myName())}</span><b>${G.scores[0]}</b></div><div class="them"><b>${G.scores[1]}</b><span>${esc(o.n)}</span></div></div>
        <p class="rec-line"><span class="rl-a">Record vs ${esc(o.n)}:</span><span class="rl-b"><i class="w">${rec.w} won</i> · <i class="l">${rec.l} lost</i>${rec.d ? ` · ${rec.d} drawn` : ''}</span></p>
        <div class="res-cols"><section>
        <table class="score-table play-tbl">
          <tr><th class="res-h">${gimg('cross')} Play</th><th>${esc(myName())}</th><th>${esc(o.n)}</th></tr>
          <tr><td>Words finished</td><td>${st.words[0]}</td><td>${st.words[1]}</td></tr>
          <tr><td>Tiles placed</td><td>${st.placed[0]}</td><td>${st.placed[1]}</td></tr>
          <tr><td>Full Hand bonuses</td><td>${st.fullHands[0]}</td><td>${st.fullHands[1]}</td></tr>
          <tr><td>Wrong cells</td><td>${st.wrong[0]}</td><td>${st.wrong[1]}</td></tr>
          <tr><td>Tiles left (subtracted)</td><td>−${r.leftover[0]}</td><td>−${r.leftover[1]}</td></tr>
          <tr class="total"><td>Final score</td><td>${G.scores[0]}</td><td>${G.scores[1]}</td></tr>
        </table></section>
        <section>${coinTbl}</section></div>`;
    // v08c (CD-30: 4.5): one History entry per finished game
    if (!G.histSaved) {
      G.histSaved = true;
      const sz = { S: 'Small', M: 'Medium', L: 'Large' }[G.settings.size] || '';
      hist.add({ g: 'duel', win: r.winner === 0, title: `${r.winner === 0 ? 'Won' : r.winner === 1 ? 'Lost' : 'Drew'} vs ${o.n} [${G.settings.skill}]`,
        sub: [sz, timerLabel()].filter(Boolean).join(' · '), score: `${G.scores[0]}–${G.scores[1]}`, coins: net, html: resBody });
    }
    ui.resBody = resBody;
    // v08j (JM CD-44 add'l 1; CD-45: 3.1a): Results no longer opens by itself. The grid stays up with the final play
    // glowing; the game-over bar's "📊 See results ▸" (or Enter) opens it.
    ui.resSeen = false;
    render(); // the game-over bar replaces the hand
  }
  // v08f (JM CD-37: 2.1, 3.1): the result window's buttons are ⚙ Settings · ☰ Lobby · Rematch (the same three as Word
  // Vault's). ✕ or a tap outside closes it and shows the finished grid with its game-over bar (📊 Results reopens it).
  function showResults() {
    if (!G || !G.over || !ui.resBody) return;
    if (!ui.resSeen) { ui.resSeen = true; render(); } // the final-play glow ends once Results has been seen
    openModal(`${ui.resBody}
      <div class="row res-bar"><button class="btn" data-a="grid" title="Close Results and look at the grid">🔍 Grid</button><button class="btn" data-a="set">⚙ Settings</button><button class="btn" data-a="menu">☰ Lobby</button><button class="btn primary" data-a="again">Rematch</button></div>`, 'res', { close: render });
    $('#sheet').onclick = e => {
      const b = e.target.closest('[data-a]');
      if (!b) return;
      closeModal();
      overAction(b.dataset.a);
    };
  }
  function overAction(a) {
    if (a === 'again') {
      const s = G.settings;
      Object.assign(settings, { skill: s.skill, size: s.size, hand: s.hand, timer: s.timer, scoring: s.scoring || 'classic', bonus: s.bonus || 'floating', pics: s.pics || 'some' });
      saveSettings();
      startNewGame();
    }
    else if (a === 'menu') leaveGame();
    else if (a === 'set') gameSettings();
    else if (a === 'res') showResults();
    else render();
  }
  $('#overBar').addEventListener('click', e => { const b = e.target.closest('[data-ob]'); if (b) overAction(b.dataset.ob); });

  // =====================================================================
  // Boot
  // =====================================================================
  // v07c: the LockWord mini-game (lockword.js) shares the menu's modal, toasts, storage and avatar list
  window.CDUI = {
    $, esc, store, toast, openModal, closeModal, APP_VER, AVATARS, coins, coinPill, COIN, // v08: coins shared with LockWord
    armTap, history: hist, // v08c: two-tap coin buttons; Game History shared with LockWord
    helpSec, helpClick, // v08f: How To Play sections shared with LockWord
    showScreen, goHome: () => { showScreen('home'); renderHome(); }, lobby: () => renderHome(), // v10: the Lobby (refreshed once LockWord has loaded)
    settings: () => settings,
    GI, gimg, // v09a: the game icons
    sound, // v08h: sound effects (and the 🔇 / 🔊 buttons) shared with LockWord
    _render: () => render(), _G: () => G // v08k: for timing checks only
  };
  sound.paint();
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
