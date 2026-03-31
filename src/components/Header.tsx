import { Search, UserCircle, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import useAuthStore from '@/stores/useAuthStore'
import useAppStore from '@/stores/useAppStore'
import { useNavigate } from 'react-router-dom'
import { Role } from '@/types'
import { useSettings } from '@/contexts/SettingsContext'

export function Header() {
  const { currentUser, updateViewPreference, switchRole } = useAuthStore()
  const { globalSearch, setGlobalSearch } = useAppStore()
  const { settings } = useSettings()
  const navigate = useNavigate()

  const handleRoleSwitch = (role: Role) => {
    switchRole(role)
    navigate(`/${role}`)
  }

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
      <div className="flex items-center gap-4 flex-1">
        <SidebarTrigger />
        <div className="flex items-center border-r pr-4 mr-2">
          {settings?.logo_url ? (
            <img
              src={settings.logo_url}
              alt="Logo"
              className="h-8 max-w-[120px] object-contain hidden sm:block"
            />
          ) : (
            <div className="font-bold text-primary hidden sm:block truncate max-w-[150px]">
              {settings?.trade_name || settings?.company_name || 'Sistema'}
            </div>
          )}
        </div>
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar solicitações (Descrição, ID...)"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            className="pl-8 bg-slate-50 border-slate-200 focus-visible:ring-primary"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Label htmlFor="view-toggle" className="text-sm text-slate-600 cursor-pointer">
            {currentUser?.view_preference === 'kanban' ? 'Kanban' : 'Tabela'}
          </Label>
          <Switch
            id="view-toggle"
            checked={currentUser?.view_preference === 'kanban'}
            onCheckedChange={(c) => updateViewPreference(c ? 'kanban' : 'table')}
          />
        </div>
        <div className="flex items-center gap-2 border-l pl-4 border-slate-200">
          <UserCircle className="h-8 w-8 text-primary" />
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-none">{currentUser?.name}</p>
            {currentUser && currentUser.roles.length > 1 ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-auto p-0 mt-1 text-xs text-muted-foreground capitalize flex items-center gap-1 hover:bg-transparent"
                  >
                    {currentUser.current_role} <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {currentUser.roles.map((role) => (
                    <DropdownMenuItem
                      key={role}
                      onClick={() => handleRoleSwitch(role)}
                      className="capitalize"
                    >
                      {role}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <p className="text-xs text-muted-foreground mt-1 capitalize">
                {currentUser?.current_role}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
