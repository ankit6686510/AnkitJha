// NEXT-GEN PORTFOLIO FEATURES
// Implementation plan for unique, premium portfolio experiences

/* ============================================
   1. COMMAND PALETTE NAVIGATION SYSTEM
   ============================================ */

class CommandPalette {
    constructor() {
        this.commands = [
            { name: 'Go to Projects', action: () => window.navigateToSection('portfolio'), icon: '🚀' },
            { name: 'Contact Me', action: () => window.navigateToSection('contact'), icon: '💬' },
            { name: 'Download Resume', action: () => window.downloadResume(), icon: '📄' },
            { name: 'Toggle Dark Mode', action: () => window.toggleTheme(), icon: '🌙' },
            { name: 'View GitHub', action: () => window.open('https://github.com/ankit6686510', '_blank'), icon: '🐙' },
            { name: 'Timeline Mode', action: () => window.activateTimelineMode(), icon: '⏱️' },
            { name: 'Hacker Mode', action: () => window.activateHackerMode(), icon: '💻' },
            { name: 'Skills Constellation', action: () => window.showSkillsConstellation(), icon: '⭐' },
            { name: 'AI Assistant', action: () => window.toggleAIAssistant(), icon: '🤖' }
        ];
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createPaletteHTML();
        this.bindEvents();
    }

    createPaletteHTML() {
        const palette = document.createElement('div');
        palette.id = 'command-palette';
        palette.className = 'command-palette hidden';
        palette.innerHTML = `
            <div class="command-palette-backdrop"></div>
            <div class="command-palette-container">
                <div class="command-search">
                    <i class="fas fa-terminal"></i>
                    <input type="text" placeholder="Type a command or search..." id="command-input">
                    <kbd>ESC</kbd>
                </div>
                <div class="command-results" id="command-results"></div>
            </div>
        `;
        document.body.appendChild(palette);
    }

    bindEvents() {
        // Ctrl/Cmd + K to open
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.toggle();
            }
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Search functionality
        const input = document.getElementById('command-input');
        input?.addEventListener('input', (e) => this.filterCommands(e.target.value));
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        const palette = document.getElementById('command-palette');
        palette.classList.remove('hidden');
        setTimeout(() => palette.classList.add('open'), 10);
        document.getElementById('command-input')?.focus();
        this.isOpen = true;
        this.renderCommands(this.commands);
    }

    close() {
        const palette = document.getElementById('command-palette');
        palette.classList.remove('open');
        setTimeout(() => palette.classList.add('hidden'), 300);
        this.isOpen = false;
    }

    filterCommands(query) {
        const filtered = this.commands.filter(cmd => 
            cmd.name.toLowerCase().includes(query.toLowerCase())
        );
        this.renderCommands(filtered);
    }

    renderCommands(commands) {
        const results = document.getElementById('command-results');
        results.innerHTML = commands.map((cmd, index) => `
            <div class="command-item" data-index="${index}">
                <span class="command-icon">${cmd.icon}</span>
                <span class="command-name">${cmd.name}</span>
            </div>
        `).join('');

        // Bind click events
        results.querySelectorAll('.command-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                commands[index].action();
                this.close();
            });
        });
    }
}

/* ============================================
   2. INTERACTIVE TIMELINE STORY MODE
   ============================================ */

class TimelineStoryMode {
    constructor() {
        this.currentChapter = 0;
        this.chapters = [
            {
                title: "The Beginning",
                year: "2022",
                content: "Started the journey at GGSIPU, diving into Electrical Engineering...",
                tech: ["Python", "C++", "Mathematics"],
                image: "journey-start.jpg"
            },
            {
                title: "First Code",
                year: "2023",
                content: "Discovered the magic of programming and web development...",
                tech: ["JavaScript", "HTML", "CSS", "React"],
                image: "first-code.jpg"
            },
            {
                title: "Building Real Solutions",
                year: "2024",
                content: "Created Karm platform and started solving real problems...",
                tech: ["Node.js", "MongoDB", "Full-Stack"],
                image: "karm-project.jpg"
            },
            {
                title: "Professional Growth",
                year: "2024-2025",
                content: "Joined Juspay as Product Solution Engineer...",
                tech: ["Payment Systems", "AI/ML", "Scale"],
                image: "juspay-journey.jpg"
            }
        ];
    }

