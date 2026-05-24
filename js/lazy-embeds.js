(function () {
    var calendlyLoaded = false;

    function loadCalendly() {
        if (calendlyLoaded) return;
        calendlyLoaded = true;

        if (!document.querySelector('link[href*="calendly.com"][rel="stylesheet"]')) {
            var css = document.createElement('link');
            css.rel = 'stylesheet';
            css.href = 'https://assets.calendly.com/assets/external/widget.css';
            document.head.appendChild(css);
        }

        var existing = document.querySelector('script[src*="calendly.com/assets/external/widget.js"]');
        if (existing) return;

        var script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        script.onload = function () {
            if (window.Calendly && window.Calendly.initInlineWidgets) {
                window.Calendly.initInlineWidgets();
            }
        };
        document.body.appendChild(script);
    }

    function loadMailerLite() {
        if (document.querySelector('script[src*="mailerlite.com"]')) return;

        (function (w, d, e, u, f) {
            w[f] = w[f] || function () {
                (w[f].q = w[f].q || []).push(arguments);
            };
            w[f]('account', '1637934');
            var l = d.createElement(e);
            l.async = 1;
            l.src = u;
            var n = d.getElementsByTagName(e)[0];
            n.parentNode.insertBefore(l, n);
        })(window, document, 'script', 'https://assets.mailerlite.com/js/universal.js', 'ml');
    }

    function observe(id, loader, margin) {
        var el = document.getElementById(id);
        if (!el) return;

        if (!('IntersectionObserver' in window)) {
            loader();
            return;
        }

        var observer = new IntersectionObserver(
            function (entries) {
                if (entries[0].isIntersecting) {
                    loader();
                    observer.disconnect();
                }
            },
            { rootMargin: margin || '400px 0px' }
        );
        observer.observe(el);
    }

    observe('contact', loadCalendly, '500px 0px');
    observe('newsletter', loadMailerLite, '400px 0px');

    document.querySelectorAll('a[href="#contact"]').forEach(function (link) {
        link.addEventListener('click', loadCalendly);
    });
})();
