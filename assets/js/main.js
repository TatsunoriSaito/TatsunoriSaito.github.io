/* Tatsunori Saito — site behavior (vanilla JS, no dependencies) */
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var nav = document.getElementById('site-nav');
  var toggle = document.querySelector('.nav-toggle');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header border on scroll ---------- */
  function onScroll() {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  function setNav(open) {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }
  toggle.addEventListener('click', function () {
    setNav(toggle.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setNav(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setNav(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('is-open') && !header.contains(e.target)) setNav(false);
  });

  /* ---------- Scroll spy (active nav link) ---------- */
  var links = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  function updateActive() {
    var offset = header.offsetHeight + window.innerHeight * 0.25;
    var current = sections[0];
    sections.forEach(function (s) {
      if (s.getBoundingClientRect().top - offset <= 0) current = s;
    });
    // At the very bottom of the page, highlight the last section.
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      current = sections[sections.length - 1];
    }
    links.forEach(function (a) {
      var active = a.getAttribute('href') === '#' + current.id;
      a.classList.toggle('is-active', active);
      if (active) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () { updateActive(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', updateActive);
  updateActive();

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Publication filters (type + first-author toggle) ---------- */
  var filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  var firstBtn = document.querySelector('[data-filter-first]');
  var groups = document.querySelectorAll('.pub-year-group');
  var pubs = document.querySelectorAll('.pub');
  var emptyMsg = document.querySelector('.pub-empty');
  var state = { type: 'all', firstOnly: false };

  function matches(pub, type, firstOnly) {
    return (type === 'all' || pub.getAttribute('data-type') === type) &&
           (!firstOnly || pub.getAttribute('data-first') === 'true');
  }

  // Show how many entries each filter button would display.
  function updateCounts() {
    filterBtns.forEach(function (btn) {
      var n = 0;
      pubs.forEach(function (pub) {
        if (matches(pub, btn.getAttribute('data-filter'), state.firstOnly)) n++;
      });
      var badge = btn.querySelector('.filter-count');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'filter-count';
        btn.appendChild(badge);
      }
      badge.textContent = n;
    });
  }

  function applyFilters() {
    var anyVisible = false;
    groups.forEach(function (group) {
      var visibleInGroup = 0;
      group.querySelectorAll('.pub').forEach(function (pub) {
        var show = matches(pub, state.type, state.firstOnly);
        pub.hidden = !show;
        if (show) visibleInGroup++;
      });
      group.hidden = visibleInGroup === 0;
      if (visibleInGroup) {
        anyVisible = true;
        group.classList.add('is-visible');
      }
    });
    if (emptyMsg) emptyMsg.hidden = anyVisible;
    updateCounts();
  }

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      state.type = btn.getAttribute('data-filter');
      filterBtns.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      applyFilters();
    });
  });

  if (firstBtn) {
    firstBtn.addEventListener('click', function () {
      state.firstOnly = !state.firstOnly;
      firstBtn.classList.toggle('is-active', state.firstOnly);
      firstBtn.setAttribute('aria-pressed', String(state.firstOnly));
      applyFilters();
    });
  }
  updateCounts();

  /* ---------- BibTeX toggle + copy ---------- */
  document.querySelectorAll('.bib-toggle').forEach(function (btn) {
    var pre = btn.closest('.pub-main').querySelector('.bibtex');
    if (!pre) return;

    if (navigator.clipboard) {
      var copy = document.createElement('button');
      copy.type = 'button';
      copy.className = 'copy-btn';
      copy.textContent = 'Copy';
      copy.addEventListener('click', function () {
        navigator.clipboard.writeText(pre.querySelector('code').textContent).then(function () {
          copy.textContent = 'Copied';
          setTimeout(function () { copy.textContent = 'Copy'; }, 1500);
        });
      });
      pre.appendChild(copy);
    }

    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      pre.hidden = open;
    });
  });

  /* ---------- Email (assembled at runtime to deter scrapers) ---------- */
  document.querySelectorAll('.email-link').forEach(function (a) {
    var addr = a.getAttribute('data-user') + '@' + a.getAttribute('data-domain');
    a.href = 'mailto:' + addr;
    a.textContent = addr;
  });

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