    activate() {
        this.createTimelineHTML();
        this.showChapter(0);
    }

    createTimelineHTML() {
        const existing = document.getElementById('timeline-story-mode');
        if (existing) existing.remove();

        const timeline = document.createElement('div');
        timeline.id = 'timeline-story-mode';
        timeline.className = 'timeline-story-mode';
        timeline.innerHTML = `
            <div class="timeline-backdrop"></div>
            <div class="timeline-container">
                <div class="timeline-header">
                    <h2>My Journey</h2>
                    <button class="timeline-close">&times;</button>
                </div>
                <div class="timeline-content" id="timeline-content"></div>
                <div class="timeline-navigation">
                    <button class="timeline-nav prev" id="timeline-prev">← Previous</button>
                    <div class="timeline-dots" id="timeline-dots"></div>
                    <button class="timeline-nav next" id="timeline-next">Next →</button>
                </div>
            </div>
        `;
        document.body.appendChild(timeline);
        this.bindTimelineEvents();
        
        // Show timeline with animation
        setTimeout(() => {
            timeline.classList.add('active');
        }, 100);
    }

    bindTimelineEvents() {
        const close = document.querySelector('.timeline-close');
        const prev = document.getElementById('timeline-prev');
        const next = document.getElementById('timeline-next');

        close?.addEventListener('click', () => {
            const timeline = document.getElementById('timeline-story-mode');
            timeline.classList.remove('active');
            setTimeout(() => timeline.remove(), 500);
        });

        prev?.addEventListener('click', () => {
            if (this.currentChapter > 0) {
                this.showChapter(this.currentChapter - 1);
            }
        });

        next?.addEventListener('click', () => {
            if (this.currentChapter < this.chapters.length - 1) {
                this.showChapter(this.currentChapter + 1);
            }
        });
    }

    showChapter(index) {
        if (index < 0 || index >= this.chapters.length) return;
        
        this.currentChapter = index;
        const chapter = this.chapters[index];
        const content = document.getElementById('timeline-content');
        
        content.innerHTML = `
            <div class="chapter-content">
                <div class="chapter-year">${chapter.year}</div>
                <h3 class="chapter-title">${chapter.title}</h3>
                <p class="chapter-text">${chapter.content}</p>
                <div class="chapter-tech">
                    ${chapter.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
        `;

        this.updateNavigation();
        this.updateDots();
    }

    updateNavigation() {
        const prev = document.getElementById('timeline-prev');
        const next = document.getElementById('timeline-next');
        
        prev.disabled = this.currentChapter === 0;
        next.disabled = this.currentChapter === this.chapters.length - 1;
    }

    updateDots() {
        const dots = document.getElementById('timeline-dots');
        dots.innerHTML = this.chapters.map((_, index) => 
            `<div class="timeline-dot ${index === this.currentChapter ? 'active' : ''}" data-index="${index}"></div>`
        ).join('');

        dots.querySelectorAll('.timeline-dot').forEach((dot, index) => {
            dot.addEventListener('click', () => this.showChapter(index));
        });
    }
}

/* ============================================
   3. AI ASSISTANT CHATBOT
   ============================================ */

class AIAssistant {
    constructor() {
        this.isOpen = false;
        this.responses = {
            'hello': "Hi! I'm Ankit's AI assistant. I can help you learn more about his skills, projects, or experience!",
            'skills': "Ankit is skilled in JavaScript, React, Node.js, Python, AI/ML, and payment systems. Would you like to know more about any specific area?",
            'projects': "Some of Ankit's notable projects include Karm (job platform), SherlockAI (RAG system), and CRM platform for Xeno.ai. Which interests you?",
            'experience': "Ankit currently works as a Product Solution Engineer at Juspay, managing payment infrastructure for international merchants.",
            'contact': "You can reach Ankit at ankit6686510@gmail.com or connect via LinkedIn. Would you like me to open the contact form?",
            'resume': "I can help you download Ankit's resume. Should I open it for you?",
            'default': "That's an interesting question! You might want to contact Ankit directly for more specific information. Anything else I can help with?"
        };
    }

