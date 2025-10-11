// ADVANCED ANIMATIONS & INTERACTIONS
// Premium animations for next-level portfolio experience

/* ============================================
   1. PARALLAX SCROLLING SYSTEM
   ============================================ */

class ParallaxController {
    constructor() {
        this.elements = [];
        this.init();
    }

    init() {
        this.setupParallaxElements();
        this.bindScrollEvents();
    }

    setupParallaxElements() {
        // Add parallax to background orbs
        this.elements.push({
            element: document.querySelector('.gradient-orb-1'),
            speed: 0.5,
            direction: 'up'
        });

        this.elements.push({
            element: document.querySelector('.gradient-orb-2'),
            speed: 0.3,
            direction: 'down'
        });

        this.elements.push({
            element: document.querySelector('.gradient-orb-3'),
            speed: 0.7,
            direction: 'horizontal'
        });

        // Add parallax to section backgrounds
        document.querySelectorAll('.section-bg').forEach((el, index) => {
            this.elements.push({
                element: el,
                speed: 0.2 + (index * 0.1),
                direction: 'up'
            });
        });
    }

    bindScrollEvents() {
        let ticking = false;

        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            this.elements.forEach(item => {
                if (!item.element) return;

                let yPos = 0;
                let xPos = 0;

                switch (item.direction) {
                    case 'up':
                        yPos = scrolled * item.speed;
                        break;
                    case 'down':
                        yPos = scrolled * -item.speed;
                        break;
                    case 'horizontal':
                        xPos = scrolled * item.speed * 0.5;
                        yPos = scrolled * item.speed * 0.3;
                        break;
                }

                item.element.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
            });

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }
}

/* ============================================
   2. SCROLL-TRIGGERED ANIMATIONS
   ============================================ */

class ScrollAnimations {
    constructor() {
        this.elements = [];
        this.init();
    }

    init() {
        this.setupAnimatedElements();
        this.createIntersectionObserver();
    }

    setupAnimatedElements() {
        // Add scroll animations to various elements
        const animationConfigs = [
            { selector: '.service-card', animation: 'slideInUp', delay: 100 },
            { selector: '.project-card', animation: 'slideInUp', delay: 150 },
            { selector: '.skill-tag', animation: 'popIn', delay: 50 },
            { selector: '.timeline-item', animation: 'slideInLeft', delay: 200 },
            { selector: '.contact-item', animation: 'fadeInScale', delay: 100 },
            { selector: '.section-header', animation: 'fadeInUp', delay: 0 },
            { selector: '.hero-content', animation: 'heroEntrance', delay: 0 }
        ];

        animationConfigs.forEach(config => {
            document.querySelectorAll(config.selector).forEach((el, index) => {
                el.classList.add('scroll-trigger');
                el.setAttribute('data-animation', config.animation);
                el.setAttribute('data-delay', config.delay * index);
                this.elements.push(el);
            });
        });
    }

    createIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animation = element.getAttribute('data-animation');
                    const delay = parseInt(element.getAttribute('data-delay') || 0);

                    setTimeout(() => {
                        element.classList.add('animate-in', animation);
                    }, delay);

                    observer.unobserve(element);
                }
            });
        }, options);

        this.elements.forEach(el => observer.observe(el));
    }
}

/* ============================================
   3. MAGNETIC CURSOR EFFECTS
   ============================================ */

class MagneticCursor {
    constructor() {
        this.cursor = null;
        this.cursorFollower = null;
        this.magneticElements = [];
        this.init();
    }

    init() {
        this.createCursor();
        this.setupMagneticElements();
        this.bindEvents();
    }

    createCursor() {
        // Create custom cursor
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        document.body.appendChild(this.cursor);

        // Create cursor follower
        this.cursorFollower = document.createElement('div');
        this.cursorFollower.className = 'cursor-follower';
        document.body.appendChild(this.cursorFollower);
    }

    setupMagneticElements() {
        // Add magnetic effect to interactive elements
        const magneticSelectors = [
            '.btn',
            '.nav-link',
            '.project-card',
            '.service-card',
            '.social-link',
            '.floating-action-button',
            '.skill-tag'
        ];

        magneticSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.add('magnetic');
                this.magneticElements.push(el);
            });
        });
    }

    bindEvents() {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;

        // Mouse move handler
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Update cursor position immediately
            this.cursor.style.left = mouseX + 'px';
            this.cursor.style.top = mouseY + 'px';
        });

        // Smooth follower animation
        const animateCursor = () => {
            // Smooth following animation
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;

            this.cursorFollower.style.left = followerX + 'px';
            this.cursorFollower.style.top = followerY + 'px';

            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Magnetic effect on hover
        this.magneticElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('cursor-hover');
                this.cursorFollower.classList.add('cursor-hover');
            });

            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('cursor-hover');
                this.cursorFollower.classList.remove('cursor-hover');
                el.style.transform = 'translate(0, 0)';
            });

            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                el.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
            this.cursorFollower.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '1';
            this.cursorFollower.style.opacity = '1';
        });
    }
}

/* ============================================
   4. PAGE TRANSITION ANIMATIONS
   ============================================ */

class PageTransitions {
    constructor() {
        this.sections = [];
        this.currentSection = 0;
        this.isTransitioning = false;
        this.init();
    }

