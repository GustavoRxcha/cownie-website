// ========================================
// COWNIE - JavaScript
// ========================================

console.log('Cownie website loaded successfully!');

// ========================================
// PRELOADER
// ========================================

class Preloader {
    constructor() {
        this.preloader = document.querySelector('.preloader');
        this.iconCircle = document.getElementById('iconCircle');
        this.loadingNumber = document.getElementById('loadingNumber');

        this.percentage = 0;
        this.totalIcons = 24;
        this.icons = [];
        this.radius = 120; // Distance from center

        document.body.classList.add('loading');
        this.init();
    }

    init() {
        this.createIconCircle();
        this.startLoading();
    }

    createIconCircle() {
        const angleStep = (2 * Math.PI) / this.totalIcons;

        for (let i = 0; i < this.totalIcons; i++) {
            const angle = i * angleStep - Math.PI / 2; // Start from top

            // Calculate position using trigonometry
            const x = Math.cos(angle) * this.radius;
            const y = Math.sin(angle) * this.radius;

            // Create icon element
            const icon = document.createElement('img');
            icon.src = 'assets/images/icon_cownie_sem_fundo.png';
            icon.className = 'preloader__icon';
            icon.style.left = `calc(50% + ${x}px - 15px)`; // -15px to center the 30px icon
            icon.style.top = `calc(50% + ${y}px - 15px)`;

            this.iconCircle.appendChild(icon);
            this.icons.push(icon);
        }
    }

    startLoading() {
        const interval = setInterval(() => {
            this.percentage += 1;

            // Update counter
            this.loadingNumber.textContent = this.percentage;

            // Calculate how many icons should be visible
            const visibleCount = Math.floor((this.percentage / 100) * this.totalIcons);

            // Show icons progressively
            for (let i = 0; i < visibleCount; i++) {
                this.icons[i].classList.add('visible');
            }

            // When complete
            if (this.percentage >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    this.hide();
                }, 500);
            }
        }, 20); // 20ms = 2 seconds total (100 increments * 20ms = 2000ms)
    }

    hide() {
        window.scrollTo(0, 0);
        this.preloader.classList.add('hidden');

        setTimeout(() => {
            document.body.classList.remove('loading');
        }, 100);

        setTimeout(() => {
            this.preloader.remove();
        }, 800);
    }
}


// ========================================
// SCROLLYTELLING - Hero Video Control
// ========================================

class ScrollytellingVideo {
    constructor(videoElement, containerElement) {
        this.video = videoElement;
        this.container = containerElement;
        this.isReady = false;
        this.ticking = false;

        this.init();
    }

    init() {
        // Wait for video metadata to load
        this.video.addEventListener('loadedmetadata', () => {
            this.isReady = true;
            console.log('Video ready for scrollytelling');

            // Set initial state
            this.video.pause();
            this.video.currentTime = 0;

            // Start listening to scroll
            this.attachScrollListener();

            // Initial update
            this.updateVideoProgress();
        });

        // Force load if already loaded
        if (this.video.readyState >= 2) {
            this.isReady = true;
            this.video.pause();
            this.video.currentTime = 0;
            this.attachScrollListener();
            this.updateVideoProgress();
        }
    }

    attachScrollListener() {
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                window.requestAnimationFrame(() => {
                    this.updateVideoProgress();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        });
    }

    updateVideoProgress() {
        if (!this.isReady) return;

        // Get current scroll position
        const scrollY = window.scrollY || window.pageYOffset;

        // Get container height (the hero section height)
        const containerHeight = this.container.offsetHeight;

        // Calculate progress based on how much we've scrolled
        // Video should progress from 0% to 100% as we scroll through the hero height
        let progress = scrollY / containerHeight;

        // Clamp between 0 and 1
        progress = Math.max(0, Math.min(1, progress));

        // Map progress to video time
        const videoDuration = this.video.duration;
        const targetTime = progress * videoDuration;

        // Update video current time
        this.video.currentTime = targetTime;

        // Debug (optional - remove in production)
        // console.log(`Scroll: ${scrollY}px | Progress: ${(progress * 100).toFixed(1)}% | Video Time: ${targetTime.toFixed(2)}s`);
    }
}

// ========================================
// CUSTOM CURSOR (iPad-style with Blend Mode)
// ========================================

class CustomCursor {
    constructor() {
        this.cursor = document.querySelector('.custom-cursor');
        if (!this.cursor) return;

        this.mouse = { x: 0, y: 0 };
        this.pos = { x: 0, y: 0 };
        this.speed = 0.15; // Lerp speed (0.1 = slow, 1 = instant)

        this.init();
    }

    init() {
        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Detect hover on interactive elements
        this.addHoverListeners();

        // Start animation loop
        this.animate();
    }