    activate() {
        if (!document.getElementById('ai-assistant')) {
            this.createAssistantHTML();
        }
        this.toggle();
    }

    createAssistantHTML() {
        const assistant = document.createElement('div');
        assistant.id = 'ai-assistant';
        assistant.className = 'ai-assistant hidden';
        assistant.innerHTML = `
            <div class="ai-assistant-container">
                <div class="ai-header">
                    <div class="ai-avatar">🤖</div>
                    <div class="ai-info">
                        <h4>Ankit's AI Assistant</h4>
                        <span class="ai-status">Online</span>
                    </div>
                    <button class="ai-close">&times;</button>
                </div>
                <div class="ai-chat" id="ai-chat">
                    <div class="ai-message">
                        <div class="ai-bubble">
                            Hi! I'm here to help you learn more about Ankit. Ask me about his skills, projects, or experience!
                        </div>
                    </div>
                </div>
                <div class="ai-input-container">
                    <input type="text" id="ai-input" placeholder="Ask me anything about Ankit...">
                    <button id="ai-send">Send</button>
                </div>
            </div>
        `;
        document.body.appendChild(assistant);
        this.bindAssistantEvents();
    }

    toggle() {
        const assistant = document.getElementById('ai-assistant');
        if (this.isOpen) {
            assistant.classList.add('hidden');
            this.isOpen = false;
        } else {
            assistant.classList.remove('hidden');
            this.isOpen = true;
            document.getElementById('ai-input')?.focus();
        }
    }

    bindAssistantEvents() {
        const input = document.getElementById('ai-input');
        const send = document.getElementById('ai-send');
        const close = document.querySelector('.ai-close');

        send?.addEventListener('click', () => this.sendMessage());
        input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        close?.addEventListener('click', () => this.toggle());
    }

    sendMessage() {
        const input = document.getElementById('ai-input');
        const message = input.value.trim().toLowerCase();
        if (!message) return;

        this.addMessage(input.value, 'user');
        input.value = '';

        setTimeout(() => {
            const response = this.getResponse(message);
            this.addMessage(response, 'ai');
        }, 1000);
    }

