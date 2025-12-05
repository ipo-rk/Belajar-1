// Navbar auth UI helper with profile card (depends on auth helpers in javascrip.js)
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
        const PROFILE_CARD_ID = 'profileCard';

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

        function getAvatarColor(name) {
            const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
            let hash = 0;
            for (let i = 0; i < name.length; i++) {
                hash = name.charCodeAt(i) + ((hash << 5) - hash);
            }
            return colors[Math.abs(hash) % colors.length];
        }

        function renderAuthUI() {
            const logged = isUserLoggedIn();

            // remove existing container if any
            const existing = document.getElementById(AUTH_CONTAINER_ID);
            if (existing) existing.remove();
            const profileCard = document.getElementById(PROFILE_CARD_ID);
            if (profileCard) profileCard.remove();

            if (logged) {
                // hide original login/register buttons
                headerBtns.forEach(b => b.style.display = 'none');

                const name = (function () {
                    try { return localStorage.getItem('enauto_user') || 'User'; } catch (e) { return 'User'; }
                })();
                const email = (function () {
                    try { return localStorage.getItem('enauto_email') || 'user@example.com'; } catch (e) { return 'user@example.com'; }
                })();

                // Create profile card in top-right
                const profileCardDiv = document.createElement('div');
                profileCardDiv.id = PROFILE_CARD_ID;
                profileCardDiv.className = 'profile-card';
                const avatarColor1 = getAvatarColor(name);
                const avatarColor2 = getAvatarColor(name + 'x');
                profileCardDiv.innerHTML = `
                    <div class="profile-card-header">
                        <button class="profile-card-close" type="button">×</button>
                    </div>
                    <div class="profile-card-body">
                        <div class="profile-avatar" style="background: linear-gradient(135deg, ${avatarColor1} 0%, ${avatarColor2} 100%);">
                            ${name.charAt(0).toUpperCase()}
                        </div>
                        <h3 class="profile-name">${name}</h3>
                        <p class="profile-email">${email}</p>
                        <div class="profile-actions">
                            <button class="btn btn-sm btn-outline-warning btn-block profile-logout-btn" type="button">
                                <i class="fas fa-sign-out-alt me-1"></i>Logout
                            </button>
                        </div>
                    </div>
                `;

                document.body.appendChild(profileCardDiv);

                // Close button
                profileCardDiv.querySelector('.profile-card-close').addEventListener('click', function () {
                    profileCardDiv.classList.remove('show');
                    setTimeout(() => profileCardDiv.remove(), 300);
                });

                // Logout button
                profileCardDiv.querySelector('.profile-logout-btn').addEventListener('click', function (e) {
                    e.preventDefault();
                    try { localStorage.removeItem('enauto_user'); } catch (err) { }
                    try { localStorage.removeItem('enauto_email'); } catch (err) { }
                    if (typeof setLoggedInState === 'function') setLoggedInState(false);
                    else fallbackSetLogged(false);
                    profileCardDiv.classList.remove('show');
                    setTimeout(() => {
                        renderAuthUI();
                        createToast('Anda telah logout');
                    }, 300);
                });

                // Show profile card with animation
                setTimeout(() => profileCardDiv.classList.add('show'), 10);

                // Also add toggle button in header
                const container = document.createElement('div');
                container.id = AUTH_CONTAINER_ID;
                container.className = 'profile-toggle-container';

                const profileToggleBtn = document.createElement('button');
                profileToggleBtn.className = 'btn btn-sm btn-warning profile-toggle-btn';
                profileToggleBtn.type = 'button';
                profileToggleBtn.innerHTML = `<i class="fas fa-user-circle me-1"></i>${name}`;
                profileToggleBtn.addEventListener('click', function () {
                    const card = document.getElementById(PROFILE_CARD_ID);
                    if (card) {
                        card.classList.toggle('show');
                    }
                });

                // Add "Order Now" button
                const orderNowBtn = document.createElement('button');
                orderNowBtn.className = 'btn btn-sm btn-outline-warning order-now-btn';
                orderNowBtn.type = 'button';
                orderNowBtn.innerHTML = `<i class="fas fa-shopping-bag me-1"></i>Order Now`;
                orderNowBtn.addEventListener('click', function () {
                    const orderSection = document.getElementById('order');
                    if (orderSection) {
                        const scrollPaddingTop = window.innerWidth <= 480 ? 90 : (window.innerWidth <= 767 ? 100 : 120);
                        const targetPosition = orderSection.getBoundingClientRect().top + window.scrollY - scrollPaddingTop;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });

                container.appendChild(profileToggleBtn);
                container.appendChild(orderNowBtn);
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
