// ========================================
// CATALOG SCROLL MANAGER - Sticky Version
// ========================================

class CatalogScrollManager {
    constructor() {
        this.section = document.getElementById('catalog');
        this.pages = document.querySelectorAll('.flipbook__page');
        this.totalPages = this.pages.length;

        this.ticking = false;

        // Bind methods
        this.onScroll = this.onScroll.bind(this);

        this.init();
    }

    init() {
        if (!this.section || !this.pages.length) {
            console.warn('CatalogScrollManager: Elements not found');
            return;
        }

        window.addEventListener('scroll', this.onScroll, { passive: true });
        window.addEventListener('resize', this.onScroll, { passive: true });

        // Initial check
        this.onScroll();

        console.log('CatalogScrollManager: Initialized (Sticky Mode)');
    }

    onScroll() {
        if (!this.ticking) {
            window.requestAnimationFrame(() => {
                this.updateProgress();
                this.ticking = false;
            });
            this.ticking = true;
        }
    }

    updateProgress() {
        // Calculate progress based on sticky container position
        const rect = this.section.getBoundingClientRect();
        const sectionHeight = this.section.offsetHeight;
        const viewportHeight = window.innerHeight;

        // How much scrollable distance we have: Section Heihgt - Viewport Height (sticky duration)
        const scrollDistance = sectionHeight - viewportHeight;

        if (scrollDistance <= 0) return;

        // How far have we scrolled past the top?
        // rect.top is position relative to viewport.
        // When rect.top is 0, we are at start.
        // When rect.top is -scrollDistance, we are at end.

        let scrolled = -rect.top;

        // Clamp logic
        let progress = scrolled / scrollDistance;
        progress = Math.max(0, Math.min(1, progress));

        // Map progress to pages
        // 0.0 - 0.33 -> Page 0
        // 0.33 - 0.66 -> Page 1
        // 0.66 - 1.0 -> Page 2

        const pageFloat = progress * this.totalPages;
        const pageIndex = Math.min(Math.floor(pageFloat), this.totalPages - 1);

        this.flipToPage(pageIndex);
    }

    flipToPage(index) {
        this.pages.forEach((page, i) => {
            if (i < index) {
                page.classList.add('flipped');
            } else {
                page.classList.remove('flipped');
            }
        });

        const currentPageEl = document.getElementById('currentPage');
        if (currentPageEl) currentPageEl.textContent = index + 1;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new CatalogScrollManager();
});
