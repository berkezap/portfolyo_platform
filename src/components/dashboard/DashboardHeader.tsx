import { useSession, signOut, signIn } from 'next-auth/react';
import { Github, LogOut } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { usePortfolioList } from '@/hooks/usePortfolioList';
import { useState, useEffect } from 'react';

interface DashboardHeaderProps {
  demoMode: boolean;
  variant?: 'default' | 'transparent';
}

export function DashboardHeader({ demoMode, variant = 'default' }: DashboardHeaderProps) {
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

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [variant]);

  const getHeaderClasses = () => {
    if (variant === 'transparent') {
      return `fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-xl border-b border-white/30'
          : 'bg-transparent border-b border-transparent'
      }`;
    }
    return 'glass border-b border-white/20 shadow-glass relative z-50 backdrop-blur-xl';
  };

  // Portfolyo sayısına göre link metnini belirle
  const getPortfolioLinkText = () => {
    return 'Portfolyo Yönetimi';
  };

  const getPortfolioLinkDisabled = () => {
    return !isLoading && portfolios.length === 0;
  };

  return (
    <header className={getHeaderClasses()}>
      <div className="container mx-auto px-4">
        <div
          className="flex items-center justify-between py-4"
          style={{ minHeight: '64px', height: '64px' }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group focus:outline-none hover-lift">
            <Image src="/YO.svg" alt="PortfolYO Logo" width={32} height={32} className="h-8 w-8" />
          </Link>

          {/* Navigation Links - Only show for authenticated users */}
          {status === 'authenticated' && session && (
            <nav className="flex items-center gap-1 md:gap-3">
              <Link href="/dashboard" className="relative group">
                <div
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 hover-lift
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
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 hover-lift
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
          )}

          {/* User Section */}
          <div className="flex items-center gap-4">
            {demoMode ? (
              <>
                <div className="hidden sm:block">
                  <span className="text-sm text-gray-600 bg-white/50 px-3 py-1 rounded-lg backdrop-blur-sm">
                    Mock User (Demo Mode)
                  </span>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-white/20 shadow-lg hover-lift">
                  MU
                </div>
                <Link href="/">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={LogOut}
                    className="bg-white/20 hover:bg-white/30 text-gray-700 border-white/30 shadow-none hover:ring-2 hover:ring-blue-400/50"
                  >
                    Ana Sayfa
                  </Button>
                </Link>
              </>
            ) : status === 'authenticated' && session ? (
              <>
                <div className="hidden sm:block">
                  <span className="text-sm text-gray-700 font-medium bg-white/50 px-3 py-1 rounded-lg backdrop-blur-sm max-w-[120px] truncate">
                    {session?.user?.name || 'GitHub User'}
                  </span>
                </div>
                {session?.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt="User avatar"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full border-2 border-white/20 shadow-lg object-cover transition-all duration-300 hover-lift hover:ring-2 hover:ring-blue-400/50"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center border-2 border-white/20 shadow-lg transition-all duration-300 hover-lift hover:ring-2 hover:ring-blue-400/50">
                    <Github className="h-5 w-5 text-white" />
                  </div>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  icon={LogOut}
                  onClick={async () => {
                    await signOut({
                      callbackUrl: '/',
                      redirect: true,
                    });
                  }}
                  className="bg-white/20 hover:bg-white/30 text-gray-700 border-white/30 shadow-none hover:ring-2 hover:ring-blue-400/50"
                >
                  Çıkış
                </Button>
              </>
            ) : status === 'unauthenticated' ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => signIn('github')}
                icon={Github}
                className="shadow-lg hover-lift"
              >
                <span className="hidden sm:inline">GitHub ile Giriş</span>
                <span className="sm:hidden">Giriş</span>
              </Button>
            ) : (
              <div className="animate-pulse bg-gray-200 rounded h-8 w-20"></div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
