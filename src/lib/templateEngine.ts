import fs from 'fs'
import path from 'path'
import { TemplateData, TemplateProject } from '@/types/templates'

// Template cache to avoid file system reads
const templateCache = new Map<string, string>()

export function formatUserDataForTemplate(userData: any, repos: any[], selectedRepos: string[]): TemplateData {
  // Seçilen repoları filtrele
  const selectedRepoObjects = repos.filter(repo => 
    selectedRepos.includes(repo.name)
  )

  // Toplam yıldız sayısını hesapla
  const totalStars = selectedRepoObjects.reduce((sum, repo) => sum + repo.stargazers_count, 0)

  // Deneyim yılını hesapla (en eski repo'nun yaşına göre)
  const oldestRepo = selectedRepoObjects.reduce((oldest, repo) => {
    const repoDate = new Date(repo.created_at)
    const oldestDate = new Date(oldest.created_at)
    return repoDate < oldestDate ? repo : oldest
  }, selectedRepoObjects[0])

  const yearsExperience = oldestRepo 
    ? Math.max(1, new Date().getFullYear() - new Date(oldestRepo.created_at).getFullYear())
    : 3

  return {
    USER_NAME: userData.name || userData.login,
    USER_BIO: userData.bio || 'Passionate software developer',
    USER_AVATAR: userData.avatar_url || '',
    USER_EMAIL: userData.email || '',
    GITHUB_URL: userData.html_url || '',
    LINKEDIN_URL: '#', // Mock LinkedIn URL
    CV_URL: '#', // Will be overridden if provided
    TOTAL_REPOS: userData.public_repos || repos.length,
    TOTAL_STARS: totalStars,
    YEARS_EXPERIENCE: yearsExperience,
    projects: selectedRepoObjects.map(repo => ({
      PROJECT_NAME: repo.name,
      PROJECT_DESCRIPTION: repo.description || 'No description available',
      PROJECT_URL: repo.html_url,
      PROJECT_DEMO: repo.homepage,
      PROJECT_LANGUAGE: repo.language || 'Unknown',
      PROJECT_STARS: repo.stargazers_count,
      PROJECT_FORKS: repo.forks_count,
      topics: repo.topics || []
    }))
  }
}

export function renderTemplate(templateName: string, data: TemplateData): string {
  try {
    // Template cache'den oku veya dosyadan yükle
    let template = templateCache.get(templateName)
    if (!template) {
      console.log('📋 Loading template from file:', templateName)
      const templatePath = path.join(process.cwd(), 'public', 'templates', templateName, 'index.html')
      template = fs.readFileSync(templatePath, 'utf-8')
      templateCache.set(templateName, template)
    } else {
      console.log('📋 Using cached template:', templateName)
    }

    // Template değişkenlerini değiştir - optimize edilmiş tek geçiş
    let renderedTemplate = template
      .replace(/{{USER_NAME}}/g, data.USER_NAME)
      .replace(/{{USER_BIO}}/g, data.USER_BIO)
      .replace(/{{USER_AVATAR}}/g, data.USER_AVATAR)
      .replace(/{{USER_EMAIL}}/g, data.USER_EMAIL)
      .replace(/{{GITHUB_URL}}/g, data.GITHUB_URL)
      .replace(/{{TOTAL_REPOS}}/g, data.TOTAL_REPOS.toString())
      .replace(/{{TOTAL_STARS}}/g, data.TOTAL_STARS.toString())
      .replace(/{{YEARS_EXPERIENCE}}/g, (data.YEARS_EXPERIENCE || 3).toString())
      .replace(/{{CV_URL}}/g, data.CV_URL || '#')
      .replace(/{{LINKEDIN_URL}}/g, data.LINKEDIN_URL || '#')

    // Projeler için dinamik içerik oluştur - daha basit ve hızlı
    if (data.projects && data.projects.length > 0) {
      // HTML projects section'ını bul ve değiştir
      let projectsHtml = ''
      data.projects.forEach(project => {
        projectsHtml += `
          <div class="project-card fade-in">
            <div class="project-header">
              <div class="project-icon">
                <i class="fas fa-code"></i>
              </div>
              <h3 class="project-title">${project.PROJECT_NAME}</h3>
            </div>
            <p class="project-description">${project.PROJECT_DESCRIPTION}</p>
            <div class="project-tech">
              <span class="tech-tag">${project.PROJECT_LANGUAGE}</span>
              ${project.topics.slice(0, 3).map(topic => `<span class="tech-tag">${topic}</span>`).join('')}
            </div>
            <div class="project-links">
              <a href="${project.PROJECT_URL}" target="_blank" class="project-link link-github">
                <i class="fab fa-github"></i> GitHub
              </a>
              ${project.PROJECT_DEMO ? `<a href="${project.PROJECT_DEMO}" target="_blank" class="project-link link-demo">
                <i class="fas fa-external-link-alt"></i> Demo
              </a>` : ''}
            </div>
          </div>
        `
      })
      
      // Replace projects grid content - multiple fallback patterns
      if (renderedTemplate.includes('<!-- Bu bölüm dinamik olarak doldurulacak -->')) {
        renderedTemplate = renderedTemplate.replace(
          /<div class="projects-grid">\s*<!-- Bu bölüm dinamik olarak doldurulacak -->\s*<\/div>/g,
          `<div class="projects-grid">${projectsHtml}</div>`
        )
      } else if (renderedTemplate.includes('projects-grid')) {
        // Fallback: just find any projects-grid div and inject content
        renderedTemplate = renderedTemplate.replace(
          /<div class="projects-grid"[^>]*>[\s\S]*?<\/div>/g,
          `<div class="projects-grid">${projectsHtml}</div>`
        )
      } else {
        // Last resort: inject before skills section
        const skillsSection = renderedTemplate.indexOf('<section id="skills"')
        if (skillsSection !== -1) {
          const projectsSection = `
            <section id="projects" class="projects">
              <div class="container">
                <div class="section-title fade-in">
                  <h2>Projelerim</h2>
                  <p class="section-subtitle">Yaratıcılık ve teknolojiyi birleştiren çalışmalarım</p>
                </div>
                <div class="projects-grid">${projectsHtml}</div>
              </div>
            </section>
          `
          renderedTemplate = renderedTemplate.slice(0, skillsSection) + projectsSection + renderedTemplate.slice(skillsSection)
        }
      }
    }

    console.log('✅ Template rendered successfully, length:', renderedTemplate.length)
    return renderedTemplate

  } catch (error) {
    console.error('❌ Template rendering error:', error)
    return `
      <html>
        <head><title>Template Error</title></head>
        <body>
          <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
            <h1 style="color: red;">Template Rendering Error</h1>
            <p>Template could not be rendered. Please try again later.</p>
            <p style="color: gray; font-size: 12px;">Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
          </div>
        </body>
      </html>
    `
  }
} 