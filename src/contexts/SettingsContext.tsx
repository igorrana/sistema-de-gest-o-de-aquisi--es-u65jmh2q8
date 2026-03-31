import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase/client'

export interface SystemSettings {
  id: string
  company_name: string | null
  trade_name: string | null
  cnpj: string | null
  state_registration: string | null
  municipal_registration: string | null
  address: string | null
  holding_company: string | null
  logo_url: string | null
  theme_color: string | null
}

interface SettingsContextType {
  settings: SystemSettings | null
  updateSettings: (updates: Partial<SystemSettings>) => Promise<void>
  loading: boolean
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export const useSettings = () => {
  const context = useContext(SettingsContext)
  if (!context) throw new Error('useSettings must be used within SettingsProvider')
  return context
}

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SystemSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('system_settings').select('*').single()
      if (data) {
        setSettings(data)
        if (data.theme_color) {
          document.documentElement.style.setProperty('--primary', data.theme_color)
          document.documentElement.style.setProperty('--ring', data.theme_color)
          document.documentElement.style.setProperty('--sidebar-primary', data.theme_color)
        }
      }
      setLoading(false)
    }
    fetchSettings()
  }, [])

  const updateSettings = async (updates: Partial<SystemSettings>) => {
    if (!settings) return
    const newSettings = { ...settings, ...updates }
    setSettings(newSettings)

    if (updates.theme_color) {
      document.documentElement.style.setProperty('--primary', updates.theme_color)
      document.documentElement.style.setProperty('--ring', updates.theme_color)
      document.documentElement.style.setProperty('--sidebar-primary', updates.theme_color)
    }

    await supabase.from('system_settings').update(updates).eq('id', settings.id)
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  )
}
