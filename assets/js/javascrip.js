// Sticky Navbar Script
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
    }

    // Listen to scroll events
    window.addEventListener('scroll', handleScroll);

    // Handle navigation link clicks
    const navLinks = document.querySelectorAll('.navbar-collapse a[href^="#"]');
    navLinks.forEach(link => {
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
});
