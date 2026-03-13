import { Search, UserCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { SidebarTrigger } from '@/components/ui/sidebar'
import useAuthStore from '@/stores/useAuthStore'
import useAppStore from '@/stores/useAppStore'

export function Header() {
  const { currentUser, updateViewPreference } = useAuthStore()
  const { globalSearch, setGlobalSearch } = useAppStore()

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
      <div className="flex items-center gap-4 flex-1">
        <SidebarTrigger />
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
            <p className="text-xs text-muted-foreground mt-1 capitalize">{currentUser?.role}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
