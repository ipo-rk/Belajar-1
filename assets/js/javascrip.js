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
    // Helper: show a temporary toast message in bottom-right
    function showTemporaryMessage(message, timeout = 3000) {
        const id = 'tmp-toast-msg';
        // create container
        const toast = document.createElement('div');
        toast.className = 'tmp-toast';
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.right = '1rem';
        toast.style.bottom = '1rem';
        toast.style.background = 'rgba(0,0,0,0.8)';
        toast.style.color = '#fff';
        toast.style.padding = '0.6rem 0.9rem';
        toast.style.borderRadius = '0.5rem';
        toast.style.boxShadow = '0 6px 18px rgba(0,0,0,0.4)';
        toast.style.zIndex = 2000;
        toast.style.fontSize = '0.95rem';
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.transition = 'opacity 0.25s ease';
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, timeout);
    }

    // Handle modern Login / Register form submissions inside modals
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const id = loginForm.querySelector('input[name="login-identifier"]').value.trim();
            const pwd = loginForm.querySelector('input[name="login-password"]').value;
            if (!id || !pwd) {
                showTemporaryMessage('Mohon isi semua field login.');
                return;
            }
            // Simulate login success (replace with real auth later)
            showTemporaryMessage(`Login berhasil: ${id}`);
            // hide modal
            const modalEl = document.getElementById('loginModal');
            if (modalEl) {
                const bsModal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                bsModal.hide();
            }
            loginForm.reset();
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = registerForm.querySelector('input[name="register-name"]').value.trim();
            const email = registerForm.querySelector('input[name="register-email"]').value.trim();
            const pw1 = registerForm.querySelector('input[name="register-password"]').value;
            const pw2 = registerForm.querySelector('input[name="register-password2"]').value;
            if (!name || !email || !pw1 || !pw2) {
                showTemporaryMessage('Mohon isi semua field registrasi.');
                return;
            }
            if (pw1 !== pw2) {
                showTemporaryMessage('Password dan konfirmasi tidak cocok.');
                return;
            }
            showTemporaryMessage(`Registrasi berhasil: ${name}`);
            const modalEl = document.getElementById('registerModal');
            if (modalEl) {
                const bsModal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl);
                bsModal.hide();
            }
            registerForm.reset();
        });
    }

    // Add loading animation class on page load
    window.addEventListener('load', function () {
        document.body.style.opacity = '1';
    });
});
