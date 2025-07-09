import 'server-only'
import fs from 'fs'
import path from 'path'
import { TemplateData, TemplateProject } from '../types/templates'

// Template engine: HTML template'lerini string replacement ile render eder
export function renderTemplate(templateName: string, data: TemplateData): string {
  console.log('🎨 renderTemplate başladı')
  console.log('📊 Template data özeti:', {
    USER_NAME: data.USER_NAME,
    projectCount: data.projects?.length || 0,
    TOTAL_STARS: data.TOTAL_STARS
  })
  
  // HTML template dosyasını oku
  const templatePath = path.join(process.cwd(), 'public', 'templates', templateName, 'index.html')
  
  if (!fs.existsSync(templatePath)) {
    console.log('⚠️ Template bulunamadı:', templatePath)
    throw new Error(`Template not found: ${templateName}`)
  }
  
  let htmlContent = fs.readFileSync(templatePath, 'utf-8')
  console.log('🧪 Template içeriği ilk 500 karakter:', htmlContent.substring(0, 500))
  
  // Tüm template data key'lerini logla
  console.log('🧪 Template data keys:', Object.keys(data))
  
  // Basit placeholder değiştirme
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'projects') return; // Projects ayrı işlenecek
    
    if (typeof value === 'string' || typeof value === 'number') {
      const placeholder = `{{${key}}}`;
      htmlContent = htmlContent.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), String(value));
    }
  })
  
  // Projects döngüsü işle
  console.log('🔧 PROJECTS döngüsü bulundu')
  const projectsStartMarker = '{{PROJECTS_START}}'
  const projectsEndMarker = '{{PROJECTS_END}}'
  
  const projectsStart = htmlContent.indexOf(projectsStartMarker)
  const projectsEnd = htmlContent.indexOf(projectsEndMarker)
  
  if (projectsStart !== -1 && projectsEnd !== -1) {
    console.log('🔧 Projects döngüsü başladı, proje sayısı:', data.projects.length)
    
    const projectTemplate = htmlContent.substring(
      projectsStart + projectsStartMarker.length,
      projectsEnd
    )
    
    let projectsHtml = ''
    data.projects.forEach((project: TemplateProject) => {
      let projectHtml = projectTemplate
      
      // Project verilerini değiştir
      Object.entries(project).forEach(([key, value]) => {
        if (key === 'topics') {
          // Teknoloji etiketleri için döngü
          const techStartMarker = '{{TECH_TAGS_START}}'
          const techEndMarker = '{{TECH_TAGS_END}}'
          
          const techStart = projectHtml.indexOf(techStartMarker)
          const techEnd = projectHtml.indexOf(techEndMarker)
          
          if (techStart !== -1 && techEnd !== -1 && Array.isArray(value)) {
            const techTemplate = projectHtml.substring(
              techStart + techStartMarker.length,
              techEnd
            )
            
            let techHtml = ''
            value.forEach(tech => {
              let techItemHtml = techTemplate
              techItemHtml = techItemHtml.replace(/\{\{TECH_NAME\}\}/g, tech)
              techHtml += techItemHtml
            })
            
            projectHtml = projectHtml.substring(0, techStart) + 
                         techHtml + 
                         projectHtml.substring(techEnd + techEndMarker.length)
          }
        } else if (typeof value === 'string' || typeof value === 'number') {
          const placeholder = `{{${key}}}`
          projectHtml = projectHtml.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), String(value))
        }
      })
      
      // Koşullu rendering: {{#KEY}}...{{/KEY}}
      const conditionalRegex = /\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g
      projectHtml = projectHtml.replace(conditionalRegex, (match, key, content) => {
        return project[key as keyof TemplateProject] ? content : ''
      })
      
      projectsHtml += projectHtml
    })
    
    htmlContent = htmlContent.substring(0, projectsStart) + 
                 projectsHtml + 
                 htmlContent.substring(projectsEnd + projectsEndMarker.length)
  }
  
  // Kalan placeholder'ları say
  const remainingPlaceholders = (htmlContent.match(/\{\{[^}]+\}\}/g) || []).length
  console.log('✅ renderTemplate tamamlandı, placeholder sayısı:', remainingPlaceholders)
  
  console.log('✅ Template render tamamlandı, HTML uzunluğu:', htmlContent.length)
  console.log('🧪 Render sonrası ilk 500 karakter:', htmlContent.substring(0, 500))
  
  return htmlContent
}

