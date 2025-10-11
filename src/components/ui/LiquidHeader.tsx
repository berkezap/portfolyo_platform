'use client';

import { useSession, signOut, signIn } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Github, Home, FolderOpen, Plus, LogOut, User } from 'lucide-react';
import { usePortfolioList } from '@/hooks/usePortfolioList';
import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import type { Locale } from '@/i18n/config';

interface LiquidHeaderProps {
  demoMode?: boolean;
  variant?: 'default' | 'transparent';
}

export function LiquidHeader({ demoMode = false, variant = 'transparent' }: LiquidHeaderProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('navigation');
  const locale = useLocale() as Locale;
  const shouldFetchPortfolios = Boolean(session && status === 'authenticated');
  const { portfolios, isLoading } = usePortfolioList(shouldFetchPortfolios);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (variant === 'transparent') {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [variant]);

  const getPortfolioLinkDisabled = () => {
    return !isLoading && portfolios.length === 0;
  };

  const headerClasses =
    variant === 'transparent'
      ? `fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
          isScrolled
            ? 'liquid-glass-header liquid-glass-header-scrolled'
            : 'liquid-glass-header-transparent'
        }`
      : 'liquid-glass-header relative z-50';

  return (
    <>
      <style jsx>{`
        /* Simple Glass Header */
        .liquid-glass-header {
          background: rgba(248, 250, 252, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(226, 232, 240, 0.2);
          transition: all 0.3s ease;
        }

        .liquid-glass-header-transparent {
          background: transparent;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          border: none;
        }

        .liquid-glass-header-scrolled {
          background: rgba(248, 250, 252, 0.2);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          box-shadow: 0 8px 32px rgba(71, 85, 105, 0.1);
        }

        /* Simple Glass Elements */
        .liquid-glass-element {
          background: rgba(248, 250, 252, 0.2);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(226, 232, 240, 0.3);
          border-radius: 12px;
          transition: all 0.2s ease;
          color: rgba(55, 65, 81, 0.9);
        }

        .liquid-glass-element:hover {
          background: rgba(248, 250, 252, 0.3);
          border-color: rgba(148, 163, 184, 0.4);
          color: rgba(71, 85, 105, 1);
          transform: translateY(-1px);
        }

        .liquid-glass-element.active {
          background: rgba(148, 163, 184, 0.2);
          border-color: rgba(148, 163, 184, 0.4);
          color: rgba(71, 85, 105, 1);
        }

        /* Simple Logo Glass */
        .liquid-glass-logo {
          background: rgba(248, 250, 252, 0.15);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(226, 232, 240, 0.2);
          border-radius: 16px;
          transition: all 0.3s ease;
        }

        .liquid-glass-logo:hover {
          background: rgba(248, 250, 252, 0.25);
          transform: scale(1.02);
        }

        /* Simple Avatar Glass */
        .liquid-glass-avatar {
          border: 2px solid rgba(226, 232, 240, 0.4);
          transition: all 0.2s ease;
        }

        .liquid-glass-avatar:hover {
          border-color: rgba(148, 163, 184, 0.6);
          transform: scale(1.05);
        }
      `}</style>

      <header className={headerClasses}>
        <nav className="flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="liquid-glass-logo group flex items-center gap-3 px-4 py-2"
          >
            <span className="text-lg font-bold text-gray-800">PortfolYO</span>
          </Link>

          {/* Navigation */}
          {status === 'authenticated' && session && (
            <div className="hidden md:flex items-center gap-2">
              <Link href={`/${locale}/dashboard`}>
                <div
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname.includes('/dashboard')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="ml-2">{t('dashboard')}</span>
                </div>
              </Link>

              <Link
                href={getPortfolioLinkDisabled() ? '#' : `/${locale}/my-portfolios`}
                onClick={(e) => {
                  if (getPortfolioLinkDisabled()) {
                    e.preventDefault();
                    router.push(`/${locale}/dashboard`);
                  }
                }}
              >
                <div
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname.includes('/my-portfolios')
                      ? 'bg-gray-900 text-white'
                      : getPortfolioLinkDisabled()
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="ml-2">{t('myPortfolios')}</span>
                </div>
              </Link>

              <Link href={`/${locale}/pricing`}>
                <div
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname.includes('/pricing')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{t('pricing')}</span>
                </div>
              </Link>
            </div>
          )}

          {/* Mobile Navigation */}
          {status === 'authenticated' && session && (
            <div className="flex md:hidden items-center gap-2">
              <Link href={`/${locale}/dashboard`}>
                <div
                  className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${
                    pathname.includes('/dashboard')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                </div>
              </Link>

              <Link
                href={getPortfolioLinkDisabled() ? '#' : `/${locale}/my-portfolios`}
                onClick={(e) => {
                  if (getPortfolioLinkDisabled()) {
                    e.preventDefault();
                    router.push(`/${locale}/dashboard`);
                  }
                }}
              >
                <div
                  className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${
                    pathname.includes('/my-portfolios')
                      ? 'bg-gray-900 text-white'
                      : getPortfolioLinkDisabled()
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FolderOpen className="w-4 h-4" />
                </div>
              </Link>

              <Link href={`/${locale}/pricing`}>
                <div
                  className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors ${
                    pathname.includes('/pricing')
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xs font-medium">€</span>
                </div>
              </Link>
            </div>
          )}

          {/* User Section */}
          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <LanguageSwitcher currentLocale={locale} />
            {demoMode ? (
              <>
                <div className="hidden sm:block px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                  Demo
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm font-bold">
                  DM
                </div>
                <Link href={`/${locale}`}>
                  <div className="flex items-center justify-center w-8 h-8 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Home className="w-4 h-4" />
                  </div>
                </Link>
              </>
            ) : status === 'authenticated' && session ? (
              <>
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {session?.user?.name || 'User'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {portfolios?.length || 0} {t('myPortfolios').toLowerCase()}
                  </div>
                </div>

                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="User avatar"
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center border-2 border-gray-200">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}

                <button
                  onClick={async () => {
                    await signOut({
                      callbackUrl: `/${locale}`,
                      redirect: true,
                    });
                  }}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2">{t('signOut')}</span>
                </button>
              </>
            ) : status === 'unauthenticated' ? (
              <button
                onClick={() => signIn('github')}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Github className="w-4 h-4" />
                <span className="ml-2">{t('signIn')}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="hidden sm:block w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}
