// ENHANCED USER EXPERIENCE FEATURES
// Advanced UX improvements for premium portfolio experience

/* ============================================
   1. READING TIME ESTIMATES
   ============================================ */

class ReadingTimeEstimator {
    constructor() {
        this.wordsPerMinute = 200; // Average reading speed
        this.init();
    }

    init() {
        this.addReadingTimeToProjects();
        this.addReadingTimeToSections();
    }

    calculateReadingTime(text) {
        const words = text.trim().split(/\s+/).length;
        const minutes = Math.ceil(words / this.wordsPerMinute);
        return minutes;
    }

    addReadingTimeToProjects() {
        document.querySelectorAll('.project-card').forEach(card => {
            const description = card.querySelector('p');
            if (description) {
                const readingTime = this.calculateReadingTime(description.textContent);
                const timeIndicator = document.createElement('div');
                timeIndicator.className = 'reading-time';
                timeIndicator.innerHTML = `<i class="fas fa-clock"></i> ${readingTime} min read`;
                
                const projectContent = card.querySelector('.project-content');
                projectContent.insertBefore(timeIndicator, description);
            }
        });
    }

    addReadingTimeToSections() {
        // Add reading time to about section
        const aboutIntro = document.querySelector('.about-intro');
        if (aboutIntro) {
            const readingTime = this.calculateReadingTime(aboutIntro.textContent);
            const timeIndicator = document.createElement('div');
            timeIndicator.className = 'reading-time section-reading-time';
            timeIndicator.innerHTML = `<i class="fas fa-clock"></i> ${readingTime} min read`;
            aboutIntro.parentNode.insertBefore(timeIndicator, aboutIntro);
        }
    }
}

/* ============================================
   2. BREADCRUMB NAVIGATION
   ============================================ */

class BreadcrumbNavigation {
    constructor() {
        this.sections = [];
        this.currentSection = '';
        this.init();
    }

    init() {
        this.setupSections();
        this.createBreadcrumb();
        this.bindScrollEvents();
    }

    setupSections() {
        this.sections = [
            { id: 'home', title: 'Home', icon: 'fas fa-home' },
            { id: 'about', title: 'About', icon: 'fas fa-user' },
            { id: 'services', title: 'Services', icon: 'fas fa-cogs' },
            { id: 'portfolio', title: 'Portfolio', icon: 'fas fa-briefcase' },
            { id: 'contact', title: 'Contact', icon: 'fas fa-envelope' }
        ];
    }

    createBreadcrumb() {
        const breadcrumb = document.createElement('div');
        breadcrumb.id = 'breadcrumb-nav';
        breadcrumb.className = 'breadcrumb-nav hidden';
        breadcrumb.innerHTML = `
            <div class="breadcrumb-container">
                <div class="breadcrumb-items" id="breadcrumb-items"></div>
                <div class="breadcrumb-progress">
                    <span class="current-section-index">1</span> / <span class="total-sections">${this.sections.length}</span>
                </div>
            </div>
        `;
        document.body.appendChild(breadcrumb);
    }

    updateBreadcrumb(currentSectionId) {
        const breadcrumbItems = document.getElementById('breadcrumb-items');
        const currentIndex = this.sections.findIndex(section => section.id === currentSectionId);
        
        if (currentIndex === -1) return;

        const items = this.sections.map((section, index) => {
            const isActive = section.id === currentSectionId;
            const isPast = index < currentIndex;
            const isFuture = index > currentIndex;
            
            let className = 'breadcrumb-item';
            if (isActive) className += ' active';
            if (isPast) className += ' past';
            if (isFuture) className += ' future';

            return `
                <div class="${className}" data-section="${section.id}">
                    <i class="${section.icon}"></i>
                    <span class="breadcrumb-title">${section.title}</span>
                </div>
            `;
        }).join('');

        breadcrumbItems.innerHTML = items;
        
        // Update progress
        document.querySelector('.current-section-index').textContent = currentIndex + 1;

        // Bind click events
        breadcrumbItems.querySelectorAll('.breadcrumb-item').forEach(item => {
            item.addEventListener('click', () => {
                const sectionId = item.dataset.section;
                document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
            });
        });

        // Show breadcrumb if not on home
        const breadcrumbNav = document.getElementById('breadcrumb-nav');
        if (currentSectionId === 'home') {
            breadcrumbNav.classList.add('hidden');
        } else {
            breadcrumbNav.classList.remove('hidden');
        }
    }

