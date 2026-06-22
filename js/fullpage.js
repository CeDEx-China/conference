/* =========================================================
   Full-page scroll engine + Mobile drawer + Editions dropdown
   Shared across all conference years
   ========================================================= */
(function () {
    'use strict';

    if ('scrollRestoration' in history) { history.scrollRestoration = 'manual'; }

    var sections    = document.querySelectorAll('.fullpage-section');
    var navDots     = document.querySelectorAll('.nav-dot');
    var mobileDots  = document.querySelectorAll('.mobile-section-dot');
    var currentSection = 0;
    var isScrolling    = false;
    var SCROLL_DELAY   = 800;

    function updateActiveSection(index) {
        sections.forEach(function(s) { s.classList.remove('active'); });
        navDots.forEach(function(d) { d.classList.remove('active'); });
        mobileDots.forEach(function(d) { d.classList.remove('active'); });
        sections[index].classList.add('active');
        if (navDots[index])   navDots[index].classList.add('active');
        if (mobileDots[index]) mobileDots[index].classList.add('active');
        currentSection = index;
        sections[index].scrollTop = 0;
        var progress = document.getElementById('nav-progress');
        if (progress) { progress.textContent = (index + 1) + ' / ' + sections.length; }
    }

    function goToSection(index) {
        if (index < 0 || index >= sections.length || isScrolling) return;
        isScrolling = true;
        updateActiveSection(index);
        setTimeout(function() { isScrolling = false; }, SCROLL_DELAY);
    }

    document.body.style.overflow = 'hidden';
    updateActiveSection(0);

    navDots.forEach(function(dot, i) {
        dot.addEventListener('click', function(e) { e.preventDefault(); goToSection(i); });
    });

    mobileDots.forEach(function(dot, i) {
        dot.addEventListener('click', function() { goToSection(i); });
    });

    // Handle any in-page section hash links (hero CTAs, topbar logos, etc.)
    document.addEventListener('click', function(e) {
        var link = e.target.closest('a[href^="#"]');
        if (!link) return;
        var target = document.querySelector(link.getAttribute('href'));
        if (!target || target.dataset.section === undefined) return;
        e.preventDefault();
        goToSection(parseInt(target.dataset.section, 10));
    });

    var scrollBtn = document.querySelector('.scroll-indicator');
    if (scrollBtn) { scrollBtn.addEventListener('click', function() { goToSection(currentSection + 1); }); }

    var lastScrollTime = 0;
    var scrollTimeout;
    window.addEventListener('wheel', function(e) {
        var now = Date.now();
        if (isScrolling || (now - lastScrollTime) < 100) return;
        var active = sections[currentSection];
        var hasScroll = active.scrollHeight > active.clientHeight;
        if (hasScroll) {
            var atBottom = Math.abs(active.scrollHeight - active.clientHeight - active.scrollTop) < 2;
            var atTop = active.scrollTop === 0;
            if (e.deltaY > 0 && !atBottom) return;
            if (e.deltaY < 0 && !atTop) return;
        }
        e.preventDefault();
        lastScrollTime = now;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            goToSection(e.deltaY > 0 ? currentSection + 1 : currentSection - 1);
        }, 50);
    }, { passive: false });

    document.addEventListener('keydown', function(e) {
        if (isScrolling) return;
        var map = {
            ArrowDown: currentSection + 1, ArrowUp: currentSection - 1,
            PageDown: currentSection + 1, PageUp: currentSection - 1,
            Home: 0, End: sections.length - 1
        };
        if (e.key in map) { e.preventDefault(); goToSection(map[e.key]); }
    });

    var touchStartY = 0, touchStartScrollTop = 0;
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
        touchStartScrollTop = sections[currentSection].scrollTop;
    }, { passive: true });
    document.addEventListener('touchend', function(e) {
        if (isScrolling) return;
        var diff = touchStartY - e.changedTouches[0].screenY;
        var active = sections[currentSection];
        if (Math.abs(diff) > 50) {
            var hasScroll = active.scrollHeight > active.clientHeight;
            if (hasScroll) {
                var atBottom = Math.abs(active.scrollHeight - active.clientHeight - touchStartScrollTop) < 2;
                var atTop = touchStartScrollTop === 0;
                if (diff > 0 && !atBottom) return;
                if (diff < 0 && !atTop) return;
            }
            goToSection(diff > 0 ? currentSection + 1 : currentSection - 1);
        }
    }, { passive: true });
})();

