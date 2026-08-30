/* Sky Retreat · a 1:1 KUBE structural transplant.
   Nav condense, full-screen menu with per-link image crossfade, hover-crossfade
   trio, one -4rem parallax, masked line
   reveals (21st.dev text-reveal-mask mechanic), the ZROBIM hero sandwich.
   Lenis DESKTOP ONLY; ignoreMobileResize; width-only resize guard. */
(function () {
  'use strict';

  var root = document.documentElement;
  var body = document.body;
  root.classList.add('js');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  var hasGSAP = !!(window.gsap && window.ScrollTrigger);
  var SCRUB = isTouch ? 0.35 : true;
  var meta = document.getElementById('themeColor');

  /* ---------- ground writer ---------- */
  function setGround(g) {
    if (body.dataset.ground === g) return;
    body.dataset.ground = g;
    root.style.colorScheme = g === 'night' ? 'dark' : 'light';
    if (meta) meta.setAttribute('content', g === 'night' ? '#0D1420' : '#EFF1ED');
  }

  /* ---------- the four cabins, from their own pages ---------- */
  var CABINS = [
    { name: 'Aurora Glass Cabin I', img: 'aurora-deck',
      facts: '34 m² · for two · glass roof · sauna · jacuzzi',
      alt: 'The king bed under the glass wall of Aurora Glass Cabin I, mountains beyond',
      url: 'https://skyretreaticeland.com/accommodation/aurora-glass-cabin-i-private-sauna-jacuzzi/' },
    { name: 'Aurora Glass Cabin II', img: 'cabin-mirror',
      facts: '34 m² · for two · glass roof · sauna with a panoramic window',
      alt: 'The bed and glass front of Aurora Glass Cabin II at first light',
      url: 'https://skyretreaticeland.com/accommodation/aurora-glass-cabin-ii-private-sauna-jacuzzi/' },
    { name: 'Aurora Cabin', img: 'tub-dusk',
      facts: 'Sleeps 4 · twin beds and a sofa bed · private jacuzzi on the deck',
      alt: 'The lit jacuzzi on the deck at Aurora Cabin after dark',
      url: 'https://skyretreaticeland.com/accommodation/aurora-cabin-private-jacuzzi/' },
    { name: 'Seljalandsfoss Cabin', img: 'cabin-rocks',
      facts: '40 m² · sleeps 4 · 2 km from the falls · private jacuzzi',
      alt: 'Seljalandsfoss Cabin standing alone in the field below the ridge',
      url: 'https://skyretreaticeland.com/accommodation/seljalandsfoss-cabin/' },
  ];
  var host = document.getElementById('cabinList');
  if (host) {
    host.innerHTML = CABINS.map(function (c) {
      return '<a class="cabin" href="' + c.url + '" target="_blank" rel="noopener">' +
        '<img src="assets/img/' + c.img + '-sm.webp" srcset="assets/img/' + c.img + '-sm.webp 1000w, assets/img/' + c.img + '-md.webp 2000w, assets/img/' + c.img + '.webp 3400w" sizes="(max-width: 860px) 760px, 1500px" alt="' + c.alt + '" loading="lazy">' +
        '<span class="cabin_type"><span class="cabin_name">' + c.name + '</span>' +
        '<span class="cabin_facts">' + c.facts + '</span>' +
        '<span class="cabin_more">View the cabin</span></span></a>';
    }).join('');
  }

  /* ---------- masked line reveal: wrap each RENDERED line in its own mask ---------- */
  function splitLines(el) {
    if (el.dataset.split === 'done') return;
    var text = (el.dataset.text || el.textContent).trim().replace(/\s+/g, ' ');
    el.dataset.text = text;
    var words = text.split(' ');
    el.textContent = '';
    var probes = words.map(function (w, i) {
      var s = document.createElement('span');
      s.textContent = w + (i < words.length - 1 ? ' ' : '');
      s.style.display = 'inline-block';
      s.style.whiteSpace = 'pre';
      el.appendChild(s);
      return s;
    });
    /* group by rendered offsetTop — where the browser actually broke the line */
    var lines = [], last = null;
    probes.forEach(function (s) {
      var top = s.offsetTop;
      if (last === null || top > last + 2) { lines.push([]); last = top; }
      lines[lines.length - 1].push(s.textContent);
    });
    el.textContent = '';
    lines.forEach(function (ws) {
      var mask = document.createElement('span');
      mask.className = 'rl';
      var inner = document.createElement('i');
      inner.textContent = ws.join('').replace(/\s+$/, '');
      mask.appendChild(inner);
      el.appendChild(mask);
    });
    el.dataset.split = 'done';
  }
  var reveals = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  function buildReveals() { reveals.forEach(splitLines); }

  /* ---------- nav: condense + full-screen menu ---------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  var menuOpen = false;
  function setMenu(open) {
    menuOpen = open;
    body.classList.toggle('menu-open', open);
    body.classList.toggle('no-scroll', open);
    burger.setAttribute('aria-expanded', String(open));
    if (open) menu.removeAttribute('hidden');
    if (window.__lenis) { open ? window.__lenis.stop() : window.__lenis.start(); }
  }
  if (burger && menu) {
    burger.addEventListener('click', function () { setMenu(!menuOpen); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menuOpen) setMenu(false); });
    var mItems = menu.querySelectorAll('#menuList li');
    var mImgs = menu.querySelectorAll('.menu_img');
    mItems.forEach(function (li, i) {
      var pick = function () { mImgs.forEach(function (im, k) { im.classList.toggle('is-visible', k === i); }); };
      li.addEventListener('mouseenter', pick);
      li.addEventListener('focusin', pick);
    });
  }
  function syncScrolled() { body.classList.toggle('scrolled', window.scrollY > 12); }
  syncScrolled();
  window.addEventListener('scroll', syncScrolled, { passive: true });

  /* ---------- hotspots ---------- */
  var spots = Array.prototype.slice.call(document.querySelectorAll('[data-spot]'));
  function closeSpots(except) {
    spots.forEach(function (s) { if (s !== except) s.setAttribute('aria-expanded', 'false'); });
  }
  spots.forEach(function (s) {
    s.addEventListener('click', function (e) {
      e.preventDefault();
      var open = s.getAttribute('aria-expanded') === 'true';
      closeSpots(s);
      s.setAttribute('aria-expanded', String(!open));
    });
  });
  window.addEventListener('scroll', function () { closeSpots(null); }, { passive: true });

  /* ---------- crossfade trio ---------- */
  function wireCrossfade(rowSel, imgSel, cls, defaultOnLeave) {
    var rows = document.querySelectorAll(rowSel);
    var imgs = document.querySelectorAll(imgSel);
    if (!rows.length || !imgs.length) return;
    function pick(i) { imgs.forEach(function (im, k) { im.classList.toggle(cls, k === i); }); }
    rows.forEach(function (r, i) {
      var t = r.querySelector('button') || r;
      r.addEventListener('mouseenter', function () { pick(i); });
      t.addEventListener('click', function () { pick(i); });
      r.addEventListener('focusin', function () { pick(i); });
      if (defaultOnLeave) r.addEventListener('mouseleave', function () { pick(0); });
    });
  }
  wireCrossfade('#expRows li', '.exp_img', 'is-visible', false);
  wireCrossfade('#farmRows .farm_row', '.farm_img', 'is-active', true);

  /* ---------- ground flip ---------- */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) setGround(e.target.dataset.ground || 'night'); });
  }, { rootMargin: '-45% 0% -45% 0%' });
  document.querySelectorAll('[data-ground]').forEach(function (s) {
    if (s !== body && s.dataset.ground) io.observe(s);
  });

  /* ---------- range calendar (21st.dev 8271 machine, made honest) ---------- */
  (function calendar() {
    var grid = document.getElementById('calGrid');
    if (!grid) return;
    var monthEl = document.getElementById('calMonth');
    document.getElementById('calDow').innerHTML =
      ['Mo','Tu','We','Th','Fr','Sa','Su'].map(function (d) { return '<div>' + d + '</div>'; }).join('');
    var outS = document.getElementById('outStart'), outE = document.getElementById('outEnd');
    var outSum = document.getElementById('outSum'), go = document.getElementById('bkGo');
    var prev = document.getElementById('calPrev'), next = document.getElementById('calNext');
    var MON = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var view = new Date(today.getFullYear(), today.getMonth(), 1);
    var monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    if ((monthEnd - today) / 86400000 < 7) view.setMonth(view.getMonth() + 1);
    var start = null, end = null;

    function fmt(d) { return d ? MON[d.getMonth()].slice(0, 3) + ' ' + d.getDate() + ', ' + d.getFullYear() : null; }
    function paint() {
      var old = monthEl.querySelector('span');
      if (old) { old.classList.add('is-out'); setTimeout(function () { old.remove(); }, 200); }
      var sp = document.createElement('span');
      sp.textContent = MON[view.getMonth()] + ' ' + view.getFullYear();
      monthEl.appendChild(sp);
      prev.disabled = view <= new Date(today.getFullYear(), today.getMonth(), 1);
      var lead = (new Date(view).getDay() + 6) % 7;
      var cur = new Date(view); cur.setDate(1 - lead);
      var out = [];
      for (var i = 0; i < 42; i++) {
        var d = new Date(cur);
        var cls = ['bk_day'];
        if (start && end && d > start && d < end) cls.push('in-range');
        if (start && +d === +start) cls.push(end ? 'is-start' : 'is-start is-only');
        if (end && +d === +end) cls.push('is-end');
        out.push('<button type="button" class="' + cls.join(' ') + '"' +
          (d.getMonth() !== view.getMonth() ? ' data-out' : '') +
          (d < today ? ' disabled' : '') +
          (+d === +today ? ' data-today' : '') +
          ' data-d="' + d.toISOString().slice(0, 10) + '">' + d.getDate() + '</button>');
        cur.setDate(cur.getDate() + 1);
      }
      grid.innerHTML = out.join('');
    }
    function sync() {
      outS.textContent = fmt(start) || 'Select a date';
      outE.textContent = fmt(end) || 'Select a date';
      if (!start) outSum.textContent = 'Choose your arrival night to begin.';
      else if (!end) outSum.textContent = 'Arriving ' + fmt(start) + ' — now choose your departure.';
      else {
        var n = Math.round((end - start) / 86400000);
        outSum.textContent = fmt(start) + ' → ' + fmt(end) + ' · ' + n + (n === 1 ? ' night' : ' nights') + '. Availability is confirmed at checkout.';
      }
      go.setAttribute('aria-disabled', String(!(start && end)));
    }
    grid.addEventListener('click', function (e) {
      var b = e.target.closest('.bk_day'); if (!b || b.disabled) return;
      var d = new Date(b.dataset.d + 'T00:00:00');
      if (!start || (start && end)) { start = d; end = null; }
      else if (d < start) { start = d; }
      else if (+d === +start) { start = null; end = null; }
      else { end = d; }
      paint(); sync();
    });
    prev.addEventListener('click', function () { view.setMonth(view.getMonth() - 1); paint(); });
    next.addEventListener('click', function () { view.setMonth(view.getMonth() + 1); paint(); });
    paint(); sync();
  })();

  /* ---------- Motion's scroll word reveal, scrubbed (21st.dev 24525) ----------
     rest opacity .15, each word's window starts at (i/(n-1)) * .8 and spans .2,
     so the words overlap into a wave instead of a hard stagger. */
  var scrubWords = [];
  function buildScrubWords() {
    document.querySelectorAll('[data-scrub-words]').forEach(function (el) {
      if (el.dataset.swDone) return;
      var text = el.textContent.replace(/\s+/g, ' ').trim();
      var frag = document.createDocumentFragment();
      var words = text.split(' ');
      words.forEach(function (w, i) {
        var sp = document.createElement('span');
        sp.className = 'sw';
        sp.textContent = w + (i < words.length - 1 ? ' ' : '');
        frag.appendChild(sp);
      });
      el.textContent = '';
      el.appendChild(frag);
      el.dataset.swDone = '1';
      scrubWords.push(el);
    });
  }
  function wordOpacity(p, start, end) {
    if (p <= start) return 0.55;   /* unlit floor: the rest state must stay legible */
    if (p >= end) return 1;
    return 0.55 + 0.45 * ((p - start) / (end - start));
  }

  /* ---------- motion ---------- */
  function showAllText() {
    buildScrubWords();
    document.querySelectorAll('.sw').forEach(function (w) { w.style.opacity = 1; });
    document.querySelectorAll('.rl').forEach(function (l) { l.classList.add('in'); });
    ['footWm', 'heroWm'].forEach(function (id) {
      var e = document.getElementById(id); if (e) e.classList.add('in');
    });
  }
  if (!hasGSAP || reduced) { buildReveals(); showAllText(); return; }

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  if (!isTouch) {
    var lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 0.9, autoRaf: false });
    lenis.on('scroll', ScrollTrigger.update);
    window.__lenis = lenis;
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  function armReveals() {
    buildReveals();
    reveals.forEach(function (el) {
      var lines = el.querySelectorAll('.rl');
      if (!lines.length) return;
      if (el.getBoundingClientRect().top <= window.innerHeight * 0.92) {
        lines.forEach(function (l) { l.classList.add('in'); });
        return;
      }
      ScrollTrigger.create({
        trigger: el, start: 'top 88%', once: true,
        onEnter: function () {
          lines.forEach(function (l, i) { l.style.transitionDelay = (i * 0.08) + 's'; l.classList.add('in'); });
        },
        onRefresh: function (self) { if (self.progress > 0) lines.forEach(function (l) { l.classList.add('in'); }); }
      });
    });
    ScrollTrigger.refresh();
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(armReveals);
  else armReveals();

  buildScrubWords();
  scrubWords.forEach(function (el) {
    var ws = el.querySelectorAll('.sw');
    var n = ws.length;
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', end: 'bottom 55%', scrub: .5,
      onUpdate: function (self) {
        var p = self.progress;
        for (var i = 0; i < n; i++) {
          var start = n <= 1 ? 0 : (i / (n - 1)) * 0.8;
          ws[i].style.opacity = wordOpacity(p, start, Math.min(1, start + 0.2));
        }
      }
    });
  });

  /* the ZROBIM/Osmo sandwich */
  var layers = document.getElementById('heroLayers');
  var heroWm = document.getElementById('heroWm');
  if (layers) {
    gsap.timeline({
      scrollTrigger: { trigger: layers, start: 'top top', end: 'bottom top', scrub: SCRUB, invalidateOnRefresh: true }
    })
      .to('[data-sr-layer="wm"]', { yPercent: 45, ease: 'none' }, 0)
      .to('[data-sr-layer="front"]', { yPercent: 8, ease: 'none' }, 0);

    /* the words track apart as you scroll, exactly like the footer wordmark */
    if (heroWm && !isTouch) {
      var hw = heroWm.querySelectorAll('.hero_wm_word');
      gsap.fromTo(hw[0], { xPercent: 3.5 }, { xPercent: -2.5, ease: 'none',
        scrollTrigger: { trigger: layers, start: 'top top', end: 'bottom top', scrub: .6 } });
      gsap.fromTo(hw[1], { xPercent: -3.5 }, { xPercent: 2.5, ease: 'none',
        scrollTrigger: { trigger: layers, start: 'top top', end: 'bottom top', scrub: .6 } });
    }
  }
  /* it rises out of its mask on load, before anything else moves */
  if (heroWm) requestAnimationFrame(function () { heroWm.classList.add('in'); });

  /* KUBE's one parallax */
  /* KUBE gates this on a 768px WIDTH breakpoint, not on touch capability */
  ScrollTrigger.matchMedia({
    '(min-width: 768px)': function () {
      document.querySelectorAll('[data-img-wrap]').forEach(function (wrap) {
        var img = wrap.querySelector('[data-img]');
        if (!img) return;
        gsap.fromTo(img, { y: '0rem' }, {
          y: '-4rem', ease: 'none',
          scrollTrigger: { trigger: wrap, start: 'top 70%', end: 'bottom 30%', scrub: true }
        });
      });
    },
    '(max-width: 767px)': function () { gsap.set('[data-img]', { y: 0 }); }
  });

  /* block reveals */
  document.querySelectorAll('.rev').forEach(function (el) {
    if (el.getBoundingClientRect().top <= window.innerHeight * 0.9) return;
    el.setAttribute('data-armed', '');
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: function () { el.classList.add('in'); },
      onRefresh: function (self) { if (self.progress > 0) el.classList.add('in'); }
    });
  });

  /* the footer statement: the wordmark rises, then the two words track apart */
  (function footer() {
    var wm = document.getElementById('footWm');
    var stage = document.getElementById('footStage');
    if (!wm || !stage) return;
    ScrollTrigger.create({
      trigger: wm, start: 'top 92%', once: true,
      onEnter: function () { wm.classList.add('in'); },
      onRefresh: function (self) { if (self.progress > 0) wm.classList.add('in'); }
    });
    if (!isTouch) {
      var words = wm.querySelectorAll('.foot_wm_word');
      gsap.fromTo(words[0], { xPercent: 5 }, { xPercent: -2, ease: 'none',
        scrollTrigger: { trigger: stage, start: 'top bottom', end: 'bottom bottom', scrub: .6 } });
      gsap.fromTo(words[1], { xPercent: -5 }, { xPercent: 2, ease: 'none',
        scrollTrigger: { trigger: stage, start: 'top bottom', end: 'bottom bottom', scrub: .6 } });
    }
  })();

  /* width-only resize guard */
  var lastW = window.innerWidth;
  window.addEventListener('resize', function () {
    if (isTouch && window.innerWidth === lastW) return;
    lastW = window.innerWidth;
    reveals.forEach(function (el) { el.dataset.split = ''; });
    armReveals();
  });
})();
