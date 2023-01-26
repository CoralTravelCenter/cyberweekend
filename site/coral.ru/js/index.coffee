window.ASAP = (->
    fns = []
    callall = () ->
        f() while f = fns.shift()
    if document.addEventListener
        document.addEventListener 'DOMContentLoaded', callall, false
        window.addEventListener 'load', callall, false
    else if document.attachEvent
        document.attachEvent 'onreadystatechange', callall
        window.attachEvent 'onload', callall
    (fn) ->
        fns.push fn
        callall() if document.readyState is 'complete'
)()

log = () ->
    if window.console and window.DEBUG
        console.group? window.DEBUG
        if arguments.length == 1 and Array.isArray(arguments[0]) and console.table
            console.table.apply window, arguments
        else
            console.log.apply window, arguments
        console.groupEnd?()
trouble = () ->
    if window.console
        console.group? window.DEBUG if window.DEBUG
        console.warn?.apply window, arguments
        console.groupEnd?() if window.DEBUG

window.preload = (what, fn) ->
    what = [what] unless  Array.isArray(what)
    $.when.apply($, ($.ajax(lib, dataType: 'script', cache: true) for lib in what)).done -> fn?()

window.queryParam = queryParam = (p, nocase) ->
    params_kv = location.search.substr(1).split('&')
    params = {}
    params_kv.forEach (kv) -> k_v = kv.split('='); params[k_v[0]] = k_v[1] or ''
    if p
        if nocase
            return decodeURIComponent(params[k]) for k of params when k.toUpperCase() == p.toUpperCase()
            return undefined
        else
            return decodeURIComponent params[p]
    params

String::zeroPad = (len, c) ->
    s = ''
    c ||= '0'
    len ||= 2
    len -= @length
    s += c while s.length < len
    s + @
Number::zeroPad = (len, c) -> String(@).zeroPad len, c

window.DEBUG = 'APP NAME'

ASAP ->

    $('body .subpage-search-bg > .background').append $('#_intro_markup').html()

    preload 'https://cdnjs.cloudflare.com/ajax/libs/jquery-scrollTo/2.1.3/jquery.scrollTo.min.js', ->
        $(document).on 'click', '[data-scrollto]', -> $(window).scrollTo $(this).attr('data-scrollto'), 500, offset: -150

    responsiveHandler = (query, match_handler, unmatch_handler) ->
        layout = matchMedia query
        layout.addEventListener 'change', (e) ->
            if e.matches then match_handler() else unmatch_handler()
        if layout.matches then match_handler() else unmatch_handler()
        layout

    responsiveHandler '(max-width:768px)',
        ->
            $player_el = $('.video-box.kv .hidden-on-desktop[data-vid]')
            p = new Vimeo.Player $player_el.get(0),
                id: $player_el.attr('data-vid')
                background: 1
                playsinline: 1
                autopause: 0
                title: 0
                byline: 0
                portrait: 0
            p.on 'play', ->
                $player_el.addClass 'playback'
        ->
            $player_el = $('.video-box.kv .hidden-on-mobile[data-vid]')
            p = new Vimeo.Player $player_el.get(0),
                id: $player_el.attr('data-vid')
                background: 1
                playsinline: 1
                autopause: 0
                title: 0
                byline: 0
                portrait: 0
            p.on 'play', ->
                $player_el.addClass 'playback'

    io = new IntersectionObserver (entries, observer) ->
        for entry in entries
            if entry.isIntersecting
                observer.unobserve entry.target
                responsiveHandler '(max-width:768px)',
                    ->
                        $player_el = $(entry.target).find('.hidden-on-desktop[data-vid]')
                        p = new Vimeo.Player $player_el.get(0),
                            id: $player_el.attr('data-vid')
                            background: 1
                            playsinline: 1
                            autopause: 0
                            title: 0
                            byline: 0
                            portrait: 0
                        p.on 'play', ->
                            $player_el.addClass 'playback'
                    ->
                        $player_el = $(entry.target).find('.hidden-on-mobile[data-vid]')
                        p = new Vimeo.Player $player_el.get(0),
                            id: $player_el.attr('data-vid')
                            background: 1
                            playsinline: 1
                            autopause: 0
                            title: 0
                            byline: 0
                            portrait: 0
                        p.on 'play', ->
                            $player_el.addClass 'playback'

    , threshold: .1
    io.observe $('section.benefits .video-box').get(0)

    preload 'https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.3/TweenMax.min.js', ->
        `
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
        `
        yes
    yes