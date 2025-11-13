(function(window, $){
  'use strict';

  window.App = window.App || {};

  // Private helpers inside this module
  function toast(msg){
    try {
      var $t = $('<div class="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-sm px-4 py-2 rounded-full shadow-lg z-[1000]">'+ msg +'</div>');
      $('body').append($t);
      $t.hide().fadeIn(150);
      setTimeout(function(){ $t.fadeOut(200, function(){ $t.remove(); }); }, 1600);
    } catch(e) { /* noop */ }
  }

  function bindLandingInteractions(){
    // Mobile menu toggle
    $('#mobileMenuBtn').on('click', function(){ $('#mobileMenu').slideToggle(150); });

    // Smooth scroll links
    $('[data-scroll-to]').on('click', function(e){ e.preventDefault(); var sel = $(this).attr('data-scroll-to') || $(this).attr('href'); window.AppUtils.smoothScrollTo(sel); });

    // Copy buttons
    $('[data-copy]').on('click', function(){
      try {
        var target = $(this).attr('data-copy-target');
        var text = target ? $(target).text() : $(this).text();
        window.AppUtils.copyText(text).then(function(){ toast('Copied to clipboard'); }).catch(function(){ toast('Copy failed'); });
      } catch(e){ toast('Copy failed'); }
    });

    // Year in footer
    var y = new Date().getFullYear(); $('#year').text(y);

    // Reveal on scroll
    var $reveal = $('.reveal');
    if ($reveal.length) {
      var revealFn = window.AppUtils.debounce(function(){
        var wh = $(window).height(); var st = $(window).scrollTop();
        $reveal.each(function(){
          var $el = $(this); if ($el.hasClass('reveal-in')) return;
          var top = $el.offset().top; if (top < st + wh - 60) { $el.addClass('reveal-in'); }
        });
      }, 60);
      $(window).on('scroll resize', revealFn); revealFn();
    }

    // Use case scroller controls
    $('#casePrev').on('click', function(){ var $t = $('#caseScroller .case-track'); $t.animate({ scrollLeft: $t.scrollLeft() - 320 }, 250); });
    $('#caseNext').on('click', function(){ var $t = $('#caseScroller .case-track'); $t.animate({ scrollLeft: $t.scrollLeft() + 320 }, 250); });
  }

  // API console logic
  var storeKey = 'inbound.api.console.v1';
  function getConsoleState(){
    return window.AppStorage.getJSON(storeKey, {
      apiKey: '', endpoint: 'https://inbound.new/v2/emails',
      from: 'agent@inbnd.dev', to: 'you@example.com', subject: 'Welcome to Inbound', html: '<p>Thanks for signing up!</p>'
    });
  }
  function setConsoleState(data){ window.AppStorage.setJSON(storeKey, data); }

  function buildJsonFromInputs(){
    var json = {
      from: $('#from').val() || '',
      to: $('#to').val() || '',
      subject: $('#subject').val() || '',
      html: $('#html').val() || ''
    };
    return json;
  }

  function buildCurl(data){
    var endpoint = ($('#endpoint').val() || 'https://inbound.new/v2/emails').trim();
    var key = ($('#apiKey').val() || 'YOUR_API_KEY').trim();
    // Escape single quotes in JSON for shell
    var jsonStr = JSON.stringify(data).replace(/'/g, "'\\''");
    var curl = 'curl -X POST ' + endpoint + ' \\\n' +
      '  -H "Authorization: Bearer ' + key + '" \\\n' +
      '  -H "Content-Type: application/json" \\\n' +
      "  -d '" + jsonStr + "'";
    return curl;
  }

  function bindConsole(){
    if (!$('#apiConsole').length) return; // not on console page

    var state = getConsoleState();
    // populate
    $('#apiKey').val(state.apiKey);
    $('#endpoint').val(state.endpoint);
    $('#from').val(state.from);
    $('#to').val(state.to);
    $('#subject').val(state.subject);
    $('#html').val(state.html);

    function refresh(){
      var json = buildJsonFromInputs();
      var pretty = window.AppUtils.formatJSON(json);
      $('#jsonOut').text(pretty);
      $('#curlOut').text(buildCurl(json));
      // persist
      setConsoleState({
        apiKey: $('#apiKey').val() || '',
        endpoint: $('#endpoint').val() || '',
        from: json.from, to: json.to, subject: json.subject, html: json.html
      });
    }

    // build and copy
    $('#buildJson').on('click', function(){ refresh(); toast('Built JSON'); });
    $('#copyJson').on('click', function(){ window.AppUtils.copyText($('#jsonOut').text()).then(function(){ toast('JSON copied'); }); });
    $('#copyCurl').on('click', function(){ window.AppUtils.copyText($('#curlOut').text()).then(function(){ toast('curl copied'); }); });

    // live update
    $('#apiConsole input, #apiConsole textarea').on('input', window.AppUtils.debounce(refresh, 120));

    // save button
    $('#saveState').on('click', function(){ refresh(); toast('Saved'); });

    // load demo
    $('#loadDemo').on('click', function(){
      $('#apiKey').val('sk_live_example_123');
      $('#endpoint').val('https://inbound.new/v2/emails');
      $('#from').val('agent@inbnd.dev');
      $('#to').val('you@example.com');
      $('#subject').val('Welcome to Inbound');
      $('#html').val('<p>Thanks for signing up!</p>');
      refresh();
    });

    // mock send
    $('#mockSend').on('click', function(){
      refresh();
      var id = window.AppUtils.uid('req');
      var time = new Date().toLocaleTimeString();
      var $item = $('<li class="border border-slate-200 rounded-lg bg-white px-3 py-2"><span class="font-mono text-xs text-slate-500">'+time+'</span><div class="mt-1">Request '+id+' queued (mock)</div></li>');
      $('#activity').prepend($item.hide().slideDown(120));
    });

    // clear log
    $('#clearLog').on('click', function(){ $('#activity').empty(); });

    // initial
    refresh();
  }

  // Public API
  window.App.init = function(){
    try {
      bindLandingInteractions();
      bindConsole();
    } catch (e) {
      console.error('App.init error', e);
    }
  };

  window.App.render = function(){
    // Currently handled by init; reserved for future dynamic rendering
  };

})(window, jQuery);
