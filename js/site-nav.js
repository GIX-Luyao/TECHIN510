/* ======================================================
   TECHIN 510 – Site Navigation
   Hamburger toggle + active page highlighting + theme toggle
   ====================================================== */
(function () {
  'use strict';

  // --- Theme Toggle ---
  var THEME_KEY = 'techin510-theme';
  var saved = localStorage.getItem(THEME_KEY);
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  }

  function createThemeToggle() {
    var nav = document.querySelector('.site-nav');
    if (!nav) return;

    var btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.setAttribute('aria-label', 'Toggle light/dark mode');
    btn.textContent = isLight() ? '\u2600' : '\u263E'; // ☀ or ☾

    btn.addEventListener('click', function () {
      var next = isLight() ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(THEME_KEY, next);
      btn.textContent = next === 'light' ? '\u2600' : '\u263E';
    });

    nav.appendChild(btn);
  }

  function isLight() {
    return document.documentElement.getAttribute('data-theme') === 'light';
  }

  createThemeToggle();

  // --- Hamburger Toggle ---
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });

    // Close menu when a link is clicked (mobile)
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        links.classList.remove('open');
      }
    });
  }

  // --- Highlight current page ---
  var current = location.pathname.split('/').pop() || 'index.html';
  var navLinks = document.querySelectorAll('.site-nav-links a');
  navLinks.forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();
