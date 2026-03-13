import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, FileText, Settings, LogOut, Package } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar'
import useAuthStore from '@/stores/useAuthStore'

export function AppSidebar() {
  const { currentUser, logout } = useAuthStore()
  const location = useLocation()

  const getLinks = () => {
    switch (currentUser?.role) {
      case 'admin':
        return [{ href: '/admin', label: 'Painel Admin', icon: LayoutDashboard }]
      case 'gerente':
        return [{ href: '/gerente', label: 'Dashboard Gestão', icon: Users }]
      case 'solicitante':
        return [{ href: '/solicitante', label: 'Minhas Solicitações', icon: FileText }]
      case 'comprador':
        return [{ href: '/comprador', label: 'Área do Comprador', icon: Package }]
      default:
        return []
    }
  }

  return (
    <Sidebar className="border-r border-slate-200">
      <SidebarHeader className="p-4 border-b">
        <h2 className="text-xl font-bold text-primary flex items-center gap-2">
          <Package className="h-6 w-6" /> Aquisições
        </h2>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {getLinks().map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton asChild isActive={location.pathname.startsWith(link.href)}>
                <Link to={link.href}>
                  <link.icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={logout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
