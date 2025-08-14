import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { GitHubService } from '@/lib/github';
import { renderTemplate, formatUserDataForTemplate } from '@/lib/templateEngine';
import { PortfolioService } from '@/lib/portfolioService';
import { portfolioGenerationSchema, validateRequest, sanitizeString } from '@/lib/validation';
import * as Sentry from '@sentry/nextjs';
import { Session } from 'next-auth';
import type { GitHubUser, GitHubRepo } from '@/types/github';
import type { TemplateData } from '@/types/templates';
import type { SessionUser } from '@/types/auth';
import { withRateLimit } from '@/lib/rateLimit';

async function postHandler(request: NextRequest) {
  console.log('🚀 Portfolio Generate API çağrıldı!');

  let session: Session | null = null; // TODO: Proper type from next-auth

  try {
    // Demo mode kontrolü
    const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
    console.log('🎭 Demo mode:', demoMode);

    // Request body al ve validate et
    const requestBody = await request.json();
    console.log('📥 Raw request:', requestBody);

    // Zod validation
    const validation = await validateRequest(portfolioGenerationSchema, {
      template: sanitizeString(requestBody.templateName || requestBody.template),
      selectedRepos: Array.isArray(requestBody.selectedRepos)
        ? requestBody.selectedRepos.map((repo: string) => sanitizeString(repo))
        : [],
      cvUrl: requestBody.cvUrl ? sanitizeString(requestBody.cvUrl) : undefined,
      userBio: requestBody.userBio ? sanitizeString(requestBody.userBio) : undefined,
      userEmail: requestBody.userEmail ? sanitizeString(requestBody.userEmail) : undefined,
      linkedinUrl: requestBody.linkedinUrl ? sanitizeString(requestBody.linkedinUrl) : undefined,
    });

    if (!validation.success) {
      console.log('❌ Validation failed:', validation.error);
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validation.error,
        },
        { status: 400 },
      );
    }

    const { template: templateName, selectedRepos, cvUrl } = validation.data;
    console.log('✅ Validated data:', { templateName, selectedRepos: selectedRepos.length, cvUrl });
    console.log('📂 Template name:', templateName);
    console.log('📋 Selected repos:', selectedRepos);
    console.log('📄 CV URL:', cvUrl);

    let userData: GitHubUser;
    let repos: GitHubRepo[];
    let user: SessionUser | undefined = undefined;

    if (demoMode) {
      // Demo mode - Mock data kullan
      console.log('🎭 Demo mode: Mock data kullanılıyor');
      userData = {
        login: 'mockuser',
        name: 'Mock User',
        bio: 'Deneyimli yazılım geliştirici. React, Node.js ve modern web teknolojileri konusunda uzman.',
        avatar_url: 'https://via.placeholder.com/150',
        html_url: 'https://github.com/mockuser',
        location: 'İstanbul, Turkey',
        company: 'Tech Company',
        blog: 'https://mockuser.dev',
        public_repos: 25,
        followers: 150,
        following: 75,
      };

      repos = [
        {
          id: 1,
          name: 'e-commerce-app',
          description:
            'Modern React e-commerce application with Next.js, TypeScript and Stripe integration',
          html_url: 'https://github.com/mockuser/e-commerce-app',
          language: 'TypeScript',
          stargazers_count: 42,
          forks_count: 12,
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-12-20T15:45:00Z',
          topics: ['react', 'nextjs', 'ecommerce', 'typescript'],
          homepage: 'https://my-shop.vercel.app',
        },
        {
          id: 2,
          name: 'task-manager-api',
          description: 'RESTful API for task management built with Node.js, Express, and MongoDB',
          html_url: 'https://github.com/mockuser/task-manager-api',
          language: 'JavaScript',
          stargazers_count: 18,
          forks_count: 5,
          created_at: '2024-02-10T08:20:00Z',
          updated_at: '2024-11-30T12:15:00Z',
          topics: ['nodejs', 'express', 'mongodb', 'api'],
          homepage: null,
        },
        {
          id: 3,
          name: 'portfolio-website',
          description: 'Personal portfolio website with modern design and dark mode support',
          html_url: 'https://github.com/mockuser/portfolio-website',
          language: 'JavaScript',
          stargazers_count: 8,
          forks_count: 3,
          created_at: '2024-03-05T14:10:00Z',
          updated_at: '2024-10-15T09:30:00Z',
          topics: ['portfolio', 'website', 'responsive'],
          homepage: 'https://mockuser.dev',
        },
      ];
    } else {
      // Gerçek mode - GitHub API kullan
      session = await getServerSession(authOptions);
      console.log('🔐 Session var mı?', !!session);

      if (session) {
        console.log('✅ Session bulundu:', {
          userId: session.user?.email,
          hasAccessToken: !!(session.user as SessionUser)?.accessToken,
        });
        user = session.user as SessionUser;
      } else {
        console.log('❌ Session bulunamadı - cookies:', request.headers.get('cookie'));
      }

      if (!session || !user?.accessToken) {
        console.log('❌ Session veya accessToken yok!', {
          hasSession: !!session,
          hasUser: !!user,
          hasAccessToken: !!user?.accessToken,
        });
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // GitHub servisini kullanarak kullanıcı verilerini al (timeout ile)
      const githubService = new GitHubService(user.accessToken ?? '');

      // Timeout ile GitHub API çağrıları (optimized)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('GitHub API timeout')), 8000);
      });

      const githubPromise = Promise.all([
        githubService.getUserData(),
        githubService.getUserRepos(),
      ]) as Promise<[GitHubUser, GitHubRepo[]]>;

      const result = (await Promise.race([githubPromise, timeoutPromise])) as [
        GitHubUser,
        GitHubRepo[],
      ];

      const [userDataResult, reposResult] = result;

      userData = userDataResult;
      repos = reposResult;
    }

    // 🧱 Free tier limiti kontrolü (sadece gerçek modda)
    if (!demoMode) {
      const maxFreePortfolios = Number(process.env.FREE_TIER_MAX_PORTFOLIOS || 1);
      const userIdForLimit = user?.email || userData?.login || '';
      if (userIdForLimit) {
        try {
          const existing = await PortfolioService.getUserPortfolios(userIdForLimit);
          if (existing.length >= maxFreePortfolios) {
            return NextResponse.json(
              {
                error: 'Free tier limit exceeded',
                details: `Free planda en fazla ${maxFreePortfolios} portfolyo oluşturabilirsiniz. Lütfen mevcut portfolyonuzdan birini silin veya plan yükseltin.`,
              },
              { status: 403 },
            );
          }
        } catch (e) {
          console.error('Free tier kontrolü hata:', e);
        }
      }
    }

    // 🗃️ 1. ADIM: Portfolio kaydını database'e kaydet
    let savedPortfolio: { id: string; created_at?: string } | undefined;
    if (demoMode) {
      // Demo mode - Mock portfolio ID oluştur
      savedPortfolio = {
        id: 'demo-portfolio-' + Date.now(),
        created_at: new Date().toISOString(),
      };
    } else {
      const portfolioData = {
        user_id: demoMode ? (userData as any).login : user?.email || (userData as any).login,
        selected_template: templateName,
        selected_repos: selectedRepos || [],
        cv_url: cvUrl ?? '',
      };
      savedPortfolio = (await PortfolioService.createPortfolio(portfolioData)) as {
        id: string;
        created_at?: string;
      };
      if (!savedPortfolio) {
        console.log("❌ Portfolio database'e kaydedilemedi!");
        return NextResponse.json({ error: 'Failed to save portfolio' }, { status: 500 });
      }
      console.log('✅ Portfolio başarıyla kaydedildi:', savedPortfolio.id);
    }

    // 🎨 2. ADIM: Template data formatla ve HTML oluştur
    console.log('🔄 formatUserDataForTemplate çağrılıyor...');
    const templateData: TemplateData = formatUserDataForTemplate(
      userData,
      repos,
      selectedRepos,
      cvUrl,
    );

    console.log('📊 Template data oluşturuldu:', {
      projectCount: (templateData as any).projects?.length || 0,
    });

    console.log('🎨 renderTemplate çağrılıyor...');
    const generatedHtml: string = renderTemplate(templateName, templateData);

    if (!generatedHtml) {
      throw new Error('Generated HTML is empty');
    }

    if (!demoMode) {
      console.log('💾 Oluşturulan HTML veritabanına kaydediliyor...');
      const updated = await PortfolioService.updatePortfolio(savedPortfolio!.id, {
        generated_html: generatedHtml,
        metadata: PortfolioService.createMetadataFromTemplateData(templateData, templateName),
      } as any);

      if (!updated) {
        console.log('❌ Portfolio HTML güncellenemedi!');
        return NextResponse.json({ error: 'Failed to update portfolio' }, { status: 500 });
      }
      console.log('✅ Portfolio HTML güncellendi:', updated.id);
    }

    console.log('🎉 Portfolio generation completed successfully');

    return NextResponse.json({
      success: true,
      generatedHtml,
      portfolioId: savedPortfolio!.id,
    });
  } catch (error) {
    console.error('💥 Portfolio generation error:', error);

    // Capture error in Sentry with context
    Sentry.captureException(error, {
      tags: {
        api: 'portfolio-generation',
        endpoint: '/api/portfolio/generate',
      },
      extra: {
        userEmail: (session?.user as SessionUser)?.email,
        hasSession: !!session,
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json({ error: 'Failed to generate portfolio' }, { status: 500 });
  }
}

export const POST = withRateLimit(postHandler);
