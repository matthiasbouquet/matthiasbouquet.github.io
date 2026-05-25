(function () {
    var CALENDLY_URL = 'https://calendly.com/matthias-authenticself/no-cost-portfolio-call';
    var VIMEO_ID = '1195020310';
    var calendlyLoaded = false;

    function loadFonts() {
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&display=swap';
        link.onload = function () {
            document.body.classList.add('fonts-loaded');
        };
        document.head.appendChild(link);
    }

    if ('requestIdleCallback' in window) {
        requestIdleCallback(loadFonts, { timeout: 2000 });
    } else {
        setTimeout(loadFonts, 1);
    }

    function initVimeoFacade() {
        var container = document.getElementById('vimeo-container');
        var facade = document.getElementById('vimeo-facade');
        if (!container || !facade) return;

        function mountPlayer() {
            if (container.querySelector('iframe')) return;
            facade.remove();
            var iframe = document.createElement('iframe');
            iframe.src = 'https://player.vimeo.com/video/' + VIMEO_ID + '?autoplay=1&badge=0&autopause=0&player_id=0&app_id=58479';
            iframe.allow = 'autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share';
            iframe.referrerPolicy = 'strict-origin-when-cross-origin';
            iframe.title = 'How experts actually view trading, by an ex-JP Morgan Senior executive';
            iframe.setAttribute('allowfullscreen', '');
            container.appendChild(iframe);
        }

        facade.addEventListener('click', mountPlayer);
    }

    function loadCalendly() {
        if (calendlyLoaded) return;
        calendlyLoaded = true;

        var skeleton = document.getElementById('calendly-skeleton');
        var widget = document.getElementById('calendly-widget');

        var css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = 'https://assets.calendly.com/assets/external/widget.css';
        document.head.appendChild(css);

        var script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        script.onload = function () {
            if (skeleton) skeleton.remove();
            if (widget) {
                widget.className = 'calendly-inline-widget';
                widget.setAttribute('data-url', CALENDLY_URL);
                widget.style.minWidth = '280px';
                widget.style.height = '700px';
            }
            if (window.Calendly && window.Calendly.initInlineWidgets) {
                window.Calendly.initInlineWidgets();
            }
        };
        document.body.appendChild(script);
    }

    function scheduleCalendly() {
        var book = document.getElementById('book');
        if (!book || !('IntersectionObserver' in window)) {
            loadCalendly();
            return;
        }

        var observer = new IntersectionObserver(
            function (entries) {
                if (entries[0].isIntersecting) {
                    loadCalendly();
                    observer.disconnect();
                }
            },
            { rootMargin: '500px 0px' }
        );
        observer.observe(book);
    }

    document.querySelectorAll('a[href="#book"], .js-book-call').forEach(function (el) {
        el.addEventListener('click', function () {
            loadCalendly();
        });
    });

    document.querySelectorAll('a[href="#book"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var target = document.getElementById('book');
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    initVimeoFacade();
    scheduleCalendly();
})();
