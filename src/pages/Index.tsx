import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Package } from 'lucide-react'
import useAuthStore from '@/stores/useAuthStore'
import { toast } from 'sonner'

export default function Index() {
  const [email, setEmail] = useState('admin@empresa.com')
  const [password, setPassword] = useState('123456')
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.includes('@') || !password) {
      toast.error('Preencha os campos corretamente.')
      return
    }
    const user = login(email, password)
    if (user) {
      navigate(`/${user.role}`)
    } else {
      toast.error('Credenciais inválidas ou usuário inativo.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">
            Sistema de Gestão de Aquisições
          </CardTitle>
          <CardDescription>Insira suas credenciais para acessar o portal</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-50"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 pt-4">
            <Button type="submit" className="w-full h-11 text-base">
              Entrar
            </Button>
            <div className="text-xs text-center text-slate-500 w-full">
              <p>Mocks disponíveis: admin@, gerente@, solicitante@, comprador@ (senha: 123456)</p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
