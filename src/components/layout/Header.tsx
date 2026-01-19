import { useAuth } from '@/features/auth'
import { Button } from '@/components/ui/button'
import { LogOut, User, Loader2 } from 'lucide-react'

interface HeaderProps {
  title?: string
}

export function Header({ title }: HeaderProps) {
  const { user, isAuthenticated, logout, isLoading } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  // Get display name from user account
  const displayName = user?.name || user?.username || 'User'

  return (
    <header className="flex h-14 items-center justify-between border-b px-6">
      <h1 className="text-xl font-semibold">{title || 'OKR Management'}</h1>
      
      <div className="flex items-center gap-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading...</span>
          </div>
        ) : isAuthenticated ? (
          <>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span>{displayName}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Not signed in</span>
          </div>
        )}
      </div>
    </header>
  )
}
