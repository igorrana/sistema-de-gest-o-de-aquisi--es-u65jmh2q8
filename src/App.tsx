import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { RootProvider } from './stores/main'
import { AIProvider } from './contexts/AIContext'
import { SettingsProvider } from './contexts/SettingsContext'
import Layout from './components/Layout'
import Index from './pages/Index'
import AdminPage from './pages/admin/AdminPage'
import GerentePage from './pages/gerente/GerentePage'
import SolicitantePage from './pages/solicitante/SolicitantePage'
import CompradorPage from './pages/comprador/CompradorPage'
import NotFound from './pages/NotFound'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <RootProvider>
      <SettingsProvider>
        <AIProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner position="top-right" />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route element={<Layout />}>
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/gerente" element={<GerentePage />} />
                <Route path="/solicitante" element={<SolicitantePage />} />
                <Route path="/comprador" element={<CompradorPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AIProvider>
      </SettingsProvider>
    </RootProvider>
  </BrowserRouter>
)

export default App