    addMessage(text, sender) {
        const chat = document.getElementById('ai-chat');
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender}`;
        messageDiv.innerHTML = `<div class="ai-bubble">${text}</div>`;
        chat.appendChild(messageDiv);
        chat.scrollTop = chat.scrollHeight;
    }

    getResponse(message) {
        for (const [key, response] of Object.entries(this.responses)) {
            if (message.includes(key)) {
                return response;
            }
        }
        return this.responses.default;
    }
}

/* ============================================
   4. 3D SKILLS CONSTELLATION
   ============================================ */

class SkillsConstellation {
    constructor() {
        this.skills = [
            { name: 'JavaScript', level: 95, category: 'language', x: 0, y: 0, z: 0 },
            { name: 'React', level: 90, category: 'frontend', x: 0, y: 0, z: 0 },
            { name: 'Node.js', level: 88, category: 'backend', x: 0, y: 0, z: 0 },
            { name: 'Python', level: 85, category: 'language', x: 0, y: 0, z: 0 },
            { name: 'MongoDB', level: 80, category: 'database', x: 0, y: 0, z: 0 },
            { name: 'TypeScript', level: 82, category: 'language', x: 0, y: 0, z: 0 },
            { name: 'AI/ML', level: 75, category: 'emerging', x: 0, y: 0, z: 0 },
            { name: 'AWS', level: 70, category: 'cloud', x: 0, y: 0, z: 0 }
        ];
    }

    activate() {
        this.createConstellationHTML();
        this.generatePositions();
        this.renderConstellation();
    }

    createConstellationHTML() {
        const existing = document.getElementById('skills-constellation');
        if (existing) existing.remove();

        const constellation = document.createElement('div');
        constellation.id = 'skills-constellation';
        constellation.className = 'skills-constellation';
        constellation.innerHTML = `
            <div class="constellation-backdrop"></div>
            <div class="constellation-container">
                <div class="constellation-header">
                    <h2>Skills Universe</h2>
                    <button class="constellation-close">&times;</button>
                </div>
                <div class="constellation-space" id="constellation-space"></div>
                <div class="constellation-info" id="constellation-info">
                    <p>Hover over stars to explore skills</p>
                </div>
            </div>
        `;
        document.body.appendChild(constellation);
        this.bindConstellationEvents();
        
        // Show constellation with animation
        setTimeout(() => {
            constellation.classList.add('active');
        }, 100);
    }

    bindConstellationEvents() {
        const close = document.querySelector('.constellation-close');

        close?.addEventListener('click', () => {
            const constellation = document.getElementById('skills-constellation');
            constellation.classList.remove('active');
            setTimeout(() => constellation.remove(), 500);
        });
    }

    generatePositions() {
        const radius = 200;
        this.skills.forEach((skill, index) => {
            const angle = (index / this.skills.length) * Math.PI * 2;
            const elevation = (Math.random() - 0.5) * Math.PI;
            
            skill.x = Math.cos(angle) * Math.cos(elevation) * radius;
            skill.y = Math.sin(elevation) * radius;
            skill.z = Math.sin(angle) * Math.cos(elevation) * radius;
        });
    }

    renderConstellation() {
        const space = document.getElementById('constellation-space');
        space.innerHTML = this.skills.map((skill, index) => `
            <div class="skill-star" 
                 data-skill="${skill.name}"
                 data-level="${skill.level}"
                 data-category="${skill.category}"
                 style="
                     left: ${50 + (skill.x / 400) * 100}%;
                     top: ${50 + (skill.y / 400) * 100}%;
                     transform: translateZ(${skill.z}px);
                     --glow-intensity: ${skill.level / 100};
                 ">
                <div class="star-core"></div>
                <div class="star-label">${skill.name}</div>
                <div class="star-level">${skill.level}%</div>
            </div>
        `).join('');

        this.bindStarEvents();
    }

    bindStarEvents() {
        const stars = document.querySelectorAll('.skill-star');
        const info = document.getElementById('constellation-info');

        stars.forEach(star => {
            star.addEventListener('mouseenter', () => {
                const skill = star.dataset.skill;
                const level = star.dataset.level;
                const category = star.dataset.category;
                
                info.innerHTML = `
                    <h4>${skill}</h4>
                    <p>Proficiency: ${level}%</p>
                    <p>Category: ${category}</p>
                `;
                
                star.classList.add('active');
            });

            star.addEventListener('mouseleave', () => {
                info.innerHTML = '<p>Hover over stars to explore skills</p>';
                star.classList.remove('active');
            });
        });
    }
}

/* ============================================
   5. HACKER TERMINAL MODE
   ============================================ */

class HackerMode {
    constructor() {
        this.commands = {
            'help': 'Available commands: about, skills, projects, contact, clear, matrix, github',
            'about': 'Ankit Jha - Product Solution Engineer at Juspay. Full-stack developer with expertise in React, Node.js, and AI systems.',
            'skills': 'Core: JavaScript, React, Node.js, Python, MongoDB\nEmerging: AI/ML, Payment Systems, TypeScript',
            'projects': 'Featured: Karm (Job Platform), SherlockAI (RAG System), CRM Platform',
            'contact': 'Email: ankit6686510@gmail.com\nLinkedIn: /in/ankiitjhaa\nGitHub: /ankit6686510',
            'github': () => window.open('https://github.com/ankit6686510', '_blank'),
            'matrix': () => this.startMatrixEffect(),
            'clear': () => this.clearTerminal()
        };
        this.history = [];
    }

    activate() {
        this.createTerminalHTML();
        this.startTerminal();
    }

    createTerminalHTML() {
        const existing = document.getElementById('hacker-mode');
        if (existing) existing.remove();

        const terminal = document.createElement('div');
        terminal.id = 'hacker-mode';
        terminal.className = 'hacker-mode';
        terminal.innerHTML = `
            <div class="terminal-window">
                <div class="terminal-header">
                    <div class="terminal-controls">
                        <span class="terminal-btn close"></span>
                        <span class="terminal-btn minimize"></span>
                        <span class="terminal-btn maximize"></span>
                    </div>
                    <div class="terminal-title">ankit@portfolio:~$</div>
                </div>
                <div class="terminal-body" id="terminal-body">
                    <div class="terminal-line">
                        <span class="terminal-prompt">ankit@portfolio:~$</span>
                        <span class="terminal-text">Welcome to Ankit's Portfolio Terminal</span>
                    </div>
                    <div class="terminal-line">
                        <span class="terminal-prompt">ankit@portfolio:~$</span>
                        <span class="terminal-text">Type 'help' for available commands</span>
                    </div>
                </div>
                <div class="terminal-input-line">
                    <span class="terminal-prompt">ankit@portfolio:~$</span>
                    <input type="text" id="terminal-input" class="terminal-input" autofocus>
                </div>
            </div>
        `;
        document.body.appendChild(terminal);
        this.bindTerminalEvents();
        
        // Show terminal with animation
        setTimeout(() => {
            terminal.classList.add('active');
        }, 100);
    }

    startTerminal() {
        // Terminal is already started when created
    }

    bindTerminalEvents() {
        const input = document.getElementById('terminal-input');
        const close = document.querySelector('.terminal-btn.close');

        input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.executeCommand(input.value);
                input.value = '';
            }
        });

        close?.addEventListener('click', () => {
            document.getElementById('hacker-mode')?.remove();
        });
    }

    executeCommand(cmd) {
        const body = document.getElementById('terminal-body');
        const command = cmd.toLowerCase().trim();
        
        // Add command to terminal
        const cmdLine = document.createElement('div');
        cmdLine.className = 'terminal-line';
        cmdLine.innerHTML = `
            <span class="terminal-prompt">ankit@portfolio:~$</span>
            <span class="terminal-text">${cmd}</span>
        `;
        body.appendChild(cmdLine);

        // Execute command
        let output = '';
        if (typeof this.commands[command] === 'function') {
            this.commands[command]();
        } else if (this.commands[command]) {
            output = this.commands[command];
        } else {
            output = `Command not found: ${cmd}. Type 'help' for available commands.`;
        }

        if (output) {
            const outputLine = document.createElement('div');
            outputLine.className = 'terminal-line output';
            outputLine.innerHTML = `<span class="terminal-text">${output}</span>`;
            body.appendChild(outputLine);
        }

        body.scrollTop = body.scrollHeight;
    }

    clearTerminal() {
        const body = document.getElementById('terminal-body');
        body.innerHTML = `
            <div class="terminal-line">
                <span class="terminal-prompt">ankit@portfolio:~$</span>
                <span class="terminal-text">Terminal cleared</span>
            </div>
        `;
    }
}

/* ============================================
   6. FLOATING RESUME PANEL
   ============================================ */

class FloatingResumePanel {
    constructor() {
        this.isOpen = false;
        this.resumeData = {
            basics: {
                name: "Ankit Kumar Jha",
                title: "Product Solution Engineer",
                email: "ankit6686510@gmail.com",
                location: "Delhi, India"
            },
            experience: [
                {
                    company: "Juspay",
                    position: "Product Solution Engineer",
                    duration: "July 2025 - Present",
                    highlights: ["Payment infrastructure", "International merchants", "Production issues"]
                }
            ],
            skills: ["JavaScript", "React", "Node.js", "Python", "AI/ML"],
            projects: ["Karm Platform", "SherlockAI", "CRM System"]
        };
    }

    activate() {
        this.createPanelHTML();
        this.toggle();
    }

    createPanelHTML() {
        if (document.getElementById('floating-resume')) return;

        const panel = document.createElement('div');
        panel.id = 'floating-resume';
        panel.className = 'floating-resume hidden';
        panel.innerHTML = `
            <div class="resume-panel">
                <div class="resume-header">
                    <h3>Interactive Resume</h3>
                    <div class="resume-controls">
                        <button class="resume-download" title="Download PDF">📄</button>
                        <button class="resume-close">&times;</button>
                    </div>
                </div>
                <div class="resume-content" id="resume-content">
                    ${this.generateResumeHTML()}
                </div>
            </div>
        `;
        document.body.appendChild(panel);
        this.bindPanelEvents();
    }

    bindPanelEvents() {
        const downloadBtn = document.querySelector('.resume-download');
        const closeBtn = document.querySelector('.resume-close');

        downloadBtn?.addEventListener('click', () => {
            window.downloadResume();
        });

        closeBtn?.addEventListener('click', () => {
            this.toggle();
        });
    }

    generateResumeHTML() {
        return `
            <div class="resume-section">
                <h4>Contact</h4>
                <div class="resume-item">
                    <strong>${this.resumeData.basics.name}</strong><br>
                    ${this.resumeData.basics.title}<br>
                    ${this.resumeData.basics.email}<br>
                    ${this.resumeData.basics.location}
                </div>
            </div>
            <div class="resume-section">
                <h4>Experience</h4>
                ${this.resumeData.experience.map(exp => `
                    <div class="resume-item">
                        <strong>${exp.position}</strong> at ${exp.company}<br>
                        <em>${exp.duration}</em><br>
                        <ul>
                            ${exp.highlights.map(h => `<li>${h}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
            <div class="resume-section">
                <h4>Skills</h4>
                <div class="resume-skills">
                    ${this.resumeData.skills.map(skill => `<span class="resume-skill">${skill}</span>`).join('')}
                </div>
            </div>
        `;
    }

    toggle() {
        const panel = document.getElementById('floating-resume');
        if (this.isOpen) {
            panel.classList.add('hidden');
            this.isOpen = false;
        } else {
            panel.classList.remove('hidden');
            this.isOpen = true;
        }
    }
}

/* ============================================
   7. INITIALIZATION
   ============================================ */

// Initialize all systems when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create instances
    window.commandPalette = new CommandPalette();
    window.timelineMode = new TimelineStoryMode();
    window.aiAssistant = new AIAssistant();
    window.skillsConstellation = new SkillsConstellation();
    window.hackerMode = new HackerMode();
    window.resumePanel = new FloatingResumePanel();

    // Add global methods to window for command palette access
    window.navigateToSection = (sectionId) => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    };

    window.downloadResume = () => {
        const link = document.createElement('a');
        link.href = 'Resume.pdf';
        link.download = 'Ankit_Jha_Resume.pdf';
        link.click();
    };

    window.toggleTheme = () => {
        document.body.classList.toggle('dark-theme');
    };

    window.activateTimelineMode = () => window.timelineMode.activate();
    window.activateHackerMode = () => window.hackerMode.activate();
    window.showSkillsConstellation = () => window.skillsConstellation.activate();
    window.toggleAIAssistant = () => window.aiAssistant.activate();

    // Add floating action button for quick access
    const fab = document.createElement('div');
    fab.className = 'floating-action-button';
    fab.innerHTML = '⌘';
    fab.title = 'Press Ctrl+K for command palette';
    fab.addEventListener('click', () => window.commandPalette.toggle());
    document.body.appendChild(fab);

    console.log('🚀 Next-gen portfolio features loaded!');
    console.log('💡 Press Ctrl+K to open command palette');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CommandPalette,
        TimelineStoryMode,
        AIAssistant,
        SkillsConstellation,
        HackerMode,
        FloatingResumePanel
    };
}
