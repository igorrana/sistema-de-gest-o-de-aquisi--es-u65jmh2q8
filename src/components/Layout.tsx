import { Navigate, Outlet } from 'react-router-dom'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { Header } from './Header'
import { AIAssistant } from './AIAssistant'
import useAuthStore from '@/stores/useAuthStore'

export default function Layout() {
  const { currentUser } = useAuthStore()

  if (!currentUser) {
    return <Navigate to="/" replace />
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full bg-[#F8FAFC]">
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <Header />
          <main className="flex-1 overflow-auto p-4 md:p-6 relative">
            <Outlet />
          </main>
        </div>
        <AIAssistant />
      </div>
    </SidebarProvider>
  )
}
