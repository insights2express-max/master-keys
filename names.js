/* Master Keys — the game names, kept in ONE place (v09, JM CD-46: 3.1–3.3b; CD-58; CD-59: 3.1).
   Change a name here and every screen, window title, How To Play text and button follows (the Lexicon page reads
   this file too when tools/build-lexicon-table.ps1 rebuilds it). The installed-app name in manifest.webmanifest is the
   one exception: it holds the suite name as plain text.
   fka (formerly known as): Master Keys = the app formerly called Clue Duel; CrossKeys = Clue Duel; LockWord = Word Vault.
   v11: KeyRing, the word builder (JM CD-87: 1.1). */
window.MK_NAMES = {
  suite: 'Master Keys', // the whole app (the menu title, the browser tab, the installed icon)
  cross: 'CrossKeys',   // the crossword tile game against the Bot (was Clue Duel)
  lock: 'LockWord',     // the word-guessing game (was Word Vault)
  ring: 'KeyRing'       // v11: the word builder (spell words from a ring of letters)
};
// Fills every element marked data-mk="suite" / "cross" / "lock" / "ring" with its name (the static HTML holds the same text),
// plus aria-label / title text marked data-mk-aria="…{cross}…". This file loads first, at the end of <body>, so the
// page is already there; app.js and lockword.js then add the player's own LockWord name, if one was set.
(function () {
  const N = window.MK_NAMES, put = s => s.replace(/\{(suite|cross|lock|ring)\}/g, (m, k) => N[k]);
  document.querySelectorAll('[data-mk]').forEach(el => { const n = N[el.dataset.mk]; if (n) el.textContent = n; });
  document.querySelectorAll('[data-mk-aria]').forEach(el => { const s = put(el.dataset.mkAria); el.setAttribute('aria-label', s); });
  document.title = document.title.replace(/^[^·]*·/, N.suite + ' ·');
  const at = document.querySelector('meta[name="apple-mobile-web-app-title"]'); if (at) at.content = N.suite;
})();
