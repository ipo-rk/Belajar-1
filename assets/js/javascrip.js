// ===========================
// LOADER / SPINNER MANAGEMENT
// ===========================
function hideLoader() {
    const loaderContainer = document.getElementById('loaderContainer');
    if (loaderContainer) {
        loaderContainer.classList.add('hidden');
        console.log('[LOADER] Hidden');
    }
}

function showLoader() {
    const loaderContainer = document.getElementById('loaderContainer');
    if (loaderContainer) {
        loaderContainer.classList.remove('hidden');
        console.log('[LOADER] Shown');
    }
}

// Hide loader when page is fully loaded
window.addEventListener('load', function () {
    console.log('[LOADER] Page fully loaded');
    setTimeout(() => {
        hideLoader();
        document.body.style.opacity = '1';
    }, 500);
});

// Also hide loader after a timeout (failsafe)
setTimeout(() => {
    hideLoader();
}, 5000);

// Enhanced Sticky Navbar Script dengan Scroll Effects
document.addEventListener('DOMContentLoaded', function () {
    const navbar = document.querySelector('.sticky-navbar');
    const header = document.querySelector('header');

    // Get navbar height
    const navbarHeight = navbar.offsetHeight;

    function handleScroll() {
        // Get header bottom position
        const headerBottom = header.offsetHeight;
        const scrollPosition = window.scrollY;

        // If scrolled past header, add sticky class
        if (scrollPosition >= headerBottom) {
            navbar.classList.add('sticky-active');
        } else {
            navbar.classList.remove('sticky-active');
        }

        // Parallax effect untuk background
        const parallaxElements = document.querySelectorAll('[style*="background-image"]');
        parallaxElements.forEach(element => {
            if (element.offsetParent !== null) {
                const scrolled = window.scrollY;
                const elemPosition = element.getBoundingClientRect().top + scrolled;
                const distance = scrolled - elemPosition;
                element.style.backgroundPosition = `center ${distance * 0.5}px`;
            }
        });
    }

    // Listen to scroll events
    window.addEventListener('scroll', handleScroll);

    // Handle navigation link clicks
    const navLinks = document.querySelectorAll('.navbar-collapse a[href^="#"]');
    navLinks.forEach((link, index) => {
        link.style.animationDelay = `${index * 0.1}s`;
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Only add smooth scroll behavior, don't prevent default
            if (href !== '#' && href !== '#home') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    // Close navbar if open
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse.classList.contains('show')) {
                        const toggler = document.querySelector('.navbar-toggler');
                        toggler.click();
                    }

                    // Calculate offset untuk scroll padding
                    const offset = 120; // Default desktop offset
                    const scrollPaddingTop = window.innerWidth <= 480 ? 90 : (window.innerWidth <= 767 ? 100 : 120);
                    const targetPosition = target.getBoundingClientRect().top + window.scrollY - scrollPaddingTop;

                    // Scroll to target dengan offset
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Intersection Observer untuk animasi on-scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all product cards
    document.querySelectorAll('.product-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe section titles
    document.querySelectorAll('.product-section-title').forEach(title => {
        observer.observe(title);
    });

    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function (e) {
            let ripple = document.createElement('span');
            let rect = this.getBoundingClientRect();
            let size = Math.max(rect.width, rect.height);
            let x = e.clientX - rect.left - size / 2;
            let y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            // Remove existing ripple
            let existingRipple = this.querySelector('.ripple');
            if (existingRipple) {
                existingRipple.remove();
            }

            this.appendChild(ripple);
        });
    });

    // Smooth scroll untuk form inputs
    const formInputs = document.querySelectorAll('.form-control');
    formInputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 0 15px rgba(255, 193, 7, 0.4)';
        });
        input.addEventListener('blur', function () {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 0 0 0.2rem rgba(255, 193, 7, 0.25)';
        });
    });

    // Counter animation untuk statistik (jika ada)
    function animateCounter(element) {
        const target = parseInt(element.textContent);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // Header image animation
    const headerImg = document.querySelector('header img');
    if (headerImg) {
        headerImg.addEventListener('mouseenter', function () {
            this.style.filter = 'drop-shadow(0 0 20px rgba(255, 193, 7, 0.6))';
        });
        headerImg.addEventListener('mouseleave', function () {
            this.style.filter = 'drop-shadow(0 0 0px rgba(255, 193, 7, 0))';
        });
    }

    // Add loading animation class on page load
    // Helper: show message using SweetAlert2
    function showTemporaryMessage(message, type = 'info', timeout = 3000) {
        Swal.fire({
            icon: type,
            title: '',
            html: message,
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: timeout,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });
    }

    // Handle modern Login / Register form submissions inside modals
    const loginForm = document.getElementById('loginForm');
    // Helper: set loading state on a button (spinner + disabled)
    function setButtonLoading(btn, loading, label) {
        if (!btn) return;
        if (loading) {
            btn.dataset.orig = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>' + (label || 'Loading...');
        } else {
            btn.disabled = false;
            if (btn.dataset.orig) {
                btn.innerHTML = btn.dataset.orig;
                delete btn.dataset.orig;
            }
        }
    }

    // Password toggle and strength helpers
    function togglePasswordVisibility(button) {
        const target = button.getAttribute('data-target');
        if (!target) return;
        const input = document.querySelector(target);
        if (!input) return;
        const icon = button.querySelector('i');
        if (input.type === 'password') {
            input.type = 'text';
            if (icon) icon.className = 'fas fa-eye-slash';
        } else {
            input.type = 'password';
            if (icon) icon.className = 'fas fa-eye';
        }
    }

    // Basic password strength evaluation (returns score 0-5)
    function evaluatePasswordStrength(pw) {
        if (!pw) return 0;
        let score = 0;
        if (pw.length >= 8) score++;
        if (pw.length >= 12) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        return score; // 0..5
    }

    // Wire up any toggle buttons present
    document.querySelectorAll('.btn-toggle-pwd').forEach(btn => {
        btn.addEventListener('click', function () {
            togglePasswordVisibility(this);
        });
    });


    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const id = loginForm.querySelector('input[name="login-identifier"]').value.trim();
            const pwd = loginForm.querySelector('input[name="login-password"]').value;
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const cancelBtn = loginForm.querySelector('button[data-bs-dismiss]');

            // Check registered users before proceeding
            const registeredUsers = JSON.parse(localStorage.getItem('enauto_coffe_registered_users') || '{}');
            if (!registeredUsers[id]) {
                showTemporaryMessage('Email/Username tidak terdaftar. Silakan register terlebih dahulu.', 'error');
                return;
            }

            // Verify password matches
            if (registeredUsers[id].password !== pwd) {
                showTemporaryMessage('Password salah. Coba lagi.', 'error');
                console.warn('[LOGIN] Password mismatch for:', id);
                return;
            }

            if (!id || !pwd) {
                showTemporaryMessage('Mohon isi semua field login.', 'warning');
                return;
            }

            // set loading state
            setButtonLoading(submitBtn, true, 'Masuk...');
            if (cancelBtn) cancelBtn.disabled = true;

            // simulate async request (replace with fetch/ajax)
            setTimeout(() => {
                // simple success simulation
                showTemporaryMessage(`Login berhasil: ${registeredUsers[id].name}`, 'success');

                // mark user as logged in and enable cart buttons
                try {
                    localStorage.setItem('enauto_user', registeredUsers[id].name);
                    localStorage.setItem('enauto_email', registeredUsers[id].email);
                    // Also restore photo if available
                    if (registeredUsers[id].photo) {
                        localStorage.setItem('enauto_photo', registeredUsers[id].photo);
                        console.log('[LOGIN] Photo restored for user:', id);
                    } else {
                        localStorage.removeItem('enauto_photo');
                    }
                    console.log('[LOGIN] User logged in:', { email: id, name: registeredUsers[id].name, hasPhoto: !!registeredUsers[id].photo });
                } catch (e) {
                    console.error('[LOGIN] Error setting user data:', e);
                }
                setLoggedInState(true);

                // hide modal
                const modalEl = document.getElementById('loginModal');
                if (modalEl) {
                    const bsModal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                    bsModal.hide();
                }
                loginForm.reset();
                // restore buttons
                setButtonLoading(submitBtn, false);
                if (cancelBtn) cancelBtn.disabled = false;
            }, 1200);
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        // Password strength UI wiring
        const pwInput = registerForm.querySelector('#registerPassword');
        const pwBar = document.getElementById('pwStrengthBar');
        const pwText = document.getElementById('pwStrengthText');
        if (pwInput) {
            pwInput.addEventListener('input', function () {
                const score = evaluatePasswordStrength(this.value);
                const percent = Math.min(100, Math.round((score / 5) * 100));
                if (pwBar) {
                    pwBar.style.width = percent + '%';
                    pwBar.classList.remove('bg-danger', 'bg-warning', 'bg-success');
                    if (score <= 1) pwBar.classList.add('bg-danger');
                    else if (score <= 3) pwBar.classList.add('bg-warning');
                    else pwBar.classList.add('bg-success');
                }
                if (pwText) {
                    const txt = score <= 1 ? 'Sangat lemah' : (score <= 3 ? 'Sedang' : 'Kuat');
                    pwText.querySelector('span').textContent = txt;
                }
            });
        }
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = registerForm.querySelector('input[name="register-name"]').value.trim();
            const email = registerForm.querySelector('input[name="register-email"]').value.trim();
            const pw1 = registerForm.querySelector('input[name="register-password"]').value;
            const pw2 = registerForm.querySelector('input[name="register-password2"]').value;
            const photoInput = registerForm.querySelector('#registerPhoto');
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const cancelBtn = registerForm.querySelector('button[data-bs-dismiss]');

            if (!name || !email || !pw1 || !pw2) {
                showTemporaryMessage('Mohon isi semua field registrasi.', 'warning');
                return;
            }

            // basic email check
            const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRe.test(email)) {
                showTemporaryMessage('Alamat email tidak valid.', 'error');
                return;
            }
            // Check if email already registered
            const registeredUsers = JSON.parse(localStorage.getItem('enauto_registered_users') || '{}');
            if (registeredUsers[email]) {
                showTemporaryMessage('Email sudah terdaftar. Gunakan email lain atau login.', 'error');
                return;
            }

            if (pw1 !== pw2) {
                showTemporaryMessage('Password dan konfirmasi tidak cocok.', 'error');
                return;
            }

            // Enforce minimum password strength (score 0..5)
            const pwScore = evaluatePasswordStrength(pw1);
            if (pwScore < 3) {
                showTemporaryMessage('Password terlalu lemah. Gunakan kombinasi huruf besar, angka, dan simbol.', 'warning');
                return;
            }

            // Check if photo file is selected and validate size
            let photoBase64 = null;
            if (photoInput && photoInput.files && photoInput.files.length > 0) {
                const photoFile = photoInput.files[0];
                const maxSize = 2 * 1024 * 1024; // 2MB
                if (photoFile.size > maxSize) {
                    showTemporaryMessage('Foto terlalu besar. Maksimal 2MB.', 'error');
                    console.warn('[REGISTER] Photo file too large:', { filename: photoFile.name, size: photoFile.size });
                    return;
                }
                console.log('[REGISTER] Photo file selected:', { filename: photoFile.name, size: photoFile.size });
            }

            // Loading
            setButtonLoading(submitBtn, true, 'Mendaftar...');
            if (cancelBtn) cancelBtn.disabled = true;

            // Read photo file if exists
            if (photoInput && photoInput.files && photoInput.files.length > 0) {
                const photoFile = photoInput.files[0];
                const reader = new FileReader();

                reader.onload = function (e) {
                    photoBase64 = e.target.result;
                    completeRegistration(name, email, pw1, photoBase64, registerForm, submitBtn, cancelBtn);
                };

                reader.onerror = function () {
                    showTemporaryMessage('Gagal membaca file foto. Silakan coba lagi.', 'error');
                    console.error('[REGISTER] Error reading photo file');
                    setButtonLoading(submitBtn, false);
                    if (cancelBtn) cancelBtn.disabled = false;
                };

                reader.readAsDataURL(photoFile);
                console.log('[REGISTER] Reading photo file as Data URL...');
            } else {
                // No photo, proceed with registration
                completeRegistration(name, email, pw1, null, registerForm, submitBtn, cancelBtn);
            }
        });

        // Helper function to complete registration
        function completeRegistration(name, email, password, photoBase64, form, submitBtn, cancelBtn) {
            setTimeout(() => {
                showTemporaryMessage(`Registrasi berhasil: ${name}`, 'success');

                // Save registered user data with photo if available
                try {
                    const regUsers = JSON.parse(localStorage.getItem('enauto_registered_users') || '{}');
                    regUsers[email] = {
                        name: name,
                        email: email,
                        password: password,
                        photo: photoBase64 || null
                    };
                    localStorage.setItem('enauto_registered_users', JSON.stringify(regUsers));
                    console.log('[REGISTER] User registered:', { email, name, hasPhoto: !!photoBase64 });
                } catch (err) {
                    console.error('[REGISTER] Error saving user data:', err);
                }

                // Automatically log in user after registration
                try {
                    localStorage.setItem('enauto_user', name);
                    localStorage.setItem('enauto_email', email);
                    if (photoBase64) {
                        localStorage.setItem('enauto_photo', photoBase64);
                        console.log('[LOGIN] Photo saved to localStorage');
                    }
                    console.log('[LOGIN] User logged in after registration:', { name, email });
                } catch (e) {
                    console.error('[LOGIN] Error setting login state:', e);
                }
                setLoggedInState(true);

                const modalEl = document.getElementById('registerModal');
                if (modalEl) {
                    const bsModal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                    bsModal.hide();
                }
                form.reset();
                setButtonLoading(submitBtn, false);
                if (cancelBtn) cancelBtn.disabled = false;
            }, 1300);
        }
    }

    // Add loading animation class on page load
    window.addEventListener('load', function () {
        console.log('[CART] Initializing cart on page load');
        document.body.style.opacity = '1';
        initializeCart();
    });

    // ===== CART FUNCTIONALITY =====
    function initializeCart() {
        try {
            // Initialize existing delete buttons
            updateDeleteButtons();
            // Calculate initial total
            updateTotal();
            console.log('[CART] Initialized successfully');
        } catch (error) {
            console.error('[CART] Initialization error:', error);
        }
    }

    // ===== AUTH / CART GATING HELPERS =====
    function isUserLoggedIn() {
        try {
            return localStorage.getItem('enauto_logged') === '1';
        } catch (e) {
            return false;
        }
    }

    function setLoggedInState(state) {
        try {
            if (state) {
                localStorage.setItem('enauto_logged', '1');
                // Note: enauto_user and enauto_email are set in login/register handlers
                enableCartButtons();
            } else {
                localStorage.removeItem('enauto_logged');
                localStorage.removeItem('enauto_user');
                localStorage.removeItem('enauto_email');
                disableCartButtons();
            }
        } catch (e) {
            // ignore storage errors
        }
    }

    function enableCartButtons() {
        document.querySelectorAll('.add-to-cart-btn').forEach(b => {
            b.disabled = false;
            b.classList.remove('disabled');
            b.style.pointerEvents = '';
            b.style.opacity = '';
        });
        const cb = document.getElementById('checkoutBtn');
        if (cb) cb.disabled = false;
        const clear = document.getElementById('clearCartBtn');
        if (clear) clear.disabled = false;
    }

    function disableCartButtons() {
        // Keep "Add to Cart" buttons visually active so users can click them.
        // Clicking while not logged in will show the auth modal (handled in click handler).
        // We only disable checkout/clear controls here.
        const cb = document.getElementById('checkoutBtn');
        if (cb) cb.disabled = true;
        const clear = document.getElementById('clearCartBtn');
        if (clear) clear.disabled = true;
    }

    function showAuthModal(prefer) {
        // prefer: 'login' or 'register' - default to login
        const which = prefer === 'register' ? 'registerModal' : 'loginModal';
        const modalEl = document.getElementById(which);
        if (!modalEl) return;
        const bsModal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
        bsModal.show();
    }

    // Ensure cart buttons reflect stored login state on init
    if (isUserLoggedIn()) {
        enableCartButtons();
    } else {
        disableCartButtons();
    }

    // Add to Cart button click handler
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            // If user not logged in, show auth modal first
            if (!isUserLoggedIn()) {
                showAuthModal('login');
                return;
            }

            const productName = this.getAttribute('data-product');
            const productPrice = this.getAttribute('data-price');

            addProductToCart(productName, productPrice);

            // Show success message
            showTemporaryMessage(`${productName} ditambahkan ke keranjang!`, 'success');

            // Add ripple effect
            createRippleEffect(this, e);
        });
    });

    // Add product to cart table
    // Map product display names to exact filenames in `assets/img/product-img/`
    const productImageMap = {
        'Espresso': 'espresso.png',
        'Cappuccino': 'cappuccino.png',
        'Latte': 'latte.png',
        'Americano': 'americano.png',
        'Creme Latte': 'creme-latte.png',
        'Coffe': 'coffe.png'
    };

    function addProductToCart(productName, productPrice) {
        const orderTable = document.querySelector('.order-table tbody');
        if (!orderTable) return;

        const dataRows = Array.from(orderTable.querySelectorAll('tr:not(:last-child)')); // Exclude total row

        // Check if product already exists
        let existingRow = null;
        for (let row of dataRows) {
            const menuCell = row.querySelector('td:nth-child(2)');
            if (menuCell && menuCell.textContent.includes(productName)) {
                existingRow = row;
                break;
            }
        }

        if (existingRow) {
            // Increase quantity if product already in cart
            const quantityInput = existingRow.querySelector('.quantity-input');
            if (quantityInput) {
                const currentQty = parseInt(quantityInput.value) || 1;
                quantityInput.value = currentQty + 1;
                // Trigger update
                quantityInput.dispatchEvent(new Event('change', { bubbles: true }));
            }
        } else {
            // Create new row
            const newRowNumber = dataRows.length + 1;
            const newRow = document.createElement('tr');
            newRow.className = 'align-middle border-bottom border-secondary';

            // Resolve image filename from map; fall back to a normalized file name
            const imgFile = (productImageMap[productName] || (productName.toLowerCase().replace(/\s+/g, ' ') + '.png'));
            const imgPath = encodeURI(`assets/img/product-img/${imgFile}`);

            newRow.innerHTML = `
                <td class="fw-semibold">${newRowNumber}</td>
                <td>
                    <div class="d-flex align-items-center gap-2">
                            <img src="${imgPath}" 
                             alt="${productName}" class="order-table-img rounded" 
                                onerror="this.onerror=null;this.src='assets/img/product-img/espresso.png'">
                        <span>${productName}</span>
                    </div>
                </td>
                <td class="fw-semibold">$${productPrice}</td>
                <td>
                    <input type="number" class="form-control form-control-sm quantity-input" value="1" min="1" max="99">
                </td>
                <td class="fw-bold text-warning">$${productPrice}</td>
                <td>
                    <button class="btn btn-sm btn-outline-danger delete-btn" title="Hapus">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;

            // Insert before total row
            const totalRow = orderTable.querySelector('tr:last-child');
            if (totalRow) {
                totalRow.parentNode.insertBefore(newRow, totalRow);
            } else {
                orderTable.appendChild(newRow);
            }

            // Add event listener to new delete button
            const deleteBtn = newRow.querySelector('.delete-btn');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    newRow.remove();
                    updateRowNumbers();
                    updateTotal();
                });
            }

            // Add event listener to new quantity input
            const qtyInput = newRow.querySelector('.quantity-input');
            if (qtyInput) {
                qtyInput.addEventListener('change', function () {
                    updateTotal();
                });
                qtyInput.addEventListener('input', function () {
                    let value = parseInt(this.value);
                    if (isNaN(value) || value < 1) {
                        this.value = 1;
                    } else if (value > 99) {
                        this.value = 99;
                    }
                    updateTotal();
                });
            }
        }

        updateTotal();
    }

    // Update row numbers
    function updateRowNumbers() {
        const rows = document.querySelectorAll('.order-table tbody tr:not(:last-child)');
        rows.forEach((row, index) => {
            const noCell = row.querySelector('td:first-child');
            if (noCell) {
                noCell.textContent = index + 1;
            }
        });
    }

    // Update total price in order table
    function updateTotal() {
        try {
            const rows = document.querySelectorAll('.order-table tbody tr:not(:last-child)');
            let total = 0;
            let itemCount = 0;

            rows.forEach(row => {
                const priceCell = row.querySelector('td:nth-child(3)');
                const quantityInput = row.querySelector('.quantity-input');
                const totalCell = row.querySelector('td:nth-child(5)');

                if (priceCell && quantityInput && totalCell) {
                    const price = parseFloat(priceCell.textContent.replace('$', '')) || 0;
                    const quantity = parseInt(quantityInput.value) || 1;
                    const itemTotal = price * quantity;

                    // Update total cell (5th column)
                    totalCell.textContent = '$' + itemTotal.toFixed(2);

                    total += itemTotal;
                    itemCount++;
                }
            });

            // Update total row di tabel
            const totalRow = document.querySelector('.order-table tbody tr:last-child');
            if (totalRow) {
                const totalCell = totalRow.querySelector('td:nth-child(5)');
                if (totalCell) {
                    totalCell.textContent = '$' + total.toFixed(2);
                }
            }

            // Update total pesanan dengan ID yang spesifik
            const totalPesananElement = document.getElementById('totalPesanan');
            if (totalPesananElement) {
                totalPesananElement.textContent = '$' + total.toFixed(2);
            }

            console.log('[CART] Total updated:', { itemCount, total: total.toFixed(2) });
            return total;
        } catch (error) {
            console.error('[CART] Error updating total:', error);
            return 0;
        }
    }

    // Update delete button handlers
    function updateDeleteButtons() {
        try {
            document.querySelectorAll('.order-table tbody .delete-btn').forEach(btn => {
                // Remove existing listeners by cloning
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);

                // Add new listener
                newBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    const row = this.closest('tr');
                    if (row) {
                        const productName = row.querySelector('td:nth-child(2)')?.textContent || 'Product';
                        row.remove();
                        updateRowNumbers();
                        updateTotal();
                        console.log('[CART] Item removed:', productName);
                    }
                });
            });
        } catch (error) {
            console.error('[CART] Error updating delete buttons:', error);
        }
    }

    // Update total when quantity changes
    document.addEventListener('change', function (e) {
        if (e.target.classList.contains('quantity-input')) {
            try {
                const newQty = parseInt(e.target.value);
                console.log('[CART] Quantity changed:', newQty);
                updateTotal();
            } catch (error) {
                console.error('[CART] Error on quantity change:', error);
            }
        }
    });

    // Update total when quantity input value changes
    document.addEventListener('input', function (e) {
        if (e.target.classList.contains('quantity-input')) {
            try {
                let value = parseInt(e.target.value);
                if (isNaN(value) || value < 1) {
                    e.target.value = 1;
                    value = 1;
                } else if (value > 99) {
                    e.target.value = 99;
                    value = 99;
                }
                updateTotal();
                console.log('[CART] Quantity input updated:', value);
            } catch (error) {
                console.error('[CART] Error on quantity input:', error);
            }
        }
    });

    // Create ripple effect for button clicks
    function createRippleEffect(button, event) {
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.width = ripple.style.height = '20px';
        ripple.style.left = (event.clientX - rect.left - 10) + 'px';
        ripple.style.top = (event.clientY - rect.top - 10) + 'px';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'ripple-effect 0.6s ease-out';
        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    // ===== BUTTON ACTIONS =====
    // Clear/Add cart button - kosongkan semua item (dengan konfirmasi)
    const clearCartBtn = document.getElementById('clearCartBtn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const table = document.querySelector('.order-table tbody');
            if (!table) return;

            const rows = table.querySelectorAll('tr:not(:last-child)');

            if (rows.length === 0) {
                showTemporaryMessage('Keranjang sudah kosong', 'info');
                return;
            }

            // Confirm with SweetAlert2 before clearing
            Swal.fire({
                title: 'Kosongkan keranjang?',
                text: 'Semua item akan dihapus dari keranjang. Lanjutkan?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, kosongkan',
                cancelButtonText: 'Batal',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    rows.forEach(row => row.remove());
                    updateRowNumbers();
                    updateTotal();
                    showTemporaryMessage('✓ Keranjang telah dikosongkan', 'success');
                }
            });
        });
    }

    // Checkout button - proses checkout
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            // Ensure user is logged in before checkout
            if (!isUserLoggedIn()) {
                showAuthModal('login');
                return;
            }

            const rows = document.querySelectorAll('.order-table tbody tr:not(:last-child)');

            if (rows.length === 0) {
                showTemporaryMessage('⚠ Keranjang masih kosong. Pilih produk terlebih dahulu!', 'warning');
                console.warn('[CHECKOUT] Cart is empty');
                return;
            }

            try {
                // Get total
                const totalPesananElement = document.getElementById('totalPesanan');
                const total = totalPesananElement ? totalPesananElement.textContent : '$0.00';
                const totalAmount = parseFloat(total.replace('$', ''));

                // Collect order data
                const orderItems = [];
                rows.forEach((row, index) => {
                    const menuCell = row.querySelector('td:nth-child(2)');
                    const priceCell = row.querySelector('td:nth-child(3)');
                    const qtyCell = row.querySelector('.quantity-input');

                    if (menuCell && priceCell && qtyCell) {
                        const productName = menuCell.textContent.trim().split('\n')[0];
                        const price = parseFloat(priceCell.textContent.replace('$', ''));
                        const qty = parseInt(qtyCell.value);

                        orderItems.push({
                            no: index + 1,
                            product: productName,
                            price: price.toFixed(2),
                            quantity: qty
                        });
                    }
                });

                // Save order data to sessionStorage for checkout page
                const checkoutData = {
                    items: orderItems,
                    total: total,
                    totalAmount: totalAmount,
                    timestamp: new Date().toISOString()
                };
                
                sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
                console.log('[CHECKOUT] Order data saved to sessionStorage:', {
                    itemCount: orderItems.length,
                    total: total
                });

                // Show success message
                let itemsText = orderItems.map(item => `${item.product} (${item.quantity}x)`).join(', ');
                showTemporaryMessage(`✓ Redirecting to checkout... Total: ${total} | Items: ${itemsText}`, 'success');

                // Redirect to checkout page
                setTimeout(() => {
                    console.log('[CHECKOUT] Redirecting to checkout page');
                    window.location.href = 'checkout.html';
                }, 1500);

            } catch (error) {
                console.error('[CHECKOUT] Error during checkout:', error);
                showTemporaryMessage('Error processing checkout. Please try again.', 'error');
            }
        });
    }
});

