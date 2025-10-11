/**
 * Dynamic Content Loader
 * Loads and renders blog posts and coding challenges from JSON files
 */

class ContentLoader {
    constructor() {
        this.blogs = [];
        this.isLoading = false;
    }

    /**
     * Initialize the content loader
     */
    async init() {
        try {
            await this.loadBlogs();
            this.bindEventListeners();
        } catch (error) {
            console.error('Failed to initialize content loader:', error);
            this.showErrorMessage();
        }
    }

    /**
     * Load blog posts from JSON file
     */
    async loadBlogs() {
        try {
            const response = await fetch('./data/blogs.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            this.blogs = await response.json();
            this.renderBlogs();
        } catch (error) {
            console.error('Failed to load blogs:', error);
            this.showErrorMessage('blog');
        }
    }

    /**
     * Render blog posts to the DOM
     */
    renderBlogs() {
        const blogContainer = document.querySelector('.blog-list');
        if (!blogContainer) return;

        // Clear existing static content
        blogContainer.innerHTML = '';

        // Render each blog post
        this.blogs.forEach((blog, index) => {
            const blogElement = this.createBlogElement(blog, index);
            blogContainer.appendChild(blogElement);
        });

        // Reinitialize AOS for new elements
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    /**
     * Create a blog post element
     */
    createBlogElement(blog, index) {
        const article = document.createElement('article');
        article.className = 'blog-post';
        article.setAttribute('data-aos', 'fade-up');
        article.setAttribute('data-aos-delay', `${(index + 1) * 100}`);

        const date = new Date(blog.date);
        const day = date.getDate();
        const month = date.toLocaleDateString('en-US', { month: 'short' });

        article.innerHTML = `
            <div class="blog-date">
                <span class="day">${day}</span>
                <span class="month">${month}</span>
            </div>
            <h2>${this.escapeHtml(blog.title)}</h2>
            <div class="blog-content">
                <p>${this.escapeHtml(this.extractExcerpt(blog.content))}</p>
                ${blog.image ? `<img src="${blog.image}" alt="${this.escapeHtml(blog.title)}" class="blog-image" loading="lazy">` : ''}
            </div>
            <div class="blog-tags">
                ${blog.tags.map(tag => `<span class="blog-tag">${this.escapeHtml(tag)}</span>`).join('')}
            </div>
            <div class="blog-post-footer">
                <div class="blog-post-meta">
                    <span>${date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div class="blog-post-author">
                    <img src="${blog.authorImage}" alt="${this.escapeHtml(blog.author)}" loading="lazy">
                    <span>${this.escapeHtml(blog.author)}</span>
                </div>
            </div>
            <a href="#" class="read-more" data-blog-id="${blog.id}">
                Read more <i class="fas fa-long-arrow-alt-right"></i>
            </a>
        `;

        return article;
    }


    /**
     * Bind event listeners for dynamic functionality
     */
    bindEventListeners() {
        // Blog read more functionality
        document.addEventListener('click', (e) => {
            if (e.target.closest('.read-more')) {
                e.preventDefault();
                const blogId = e.target.closest('.read-more').getAttribute('data-blog-id');
                this.openBlogModal(blogId);
            }
        });

        // Search functionality
        this.initializeSearch();
    }

    /**
     * Initialize search functionality
     */
    initializeSearch() {
        const searchInput = document.getElementById('search-input');
        if (!searchInput) return;

        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value.trim());
            }, 300);
        });
    }

    /**
     * Perform search across blogs
     */
    performSearch(query) {
        if (!query) {
            this.showAllContent();
            return;
        }

        const searchResults = {
            blogs: this.searchBlogs(query)
        };

        this.displaySearchResults(searchResults);
    }

    /**
     * Search blog posts
     */
    searchBlogs(query) {
        return this.blogs.filter(blog => 
            blog.title.toLowerCase().includes(query.toLowerCase()) ||
            blog.content.toLowerCase().includes(query.toLowerCase()) ||
            blog.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
    }

    /**
     * Display search results
     */
    displaySearchResults(results) {
        const blogSection = document.getElementById('blog');

        if (results.blogs.length === 0) {
            blogSection.style.display = 'none';
        } else {
            blogSection.style.display = 'block';
            this.renderFilteredBlogs(results.blogs);
        }
    }

    /**
     * Show all content (clear search)
     */
    showAllContent() {
        document.getElementById('blog').style.display = 'block';
        this.renderBlogs();
    }

    /**
     * Render filtered blogs for search results
     */
    renderFilteredBlogs(blogs) {
        const blogContainer = document.querySelector('.blog-list');
        if (!blogContainer) return;

        blogContainer.innerHTML = '';

        blogs.forEach((blog, index) => {
            const blogElement = this.createBlogElement(blog, index);
            blogContainer.appendChild(blogElement);
        });

        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    /**
     * Open blog modal with full content
     */
    openBlogModal(blogId) {
        const blog = this.blogs.find(b => b.id == blogId);
        if (!blog) return;

        // Create modal if it doesn't exist
        let modal = document.getElementById('blog-modal');
        if (!modal) {
            modal = this.createBlogModal();
            document.body.appendChild(modal);
        }

        // Populate modal content
        const modalContent = modal.querySelector('.modal-content');
        modalContent.innerHTML = `
            <div class="modal-header">
                <h2>${this.escapeHtml(blog.title)}</h2>
                <span class="modal-close">&times;</span>
            </div>
            <div class="modal-body">
                <div class="blog-meta">
                    <span class="blog-date">${new Date(blog.date).toLocaleDateString()}</span>
                    <div class="blog-tags">
                        ${blog.tags.map(tag => `<span class="blog-tag">${this.escapeHtml(tag)}</span>`).join('')}
                    </div>
                </div>
                <div class="blog-content">
                    ${this.markdownToHtml(blog.content)}
                </div>
            </div>
        `;

        // Show modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Bind close events
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.onclick = () => this.closeBlogModal();
        
        modal.onclick = (e) => {
            if (e.target === modal) this.closeBlogModal();
        };
    }

    /**
     * Create blog modal element
     */
    createBlogModal() {
        const modal = document.createElement('div');
        modal.id = 'blog-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <!-- Content will be populated dynamically -->
            </div>
        `;
        return modal;
    }

    /**
     * Close blog modal
     */
    closeBlogModal() {
        const modal = document.getElementById('blog-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    /**
     * Extract excerpt from blog content
     */
    extractExcerpt(content, maxLength = 150) {
        // Remove markdown formatting for excerpt
        const plainText = content.replace(/[#*`\[\]]/g, '').replace(/\n/g, ' ');
        return plainText.length > maxLength 
            ? plainText.substring(0, maxLength).trim() + '...'
            : plainText;
    }

    /**
     * Basic markdown to HTML conversion
     */
    markdownToHtml(markdown) {
        return markdown
            .replace(/### (.*$)/gim, '<h3>$1</h3>')
            .replace(/## (.*$)/gim, '<h2>$1</h2>')
            .replace(/# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/```javascript\n([\s\S]*?)\n```/gim, '<pre><code class="language-javascript">$1</code></pre>')
            .replace(/```css\n([\s\S]*?)\n```/gim, '<pre><code class="language-css">$1</code></pre>')
            .replace(/```bash\n([\s\S]*?)\n```/gim, '<pre><code class="language-bash">$1</code></pre>')
            .replace(/```\n([\s\S]*?)\n```/gim, '<pre><code>$1</code></pre>')
            .replace(/`([^`]*)`/gim, '<code>$1</code>')
            .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
            .replace(/^- (.*$)/gim, '<li>$1</li>')
            .replace(/\n/gim, '<br>');
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    /**
     * Show error message when content fails to load
     */
    showErrorMessage(type = 'content') {
        const errorMessage = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to load ${type}. Please try refreshing the page.</p>
            </div>
        `;
        
        if (type === 'blog') {
            const blogContainer = document.querySelector('.blog-list');
            if (blogContainer) blogContainer.innerHTML = errorMessage;
        } else if (type === 'challenges') {
            const challengesContainer = document.querySelector('.challenges-list');
            if (challengesContainer) challengesContainer.innerHTML = errorMessage;
        }
    }
}

// Initialize content loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const contentLoader = new ContentLoader();
    contentLoader.init();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentLoader;
}
