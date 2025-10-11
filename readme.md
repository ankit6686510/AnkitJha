# 🚀 Ankit's Portfolio Website

A modern, responsive portfolio website showcasing my skills as a Full Stack Developer. Built with HTML5, CSS3, and JavaScript with a focus on user experience and performance.

## 🌟 Features

- **Responsive Design**: Optimized for all devices and screen sizes
- **Dark/Light Mode**: Toggle between themes with smooth transitions
- **Interactive Animations**: Smooth scrolling and engaging animations using AOS library
- **Dynamic Typing Effect**: Animated text using Typed.js
- **Portfolio Filtering**: Filter projects by category
- **Coding Challenges**: Showcase of algorithmic problem-solving skills
- **Blog Section**: Technical articles and tutorials
- **Contact Form**: Integrated contact form with Google Sheets
- **Particle Background**: Interactive particle system for visual appeal

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Libraries**: 
  - [Typed.js](https://github.com/mattboldt/typed.js/) - Typing animations
  - [AOS](https://michalsnik.github.io/aos/) - Animate on scroll
  - [Particles.js](https://vincentgarreau.com/particles.js/) - Interactive particles
  - [Font Awesome](https://fontawesome.com/) - Icons
- **Fonts**: [Poppins](https://fonts.google.com/specimen/Poppins) from Google Fonts
- **Deployment**: GitHub Pages / Netlify

## 📁 Project Structure

```
AnkitJha/
├── index.html              # Main HTML file
├── style.css               # Primary stylesheet
├── responsive.css          # Responsive design styles
├── script.js               # Main JavaScript functionality
├── scripts.js              # Additional scripts
├── data/
│   ├── blogs.json          # Blog posts data
│   └── challenges.json     # Coding challenges data
├── assets/
│   ├── images/             # Profile and project images
│   ├── icons/              # Favicons and icons
│   └── documents/          # Resume and other documents
└── README.md               # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser
- Basic understanding of HTML, CSS, and JavaScript (for modifications)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ankit6686510/AnkitJha.git
   cd AnkitJha
   ```

2. **Open in browser**
   ```bash
   # For development
   open index.html
   
   # Or use a local server (recommended)
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

3. **For development with live reload**
   ```bash
   # Using VS Code Live Server extension
   # Right-click on index.html and select "Open with Live Server"
   ```

## ⚙️ Customization

### Personal Information
Update the following files with your information:
- `index.html` - Personal details, social links, contact information
- `data/blogs.json` - Your blog posts and articles
- `data/challenges.json` - Your coding challenges and solutions

### Styling
- `style.css` - Main styling and color scheme
- `responsive.css` - Mobile and tablet responsive styles
- CSS custom properties in `:root` for easy theme customization

### Content Sections
1. **Header**: Hero section with introduction and CTA buttons
2. **About**: Personal story, skills, experience, and education
3. **Services**: What you offer (Frontend, Backend, API Integration)
4. **Portfolio**: Showcase of projects with filtering
5. **Testimonials**: Client feedback and recommendations
6. **Blog**: Technical articles and tutorials
7. **Challenges**: Coding problem solutions from various platforms
8. **Contact**: Contact form and social media links

## 📱 Responsive Design

The website is fully responsive and tested on:
- ✅ Desktop (1920px and above)
- ✅ Laptop (1366px - 1919px)
- ✅ Tablet (768px - 1365px)
- ✅ Mobile (320px - 767px)

## 🎨 Color Scheme

```css
:root {
  --primary-color: #ff004f;      /* Pink accent */
  --secondary-color: #00c8ff;    /* Blue accent */
  --dark-bg: #121212;            /* Dark background */
  --light-bg: #f5f5f7;           /* Light background */
  --text-dark: #fff;             /* Dark mode text */
  --text-light: #333;            /* Light mode text */
}
```

## 🔧 Contact Form Setup

The contact form integrates with Google Sheets. To set it up:

1. Create a Google Apps Script with the provided webhook
2. Update the `scriptURL` in `script.js`
3. Deploy the script and get the web app URL
4. Test the form submission

## 📊 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🌐 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 60+
- ✅ Safari 12+
- ✅ Edge 79+

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Contact

**Ankit Jha**
- 📧 Email: ankit6686510@gmail.com
- 💼 LinkedIn: [ankiitjhaa](https://www.linkedin.com/in/ankiitjhaa/)
- 🐙 GitHub: [ankit6686510](https://github.com/ankit6686510)
- 🌐 Portfolio: [Live Demo](https://ankit6686510.github.io/AnkitJha/)

## 🙏 Acknowledgments

- Design inspiration from modern portfolio trends
- Icons by [Font Awesome](https://fontawesome.com/)
- Fonts by [Google Fonts](https://fonts.google.com/)
- Background patterns and animations from various open-source libraries

---

⭐ **If you like this project, please give it a star!** ⭐