    init() {
        this.setupSections();
        this.bindNavigationEvents();
    }

    setupSections() {
        this.sections = Array.from(document.querySelectorAll('section[id]'));
        this.sections.forEach((section, index) => {
            section.classList.add('page-section');
            section.setAttribute('data-section-index', index);
        });
    }

    bindNavigationEvents() {
        // Enhanced smooth scrolling with transitions
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.transitionToSection(targetId);
            });
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) return;

            switch (e.key) {
                case 'ArrowDown':
                case 'PageDown':
                    e.preventDefault();
                    this.nextSection();
                    break;
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    this.previousSection();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.transitionToSection('home');
                    break;
                case 'End':
                    e.preventDefault();
                    this.transitionToSection('contact');
                    break;
            }
        });
    }

    transitionToSection(sectionId) {
        if (this.isTransitioning) return;

        const targetSection = document.getElementById(sectionId);
        if (!targetSection) return;

        this.isTransitioning = true;

        // Add transition effect
        document.body.classList.add('page-transitioning');

        // Smooth scroll with easing
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // Remove transition class after animation
        setTimeout(() => {
            document.body.classList.remove('page-transitioning');
            this.isTransitioning = false;
        }, 800);

        // Update current section
        this.currentSection = parseInt(targetSection.getAttribute('data-section-index'));
    }

    nextSection() {
        if (this.currentSection < this.sections.length - 1) {
            const nextSection = this.sections[this.currentSection + 1];
            this.transitionToSection(nextSection.id);
        }
    }

    previousSection() {
        if (this.currentSection > 0) {
            const prevSection = this.sections[this.currentSection - 1];
            this.transitionToSection(prevSection.id);
        }
    }
}

/* ============================================
   5. 3D TILT EFFECTS
   ============================================ */

class TiltEffects {
    constructor() {
        this.tiltElements = [];
        this.init();
    }

    init() {
        this.setupTiltElements();
        this.bindTiltEvents();
    }

    setupTiltElements() {
        // Add tilt effect to cards
        const tiltSelectors = [
            '.project-card',
            '.service-card',
            '.about-text',
            '.about-info',
            '.contact-form'
        ];

        tiltSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.add('tilt-element');
                this.tiltElements.push(el);
            });
        });
    }

    bindTiltEvents() {
        this.tiltElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.transformStyle = 'preserve-3d';
            });

            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / centerY * -10;
                const rotateY = (x - centerX) / centerX * 10;

                el.style.transform = `
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    translateZ(10px)
                `;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = `
                    perspective(1000px)
                    rotateX(0deg)
                    rotateY(0deg)
                    translateZ(0px)
                `;
            });
        });
    }
}

/* ============================================
   6. SCROLL PROGRESS INDICATOR
   ============================================ */

class ScrollProgress {
    constructor() {
        this.progressBar = null;
        this.init();
    }

    init() {
        this.createProgressBar();
        this.bindScrollEvents();
    }

    createProgressBar() {
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'scroll-progress';
        this.progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
        document.body.appendChild(this.progressBar);
    }

    bindScrollEvents() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;

            const progressBar = this.progressBar.querySelector('.scroll-progress-bar');
            progressBar.style.width = scrollPercent + '%';
        });
    }
}

/* ============================================
   7. FLOATING ELEMENTS ANIMATION
   ============================================ */

class FloatingElements {
    constructor() {
        this.floatingElements = [];
        this.init();
    }

    init() {
        this.createFloatingShapes();
        this.animateFloatingElements();
    }

    createFloatingShapes() {
        // Create floating geometric shapes
        for (let i = 0; i < 8; i++) {
            const shape = document.createElement('div');
            shape.className = `floating-shape floating-shape-${i % 4}`;
            shape.style.left = Math.random() * 100 + '%';
            shape.style.top = Math.random() * 100 + '%';
            shape.style.animationDelay = Math.random() * 10 + 's';
            document.body.appendChild(shape);
            this.floatingElements.push(shape);
        }
    }

    animateFloatingElements() {
        this.floatingElements.forEach((element, index) => {
            const duration = 15 + Math.random() * 10;
            const delay = Math.random() * 5;
            
            element.style.animation = `
                floating ${duration}s ease-in-out infinite ${delay}s,
                fadeInOut ${duration * 0.8}s ease-in-out infinite ${delay}s
            `;
        });
    }
}

/* ============================================
   8. INITIALIZATION
   ============================================ */

// Initialize all advanced animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
        // Initialize all animation controllers
        window.parallaxController = new ParallaxController();
        window.scrollAnimations = new ScrollAnimations();
        window.magneticCursor = new MagneticCursor();
        window.pageTransitions = new PageTransitions();
        window.tiltEffects = new TiltEffects();
        window.scrollProgress = new ScrollProgress();
        window.floatingElements = new FloatingElements();

        console.log('🎨 Advanced animations loaded!');
    } else {
        console.log('⚡ Reduced motion mode - animations disabled');
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ParallaxController,
        ScrollAnimations,
        MagneticCursor,
        PageTransitions,
        TiltEffects,
        ScrollProgress,
        FloatingElements
    };
}
