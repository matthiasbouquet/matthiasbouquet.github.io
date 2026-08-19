(function () {
    var CALENDLY_URL = 'https://calendly.com/matthias-authenticself/no-cost-portfolio-call?hide_event_type_details=1&hide_gdpr_banner=1';
    var VIMEO_ID = '1195020310';
    var calendlyLoaded = false;
    var leadTracked = false;

    function ready(fn) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            fn();
        }
    }

    function trackMeta(eventName, params) {
        if (typeof window.fbq !== 'function') return;
        if (params) {
            window.fbq('track', eventName, params);
        } else {
            window.fbq('track', eventName);
        }
    }

    function initMetaTracking() {
        window.addEventListener('message', function (e) {
            if (e.origin !== 'https://calendly.com') return;
            if (!e.data || typeof e.data.event !== 'string') return;
            if (e.data.event.indexOf('calendly.') !== 0) return;

            if (e.data.event === 'calendly.event_scheduled' && !leadTracked) {
                leadTracked = true;
                trackMeta('Lead', { content_name: 'Portfolio Call Booking' });
            }
        });
    }

    function initMobileMenu() {
        var menuButton = document.getElementById('mobile-menu-button');
        var mobileMenu = document.getElementById('mobile-menu');
        if (!menuButton || !mobileMenu) return;

        menuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
            menuButton.setAttribute('aria-expanded', String(!mobileMenu.classList.contains('hidden')));
        });
    }

    function closeMobileMenu() {
        var menuButton = document.getElementById('mobile-menu-button');
        var mobileMenu = document.getElementById('mobile-menu');
        if (!mobileMenu || mobileMenu.classList.contains('hidden')) return;
        mobileMenu.classList.add('hidden');
        if (menuButton) menuButton.setAttribute('aria-expanded', 'false');
    }

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var targetId = anchor.getAttribute('href');
                if (!targetId || targetId === '#') return;

                var targetElement = document.querySelector(targetId);
                if (!targetElement) return;

                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
                if (history.replaceState) {
                    history.replaceState(null, '', targetId);
                }
                closeMobileMenu();
            });
        });
    }

    function initFaq() {
        document.addEventListener('click', function (e) {
            var button = e.target.closest('[data-faq-button]');
            if (!button) return;

            var answerId = button.getAttribute('aria-controls');
            var answer = answerId ? document.getElementById(answerId) : null;
            if (!answer) return;

            var icon = button.querySelector('[data-faq-icon]');
            var isOpen = answer.classList.toggle('active');

            if (isOpen) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                button.setAttribute('aria-expanded', 'true');
                if (icon) {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                }
            } else {
                answer.style.maxHeight = '0px';
                button.setAttribute('aria-expanded', 'false');
                if (icon) {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                }
            }
        });
    }

    function initVimeoFacade() {
        var container = document.getElementById('vimeo-container');
        var facade = document.getElementById('vimeo-facade');
        if (!container || !facade) return;

        facade.addEventListener('click', function () {
            if (container.querySelector('iframe')) return;
            facade.remove();
            trackMeta('ViewContent', { content_name: 'Trading Briefing Video' });

            var iframe = document.createElement('iframe');
            iframe.src = 'https://player.vimeo.com/video/' + VIMEO_ID + '?autoplay=1&badge=0&autopause=0&player_id=0&app_id=58479';
            iframe.allow = 'autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share';
            iframe.referrerPolicy = 'strict-origin-when-cross-origin';
            iframe.title = 'How experts actually view trading, by an ex-JP Morgan senior executive';
            iframe.setAttribute('allowfullscreen', '');
            container.appendChild(iframe);
        });
    }

    function loadCalendly() {
        if (calendlyLoaded) return;
        calendlyLoaded = true;

        var skeleton = document.getElementById('calendly-skeleton');
        var widget = document.getElementById('calendly-widget');
        if (!widget) return;

        widget.className = 'calendly-inline-widget';
        widget.setAttribute('data-url', CALENDLY_URL);

        if (skeleton && 'MutationObserver' in window) {
            var observer = new MutationObserver(function () {
                if (widget.querySelector('iframe')) {
                    skeleton.remove();
                    observer.disconnect();
                }
            });
            observer.observe(widget, { childList: true, subtree: true });
            setTimeout(function () {
                if (document.body.contains(skeleton)) skeleton.remove();
                observer.disconnect();
            }, 10000);
        } else if (skeleton) {
            setTimeout(function () {
                if (document.body.contains(skeleton)) skeleton.remove();
            }, 10000);
        }

        if (!document.querySelector('link[href*="assets.calendly.com/assets/external/widget.css"]')) {
            var css = document.createElement('link');
            css.rel = 'stylesheet';
            css.href = 'https://assets.calendly.com/assets/external/widget.css';
            document.head.appendChild(css);
        }

        if (document.querySelector('script[src*="assets.calendly.com/assets/external/widget.js"]')) return;

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

    function scheduleCalendly() {
        var book = document.getElementById('book');
        if (!book) return;

        document.querySelectorAll('[data-book-call], a[href="#book"], a[href="#contact"]').forEach(function (el) {
            el.addEventListener('click', loadCalendly);
        });

        if (!('IntersectionObserver' in window)) {
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
            { rootMargin: '600px 0px' }
        );
        observer.observe(book);
    }

    function initStickyCta() {
        var sticky = document.querySelector('.sticky-cta');
        var book = document.getElementById('book');
        if (!sticky || !book || !('IntersectionObserver' in window)) return;

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    sticky.classList.toggle('is-hidden', entry.isIntersecting);
                });
            },
            { threshold: 0.12 }
        );
        observer.observe(book);
    }

    ready(function () {
        initMobileMenu();
        initSmoothScroll();
        initFaq();
        initVimeoFacade();
        initMetaTracking();
        scheduleCalendly();
        initStickyCta();
    });
})();