    addHoverListeners() {
        // Select all interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .hover-target');

        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hover-active');
            });

            element.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hover-active');
            });
        });
    }

    animate() {
        // Lerp (linear interpolation) for smooth following
        this.pos.x += (this.mouse.x - this.pos.x) * this.speed;
        this.pos.y += (this.mouse.y - this.pos.y) * this.speed;

        // Update cursor position
        this.cursor.style.left = `${this.pos.x}px`;
        this.cursor.style.top = `${this.pos.y}px`;

        // Continue animation loop
        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// NAVBAR COLOR CHANGE ON SCROLL
// ========================================

class NavbarScroll {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.aboutSection = document.querySelector('#about');

        if (!this.navbar || !this.aboutSection) return;

        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            this.checkScroll();
        });

        // Initial check
        this.checkScroll();
    }

    checkScroll() {
        const aboutTop = this.aboutSection.getBoundingClientRect().top;
        const navbarHeight = this.navbar.offsetHeight;

        // Add 'scrolled' class when About section reaches navbar
        if (aboutTop <= navbarHeight) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }
}

// ========================================
// MOBILE MENU
// ========================================

class MobileMenu {
    constructor() {
        this.hamburger = document.getElementById('hamburgerBtn');
        this.navLinks = document.querySelector('.navbar__links');
        this.links = document.querySelectorAll('.navbar__links a');

        console.log('MobileMenu initialized:', {
            hamburger: this.hamburger,
            navLinks: this.navLinks,
            linksCount: this.links.length
        });

        if (!this.hamburger || !this.navLinks) {
            console.error('Hamburger or navLinks not found!');
            return;
        }

        this.init();
    }

    init() {
        // Toggle menu on hamburger click
        this.hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // Close menu when clicking on a link
        this.links.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.hamburger.contains(e.target) && !this.navLinks.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.navLinks.classList.toggle('active');
        console.log('Menu toggled:', {
            hamburgerActive: this.hamburger.classList.contains('active'),
            navLinksActive: this.navLinks.classList.contains('active')
        });
    }

    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navLinks.classList.remove('active');
    }
}

// ========================================
// FLIP BOOK - Interactive Page Turning
// ========================================

class FlipBook {
    constructor() {
        this.book = document.getElementById('flipBook');
        this.pages = Array.from(document.querySelectorAll('.flipbook__page'));
        this.prevBtn = document.getElementById('prevPage');
        this.nextBtn = document.getElementById('nextPage');
        this.currentPageIndicator = document.getElementById('currentPage');
        this.totalPagesIndicator = document.getElementById('totalPages');

        if (!this.book || this.pages.length === 0) {
            console.error('FlipBook elements not found');
            return;
        }

        this.currentPage = 0;
        this.totalPages = this.pages.length;

        this.init();
    }

    init() {
        // Set initial state
        this.updateIndicators();
        this.updateButtons();

        // Add event listeners to navigation buttons
        this.prevBtn.addEventListener('click', () => this.previousPage());
        this.nextBtn.addEventListener('click', () => this.nextPage());

        // Add click event to pages for flipping
        this.pages.forEach((page, index) => {
            page.addEventListener('click', () => {
                if (!page.classList.contains('flipped')) {
                    this.goToPage(index + 1);
                }
            });
        });

        console.log('FlipBook initialized with', this.totalPages, 'pages');
    }

    nextPage() {
        if (this.currentPage < this.totalPages - 1) {
            this.currentPage++;
            this.flipPage(this.currentPage - 1);
            this.updateIndicators();
            this.updateButtons();
        }
    }

    previousPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.unflipPage(this.currentPage);
            this.updateIndicators();
            this.updateButtons();
        }
    }

    goToPage(pageNumber) {
        const targetPage = Math.max(0, Math.min(pageNumber, this.totalPages - 1));

        if (targetPage > this.currentPage) {
            // Flip forward
            for (let i = this.currentPage; i < targetPage; i++) {
                this.flipPage(i);
            }
        } else if (targetPage < this.currentPage) {
            // Flip backward
            for (let i = this.currentPage - 1; i >= targetPage; i--) {
                this.unflipPage(i);
            }
        }

        this.currentPage = targetPage;
        this.updateIndicators();
        this.updateButtons();
    }

    flipPage(index) {
        if (this.pages[index]) {
            this.pages[index].classList.add('flipped');
        }
    }

    unflipPage(index) {
        if (this.pages[index]) {
            this.pages[index].classList.remove('flipped');
        }
    }

    updateIndicators() {
        this.currentPageIndicator.textContent = this.currentPage + 1;
        this.totalPagesIndicator.textContent = this.totalPages;
    }

    updateButtons() {
        // Disable prev button on first page
        if (this.currentPage === 0) {
            this.prevBtn.disabled = true;
        } else {
            this.prevBtn.disabled = false;
        }

        // Disable next button on last page
        if (this.currentPage === this.totalPages - 1) {
            this.nextBtn.disabled = true;
        } else {
            this.nextBtn.disabled = false;
        }
    }
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize preloader
    new Preloader();

    const heroVideo = document.querySelector('.hero__video');
    const heroContainer = document.querySelector('.hero');

    if (heroVideo && heroContainer) {
        new ScrollytellingVideo(heroVideo, heroContainer);
    }

    // Initialize custom cursor (only on desktop)
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        new CustomCursor();
    }

    // Initialize navbar scroll color change
    new NavbarScroll();

    // Initialize mobile menu
    new MobileMenu();

    // Initialize flip book
    new FlipBook();
});
