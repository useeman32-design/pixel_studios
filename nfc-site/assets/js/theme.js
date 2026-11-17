/* ============================================================
   PIXEL STUDIOS · Theme controller (light / dark)
   ------------------------------------------------------------
   The initial theme is set by a tiny inline bootstrap in <head>
   (before first paint, so there is no flash). This file wires
   the toggle buttons, persists the choice and follows the OS
   preference until the user decides manually.

   Storage key : ps_theme  ("light" | "dark")
   Markup hook : any <button data-theme-toggle>
   Logo swap   : pure CSS — each slot holds both logo variants
                 and [data-theme] shows the right one.
   ============================================================ */
(function () {
  'use strict';
  var KEY = 'ps_theme';
  var root = document.documentElement;

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function system() {
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
  }
  function current() {
    var t = root.getAttribute('data-theme');
    return (t === 'light' || t === 'dark') ? t : (stored() === 'light' || stored() === 'dark' ? stored() : system());
  }
  function apply(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem(KEY, t); } catch (e) { /* private mode */ }
    var btns = document.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      btns[i].setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
    }
    var evt = null;
    try { evt = new CustomEvent('ps:theme', { detail: { theme: t } }); } catch (e) { return; }
    window.dispatchEvent(evt);
  }
  function toggle() { apply(current() === 'dark' ? 'light' : 'dark'); }

  document.addEventListener('click', function (e) {
    var b = e.target && e.target.closest ? e.target.closest('[data-theme-toggle]') : null;
    if (b) { e.preventDefault(); toggle(); }
  });

  /* follow the OS until the user has an explicit preference */
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: light)');
    var onChange = function (ev) { if (!stored()) apply(ev.matches ? 'light' : 'dark'); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  /* sync other open tabs */
  window.addEventListener('storage', function (e) {
    if (e.key === KEY && (e.newValue === 'light' || e.newValue === 'dark')) root.setAttribute('data-theme', e.newValue);
  });

  apply(current());
  window.PSTheme = { get: current, set: apply, toggle: toggle };
})();
