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

        const headerAuthContainer = document.getElementById('header-auth-container');
        if (!headerAuthContainer) return;

        const headerBtns = headerAuthContainer.querySelectorAll('.header-btn');
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

                const name = (function () {
                    try { return localStorage.getItem('enauto_user') || 'User'; } catch (e) { return 'User'; }
                })();

                const container = document.createElement('div');
                container.id = AUTH_CONTAINER_ID;
                container.className = 'd-flex align-items-center';
                container.style.gap = '1rem';
                container.style.width = '100%';
                container.style.justifyContent = 'flex-end';

                // Profile card wrapper
                const profileCard = document.createElement('div');
                profileCard.className = 'dropdown';
                profileCard.style.position = 'relative';

                // Profile button (avatar + name)
                const profileBtn = document.createElement('button');
                profileBtn.className = 'btn btn-dark d-flex align-items-center gap-2 dropdown-toggle';
                profileBtn.type = 'button';
                profileBtn.id = 'profileDropdown';
                profileBtn.setAttribute('data-bs-toggle', 'dropdown');
                profileBtn.setAttribute('aria-expanded', 'false');
                profileBtn.style.border = '2px solid rgba(255, 193, 7, 0.3)';
                profileBtn.style.transition = 'all 0.3s ease';
                profileBtn.style.padding = '0.5rem 1rem';
                profileBtn.style.whiteSpace = 'nowrap';

                // Avatar circle with initials
                const avatar = document.createElement('div');
                avatar.style.width = '36px';
                avatar.style.height = '36px';
                avatar.style.borderRadius = '50%';
                avatar.style.background = 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)';
                avatar.style.display = 'flex';
                avatar.style.alignItems = 'center';
                avatar.style.justifyContent = 'center';
                avatar.style.color = '#000';
                avatar.style.fontWeight = 'bold';
                avatar.style.fontSize = '16px';
                avatar.style.flexShrink = '0';
                avatar.textContent = name.charAt(0).toUpperCase();

                // User name text
                const nameText = document.createElement('span');
                nameText.className = 'text-light fw-semibold';
                nameText.textContent = name;
                nameText.style.maxWidth = '120px';
                nameText.style.overflow = 'hidden';
                nameText.style.textOverflow = 'ellipsis';
                nameText.style.whiteSpace = 'nowrap';
                nameText.style.fontSize = '0.95rem';

                profileBtn.appendChild(avatar);
                profileBtn.appendChild(nameText);

                // Dropdown menu
                const dropdownMenu = document.createElement('ul');
                dropdownMenu.className = 'dropdown-menu dropdown-menu-end';
                dropdownMenu.setAttribute('aria-labelledby', 'profileDropdown');
                dropdownMenu.style.background = 'linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(30, 30, 30, 0.95) 100%)';
                dropdownMenu.style.border = '1px solid rgba(255, 193, 7, 0.2)';
                dropdownMenu.style.backdropFilter = 'blur(10px)';
                dropdownMenu.style.borderRadius = '8px';

                // Profile info item
                const profileInfo = document.createElement('li');
                profileInfo.innerHTML = `
                    <div class="dropdown-item-text text-light" style="padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255, 193, 7, 0.1);">
                        <div style="font-size: 0.9rem; color: rgba(255, 255, 255, 0.7);">Logged in as</div>
                        <div style="font-weight: 600; color: #ffc107; margin-top: 0.25rem;">${name}</div>
                    </div>
                `;
                dropdownMenu.appendChild(profileInfo);

                // Divider
                const divider = document.createElement('li');
                divider.innerHTML = '<hr class="dropdown-divider" style="margin: 0.5rem 0; border-color: rgba(255, 193, 7, 0.1);">';
                dropdownMenu.appendChild(divider);

                // Logout item
                const logoutItem = document.createElement('li');
                const logoutLink = document.createElement('a');
                logoutLink.href = '#';
                logoutLink.className = 'dropdown-item text-danger';
                logoutLink.innerHTML = '<i class="fas fa-sign-out-alt me-2"></i>Logout';
                logoutLink.style.transition = 'all 0.3s ease';
                logoutLink.addEventListener('mouseenter', function () {
                    this.style.background = 'rgba(220, 53, 69, 0.15)';
                });
                logoutLink.addEventListener('mouseleave', function () {
                    this.style.background = '';
                });
                logoutLink.addEventListener('click', function (e) {
                    e.preventDefault();
                    try { localStorage.removeItem('enauto_user'); } catch (err) { }
                    if (typeof setLoggedInState === 'function') setLoggedInState(false);
                    else fallbackSetLogged(false);
                    renderAuthUI();
                    createToast('Anda telah logout');
                });
                logoutItem.appendChild(logoutLink);
                dropdownMenu.appendChild(logoutItem);

                profileCard.appendChild(profileBtn);
                profileCard.appendChild(dropdownMenu);
                container.appendChild(profileCard);
                headerAuthContainer.appendChild(container);

                // Add hover effect to profile button
                profileBtn.addEventListener('mouseenter', function () {
                    this.style.borderColor = 'rgba(255, 193, 7, 0.6)';
                    this.style.boxShadow = '0 0 15px rgba(255, 193, 7, 0.2)';
                });
                profileBtn.addEventListener('mouseleave', function () {
                    this.style.borderColor = 'rgba(255, 193, 7, 0.3)';
                    this.style.boxShadow = '';
                });
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
