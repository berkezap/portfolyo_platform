import React from 'react'
import { TemplateProps } from '@/types/templates'

export function ModernDeveloper({ data }: TemplateProps) {
  return (
    <>
      <style jsx>{`
        :root {
          --bg-color: #ffffff;
          --text-color: #1a202c;
          --text-secondary: #718096;
          --border-color: #e2e8f0;
          --card-bg: #ffffff;
          --accent-color: #3182ce;
          --gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        [data-theme="dark"] {
          --bg-color: #0d1117;
          --text-color: #c9d1d9;
          --text-secondary: #8b949e;
          --border-color: #30363d;
          --card-bg: #161b22;
          --accent-color: #58a6ff;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', sans-serif;
          background-color: var(--bg-color);
          color: var(--text-color);
          line-height: 1.6;
          transition: all 0.3s ease;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Header */
        .header {
          padding: 2rem 0;
          border-bottom: 1px solid var(--border-color);
          position: sticky;
          top: 0;
          background-color: var(--bg-color);
          z-index: 100;
          backdrop-filter: blur(10px);
        }

        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--accent-color);
        }

        .nav-links {
          display: flex;
          gap: 2rem;
          list-style: none;
        }

        .nav-links a {
          color: var(--text-color);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .nav-links a:hover {
          color: var(--accent-color);
        }

        .theme-toggle {
          background: none;
          border: 1px solid var(--border-color);
          color: var(--text-color);
          padding: 0.5rem;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .theme-toggle:hover {
          background-color: var(--accent-color);
          color: white;
        }

        /* Hero Section */
        .hero {
          padding: 6rem 0;
          text-align: center;
        }

        .hero-content h1 {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--text-color);
        }

        .hero-content .subtitle {
          font-size: 1.25rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn {
          padding: 0.75rem 2rem;
          border-radius: 0.5rem;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary {
          background: var(--gradient);
          color: white;
        }

        .btn-secondary {
          border: 2px solid var(--border-color);
          color: var(--text-color);
        }

        .btn:hover {
          opacity: 0.9;
        }

        /* About Section */
        .about {
          padding: 6rem 0;
          background-color: var(--card-bg);
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 3rem;
        }

        .about-content {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 4rem;
          align-items: center;
        }

        .about-image {
          text-align: center;
        }

        .profile-img {
          width: 250px;
          height: 250px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid var(--accent-color);
        }

        .about-text p {
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
          color: var(--text-secondary);
        }

        /* Projects Section */
        .projects {
          padding: 6rem 0;
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .project-card {
          background: var(--card-bg);
          border: 1px solid var(--border-color);
          border-radius: 1rem;
          padding: 2rem;
          transition: all 0.3s ease;
        }

        .project-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 1rem;
        }

        .project-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--accent-color);
        }

        .project-links {
          display: flex;
          gap: 0.5rem;
        }

        .project-links a {
          color: var(--text-secondary);
          font-size: 1.2rem;
          transition: color 0.3s ease;
        }

        .project-links a:hover {
          color: var(--accent-color);
        }

        .project-description {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        .project-tech {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .tech-tag {
          background: var(--accent-color);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .project-stats {
          display: flex;
          gap: 1rem;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        /* Skills Section */
        .skills {
          padding: 6rem 0;
          background-color: var(--card-bg);
        }

        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .skill-category {
          text-align: center;
          padding: 2rem;
          border: 1px solid var(--border-color);
          border-radius: 1rem;
          transition: all 0.3s ease;
        }

        .skill-category:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .skill-icon {
          font-size: 3rem;
          color: var(--accent-color);
          margin-bottom: 1rem;
        }

        .skill-category h3 {
          margin-bottom: 1rem;
        }

        /* Contact Section */
        .contact {
          padding: 6rem 0;
          text-align: center;
        }

        .contact-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .contact-links {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-top: 2rem;
        }

        .contact-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-color);
          text-decoration: none;
          padding: 1rem 2rem;
          border: 1px solid var(--border-color);
          border-radius: 0.5rem;
          transition: all 0.3s ease;
        }

        .contact-link:hover {
          background: var(--accent-color);
          color: white;
        }

        /* Footer */
        .footer {
          padding: 2rem 0;
          border-top: 1px solid var(--border-color);
          text-align: center;
          color: var(--text-secondary);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }

          .hero-content h1 {
            font-size: 2.5rem;
          }

          .about-content {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .contact-links {
            flex-direction: column;
            align-items: center;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>

      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      <body>
        {/* Header */}
        <header className="header">
          <nav className="nav container">
            <div className="logo">{data.USER_NAME}</div>
            <ul className="nav-links">
              <li><a href="#about">Hakkımda</a></li>
              <li><a href="#projects">Projeler</a></li>
              <li><a href="#skills">Yetenekler</a></li>
              <li><a href="#contact">İletişim</a></li>
            </ul>
            <button className="theme-toggle" onClick={() => {
              const body = document.body;
              const themeToggle = document.querySelector('.theme-toggle i');
              
              if (body.getAttribute('data-theme') === 'dark') {
                body.removeAttribute('data-theme');
                if (themeToggle) themeToggle.className = 'fas fa-moon';
                localStorage.setItem('theme', 'light');
              } else {
                body.setAttribute('data-theme', 'dark');
                if (themeToggle) themeToggle.className = 'fas fa-sun';
                localStorage.setItem('theme', 'dark');
              }
            }}>
              <i className="fas fa-moon"></i>
            </button>
          </nav>
        </header>

        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <h1>{data.USER_NAME}</h1>
              <p className="subtitle">{data.USER_BIO}</p>
              <div className="cta-buttons">
                <a href="#projects" className="btn btn-primary">
                  <i className="fas fa-code"></i> Projelerimi Gör
                </a>
                <a href={data.CV_URL} className="btn btn-secondary" download>
                  <i className="fas fa-download"></i> CV İndir
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="about" id="about">
          <div className="container">
            <h2 className="section-title">Hakkımda</h2>
            <div className="about-content">
              <div className="about-image">
                <img src={data.USER_AVATAR} alt={data.USER_NAME} className="profile-img" />
              </div>
              <div className="about-text">
                <p>{data.USER_BIO}</p>
                <p>{data.TOTAL_REPOS} adet açık kaynak projem ve {data.TOTAL_STARS} GitHub yıldızım ile yazılım geliştirme alanında aktif olarak çalışmaya devam ediyorum.</p>
                <p>Modern web teknolojileri, clean code prensipleri ve kullanıcı deneyimi odaklı geliştirme yaklaşımlarını benimserim.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="projects" id="projects">
          <div className="container">
            <h2 className="section-title">Projelerim</h2>
            <div className="projects-grid">
              {data.projects.map((project, index) => (
                <div key={index} className="project-card">
                  <div className="project-header">
                    <h3 className="project-title">{project.PROJECT_NAME}</h3>
                    <div className="project-links">
                      <a href={project.PROJECT_URL} target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-github"></i>
                      </a>
                      {project.PROJECT_DEMO && (
                        <a href={project.PROJECT_DEMO} target="_blank" rel="noopener noreferrer">
                          <i className="fas fa-external-link-alt"></i>
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="project-description">{project.PROJECT_DESCRIPTION}</p>
                  <div className="project-tech">
                    {project.topics.map((topic, topicIndex) => (
                      <span key={topicIndex} className="tech-tag">{topic}</span>
                    ))}
                  </div>
                  <div className="project-stats">
                    <span><i className="fas fa-star"></i> {project.PROJECT_STARS}</span>
                    <span><i className="fas fa-code-branch"></i> {project.PROJECT_FORKS}</span>
                    <span><i className="fas fa-circle"></i> {project.PROJECT_LANGUAGE}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="skills" id="skills">
          <div className="container">
            <h2 className="section-title">Yeteneklerim</h2>
            <div className="skills-grid">
              <div className="skill-category">
                <div className="skill-icon">
                  <i className="fab fa-js-square"></i>
                </div>
                <h3>Frontend</h3>
                <p>React, Vue.js, TypeScript, Modern CSS, Responsive Design</p>
              </div>
              <div className="skill-category">
                <div className="skill-icon">
                  <i className="fas fa-server"></i>
                </div>
                <h3>Backend</h3>
                <p>Node.js, Python, API Design, Veritabanları, Cloud Services</p>
              </div>
              <div className="skill-category">
                <div className="skill-icon">
                  <i className="fas fa-tools"></i>
                </div>
                <h3>Araçlar</h3>
                <p>Git, Docker, CI/CD, Testing, Performance Optimization</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact" id="contact">
          <div className="container">
            <div className="contact-content">
              <h2 className="section-title">İletişim</h2>
              <p>Projeler hakkında konuşmak, iş birliği yapmak veya sadece merhaba demek isterseniz benimle iletişime geçin!</p>
              <div className="contact-links">
                <a href={`mailto:${data.USER_EMAIL}`} className="contact-link">
                  <i className="fas fa-envelope"></i> E-posta
                </a>
                <a href={data.GITHUB_URL} target="_blank" rel="noopener noreferrer" className="contact-link">
                  <i className="fab fa-github"></i> GitHub
                </a>
                <a href={data.LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="contact-link">
                  <i className="fab fa-linkedin"></i> LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <p>&copy; 2024 {data.USER_NAME}. Tüm hakları saklıdır. PortfolYO ile oluşturuldu.</p>
          </div>
        </footer>

        <script dangerouslySetInnerHTML={{
          __html: `
            // Load saved theme
            document.addEventListener('DOMContentLoaded', function() {
              const savedTheme = localStorage.getItem('theme');
              const themeToggle = document.querySelector('.theme-toggle i');
              
              if (savedTheme === 'dark') {
                document.body.setAttribute('data-theme', 'dark');
                if (themeToggle) themeToggle.className = 'fas fa-sun';
              }
            });

            // Smooth scrolling
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
              anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                  target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                  });
                }
              });
            });
          `
        }} />
      </body>
    </>
  )
} 