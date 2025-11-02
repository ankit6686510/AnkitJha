// Blog and Coding Challenge Management System
document.addEventListener('DOMContentLoaded', function() {
    // Variables for pagination
    let blogPage = 1;
    let challengePage = 1;
    const pageSize = 6;
    
    // Load data when page loads
    loadBlogs();
    loadChallenges();
    
    // Set up event listeners for admin features
    setupAdminFeatures();
    setupBlogForm();
    setupChallengeForm();
    
    // Set up filter buttons for challenges
    setupChallengeFilters();
    
    // Load more buttons
    document.getElementById('load-more-blogs').addEventListener('click', function(e) {
        e.preventDefault();
        blogPage++;
        loadBlogs(false);
    });
    
    document.getElementById('load-more-challenges').addEventListener('click', function(e) {
        e.preventDefault();
        challengePage++;
        loadChallenges(false);
    });
    
    // Fetch and render blog posts
    function loadBlogs(reset = true) {
        if (reset) {
            blogPage = 1;
            document.getElementById('blog-list').innerHTML = '<div class="loading-spinner"><i class="fas fa-circle-notch fa-spin"></i></div>';
        }
        
        // First try the data directory
        fetch('data/blogs.json')
            .then(response => {
                if (!response.ok) {
                    // If not found in data directory, try root directory
                    return fetch('blogs.json');
                }
                return response;
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const startIndex = (blogPage - 1) * pageSize;
                const endIndex = startIndex + pageSize;
                const paginatedData = data.slice(startIndex, endIndex);
                
                // Remove loading spinner on first load
                if (blogPage === 1) {
                    document.getElementById('blog-list').innerHTML = '';
                }
                
                if (paginatedData.length === 0) {
                    document.getElementById('load-more-blogs').style.display = 'none';
                    if (blogPage === 1) {
                        document.getElementById('blog-list').innerHTML = '<p class="no-items">No blog posts found.</p>';
                    }
                    return;
                }
                
                paginatedData.forEach(blog => {
                    const blogElement = createBlogElement(blog);
                    document.getElementById('blog-list').appendChild(blogElement);
                    
                    // Animate the new element
                    setTimeout(() => {
                        blogElement.classList.add('visible');
                    }, 100);
                });
                
                // Hide load more button if we've reached the end
                if (endIndex >= data.length) {
                    document.getElementById('load-more-blogs').style.display = 'none';
                } else {
                    document.getElementById('load-more-blogs').style.display = 'inline-block';
                }
                
                // Initialize AOS for new elements
                AOS.refresh();
            })
            .catch(error => {
                console.error('Error loading blogs:', error);
                document.getElementById('blog-list').innerHTML = `<p class="error">Failed to load blog posts: ${error.message}. Please check the console for details.</p>`;
            });
    }
    
    // Create HTML element for a blog post
    function createBlogElement(blog) {
        const blogDiv = document.createElement('div');
        blogDiv.className = 'blog-post';
        blogDiv.setAttribute('data-aos', 'fade-up');
        blogDiv.setAttribute('data-id', blog.id);
        
        // Format the date
        const date = new Date(blog.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        
        // Create a shortened excerpt of the content
        const contentText = stripMarkdown(blog.content);
        const excerpt = contentText.length > 150 ? contentText.substring(0, 150) + '...' : contentText;
        
        blogDiv.innerHTML = `
            <div class="blog-date">
                <span class="day">${date.getDate()}</span>
                <span class="month">${date.toLocaleDateString('en-US', { month: 'short' })}</span>
            </div>
            <h2>${blog.title}</h2>
            <div class="blog-content">
                <p>${excerpt}</p>
                ${blog.image ? `<img src="${blog.image}" alt="${blog.title}" class="blog-image">` : ''}
            </div>
            <div class="blog-post-footer">
                <div class="blog-post-meta">
                    <span>${formattedDate}</span>
                </div>
                <div class="blog-post-author">
                    <img src="${blog.authorImage}" alt="${blog.author}">
                    <span>${blog.author}</span>
                </div>
            </div>
            <a href="#blog/${blog.id}" class="read-more">Read more <i class="fas fa-long-arrow-alt-right"></i></a>
        `;
        
        // Add event listener for the read more link
        const readMoreLink = blogDiv.querySelector('.read-more');
        readMoreLink.addEventListener('click', function(e) {
            e.preventDefault();
            showBlogDetail(blog);
        });
        
        return blogDiv;
    }
    
    // Show blog detail modal
    function showBlogDetail(blog) {
        // Create a modal element
        const modal = document.createElement('div');
        modal.className = 'blog-modal';
        
        // Format the date
        const date = new Date(blog.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        
        // Render markdown content
        const renderedContent = renderMarkdown(blog.content);
        
        modal.innerHTML = `
            <div class="blog-modal-content">
                <span class="close-modal">&times;</span>
                <h2>${blog.title}</h2>
                <div class="blog-meta">
                    <div class="blog-post-author">
                        <img src="${blog.authorImage}" alt="${blog.author}">
                        <span>${blog.author}</span>
                    </div>
                    <span class="blog-date">${formattedDate}</span>
                </div>
                ${blog.image ? `<img src="${blog.image}" alt="${blog.title}" class="blog-detail-image">` : ''}
                <div class="blog-detail-content">
                    ${renderedContent}
                </div>
                <div class="blog-tags">
                    ${blog.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
        
        // Add event listener to close the modal
        modal.querySelector('.close-modal').addEventListener('click', function() {
            document.body.removeChild(modal);
            document.body.style.overflow = ''; // Restore scrolling
        });
        
        // Close modal when clicking outside content
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    }
    
    // Fetch and render coding challenges
    function loadChallenges(reset = true) {
        if (reset) {
            challengePage = 1;
            document.getElementById('challenges-list').innerHTML = '<div class="loading-spinner"><i class="fas fa-circle-notch fa-spin"></i></div>';
        }
        
        // First try the data directory
        fetch('data/challenges.json')
            .then(response => {
                if (!response.ok) {
                    // If not found in data directory, try root directory
                    return fetch('challenges.json');
                }
                return response;
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Get active filter
                const activeFilter = document.querySelector('.challenges-filter .filter-btn.active').getAttribute('data-filter');
                
                // Filter data if needed
                let filteredData = data;
                if (activeFilter !== 'all') {
                    filteredData = data.filter(challenge => challenge.platform === activeFilter);
                }
                
                const startIndex = (challengePage - 1) * pageSize;
                const endIndex = startIndex + pageSize;
                const paginatedData = filteredData.slice(startIndex, endIndex);
                
                // Remove loading spinner on first load
                if (challengePage === 1) {
                    document.getElementById('challenges-list').innerHTML = '';
                }
                
                if (paginatedData.length === 0) {
                    document.getElementById('load-more-challenges').style.display = 'none';
                    if (challengePage === 1) {
                        document.getElementById('challenges-list').innerHTML = '<p class="no-items">No challenges found.</p>';
                    }
                    return;
                }
                
                paginatedData.forEach(challenge => {
                    const challengeElement = createChallengeElement(challenge);
                    document.getElementById('challenges-list').appendChild(challengeElement);
                    
                    // Animate the new element
                    setTimeout(() => {
                        challengeElement.classList.add('visible');
                    }, 100);
                });
                
                // Hide load more button if we've reached the end
                if (endIndex >= filteredData.length) {
                    document.getElementById('load-more-challenges').style.display = 'none';
                } else {
                    document.getElementById('load-more-challenges').style.display = 'inline-block';
                }
                
                // Initialize AOS for new elements
                AOS.refresh();
            })
            .catch(error => {
                console.error('Error loading challenges:', error);
                document.getElementById('challenges-list').innerHTML = `<p class="error">Failed to load challenges: ${error.message}. Please check the console for details.</p>`;
            });
    }
    
    // Create HTML element for a challenge
    function createChallengeElement(challenge) {
        const challengeDiv = document.createElement('div');
        challengeDiv.className = 'challenge-card';
        challengeDiv.setAttribute('data-aos', 'fade-up');
        challengeDiv.setAttribute('data-category', challenge.platform);
        challengeDiv.setAttribute('data-id', challenge.id);
        
        // Format the date
        const date = new Date(challenge.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        
        // Get platform name and icon
        const platformInfo = getPlatformInfo(challenge.platform);
        
        challengeDiv.innerHTML = `
            <div class="challenge-header">
                <div class="challenge-platform">
                    <img src="${platformInfo.icon}" alt="${platformInfo.name}" class="platform-icon">
                    <span>${platformInfo.name}</span>
                </div>
                <span class="difficulty ${challenge.difficulty}">${challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}</span>
            </div>
            <div class="challenge-body">
                <h3 class="challenge-title">${challenge.title}</h3>
                <p class="challenge-description">${challenge.description}</p>
                <div class="challenge-tags">
                    ${challenge.tags.map(tag => `<span class="challenge-tag">${tag}</span>`).join('')}
                </div>
                <div class="challenge-footer">
                    <span class="challenge-date">${formattedDate}</span>
                    <div class="challenge-links">
                        <a href="${challenge.problemUrl}" target="_blank" title="View Problem"><i class="fas fa-external-link-alt"></i></a>
                        ${challenge.solutionUrl ? `<a href="${challenge.solutionUrl}" target="_blank" title="View Solution"><i class="fas fa-code"></i></a>` : ''}
                    </div>
                </div>
            </div>
        `;
        
        return challengeDiv;
    }
    
    // Get platform information
    function getPlatformInfo(platform) {
        const platforms = {
            'leetcode': { 
                name: 'LeetCode', 
                icon: 'https://leetcode.com/static/images/LeetCode_logo_rvs.png' 
            },
            'hackerrank': { 
                name: 'HackerRank', 
                icon: 'https://hrcdn.net/community-frontend/assets/favicon-ddc852f75a.png' 
            },
            'codechef': { 
                name: 'CodeChef', 
                icon: 'https://cdn.codechef.com/sites/default/files/uploads/pictures/811b20a47eac52b10c90ab82e0628e21.png' 
            },
            'other': { 
                name: 'Other', 
                icon: 'https://img.icons8.com/cotton/64/000000/code.png' 
            }
        };
        
        return platforms[platform] || platforms['other'];
    }
    
    // Set up filter buttons for challenges
    function setupChallengeFilters() {
        const filterButtons = document.querySelectorAll('.challenges-filter .filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Reload challenges with the new filter
                loadChallenges();
            });
        });
    }
    
    // Admin features
    function setupAdminFeatures() {
        const adminToggle = document.getElementById('admin-toggle');
        
        adminToggle.addEventListener('click', function() {
            // Check if admin is already active
            const isAdmin = document.body.classList.contains('admin-mode');
            
            if (isAdmin) {
                document.body.classList.remove('admin-mode');
                this.innerHTML = '<i class="fas fa-lock"></i>';
                this.title = 'Admin Mode';
                
                // Close any open forms
                document.getElementById('blog-form').style.display = 'none';
                document.getElementById('challenge-form').style.display = 'none';
            } else {
                // In a real app, you'd have authentication here
                const password = prompt('Enter admin password:');
                
                // Simple password check for demo purposes
                // In a real app, this would be a secure server-side authentication
                if (password === 'admin123') {
                    document.body.classList.add('admin-mode');
                    this.innerHTML = '<i class="fas fa-lock-open"></i>';
                    this.title = 'Exit Admin Mode';
                } else {
                    alert('Incorrect password');
                }
            }
        });
        
        // Set up new blog button
        document.getElementById('new-blog-btn').addEventListener('click', function() {
            document.getElementById('blog-form').style.display = 'block';
            // Scroll to the form
            document.getElementById('blog-form').scrollIntoView({ behavior: 'smooth' });
        });
        
        // Set up new challenge button
        document.getElementById('new-challenge-btn').addEventListener('click', function() {
            document.getElementById('challenge-form').style.display = 'block';
            // Scroll to the form
            document.getElementById('challenge-form').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Blog form functionality
    function setupBlogForm() {
        const form = document.getElementById('add-blog-form');
        const addTagBtn = document.getElementById('add-blog-tag');
        const tagInput = document.getElementById('blog-tag-input');
        const tagContainer = document.getElementById('blog-tags');
        const cancelBtn = document.getElementById('cancel-blog');
        
        // Tags array
        let blogTags = [];
        
        // Add tag functionality
        addTagBtn.addEventListener('click', function() {
            const tag = tagInput.value.trim();
            if (tag && !blogTags.includes(tag)) {
                blogTags.push(tag);
                renderBlogTags();
                tagInput.value = '';
            }
        });
        
        // Cancel form
        cancelBtn.addEventListener('click', function() {
            form.reset();
            blogTags = [];
            renderBlogTags();
            document.getElementById('blog-form').style.display = 'none';
        });
        
        // Render tags
        function renderBlogTags() {
            tagContainer.innerHTML = '';
            blogTags.forEach((tag, index) => {
                const tagElement = document.createElement('div');
                tagElement.className = 'tag-item';
                tagElement.innerHTML = `
                    ${tag}
                    <i class="fas fa-times" data-index="${index}"></i>
                `;
                tagContainer.appendChild(tagElement);
            });
            
            // Add remove tag functionality
            document.querySelectorAll('#blog-tags .tag-item i').forEach(icon => {
                icon.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    blogTags.splice(index, 1);
                    renderBlogTags();
                });
            });
        }
        
        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const title = document.getElementById('blog-title').value;
            const content = document.getElementById('blog-content').value;
            const imageUrl = document.getElementById('blog-image').value;
            
            // In a real app, we would send this data to a server to save
            // For this demo, we'll simulate adding it to our existing data
            
            const newBlog = {
                id: Date.now(), // Use timestamp as a simple ID
                title: title,
                content: content,
                date: new Date().toISOString().split('T')[0],
                tags: [...blogTags],
                image: imageUrl || null,
                author: "Ankit",
                authorImage: "ankit jha.jpg"
            };
            
            // In a real app, you would save this to a database
            console.log('New blog post:', newBlog);
            alert('Blog post created successfully! In a real app, this would be saved to the database.');
            
            // Reset form
            form.reset();
            blogTags = [];
            renderBlogTags();
            document.getElementById('blog-form').style.display = 'none';
            
            // In a real app, we would refresh the data from the server
            // For this demo, we'll simulate adding it locally
            const blogElement = createBlogElement(newBlog);
            document.getElementById('blog-list').insertBefore(blogElement, document.getElementById('blog-list').firstChild);
            
            // Animate the new element
            setTimeout(() => {
                blogElement.classList.add('visible');
            }, 100);
        });
    }
    
    // Challenge form functionality
    function setupChallengeForm() {
        const form = document.getElementById('add-challenge-form');
        const addTagBtn = document.getElementById('add-challenge-tag');
        const tagInput = document.getElementById('challenge-tag-input');
        const tagContainer = document.getElementById('challenge-tags');
        const cancelBtn = document.getElementById('cancel-challenge');
        
        // Tags array
        let challengeTags = [];
        
        // Add tag functionality
        addTagBtn.addEventListener('click', function() {
            const tag = tagInput.value.trim();
            if (tag && !challengeTags.includes(tag)) {
                challengeTags.push(tag);
                renderChallengeTags();
                tagInput.value = '';
            }
        });
        
        // Cancel form
        cancelBtn.addEventListener('click', function() {
            form.reset();
            challengeTags = [];
            renderChallengeTags();
            document.getElementById('challenge-form').style.display = 'none';
        });
        
        // Render tags
        function renderChallengeTags() {
            tagContainer.innerHTML = '';
            challengeTags.forEach((tag, index) => {
                const tagElement = document.createElement('div');
                tagElement.className = 'tag-item';
                tagElement.innerHTML = `
                    ${tag}
                    <i class="fas fa-times" data-index="${index}"></i>
                `;
                tagContainer.appendChild(tagElement);
            });
            
            // Add remove tag functionality
            document.querySelectorAll('#challenge-tags .tag-item i').forEach(icon => {
                icon.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    challengeTags.splice(index, 1);
                    renderChallengeTags();
                });
            });
        }
        
        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const title = document.getElementById('challenge-title').value;
            const platform = document.getElementById('challenge-platform').value;
            const difficulty = document.getElementById('challenge-difficulty').value;
            const description = document.getElementById('challenge-description').value;
            const solutionUrl = document.getElementById('challenge-solution').value;
            const problemUrl = document.getElementById('challenge-problem').value;
            
            // In a real app, we would send this data to a server to save
            // For this demo, we'll simulate adding it to our existing data
            
            const newChallenge = {
                id: Date.now(), // Use timestamp as a simple ID
                title: title,
                platform: platform,
                difficulty: difficulty,
                description: description,
                problemUrl: problemUrl,
                solutionUrl: solutionUrl || null,
                date: new Date().toISOString().split('T')[0],
                tags: [...challengeTags]
            };
            
            // In a real app, you would save this to a database
            console.log('New challenge:', newChallenge);
            alert('Challenge created successfully! In a real app, this would be saved to the database.');
            
            // Reset form
            form.reset();
            challengeTags = [];
            renderChallengeTags();
            document.getElementById('challenge-form').style.display = 'none';
            
            // In a real app, we would refresh the data from the server
            // For this demo, we'll simulate adding it locally
            const challengeElement = createChallengeElement(newChallenge);
            document.getElementById('challenges-list').insertBefore(challengeElement, document.getElementById('challenges-list').firstChild);
            
            // Animate the new element
            setTimeout(() => {
                challengeElement.classList.add('visible');
            }, 100);
        });
    }
    
    // Helper function to strip markdown for excerpts
    function stripMarkdown(markdown) {
        return markdown
            .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1') // Replace links with just the text
            .replace(/#{1,6}\s+/g, '') // Remove headings
            .replace(/(\*\*|__)(.*?)\1/g, '$2') // Remove bold
            .replace(/(\*|_)(.*?)\1/g, '$2') // Remove italic
            .replace(/`{3}[\s\S]*?`{3}/g, '') // Remove code blocks
            .replace(/`([^`]+)`/g, '$1') // Remove inline code
            .replace(/\n/g, ' ') // Replace newlines with spaces
            .replace(/\s+/g, ' ') // Normalize spaces
            .trim();
    }
    
    // Helper function to render markdown
    function renderMarkdown(markdown) {
        // For a real app, you would use a proper markdown parser
        // This is a simple implementation for demo purposes
        let html = markdown
            // Code blocks
            .replace(/```(\w+)?\n([\s\S]*?)\n```/g, '<pre><code>$2</code></pre>')
            // Headings
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
            // Lists
            .replace(/^\s*-\s(.*)$/gm, '<li>$1</li>')
            // Paragraphs
            .replace(/^(?!<[a-z])/gm, '<p>')
            .replace(/^(?!<[a-z])/gm, '</p>')
            // Line breaks
            .replace(/\n/g, '<br>');
        
        // Wrap lists in <ul> tags
        html = html.replace(/<li>(.*?)<\/li>/g, function(match) {
            return '<ul>' + match + '</ul>';
        });
        
        return html;
    }

    // Mobile menu functionality
    function openmenu() {
        const sidemenu = document.getElementById('sidemenu');
        sidemenu.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    }

    function closemenu() {
        const sidemenu = document.getElementById('sidemenu');
        sidemenu.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        const sidemenu = document.getElementById('sidemenu');
        const menuIcon = document.querySelector('.fa-bars');
        
        if (sidemenu.classList.contains('active') && 
            !sidemenu.contains(e.target) && 
            !menuIcon.contains(e.target)) {
            closemenu();
        }
    });

    // Close menu when clicking on a link
    document.querySelectorAll('#sidemenu a').forEach(link => {
        link.addEventListener('click', () => {
            closemenu();
        });
    });

    // Debounce function for performance optimization
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Optimized scroll handler
    function handleScroll() {
        const nav = document.querySelector('nav');
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(18, 18, 18, 0.95)';
            if (!document.body.classList.contains('dark-mode')) {
                nav.style.background = 'rgba(245, 245, 247, 0.95)';
            }
        } else {
            nav.style.background = 'rgba(18, 18, 18, 0.8)';
            if (!document.body.classList.contains('dark-mode')) {
                nav.style.background = 'rgba(245, 245, 247, 0.8)';
            }
        }
        
        // Update active navigation link based on scroll position
        updateActiveNavLink();
    }
    
    // Add debounced scroll event listener for navbar
    window.addEventListener('scroll', debounce(handleScroll, 10));
    
    // Function to update active navigation link
    function updateActiveNavLink() {
        const sections = ['header', 'about', 'services', 'portfolio', 'contact'];
        const navLinks = document.querySelectorAll('#sidemenu a');
        
        let currentSection = 'header';
        
        // Check which section is currently in view
        for (let section of sections) {
            const element = document.getElementById(section);
            if (element) {
                const rect = element.getBoundingClientRect();
                // If section is in the top half of the viewport
                if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                    currentSection = section;
                    break;
                }
            }
        }
        
        // Remove active class from all links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current section link
        const activeLink = document.querySelector(`#sidemenu a[href="#${currentSection}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    // Initialize active link on page load
    updateActiveNavLink();
    
    // Add keyboard navigation support for mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openmenu();
            }
        });
    }
    
    // Add keyboard support for close menu
    const closeButton = document.querySelector('.fa-times');
    if (closeButton) {
        closeButton.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                closemenu();
            }
        });
    }
    
    // Close menu with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const sidemenu = document.getElementById('sidemenu');
            if (sidemenu.classList.contains('active')) {
                closemenu();
            }
        }
    });
}); 