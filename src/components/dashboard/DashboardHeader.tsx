import { useSession, signOut } from 'next-auth/react'
import { Github, LogOut } from 'lucide-react'

interface DashboardHeaderProps {
  demoMode: boolean
}

export function DashboardHeader({ demoMode }: DashboardHeaderProps) {
  const { data: session } = useSession()

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 rounded-lg p-2">
              <Github className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">PortfolYO</span>
          </div>
          <div className="flex items-center space-x-4">
            {demoMode ? (
              <>
                <span className="text-sm text-gray-600">Mock User (Demo Mode)</span>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">MU</span>
                </div>
                <a
                  href="/"
                  className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Ana Sayfa
                </a>
              </>
            ) : (
              <>
                <span className="text-sm text-gray-600">{session?.user?.name || 'GitHub User'}</span>
                {session?.user?.image ? (
                  <img 
                    src={session.user.image} 
                    alt="User avatar" 
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Github className="h-4 w-4 text-white" />
                  </div>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Çıkış
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 