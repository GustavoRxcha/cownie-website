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

class ScrollytellingFrames {
    constructor(canvasSelector, containerSelector) {
        this.canvas = document.querySelector(canvasSelector);
        this.container = document.querySelector(containerSelector);
        // Fallback or setup context
        this.context = this.canvas ? this.canvas.getContext('2d') : null;

        // Configuration
        this.frameCount = 98; // Total frames
        this.images = [];
        this.imagesLoaded = 0;
        this.currentFrame = 0;

        // Path configuration: assets/videos/frames_video_hero/ezgif-frame-XXX.jpg
        this.basePath = 'assets/videos/frames_video_hero/ezgif-frame-';

        // Bind methods
        this.updateFrame = this.updateFrame.bind(this);
        this.handleResize = this.handleResize.bind(this);

        if (this.canvas && this.container) {
            this.init();
        } else {
            console.error('Canvas or Container not found for ScrollytellingFrames');
        }
    }

    init() {
        this.preloadImages();
        this.attachListeners();
        this.handleResize(); // Set initial size
    }

    preloadImages() {
        console.log('Starting frame preload...');
        for (let i = 1; i <= this.frameCount; i++) {
            const img = new Image();
            // Pad with leading zeros: 1 -> 001, 10 -> 010, 98 -> 098
            const paddedIndex = i.toString().padStart(3, '0');
            const src = `${this.basePath}${paddedIndex}.jpg`;

            img.src = src;
            img.onload = () => {
                this.imagesLoaded++;
                if (this.imagesLoaded === this.frameCount) {
                    console.log('All frames loaded!');
                    // Draw first frame immediately
                    this.drawFrame(0);
                }
            };
            img.onerror = () => {
                console.warn(`Failed to load frame: ${src}`);
            };
            this.images.push(img);
        }
    }

    attachListeners() {
        window.addEventListener('scroll', () => {
            window.requestAnimationFrame(this.updateFrame);
        });

        window.addEventListener('resize', () => {
            this.handleResize();
            this.drawFrame(this.currentFrame); // Redraw
        });
    }

    handleResize() {
        if (!this.canvas || !this.container) return;

        // Make canvas fill the container exactly (for resolution)
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;

        this.canvas.width = width;
        this.canvas.height = height;
    }

    updateFrame() {
        if (!this.container) return;

        const scrollY = window.scrollY || window.pageYOffset;
        const containerHeight = this.container.offsetHeight;

        // Calculate progress (0 to 1)
        let progress = scrollY / containerHeight;
        progress = Math.max(0, Math.min(1, progress));

        // Map to frame index (0 to 97)
        // Ensure we don't go out of bounds
        const maxIndex = this.frameCount - 1;
        const frameIndex = Math.floor(progress * maxIndex);

        if (frameIndex !== this.currentFrame) {
            this.currentFrame = frameIndex;
            this.drawFrame(frameIndex);
        }
    }

    drawFrame(index) {
        // Safety check
        if (!this.images[index] || !this.images[index].complete) return;
        if (!this.context || !this.canvas) return;

        const img = this.images[index];
        const ctx = this.context;
        const canvas = this.canvas;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // "Object-fit: cover" logic for Canvas
        const imgRatio = img.width / img.height;
        const canvasRatio = canvas.width / canvas.height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
            // Canvas is wider than image -> fit width, crop height
            drawWidth = canvas.width;
            drawHeight = drawWidth / imgRatio;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            // Canvas is taller than image -> fit height, crop width
            drawHeight = canvas.height;
            drawWidth = drawHeight * imgRatio;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
        }

        try {
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        } catch (e) {
            console.warn('Error drawing frame', e);
        }
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
// SCROLLYTELLING - Flip Book Control
// ========================================

class ScrollytellingFlipBook {
    constructor() {
        this.catalogSection = document.getElementById('catalog');
        this.catalogContainer = document.querySelector('.catalog__container');
        this.flipBook = document.querySelector('.flipbook__book');
        this.pages = document.querySelectorAll('.flipbook__page');

        // Estados
        this.isPinned = false;
        this.currentProgress = 0; // 0 a 1
        this.totalPages = this.pages.length; // 3
        this.currentPageIndex = 0;

        // Posições calculadas
        this.pinStartY = 0;
        this.pinEndY = 0;
        this.scrollHeight = 0;

        // Throttling
        this.ticking = false;

        this.init();
    }