    bindScrollEvents() {
        let ticking = false;
        
        const updateCurrentSection = () => {
            const sections = document.querySelectorAll('section[id]');
            const scrollPosition = window.scrollY + 100;

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (scrollPosition >= section.offsetTop) {
                    const sectionId = section.getAttribute('id');
                    if (sectionId !== this.currentSection) {
                        this.currentSection = sectionId;
                        this.updateBreadcrumb(sectionId);
                    }
                    break;
                }
            }
            
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateCurrentSection);
                ticking = true;
            }
        });
    }
}

/* ============================================
   3. KEYBOARD SHORTCUTS GUIDE
   ============================================ */

class KeyboardShortcuts {
    constructor() {
        this.shortcuts = [
            { key: '?', description: 'Show/Hide this shortcuts guide', action: () => this.toggle() },
            { key: 'Ctrl + K', description: 'Open command palette', action: () => window.commandPalette?.toggle() },
            { key: 'Ctrl + /', description: 'Open search', action: () => window.searchSystem?.toggle() },
            { key: '↑ / Page Up', description: 'Previous section', action: () => this.navigateSection('up') },
            { key: '↓ / Page Down', description: 'Next section', action: () => this.navigateSection('down') },
            { key: 'Home', description: 'Go to top', action: () => this.goToSection('home') },
            { key: 'End', description: 'Go to contact', action: () => this.goToSection('contact') },
            { key: 'T', description: 'Timeline mode', action: () => window.activateTimelineMode?.() },
            { key: 'H', description: 'Hacker mode', action: () => window.activateHackerMode?.() },
            { key: 'S', description: 'Skills constellation', action: () => window.showSkillsConstellation?.() },
            { key: 'A', description: 'AI assistant', action: () => window.toggleAIAssistant?.() },
            { key: 'D', description: 'Toggle dark mode', action: () => window.toggleTheme?.() },
            { key: 'R', description: 'Download resume', action: () => window.downloadResume?.() }
        ];
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createShortcutsModal();
        this.bindKeyboardEvents();
    }

    createShortcutsModal() {
        const modal = document.createElement('div');
        modal.id = 'shortcuts-modal';
        modal.className = 'shortcuts-modal hidden';
        modal.innerHTML = `
            <div class="shortcuts-backdrop"></div>
            <div class="shortcuts-container">
                <div class="shortcuts-header">
                    <h3><i class="fas fa-keyboard"></i> Keyboard Shortcuts</h3>
                    <button class="shortcuts-close">&times;</button>
                </div>
                <div class="shortcuts-content">
                    <div class="shortcuts-intro">
                        <p>Use these keyboard shortcuts to navigate faster and access features quickly!</p>
                    </div>
                    <div class="shortcuts-grid">
                        ${this.shortcuts.map(shortcut => `
                            <div class="shortcut-item">
                                <kbd class="shortcut-key">${shortcut.key}</kbd>
                                <span class="shortcut-description">${shortcut.description}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="shortcuts-footer">
                        <p>Press <kbd>?</kbd> again to close this guide</p>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Bind close events
        modal.querySelector('.shortcuts-close').addEventListener('click', () => this.close());
        modal.querySelector('.shortcuts-backdrop').addEventListener('click', () => this.close());
    }

    bindKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            // Don't trigger shortcuts when user is typing in inputs
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            switch (e.key) {
                case '?':
                    e.preventDefault();
                    this.toggle();
                    break;
                case 't':
                case 'T':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        window.activateTimelineMode?.();
                    }
                    break;
                case 'h':
                case 'H':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        window.activateHackerMode?.();
                    }
                    break;
                case 's':
                case 'S':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        window.showSkillsConstellation?.();
                    }
                    break;
                case 'a':
                case 'A':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        window.toggleAIAssistant?.();
                    }
                    break;
                case 'd':
                case 'D':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        window.toggleTheme?.();
                    }
                    break;
                case 'r':
                case 'R':
                    if (!e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                        window.downloadResume?.();
                    }
                    break;
                case '/':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        window.searchSystem?.toggle();
                    }
                    break;
                case 'Escape':
                    this.close();
                    break;
            }
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        const modal = document.getElementById('shortcuts-modal');
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.add('open'), 10);
        this.isOpen = true;
    }

    close() {
        const modal = document.getElementById('shortcuts-modal');
        modal.classList.remove('open');
        setTimeout(() => modal.classList.add('hidden'), 300);
        this.isOpen = false;
    }

    navigateSection(direction) {
        // This will be handled by the existing page transitions
        const event = new KeyboardEvent('keydown', {
            key: direction === 'up' ? 'ArrowUp' : 'ArrowDown'
        });
        document.dispatchEvent(event);
    }

    goToSection(sectionId) {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
}

