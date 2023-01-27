var log, queryParam, trouble;

window.ASAP = (function() {
  var callall, fns;
  fns = [];
  callall = function() {
    var f, results;
    results = [];
    while (f = fns.shift()) {
      results.push(f());
    }
    return results;
  };
  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', callall, false);
    window.addEventListener('load', callall, false);
  } else if (document.attachEvent) {
    document.attachEvent('onreadystatechange', callall);
    window.attachEvent('onload', callall);
  }
  return function(fn) {
    fns.push(fn);
    if (document.readyState === 'complete') {
      return callall();
    }
  };
})();

log = function() {
  if (window.console && window.DEBUG) {
    if (typeof console.group === "function") {
      console.group(window.DEBUG);
    }
    if (arguments.length === 1 && Array.isArray(arguments[0]) && console.table) {
      console.table.apply(window, arguments);
    } else {
      console.log.apply(window, arguments);
    }
    return typeof console.groupEnd === "function" ? console.groupEnd() : void 0;
  }
};

trouble = function() {
  var ref;
  if (window.console) {
    if (window.DEBUG) {
      if (typeof console.group === "function") {
        console.group(window.DEBUG);
      }
    }
    if ((ref = console.warn) != null) {
      ref.apply(window, arguments);
    }
    if (window.DEBUG) {
      return typeof console.groupEnd === "function" ? console.groupEnd() : void 0;
    }
  }
};

window.preload = function(what, fn) {
  var lib;
  if (!Array.isArray(what)) {
    what = [what];
  }
  return $.when.apply($, (function() {
    var i, len1, results;
    results = [];
    for (i = 0, len1 = what.length; i < len1; i++) {
      lib = what[i];
      results.push($.ajax(lib, {
        dataType: 'script',
        cache: true
      }));
    }
    return results;
  })()).done(function() {
    return typeof fn === "function" ? fn() : void 0;
  });
};

window.queryParam = queryParam = function(p, nocase) {
  var k, params, params_kv;
  params_kv = location.search.substr(1).split('&');
  params = {};
  params_kv.forEach(function(kv) {
    var k_v;
    k_v = kv.split('=');
    return params[k_v[0]] = k_v[1] || '';
  });
  if (p) {
    if (nocase) {
      for (k in params) {
        if (k.toUpperCase() === p.toUpperCase()) {
          return decodeURIComponent(params[k]);
        }
      }
      return void 0;
    } else {
      return decodeURIComponent(params[p]);
    }
  }
  return params;
};

String.prototype.zeroPad = function(len, c) {
  var s;
  s = '';
  c || (c = '0');
  len || (len = 2);
  len -= this.length;
  while (s.length < len) {
    s += c;
  }
  return s + this;
};

Number.prototype.zeroPad = function(len, c) {
  return String(this).zeroPad(len, c);
};

window.DEBUG = 'APP NAME';

ASAP(function() {
  var io, responsiveHandler;
  $('body .subpage-search-bg > .background').append($('#_intro_markup').html());
  $('#hotels-set').appendTo('.hotel-list-plaeholder');
  $(document).on('click', '[data-ym-reachgoal]', function() {
    return typeof ym === "function" ? ym(553380, 'reachGoal', $(this).attr('data-ym-reachgoal')) : void 0;
  });
  $(document).on('click', '.card-cell .buttonlike', function() {
    return typeof ym === "function" ? ym(553380, 'reachGoal', 'cyber-bron') : void 0;
  });
  preload('https://cdnjs.cloudflare.com/ajax/libs/jquery-scrollTo/2.1.3/jquery.scrollTo.min.js', function() {
    return $(document).on('click', '[data-scrollto]', function() {
      return $(window).scrollTo($(this).attr('data-scrollto'), 500, {
        offset: -150
      });
    });
  });
  responsiveHandler = function(query, match_handler, unmatch_handler) {
    var layout;
    layout = matchMedia(query);
    layout.addEventListener('change', function(e) {
      if (e.matches) {
        return match_handler();
      } else {
        return unmatch_handler();
      }
    });
    if (layout.matches) {
      match_handler();
    } else {
      unmatch_handler();
    }
    return layout;
  };
  responsiveHandler('(max-width:768px)', function() {
    var $player_el, p;
    $player_el = $('.video-box.kv .hidden-on-desktop[data-vid]');
    p = new Vimeo.Player($player_el.get(0), {
      id: $player_el.attr('data-vid'),
      background: 1,
      playsinline: 1,
      autopause: 0,
      title: 0,
      byline: 0,
      portrait: 0
    });
    return p.on('play', function() {
      return $player_el.addClass('playback');
    });
  }, function() {
    var $player_el, p;
    $player_el = $('.video-box.kv .hidden-on-mobile[data-vid]');
    p = new Vimeo.Player($player_el.get(0), {
      id: $player_el.attr('data-vid'),
      background: 1,
      playsinline: 1,
      autopause: 0,
      title: 0,
      byline: 0,
      portrait: 0
    });
    return p.on('play', function() {
      return $player_el.addClass('playback');
    });
  });
  io = new IntersectionObserver(function(entries, observer) {
    var entry, i, len1, results;
    results = [];
    for (i = 0, len1 = entries.length; i < len1; i++) {
      entry = entries[i];
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        results.push(responsiveHandler('(max-width:768px)', function() {
          var $player_el, p;
          $player_el = $(entry.target).find('.hidden-on-desktop[data-vid]');
          p = new Vimeo.Player($player_el.get(0), {
            id: $player_el.attr('data-vid'),
            background: 1,
            playsinline: 1,
            autopause: 0,
            title: 0,
            byline: 0,
            portrait: 0
          });
          return p.on('play', function() {
            return $player_el.addClass('playback');
          });
        }, function() {
          var $player_el, p;
          $player_el = $(entry.target).find('.hidden-on-mobile[data-vid]');
          p = new Vimeo.Player($player_el.get(0), {
            id: $player_el.attr('data-vid'),
            background: 1,
            playsinline: 1,
            autopause: 0,
            title: 0,
            byline: 0,
            portrait: 0
          });
          return p.on('play', function() {
            return $player_el.addClass('playback');
          });
        }));
      } else {
        results.push(void 0);
      }
    }
    return results;
  }, {
    threshold: .1
  });
  io.observe($('section.benefits .video-box').get(0));
  preload('https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.3/TweenMax.min.js', function() {
    
            $('[data-glitch]').each(function (idx, el) {
                var $glitch = $(el);
                var turbulence = {
                    val: 0.00001
                };
                var tfilter = $($glitch.data('glitch') + ' feTurbulence').get(0);
                var tl = new TimelineLite({
                    paused: true,
                    onUpdate: function () {
                        tfilter.setAttribute('baseFrequency', '0.00001 ' + turbulence.val);
                    },
                    onStart: function () {
                        $glitch.get(0).style.filter = 'url(' + $glitch.data('glitch') + ')';
                    },
                    onComplete: function () {
                        $glitch.get(0).style.filter = 'none';
                    }
                });

                tl.to(turbulence, 0.2, { val: 0.4 });
                tl.to(turbulence, 0.1, { val: 0.000001 });

                setTimeout(function () {
                    tl.restart();
                    setTimeout(arguments.callee, Math.round(Math.random() * 5000) + 1000);
                }, Math.round(Math.random() * 5000) + 1000);
            });
        ;
    return true;
  });
  return true;
});
