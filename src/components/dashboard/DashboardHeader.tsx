import { useSession, signOut } from 'next-auth/react'
import { Github, LogOut } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { usePortfolioList } from '@/hooks/usePortfolioList'

interface DashboardHeaderProps {
  demoMode: boolean
}

export function DashboardHeader({ demoMode }: DashboardHeaderProps) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const shouldFetchPortfolios = Boolean(session)
  const { portfolios, isLoading } = usePortfolioList(shouldFetchPortfolios)

  // Portfolyo sayısına göre link metnini belirle
  const getPortfolioLinkText = () => {
    return 'Portfolyo Yönetimi'
  }

  const getPortfolioLinkDisabled = () => {
    return !isLoading && portfolios.length === 0
  }

  return (
    <header className="glass border-b border-white/20 shadow-glass relative z-50 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/"
            className="flex items-center gap-3 group focus:outline-none hover-lift"
          >
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
              <div className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 hover-lift
                ${pathname === '/dashboard'
                  ? 'bg-blue-600/20 text-blue-700 border border-blue-200/50 shadow-sm'
                  : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50/50'}
                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400`}
              >
                <span className="hidden sm:inline">Yeni Portfolyo</span>
                <span className="sm:hidden">Yeni</span>
              </div>
            </Link>
            
            <Link 
              href={getPortfolioLinkDisabled() ? "#" : "/my-portfolios"} 
              className={`relative group ${getPortfolioLinkDisabled() ? 'cursor-not-allowed' : ''}`}
              onClick={(e) => {
                if (getPortfolioLinkDisabled()) {
                  e.preventDefault()
                  router.push('/dashboard')
                }
              }}
            >
              <div className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 hover-lift
                ${pathname === '/my-portfolios'
                  ? 'bg-blue-600/20 text-blue-700 border border-blue-200/50 shadow-sm'
                  : getPortfolioLinkDisabled()
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:text-blue-700 hover:bg-blue-50/50'}
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
                    Mock User (Demo Mode)
                  </span>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-white/20 shadow-lg hover-lift">
                  MU
                </div>
                <Link href="/">
                  <Button
                    variant="glass"
                    size="sm"
                    icon={LogOut}
                    className="bg-white/20 hover:bg-white/30 text-gray-700 border-white/30 shadow-none hover:ring-2 hover:ring-blue-400/50"
                  >
                    Ana Sayfa
                  </Button>
                </Link>
              </>
            ) : (
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
                  variant="glass"
                  size="sm"
                  icon={LogOut}
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="bg-white/20 hover:bg-white/30 text-gray-700 border-white/30 shadow-none hover:ring-2 hover:ring-blue-400/50"
                >
                  Çıkış
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 