/* Mobile drawer */
(function () {
    'use strict';
    var btn = document.getElementById('mobile-menu-btn');
    var drawer = document.getElementById('mobile-drawer');
    var overlay = document.getElementById('mobile-overlay');
    if (!btn || !drawer || !overlay) return;

    function open() {
        drawer.classList.add('open'); overlay.classList.add('open'); btn.classList.add('open');
        btn.setAttribute('aria-expanded', 'true'); drawer.setAttribute('aria-hidden', 'false');
    }
    function close() {
        drawer.classList.remove('open'); overlay.classList.remove('open'); btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false'); drawer.setAttribute('aria-hidden', 'true');
    }
    btn.addEventListener('click', function() { drawer.classList.contains('open') ? close() : open(); });
    overlay.addEventListener('click', close);
    drawer.querySelectorAll('a[href^="#"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var target = document.querySelector(link.getAttribute('href'));
            if (target) {
                var idx = parseInt(target.dataset.section, 10);
                if (!isNaN(idx)) {
                    document.dispatchEvent(new CustomEvent('fpGoTo', { detail: idx }));
                }
            }
            close();
        });
    });
})();

/* Cross-IIFE bridge */
document.addEventListener('fpGoTo', function(e) {
    var sections   = document.querySelectorAll('.fullpage-section');
    var navDots    = document.querySelectorAll('.nav-dot');
    var mobileDots = document.querySelectorAll('.mobile-section-dot');
    var index = e.detail;
    if (index < 0 || index >= sections.length) return;
    sections.forEach(function(s) { s.classList.remove('active'); });
    navDots.forEach(function(d) { d.classList.remove('active'); });
    mobileDots.forEach(function(d) { d.classList.remove('active'); });
    sections[index].classList.add('active');
    if (navDots[index])    navDots[index].classList.add('active');
    if (mobileDots[index]) mobileDots[index].classList.add('active');
});

/* Past Editions dropdown */
(function () {
    'use strict';
    var toggle = document.getElementById('editions-toggle');
    if (!toggle) return;
    var dropdown = toggle.nextElementSibling;
    toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        var isOpen = dropdown.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
    });
    document.addEventListener('click', function() {
        dropdown.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false');
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            dropdown.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false');
            toggle.focus();
        }
    });
})();

/* Deadline guard — covers submit-paper & register buttons with data-deadline */
(function () {
    'use strict';

    var deadlineBtns = document.querySelectorAll('[data-deadline]');
    if (!deadlineBtns.length) return;

    deadlineBtns.forEach(function (btn) {
        var deadlineStr = btn.getAttribute('data-deadline');
        var deadline = deadlineStr ? new Date(deadlineStr) : null;
        if (!deadline || Number.isNaN(deadline.getTime())) return;

        var now = new Date();
        var isExpired = now.getTime() > deadline.getTime();
        if (!isExpired) return;

        btn.setAttribute('aria-disabled', 'true');
        btn.classList.add('is-expired');

        btn.addEventListener('click', function (e) {
            e.preventDefault();
            var label = btn.textContent.trim();
            var msg = 'This deadline has passed.';
            if (btn.id && btn.id.indexOf('submit') !== -1) {
                msg = 'Submission deadline has passed. Please contact CedexChina@nottingham.edu.cn for inquiries.';
            } else if (btn.id && btn.id.indexOf('register') !== -1) {
                msg = 'Early registration deadline (June 10) has passed. Please contact CedexChina@nottingham.edu.cn for on-site registration inquiries.';
            }
            alert(msg);
        });
    });
})();


