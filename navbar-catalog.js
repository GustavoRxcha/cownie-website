// ========================================
// NAVBAR CATALOG MANAGER - Hide/Show during catalog
// ========================================

class NavbarCatalogManager {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.catalogSection = document.getElementById('catalog');

        if (!this.navbar || !this.catalogSection) {
            console.warn('NavbarCatalogManager: navbar or catalog section not found');
            return;
        }

        this.ticking = false;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                window.requestAnimationFrame(() => {
                    this.checkCatalogPosition();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }, { passive: true });

        // Initial check
        this.checkCatalogPosition();

        console.log('NavbarCatalogManager: Initialized');
    }

    checkCatalogPosition() {
        const catalogRect = this.catalogSection.getBoundingClientRect();
        const catalogTop = catalogRect.top;
        const catalogBottom = catalogRect.bottom;
        const viewportHeight = window.innerHeight;

        // Check if we're in the catalog section
        // Section starts when top reaches viewport top
        const inCatalogSection = catalogTop <= 0 && catalogBottom > viewportHeight;

        // Check if we've passed the catalog section
        const afterCatalogSection = catalogBottom <= viewportHeight;

        if (inCatalogSection) {
            // Hide navbar during catalog animation
            this.navbar.classList.add('hidden-catalog');
            this.navbar.classList.remove('after-catalog');
        } else if (afterCatalogSection) {
            // Show navbar with chocolate color after catalog
            this.navbar.classList.remove('hidden-catalog');
            this.navbar.classList.add('after-catalog');
        } else {
            // Before catalog section - normal state
            this.navbar.classList.remove('hidden-catalog');
            this.navbar.classList.remove('after-catalog');
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new NavbarCatalogManager();
});
