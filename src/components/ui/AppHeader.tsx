import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Code2, Sparkles, Github } from 'lucide-react';
import Button from './Button';

interface AppHeaderProps {
  variant?: 'home' | 'dashboard' | 'portfolio';
  demoMode?: boolean;
  showAuth?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  variant = 'home',
  demoMode = false,
  showAuth = true,
}) => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getLogoIcon = () => {
    switch (variant) {
      case 'dashboard':
        return <Github className="h-6 w-6 text-white" />;
      case 'portfolio':
        return <Code2 className="h-6 w-6 text-white" />;
      default:
        return <Code2 className="h-7 w-7 text-white" />;
    }
  };

  const getLogoSize = () => {
    switch (variant) {
      case 'dashboard':
        return 'text-xl';
      case 'portfolio':
        return 'text-lg';
      default:
        return 'text-2xl';
    }
  };

  const getNavLinks = () => {
    switch (variant) {
      case 'dashboard':
        return [
          { href: '/dashboard', label: 'Yeni Portfolyo', shortLabel: 'Yeni' },
          { href: '/my-portfolios', label: 'Portfolyolarım', shortLabel: 'Portfolyolarım' },
          { href: '/gdpr-settings', label: 'GDPR Ayarları', shortLabel: 'GDPR' },
        ];
      case 'portfolio':
        return [
          { href: '#about', label: 'Hakkımda', shortLabel: 'Hakkımda' },
          { href: '#projects', label: 'Projeler', shortLabel: 'Projeler' },
          { href: '#contact', label: 'İletişim', shortLabel: 'İletişim' },
        ];
      default:
        return [];
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-xl border-b border-white/30'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div
        className="container mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-4"
        style={{ height: '64px' }}
      >
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link
            href={variant === 'dashboard' ? '/my-portfolios' : '/'}
            className="flex items-center gap-3 group focus:outline-none hover-lift"
          >
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-2.5 transition-all duration-300 group-hover:scale-105 group-active:scale-95 shadow-lg">
                {getLogoIcon()}
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300 tracking-tight ${getLogoSize()}`}
              >
                PortfolYO
              </span>
              <Sparkles className="h-4 w-4 text-blue-500 animate-pulse" />
            </div>
          </Link>

          {/* Navigation */}
          {variant !== 'home' && (
            <nav className="flex items-center gap-2 md:gap-4">
              {getNavLinks().map((link) => (
                <Link key={link.href} href={link.href} className="relative group">
                  <div
                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 hover-lift
                    ${
                      pathname === link.href
                        ? 'bg-blue-600/20 text-blue-700 border border-blue-200/50 shadow-sm'
                        : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50/50'
                    }
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400`}
                  >
                    <span className="hidden sm:inline">{link.label}</span>
                    <span className="sm:hidden">{link.shortLabel || link.label}</span>
                  </div>
                </Link>
              ))}
            </nav>
          )}

          {/* Auth/CTA */}
          {showAuth && (
            <div className="flex items-center gap-4">
              {demoMode ? (
                <Link href="/dashboard">
                  <Button variant="primary" size="md" icon={Code2} className="shadow-lg hover-lift">
                    Demo&apos;yu Dene
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/signin">
                    <Button variant="secondary" size="md">
                      Giriş Yap
                    </Button>
                  </Link>
                  <Link href="/auth/signin">
                    <Button
                      variant="primary"
                      size="md"
                      icon={Code2}
                      className="shadow-lg hover-lift"
                    >
                      Başlayın
                    </Button>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
