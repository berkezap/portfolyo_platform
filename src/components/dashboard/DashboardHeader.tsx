import { useSession, signOut } from 'next-auth/react'
import { Github, LogOut, Folder } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Button from '@/components/ui/Button'

interface DashboardHeaderProps {
  demoMode: boolean
}

export function DashboardHeader({ demoMode }: DashboardHeaderProps) {
  const { data: session } = useSession()
  const pathname = usePathname()

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group focus:outline-none">
            <span className="bg-blue-600 rounded-lg p-2 transition-transform group-hover:scale-105 group-active:scale-95">
              <Github className="h-6 w-6 text-white" />
            </span>
            <span className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">PortfolYO</span>
          </Link>
          {/* Navigation Links */}
          <nav className="flex items-center gap-2 md:gap-4">
            <Link href="/dashboard" className="relative flex items-center gap-2 group">
              <span
                className={`px-3 py-1 rounded-md font-medium text-sm transition-all duration-150
                  ${pathname === '/dashboard'
                    ? 'text-blue-700 after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-blue-600 after:rounded-full'
                    : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'}
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400`}
              >
                <span className="hidden sm:inline">Yeni Portfolyo</span>
                <span className="sm:hidden">Yeni</span>
              </span>
            </Link>
            <Link href="/my-portfolios" className="relative flex items-center gap-2 group">
              <span
                className={`px-3 py-1 rounded-md font-medium text-sm transition-all duration-150 flex items-center
                  ${pathname === '/my-portfolios'
                    ? 'text-blue-700 after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-blue-600 after:rounded-full'
                    : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'}
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400`}
              >
                <Folder className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Portfolyolarım</span>
                <span className="sm:hidden">Listele</span>
              </span>
            </Link>
          </nav>
          <div className="flex items-center gap-5 ml-2">
            {demoMode ? (
              <>
                <span className="text-sm text-gray-600">Mock User (Demo Mode)</span>
                <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-blue-200 shadow-sm">MU</span>
                <Link href="/" className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="px-3"
                  >
                    <LogOut className="h-4 w-4" />
                    Ana Sayfa
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <span className="text-sm text-gray-700 font-medium max-w-[120px] truncate">{session?.user?.name || 'GitHub User'}</span>
                {session?.user?.image ? (
                  <img 
                    src={session.user.image} 
                    alt="User avatar" 
                    className="w-8 h-8 rounded-full border-2 border-blue-200 shadow-sm object-cover transition-all duration-200 hover:ring-2 hover:ring-blue-400 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                ) : (
                  <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-2 border-blue-200 shadow-sm transition-all duration-200 hover:ring-2 hover:ring-blue-400 hover:scale-105 hover:shadow-lg">
                    <Github className="h-4 w-4 text-white" />
                  </span>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-2 px-3"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  <LogOut className="h-4 w-4" />
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