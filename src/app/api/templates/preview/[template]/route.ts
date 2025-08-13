import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Template ID to name mapping
const templateIdToName: { [key: number]: string } = {
  1: 'professional-tech',
  2: 'minimalist-professional',
  3: 'creative-portfolio',
  // Legacy templates
  4: 'modern-developer',
  5: 'creative-technologist',
  6: 'storyteller',
};

export async function GET(request: NextRequest, { params }: { params: { template: string } }) {
  try {
    const templateId = parseInt(params.template);
    const templateName = templateIdToName[templateId];

    if (!templateName) {
      return new NextResponse('Template not found', { status: 404 });
    }

    // Template dosyasının yolunu oluştur
    const templatePath = path.join(
      process.cwd(),
      'public',
      'templates',
      templateName,
      'index.html',
    );

    // Dosyanın var olup olmadığını kontrol et
    if (!fs.existsSync(templatePath)) {
      return new NextResponse('Template file not found', { status: 404 });
    }

    // Template dosyasını oku
    const htmlContent = fs.readFileSync(templatePath, 'utf-8');

    // Template'e göre farklı demo data kullan
    let userName, userTitle, userBio;

    if (templateName === 'creative-portfolio') {
      userName = 'Maya Chen';
      userTitle = 'Creative Developer & Designer';
      userBio =
        'I create stunning digital experiences through code and design. Passionate about pushing boundaries with innovative UI/UX and cutting-edge web technologies.';
    } else if (templateName === 'minimalist-professional') {
      userName = 'Sarah Wilson';
      userTitle = 'Product Designer & Developer';
      userBio =
        'Clean design enthusiast focused on creating intuitive user experiences. I believe in the power of simplicity and thoughtful design decisions.';
    } else {
      userName = 'Alex Johnson';
      userTitle = 'Senior Full Stack Developer';
      userBio =
        'Passionate developer with 5+ years of experience building scalable web applications. I love creating beautiful, functional software that makes a difference.';
    }

    // Demo data ile placeholder'ları değiştir
    let previewHtml = htmlContent
      .replace(/\{\{USER_NAME\}\}/g, userName)
      .replace(/\{\{USER_TITLE\}\}/g, userTitle)
      .replace(/\{\{USER_BIO\}\}/g, userBio)
      .replace(/\{\{USER_EMAIL\}\}/g, 'hello@example.com')
      .replace(/\{\{GITHUB_URL\}\}/g, 'https://github.com/demo')
      .replace(/\{\{LINKEDIN_URL\}\}/g, 'https://linkedin.com/in/demo')
      .replace(/\{\{CV_URL\}\}/g, 'https://example.com/cv.pdf');

    // Projects section - birden fazla proje ekle
    const projectsHtml = `
      <div class="card rounded-lg p-6" style="background: var(--background, #fff); border: 1px solid var(--border, #e5e5e5);">
        <h3 class="text-xl font-semibold mb-3">AI Dashboard Platform</h3>
        <p class="muted text-sm mb-4 leading-relaxed" style="color: var(--muted-foreground, #666);">Modern React dashboard with real-time analytics and AI-powered insights for business intelligence.</p>
        <div class="flex flex-wrap gap-2 mb-4">
          <span class="text-xs muted bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1" style="background: rgba(0,0,0,0.05); color: var(--muted-foreground, #666);">React</span>
          <span class="text-xs muted bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1" style="background: rgba(0,0,0,0.05); color: var(--muted-foreground, #666);">TypeScript</span>
          <span class="text-xs muted bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1" style="background: rgba(0,0,0,0.05); color: var(--muted-foreground, #666);">Node.js</span>
        </div>
        <div class="flex items-center space-x-4 text-sm mt-auto">
          <a href="#" class="accent-text hover:underline" style="color: var(--accent, #007AFF);">View Source</a>
          <a href="#" class="accent-text hover:underline" style="color: var(--accent, #007AFF);">Live Demo</a>
        </div>
      </div>
      
      <div class="card rounded-lg p-6" style="background: var(--background, #fff); border: 1px solid var(--border, #e5e5e5);">
        <h3 class="text-xl font-semibold mb-3">E-Commerce Platform</h3>
        <p class="muted text-sm mb-4 leading-relaxed" style="color: var(--muted-foreground, #666);">Full-stack e-commerce solution with payment integration, inventory management, and analytics.</p>
        <div class="flex flex-wrap gap-2 mb-4">
          <span class="text-xs muted bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1" style="background: rgba(0,0,0,0.05); color: var(--muted-foreground, #666);">Next.js</span>
          <span class="text-xs muted bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1" style="background: rgba(0,0,0,0.05); color: var(--muted-foreground, #666);">PostgreSQL</span>
          <span class="text-xs muted bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1" style="background: rgba(0,0,0,0.05); color: var(--muted-foreground, #666);">Stripe</span>
        </div>
        <div class="flex items-center space-x-4 text-sm mt-auto">
          <a href="#" class="accent-text hover:underline" style="color: var(--accent, #007AFF);">View Source</a>
          <a href="#" class="accent-text hover:underline" style="color: var(--accent, #007AFF);">Live Demo</a>
        </div>
      </div>
    `;

    // Template'e göre projects section'ı değiştir
    previewHtml = previewHtml
      .replace(/\{\{PROJECTS_START\}\}/g, projectsHtml)
      .replace(/\{\{PROJECTS_END\}\}/g, '')
      .replace(/\{\{PROJECT_NAME\}\}/g, 'AI Dashboard Platform')
      .replace(
        /\{\{PROJECT_DESCRIPTION\}\}/g,
        'Modern React dashboard with real-time analytics and AI-powered insights for business intelligence.',
      )
      .replace(/\{\{PROJECT_URL\}\}/g, 'https://github.com/demo/ai-dashboard')
      .replace(/\{\{PROJECT_DEMO\}\}/g, 'https://ai-dashboard-demo.com')
      .replace(/\{\{TECH_TAGS_START\}\}/g, '')
      .replace(/\{\{TECH_TAGS_END\}\}/g, '')
      .replace(/\{\{TECH_NAME\}\}/g, 'React')
      // Mustache conditional blocks'ları temizle
      .replace(/\{\{#CV_URL\}\}/g, '')
      .replace(/\{\{\/CV_URL\}\}/g, '')
      .replace(/\{\{#PROJECT_DEMO\}\}/g, '')
      .replace(/\{\{\/PROJECT_DEMO\}\}/g, '')
      // Kalan placeholder'ları temizle
      .replace(/\{\{[^}]+\}\}/g, '');

    // CSS dosyası varsa onu da ekle
    const cssPath = path.join(process.cwd(), 'public', 'templates', templateName, 'style.css');

    let finalHtml = previewHtml;

    if (fs.existsSync(cssPath)) {
      const cssContent = fs.readFileSync(cssPath, 'utf-8');
      // CSS'i HTML'e ekle
      finalHtml = finalHtml.replace(
        '<link rel="stylesheet" href="style.css">',
        `<style>${cssContent}</style>`,
      );
    }

    return new NextResponse(finalHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Preview API error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
