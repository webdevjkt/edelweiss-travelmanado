document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 1. STICKY NAVBAR EFFECT
    // =========================================
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 30);
    });

    // =========================================
    // 2. MOBILE MENU DRAWER
    // =========================================
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');
    
    function openMobileMenu() {
        mobileMenu.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileMenu);
    if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);
    mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

    // =========================================
    // 3. SMOOTH SCROLLING
    // =========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const offsetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
            }
        });
    });

    // =========================================
    // 4. HERO SLIDESHOW (2 SECONDS, 10 PHOTOS)
    // =========================================
    const slides = document.querySelectorAll('.hero-slideshow .slide');
    const dots = document.querySelectorAll('.slide-dot');
    let currentSlide = 0;
    let slideshowTimer = null;

    function goToSlide(index) {
        // Remove prev class from all
        slides.forEach(s => s.classList.remove('prev'));
        
        // Mark current as prev before switching
        slides[currentSlide].classList.add('prev');
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');

        currentSlide = (index + slides.length) % slides.length;

        slides[currentSlide].classList.remove('prev');
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function startSlideshow() {
        slideshowTimer = setInterval(nextSlide, 2000);
    }

    function resetSlideshow() {
        clearInterval(slideshowTimer);
        startSlideshow();
    }

    // Dot click → jump to slide
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            goToSlide(index);
            resetSlideshow();
        });
    });

    // Start the show!
    if (slides.length > 0) {
        startSlideshow();
    }

    // =========================================
    // 5. SCROLL REVEAL ANIMATION (bottom to top)
    // =========================================
    // Auto-assign data-reveal to all section content blocks
    const revealTargets = [
        '.about-collage',
        '.about-content',
        '.about-stats .stat-item',
        '.section-title',
        '.info-card',
        '.tour-card',
        '.package-card',
        '.contact-form-card',
        '.contact-info-col',
        '.map-frame-wrapper',
        '.ig-card',
        '.faq-item',
        '.footer-info',
        '.footer-links',
        '.footer-contact'
    ];

    revealTargets.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, i) => {
            el.setAttribute('data-reveal', '');
            // Stagger delay for grid items
            const stagger = Math.min(i % 4, 4);
            if (stagger > 0) {
                el.setAttribute('data-reveal-delay', String(stagger * 100));
            }
        });
    });

    // IntersectionObserver for smooth reveal
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Stop observing once revealed
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('[data-reveal]').forEach(el => {
        revealObserver.observe(el);
    });

    // =========================================
    // 6. FAQ ACCORDION (Clean 2-Column Style)
    // =========================================
    const faqCleanHeaders = document.querySelectorAll('.faq-clean-header, .faq-header');
    
    faqCleanHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const faqItem = header.parentElement;
            const faqBody = faqItem.querySelector('.faq-clean-body, .faq-body');
            const toggleIcon = header.querySelector('.faq-clean-toggle');
            const isActive = faqItem.classList.contains('active');
            
            // Close all
            document.querySelectorAll('.faq-clean-item, .faq-item').forEach(item => {
                item.classList.remove('active');
                const body = item.querySelector('.faq-clean-body, .faq-body');
                const icon = item.querySelector('.faq-clean-toggle');
                if (body) body.style.maxHeight = null;
                if (icon) {
                    icon.classList.remove('fa-minus');
                    icon.classList.add('fa-plus');
                }
            });

            // Toggle current
            if (!isActive) {
                faqItem.classList.add('active');
                if (faqBody) faqBody.style.maxHeight = faqBody.scrollHeight + "px";
                if (toggleIcon) {
                    toggleIcon.classList.remove('fa-plus');
                    toggleIcon.classList.add('fa-minus');
                }
            }
        });
    });

    // =========================================
    // 7. PHOTO WITH GUEST SLIDER CONTROLS
    // =========================================
    const guestWrap = document.getElementById('guestSliderWrap');
    const guestPrev = document.getElementById('guestPrevBtn');
    const guestNext = document.getElementById('guestNextBtn');

    if (guestWrap && guestPrev && guestNext) {
        const scrollAmount = 320;
        guestNext.addEventListener('click', () => {
            guestWrap.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
        guestPrev.addEventListener('click', () => {
            guestWrap.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        // Mouse Drag to Scroll
        let isDown = false;
        let startX;
        let scrollLeft;

        guestWrap.addEventListener('mousedown', (e) => {
            isDown = true;
            guestWrap.style.cursor = 'grabbing';
            startX = e.pageX - guestWrap.offsetLeft;
            scrollLeft = guestWrap.scrollLeft;
        });

        guestWrap.addEventListener('mouseleave', () => {
            isDown = false;
            guestWrap.style.cursor = 'grab';
        });

        guestWrap.addEventListener('mouseup', () => {
            isDown = false;
            guestWrap.style.cursor = 'grab';
        });

        guestWrap.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - guestWrap.offsetLeft;
            const walk = (x - startX) * 1.5;
            guestWrap.scrollLeft = scrollLeft - walk;
        });
    }
});