/* ============================================
   4. SEARCH FUNCTIONALITY
   ============================================ */

class SearchSystem {
    constructor() {
        this.searchData = [];
        this.isOpen = false;
        this.selectedIndex = 0;
        this.init();
    }

    init() {
        this.buildSearchIndex();
        this.createSearchModal();
    }

    buildSearchIndex() {
        // Index skills
        document.querySelectorAll('.skill-tag').forEach(tag => {
            this.searchData.push({
                type: 'skill',
                title: tag.textContent.trim(),
                description: 'Technical skill',
                element: tag,
                section: 'about'
            });
        });

        // Index projects
        document.querySelectorAll('.project-card').forEach(card => {
            const title = card.querySelector('h3')?.textContent.trim();
            const description = card.querySelector('p')?.textContent.trim();
            const category = card.querySelector('.project-category')?.textContent.trim();
            
            if (title) {
                this.searchData.push({
                    type: 'project',
                    title: title,
                    description: description || '',
                    category: category || '',
                    element: card,
                    section: 'portfolio'
                });
            }
        });

        // Index services
        document.querySelectorAll('.service-card').forEach(card => {
            const title = card.querySelector('h3')?.textContent.trim();
            const description = card.querySelector('p')?.textContent.trim();
            
            if (title) {
                this.searchData.push({
                    type: 'service',
                    title: title,
                    description: description || '',
                    element: card,
                    section: 'services'
                });
            }
        });

        // Index sections
        const sections = [
            { id: 'home', title: 'Home', description: 'Introduction and hero section' },
            { id: 'about', title: 'About Me', description: 'Background, skills, and experience' },
            { id: 'services', title: 'Services', description: 'What I do and expertise' },
            { id: 'portfolio', title: 'Portfolio', description: 'Projects and work showcase' },
            { id: 'contact', title: 'Contact', description: 'Get in touch and connect' }
        ];

        sections.forEach(section => {
            this.searchData.push({
                type: 'section',
                title: section.title,
                description: section.description,
                element: document.getElementById(section.id),
                section: section.id
            });
        });
    }

