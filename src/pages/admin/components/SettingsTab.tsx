import { useState, useRef } from 'react'
import { useSettings } from '@/contexts/SettingsContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Check, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

const THEME_COLORS = [
  { name: 'Azul Corporativo', value: '226 71% 40%', hex: '#1E40AF' },
  { name: 'Verde Esmeralda', value: '142 71% 29%', hex: '#166534' },
  { name: 'Vermelho Carmesim', value: '348 83% 47%', hex: '#BE123C' },
  { name: 'Roxo Profundo', value: '262 83% 58%', hex: '#7E22CE' },
  { name: 'Laranja Outono', value: '24 98% 50%', hex: '#EA580C' },
  { name: 'Cinza Ardósia', value: '215 16% 47%', hex: '#64748B' },
]

export function SettingsTab() {
  const { settings, updateSettings } = useSettings()

  const [formData, setFormData] = useState({
    company_name: settings?.company_name || '',
    trade_name: settings?.trade_name || '',
    cnpj: settings?.cnpj || '',
    state_registration: settings?.state_registration || '',
    municipal_registration: settings?.municipal_registration || '',
    address: settings?.address || '',
    holding_company: settings?.holding_company || '',
    theme_color: settings?.theme_color || '226 71% 40%',
  })

  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleColorSelect = (colorValue: string) => {
    setFormData((prev) => ({ ...prev, theme_color: colorValue }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateSettings(formData)
      toast.success('Configurações salvas com sucesso!')
    } catch (error) {
      toast.error('Erro ao salvar as configurações')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error('O logo deve ter no máximo 2MB')
      return
    }

    const reader = new FileReader()
    reader.onload = async (event) => {
      const base64 = event.target?.result as string
      try {
        await updateSettings({ logo_url: base64 })
        toast.success('Logo atualizado com sucesso!')
      } catch (error) {
        toast.error('Erro ao atualizar o logo')
      }
    }
    reader.readAsDataURL(file)
  }

  if (!settings) return <div className="p-4 text-center">Carregando configurações...</div>

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12 overflow-y-auto">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados da Empresa</CardTitle>
            <CardDescription>
              Informações fiscais e de identificação da empresa principal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Razão Social</Label>
                <Input
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trade_name">Nome Fantasia</Label>
                <Input
                  id="trade_name"
                  name="trade_name"
                  value={formData.trade_name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input id="cnpj" name="cnpj" value={formData.cnpj} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="holding_company">Empresa Controladora</Label>
                <Input
                  id="holding_company"
                  name="holding_company"
                  value={formData.holding_company}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state_registration">Inscrição Estadual</Label>
                <Input
                  id="state_registration"
                  name="state_registration"
                  value={formData.state_registration}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="municipal_registration">Inscrição Municipal</Label>
                <Input
                  id="municipal_registration"
                  name="municipal_registration"
                  value={formData.municipal_registration}
                  onChange={handleChange}
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address">Endereço Completo</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="pt-4">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Salvando...' : 'Salvar Informações'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Identidade Visual</CardTitle>
            <CardDescription>Personalize a aparência do sistema.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Logo da Empresa</Label>
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                {settings.logo_url ? (
                  <div className="relative mb-4 group">
                    <img
                      src={settings.logo_url}
                      alt="Logo"
                      className="h-16 w-auto object-contain"
                    />
                    <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center rounded transition-all">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:text-white hover:bg-white/20"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Trocar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="h-16 w-16 bg-slate-200 rounded-full flex items-center justify-center mb-4 text-slate-400">
                    <Upload className="h-8 w-8" />
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                  {settings.logo_url ? 'Alterar Logo' : 'Fazer Upload'}
                </Button>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Recomendado: PNG ou SVG com fundo transparente. Máx 2MB.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Cor Principal do Sistema</Label>
              <div className="grid grid-cols-3 gap-3">
                {THEME_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleColorSelect(color.value)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-2 rounded-md border-2 transition-all',
                      formData.theme_color === color.value
                        ? 'border-primary bg-primary/5'
                        : 'border-transparent hover:bg-slate-50',
                    )}
                    title={color.name}
                  >
                    <div
                      className="w-8 h-8 rounded-full shadow-sm flex items-center justify-center"
                      style={{ backgroundColor: color.hex }}
                    >
                      {formData.theme_color === color.value && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              {formData.theme_color !== settings.theme_color && (
                <Button className="w-full mt-2" onClick={handleSave} disabled={isSaving}>
                  Aplicar Cor
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
