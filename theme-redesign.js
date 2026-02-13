(function () {
    function isNaturallyInteractive(el) {
        return /^(A|BUTTON|INPUT|SELECT|TEXTAREA|SUMMARY)$/.test(el.tagName);
    }

    function bindKeyboardClick(el) {
        if (isNaturallyInteractive(el)) return;
        if (!el.getAttribute('role')) el.setAttribute('role', 'button');
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
        if (el.dataset.kbBound === '1') return;
        el.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                el.click();
            }
        });
        el.dataset.kbBound = '1';
    }

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.feedback').forEach(function (el) {
            if (!el.hasAttribute('aria-live')) el.setAttribute('aria-live', 'polite');
        });

        document.querySelectorAll('[onclick]').forEach(bindKeyboardClick);

        document.querySelectorAll('script[src$="components.js"]').forEach(function (s) {
            var enhanced = document.querySelector('script[src$="components-enhanced.js"]');
            if (enhanced && s !== enhanced) {
                // keep script order stable if both exist; marker only
                s.setAttribute('data-duplicate-components', 'true');
            }
        });
    });
})();
