'use client';

import { useSession, signOut, signIn } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Github, Home, FolderOpen, Plus, LogOut, User } from 'lucide-react';
import { usePortfolioList } from '@/hooks/usePortfolioList';

interface LiquidHeaderProps {
  demoMode?: boolean;
  variant?: 'default' | 'transparent';
}

export function LiquidHeader({ demoMode = false, variant = 'transparent' }: LiquidHeaderProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
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
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .liquid-glass-header-transparent {
          background: transparent;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
          border: none;
        }

        .liquid-glass-header-scrolled {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        /* Simple Glass Elements */
        .liquid-glass-element {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          transition: all 0.2s ease;
          color: rgba(55, 65, 81, 0.9);
        }

        .liquid-glass-element:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(59, 130, 246, 0.4);
          color: rgba(37, 99, 235, 1);
          transform: translateY(-1px);
        }

        .liquid-glass-element.active {
          background: rgba(59, 130, 246, 0.2);
          border-color: rgba(59, 130, 246, 0.4);
          color: rgba(37, 99, 235, 1);
        }

        /* Simple Logo Glass */
        .liquid-glass-logo {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          transition: all 0.3s ease;
        }

        .liquid-glass-logo:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: scale(1.02);
        }

        /* Simple Avatar Glass */
        .liquid-glass-avatar {
          border: 2px solid rgba(255, 255, 255, 0.4);
          transition: all 0.2s ease;
        }

        .liquid-glass-avatar:hover {
          border-color: rgba(59, 130, 246, 0.6);
          transform: scale(1.05);
        }
      `}</style>

      <header className={headerClasses}>
        <nav className="flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <Link href="/" className="liquid-glass-logo group flex items-center gap-3 px-4 py-2">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                <Github className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-lg font-bold text-gray-800">PortfolYO</span>
          </Link>

          {/* Navigation */}
          {status === 'authenticated' && session && (
            <div className="hidden md:flex items-center gap-3">
              <Link href="/dashboard">
                <div
                  className={`liquid-glass-element flex items-center px-4 py-2 ${pathname === '/dashboard' ? 'active' : ''}`}
                >
                  <Plus className="w-5 h-5" />
                  <span className="ml-2 text-sm font-medium">Yeni</span>
                </div>
              </Link>

              <Link
                href={getPortfolioLinkDisabled() ? '#' : '/my-portfolios'}
                onClick={(e) => {
                  if (getPortfolioLinkDisabled()) {
                    e.preventDefault();
                    router.push('/dashboard');
                  }
                }}
              >
                <div
                  className={`liquid-glass-element flex items-center px-4 py-2 ${pathname === '/my-portfolios' ? 'active' : ''} ${getPortfolioLinkDisabled() ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <FolderOpen className="w-5 h-5" />
                  <span className="ml-2 text-sm font-medium">Portfolyolar</span>
                </div>
              </Link>
            </div>
          )}

          {/* Mobile Navigation */}
          {status === 'authenticated' && session && (
            <div className="flex md:hidden items-center gap-2">
              <Link href="/dashboard">
                <div
                  className={`liquid-glass-element flex items-center justify-center w-10 h-10 ${pathname === '/dashboard' ? 'active' : ''}`}
                >
                  <Plus className="w-5 h-5" />
                </div>
              </Link>

              <Link
                href={getPortfolioLinkDisabled() ? '#' : '/my-portfolios'}
                onClick={(e) => {
                  if (getPortfolioLinkDisabled()) {
                    e.preventDefault();
                    router.push('/dashboard');
                  }
                }}
              >
                <div
                  className={`liquid-glass-element flex items-center justify-center w-10 h-10 ${pathname === '/my-portfolios' ? 'active' : ''} ${getPortfolioLinkDisabled() ? 'opacity-50' : ''}`}
                >
                  <FolderOpen className="w-5 h-5" />
                </div>
              </Link>
            </div>
          )}

          {/* User Section */}
          <div className="flex items-center gap-3">
            {demoMode ? (
              <>
                <div className="hidden sm:block liquid-glass-element px-3 py-1">
                  <span className="text-xs font-medium text-gray-600">Demo</span>
                </div>
                <div className="liquid-glass-avatar w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold">
                  DM
                </div>
                <Link href="/">
                  <div className="liquid-glass-element flex items-center justify-center w-10 h-10">
                    <Home className="w-4 h-4" />
                  </div>
                </Link>
              </>
            ) : status === 'authenticated' && session ? (
              <>
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium text-gray-700">
                    {session?.user?.name || 'User'}
                  </div>
                  <div className="text-xs text-gray-500">{portfolios?.length || 0} portfolyo</div>
                </div>

                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="User avatar"
                    width={40}
                    height={40}
                    className="liquid-glass-avatar w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="liquid-glass-avatar w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}

                <button
                  onClick={async () => {
                    await signOut({
                      callbackUrl: '/',
                      redirect: true,
                    });
                  }}
                  className="liquid-glass-element flex items-center px-3 py-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2 text-sm">Çıkış</span>
                </button>
              </>
            ) : status === 'unauthenticated' ? (
              <button
                onClick={() => signIn('github')}
                className="liquid-glass-element flex items-center px-4 py-2"
              >
                <Github className="w-5 h-5" />
                <span className="ml-2 text-sm font-medium">Giriş</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 liquid-glass-element rounded-full animate-pulse"></div>
                <div className="hidden sm:block w-16 h-4 liquid-glass-element rounded animate-pulse"></div>
              </div>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}
