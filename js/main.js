/* ============================================================
   ASTON MARTIN VALKYRIE — main.js(原生 JS,无依赖)
   机制:reveal IO / stagger / 数字计数 / gauges / 遮盖画廊(clip lerp)
        / 全屏图列(弹簧惯性)/ 规格 tabs / 视口视频控制 / 导航与菜单
   性能:geometry 惰性缓存,滚动帧内零 reflow;弹簧常驻 rAF,
        页面隐藏时暂停;移动端不加载与播放任何视频。
   ============================================================ */
(function () {
  'use strict';

  var doc = document, root = doc.documentElement;
  var IS_MOBILE = window.matchMedia('(max-width: 980px)').matches;
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 全局滚动回调 + 常驻 rAF ---------- */
  var scrollFns = [];
  function onScroll() {
    for (var i = 0; i < scrollFns.length; i++) scrollFns[i]();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- 工具 ---------- */
  function clamp01(v) { return v < 0 ? 0 : (v > 1 ? 1 : v); }
  function easeOutExpo(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
  function onReady(fn) {
    if (doc.readyState !== 'loading') fn(); else doc.addEventListener('DOMContentLoaded', fn);
  }

  /* ---------- geometry 缓存 ---------- */
  var geo = { totalH: 0, chapTops: [], breaks: [], gals: [], reels: [] };
  function measure() {
    geo.totalH = root.scrollHeight - window.innerHeight;
    geo.breaks = Array.prototype.slice.call(doc.querySelectorAll('[data-chapter]'));
    geo.chapTops = geo.breaks.map(function (b) {
      return b.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.4;
    });
    geo.gals = Array.prototype.map.call(doc.querySelectorAll('.gallery'), function (g) {
      return { top: g.getBoundingClientRect().top + window.scrollY, h: g.offsetHeight };
    });
    geo.reels = Array.prototype.map.call(doc.querySelectorAll('.reel__frame'), function (f) {
      return { top: f.getBoundingClientRect().top + window.scrollY, h: f.offsetHeight, el: f };
    });
  }
  window.addEventListener('resize', function () { measure(); onScroll(); });
  window.addEventListener('load', measure);
  doc.addEventListener('load', function (e) {
    if (e.target && e.target.tagName === 'IMG') measure();
  }, true);

  /* ---------- Hero:入场 + 视差 ---------- */
  onReady(function () {
    var hero = doc.querySelector('.hero');
    if (!hero) return;
    setTimeout(function () { hero.classList.add('is-in'); }, 60);
    var px = hero.querySelector('.hero__parallax');
    scrollFns.push(function () {
      if (!px || REDUCED) return;
      var y = window.scrollY;
      if (y < window.innerHeight * 1.4) {
        px.style.transform = 'scale(1.1) translateY(' + (y * 0.22).toFixed(1) + 'px)';
      }
    });
  });

  /* ---------- reveal IO ---------- */
  onReady(function () {
    var els = doc.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || REDUCED) {
      els.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.1 });
      els.forEach(function (el) { io.observe(el); });
    }
  });

  /* ---------- stagger:组内卡片递增 0.08s ---------- */
  onReady(function () {
    if (REDUCED) return;
    ['.timeline', '.portrait-cards', '.vcards', '.bigstats', '.gauges', '.rec-line'].forEach(function (sel) {
      doc.querySelectorAll(sel).forEach(function (group) {
        Array.prototype.forEach.call(group.children, function (child, i) {
          child.style.setProperty('--d', (i * 0.08).toFixed(2) + 's');
        });
      });
    });
  });

  /* ---------- 章节分隔页 / 计时入场 ---------- */
  onReady(function () {
    var els = doc.querySelectorAll('.chapter-break, .lap');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.35 });
    els.forEach(function (el) { io.observe(el); });
  });

  /* ---------- 数字计数 ---------- */
  function animateCount(el) {
    var to = parseFloat(el.getAttribute('data-to')) || 0;
    var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var dur = 1800, start = null;
    function step(ts) {
      if (!start) start = ts;
      var t = clamp01((ts - start) / dur);
      var v = to * easeOutExpo(t);
      el.textContent = dec > 0 ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US');
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = dec > 0 ? to.toFixed(dec) : to.toLocaleString('en-US');
    }
    requestAnimationFrame(step);
  }
  onReady(function () {
    var els = doc.querySelectorAll('.count');
    if (!('IntersectionObserver' in window) || REDUCED) {
      els.forEach(function (el) { el.textContent = (parseFloat(el.getAttribute('data-to')) || 0).toLocaleString('en-US'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        animateCount(en.target);
      });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
  });

  /* ---------- gauges(SVG 环) ---------- */
  onReady(function () {
    var gauges = Array.prototype.slice.call(doc.querySelectorAll('.gauge'));
    if (!gauges.length) return;
    var CIRC = 527.8;
    gauges.forEach(function (g) {
      var val = parseFloat(g.getAttribute('data-gauge')) || 0;
      var max = parseFloat(g.getAttribute('data-max')) || 100;
      var ratio = Math.min(val / max, 1);
      g.style.setProperty('--gauge-off', (CIRC * (1 - ratio)).toFixed(1));
      var num = g.querySelector('figcaption b');
      if (num) num.textContent = '0';
    });
    if (!('IntersectionObserver' in window) || REDUCED) {
      gauges.forEach(function (g) { g.classList.add('is-on'); fillGaugeNum(g, true); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var g = en.target;
        io.unobserve(g);
        g.classList.add('is-on');
        fillGaugeNum(g, false);
      });
    }, { threshold: 0.3 });
    gauges.forEach(function (g) { io.observe(g); });

    function fillGaugeNum(g, instant) {
      var num = g.querySelector('figcaption b');
      if (!num) return;
      var target = parseFloat(g.getAttribute('data-gauge')) || 0;
      var dec = parseInt(g.getAttribute('data-decimals') || '0', 10);
      if (instant) { num.textContent = target.toLocaleString('en-US'); return; }
      var t0 = performance.now(), D = 2200;
      (function tick(t) {
        var k = clamp01((t - t0) / D);
        var v = target * easeOutExpo(k);
        num.textContent = dec > 0 ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US');
        if (k < 1) requestAnimationFrame(tick);
      })(t0);
    }
  });

  /* ---------- 遮盖滚动画廊(桌面 clip lerp / 移动端切换) ---------- */
  onReady(function () {
    var gals = Array.prototype.slice.call(doc.querySelectorAll('.gallery'));
    if (!gals.length) return;

    var instances = gals.map(function (g) {
      var images = Array.prototype.slice.call(g.querySelectorAll('.g-image'));
      return {
        texts: Array.prototype.slice.call(g.querySelectorAll('.g-text')),
        images: images,
        countEl: g.querySelector('.g-count b'),
        countAll: g.querySelector('.g-count'),
        clips: images.map(function (_, k) { return k === 0 ? 0 : 100; }),
        lastWritten: images.map(function () { return -1; }),
        lastCount: -1,
        lastMob: -1
      };
    });

    function update() {
      var vh = window.innerHeight;
      var S = vh * 1.3;
      var sy = window.scrollY;
      instances.forEach(function (inst, n) {
        var g = geo.gals[n];
        if (!g) return;
        var top = g.top;
        var done = 0;
        inst.texts.forEach(function (t, i) {
          var tTop = top + i * S;
          var p = clamp01((sy - tTop) / S);
          if (i === inst.texts.length - 1) {
            p = clamp01((sy - (top + g.h - S)) / S);
          }
          if (p > 0.99) done++;
          t.classList.toggle('is-on', p > 0.22 && p < 0.62);
          var card = t.querySelector('.g-text__card');
          if (card) card.classList.toggle('is-out', p > 0.62);
          if (inst.images[i] && i > 0) {
            var pp = clamp01((p - 0.62) / 0.38);
            var target = (1 - pp) * 100;
            inst.clips[i] += (target - inst.clips[i]) * 0.22;
            if (Math.abs(inst.clips[i] - inst.lastWritten[i]) > 0.25) {
              inst.lastWritten[i] = inst.clips[i];
              inst.images[i].style.clipPath = 'inset(' + inst.clips[i].toFixed(2) + '% 0% 0%)';
            }
          }
        });
        var cn = Math.min(done + 1, inst.images.length);
        if (cn !== inst.lastCount && inst.countEl) {
          inst.lastCount = cn;
          inst.countEl.textContent = (cn < 10 ? '0' + cn : '' + cn);
        }
        if (inst.countAll) {
          var all = inst.images.length;
          inst.countAll.childNodes.forEach(function (node) {
            if (node.nodeType === 3 && node.textContent.trim()) node.textContent = ' / 0' + all;
          });
        }
      });
    }

    if (IS_MOBILE) {
      /* 移动端:跟随文字段落切换整图 opacity */
      instances.forEach(function (inst, n) {
        var g = geo.gals[n];
        if (!g) return;
        var S = window.innerHeight * 1.3;
        var sy = window.scrollY;
        var top = g.top;
        var done = 0;
        inst.texts.forEach(function (t, i) {
          var p = clamp01((sy - (top + i * S)) / S);
          if (p > 0.99) done++;
        });
        var cn = Math.min(done, inst.images.length - 1);
        if (cn !== inst.lastMob) {
          inst.lastMob = cn;
          inst.images.forEach(function (im, k) { im.classList.toggle('is-mobon', k === cn); });
        }
      });
      /* 移动端切换也在滚动回调中持续执行 */
      scrollFns.push(function () {
        instances.forEach(function (inst, n) {
          var g = geo.gals[n];
          if (!g) return;
          var S = window.innerHeight * 1.3;
          var sy = window.scrollY;
          var top = g.top;
          var done = 0;
          inst.texts.forEach(function (t, i) {
            var p = clamp01((sy - (top + i * S)) / S);
            if (p > 0.99) done++;
          });
          var cn = Math.min(done, inst.images.length - 1);
          if (cn !== inst.lastMob) {
            inst.lastMob = cn;
            inst.images.forEach(function (im, k) { im.classList.toggle('is-mobon', k === cn); });
            if (inst.countEl) inst.countEl.textContent = (cn + 1 < 10 ? '0' + (cn + 1) : '' + (cn + 1));
          }
        });
      });
    } else {
      scrollFns.push(update);
    }
    measure();
  });

  /* ---------- 全屏滚动图列(reel):img scale 弹簧跟随 ---------- */
  onReady(function () {
    var frames = Array.prototype.slice.call(doc.querySelectorAll('.reel__frame'));
    if (!frames.length) return;
    var state = frames.map(function (f) {
      var img = f.querySelector('img');
      return { img: img, cur: 0, vel: 0 };
    });
    var lastT = performance.now();
    function step() {
      var now = performance.now();
      var dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;
      var vh = window.innerHeight;
      var sy = window.scrollY;
      state.forEach(function (st, n) {
        var g = geo.reels[n];
        if (!g || !st.img) return;
        /* 目标:帧居中时 0,远离时 0.08(轻微缩小感) */
        var center = g.top + g.h / 2;
        var d = (center - sy - vh / 2) / vh;
        var target = clamp01(Math.abs(d)) * 0.09;
        if (REDUCED) { st.cur = target; }
        else {
          var diff = target - st.cur;
          st.vel += diff * 90 * dt;
          st.vel *= Math.pow(0.85, dt * 60);
          if (st.vel * diff < 0) st.vel = 0;
          st.cur += st.vel * dt;
        }
        var s = (1.1 - st.cur).toFixed(4);
        st.img.style.transform = 'scale(' + s + ')';
      });
    }
    scrollFns.push(step);
    if (!REDUCED) {
      var raf = null;
      function loop() { step(); raf = requestAnimationFrame(loop); }
      function onVis() {
        if (doc.hidden && raf) { cancelAnimationFrame(raf); raf = null; }
        else if (!doc.hidden && !raf) raf = requestAnimationFrame(loop);
      }
      doc.addEventListener('visibilitychange', onVis);
      raf = requestAnimationFrame(loop);
    }
    measure();
    step();
  });

  /* ---------- 规格_tabs ---------- */
  onReady(function () {
    doc.querySelectorAll('.specs-tabs').forEach(function (wrap) {
      var btns = Array.prototype.slice.call(wrap.querySelectorAll('.specs-tabs__btn'));
      var panels = Array.prototype.slice.call(wrap.querySelectorAll('.specs-tabs__panel'));
      btns.forEach(function (b) {
        b.addEventListener('click', function () {
          btns.forEach(function (x) { x.classList.remove('is-on'); });
          panels.forEach(function (p) { p.classList.remove('is-on'); });
          b.classList.add('is-on');
          var pn = wrap.querySelector('.specs-tabs__panel[data-panel="' + b.getAttribute('data-tab') + '"]');
          if (pn) pn.classList.add('is-on');
        });
      });
    });
  });

  /* ---------- 视频卡:进视口播放(移动端完全不加载) ---------- */
  onReady(function () {
    if (IS_MOBILE) {
      doc.querySelectorAll('video[data-autoview]').forEach(function (v) {
        v.removeAttribute('autoplay');
        v.preload = 'none';
        v.pause();
      });
      return;
    }
    var vids = Array.prototype.slice.call(doc.querySelectorAll('video[data-autoview]'));
    if (!vids.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) {
          var p = v.play();
          if (p && p.catch) p.catch(function () {});
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.2 });
    vids.forEach(function (v) { io.observe(v); });
  });

  /* ---------- 顶栏:章节标签 + 进度条 ---------- */
  onReady(function () {
    var nowEl = doc.getElementById('navNow');
    var barEl = doc.getElementById('navBar');

    function update() {
      var sy = window.scrollY;
      if (barEl) barEl.style.width = (clamp01(sy / Math.max(1, geo.totalH)) * 100).toFixed(2) + '%';
      if (nowEl && geo.breaks.length) {
        var cur = 0;
        for (var i = 0; i < geo.chapTops.length; i++) {
          if (sy >= geo.chapTops[i]) cur = i;
        }
        var b = geo.breaks[cur];
        if (b) {
          var no = b.getAttribute('data-chapter');
          var h = b.querySelector('h2');
          var name = h ? (h.childNodes[0] || {}).textContent : '';
          if (name) name = name.trim();
          var next = (no ? no + ' · ' : '') + (name || '');
          if (nowEl.textContent !== next) nowEl.textContent = next;
        }
      }
    }
    scrollFns.push(update);
    measure();
    update();
  });

  /* ---------- 导航栏:hero 隐藏 / 滚动后出现 ---------- */
  onReady(function () {
    var nav = doc.getElementById('nav');
    if (!nav) return;
    function update() {
      var y = window.scrollY;
      var hero = doc.querySelector('.hero');
      var heroH = hero ? hero.offsetHeight : window.innerHeight;
      nav.classList.toggle('is-hero', y < heroH - 40);
      nav.classList.toggle('is-solid', y > heroH - 40);
    }
    scrollFns.push(update);
    update();
  });

  /* ---------- 滚动进度表盘 ---------- */
  onReady(function () {
    var gauge = doc.getElementById('scrollGauge');
    if (!gauge) return;
    var bar = gauge.querySelector('.sg__bar');
    var num = gauge.querySelector('.sg__num');
    var CIRC = 119.4;
    function update() {
      var p = clamp01(window.scrollY / Math.max(1, geo.totalH));
      gauge.classList.toggle('is-on', p > 0.02);
      bar.style.strokeDashoffset = (CIRC * (1 - p)).toFixed(1);
      num.textContent = String(Math.round(p * 100)).padStart(2, '0');
    }
    scrollFns.push(update);
    measure();
    update();
    gauge.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' });
    });
  });

  /* ---------- 章节菜单 ---------- */
  function closeMenu() {
    var overlay = doc.getElementById('menuOverlay');
    var btn = doc.getElementById('menuBtn');
    if (overlay) overlay.classList.remove('is-open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    doc.body.style.overflow = '';
  }
  onReady(function () {
    var overlay = doc.getElementById('menuOverlay');
    var btn = doc.getElementById('menuBtn');
    if (!overlay || !btn) return;
    btn.addEventListener('click', function () {
      var open = overlay.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      doc.body.style.overflow = open ? 'hidden' : '';
    });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeMenu();
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  });

  /* ---------- 锚点平滑滚动 ---------- */
  onReady(function () {
    doc.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      var id = a.getAttribute('href').slice(1);
      var el = id ? doc.getElementById(id) : null;
      if (!el) return;
      e.preventDefault();
      closeMenu();
      var y = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: y - 8, behavior: REDUCED ? 'auto' : 'smooth' });
    });
  });


  /* ---------- 自定义光标 + 光斑(F80 式,桌面 finePointer)---------- */
  onReady(function () {
    var fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine || REDUCED) return;
    var cursorEl = doc.createElement('div');
    cursorEl.className = 'cursor'; cursorEl.setAttribute('aria-hidden', 'true');
    cursorEl.appendChild(doc.createElement('span'));
    var glowEl = doc.createElement('div');
    glowEl.className = 'glow'; glowEl.setAttribute('aria-hidden', 'true');
    doc.body.appendChild(cursorEl);
    doc.body.appendChild(glowEl);

    var cx = -100, cy = -100, tx = -100, ty = -100, curRaf = null;
    var gx = -600, gy = -600, gtx = -600, gty = -600, glowRaf = null;
    function lerp(a, b, t) { return a + (b - a) * t; }
    doc.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY; gtx = e.clientX; gty = e.clientY;
      cursorEl.classList.add('is-on'); glowEl.classList.add('is-on');
      if (curRaf === null) {
        curRaf = requestAnimationFrame(function loop() {
          cx = lerp(cx, tx, 0.28); cy = lerp(cy, ty, 0.28);
          cursorEl.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';
          if (Math.abs(cx - tx) < 0.4 && Math.abs(cy - ty) < 0.4) { cx = tx; cy = ty; curRaf = null; return; }
          curRaf = requestAnimationFrame(loop);
        });
      }
      if (glowRaf === null) {
        glowRaf = requestAnimationFrame(function loop() {
          gx = lerp(gx, gtx, 0.12); gy = lerp(gy, gty, 0.12);
          glowEl.style.transform = 'translate3d(' + gx + 'px,' + gy + 'px,0)';
          if (Math.abs(gx - gtx) < 0.4 && Math.abs(gy - gty) < 0.4) { gx = gtx; gy = gty; glowRaf = null; return; }
          glowRaf = requestAnimationFrame(loop);
        });
      }
    });
    doc.addEventListener('mouseenter', function () { cursorEl.classList.add('is-on'); glowEl.classList.add('is-on'); });
    doc.addEventListener('mouseleave', function () { cursorEl.classList.remove('is-on'); glowEl.classList.remove('is-on'); });
    doc.querySelectorAll('a, button, .pcard, .vcard, .gauge, .family-row__media, .media-row__media').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursorEl.classList.add('is-hot'); });
      el.addEventListener('mouseleave', function () { cursorEl.classList.remove('is-hot'); });
    });
  });

  /* ---------- 卡片 tilt + 光边跟随(F80 式)---------- */
  onReady(function () {
    var fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine || REDUCED) return;
    doc.querySelectorAll('.pcard, .vcard').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(700px) rotateY(' + (px * 4).toFixed(2) + 'deg) rotateX(' + (-py * 4).toFixed(2) + 'deg)';
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
    doc.querySelectorAll('.media-row__media, .family-row__media').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      });
    });
  });

  /* ---------- hero 标题逐字入场(F80 式)---------- */
  onReady(function () {
    if (REDUCED) return;
    var el = doc.querySelector('.hero__title');
    if (!el) return;
    var text = el.textContent;
    el.textContent = '';
    text.split('').forEach(function (ch, i) {
      var sp = doc.createElement('span');
      sp.textContent = ch;
      sp.style.setProperty('--d', (0.38 + i * 0.06).toFixed(2) + 's');
      el.appendChild(sp);
    });
  });

  /* ---------- 点击波纹(仅按钮与链接)---------- */
  onReady(function () {
    if (REDUCED) return;
    doc.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('a, button') : null;
      if (!t) return;
      var r = doc.createElement('span');
      r.className = 'ripple';
      r.style.left = e.clientX + 'px';
      r.style.top = e.clientY + 'px';
      doc.body.appendChild(r);
      setTimeout(function () { r.remove(); }, 750);
    });
  });

  /* ---------- 图片懒加载兜底 ---------- */
  onReady(function () {
    doc.querySelectorAll('img').forEach(function (img) {
      if (!img.closest('.hero') && !img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
      if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
    });
  });

})();
