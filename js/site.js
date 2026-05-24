(function () {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
            menuButton.setAttribute('aria-expanded', String(!mobileMenu.classList.contains('hidden')));
        });
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-controls', 'mobile-menu');
        menuButton.setAttribute('aria-label', 'Toggle navigation menu');
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();
            targetElement.scrollIntoView({ behavior: 'smooth' });

            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                if (menuButton) menuButton.setAttribute('aria-expanded', 'false');
            }
        });
    });
})();

function toggleFaq(id) {
    const answer = document.getElementById('faq-answer-' + id);
    const button = document.getElementById('faq-question-' + id);
    if (!answer || !button) return;

    const icon = button.querySelector('i');
    const isOpen = answer.classList.toggle('active');

    if (isOpen) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        button.setAttribute('aria-expanded', 'true');
        if (icon) {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        }
    } else {
        answer.style.maxHeight = '0';
        button.setAttribute('aria-expanded', 'false');
        if (icon) {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        }
    }
}
