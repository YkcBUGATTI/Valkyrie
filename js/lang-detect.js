/* ============================================================
   Aston Martin Valkyrie 自动语言检测
   - 海外 IP(非 CN)访问中文页 → 跳转英文版 en.html
   - 国内 IP 访问英文版      → 跳转中文版 index.html
   - 用户主动点过语言按钮     → 尊重选择,不再自动跳转
   - IP 检测失败             → 保持当前语言,不打扰
   注意:click 监听必须在任何提前 return 之前注册(第一个语句块),
   否则已选择当前语言的用户点「切换」时不会记录,会被 IP 检测弹回。
   ============================================================ */
(function () {
  'use strict';

  /* 1) 语言按钮点击监听 —— 永远最先注册 */
  document.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a.lang-btn');
    if (!a) return;
    var lang = /en\.html/.test(a.getAttribute('href') || '') ? 'en' : 'zh';
    try { localStorage.setItem('valkyrie-lang', lang); } catch (e) {}
  });

  /* 2) 本地环境不跳转 */
  if (location.protocol === 'file:') return;
  var host = location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') return;

  var onEn = /(^|\/)en\.html/i.test(location.pathname);
  var saved = null;
  try { saved = localStorage.getItem('valkyrie-lang'); } catch (e) {}

  /* 3) 用户显式选择过当前语言:不自动跳转 */
  if (saved === (onEn ? 'en' : 'zh')) return;

  function switchTo(target, lang) {
    try { localStorage.setItem('valkyrie-lang', lang); } catch (e) {}
    location.replace(target);
  }

  function decide(code) {
    if (!code) return;
    var isCN = (code === 'CN');
    if (!isCN && !onEn) switchTo('en.html', 'en');
    else if (isCN && onEn) switchTo('index.html', 'zh');
  }

  /* 4) ipapi.co 主 + ipinfo.io 兜底 */
  var tries = [
    function (cb) {
      fetch('https://ipapi.co/json/', { mode: 'cors' })
        .then(function (r) { return r.json(); })
        .then(function (d) { cb(d && d.country_code); })
        .catch(function () { cb(null); });
    },
    function (cb) {
      fetch('https://ipinfo.io/json', { mode: 'cors' })
        .then(function (r) { return r.json(); })
        .then(function (d) { cb(d && d.country); })
        .catch(function () { cb(null); });
    }
  ];
  var i = 0;
  (function next() {
    if (i >= tries.length) return;
    tries[i++](function (code) {
      if (code) decide(code);
      else next();
    });
  })();
})();