// Kullanıcı verilerini portfolyo template için formatla
export function formatUserDataForTemplate(userData: any, repos: any[], selectedRepos?: string[]): TemplateData {
  console.log('🔧 Template Debug - Toplam repo sayısı:', repos.length);
  console.log('🔧 Template Debug - İlk 3 repo:', repos.slice(0, 3));
  console.log('🔧 Template Debug - Seçilen repo listesi:', selectedRepos);

  let topRepos: any[] = [];

  if (selectedRepos && selectedRepos.length > 0) {
    // Kullanıcının seçtiği repoları filtrele
    console.log('✅ Kullanıcı seçimli repo listesi kullanılıyor');
    topRepos = repos.filter(repo => selectedRepos.includes(repo.name));
    console.log('🔧 Template Debug - Seçilen repolardan bulunanlar:', topRepos.map(r => r.name));
  } else {
    // Seçim yoksa, en popüler repoları seç
    console.log('⚠️ Seçilen repo listesi yok, otomatik seçim yapılıyor');
    topRepos = repos
      .filter(repo => !repo.fork && repo.name) // Sadece ismi olan ve fork olmayan repoları al
      .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
      .slice(0, 6);

    // Eğer hiç repo yoksa, fork'ları da dahil et
    if (topRepos.length === 0) {
      console.log('⚠️ Fork olmayan repo yok, tüm repoları dahil ediyoruz...')
      const allRepos = repos
        .filter(repo => repo.name) // Sadece ismi olan
        .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
        .slice(0, 6);
      topRepos.push(...allRepos);
    }
  }

  console.log('🔧 Template Debug - Seçilen repo sayısı:', topRepos.length);
  console.log('🔧 Template Debug - Seçilen repolar:', topRepos.map(r => r.name));

  // Toplam istatistikler
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalRepos = repos.length;

  return {
    // Kullanıcı bilgileri
    USER_NAME: userData.name || userData.login || 'Developer',
    USER_BIO: userData.bio || 'Passionate software developer creating amazing projects.',
    USER_AVATAR: userData.avatar_url || '/default-avatar.png',
    USER_EMAIL: userData.email || 'contact@example.com',
    USER_PHONE: '+90 555 123 45 67', // Varsayılan telefon
    USER_LOCATION: 'Istanbul, Turkey', // Varsayılan konum
    GITHUB_URL: userData.html_url || '#',
    LINKEDIN_URL: '#', // Bu sonra kullanıcıdan alınabilir
    CV_URL: '#', // Bu sonra CV upload'dan gelecek
    
    // İstatistikler ve deneyim
    TOTAL_REPOS: totalRepos,
    TOTAL_STARS: totalStars,
    YEARS_EXPERIENCE: Math.max(3, Math.floor((Date.now() - new Date(userData.created_at || '2020-01-01').getTime()) / (1000 * 60 * 60 * 24 * 365))), // GitHub hesabı yaşına göre deneyim

    // Projeler döngüsü için
    projects: topRepos.map(repo => ({
      PROJECT_NAME: repo.name,
      PROJECT_URL: repo.html_url,
      PROJECT_DEMO: repo.homepage || '',
      PROJECT_DESCRIPTION: repo.description || 'No description available',
      PROJECT_STARS: repo.stargazers_count,
      PROJECT_FORKS: repo.forks_count,
      PROJECT_LANGUAGE: repo.language || 'Mixed',
      
      // Teknoloji etiketleri - direkt string array olarak
      topics: repo.topics || []
    }))
  };
} 