    init() {
        if (!this.catalogSection || !this.pages.length) {
            console.warn('ScrollytellingFlipBook: elementos não encontrados');
            return;
        }

        this.calculatePositions();
        this.attachScrollListener();

        // Recalcular posições ao redimensionar
        window.addEventListener('resize', () => {
            this.calculatePositions();
        });
    }

    calculatePositions() {
        // Início do pin: quando seção atinge o topo
        this.pinStartY = this.catalogSection.offsetTop;

        // Altura de scroll para folhear todas as páginas (300vh)
        this.scrollHeight = window.innerHeight * 3;

        // Fim do pin: início + altura de scroll
        this.pinEndY = this.pinStartY + this.scrollHeight;

        console.log(`ScrollytellingFlipBook: Pin de ${this.pinStartY}px a ${this.pinEndY}px`);
    }

    attachScrollListener() {
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                window.requestAnimationFrame(() => {
                    this.onScroll();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        });
    }

    onScroll() {
        const scrollY = window.scrollY || window.pageYOffset;

        // Antes do pin
        if (scrollY < this.pinStartY) {
            this.unpin();
            this.setProgress(0);
            return;
        }

        // Depois do pin
        if (scrollY > this.pinEndY) {
            this.unpin();
            this.setProgress(1); // Última página
            return;
        }

        // Durante o pin
        this.pin();

        // Calcular progresso (0 a 1)
        const scrollInSection = scrollY - this.pinStartY;
        const progress = scrollInSection / this.scrollHeight;
        this.setProgress(progress);
    }

    pin() {
        if (!this.isPinned) {
            this.catalogSection.classList.add('pinned');
            this.isPinned = true;
            console.log('ScrollytellingFlipBook: Pinned');
        }
    }

    unpin() {
        if (this.isPinned) {
            this.catalogSection.classList.remove('pinned');
            this.isPinned = false;
            console.log('ScrollytellingFlipBook: Unpinned');
        }
    }

    setProgress(progress) {
        // Clamp entre 0 e 1
        progress = Math.max(0, Math.min(1, progress));
        this.currentProgress = progress;

        // Mapear progresso para páginas
        // 0 - 0.33 = página 0 (capa)
        // 0.33 - 0.66 = página 1
        // 0.66 - 1.0 = página 2 (contracapa)
        const pageFloat = progress * this.totalPages;
        const pageIndex = Math.floor(pageFloat);
        const clampedPageIndex = Math.min(pageIndex, this.totalPages - 1);

        // Progresso dentro da página atual (0 a 1)
        const pageProgress = pageFloat - pageIndex;

        // Folhear até a página calculada
        this.flipToPage(clampedPageIndex, pageProgress);
    }

    flipToPage(targetPage, pageProgress = 1) {
        // Virar todas as páginas até a target
        this.pages.forEach((page, index) => {
            if (index < targetPage) {
                // Páginas anteriores: totalmente viradas
                page.classList.add('flipped');
                page.style.transform = 'rotateY(-180deg)';
            } else if (index === targetPage && pageProgress > 0 && pageProgress < 1) {
                // Página atual: transição parcial para suavidade
                page.classList.remove('flipped');
                const rotation = -180 * pageProgress;
                page.style.transform = `rotateY(${rotation}deg)`;
            } else if (index === targetPage && pageProgress >= 1) {
                // Página atual totalmente virada
                page.classList.add('flipped');
                page.style.transform = 'rotateY(-180deg)';
            } else {
                // Páginas posteriores: não viradas
                page.classList.remove('flipped');
                page.style.transform = 'rotateY(0deg)';
            }
        });

        // Atualizar indicador de página apenas se mudou
        if (this.currentPageIndex !== targetPage) {
            this.currentPageIndex = targetPage;
            const displayPage = targetPage + 1;
            const currentPageEl = document.getElementById('currentPage');
            if (currentPageEl) {
                currentPageEl.textContent = displayPage;
            }
        }
    }
}

// ========================================
// CATALOG SCROLLYTELLING - Scroll-driven Page Flipping
// ========================================

/* 
// MOVED TO scrollytelling-lock.js
class CatalogScrollytelling {
    // ... (Conflicting implementation removed/commented to prioritize scrollytelling-lock.js)
}
*/

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize preloader
    new Preloader();

    // Initialize Scrollytelling Frames (Canvas)
    new ScrollytellingFrames('#hero-canvas', '.hero');

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

    // Initialize catalog scrollytelling - MOVED TO scrollytelling-lock.js
    // new CatalogScrollytelling();
});