    createSearchModal() {
        const modal = document.createElement('div');
        modal.id = 'search-modal';
        modal.className = 'search-modal hidden';
        modal.innerHTML = `
            <div class="search-backdrop"></div>
            <div class="search-container">
                <div class="search-input-container">
                    <i class="fas fa-search search-icon"></i>
                    <input type="text" id="search-input" placeholder="Search projects, skills, sections..." autocomplete="off">
                    <kbd class="search-escape">ESC</kbd>
                </div>
                <div class="search-results" id="search-results">
                    <div class="search-empty">
                        <i class="fas fa-search"></i>
                        <p>Start typing to search...</p>
                    </div>
                </div>
                <div class="search-footer">
                    <div class="search-tips">
                        <span><kbd>↑↓</kbd> Navigate</span>
                        <span><kbd>Enter</kbd> Select</span>
                        <span><kbd>Esc</kbd> Close</span>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        this.bindSearchEvents();
    }

    bindSearchEvents() {
        const input = document.getElementById('search-input');
        const modal = document.getElementById('search-modal');
        const backdrop = modal.querySelector('.search-backdrop');

        input.addEventListener('input', (e) => this.handleSearch(e.target.value));
        input.addEventListener('keydown', (e) => this.handleKeyNavigation(e));
        backdrop.addEventListener('click', () => this.close());

        // Global search shortcut - bind to window to ensure it works everywhere
        window.addEventListener('keydown', (e) => {
            // Don't trigger if user is typing in an input field
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                e.stopPropagation();
                this.toggle();
            }
        }, true); // Use capture phase to ensure it fires first
    }

    handleSearch(query) {
        const results = document.getElementById('search-results');
        
        if (!query.trim()) {
            results.innerHTML = `
                <div class="search-empty">
                    <i class="fas fa-search"></i>
                    <p>Start typing to search...</p>
                </div>
            `;
            return;
        }

        const filteredResults = this.searchData.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()) ||
            (item.category && item.category.toLowerCase().includes(query.toLowerCase()))
        );

        if (filteredResults.length === 0) {
            results.innerHTML = `
                <div class="search-empty">
                    <i class="fas fa-search-minus"></i>
                    <p>No results found for "${query}"</p>
                </div>
            `;
            return;
        }

        results.innerHTML = filteredResults.map((item, index) => `
            <div class="search-result-item ${index === 0 ? 'selected' : ''}" data-index="${index}">
                <div class="search-result-icon">
                    <i class="${this.getIconForType(item.type)}"></i>
                </div>
                <div class="search-result-content">
                    <div class="search-result-title">${this.highlightMatch(item.title, query)}</div>
                    <div class="search-result-description">${this.highlightMatch(item.description, query)}</div>
                    ${item.category ? `<div class="search-result-category">${item.category}</div>` : ''}
                </div>
                <div class="search-result-type">${item.type}</div>
            </div>
        `).join('');

        this.selectedIndex = 0;
        this.currentResults = filteredResults;

        // Bind click events
        results.querySelectorAll('.search-result-item').forEach((item, index) => {
            item.addEventListener('click', () => this.selectResult(index));
        });
    }

    highlightMatch(text, query) {
        if (!query.trim()) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    getIconForType(type) {
        const icons = {
            skill: 'fas fa-code',
            project: 'fas fa-project-diagram',
            service: 'fas fa-cogs',
            section: 'fas fa-bookmark'
        };
        return icons[type] || 'fas fa-search';
    }

    handleKeyNavigation(e) {
        if (!this.currentResults) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, this.currentResults.length - 1);
                this.updateSelection();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
                this.updateSelection();
                break;
            case 'Enter':
                e.preventDefault();
                this.selectResult(this.selectedIndex);
                break;
            case 'Escape':
                this.close();
                break;
        }
    }

    updateSelection() {
        document.querySelectorAll('.search-result-item').forEach((item, index) => {
            item.classList.toggle('selected', index === this.selectedIndex);
        });
    }

    selectResult(index) {
        const result = this.currentResults[index];
        if (!result) return;

        this.close();

        // Navigate to the section first
        const section = document.getElementById(result.section);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });

            // Highlight the element after navigation
            setTimeout(() => {
                if (result.element) {
                    result.element.classList.add('search-highlight');
                    setTimeout(() => {
                        result.element.classList.remove('search-highlight');
                    }, 2000);
                }
            }, 500);
        }
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        const modal = document.getElementById('search-modal');
        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.add('open');
            document.getElementById('search-input').focus();
        }, 10);
        this.isOpen = true;
    }

    close() {
        const modal = document.getElementById('search-modal');
        modal.classList.remove('open');
        setTimeout(() => modal.classList.add('hidden'), 300);
        document.getElementById('search-input').value = '';
        document.getElementById('search-results').innerHTML = `
            <div class="search-empty">
                <i class="fas fa-search"></i>
                <p>Start typing to search...</p>
            </div>
        `;
        this.isOpen = false;
        this.currentResults = null;
        this.selectedIndex = 0;
    }
}

/* ============================================
   5. INITIALIZATION
   ============================================ */

/* ============================================
   6. WELCOME ONBOARDING SYSTEM
   ============================================ */

class WelcomeOnboarding {
    constructor() {
        this.hasSeenWelcome = localStorage.getItem('portfolio-welcome-seen') === 'true';
        this.init();
    }

    init() {
        if (!this.hasSeenWelcome) {
            setTimeout(() => this.showWelcomeMessage(), 2000); // Show after 2 seconds
        }
        this.createHelpIndicator();
    }

    showWelcomeMessage() {
        const welcome = document.createElement('div');
        welcome.id = 'welcome-message';
        welcome.className = 'welcome-message';
        welcome.innerHTML = `
            <div class="welcome-backdrop"></div>
            <div class="welcome-container">
                <div class="welcome-header">
                    <h3>🎉 Welcome to My Portfolio!</h3>
                    <button class="welcome-close">&times;</button>
                </div>
                <div class="welcome-content">
                    <p>Discover powerful features with keyboard shortcuts:</p>
                    <div class="welcome-shortcuts">
                        <div class="welcome-shortcut">
                            <kbd>?</kbd>
                            <span>View all shortcuts</span>
                        </div>
                        <div class="welcome-shortcut">
                            <kbd>Ctrl + /</kbd>
                            <span>Search anything</span>
                        </div>
                        <div class="welcome-shortcut">
                            <kbd>Ctrl + K</kbd>
                            <span>Command palette</span>
                        </div>
                    </div>
                    <div class="welcome-features">
                        <p>🚀 Try pressing <strong>T</strong> for Timeline, <strong>H</strong> for Hacker mode, or <strong>S</strong> for Skills constellation!</p>
                    </div>
                </div>
                <div class="welcome-footer">
                    <button class="welcome-got-it">Got it, thanks!</button>
                    <button class="welcome-show-all">Show all shortcuts</button>
                </div>
            </div>
        `;
        document.body.appendChild(welcome);

        // Add CSS for welcome message
        if (!document.getElementById('welcome-styles')) {
            const styles = document.createElement('style');
            styles.id = 'welcome-styles';
            styles.textContent = `
                .welcome-message {
                    position: fixed;
                    inset: 0;
                    z-index: 10001;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }

                .welcome-message.show {
                    opacity: 1;
                    visibility: visible;
                }

                .welcome-backdrop {
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(8px);
                }

                .welcome-container {
                    position: relative;
                    width: 90%;
                    max-width: 500px;
                    background: var(--bg-primary);
                    border: 1px solid var(--border-light);
                    border-radius: var(--radius-2xl);
                    box-shadow: var(--shadow-2xl);
                    overflow: hidden;
                    transform: scale(0.9);
                    transition: transform 0.3s ease;
                }

                .welcome-message.show .welcome-container {
                    transform: scale(1);
                }

                .welcome-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--spacing-xl);
                    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                    color: white;
                }

                .welcome-header h3 {
                    margin: 0;
                    font-weight: 600;
                }

                .welcome-close {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    font-size: 20px;
                    width: 32px;
                    height: 32px;
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s;
                }

                .welcome-close:hover {
                    background: rgba(255, 255, 255, 0.3);
                }

                .welcome-content {
                    padding: var(--spacing-xl);
                }

                .welcome-content p {
                    margin-bottom: var(--spacing-lg);
                    color: var(--text-secondary);
                    text-align: center;
                }

                .welcome-shortcuts {
                    display: flex;
                    flex-direction: column;
                    gap: var(--spacing-md);
                    margin-bottom: var(--spacing-lg);
                }

                .welcome-shortcut {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-md);
                    padding: var(--spacing-md);
                    background: var(--bg-secondary);
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--border-light);
                }

                .welcome-shortcut kbd {
                    background: var(--primary-color);
                    color: white;
                    padding: var(--spacing-xs) var(--spacing-md);
                    border-radius: var(--radius-sm);
                    font-size: var(--font-size-sm);
                    font-family: var(--font-mono);
                    font-weight: 600;
                    min-width: 60px;
                    text-align: center;
                }

                .welcome-shortcut span {
                    color: var(--text-primary);
                    font-weight: 500;
                }

                .welcome-features {
                    background: var(--bg-secondary);
                    padding: var(--spacing-lg);
                    border-radius: var(--radius-lg);
                    border: 1px solid var(--border-light);
                    margin-bottom: var(--spacing-lg);
                }

                .welcome-features p {
                    margin: 0;
                    font-size: var(--font-size-sm);
                    line-height: 1.5;
                }

                .welcome-footer {
                    display: flex;
                    gap: var(--spacing-sm);
                    padding: var(--spacing-xl);
                    background: var(--bg-secondary);
                    border-top: 1px solid var(--border-light);
                }

                .welcome-got-it,
                .welcome-show-all {
                    flex: 1;
                    padding: var(--spacing-md) var(--spacing-lg);
                    border-radius: var(--radius-lg);
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: none;
                }

                .welcome-got-it {
                    background: var(--primary-color);
                    color: white;
                }

                .welcome-got-it:hover {
                    background: var(--primary-dark);
                    transform: translateY(-1px);
                }

                .welcome-show-all {
                    background: var(--bg-primary);
                    color: var(--text-primary);
                    border: 1px solid var(--border-color);
                }

                .welcome-show-all:hover {
                    background: var(--bg-tertiary);
                    transform: translateY(-1px);
                }

                @media (max-width: 480px) {
                    .welcome-container {
                        width: 95%;
                    }
                    
                    .welcome-footer {
                        flex-direction: column;
                    }
                    
                    .welcome-shortcuts {
                        gap: var(--spacing-sm);
                    }
                    
                    .welcome-shortcut {
                        padding: var(--spacing-sm);
                    }
                }
            `;
            document.head.appendChild(styles);
        }

        // Show the welcome message
        setTimeout(() => welcome.classList.add('show'), 100);

        // Bind events
        const close = () => {
            welcome.classList.remove('show');
            setTimeout(() => welcome.remove(), 300);
            localStorage.setItem('portfolio-welcome-seen', 'true');
        };

        welcome.querySelector('.welcome-close').addEventListener('click', close);
        welcome.querySelector('.welcome-backdrop').addEventListener('click', close);
        welcome.querySelector('.welcome-got-it').addEventListener('click', close);
        welcome.querySelector('.welcome-show-all').addEventListener('click', () => {
            close();
            setTimeout(() => window.keyboardShortcuts?.open(), 400);
        });
    }

    createHelpIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'help-indicator';
        indicator.className = 'help-indicator';
        indicator.innerHTML = `
            <div class="help-icon">
                <i class="fas fa-question"></i>
            </div>
            <div class="help-tooltip">
                <span>Press <kbd>?</kbd> for shortcuts</span>
            </div>
        `;
        document.body.appendChild(indicator);

        // Add CSS for help indicator
        if (!document.getElementById('help-indicator-styles')) {
            const styles = document.createElement('style');
            styles.id = 'help-indicator-styles';
            styles.textContent = `
                .help-indicator {
                    position: fixed;
                    top: 50%;
                    right: 15px;
                    transform: translateY(-50%);
                    z-index: 1001;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .help-icon {
                    width: 40px;
                    height: 40px;
                    background: var(--primary-color);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 16px;
                    box-shadow: var(--shadow-lg);
                    animation: help-pulse 3s infinite ease-in-out;
                    transition: all 0.3s ease;
                }

                .help-indicator:hover .help-icon {
                    transform: scale(1.1);
                    animation: none;
                    box-shadow: var(--shadow-xl);
                }

                .help-tooltip {
                    position: absolute;
                    right: 50px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: var(--bg-primary);
                    color: var(--text-primary);
                    padding: var(--spacing-sm) var(--spacing-md);
                    border-radius: var(--radius-lg);
                    font-size: var(--font-size-sm);
                    font-weight: 500;
                    white-space: nowrap;
                    box-shadow: var(--shadow-lg);
                    border: 1px solid var(--border-light);
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                    pointer-events: none;
                }

                .help-tooltip::after {
                    content: '';
                    position: absolute;
                    left: 100%;
                    top: 50%;
                    transform: translateY(-50%);
                    border: 6px solid transparent;
                    border-left-color: var(--bg-primary);
                }

                .help-indicator:hover .help-tooltip {
                    opacity: 1;
                    visibility: visible;
                }

                .help-tooltip kbd {
                    background: var(--primary-color);
                    color: white;
                    padding: 2px 6px;
                    border-radius: 3px;
                    font-size: 11px;
                    font-family: var(--font-mono);
                }

                @keyframes help-pulse {
                    0%, 100% {
                        box-shadow: var(--shadow-lg), 0 0 0 0 rgba(99, 102, 241, 0.4);
                    }
                    50% {
                        box-shadow: var(--shadow-lg), 0 0 0 10px rgba(99, 102, 241, 0);
                    }
                }

                @media (max-width: 768px) {
                    .help-indicator {
                        right: 10px;
                    }
                    
                    .help-icon {
                        width: 36px;
                        height: 36px;
                        font-size: 14px;
                    }
                    
                    .help-tooltip {
                        display: none; /* Hide tooltip on mobile to avoid overflow */
                    }
                }

                @media (max-width: 480px) {
                    .help-indicator {
                        top: auto;
                        bottom: 180px;
                        right: 15px;
                    }
                }
            `;
            document.head.appendChild(styles);
        }

        // Click handler for help indicator
        indicator.addEventListener('click', () => {
            window.keyboardShortcuts?.open();
        });
    }
}

// Initialize Enhanced UX features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all UX enhancements
    window.readingTimeEstimator = new ReadingTimeEstimator();
    window.breadcrumbNav = new BreadcrumbNavigation();
    window.keyboardShortcuts = new KeyboardShortcuts();
    window.searchSystem = new SearchSystem();
    window.welcomeOnboarding = new WelcomeOnboarding(); // ← New onboarding system

    console.log('✨ Enhanced UX features loaded!');
    console.log('🔍 Press Ctrl+/ to search');
    console.log('⌨️ Press ? for keyboard shortcuts');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ReadingTimeEstimator,
        BreadcrumbNavigation,
        KeyboardShortcuts,
        SearchSystem
    };
}
