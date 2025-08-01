import { useSession, signOut } from 'next-auth/react';
import { Github, LogOut } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { usePortfolioList } from '@/hooks/usePortfolioList';

interface DashboardHeaderProps {
  demoMode: boolean;
}

export function DashboardHeader({ demoMode }: DashboardHeaderProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const shouldFetchPortfolios = Boolean(session);
  const { portfolios, isLoading } = usePortfolioList(shouldFetchPortfolios);

  // Scroll state for liquid glass effect
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Portfolyo sayısına göre link metnini belirle
  const getPortfolioLinkText = () => {
    return 'Portfolyo Yönetimi';
  };

  const getPortfolioLinkDisabled = () => {
    return !isLoading && portfolios.length === 0;
  };

  return (
    <>
      {/* Header */}
      <header
        className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out
        ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-xl border-b border-white/30'
            : 'bg-transparent border-b border-transparent'
        }
      `}
      >
        <div className="container mx-auto px-4" style={{ height: '64px' }}>
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group focus:outline-none">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-2.5 transition-all duration-300 group-hover:scale-105 group-active:scale-95 shadow-lg">
                <Github className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
                PortfolYO
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="flex items-center gap-1 md:gap-3">
              <Link href="/dashboard" className="relative group">
                <div
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300
                  ${
                    pathname === '/dashboard'
                      ? 'bg-blue-600/20 text-blue-700 border border-blue-200/50 shadow-sm'
                      : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50/50'
                  }
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400`}
                >
                  <span className="hidden sm:inline">Yeni Portfolyo</span>
                  <span className="sm:hidden">Yeni</span>
                </div>
              </Link>

              <Link
                href={getPortfolioLinkDisabled() ? '#' : '/my-portfolios'}
                className={`relative group ${getPortfolioLinkDisabled() ? 'cursor-not-allowed' : ''}`}
                onClick={(e) => {
                  if (getPortfolioLinkDisabled()) {
                    e.preventDefault();
                    router.push('/dashboard');
                  }
                }}
              >
                <div
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300
                  ${
                    pathname === '/my-portfolios'
                      ? 'bg-blue-600/20 text-blue-700 border border-blue-200/50 shadow-sm'
                      : getPortfolioLinkDisabled()
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50/50'
                  }
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400`}
                >
                  <span className="hidden sm:inline">{getPortfolioLinkText()}</span>
                  <span className="sm:hidden">Yönetim</span>
                </div>
              </Link>
            </nav>

            {/* User Section */}
            <div className="flex items-center gap-4">
              {demoMode ? (
                <>
                  <div className="hidden sm:block">
                    <span className="text-sm text-gray-600 bg-white/50 px-3 py-1 rounded-lg backdrop-blur-sm">
                      Demo Mode
                    </span>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-white/20 shadow-lg">
                    DM
                  </div>
                </>
              ) : session?.user ? (
                <>
                  <div className="hidden sm:flex sm:items-center sm:gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {session.user.name || session.user.email}
                      </p>
                      <p className="text-xs text-gray-500">{portfolios.length} portfolyo</p>
                    </div>
                  </div>

                  <div className="relative">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        width={40}
                        height={40}
                        className="rounded-full border-2 border-white/20 shadow-lg"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-white/20 shadow-lg">
                        {(session.user.name || session.user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    variant="secondary"
                    size="sm"
                    icon={LogOut}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <span className="hidden sm:inline">Çıkış</span>
                  </Button>
                </>
              ) : (
                <div className="animate-pulse flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="hidden sm:block w-20 h-4 bg-gray-200 rounded"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
