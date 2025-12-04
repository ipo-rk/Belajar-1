// Navbar auth UI helper (depends on auth helpers in javascrip.js)
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        // Fallback helpers if main script isn't exposing them
        const fallbackIsLoggedIn = function () {
            try { return localStorage.getItem('enauto_logged') === '1'; } catch (e) { return false; }
        };
        const fallbackSetLogged = function (state) {
            try {
                if (state) localStorage.setItem('enauto_logged', '1');
                else localStorage.removeItem('enauto_logged');
            } catch (e) { }
        };

        const isUserLoggedIn = window.isUserLoggedIn || fallbackIsLoggedIn;
        const setLoggedInState = window.setLoggedInState || fallbackSetLogged;

        const headerBtns = document.querySelectorAll('header .header-btn');
        if (!headerBtns || headerBtns.length === 0) return;

        const headerBtnParent = headerBtns[0].parentElement;
        const AUTH_CONTAINER_ID = 'authContainer';

        function createToast(msg, timeout = 2000) {
            const t = document.createElement('div');
            t.className = 'tmp-toast';
            t.textContent = msg;
            t.style.position = 'fixed';
            t.style.right = '1rem';
            t.style.bottom = '1rem';
            t.style.background = 'rgba(0,0,0,0.75)';
            t.style.color = '#fff';
            t.style.padding = '0.6rem 0.9rem';
            t.style.borderRadius = '0.5rem';
            t.style.zIndex = 3000;
            document.body.appendChild(t);
            setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 250); }, timeout);
        }

        function renderAuthUI() {
            const logged = isUserLoggedIn();

            // remove existing container if any
            const existing = document.getElementById(AUTH_CONTAINER_ID);
            if (existing) existing.remove();

            if (logged) {
                // hide original login/register buttons
                headerBtns.forEach(b => b.style.display = 'none');

                const container = document.createElement('div');
                container.id = AUTH_CONTAINER_ID;
                container.className = 'd-flex gap-2 align-items-center';

                const name = (function () {
                    try { return localStorage.getItem('enauto_user') || 'User'; } catch (e) { return 'User'; }
                })();

                const nameSpan = document.createElement('span');
                nameSpan.className = 'text-light fw-semibold';
                nameSpan.textContent = `Hi, ${name}`;

                const logoutBtn = document.createElement('button');
                logoutBtn.id = 'logoutBtn';
                logoutBtn.className = 'btn btn-outline-danger';
                logoutBtn.textContent = 'Logout';

                logoutBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    try { localStorage.removeItem('enauto_user'); } catch (err) { }
                    if (typeof setLoggedInState === 'function') setLoggedInState(false);
                    else fallbackSetLogged(false);
                    renderAuthUI();
                    createToast('Anda telah logout');
                });

                container.appendChild(nameSpan);
                container.appendChild(logoutBtn);
                headerBtnParent.appendChild(container);
            } else {
                // show original buttons
                headerBtns.forEach(b => b.style.display = 'inline-block');
            }
        }

        // initial render
        renderAuthUI();

        // Keep UI in sync if login state changes (other script may change it)
        let lastState = isUserLoggedIn();
        setInterval(() => {
            try {
                const current = isUserLoggedIn();
                if (current !== lastState) {
                    lastState = current;
                    renderAuthUI();
                }
            } catch (e) { }
        }, 800);
    });
})();
