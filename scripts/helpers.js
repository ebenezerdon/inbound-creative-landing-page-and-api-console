(function(window, $){
  'use strict';

  // Namespaces
  window.App = window.App || {};
  window.AppStorage = {
    get: function(key, fallback){ try { var v = localStorage.getItem(key); return v === null ? (fallback !== undefined ? fallback : null) : v; } catch(e){ return fallback !== undefined ? fallback : null; } },
    set: function(key, val){ try { localStorage.setItem(key, String(val)); return true; } catch(e){ return false; } },
    remove: function(key){ try { localStorage.removeItem(key); } catch(e){} },
    setJSON: function(key, obj){ try { localStorage.setItem(key, JSON.stringify(obj)); return true; } catch(e){ return false; } },
    getJSON: function(key, fallback){ try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : (fallback || null); } catch(e){ return fallback || null; } }
  };

  window.AppUtils = {
    uid: function(prefix){ prefix = prefix || 'id'; return prefix + '_' + Math.random().toString(36).slice(2, 10); },
    debounce: function(fn, wait){ var t; return function(){ var ctx = this, args = arguments; clearTimeout(t); t = setTimeout(function(){ fn.apply(ctx, args); }, wait || 200); }; },
    copyText: function(text){
      return new Promise(function(resolve, reject){
        try {
          if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(resolve).catch(function(){
              // Fallback
              var ta = document.createElement('textarea');
              ta.value = text; document.body.appendChild(ta); ta.select();
              try { document.execCommand('copy'); resolve(); } catch(err){ reject(err); }
              document.body.removeChild(ta);
            });
          } else {
            var ta = document.createElement('textarea');
            ta.value = text; document.body.appendChild(ta); ta.select();
            try { document.execCommand('copy'); resolve(); } catch(err){ reject(err); }
            document.body.removeChild(ta);
          }
        } catch (e) { reject(e); }
      });
    },
    smoothScrollTo: function(selector){
      try {
        var $el = $(selector);
        if (!$el.length) return;
        var offset = $el.offset().top - 64; // account for header
        $('html, body').animate({ scrollTop: offset }, 500);
      } catch(e){ /* noop */ }
    },
    formatJSON: function(obj){ try { return JSON.stringify(obj, null, 2); } catch(e){ return '{}'; } },
    isReducedMotion: function(){ try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(e){ return false; } }
  };

})(window, jQuery);
