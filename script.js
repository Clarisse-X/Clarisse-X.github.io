(function () {
  var d = document;

  // Mobile menu
  var btn = d.querySelector('.menu-btn');
  var nav = d.getElementById('nav');
  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  // Project filter + show more
  var filterBtns = d.querySelectorAll('.filters button');
  var cards = d.querySelectorAll('.proj');
  var more = d.getElementById('more-projects');
  var LIMIT = 3, expanded = false, current = 'all';

  function render() {
    var shown = 0, total = 0;
    cards.forEach(function (c) {
      var match = current === 'all' || c.getAttribute('data-cat').split(' ').indexOf(current) > -1;
      if (match) total++;
      var visible = match && (expanded || shown < LIMIT);
      if (visible) shown++;
      c.hidden = !visible;
    });
    if (more) {
      more.parentNode.hidden = total <= LIMIT;
      more.textContent = expanded ? 'Show fewer' : 'Show all projects (' + total + ')';
      more.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    }
  }

  filterBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      filterBtns.forEach(function (x) {
        x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
      });
      current = b.getAttribute('data-filter');
      render();
    });
  });
  if (more) more.addEventListener('click', function () { expanded = !expanded; render(); });
  render();

  // Scroll reveal + active nav link
  var reveals = d.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });

    var links = d.querySelectorAll('.nav a[href^="#"]');
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) {
          if (a.getAttribute('href') === '#' + e.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    d.querySelectorAll('main section[id]').forEach(function (s) { so.observe(s); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // Footer year
  var y = d.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();