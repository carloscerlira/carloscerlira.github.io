// Highlights the nav link for the section currently on screen, and keeps the
// footer year current. No dependencies.
(function () {
  'use strict';

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  var links = Array.prototype.slice.call(document.querySelectorAll('.site-nav a[href^="#"]'));
  var sections = links.map(function (link) {
    return document.getElementById(link.getAttribute('href').slice(1));
  });
  if (!links.length) return;

  var pinned = -1; // link the visitor just clicked; stays highlighted until they scroll themselves
  var queued = false;

  function setActive(index) {
    links.forEach(function (link, i) {
      var on = i === index;
      link.classList.toggle('is-active', on);
      if (on) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  function update() {
    queued = false;
    if (pinned >= 0) return setActive(pinned);

    // The active section is the last one whose top has passed a line 35% down the viewport.
    var line = window.innerHeight * 0.35;
    var current = 0;
    sections.forEach(function (section, i) {
      if (section && section.getBoundingClientRect().top <= line) current = i;
    });

    // At the very bottom the last section wins, even if it is too short to reach the line.
    var doc = document.documentElement;
    if (window.innerHeight + window.scrollY >= doc.scrollHeight - 2) current = sections.length - 1;

    setActive(current);
  }

  function requestUpdate() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(update);
  }

  links.forEach(function (link, i) {
    link.addEventListener('click', function () {
      pinned = i;
      setActive(i);
    });
  });

  // Any manual scrolling hands control back to the scroll position.
  ['wheel', 'touchmove', 'keydown'].forEach(function (type) {
    window.addEventListener(type, function () { pinned = -1; requestUpdate(); }, { passive: true });
  });

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  update();
})();
