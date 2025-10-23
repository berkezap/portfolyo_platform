import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { GitHubService } from '@/lib/github';
import { formatUserDataForTemplate } from '@/lib/portfolioHelpers';
import { PortfolioService } from '@/lib/portfolioService';
import { portfolioGenerationSchema, validateRequest, sanitizeString } from '@/lib/validation';
import * as Sentry from '@sentry/nextjs';
import { Session } from 'next-auth';
import type { GitHubUser, GitHubRepo } from '@/types/github';
import type { TemplateData } from '@/types/templates';
import type { SessionUser } from '@/types/auth';
import { withRateLimit } from '@/lib/rateLimit';
import { isTemplatePremium } from '@/config/templates';

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

    // Check if template is premium and user has access
    if (isTemplatePremium(templateName) && !demoMode) {
      // Get user's subscription status from Supabase
      const tempSession = await getServerSession(authOptions);
      if (!tempSession?.user?.email) {
        console.error('❌ User not authenticated for premium template');
        return NextResponse.json(
          { error: 'Authentication required for premium templates' },
          { status: 401 },
        );
      }

      // Check subscription status from Supabase
      console.log('🔒 Checking premium template access for:', tempSession.user.email);

      try {
        const { PortfolioService } = await import('@/lib/portfolioService');
        const portfolioService = new PortfolioService();

        // Get user subscription from database
        const subscription = await portfolioService.getUserSubscription(tempSession.user.email);

        const hasPremiumAccess = subscription?.plan === 'PRO' && subscription?.status === 'active';

        if (!hasPremiumAccess) {
          console.error('❌ Premium template access denied for user:', tempSession.user.email);
          console.error('📊 User subscription:', subscription);
          return NextResponse.json(
            {
              error: 'Premium template requires PRO subscription',
              code: 'PREMIUM_REQUIRED',
              userPlan: subscription?.plan || 'FREE',
            },
            { status: 403 },
          );
        }

        console.log('✅ Premium template access granted for:', tempSession.user.email);
      } catch (subscriptionError) {
        console.error('❌ Subscription check failed:', subscriptionError);
        return NextResponse.json(
          {
            error: 'Failed to verify subscription status',
            code: 'SUBSCRIPTION_CHECK_FAILED',
          },
          { status: 500 },
        );
      }
    }

    // Check portfolio limits for all users (not demo mode)
    if (!demoMode) {
      const tempSession = await getServerSession(authOptions);
      if (!tempSession?.user?.email) {
        console.error('❌ User not authenticated');
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }

      try {
        const { PortfolioService } = await import('@/lib/portfolioService');
        const portfolioService = new PortfolioService();

        // Get user subscription and current portfolio count
        const subscription = await portfolioService.getUserSubscription(tempSession.user.email);
        const userPortfolios = await PortfolioService.getUserPortfolios(tempSession.user.email);

        const isPro = subscription?.plan === 'PRO' && subscription?.status === 'active';
        const maxPortfolios = isPro ? 5 : 1; // PRO: 5 portfolios, FREE: 1 portfolio
        const currentCount = userPortfolios.length;

        console.log('📊 Portfolio limit check:', {
          userEmail: tempSession.user.email,
          plan: subscription?.plan || 'FREE',
          currentCount,
          maxPortfolios,
          canCreate: currentCount < maxPortfolios,
        });

        if (currentCount >= maxPortfolios) {
          console.error('❌ Portfolio limit exceeded for user:', tempSession.user.email);

          const planName = isPro ? 'PRO' : 'FREE';
          const upgradeMessage = isPro
            ? 'Please delete an existing portfolio to create a new one.'
            : 'Upgrade to PRO to create up to 5 portfolios.';

          return NextResponse.json(
            {
              error: `Portfolio limit reached`,
              message: `${planName} plan allows ${maxPortfolios} portfolio${maxPortfolios > 1 ? 's' : ''}. ${upgradeMessage}`,
              code: 'PORTFOLIO_LIMIT_REACHED',
              userPlan: subscription?.plan || 'FREE',
              currentCount,
              maxPortfolios,
              upgradeRequired: !isPro,
            },
            { status: 403 },
          );
        }

        console.log('✅ Portfolio limit check passed');
      } catch (limitError) {
        console.error('❌ Portfolio limit check failed:', limitError);
        return NextResponse.json(
          {
            error: 'Failed to verify portfolio limits',
            code: 'LIMIT_CHECK_FAILED',
          },
          { status: 500 },
        );
      }
    }

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

    // Note: Portfolio limit check already done above with subscription-based logic

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

    // 🎨 2. ADIM: Template data formatla (SSR - HTML oluşturmuyoruz)
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

    // SSR: Sadece metadata'yı kaydediyoruz, HTML render SSR'de olacak
    if (!demoMode) {
      console.log('💾 Metadata veritabanına kaydediliyor...');
      const updated = await PortfolioService.updatePortfolio(savedPortfolio!.id, {
        metadata: templateData, // SSR: Only save the data, not HTML
      } as any);

      if (!updated) {
        console.log('❌ Portfolio metadata güncellenemedi!');
        return NextResponse.json({ error: 'Failed to update portfolio' }, { status: 500 });
      }
      console.log('✅ Portfolio metadata güncellendi:', updated.id);
    }

    console.log('🎉 Portfolio generation completed successfully (SSR mode)');

    return NextResponse.json({
      success: true,
      portfolioId: savedPortfolio!.id,
      message: 'Portfolio created successfully. Publish to make it live.',
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
