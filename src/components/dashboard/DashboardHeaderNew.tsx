'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { usePortfolioList } from '@/hooks/usePortfolioList';
import { useSubscription } from '@/hooks/useSubscription';
import Link from 'next/link';
import Image from 'next/image';

interface DashboardHeaderProps {
  className?: string;
  demoMode?: boolean;
  variant?: 'default' | 'transparent';
}

export function DashboardHeader({
  className = '',
  demoMode = false,
  variant = 'default',
}: DashboardHeaderProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const { portfolios } = usePortfolioList();
  const { subscriptionData, loading: subscriptionLoading, currentPlan } = useSubscription();
  const [scrolled, setScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const getPlanBadge = () => {
    // Layout shifting'i önlemek için her zaman aynı boyutta bir element render et
    const isLoading = subscriptionLoading;
    const isFree = currentPlan === 'FREE';

    return (
      <div className="w-12 h-6 flex items-center justify-center">
        {isLoading ? (
          <div className="w-8 h-4 bg-gray-200 rounded-full animate-pulse"></div>
        ) : (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              isFree
                ? 'bg-gray-100 text-gray-600'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
            }`}
          >
            {isFree ? 'Free' : 'Pro'}
          </span>
        )}
      </div>
    );
  };

  return (
    <>
      <style jsx global>{`
        .liquid-glass-header {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease-in-out;
        }

        .liquid-glass-header.scrolled {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.8);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          box-shadow: 0 4px 32px rgba(0, 0, 0, 0.1);
        }

        .glass-button {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          background: rgba(248, 250, 252, 0.2);
          border: 1px solid rgba(226, 232, 240, 0.3);
          transition: all 0.2s ease;
        }

        .glass-button:hover {
          background: rgba(248, 250, 252, 0.3);
          border: 1px solid rgba(226, 232, 240, 0.4);
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(71, 85, 105, 0.1);
        }

        .glass-dropdown {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: rgba(248, 250, 252, 0.9);
          border: 1px solid rgba(226, 232, 240, 0.3);
          box-shadow: 0 8px 32px rgba(71, 85, 105, 0.1);
        }

        .gradient-text {
          background: linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .nav-link {
          position: relative;
          overflow: hidden;
        }

        .nav-link::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #94a3b8, #cbd5e1);
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }

        .nav-link:hover::before,
        .nav-link.active::before {
          width: 100%;
        }

        /* Logo Glass Effect */
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
      `}</style>

      <header
        className={`liquid-glass-header fixed top-0 left-0 right-0 z-50 ${scrolled ? 'scrolled' : ''} ${className}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="liquid-glass-logo group flex items-center gap-3 px-4 py-2">
                <span className="text-lg font-bold text-gray-800">PortfolYO</span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/dashboard"
                className="nav-link text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href={portfolios.length === 0 ? '#' : '/my-portfolios'}
                onClick={(e) => {
                  if (portfolios.length === 0) {
                    e.preventDefault();
                  }
                }}
                className={`nav-link text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  portfolios.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                PortfolYO'lar
                {portfolios.length > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-blue-600 bg-blue-100 rounded-full">
                    {portfolios.length}
                  </span>
                )}
              </Link>
              <Link
                href="/pricing"
                className="nav-link text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Fiyatlandırma
              </Link>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Plan Badge */}
              {getPlanBadge()}

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {session?.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      width={20}
                      height={20}
                      className="w-5 h-5 rounded-full"
                    />
                  ) : (
                    <div className="w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        {session?.user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                  <span className="hidden sm:block">{session?.user?.name || 'User'}</span>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      isUserMenuOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                    <Link
                      href="/dashboard"
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href={portfolios.length === 0 ? '#' : '/my-portfolios'}
                      onClick={(e) => {
                        if (portfolios.length === 0) {
                          e.preventDefault();
                        } else {
                          setIsUserMenuOpen(false);
                        }
                      }}
                      className={`block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors ${
                        portfolios.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      My Portfolios
                    </Link>
                    <Link
                      href="/billing"
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Billing
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleSignOut();
                      }}
                      className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            <Link
              href="/dashboard"
              className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href={portfolios.length === 0 ? '#' : '/my-portfolios'}
              onClick={(e) => {
                if (portfolios.length === 0) {
                  e.preventDefault();
                }
              }}
              className={`block px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors ${
                portfolios.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              PortfolYO'lar
              {portfolios.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium text-gray-900 bg-gray-100 rounded-full">
                  {portfolios.length}
                </span>
              )}
            </Link>
            <Link
              href="/pricing"
              className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Fiyatlandırma
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}

export default DashboardHeader;
