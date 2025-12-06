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
                const userPhoto = (function () {
                    try { return localStorage.getItem('enauto_photo') || null; } catch (e) { return null; }
                })();
                console.log('[PROFILE] Rendering profile card:', {name, email, hasPhoto: !!userPhoto});

                // Create profile card in top-right
                const profileCardDiv = document.createElement('div');
                profileCardDiv.id = PROFILE_CARD_ID;
                profileCardDiv.className = 'profile-card';
                profileCardDiv.setAttribute('role', 'dialog');
                profileCardDiv.setAttribute('aria-label', 'User Profile Card');
                const avatarColor1 = getAvatarColor(name);
                const avatarColor2 = getAvatarColor(name + 'x');

                // Build avatar HTML - image if photo exists, gradient fallback otherwise
                let avatarHTML = '';
                if (userPhoto) {
                    avatarHTML = `<img src="${userPhoto}" alt="${name}" class="profile-avatar" style="object-fit: cover; border: 3px solid rgba(255, 255, 255, 0.2); width: 80px; height: 80px; border-radius: 50%;">`;
                } else {
                    avatarHTML = `<div class="profile-avatar" style="background: linear-gradient(135deg, ${avatarColor1} 0%, ${avatarColor2} 100%);">
                        ${name.charAt(0).toUpperCase()}
                    </div>`;
                }

                profileCardDiv.innerHTML = `
                    <div class="profile-card-header">
                        <button class="profile-card-close" type="button" aria-label="Close profile card">×</button>
                    </div>
                    <div class="profile-card-body">
                        ${avatarHTML}
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

                // Helper function to close card with proper state
                function closeProfileCard() {
                    if (profileCardDiv.classList.contains('show')) {
                        profileCardDiv.classList.remove('show');
                        // Update toggle button state
                        const toggleBtn = document.querySelector('.profile-toggle-btn');
                        if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
                        return true;
                    }
                    return false;
                }

                // Helper function to open card with proper state
                function openProfileCard() {
                    if (!profileCardDiv.classList.contains('show')) {
                        profileCardDiv.classList.add('show');
                        // Update toggle button state
                        const toggleBtn = document.querySelector('.profile-toggle-btn');
                        if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
                        return true;
                    }
                    return false;
                }

                // Close button handler
                profileCardDiv.querySelector('.profile-card-close').addEventListener('click', function (e) {
                    e.stopPropagation();
                    closeProfileCard();
                });

                // Prevent card from closing when clicking inside it
                profileCardDiv.addEventListener('click', function (e) {
                    e.stopPropagation();
                });

                // Close card when clicking outside (on document)
                function handleOutsideClick(e) {
                    const toggleBtn = document.querySelector('.profile-toggle-btn');
                    if (profileCardDiv && !profileCardDiv.contains(e.target) &&
                        toggleBtn && !toggleBtn.contains(e.target)) {
                        closeProfileCard();
                    }
                }

                // Logout button handler
                profileCardDiv.querySelector('.profile-logout-btn').addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    try { 
                        const currentUser = localStorage.getItem('enauto_user');
                        localStorage.removeItem('enauto_user'); 
                        localStorage.removeItem('enauto_email');
                        localStorage.removeItem('enauto_photo');
                        console.log('[LOGOUT] User logged out:', currentUser);
                    } catch (err) { 
                        console.error('[LOGOUT] Error clearing user data:', err);
                    }
                    if (typeof setLoggedInState === 'function') setLoggedInState(false);
                    else fallbackSetLogged(false);
                    closeProfileCard();
                    setTimeout(() => {
                        // Remove click outside listener before re-render
                        document.removeEventListener('click', handleOutsideClick);
                        renderAuthUI();
                        createToast('Anda telah logout');
                    }, 300);
                });

                // Add toggle button in header
                const container = document.createElement('div');
                container.id = AUTH_CONTAINER_ID;
                container.className = 'profile-toggle-container';

                const profileToggleBtn = document.createElement('button');
                profileToggleBtn.className = 'btn btn-sm btn-warning profile-toggle-btn';
                profileToggleBtn.type = 'button';
                profileToggleBtn.setAttribute('aria-expanded', 'false');
                profileToggleBtn.setAttribute('aria-controls', PROFILE_CARD_ID);
                profileToggleBtn.innerHTML = `<i class="fas fa-user-circle me-1"></i>${name}`;

                // Toggle button click handler with state sync
                profileToggleBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    const isOpen = profileCardDiv.classList.contains('show');
                    if (isOpen) {
                        closeProfileCard();
                    } else {
                        openProfileCard();
                    }
                });

                // Add "Order Now" button
                const orderNowBtn = document.createElement('button');
                orderNowBtn.className = 'btn btn-sm btn-outline-warning order-now-btn';
                orderNowBtn.type = 'button';
                orderNowBtn.innerHTML = `<i class="fas fa-shopping-bag me-1"></i>Order Now`;
                orderNowBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    // Close profile card before scrolling
                    closeProfileCard();
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

                // Show profile card initially if needed (auto-open on first login)
                setTimeout(() => {
                    // Card starts hidden, user must click toggle to open
                    profileCardDiv.classList.remove('show');
                }, 10);

                // Add click outside listener
                setTimeout(() => {
                    document.addEventListener('click', handleOutsideClick);
                }, 100);
            } else {
                // Remove click outside listener and show original buttons
                const allClickHandlers = document.querySelectorAll('.profile-toggle-btn');
                allClickHandlers.forEach(btn => {
                    document.removeEventListener('click', function handleOutsideClick() { });
                });
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
